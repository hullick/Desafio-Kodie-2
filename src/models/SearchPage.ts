import type { OffSearchResponseV2 } from '../types/openFoodFacts'
import { Product } from './Product'

/** Uma página de resultados de GET /api/v2/search. */
export class SearchPage {
  readonly products: Product[]
  /** Total de produtos encontrados em todas as páginas. */
  readonly count: number
  readonly page: number
  readonly pageSize: number
  readonly pageCount: number

  constructor(products: Product[], count: number, page: number, pageSize: number) {
    this.products = products
    this.count = count
    this.page = page
    this.pageSize = pageSize
    this.pageCount = pageSize > 0 ? Math.ceil(count / pageSize) : 0
  }

  /** A API devolve `page` e `page_size` às vezes como string. `page_count` é o tamanho desta página, não o total de páginas. */
  static fromApi(raw: OffSearchResponseV2): SearchPage {
    return new SearchPage(
      (raw.products ?? []).map((p) => Product.fromApi(p)),
      Number(raw.count) || 0,
      Number(raw.page) || 1,
      Number(raw.page_size) || 0,
    )
  }

  get isEmpty(): boolean {
    return this.products.length === 0
  }

  get hasNextPage(): boolean {
    return this.page < this.pageCount
  }
}
