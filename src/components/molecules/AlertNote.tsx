import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type AlertNoteProps = {
  title: string
  children: ReactNode
  tone?: 'error' | 'warning' | 'success'
}

const TONES = {
  error: { box: 'bg-error-container/30', dot: 'bg-error', title: 'text-on-error-container' },
  warning: { box: 'bg-warning-container/60', dot: 'bg-warning', title: 'text-on-warning-container' },
  success: { box: 'bg-secondary-container/40', dot: 'bg-primary', title: 'text-on-secondary-container' },
}

/** Nota de alerta com ponto colorido, título e texto (ex.: "Atenção ao sódio"). */
export function AlertNote({ title, children, tone = 'error' }: AlertNoteProps) {
  const t = TONES[tone]
  return (
    <div className={cn('flex flex-col gap-space-xs rounded-xl p-space-md', t.box)}>
      <span className="flex items-center gap-2">
        <span className={cn('h-2 w-2 rounded-full', t.dot)} aria-hidden />
        <span className={cn('text-label-md font-bold', t.title)}>{title}</span>
      </span>
      <p className="text-body-sm text-on-surface-variant">{children}</p>
    </div>
  )
}
