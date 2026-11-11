import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

export type PageHeadingProps = {
  title: string
  /** Texto de apoio (ex.: "4 produtos em destaque · Atualizado hoje"). */
  subtitle?: ReactNode
  /** Descrição longa exibida só no desktop. */
  description?: string
  breadcrumbs?: Crumb[]
  /** Ações ou destaque à direita. */
  aside?: ReactNode
}

/** Título de página com trilha (desktop), subtítulo e área de ações. */
export function PageHeading({ title, subtitle, description, breadcrumbs, aside }: PageHeadingProps) {
  return (
    <header className="flex flex-col gap-space-sm">
      {breadcrumbs && (
        <div className="hidden lg:block">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}
      <div className="flex items-center justify-between gap-space-md lg:items-end">
        <div className="min-w-0">
          <h1 className="text-headline-lg text-on-surface lg:text-display-lg lg:tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 flex items-center gap-space-xs text-body-sm text-on-surface-variant">{subtitle}</p>}
          {description && <p className="mt-1 hidden max-w-2xl text-body-lg text-on-surface-variant lg:block">{description}</p>}
        </div>
        {aside}
      </div>
    </header>
  )
}
