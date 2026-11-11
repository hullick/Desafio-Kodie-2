import type { ReactNode } from 'react'
import type { NutriGrade } from '../../types/nutrition'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Icon } from '../atoms/Icon'
import { ProductThumb } from '../atoms/ProductThumb'

export type ProductCardCompactProps = {
  name: string
  href: string
  imageUrl?: string
  brand?: string
  quantity?: string
  nutriscore?: NutriGrade | null
  /** Texto curto abaixo (ex.: "15g de fibras · 0g açúcar"). */
  caption?: string
  /** Ação à direita (ex.: FavoriteButton). Sem ela, mostra uma seta. */
  action?: ReactNode
}

/** Item compacto de lista: miniatura, marca, gramatura, Nutri-Score e seta ou ação. */
export function ProductCardCompact({ name, href, imageUrl, brand, quantity, nutriscore, caption, action }: ProductCardCompactProps) {
  return (
    <article className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-3 shadow-sm transition-shadow hover:shadow-md">
      <ProductThumb src={imageUrl} alt={name} size="xs" className="h-12 w-12" />
      <a href={href} className="min-w-0 flex-1">
        {(brand || quantity) && (
          <span className="block truncate text-label-sm text-outline uppercase">
            {brand}
            {brand && quantity && ' · '}
            {quantity}
          </span>
        )}
        <span className="block truncate text-label-md font-semibold text-on-surface">{name}</span>
        <span className="mt-0.5 flex items-center gap-2">
          {nutriscore !== undefined && <BadgeNutriScore grade={nutriscore} variant="pill" className="text-[10px]" />}
          {caption && <span className="truncate text-body-sm text-outline">{caption}</span>}
        </span>
      </a>
      {action ?? (
        <a href={href} aria-label={`Ver ${name}`} className="text-outline hover:text-primary">
          <Icon name="chevron_right" />
        </a>
      )}
    </article>
  )
}
