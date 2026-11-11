import type { NutrimentsData } from '../models/Nutriments'
import type { NutritionBasis } from '../models/Product'

export type AnvisaLimit = {
  /** Texto do selo "alto em". */
  label: string
  /** Campo de Nutriments comparado (por 100 g/ml). */
  field: keyof NutrimentsData
  /** Alerta quando o valor é igual ou maior que o limite. */
  limit: Record<NutritionBasis, number>
}

/**
 * Rotulagem frontal "alto em" (RDC 429/2020, IN 75/2020) — SPEC, seção 9.
 * Açúcar só pelo adicionado: sem `added-sugars_100g` não há alerta (não inferir de `sugars`).
 */
export const ANVISA_LIMITS: AnvisaLimit[] = [
  { label: 'Alto em açúcar adicionado', field: 'addedSugars', limit: { '100g': 15, '100ml': 7.5 } },
  { label: 'Alto em gordura saturada', field: 'saturatedFat', limit: { '100g': 6, '100ml': 3 } },
  { label: 'Alto em sódio', field: 'sodiumMg', limit: { '100g': 600, '100ml': 300 } },
]
