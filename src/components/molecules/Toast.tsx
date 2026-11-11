import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type ToastProps = {
  visible: boolean
  message: string
  icon?: string
  /** Rótulo à direita (ex.: "Abrindo..."). */
  status?: string
}

/** Aviso flutuante na base da tela (ex.: "Código detectado: 789..."). */
export function Toast({ visible, message, icon = 'check_circle', status }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-none fixed inset-x-gutter bottom-6 z-50 transition-all duration-300 lg:left-1/2 lg:w-[420px] lg:-translate-x-1/2',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
      )}
    >
      <div className="flex items-center justify-between gap-space-sm rounded-xl bg-inverse-surface px-space-md py-space-sm text-inverse-on-surface shadow-2xl">
        <span className="flex min-w-0 items-center gap-space-xs">
          <Icon name={icon} size={20} className="text-tertiary-fixed-dim" />
          <span className="truncate text-label-md">{message}</span>
        </span>
        {status && <span className="text-label-sm font-bold tracking-wider text-tertiary-fixed-dim uppercase">{status}</span>}
      </div>
    </div>
  )
}
