import { isValidBarcode, normalizeBarcode } from '../lib/barcode'
import { Product, PRODUCT_FIELDS, type ProductData } from '../models/Product'
import { ProductLookup } from '../models/ProductLookup'
import { SearchPage } from '../models/SearchPage'
import { NOVA_GROUPS, NUTRI_GRADES, type NovaGroup, type NutriGrade } from '../types/nutrition'
import type { OffProductResponseV3, OffSearchResponseV2 } from '../types/openFoodFacts'
import { CACHE_TTL_MS, DEFAULT_COUNTRY, DEFAULT_PAGE_SIZE, OFF_BASE_URL, PRODUCT_RATE, SEARCH_RATE } from './config'
import { getJson } from './http'
import { RateLimiter } from './RateLimiter'
import { ResponseCache } from './ResponseCache'

/**
 * Requisições à Open Food Facts (SPEC, seção 7):
 * 1. getProduct          → GET /api/v3/product/{code}
 * 2. searchProducts      → GET /cgi/search.pl (com texto) ou /api/v2/search (só filtros)
 * 3. getProductsByCodes  → GET /api/v2/search?code=a,b,c
 * 4. getAlternatives     → GET /api/v2/search (mesma categoria, Nutri-Score melhor)
 * Toda busca/listagem filtra por Brasil por padrão (`country: null` desliga).
 */

export type RequestOptions = { signal?: AbortSignal }

export type SearchSort = 'relevance' | 'nutriscore' | 'name' | 'popularity'

export type SearchParams = {
  /** Texto livre. Vazio → navegação só por filtros (v2). */
  query?: string
  /** Tag de categoria em inglês, sem prefixo (ex.: "breakfast-cereals"). */
  category?: string
  nutriscore?: NutriGrade[]
  nova?: NovaGroup[]
  sort?: SearchSort
  page?: number
  pageSize?: number
  /** País (tag em inglês). Padrão: Brasil. `null` = todos os países. */
  country?: string | null
}

type SearchPageData = { products: ProductData[]; count: number; page: number; pageSize: number }

const productLimiter = new RateLimiter(PRODUCT_RATE.max, PRODUCT_RATE.windowMs)
const searchLimiter = new RateLimiter(SEARCH_RATE.max, SEARCH_RATE.windowMs)

const productCache = new ResponseCache<ProductData>('product', CACHE_TTL_MS)
/** Códigos já consultados que não existem (guarda o `result.id` da API). */
const missingCache = new ResponseCache<string>('missing', CACHE_TTL_MS)
const searchCache = new ResponseCache<SearchPageData>('search', CACHE_TTL_MS)

const FIELDS = PRODUCT_FIELDS.join(',')

/** `sort_by` da API. Verificado só `nutriscore_score` (menor = melhor, A primeiro). */
const SORT_KEYS: Record<Exclude<SearchSort, 'relevance'>, string> = {
  nutriscore: 'nutriscore_score',
  name: 'product_name',
  popularity: 'unique_scans_n',
}

/** Valores de tag para montar "ou" por exclusão na search.pl (inclui produtos sem nota). */
const GRADE_TAGS = [...NUTRI_GRADES, 'unknown', 'not-applicable']
const NOVA_TAGS = [...NOVA_GROUPS.map(String), 'unknown']

/** Produtos vindos de qualquer resposta entram no cache: abrir o detalhe depois não gasta requisição. */
function remember(products: Product[]): void {
  for (const p of products) if (p.code) productCache.set(p.code, p.toJSON())
}

function toPageData(page: SearchPage): SearchPageData {
  return { products: page.products.map((p) => p.toJSON()), count: page.count, page: page.page, pageSize: page.pageSize }
}

function fromPageData(data: SearchPageData): SearchPage {
  return new SearchPage(data.products.map((p) => new Product(p)), data.count, data.page, data.pageSize)
}

