import type { OffProductRaw, OffTag } from '../types/openFoodFacts'
import { NOVA_GROUPS, NUTRI_GRADES, type NovaGroup, type NutriGrade } from '../types/nutrition'
import { NutrientLevels, type NutrientLevelsData } from './NutrientLevels'
import { Nutriments, type NutrimentsData } from './Nutriments'

/** Campos pedidos à API (parâmetro `fields`), para não baixar o produto inteiro. */
export const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'product_name_pt',
  'generic_name_pt',
  'brands',
  'quantity',
  'product_quantity_unit',
  'image_front_url',
  'image_front_small_url',
  'nutriscore_grade',
  'nova_group',
  'nutriments',
  'nutrient_levels',
  'nutrition_data_per',
  'additives_tags',
  'allergens_tags',
  'traces_tags',
  'ingredients_text',
  'ingredients_text_pt',
  'categories_tags',
  'countries_tags',
] as const

export type NutritionBasis = '100g' | '100ml'

export type ProductData = {
  code: string
  name: string | null
  brands: string[]
  quantity: string | null
  imageUrl: string | null
  imageSmallUrl: string | null
  nutriscore: NutriGrade | null
  nova: NovaGroup | null
  basis: NutritionBasis
  nutriments: NutrimentsData
  nutrientLevels: NutrientLevelsData
  ingredientsText: string | null
  /** Ids sem prefixo de idioma (ex.: "gluten", "e330", "breakfast-cereals", "brazil"). Categorias: só as "en:", da mais geral à mais específica. */
  additives: string[]
  allergens: string[]
  traces: string[]
  categories: string[]
  /** Categorias em texto solto, com o idioma (ex.: "pt:Bebida"). A API não as liga à taxonomia. */
  localCategories: string[]
  countries: string[]
}

/** Texto não vazio, ou null. */
function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/** Nome válido precisa ter letras (a API já devolveu "2.0" como nome). */
function name(value: unknown): string | null {
  const t = text(value)
  return t && /\p{L}/u.test(t) ? t : null
}

/** "en:gluten" → "gluten". */
function tags(list: OffTag[] | undefined): string[] {
  return (list ?? []).map((t) => t.replace(/^[a-z]{2,3}:/, '')).filter(Boolean)
}

function grade(value: unknown): NutriGrade | null {
  return NUTRI_GRADES.includes(value as NutriGrade) ? (value as NutriGrade) : null
}

function nova(value: unknown): NovaGroup | null {
  const n = Number(value)
  return NOVA_GROUPS.includes(n as NovaGroup) ? (n as NovaGroup) : null
}

/** Líquido se a API disser "100ml" ou se a quantidade estiver em ml/cl/l. */
function basis(raw: OffProductRaw): NutritionBasis {
  if (raw.nutrition_data_per === '100ml') return '100ml'
  const unit = raw.product_quantity_unit ?? raw.quantity ?? ''
  return /(^|\d|\s)(ml|cl|l)\b/i.test(unit) ? '100ml' : '100g'
}

/** Produto da Open Food Facts já normalizado para a interface. */
export class Product {
  readonly code: string
  readonly name: string | null
  readonly brands: string[]
  readonly quantity: string | null
  readonly imageUrl: string | null
  readonly imageSmallUrl: string | null
  readonly nutriscore: NutriGrade | null
  readonly nova: NovaGroup | null
  readonly basis: NutritionBasis
  readonly nutriments: Nutriments
  readonly nutrientLevels: NutrientLevels
  readonly ingredientsText: string | null
  readonly additives: string[]
  readonly allergens: string[]
  readonly traces: string[]
  readonly categories: string[]
  readonly localCategories: string[]
  readonly countries: string[]

  constructor(data: ProductData) {
    this.code = data.code
    this.name = data.name
    this.brands = data.brands
    this.quantity = data.quantity
    this.imageUrl = data.imageUrl
    this.imageSmallUrl = data.imageSmallUrl
    this.nutriscore = data.nutriscore
    this.nova = data.nova
    this.basis = data.basis
    this.nutriments = new Nutriments(data.nutriments)
    this.nutrientLevels = new NutrientLevels(data.nutrientLevels)
    this.ingredientsText = data.ingredientsText
    this.additives = data.additives
    this.allergens = data.allergens
    this.traces = data.traces
    this.categories = data.categories
    this.localCategories = data.localCategories
    this.countries = data.countries
  }

  static fromApi(raw: OffProductRaw): Product {
    return new Product({
      code: text(raw.code) ?? '',
      name: name(raw.product_name_pt) ?? name(raw.product_name) ?? name(raw.generic_name_pt),
      brands: (raw.brands ?? '').split(',').map((b) => b.trim()).filter(Boolean),
      quantity: text(raw.quantity),
      imageUrl: text(raw.image_front_url),
      imageSmallUrl: text(raw.image_front_small_url) ?? text(raw.image_front_url),
      nutriscore: grade(raw.nutriscore_grade),
      nova: nova(raw.nova_group),
      basis: basis(raw),
      nutriments: Nutriments.fromApi(raw.nutriments).toJSON(),
      nutrientLevels: NutrientLevels.fromApi(raw.nutrient_levels).toJSON(),
      ingredientsText: text(raw.ingredients_text_pt) ?? text(raw.ingredients_text),
      additives: tags(raw.additives_tags),
      allergens: tags(raw.allergens_tags),
      traces: tags(raw.traces_tags),
      // Só tags "en:" — são as aceitas no filtro categories_tags_en (a API também devolve texto solto).
      categories: tags(raw.categories_tags?.filter((t) => t.startsWith('en:'))),
      localCategories: (raw.categories_tags ?? []).filter((t) => /^[a-z]{2,3}:/.test(t) && !t.startsWith('en:')),
      countries: tags(raw.countries_tags),
    })
  }

  /** Primeira marca (ex.: "Nestlé" de "Nestlé, Nescau"). */
  get brand(): string | null {
    return this.brands[0] ?? null
  }

  get isLiquid(): boolean {
    return this.basis === '100ml'
  }

  get isFromBrazil(): boolean {
    return this.countries.includes('brazil')
  }

  /** Falta informação essencial → mostrar convite para completar os dados. */
  get isIncomplete(): boolean {
    return !this.name || !this.nutriscore || this.nutriments.isEmpty
  }

  /** Forma serializável (para localStorage); `new Product(json)` reconstrói. */
  toJSON(): ProductData {
    return {
      ...this,
      nutriments: this.nutriments.toJSON(),
      nutrientLevels: this.nutrientLevels.toJSON(),
    }
  }
}
