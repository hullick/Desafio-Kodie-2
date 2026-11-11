import type { ReactNode } from 'react'

/** Parágrafo de texto corrido das páginas institucionais. */
export function Paragraph({ children }: { children: ReactNode }) {
  return <p className="text-body-md leading-relaxed text-on-surface-variant">{children}</p>
}

/** Lista com marcadores das páginas institucionais. */
export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-space-xs pl-5 text-body-md leading-relaxed text-on-surface-variant marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
