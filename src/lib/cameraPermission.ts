/**
 * Permissão da câmera.
 *
 * A decisão de permitir ou bloquear é guardada pelo próprio navegador, por site: o app não a
 * armazena (uma cópia no localStorage ficaria errada assim que a pessoa mudasse nos ajustes).
 * Quando o navegador informa o estado (Permissions API), ele é a fonte da verdade.
 *
 * O único dado guardado é uma dica: "a pessoa já tocou em Permitir aqui". Ela só serve para
 * pular a tela de explicação nos navegadores que não informam o estado (ou que voltam a perguntar
 * a cada sessão, como o Safari do iPhone): a câmera é pedida direto e, se o navegador recusar,
 * a dica é apagada.
 */

export type CameraPermissionState = 'granted' | 'prompt' | 'denied' | 'unknown'

/** Por que a câmera não abriu. */
export type CameraFailure =
  /** A pessoa ou o navegador bloqueou o acesso. */
  | 'denied'
  /** Aparelho sem câmera, câmera em uso por outro app ou navegador sem suporte. */
  | 'unavailable'
  /** Página fora de HTTPS: o navegador nem oferece a câmera. */
  | 'insecure'

const HINT_KEY = 'scanbite.camera-accepted'

export function cameraSupported(): boolean {
  return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia)
}

/** Estado informado pelo navegador; `unknown` quando ele não sabe dizer (ex.: Firefox antigo). */
export async function queryCameraPermission(): Promise<CameraPermissionState> {
  try {
    const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
    return status.state
  } catch {
    return 'unknown'
  }
}

/** Avisa quando a permissão muda com a tela aberta (ex.: bloqueada nos ajustes). Devolve o cancelamento. */
export function watchCameraPermission(onChange: (state: CameraPermissionState) => void): () => void {
  let status: PermissionStatus | undefined
  let cancelled = false
  const handler = () => status && onChange(status.state)
  navigator.permissions
    ?.query({ name: 'camera' as PermissionName })
    .then((s) => {
      if (cancelled) return
      status = s
      s.addEventListener('change', handler)
    })
    .catch(() => {})
  return () => {
    cancelled = true
    status?.removeEventListener('change', handler)
  }
}

/** Classifica o erro do getUserMedia (ou da biblioteca de leitura, que o devolve como texto). */
export function cameraFailureOf(error: unknown): CameraFailure {
  if (!window.isSecureContext) return 'insecure'
  const text = error instanceof DOMException ? error.name : String(error)
  return /NotAllowed|Permission|SecurityError/i.test(text) ? 'denied' : 'unavailable'
}

/**
 * Pede a câmera traseira ao navegador (abre o aviso de permissão, se for o caso) e solta em seguida:
 * quem filma de fato é o leitor. Separado da leitura para saber com certeza o motivo de uma falha.
 */
export async function requestCamera(): Promise<CameraFailure | null> {
  if (!window.isSecureContext) return 'insecure'
  if (!cameraSupported()) return 'unavailable'
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    for (const track of stream.getTracks()) track.stop()
    rememberAccepted(true)
    return null
  } catch (error) {
    const failure = cameraFailureOf(error)
    if (failure === 'denied') rememberAccepted(false)
    return failure
  }
}

/** A pessoa já aceitou a câmera neste aparelho (dica, não a permissão em si). */
export function acceptedBefore(): boolean {
  try {
    return localStorage.getItem(HINT_KEY) === '1'
  } catch {
    return false
  }
}

function rememberAccepted(accepted: boolean) {
  try {
    if (accepted) localStorage.setItem(HINT_KEY, '1')
    else localStorage.removeItem(HINT_KEY)
  } catch {
    /* sem armazenamento: a explicação aparece de novo, sem prejuízo */
  }
}
