import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

export type ContributeCalloutProps = {
  message?: string
  actionLabel?: string
  onAction: () => void
}

/** Convite curto para completar dados do produto na Open Food Facts. */
export function ContributeCallout({
  message = 'Ajude a comunidade enviando o verso do rótulo.',
  actionLabel = 'Contribuir',
  onAction,
}: ContributeCalloutProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-high/60 p-3">
      <div className="flex items-center gap-2">
        <Icon name="add_a_photo" size={20} className="text-primary" />
        <p className="text-body-sm leading-tight text-on-surface">{message}</p>
      </div>
      <Button variant="surface" size="sm" onClick={onAction} className="rounded-lg font-bold">
        {actionLabel}
      </Button>
    </div>
  )
}
