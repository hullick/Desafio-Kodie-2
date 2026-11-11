import { Icon } from '../atoms/Icon'
import { SystemStatusRow, type SystemStatusRowProps } from '../molecules/SystemStatusRow'

export type ServiceMonitorCardProps = {
  services: SystemStatusRowProps[]
  /** Quando foi a última checagem (ex.: "Agora"). */
  checkedAt?: string
  /** Dica exibida abaixo da lista. */
  tip?: string
}

/** Monitor de serviços: estado de cada serviço (API, banco de dados) e dica de contingência. */
export function ServiceMonitorCard({ services, checkedAt = 'Agora', tip }: ServiceMonitorCardProps) {
  return (
    <section className="w-full rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="mb-space-sm flex items-center justify-between rounded-lg bg-surface-container-low/50 px-space-sm py-2">
        <h2 className="flex items-center gap-space-xs text-label-md font-semibold text-on-surface">
          <Icon name="dns" size={18} className="text-on-surface-variant" /> Monitor de serviços
        </h2>
        <span className="text-label-sm font-medium text-outline">{checkedAt}</span>
      </div>
      <ul className="flex flex-col gap-space-sm">
        {services.map((s) => (
          <SystemStatusRow key={s.name} {...s} />
        ))}
      </ul>
      {tip && (
        <p className="mt-space-md flex items-start gap-space-xs rounded-xl bg-surface-container-high/40 p-space-sm text-body-sm leading-tight text-on-surface-variant">
          <Icon name="lightbulb" size={18} className="mt-0.5 shrink-0 text-secondary" />
          {tip}
        </p>
      )}
    </section>
  )
}
