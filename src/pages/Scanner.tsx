import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/atoms/Button'
import { Icon } from '../components/atoms/Icon'
import { Toast } from '../components/molecules/Toast'
import { BarcodeScannerViewport } from '../components/organisms/BarcodeScannerViewport'
import { ManualEntryCard } from '../components/organisms/ManualEntryCard'
import { RecentScansStrip } from '../components/organisms/RecentScansStrip'
import { ScannerDebugPanel } from '../components/organisms/ScannerDebugPanel'
import { PageTemplate } from '../components/templates/PageTemplate'
import { useBarcodeScanner } from '../hooks/useBarcodeScanner'
import { SCANNED_STATE, clearRecentScans, scannedLabel, useRecentScans } from '../hooks/useRecentScans'
import { hasValidCheckDigit, normalizeBarcode } from '../lib/barcode'
import {
  acceptedBefore,
  cameraSupported,
  queryCameraPermission,
  requestCamera,
  watchCameraPermission,
  type CameraFailure,
} from '../lib/cameraPermission'

/** Tempo para o toast de confirmação aparecer antes de abrir o produto. */
const OPEN_DELAY_MS = 800

/**
 * checking → consultando a permissão · ask → explica e pede (botão) · requesting → aviso do navegador
 * aberto · scanning → câmera ligada · done → código lido, abrindo o produto.
 */
type Phase = 'checking' | 'ask' | 'requesting' | 'scanning' | 'done'

/** Bipe curto de confirmação (sem arquivo de áudio). */
function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = 1400
    gain.gain.value = 0.08
    osc.connect(gain).connect(ctx.destination)
    osc.onended = () => void ctx.close()
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    /* sem áudio: segue sem o bipe */
  }
}

/**
 * Leitura de código de barras pela câmera, com digitação manual como alternativa.
 * A permissão é do navegador (ver lib/cameraPermission): bloqueada, a tela de câmera negada explica
 * como liberar.
 */
export function Scanner() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('checking')
  const [soundOn, setSoundOn] = useState(true)
  const recent = useRecentScans()
  const [found, setFound] = useState<string>()
  const timer = useRef<number>(undefined)
  // A biblioteca pode entregar o mesmo código em quadros seguidos, antes de a tela re-renderizar.
  const handled = useRef(false)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const fail = (reason: CameraFailure) => navigate('/scanner/camera-negada', { replace: true, state: { reason } })

  const ask = async () => {
    setPhase('requesting')
    const failure = await requestCamera()
    if (failure) fail(failure)
    else setPhase('scanning')
  }

  // Ao abrir: já permitida → liga direto; bloqueada → tela de câmera negada; senão explica antes de pedir.
  useEffect(() => {
    let cancelled = false
    if (!window.isSecureContext || !cameraSupported()) {
      fail(window.isSecureContext ? 'unavailable' : 'insecure')
      return
    }
    queryCameraPermission().then((state) => {
      if (cancelled) return
      if (state === 'denied') fail('denied')
      else if (state === 'granted') setPhase('scanning')
      // O navegador não informa (ou pergunta a cada sessão), mas a pessoa já aceitou antes: pede direto.
      else if (acceptedBefore()) void ask()
      else setPhase('ask')
    })
    // Bloqueada nos ajustes com a tela aberta.
    const unwatch = watchCameraPermission((state) => state === 'denied' && fail('denied'))
    return () => {
      cancelled = true
      unwatch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir a tela
  }, [])

  const open = (code: string) => {
    setFound(code)
    // Marcado como leitura: o produto entra no histórico quando abrir (código inexistente não entra).
    timer.current = window.setTimeout(() => navigate(`/produto/${code}`, { state: SCANNED_STATE }), OPEN_DELAY_MS)
  }

  // /scanner?debug mostra o painel de diagnóstico e escreve o log "[scanner]" no console.
  const debug = new URLSearchParams(window.location.search).has('debug')
  const scanner = useBarcodeScanner({
    enabled: phase === 'scanning',
    debug,
    onDetected: (text) => {
      const code = normalizeBarcode(text)
      if (handled.current) return
      // Leitura com dígito trocado é descartada: o próximo quadro costuma vir certo.
      if (!hasValidCheckDigit(code)) {
        scanner.log(`descartado "${code}": dígito verificador não confere`)
        return
      }
      scanner.log(`aceito "${code}", abrindo o produto`)
      handled.current = true
      setPhase('done')
      if (soundOn) beep()
      // Sem toque na página (câmera já permitida, aberta direto) o Chrome bloqueia a vibração e avisa no console.
      if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(80)
      open(code)
    },
    onError: fail,
  })

  const overlay =
    phase === 'ask' ? (
      <div className="flex max-w-[320px] flex-col items-center gap-space-md rounded-2xl bg-inverse-surface/85 p-space-lg text-center text-inverse-on-surface shadow-xl backdrop-blur-md">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary">
          <Icon name="photo_camera" size={28} />
        </span>
        <div className="flex flex-col gap-space-xs">
          <h2 className="text-headline-sm font-bold">Ler pela câmera</h2>
          <p className="text-body-sm text-inverse-on-surface/80">
            O navegador vai pedir acesso à câmera. Ela só fica ligada nesta tela, e nenhuma imagem sai do aparelho.
          </p>
        </div>
        <Button size="lg" icon="photo_camera" fullWidth onClick={() => void ask()}>
          Permitir câmera
        </Button>
      </div>
    ) : phase === 'checking' || phase === 'requesting' || (phase === 'scanning' && !scanner.running) ? (
      <span className="flex items-center gap-space-xs rounded-full bg-inverse-surface/85 px-space-md py-space-sm text-label-md text-inverse-on-surface shadow-md">
        <Icon name="sync" size={18} className="animate-spin" />
        {phase === 'requesting' ? 'Aguardando permissão...' : 'Abrindo a câmera...'}
      </span>
    ) : undefined

  return (
    <PageTemplate activeNav="scan">
      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-gutter-lg lg:py-space-xl">
        <div className="lg:col-span-7">
          <BarcodeScannerViewport
            video={<video ref={scanner.videoRef} muted playsInline aria-hidden className="h-full w-full object-cover" />}
            scanning={phase === 'scanning' && scanner.running}
            statusLabel={phase === 'ask' ? 'Câmera desligada' : phase === 'done' ? 'Código lido' : undefined}
            overlay={overlay}
            onClose={() => navigate('/')}
            torchOn={scanner.torchOn}
            onToggleTorch={scanner.toggleTorch}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />
          {scanner.debug && <ScannerDebugPanel debug={scanner.debug} phase={phase} />}
        </div>
        <div className="flex min-w-0 flex-col gap-space-lg px-margin lg:col-span-5 lg:px-0">
          <ManualEntryCard onSubmit={open} sample={{ code: '7891000053508', label: 'Testar com Sucrilhos' }} />
          {recent.length > 0 && (
            <RecentScansStrip
              items={recent.map((r) => ({
                id: r.code,
                name: r.name,
                brand: r.brand,
                quantity: r.quantity,
                imageUrl: r.imageUrl,
                nutriscore: r.nutriscore,
                href: `/produto/${r.code}`,
                caption: scannedLabel(r.scannedAt),
              }))}
              onClear={clearRecentScans}
            />
          )}
        </div>
      </div>
      <Toast visible={Boolean(found)} message={`Código ${found ?? ''} lido`} status="Abrindo..." />
    </PageTemplate>
  )
}
