import type { NovaGroup, NutriGrade } from './nutrition'

export type FilterState = {
  nutriscore: NutriGrade[]
  nova: NovaGroup[]
  category: string
  claims: string[]
}

export const EMPTY_FILTERS: FilterState = { nutriscore: [], nova: [], category: '', claims: [] }
