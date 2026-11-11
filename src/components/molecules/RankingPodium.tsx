import { cn } from '../../lib/cn'

export type PodiumEntry = { name: string; score?: string }

const PLACE_TEXT = ['text-primary', 'text-secondary', 'text-error']

/** Pódio de notas: 1º, 2º e 3º lugares. */
export function RankingPodium({ entries }: { entries: PodiumEntry[] }) {
  const top = entries.slice(0, 3)
  return (
    <ol className="grid grid-cols-3 gap-1.5 rounded-xl bg-surface-container-low p-2 lg:max-w-xl lg:gap-space-sm lg:bg-surface-container-lowest lg:p-space-md lg:shadow-sm">
      {top.map((e, i) => (
        <li
          key={e.name}
          className={cn('flex flex-col items-center rounded-lg p-1 text-center lg:p-2', i === 0 ? 'lg:border lg:border-primary/20 lg:bg-secondary-container/30' : 'lg:bg-surface-container-low')}
        >
          <span className={cn('text-[10px] font-bold tracking-wide uppercase lg:text-[11px]', PLACE_TEXT[i])}>{i + 1}º Lugar</span>
          <span className={cn('text-[11px] text-on-surface lg:text-headline-sm', i === 0 ? 'font-extrabold' : 'font-semibold')}>{e.name}</span>
          {e.score && <span className={cn('text-[9px] font-semibold lg:text-label-sm', PLACE_TEXT[i])}>Nota {e.score}</span>}
        </li>
      ))}
    </ol>
  )
}
