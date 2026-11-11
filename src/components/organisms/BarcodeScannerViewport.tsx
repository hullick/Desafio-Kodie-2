import type { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'
import { ScanFrame } from '../atoms/ScanFrame'

export type BarcodeScannerViewportProps = {
  /** Vídeo da câmera (<video> que preenche o visor). Sem ele, mostra só o fundo escuro. */
  video?: ReactNode
  scanning?: boolean
  /** Conteúdo no centro no lugar da moldura (ex.: pedido de permissão, "Abrindo a câmera..."). */
  overlay?: ReactNode
  /** Texto do selo de status no topo. Padrão: conforme `scanning`. */
  statusLabel?: string
  onClose: () => void
  torchOn?: boolean
  /** Sem `onToggleTorch`, o botão de lanterna não aparece (aparelho sem suporte). */
  onToggleTorch?: () => void
  soundOn?: boolean
  onToggleSound?: () => void
  hint?: string
}

const ROUND_BTN =
  'flex h-11 w-11 items-center justify-center rounded-full bg-inverse-surface/70 text-inverse-on-surface shadow-md backdrop-blur-md transition-all active:scale-95'

/** Visor da câmera com moldura de leitura, lanterna, status de foco e dica. */
export function BarcodeScannerViewport({
  video,
  scanning = true,
  overlay,
  statusLabel,
  onClose,
  torchOn = false,
  onToggleTorch,
  soundOn = true,
  onToggleSound,
  hint = 'Aponte para o código de barras de qualquer alimento',
}: BarcodeScannerViewportProps) {
  return (
    <section
      aria-label="Leitor de código de barras"
      className="relative flex h-[520px] w-full flex-col justify-between overflow-hidden rounded-b-xl bg-inverse-surface shadow-xl lg:rounded-2xl"
    >
      {video && <div className="absolute inset-0">{video}</div>}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-inverse-surface/80 via-inverse-surface/30 to-inverse-surface/90" />

      <div className="relative z-20 flex items-center justify-between px-gutter pt-space-md">
        <button type="button" aria-label="Fechar leitor" onClick={onClose} className={ROUND_BTN}>
          <Icon name="close" size={22} />
        </button>
        <span className="flex items-center gap-space-xs rounded-full bg-inverse-surface/75 px-space-md py-1 text-inverse-on-surface backdrop-blur-md">
          <span className={scanning ? 'h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed-dim' : 'h-2 w-2 rounded-full bg-outline'} aria-hidden />
          <span className="text-label-sm tracking-wide uppercase">{statusLabel ?? (scanning ? 'Foco automático ativo' : 'Câmera pausada')}</span>
        </span>
        {onToggleTorch ? (
          <button type="button" aria-label={torchOn ? 'Desligar lanterna' : 'Ligar lanterna'} aria-pressed={torchOn} onClick={onToggleTorch} className={ROUND_BTN}>
            <Icon name={torchOn ? 'flashlight_off' : 'flashlight_on'} size={22} />
          </button>
        ) : (
          <span className="w-11" />
        )}
      </div>

      {!overlay && (
        <div className="relative z-20 mt-space-sm flex justify-center px-gutter">
          <p className="flex max-w-[320px] items-center gap-space-xs rounded-full bg-inverse-surface/85 px-space-md py-space-xs text-center text-label-md text-inverse-on-surface shadow-md backdrop-blur-md">
            <Icon name="center_focus_strong" size={18} className="text-tertiary-fixed-dim" />
            <span className="truncate">{hint}</span>
          </p>
        </div>
      )}

      <div className="relative z-10 flex flex-1 items-center justify-center px-gutter-md">{overlay ?? <ScanFrame scanning={scanning} />}</div>

      <div className="relative z-20 flex items-center justify-between px-gutter pb-space-md text-inverse-on-surface/80">
        <span className="flex items-center gap-space-xs text-body-sm">
          <Icon name="qr_code_scanner" size={18} className="text-tertiary-fixed-dim" /> Reconhecimento EAN-13 / UPC
        </span>
        {onToggleSound && (
          <button type="button" onClick={onToggleSound} aria-pressed={soundOn} className="flex items-center gap-1 text-label-sm text-inverse-on-surface underline hover:text-white">
            <Icon name={soundOn ? 'volume_up' : 'volume_off'} size={16} /> {soundOn ? 'Som ativo' : 'Som desligado'}
          </button>
        )}
      </div>
    </section>
  )
}
