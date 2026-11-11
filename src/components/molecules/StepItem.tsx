import type { ReactNode } from 'react'

export type StepItemProps = {
  step: number
  title: ReactNode
  description?: ReactNode
}

/** Passo numerado de tutorial (ex.: como liberar a câmera). */
export function StepItem({ step, title, description }: StepItemProps) {
  return (
    <li className="flex items-start gap-space-sm rounded-xl bg-surface-container-low p-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-label-sm text-on-primary" aria-hidden>
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface">{title}</p>
        {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
      </div>
    </li>
  )
}
