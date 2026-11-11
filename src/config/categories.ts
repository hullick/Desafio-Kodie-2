/**
 * Categorias da Home. `value` é o filtro da interface; `offTag` é a tag em inglês da
 * Open Food Facts (sem o prefixo "en:"), usada na requisição e no filtro local.
 */
export type HomeCategory = { value: string; label: string; offTag: string }

export const HOME_CATEGORIES: HomeCategory[] = [
  { value: 'bebidas', label: 'Bebidas', offTag: 'beverages' },
  { value: 'laticinios', label: 'Laticínios', offTag: 'dairies' },
  { value: 'cereais', label: 'Cereais', offTag: 'breakfast-cereals' },
  { value: 'biscoitos', label: 'Biscoitos', offTag: 'biscuits' },
  { value: 'snacks', label: 'Snacks', offTag: 'snacks' },
  { value: 'massas', label: 'Massas', offTag: 'pastas' },
]

/** Produtos trazidos de uma vez para a Home (máximo por página da API). */
export const HOME_FETCH_SIZE = 100

export function offCategoryTag(value: string): string | undefined {
  return HOME_CATEGORIES.find((c) => c.value === value)?.offTag
}
