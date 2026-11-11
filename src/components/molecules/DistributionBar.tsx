import { cn } from '../../lib/cn'

export type DistributionSegment = {
  label: string
  /** Quantidade de itens no segmento. */
  count: number
  /** Classe de fundo (ex.: "bg-nutri-a"). */
  colorClass: string
}

export type DistributionBarProps = {
  title: string
  segments: DistributionSegment[]
  /** Texto à direita do título (ex.: "Excelente", "12 itens"). */
  summary?: string
}

/** Barra empilhada com legenda (ex.: distribuição de Nutri-Score dos favoritos). */
export function DistributionBar({ title, segments, summary }: DistributionBarProps) {
  const total = segments.reduce((sum, s) => sum + s.count, 0)
  const visible = segments.filter((s) => s.count > 0)
  if (total === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
        <span>{title}</span>
        {summary && <span className="font-bold text-primary">{summary}</span>}
      </div>
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-surface-container" role="img" aria-label={visible.map((s) => `${s.label}: ${s.count}`).join(', ')}>
        {visible.map((s) => (
          <div key={s.label} className={cn('h-full transition-all duration-500', s.colorClass)} style={{ width: `${(s.count / total) * 100}%` }} title={`${s.label}: ${Math.round((s.count / total) * 100)}%`} />
        ))}
      </div>
      <ul className="flex flex-wrap items-center gap-x-space-md gap-y-1 text-[11px] text-on-surface-variant">
        {visible.map((s) => (
          <li key={s.label} className="flex items-center gap-1">
            <span className={cn('h-2 w-2 rounded-full', s.colorClass)} aria-hidden />
            {s.label} ({s.count} {s.count === 1 ? 'item' : 'itens'})
          </li>
        ))}
      </ul>
    </div>
  )
}
