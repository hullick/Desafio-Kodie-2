import type { ProductCardCompactProps } from '../components/molecules/ProductCardCompact'
import { MOCK_PRODUCTS } from './home.mock'

type CompactItem = ProductCardCompactProps & { id: string }

const toCompact = (p: (typeof MOCK_PRODUCTS)[number], caption?: string): CompactItem => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  quantity: p.quantity,
  imageUrl: p.imageUrl,
  nutriscore: p.nutriscore,
  href: `/produto/${p.id}`,
  caption,
})

/** Produtos bem avaliados (Nutri-Score A) usados como sugestão nas telas de erro. */
export const POPULAR_ITEMS: CompactItem[] = MOCK_PRODUCTS.filter((p) => p.nutriscore === 'a').map((p) => toCompact(p))

/** Histórico de leituras de exemplo (scanner e modo offline). */
export const RECENT_SCANS: CompactItem[] = [
  { ...toCompact(MOCK_PRODUCTS[3]), caption: 'Escaneado hoje' },
  { ...toCompact(MOCK_PRODUCTS[2]), caption: 'Escaneado ontem' },
  { ...toCompact(MOCK_PRODUCTS[4]), caption: 'Há 3 dias' },
]
