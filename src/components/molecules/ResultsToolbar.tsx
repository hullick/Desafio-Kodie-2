import type { ReactNode } from 'react'
import { StatusPill } from '../atoms/StatusPill'

export type ResultsToolbarProps = {
  total: number
  compareCount: number
  compareMax: number
  /** Controle de ordenação (normalmente SortControl segmentado). */
  sort?: ReactNode
}

/** Barra acima dos resultados: total, contador do comparador e ordenação. */
export function ResultsToolbar({ total, compareCount, compareMax, sort }: ResultsToolbarProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm md:flex-row md:items-center">
      {/* O resumo é quem cede espaço (o selo do comparador quebra de linha); o ordenador mantém a largura. */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 md:flex-1">
        <span className="text-headline-sm text-on-surface">
          {total} {total === 1 ? 'produto analisado' : 'produtos analisados'}
        </span>
        {compareCount > 0 && (
          <>
            <span className="hidden text-outline sm:inline-block" aria-hidden>
              •
            </span>
            <StatusPill tone="success" shape="pill" icon="compare_arrows" className="bg-secondary-container/60">
              {compareCount}/{compareMax} selecionados para comparar
            </StatusPill>
          </>
        )}
      </div>
      {sort && <div className="min-w-0 md:shrink-0">{sort}</div>}
    </div>
  )
}
