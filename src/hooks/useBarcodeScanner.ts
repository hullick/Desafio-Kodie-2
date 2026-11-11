import { useCallback, useEffect, useRef, useState } from 'react'
import { getBarcodeDecoder, type DecoderKind } from '../lib/barcodeDecoder'
import { cameraFailureOf, type CameraFailure } from '../lib/cameraPermission'

/** Intervalo entre leituras (um quadro por vez; o próximo só depois de o anterior terminar). */
const SCAN_INTERVAL_MS = 120
/** Lado maior do quadro enviado ao decodificador: resolução suficiente sem pesar no celular. */
const MAX_FRAME_SIDE = 1280
/** Eventos mais recentes mantidos no painel de diagnóstico. */
const MAX_EVENTS = 12
/** Com a leitura sem resultado, registra um resumo a cada tantas tentativas (senão o log encheria). */
const SUMMARY_EVERY = 25

/** Câmera traseira em HD: barras finas precisam de pixels (em 640×480, só de muito perto). */
const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: 'environment',
  width: { ideal: 1920 },
  height: { ideal: 1080 },
}

/** Recursos da câmera fora do lib.dom do TypeScript (lanterna e foco). */
type ExtendedCapabilities = MediaTrackCapabilities & { torch?: boolean; focusMode?: string[] }

/** Diagnóstico da leitura (painel `?debug`): mostra se a câmera abriu, se há quadros e o que o leitor devolveu. */
export type ScannerDebug = {
  decoder: DecoderKind | 'carregando'
  camera: string
  /** Tamanho do vídeo da câmera e do quadro enviado ao leitor. */
  video: string
  frame: string
  attempts: number
  hits: number
  errors: number
  lastMs: number
  avgMs: number
  /** Nitidez (variância do laplaciano) da região central do quadro. Só serve para comparar (perto x longe, com e sem código): ruído do sensor também a eleva, então não há valor de corte. */
  sharpness: number
  /** Contraste (desvio padrão do brilho, 0 a 255) da região central. */
  contrast: number
  /** Miniatura do quadro que o leitor recebeu (atualiza a cada poucas tentativas). */
  preview: string | null
  /** Últimos eventos, do mais novo para o mais antigo. */
  events: string[]
}

export type UseBarcodeScannerOptions = {
  /** Liga a câmera. Só ative depois da permissão (ou quando o navegador já a concedeu). */
  enabled: boolean
  /** Código lido. Pode ser chamado de novo nos quadros seguintes até a tela parar o leitor. */
  onDetected: (text: string) => void
  onError: (failure: CameraFailure) => void
  /** Liga o diagnóstico: log no console (`[scanner]`) e o painel `debug` no retorno. */
  debug?: boolean
}

const emptyDebug = (): ScannerDebug => ({
  decoder: 'carregando',
  camera: '-',
  video: '-',
  frame: '-',
  attempts: 0,
  hits: 0,
  errors: 0,
  lastMs: 0,
  avgMs: 0,
  sharpness: 0,
  contrast: 0,
  preview: null,
  events: [],
})

/** A cada quantas tentativas o diagnóstico mede a nitidez e atualiza a miniatura. */
const QUALITY_EVERY = 8

/**
 * Nitidez e contraste da região central do quadro (onde a pessoa mira o código), em tons de cinza e
 * na resolução original: só números, a imagem não é guardada.
 */
function frameQuality(frame: HTMLCanvasElement, probe: HTMLCanvasElement): { sharpness: number; contrast: number } {
  const w = Math.max(8, Math.round(frame.width / 2))
  const h = Math.max(8, Math.round(frame.height / 2))
  probe.width = w
  probe.height = h
  const ctx = probe.getContext('2d', { willReadFrequently: true })
  if (!ctx) return { sharpness: 0, contrast: 0 }
  ctx.drawImage(frame, (frame.width - w) / 2, (frame.height - h) / 2, w, h, 0, 0, w, h)
  const { data } = ctx.getImageData(0, 0, w, h)
  const gray = new Float32Array(w * h)
  let sum = 0
  let sum2 = 0
  for (let i = 0; i < gray.length; i++) {
    const g = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
    gray[i] = g
    sum += g
    sum2 += g * g
  }
  const mean = sum / gray.length
  let lap = 0
  let lap2 = 0
  let n = 0
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const l = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w]
      lap += l
      lap2 += l * l
      n++
    }
  }
  return { sharpness: Math.round(lap2 / n - (lap / n) ** 2), contrast: Math.round(Math.sqrt(Math.max(0, sum2 / gray.length - mean * mean))) }
}

/**
 * Leitor de código de barras pela câmera traseira. Lê exatamente a parte do vídeo que aparece no
 * visor (o vídeo preenche o visor com object-cover): o que a pessoa vê é o que é lido.
 */
