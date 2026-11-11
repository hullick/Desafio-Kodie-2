import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { StatusPill, type StatusTone } from '../atoms/StatusPill'

export type HeroAction = {
  label: string
  icon?: string
  onClick?: () => void
  href?: string
  /** Mostra o ícone girando (ex.: "Tentando reconectar..."). */
  loading?: boolean
}

export type ErrorHeroBlockProps = {
  icon: string
  /** Ícone pequeno no canto do círculo (ex.: "warning", "lock_reset"). */
  badgeIcon?: string
  badgeTone?: 'error' | 'primary'
  status?: { label: string; tone?: StatusTone; pulse?: boolean }
  title: string
  description: ReactNode
  primaryAction?: HeroAction
  secondaryAction?: HeroAction
  /** Conteúdo extra abaixo das ações. */
  children?: ReactNode
}

function ActionButton({ action, variant }: { action: HeroAction; variant: 'primary' | 'surface' }) {
  const common = {
    variant,
    size: 'lg' as const,
    fullWidth: true,
    className: cn('h-[52px] shadow-sm', action.loading && '[&>span:first-child]:animate-spin'),
    icon: action.icon,
  }
  return action.href ? (
    <Button {...common} href={action.href}>
      {action.label}
    </Button>
  ) : (
    <Button {...common} onClick={action.onClick} disabled={action.loading} aria-busy={action.loading}>
      {action.label}
    </Button>
  )
}

/** Bloco central de erro/estado: ícone em círculo, selo de status, título empático, descrição e duas ações. */
export function ErrorHeroBlock({
  icon,
  badgeIcon,
  badgeTone = 'error',
  status,
  title,
  description,
  primaryAction,
  secondaryAction,
  children,
}: ErrorHeroBlockProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center gap-space-lg text-center">
      <div className="flex flex-col items-center">
        <div className="relative mb-space-md flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-high shadow-sm">
          <span className="absolute inset-0 rounded-full bg-secondary-container/40 blur-xl" aria-hidden />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-lowest text-primary">
            <Icon name={icon} size={36} />
          </span>
          {badgeIcon && (
            <span
              className={cn(
                'absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md',
                badgeTone === 'error' ? 'bg-surface-container-lowest text-error' : 'bg-primary-container text-on-primary-container',
              )}
            >
              <Icon name={badgeIcon} size={18} filled />
            </span>
          )}
        </div>
        {status && (
          <StatusPill tone={status.tone ?? 'neutral'} shape="pill" dot pulse={status.pulse} uppercase className="mb-space-sm px-3 py-1 shadow-sm">
            {status.label}
          </StatusPill>
        )}
        <h1 className="mb-space-xs text-headline-lg font-bold tracking-tight text-on-surface">{title}</h1>
        <p className="max-w-sm text-body-md text-on-surface-variant">{description}</p>
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex w-full flex-col gap-space-sm">
          {primaryAction && <ActionButton action={primaryAction} variant="primary" />}
          {secondaryAction && <ActionButton action={secondaryAction} variant="surface" />}
        </div>
      )}
      {children}
    </section>
  )
}
