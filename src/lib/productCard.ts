import type { ProductCardProps, ProductHighlight } from '../components/organisms/ProductCard'
import type { NutrientTileProps } from '../components/molecules/NutrientTile'
import type { Product } from '../models/Product'

/** Dados do card que vêm do produto (o resto — favoritar, comparar — vem da página). */
export type ProductCardData = Pick<
  ProductCardProps,
  'name' | 'brand' | 'quantity' | 'imageUrl' | 'nutriscore' | 'nova' | 'nutrients' | 'highlight'
>

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** "4,5g" · sem valor → undefined (o tile mostra "Não informado"). */
function amount(value: number | null, unit: string): string | undefined {
  return value === null ? undefined : `${decimal.format(value)}${unit}`
}

function highlightOf(p: Product): ProductHighlight | undefined {
  if (p.nova === 4) return { tone: 'error', icon: 'warning', text: 'Ultraprocessado' }
  if (p.nutrientLevels.sugars === 'high') return { tone: 'error', icon: 'warning', text: 'Alto teor de açúcar' }
  if (p.nutriscore === 'a' || p.nutriscore === 'b') return { tone: 'success', icon: 'thumb_up', text: 'Boa escolha' }
  return undefined
}

/** Converte um produto da Open Food Facts nos dados do ProductCard (valores por 100 g/ml). */
export function toProductCard(p: Product): ProductCardData {
  const n = p.nutriments
  const levels = p.nutrientLevels
  const nutrients: NutrientTileProps[] = [
    { label: 'Açúcar', value: amount(n.sugars, 'g'), level: levels.sugars ?? undefined },
    { label: 'Gordura', value: amount(n.fat, 'g'), level: levels.fat ?? undefined },
    // O semáforo da OFF é por sal; sódio e sal andam juntos.
    { label: 'Sódio', value: amount(n.sodiumMg, 'mg'), level: levels.salt ?? undefined },
    { label: 'Calorias', value: amount(n.energyKcal === null ? null : Math.round(n.energyKcal), 'kcal') },
  ]
  return {
    name: p.name ?? 'Produto sem nome',
    brand: p.brand ?? undefined,
    quantity: p.quantity ?? undefined,
    imageUrl: p.imageSmallUrl ?? p.imageUrl ?? undefined,
    nutriscore: p.nutriscore,
    nova: p.nova,
    nutrients,
    highlight: highlightOf(p),
  }
}
