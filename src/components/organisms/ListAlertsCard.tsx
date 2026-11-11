import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { AlertNote, type AlertNoteProps } from '../molecules/AlertNote'

export type ListAlertsCardProps = {
  alerts: Array<Pick<AlertNoteProps, 'title' | 'tone'> & { text: string }>
  onSeeSubstitutes?: () => void
}

/** Alertas da lista de favoritos (ex.: "Atenção ao sódio") com atalho para substitutos. */
export function ListAlertsCard({ alerts, onSeeSubstitutes }: ListAlertsCardProps) {
  if (alerts.length === 0) return null
  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
      <h2 className="flex items-center gap-space-xs text-headline-sm font-bold text-on-surface">
        <Icon name="notification_important" size={22} className="text-error" /> Alertas da lista
      </h2>
      {alerts.map((a) => (
        <AlertNote key={a.title} title={a.title} tone={a.tone}>
          {a.text}
        </AlertNote>
      ))}
      {onSeeSubstitutes && (
        <Button variant="subtle" icon="swap_horiz" fullWidth onClick={onSeeSubstitutes} className="text-primary">
          Ver substitutos inteligentes
        </Button>
      )}
    </section>
  )
}
