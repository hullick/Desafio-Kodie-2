/**
 * Formato cru do JSON da Open Food Facts, como a API devolve.
 * Tudo é opcional: produtos colaborativos frequentemente não têm todos os campos.
 * Conferido em 11/11/2026 com GET /api/v3/product/{code} e GET /api/v2/search.
 */

/** Tag com prefixo de idioma (ex.: "en:gluten", "en:brazil"). */
export type OffTag = string

/** Nível do semáforo nutricional (`nutrient_levels`). */
export type OffNutrientLevel = 'low' | 'moderate' | 'high'

/** `nutrient_levels`: chaves com hífen, como na API. */
export type OffNutrientLevels = Partial<Record<'fat' | 'saturated-fat' | 'sugars' | 'salt', OffNutrientLevel>>

/**
 * `nutriments`: valores por 100 g/ml em `<nome>_100g` e unidade em `<nome>_unit`.
 * A API devolve massas em gramas (inclusive sódio: 0.06 = 60 mg).
 */
export type OffNutriments = {
  'energy-kcal_100g'?: number
  'energy-kj_100g'?: number
  carbohydrates_100g?: number
  sugars_100g?: number
  'added-sugars_100g'?: number
  fat_100g?: number
  'saturated-fat_100g'?: number
  'trans-fat_100g'?: number
  fiber_100g?: number
  proteins_100g?: number
  salt_100g?: number
  sodium_100g?: number
  [key: string]: number | string | undefined
}

/** Produto como vem no campo `product` (v3) ou em `products[]` (v2). */
export type OffProductRaw = {
  code?: string
  product_name?: string
  product_name_pt?: string
  generic_name_pt?: string
  brands?: string
  /** Texto livre (ex.: "400 g", "1,5 L"). */
  quantity?: string
  product_quantity?: number | string
  product_quantity_unit?: string
  image_front_url?: string
  image_front_small_url?: string
  /** "a"–"e", ou "unknown" / "not-applicable" quando não há nota. */
  nutriscore_grade?: string
  nova_group?: number
  nutriments?: OffNutriments
  nutrient_levels?: OffNutrientLevels
  /** "100g" ou "100ml". */
  nutrition_data_per?: string
  additives_tags?: OffTag[]
  allergens_tags?: OffTag[]
  traces_tags?: OffTag[]
  ingredients_text?: string
  ingredients_text_pt?: string
  categories_tags?: OffTag[]
  countries_tags?: OffTag[]
}

/** Identificador + rótulo usados em `result`, `impact` e `message` da v3. */
export type OffLabel = { id: string; name?: string; lc_name?: string }

export type OffMessage = {
  field?: { id: string; value?: string }
  impact?: OffLabel
  message?: OffLabel
}

/** Resposta de GET /api/v3/product/{code}. Produto inexistente: HTTP 404, status "failure". */
export type OffProductResponseV3 = {
  code?: string
  status: 'success' | 'success_with_warnings' | 'success_with_errors' | 'failure'
  result?: OffLabel
  product?: OffProductRaw
  errors?: OffMessage[]
  warnings?: OffMessage[]
}

/** Resposta de GET /api/v2/search. */
export type OffSearchResponseV2 = {
  count: number
  page: number | string
  page_count: number
  page_size: number | string
  skip?: number
  products: OffProductRaw[]
}
