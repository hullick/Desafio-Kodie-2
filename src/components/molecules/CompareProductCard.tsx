import { cn } from '../../lib/cn'
import type { ComparedProduct } from '../../types/comparison'
import { BadgeNova } from '../atoms/BadgeNova'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Icon } from '../atoms/Icon'
import { ProductThumb } from '../atoms/ProductThumb'

export type CompareProductCardProps = {
  product: ComparedProduct
  onSwap?: () => void
  onRemove: () => void
}

function SmallAction({ icon, label, onClick, danger }: { icon: string; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors',
        danger ? 'hover:bg-error-container hover:text-error' : 'hover:bg-surface-variant',
      )}
    >
      <Icon name={icon} size={14} />
    </button>
  )
}

/** Card de produto em duelo: posição no ranking, foto, marca, selos e ações de trocar/remover. */
export function CompareProductCard({ product: p, onSwap, onRemove }: CompareProductCardProps) {
  const best = p.rank === 1
  return (
    <article
      className={cn(
        'relative flex w-[240px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-surface-container-lowest p-3 transition-all lg:w-auto lg:p-space-md',
        best ? 'bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest shadow-md ring-2 ring-primary/40' : 'shadow-sm',
      )}
    >
      {best && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1 bg-primary px-2 py-0.5 text-on-primary shadow-sm">
          <Icon name="stars" filled size={13} />
          <span className="text-[10px] font-bold tracking-tight uppercase">1º · Melhor escolha</span>
        </div>
      )}
      <div className={cn('absolute right-2 z-10 flex items-center gap-1', best ? 'top-7' : 'top-2')}>
        {onSwap && <SmallAction icon="swap_horiz" label={`Trocar ${p.name}`} onClick={onSwap} />}
        <SmallAction icon="close" label={`Remover ${p.name}`} onClick={onRemove} danger />
      </div>

      <a href={p.href} className={cn('mb-2 block', best && 'mt-5')} tabIndex={-1} aria-hidden>
        <ProductThumb src={p.imageUrl} alt={p.name} size="full" className="h-36 rounded-lg" />
      </a>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-1">
          {p.brand && <span className={cn('truncate text-label-sm uppercase', best ? 'font-bold text-primary' : 'text-outline')}>{p.brand}</span>}
          {p.rank && (
            <span className={cn('rounded px-1.5 text-[10px]', best ? 'bg-secondary-container font-bold text-on-secondary-container' : 'bg-surface-container text-on-surface-variant')}>
              {best ? 'Top 1' : `${p.rank}º Lugar`}
            </span>
          )}
        </div>
        <h2 className="mt-0.5 line-clamp-2 min-h-[36px] text-[14px] leading-tight font-bold text-on-surface lg:text-[16px]">
          <a href={p.href} className="hover:text-primary">
            {p.name}
          </a>
        </h2>
        <div className="mt-2 flex flex-wrap gap-1">
          <BadgeNutriScore grade={p.nutriscore} variant="label" />
          {p.nova && <BadgeNova group={p.nova} className="w-full" />}
        </div>
      </div>
    </article>
  )
}
