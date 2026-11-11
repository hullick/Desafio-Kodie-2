import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { StepItem, type StepItemProps } from '../molecules/StepItem'

export type PermissionGuideCardProps = {
  title?: string
  subtitle?: string
  steps: Array<Omit<StepItemProps, 'step'>>
  onOpenSettings?: () => void
  onRetry: () => void
}

/** Guia "Como habilitar em 3 passos" com ações de abrir configurações e tentar de novo. */
export function PermissionGuideCard({
  title = 'Como habilitar em 3 passos',
  subtitle = 'Procedimento rápido e sem complicações',
  steps,
  onOpenSettings,
  onRetry,
}: PermissionGuideCardProps) {
  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center gap-space-sm">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="toggle_on" size={20} />
        </span>
        <div>
          <h2 className="text-label-lg text-on-surface">{title}</h2>
          <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      <ol className="grid grid-cols-1 gap-space-sm">
        {steps.map((s, i) => (
          <StepItem key={i} step={i + 1} {...s} />
        ))}
      </ol>
      <div className="flex flex-col gap-space-xs pt-space-xs">
        {onOpenSettings && (
          <Button size="lg" icon="settings" fullWidth onClick={onOpenSettings}>
            Abrir configurações do dispositivo
          </Button>
        )}
        <Button variant="subtle" size="lg" icon="replay" fullWidth onClick={onRetry} className="bg-surface-container-high text-primary">
          Tentar novamente
        </Button>
      </div>
    </section>
  )
}