export function useBarcodeScanner({ enabled, onDetected, onError, debug = false }: UseBarcodeScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<MediaStreamTrack | null>(null)
  const [running, setRunning] = useState(false)
  const [torch, setTorch] = useState({ supported: false, on: false })
  const [snapshot, setSnapshot] = useState<ScannerDebug | null>(null)
  // Callbacks mais recentes, sem religar a câmera a cada render.
  const handlers = useRef({ onDetected, onError })
  useEffect(() => {
    handlers.current = { onDetected, onError }
  })

  // Diagnóstico: contadores mutáveis (sem re-render por quadro); o painel recebe uma cópia a cada 400 ms.
  const stats = useRef<ScannerDebug>(emptyDebug())
  const totalMs = useRef(0)

  /** Registra um evento no painel e no console. Sem `debug`, não faz nada. */
  const log = useCallback(
    (message: string) => {
      if (!debug) return
      const time = new Date().toLocaleTimeString('pt-BR')
      stats.current.events = [`${time} ${message}`, ...stats.current.events].slice(0, MAX_EVENTS)
      console.info(`[scanner] ${message}`)
    },
    [debug],
  )

  useEffect(() => {
    if (!enabled || !debug) return
    stats.current = emptyDebug()
    totalMs.current = 0
    const id = window.setInterval(() => setSnapshot({ ...stats.current }), 400)
    return () => {
      window.clearInterval(id)
      setSnapshot(null)
    }
  }, [enabled, debug])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let stream: MediaStream | null = null
    let timer: number | undefined
    let attached: HTMLVideoElement | null = null
    const canvas = document.createElement('canvas')
    const probe = document.createElement('canvas')

    const stop = () => {
      window.clearTimeout(timer)
      for (const t of stream?.getTracks() ?? []) t.stop()
    }

    /** Recorta a parte visível do vídeo (object-cover centraliza e corta as sobras) no canvas. */
    const grab = (video: HTMLVideoElement): boolean => {
      const { videoWidth: vw, videoHeight: vh, clientWidth: cw, clientHeight: ch } = video
      if (!vw || !vh || !cw || !ch) return false
      const cover = Math.max(cw / vw, ch / vh)
      const sw = cw / cover
      const sh = ch / cover
      const shrink = Math.min(1, MAX_FRAME_SIDE / Math.max(sw, sh))
      canvas.width = Math.round(sw * shrink)
      canvas.height = Math.round(sh * shrink)
      canvas.getContext('2d', { willReadFrequently: true })?.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, canvas.width, canvas.height)
      stats.current.video = `${vw}×${vh}`
      stats.current.frame = `${canvas.width}×${canvas.height}`
      return true
    }

    const start = async () => {
      log('pedindo a câmera')
      const decoderPromise = getBarcodeDecoder()
      const [media, { kind, decode }] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: VIDEO_CONSTRAINTS, audio: false }),
        decoderPromise,
      ])
      stream = media
      const video = videoRef.current
      if (cancelled || !video) return stop()

      const [track] = media.getVideoTracks()
      trackRef.current = track
      const caps = (track.getCapabilities?.() ?? {}) as ExtendedCapabilities
      if (caps.focusMode?.includes('continuous')) {
        track.applyConstraints({ advanced: [{ focusMode: 'continuous' } as MediaTrackConstraintSet] }).catch(() => {})
      }
      setTorch({ supported: caps.torch === true, on: false })
      stats.current.decoder = kind
      stats.current.camera = track.label || 'sem nome'
      log(`câmera aberta: ${track.label || 'sem nome'} · leitor: ${kind === 'native' ? 'nativo do navegador' : 'zxing-wasm'}`)

      video.srcObject = media
      attached = video
      await video.play()
      if (cancelled) return stop()
      setRunning(true)
      log('vídeo rodando, começando a ler')

      const tick = async () => {
        if (cancelled) return
        try {
          if (grab(video)) {
            const t0 = performance.now()
            const text = await decode(canvas)
            const ms = Math.round(performance.now() - t0)
            const s = stats.current
            s.attempts++
            s.lastMs = ms
            totalMs.current += ms
            s.avgMs = Math.round(totalMs.current / s.attempts)
            if (debug && s.attempts % QUALITY_EVERY === 1) {
              Object.assign(s, frameQuality(canvas, probe))
              probe.width = 360
              probe.height = Math.round((canvas.height / canvas.width) * 360)
              probe.getContext('2d')?.drawImage(canvas, 0, 0, probe.width, probe.height)
              s.preview = probe.toDataURL('image/jpeg', 0.6)
            }
            if (text) {
              s.hits++
              log(`LEU "${text}" (${text.length} dígitos, ${ms} ms, quadro ${s.frame})`)
              if (!cancelled) handlers.current.onDetected(text)
            } else if (s.attempts === 1 || s.attempts % SUMMARY_EVERY === 0) {
              log(`${s.attempts} quadros lidos, nenhum código (média ${s.avgMs} ms, quadro ${s.frame}, nitidez ${s.sharpness}, contraste ${s.contrast})`)
            }
          } else if (debug && stats.current.attempts === 0) {
            stats.current.video = `${video.videoWidth}×${video.videoHeight} (visor ${video.clientWidth}×${video.clientHeight}): aguardando quadro`
          }
        } catch (error) {
          stats.current.errors++
          log(`erro ao ler o quadro: ${String(error).slice(0, 120)}`)
        }
        if (!cancelled) timer = window.setTimeout(tick, SCAN_INTERVAL_MS)
      }
      void tick()
    }

    start().catch((error) => {
      stop()
      log(`falhou ao iniciar: ${String(error).slice(0, 160)}`)
      if (!cancelled) handlers.current.onError(cameraFailureOf(error))
    })

    return () => {
      cancelled = true
      stop()
      trackRef.current = null
      if (attached) attached.srcObject = null
      setRunning(false)
      setTorch({ supported: false, on: false })
    }
  }, [enabled, debug, log])

  const toggleTorch = torch.supported
    ? () => {
        const next = !torch.on
        trackRef.current
          ?.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] })
          .then(() => setTorch((t) => ({ ...t, on: next })))
          .catch(() => setTorch({ supported: false, on: false }))
      }
    : undefined

  return { videoRef, running, torchOn: torch.on, toggleTorch, debug: snapshot, log }
}
