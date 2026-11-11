import { THRESHOLDS, type ThresholdKey } from '../config/thresholds'
import type { NovaGroup, NutriGrade } from './nutrition'

/** Limite máximo por 100 g/ml; desativado → não filtra (o valor fica guardado para reativar). */
export type ThresholdValue = { enabled: boolean; max: number }

export type FilterState = {
  nutriscore: NutriGrade[]
  nova: NovaGroup[]
  category: string
  claims: string[]
  thresholds: Record<ThresholdKey, ThresholdValue>
}

export const EMPTY_FILTERS: FilterState = {
  nutriscore: [],
  nova: [],
  category: '',
  claims: [],
  thresholds: Object.fromEntries(THRESHOLDS.map((t) => [t.key, { enabled: false, max: t.initial }])) as Record<
    ThresholdKey,
    ThresholdValue
  >,
}
