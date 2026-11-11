import { cn } from '../../lib/cn'

export type ServiceState = 'operational' | 'maintenance' | 'offline'

export type SystemStatusRowProps = {
  name: string
  description?: string
  state: ServiceState
}

const STATE: Record<ServiceState, { dot: string; badge: string; label: string }> = {
  operational: { dot: 'bg-primary', badge: 'bg-primary-fixed/40 text-primary', label: 'Operando' },
  maintenance: { dot: 'bg-secondary animate-pulse', badge: 'bg-secondary-fixed/50 text-on-secondary-container', label: 'Manutenção' },
  offline: { dot: 'bg-error', badge: 'bg-error-container text-on-error-container', label: 'Fora do ar' },
}

/** Linha do monitor de serviços: nome, descrição e selo Operando / Manutenção / Fora do ar. */
export function SystemStatusRow({ name, description, state }: SystemStatusRowProps) {
  const s = STATE[state]
  return (
    <li className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-low p-space-sm">
      <span className="flex items-center gap-3">
        <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', s.dot)} aria-hidden />
        <span className="flex flex-col">
          <span className="text-label-md font-semibold text-on-surface">{name}</span>
          {description && <span className="text-body-sm text-on-surface-variant">{description}</span>}
        </span>
      </span>
      <span className={cn('rounded px-2 py-0.5 text-label-sm font-semibold', s.badge)}>{s.label}</span>
    </li>
  )
}