/** Monta a URL da busca: search.pl quando há texto (a v2 ignora `search_terms`), v2 caso contrário. */
export function buildSearchUrl(params: SearchParams): string {
  const { query = '', category, nutriscore = [], nova = [], sort = 'relevance', page = 1, pageSize = DEFAULT_PAGE_SIZE } = params
  const country = params.country === undefined ? DEFAULT_COUNTRY : params.country
  const q = new URLSearchParams()
  const text = query.trim()

  if (text) {
    q.set('search_terms', text)
    q.set('search_simple', '1')
    q.set('json', '1')
    q.set('action', 'process')
    let i = 0
    const criterion = (type: string, value: string, contains = true) => {
      q.set(`tagtype_${i}`, type)
      q.set(`tag_contains_${i}`, contains ? 'contains' : 'does_not_contain')
      q.set(`tag_${i}`, value)
      i++
    }
    // A search.pl combina critérios com "e": vários valores viram exclusão do restante.
    const oneOf = (type: string, selected: string[], all: string[]) => {
      if (selected.length === 0) return
      if (selected.length === 1) criterion(type, selected[0])
      else for (const v of all) if (!selected.includes(v)) criterion(type, v, false)
    }
    if (country) criterion('countries', country)
    if (category) criterion('categories', category)
    oneOf('nutrition_grades', nutriscore, GRADE_TAGS)
    oneOf('nova_groups', nova.map(String), NOVA_TAGS)
  } else {
    if (country) q.set('countries_tags_en', country)
    if (category) q.set('categories_tags_en', category)
    // Na v2, "|" significa "ou".
    if (nutriscore.length) q.set('nutrition_grades_tags', nutriscore.join('|'))
    if (nova.length) q.set('nova_groups_tags', nova.join('|'))
  }

  if (sort !== 'relevance') q.set('sort_by', SORT_KEYS[sort])
  q.set('page', String(page))
  q.set('page_size', String(pageSize))
  q.set('fields', FIELDS)

  return `${OFF_BASE_URL}${text ? '/cgi/search.pl' : '/api/v2/search'}?${q}`
}

/** 1. Produto por código de barras. Código inválido não gera requisição. */
export async function getProduct(code: string, { signal }: RequestOptions = {}): Promise<ProductLookup> {
  const clean = normalizeBarcode(code)
  if (!isValidBarcode(clean)) return new ProductLookup(clean, null, 'product_not_found', ['invalid_code'])

  const cached = productCache.get(clean)
  if (cached) return new ProductLookup(clean, new Product(cached), 'product_found')
  const missing = missingCache.get(clean)
  if (missing) return new ProductLookup(clean, null, missing)

  const url = `${OFF_BASE_URL}/api/v3/product/${clean}?fields=${FIELDS}`
  const raw = await getJson<OffProductResponseV3>(url, { limiter: productLimiter, signal, acceptStatus: [404] })
  const lookup = ProductLookup.fromApi(raw, clean)

  if (lookup.product) {
    remember([lookup.product])
    productCache.set(clean, lookup.product.toJSON())
  } else {
    missingCache.set(clean, lookup.resultId ?? 'product_not_found')
  }
  return lookup
}

/** 2. Busca por texto e/ou filtros, filtrada por Brasil por padrão. */
export async function searchProducts(params: SearchParams, { signal }: RequestOptions = {}): Promise<SearchPage> {
  const url = buildSearchUrl(params)
  const cached = searchCache.get(url)
  if (cached) return fromPageData(cached)

  const raw = await getJson<OffSearchResponseV2>(url, { limiter: searchLimiter, signal })
  const page = SearchPage.fromApi(raw)
  remember(page.products)
  searchCache.set(url, toPageData(page))
  return page
}

/** 3. Vários produtos por código numa chamada só (só os que não estão em cache). Mantém a ordem pedida. */
export async function getProductsByCodes(codes: string[], { signal }: RequestOptions = {}): Promise<Product[]> {
  const wanted = [...new Set(codes.map(normalizeBarcode).filter(isValidBarcode))]
  const found = new Map<string, Product>()
  const missing: string[] = []

  for (const code of wanted) {
    const cached = productCache.get(code)
    if (cached) found.set(code, new Product(cached))
    else missing.push(code)
  }

  if (missing.length) {
    const q = new URLSearchParams({ code: missing.join(','), page_size: String(missing.length), fields: FIELDS })
    const raw = await getJson<OffSearchResponseV2>(`${OFF_BASE_URL}/api/v2/search?${q}`, { limiter: searchLimiter, signal })
    const page = SearchPage.fromApi(raw)
    remember(page.products)
    for (const p of page.products) found.set(p.code, p)
  }

  return wanted.map((code) => found.get(code)).filter((p): p is Product => Boolean(p))
}

/**
 * 4. Alternativas mais saudáveis: mesma categoria (a mais específica), Nutri-Score melhor
 * que o do produto (ou A/B se ele não tiver nota), ordenadas por Nutri-Score.
 */
export async function getAlternatives(
  product: Product,
  { limit = 6, country, signal }: RequestOptions & { limit?: number; country?: string | null } = {},
): Promise<Product[]> {
  const category = product.categories.at(-1)
  if (!category) return []

  const index = product.nutriscore ? NUTRI_GRADES.indexOf(product.nutriscore) : 2
  const better = NUTRI_GRADES.slice(0, Math.max(1, index))

  const page = await searchProducts(
    { category, nutriscore: better, sort: 'nutriscore', pageSize: limit + 1, country },
    { signal },
  )
  return page.products.filter((p) => p.code !== product.code).slice(0, limit)
}
