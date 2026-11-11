import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { ComparedProduct } from '../../types/comparison'
import { Icon } from '../atoms/Icon'
import { StatusPill } from '../atoms/StatusPill'
import { NutrientMetricBar, type NutrientMetricBarProps } from '../molecules/NutrientMetricBar'

export type NutrientDuelBlock = {
  title: string
  icon: string
  /** Tom do ícone do bloco. */
  iconTone?: 'error' | 'primary' | 'neutral'
  /** Critério exibido no desktop (ex.: "Critério de risco metabólico"). */
  criterion?: string
  /** Ex.: "Vencedor: Aveia (0,8g)". */
  winner?: string
  /** Uma barra por produto, na mesma ordem dos produtos. */
  bars: NutrientMetricBarProps[]
  footnote?: ReactNode
}

export type NutrientDuelSectionProps = {
  blocks: NutrientDuelBlock[]
  /** Produtos para a legenda (desktop). */
  products?: Pick<ComparedProduct, 'id' | 'shortName' | 'rank'>[]
  /** Alternador "Gráficos / Tabela" (SegmentedControl). */
  viewToggle?: ReactNode
  basis?: string
}

const ICON_TONE = {
  error: 'bg-error-container text-error',
  primary: 'bg-secondary-container text-primary',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

/** Duelo nutricional por nutriente: blocos com barras comparativas e vencedor. */
export function NutrientDuelSection({ blocks, products = [], viewToggle, basis = '100g' }: NutrientDuelSectionProps) {
  return (
    <section className="flex flex-col gap-space-sm lg:rounded-2xl lg:bg-surface-container-lowest lg:p-space-xl lg:shadow-sm">
      <div className="hidden flex-col justify-between gap-2 pb-space-lg sm:flex-row sm:items-center lg:flex">
        <div>
          <span className="text-label-sm font-bold tracking-widest text-primary uppercase">Análise direta</span>
          <h2 className="mt-0.5 text-headline-md font-extrabold text-on-surface">Duelo Nutricional por {basis} de alimento</h2>
        </div>
        <div className="flex flex-wrap items-center gap-space-md">
          {viewToggle}
          {products.length > 0 && (
            <ul className="flex items-center gap-space-md border-l border-surface-container-high pl-2 text-label-md text-outline">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-1.5">
                  <span className={cn('h-3 w-3 rounded-full', p.rank === 1 ? 'bg-primary' : 'bg-outline')} aria-hidden />
                  <span className={p.rank === 1 ? 'font-bold text-primary' : undefined}>{p.shortName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="lg:hidden">{viewToggle}</div>

      <div className="flex flex-col gap-space-sm lg:gap-space-xl">
        {blocks.map((b) => (
          <div key={b.title} className="flex flex-col gap-2.5 rounded-xl bg-surface-container-lowest p-3.5 shadow-sm lg:bg-surface-container-low/40 lg:p-space-md lg:shadow-none">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className={cn('flex h-7 w-7 items-center justify-center rounded-full', ICON_TONE[b.iconTone ?? 'neutral'])}>
                  <Icon name={b.icon} size={16} />
                </span>
                <h3 className="text-label-lg font-bold text-on-surface lg:text-headline-sm">{b.title}</h3>
                {b.criterion && <span className="hidden text-body-sm text-outline lg:inline">({b.criterion})</span>}
              </div>
              {b.winner && (
                <StatusPill tone="success" shape="pill" icon="check" className="text-[10px] font-bold lg:text-label-sm">
                  {b.winner}
                </StatusPill>
              )}
            </div>
            <div className="grid gap-2 pt-1 lg:gap-gutter-md" style={{ gridTemplateColumns: `repeat(${Math.max(b.bars.length, 1)}, minmax(0, 1fr))` }}>
              {b.bars.map((bar) => (
                <NutrientMetricBar key={bar.label} {...bar} />
              ))}
            </div>
            {b.footnote && (
              <div className="mt-1 flex items-start gap-1.5 rounded-lg bg-surface-container-low p-2 text-[11px] leading-snug text-on-surface-variant lg:text-body-sm">
                <Icon name="verified" size={15} className="mt-0.5 text-secondary" />
                <p>{b.footnote}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
