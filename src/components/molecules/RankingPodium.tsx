import { cn } from '../../lib/cn'
import type { NovaGroup, NutriGrade } from '../../types/nutrition'
import { BadgeNova } from '../atoms/BadgeNova'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'

export type PodiumEntry = { name: string; nutriscore?: NutriGrade | null; nova?: NovaGroup | null }

/** Uma coluna por produto (classes fixas para o Tailwind encontrar). */
const COLUMNS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-3 sm:grid-cols-5',
}

/**
 * Classificação da comparação, já ordenada (1º primeiro). Todas as posições aparecem, com a mesma
 * altura; a cor vem dos selos de Nutri-Score e NOVA, não da posição.
 */
export function RankingPodium({ entries }: { entries: PodiumEntry[] }) {
  return (
    <ol className={cn('grid gap-space-xs lg:gap-space-sm', COLUMNS[entries.length] ?? COLUMNS[5])}>
      {entries.map((e, i) => {
        const first = i === 0
        return (
          <li
            key={`${e.name}-${i}`}
            className={cn(
              'flex min-w-0 flex-col items-center gap-1.5 rounded-xl p-space-sm text-center',
              // O card do veredito é claro no mobile e cinza no desktop: o fundo acompanha para contrastar.
              first ? 'bg-secondary-container/40 ring-1 ring-primary/30' : 'bg-surface-container-low lg:bg-surface-container-lowest',
            )}
          >
            <span
              className={cn(
                'text-[10px] font-bold tracking-wide uppercase lg:text-[11px]',
                first ? 'text-primary' : 'text-on-surface-variant',
              )}
            >
              {i + 1}º lugar
            </span>
            <span
              className={cn(
                'line-clamp-2 text-label-md break-words text-on-surface lg:text-label-lg',
                first ? 'font-extrabold' : 'font-semibold',
              )}
              title={e.name}
            >
              {e.name}
            </span>
            {/* Selos no pé do card: alinhados entre colunas mesmo com nomes de 1 ou 2 linhas. */}
            <span className="mt-auto flex items-center gap-1">
              <BadgeNutriScore grade={e.nutriscore} variant="circle" />
              {e.nova && <BadgeNova group={e.nova} variant="square" />}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
