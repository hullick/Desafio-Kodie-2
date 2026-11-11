import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { ComparedProduct, CompareTone } from '../../types/comparison'
import { Icon } from '../atoms/Icon'

export type ComparisonCell = { value: ReactNode; tone?: CompareTone }
export type ComparisonRow = { label: string; cells: ComparisonCell[] }
export type ComparisonGroup = { title: string; rows: ComparisonRow[] }

export type ComparisonFullTableProps = {
  products: Pick<ComparedProduct, 'id' | 'shortName' | 'rank'>[]
  groups: ComparisonGroup[]
  basis?: string
}

/** Tabela paramétrica agrupada por blocos (Classificações, Carboidratos, Fibras...), com rolagem horizontal. */
export function ComparisonFullTable({ products, groups, basis = '100g' }: ComparisonFullTableProps) {
  const bestCol = products.findIndex((p) => p.rank === 1)
  return (
    <section id="tabela-completa" className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm lg:p-space-xl">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon name="table_view" size={16} />
          </span>
          <div>
            <h2 className="text-label-lg leading-tight font-bold text-on-surface lg:text-headline-md lg:font-extrabold">Tabela Comparativa Completa</h2>
            <span className="text-[11px] text-on-surface-variant lg:hidden">Arraste para o lado para ver todos os parâmetros</span>
          </div>
        </div>
        <span className="rounded-md bg-surface-container px-2 py-0.5 text-[10px] font-bold text-on-surface-variant">Por {basis}</span>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-outline-variant/40">
        <table className="w-full min-w-[460px] border-collapse text-left text-[11px] lg:text-body-md">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant">
              <th scope="col" className="sticky left-0 z-10 w-[140px] bg-surface-container-low p-2.5 font-bold">
                Parâmetro
              </th>
              {products.map((p, i) => (
                <th key={p.id} scope="col" className={cn('p-2.5 text-center font-bold', i === bestCol && 'bg-secondary-container/40 text-primary')}>
                  {p.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {groups.map((g, gi) => (
              <GroupRows key={g.title} group={g} index={gi} bestCol={bestCol} colSpan={products.length + 1} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function GroupRows({ group, index, bestCol, colSpan }: { group: ComparisonGroup; index: number; bestCol: number; colSpan: number }) {
  return (
    <>
      <tr className="bg-surface-container-highest/40 text-[10px] font-bold text-secondary uppercase lg:text-label-sm">
        <th scope="colgroup" colSpan={colSpan} className="sticky left-0 bg-surface-container-highest/60 p-1.5 px-2.5 text-left">
          {index + 1}. {group.title}
        </th>
      </tr>
      {group.rows.map((r) => (
        <tr key={r.label}>
          <th scope="row" className="sticky left-0 bg-surface-container-lowest p-2 text-left font-medium text-on-surface">
            {r.label}
          </th>
          {r.cells.map((c, ci) => (
            <td
              key={ci}
              className={cn(
                'p-2 text-center',
                ci === bestCol && 'bg-secondary-container/20',
                c.tone === 'best' && 'font-bold text-primary',
                c.tone === 'worst' && 'bg-error-container/30 font-extrabold text-error',
              )}
            >
              <span className="inline-flex items-center justify-center gap-0.5">
                {c.tone === 'best' && <Icon name="check" size={13} />}
                {c.value}
              </span>
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
