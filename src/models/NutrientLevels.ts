import type { OffNutrientLevels } from '../types/openFoodFacts'
import type { NutrientLevel } from '../types/nutrition'

export type NutrientLevelsData = {
  fat: NutrientLevel | null
  saturatedFat: NutrientLevel | null
  sugars: NutrientLevel | null
  salt: NutrientLevel | null
}

const VALID: NutrientLevel[] = ['low', 'moderate', 'high']
const level = (v: unknown): NutrientLevel | null => (VALID.includes(v as NutrientLevel) ? (v as NutrientLevel) : null)

/** Semáforo nutricional calculado pela Open Food Facts (`nutrient_levels`). */
export class NutrientLevels implements NutrientLevelsData {
  readonly fat: NutrientLevel | null
  readonly saturatedFat: NutrientLevel | null
  readonly sugars: NutrientLevel | null
  readonly salt: NutrientLevel | null

  constructor(data: NutrientLevelsData) {
    this.fat = data.fat
    this.saturatedFat = data.saturatedFat
    this.sugars = data.sugars
    this.salt = data.salt
  }

  static fromApi(raw: OffNutrientLevels = {}): NutrientLevels {
    return new NutrientLevels({
      fat: level(raw.fat),
      saturatedFat: level(raw['saturated-fat']),
      sugars: level(raw.sugars),
      salt: level(raw.salt),
    })
  }

  toJSON(): NutrientLevelsData {
    return { ...this }
  }
}
