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

/**
 * Card de produto em duelo: posição no ranking, foto, marca, selos e ações de trocar/remover.
 * Ocupa a largura da coluna; abaixo de 200px (ex.: 4 produtos no celular) usa selos compactos.
 */
export function CompareProductCard({ product: p, onSwap, onRemove }: CompareProductCardProps) {
  const best = p.rank === 1
  return (
    <article
      className={cn(
        '@container relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-surface-container-lowest p-1.5 transition-all md:p-3 lg:p-space-md',
        best ? 'bg-gradient-to-b from-secondary-container/20 to-surface-container-lowest shadow-md ring-2 ring-primary/40' : 'shadow-sm',
      )}
    >
      {best && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1 bg-primary px-2 py-0.5 text-on-primary shadow-sm">
          <Icon name="stars" filled size={13} />
          <span className="truncate text-[10px] font-bold tracking-tight uppercase">
            1º<span className="hidden @min-[200px]:inline"> · Melhor escolha</span>
          </span>
        </div>
      )}
      <div className={cn('absolute right-1 z-10 flex items-center gap-0.5 @min-[200px]:right-2 @min-[200px]:gap-1', best ? 'top-6 @min-[200px]:top-7' : 'top-1 @min-[200px]:top-2')}>
        {onSwap && (
          <span className="hidden @min-[200px]:contents">
            <SmallAction icon="swap_horiz" label={`Trocar ${p.name}`} onClick={onSwap} />
          </span>
        )}
        <SmallAction icon="close" label={`Remover ${p.name}`} onClick={onRemove} danger />
      </div>

      <a href={p.href} className={cn('mb-2 block', best && 'mt-5')} tabIndex={-1} aria-hidden>
        <ProductThumb src={p.imageUrl} alt={p.name} size="full" className="aspect-square h-auto rounded-lg @min-[200px]:aspect-auto @min-[200px]:h-36" />
      </a>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col items-start gap-0.5 @min-[200px]:flex-row @min-[200px]:items-center @min-[200px]:justify-between @min-[200px]:gap-1">
          {p.brand && (
            <span className={cn('max-w-full truncate text-[10px] uppercase @min-[200px]:text-label-sm', best ? 'font-bold text-primary' : 'text-outline')}>
              {p.brand}
            </span>
          )}
          {p.rank && (
            <span className={cn('shrink-0 rounded px-1.5 text-[10px]', best ? 'bg-secondary-container font-bold text-on-secondary-container' : 'bg-surface-container text-on-surface-variant')}>
              {best ? 'Top 1' : `${p.rank}º Lugar`}
            </span>
          )}
        </div>
        <h2 className="mt-0.5 line-clamp-3 text-[11px] leading-tight font-bold break-words text-on-surface @min-[200px]:line-clamp-2 @min-[200px]:min-h-[36px] @min-[200px]:text-[14px] lg:text-[16px]">
          <a href={p.href} className="hover:text-primary">
            {p.name}
          </a>
        </h2>
        {/* Estreito: Nutri-Score em círculo e NOVA em quadrado; largo: selos com texto. */}
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 @min-[200px]:hidden">
          <BadgeNutriScore grade={p.nutriscore} variant="circle" />
          {p.nova && <BadgeNova group={p.nova} variant="square" />}
        </div>
        <div className="mt-2 hidden flex-wrap gap-1 @min-[200px]:flex">
          <BadgeNutriScore grade={p.nutriscore} variant="label" />
          {p.nova && <BadgeNova group={p.nova} className="w-full" />}
        </div>
      </div>
    </article>
  )
}
