import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type CollapsibleProps = {
  title: string
  icon?: string
  tone?: 'neutral' | 'error'
  defaultOpen?: boolean
  children: ReactNode
}

/** Seção expansível (ingredientes, alérgenos). */
export function Collapsible({ title, icon, tone = 'neutral', defaultOpen = true, children }: CollapsibleProps) {
  const error = tone === 'error'
  return (
    <details className={cn('group rounded-xl transition-all', error ? 'bg-error-container/20' : 'bg-surface-container-low')} open={defaultOpen}>
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between p-space-md text-headline-sm select-none [&::-webkit-details-marker]:hidden',
          error ? 'text-error' : 'text-on-surface',
        )}
      >
        <span className="flex items-center gap-2">
          {icon && <Icon name={icon} size={22} className={error ? 'text-error' : 'text-primary'} />}
          {title}
        </span>
        <Icon name="expand_more" className={cn('transition-transform group-open:rotate-180', error ? 'text-error' : 'text-outline')} />
      </summary>
      <div className="px-space-md pb-space-md text-body-md text-on-surface-variant">{children}</div>
    </details>
  )
}
