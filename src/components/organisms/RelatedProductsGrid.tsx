import { Icon } from '../atoms/Icon'
import { ProductCardCompact, type ProductCardCompactProps } from '../molecules/ProductCardCompact'

export type RelatedProductsGridProps = {
  eyebrow?: string
  title: string
  items: Array<ProductCardCompactProps & { id: string }>
  seeAllHref?: string
  seeAllLabel?: string
}

/** Grade de produtos relacionados em formato compacto (ex.: outros bem avaliados da categoria). */
export function RelatedProductsGrid({ eyebrow, title, items, seeAllHref, seeAllLabel = 'Ver ranking completo' }: RelatedProductsGridProps) {
  if (items.length === 0) return null
  return (
    <aside className="pt-space-lg">
      <div className="mb-space-md flex items-center justify-between gap-2">
        <div>
          {eyebrow && <span className="text-label-sm font-bold text-outline uppercase">{eyebrow}</span>}
          <h2 className="text-headline-sm font-bold text-on-surface">{title}</h2>
        </div>
        {seeAllHref && (
          <a href={seeAllHref} className="flex shrink-0 items-center gap-1 text-label-md text-primary hover:underline">
            {seeAllLabel} <Icon name="arrow_forward" size={16} />
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 md:grid-cols-4">
        {items.map(({ id, ...item }) => (
          <ProductCardCompact key={id} {...item} />
        ))}
      </div>
    </aside>
  )
}
