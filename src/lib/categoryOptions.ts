import type { SelectOption } from '../components/atoms/SelectField'
import type { CategoryNames } from '../i18n/categoryNames'
import type { Product } from '../models/Product'

export type CategoryOptionsConfig = {
  /** Máximo de categorias exibidas. */
  max?: number
  /** Mínimo de produtos para uma categoria aparecer. */
  minProducts?: number
}

/**
 * Opções do filtro de categorias a partir dos produtos carregados:
 * - só categorias com nome no idioma (sem tradução → fora do filtro);
 * - fora as presentes em todos os produtos (não separam nada);
 * - categorias com exatamente os mesmos produtos (ex.: "Flocos" e "Flocos de cereais") viram
 *   uma só: fica a mais específica (a API lista do geral para o específico);
 * - ordenadas pela quantidade de produtos, com a contagem no rótulo.
 */
export function buildCategoryOptions(
  products: Product[],
  names: CategoryNames,
  { max = 12, minProducts = 2 }: CategoryOptionsConfig = {},
): SelectOption[] {
  const members = new Map<string, string[]>()
  const depth = new Map<string, number>()
  for (const p of products) {
    p.categories.forEach((tag, i) => {
      if (!names[tag]) return
      const list = members.get(tag) ?? []
      list.push(p.code)
      members.set(tag, list)
      depth.set(tag, Math.max(depth.get(tag) ?? 0, i))
    })
  }

  const bySet = new Map<string, string>()
  for (const [tag, codes] of members) {
    if (codes.length < minProducts || codes.length === products.length) continue
    const key = codes.join(',')
    const current = bySet.get(key)
    if (!current || (depth.get(tag) ?? 0) > (depth.get(current) ?? 0)) bySet.set(key, tag)
  }

  return [...bySet.values()]
    .map((tag) => ({ tag, count: members.get(tag)!.length }))
    .sort((a, b) => b.count - a.count || names[a.tag].localeCompare(names[b.tag]))
    .slice(0, max)
    .map(({ tag, count }) => ({ value: tag, label: `${names[tag]} (${count})` }))
}
