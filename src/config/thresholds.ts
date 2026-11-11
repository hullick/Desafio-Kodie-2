import type { NutrimentsData } from '../models/Nutriments'

export type ThresholdKey = 'sugars' | 'sodium'

export type ThresholdDef = {
  key: ThresholdKey
  label: string
  unit: string
  /** Campo de Nutriments comparado (por 100 g/ml). */
  field: keyof NutrimentsData
  min: number
  max: number
  step: number
  /** Limite inicial ao ativar: "alto em" da ANVISA para sólidos (RDC 429/2020). */
  initial: number
}

/** Limiares nutricionais do filtro da Home (filtram localmente os produtos carregados). */
export const THRESHOLDS: ThresholdDef[] = [
  { key: 'sugars', label: 'Açúcares', unit: 'g', field: 'sugars', min: 0, max: 50, step: 0.5, initial: 15 },
  { key: 'sodium', label: 'Sódio', unit: 'mg', field: 'sodiumMg', min: 0, max: 2000, step: 50, initial: 600 },
]
