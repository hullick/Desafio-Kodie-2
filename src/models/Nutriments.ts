import type { OffNutriments } from '../types/openFoodFacts'

/** Valores nutricionais por 100 g/ml. Ausente na API → `null` (não confundir com zero). */
export type NutrimentsData = {
  energyKcal: number | null
  energyKj: number | null
  carbohydrates: number | null
  sugars: number | null
  addedSugars: number | null
  fat: number | null
  saturatedFat: number | null
  transFat: number | null
  fiber: number | null
  proteins: number | null
  salt: number | null
  /** Em miligramas (a API devolve em gramas; a ANVISA usa mg). */
  sodiumMg: number | null
}

/** Lê um número da API; aceita string numérica e descarta valores inválidos. */
function num(value: unknown): number | null {
  const n = typeof value === 'string' ? Number.parseFloat(value) : value
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

/** Arredonda dízimas da API (ex.: 366.666…) para 2 casas. */
function round(n: number | null): number | null {
  return n === null ? null : Math.round(n * 100) / 100
}

/** Tabela nutricional por 100 g/ml, já em unidades de exibição. */
export class Nutriments implements NutrimentsData {
  readonly energyKcal: number | null
  readonly energyKj: number | null
  readonly carbohydrates: number | null
  readonly sugars: number | null
  readonly addedSugars: number | null
  readonly fat: number | null
  readonly saturatedFat: number | null
  readonly transFat: number | null
  readonly fiber: number | null
  readonly proteins: number | null
  readonly salt: number | null
  readonly sodiumMg: number | null

  constructor(data: NutrimentsData) {
    this.energyKcal = data.energyKcal
    this.energyKj = data.energyKj
    this.carbohydrates = data.carbohydrates
    this.sugars = data.sugars
    this.addedSugars = data.addedSugars
    this.fat = data.fat
    this.saturatedFat = data.saturatedFat
    this.transFat = data.transFat
    this.fiber = data.fiber
    this.proteins = data.proteins
    this.salt = data.salt
    this.sodiumMg = data.sodiumMg
  }

  static fromApi(raw: OffNutriments = {}): Nutriments {
    const sodiumG = num(raw.sodium_100g)
    const kj = num(raw['energy-kj_100g'])
    return new Nutriments({
      energyKcal: round(num(raw['energy-kcal_100g']) ?? (kj === null ? null : kj / 4.184)),
      energyKj: round(kj),
      carbohydrates: round(num(raw.carbohydrates_100g)),
      sugars: round(num(raw.sugars_100g)),
      addedSugars: round(num(raw['added-sugars_100g'])),
      fat: round(num(raw.fat_100g)),
      saturatedFat: round(num(raw['saturated-fat_100g'])),
      transFat: round(num(raw['trans-fat_100g'])),
      fiber: round(num(raw.fiber_100g)),
      proteins: round(num(raw.proteins_100g)),
      salt: round(num(raw.salt_100g)),
      sodiumMg: sodiumG === null ? null : Math.round(sodiumG * 1000),
    })
  }

  /** Nenhum valor informado → a seção de tabela nutricional não deve aparecer. */
  get isEmpty(): boolean {
    return Object.values(this.toJSON()).every((v) => v === null)
  }

  toJSON(): NutrimentsData {
    return { ...this }
  }
}
