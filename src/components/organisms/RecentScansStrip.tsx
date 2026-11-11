import { Icon } from '../atoms/Icon'
import { ProductCardCompact, type ProductCardCompactProps } from '../molecules/ProductCardCompact'

export type RecentScansStripProps = {
  items: Array<ProductCardCompactProps & { id: string }>
  onClear: () => void
  title?: string
}

/** Escaneados recentemente: faixa horizontal de produtos compactos (também usada como cache offline). */
export function RecentScansStrip({ items, onClear, title = 'Escaneados recentemente' }: RecentScansStripProps) {
  if (items.length === 0) return null
  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-space-xs text-headline-sm font-semibold text-on-surface">
          <Icon name="history" size={20} className="text-primary" /> {title}
        </h2>
        <button type="button" onClick={onClear} className="text-label-sm text-outline transition-colors hover:text-on-surface">
          Limpar
        </button>
      </div>
      <div className="no-scrollbar -mx-gutter flex items-stretch gap-space-sm overflow-x-auto scroll-smooth px-gutter pb-2">
        {items.map(({ id, ...item }) => (
          <div key={id} className="min-w-[240px]">
            <ProductCardCompact {...item} />
          </div>
        ))}
      </div>
    </section>
  )
}
