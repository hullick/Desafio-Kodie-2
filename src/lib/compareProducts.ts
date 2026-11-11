import type { ProductCardCompactProps } from '../components/molecules/ProductCardCompact'
import type { CategoryNames } from '../i18n/categoryNames'
import type { Product } from '../models/Product'
import type { ComparedProduct } from '../types/comparison'
import { healthScore } from './compare'

/** Valores por 100 g/ml usados no comparador. `null` = não informado na Open Food Facts. */
export type CompareNutrients = {
  sugar: number | null
  fiber: number | null
  /** mg */
  sodium: number | null
  fat: number | null
  saturatedFat: number | null
  /** kcal */
  energy: number | null
  protein: number | null
  additives: number
}

export type CompareEntry = Omit<ComparedProduct, 'rank'> & { nutrients: CompareNutrients }

/** Palavras do nome curto (legendas e colunas). */
const SHORT_WORDS = 3

function shortNameOf(p: Product): string {
  const name = p.name ?? p.brand ?? p.code
  return name.split(/\s+/).slice(0, SHORT_WORDS).join(' ')
}

/** Converte os produtos da API para o comparador, mantendo a ordem. */
export function toCompareEntries(products: Product[]): CompareEntry[] {
  const shortNames = products.map(shortNameOf)
  return products.map((p, i) => {
    // Nome curto repetido (ex.: dois "Leite em pó") → acrescenta a marca para diferenciar.
    const repeated = shortNames.filter((s) => s === shortNames[i]).length > 1
    const n = p.nutriments
    return {
      id: p.code,
      name: p.name ?? 'Produto sem nome',
      shortName: repeated && p.brand ? `${shortNames[i]} (${p.brand})` : shortNames[i],
      brand: p.brand ?? undefined,
      imageUrl: p.imageSmallUrl ?? p.imageUrl ?? undefined,
      nutriscore: p.nutriscore,
      nova: p.nova,
      href: `/produto/${p.code}`,
      nutrients: {
        sugar: n.sugars,
        fiber: n.fiber,
        sodium: n.sodiumMg,
        fat: n.fat,
        saturatedFat: n.saturatedFat,
        energy: n.energyKcal === null ? null : Math.round(n.energyKcal),
        protein: n.proteins,
        additives: p.additives.length,
      },
    }
  })
}

/** Categoria mais específica comum a todos os produtos (tag sem "en:"), se houver. */
export function sharedCategory(products: Product[]): string | undefined {
  if (products.length === 0) return undefined
  const [first, ...rest] = products
  // A API lista da geral para a específica: procura de trás para frente.
  return [...first.categories].reverse().find((tag) => rest.every((p) => p.categories.includes(tag)))
}

/** Nome da categoria comum mais específica que tenha tradução. */
export function sharedCategoryName(products: Product[], names: CategoryNames | null): string | undefined {
  if (!names || products.length === 0) return undefined
  const [first, ...rest] = products
  const tag = [...first.categories]
    .reverse()
    .find((t) => names[t] && rest.every((p) => p.categories.includes(t)))
  return tag && names[tag]
}

/** Base das quantidades: "100g", "100ml" ou "100g/ml" quando a comparação mistura os dois. */
export function basisLabel(products: Product[]): string {
  const bases = new Set(products.map((p) => p.basis))
  return bases.size === 1 ? [...bases][0] : '100g/ml'
}

/** Sugestões para comparar também: mesma categoria, fora da comparação, melhor avaliados primeiro. */
export function relatedFrom(
  pool: Product[],
  category: string | undefined,
  exclude: string[],
  limit = 4,
): Array<ProductCardCompactProps & { id: string }> {
  if (!category) return []
  return pool
    .filter((p) => p.nutriscore && p.categories.includes(category) && !exclude.includes(p.code))
    .sort((a, b) => healthScore(a.nutriscore, a.nova) - healthScore(b.nutriscore, b.nova))
    .slice(0, limit)
    .map((p) => ({
      id: p.code,
      name: p.name ?? 'Produto sem nome',
      brand: p.brand ?? undefined,
      quantity: p.quantity ?? undefined,
      imageUrl: p.imageSmallUrl ?? p.imageUrl ?? undefined,
      nutriscore: p.nutriscore,
      href: `/produto/${p.code}`,
    }))
}
