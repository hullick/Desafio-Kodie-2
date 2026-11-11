import type { OffProductResponseV3 } from '../types/openFoodFacts'
import { Product } from './Product'

/** Resultado de GET /api/v3/product/{code}: encontrado ou não, com o motivo. */
export class ProductLookup {
  readonly code: string
  readonly product: Product | null
  /** Id do resultado na API (ex.: "product_found", "product_not_found"). */
  readonly resultId: string | null
  /** Ids das mensagens de erro (ex.: "invalid_code"). */
  readonly errors: string[]

  constructor(code: string, product: Product | null, resultId: string | null, errors: string[] = []) {
    this.code = code
    this.product = product
    this.resultId = resultId
    this.errors = errors
  }

  static fromApi(raw: OffProductResponseV3, requestedCode: string): ProductLookup {
    const ok = raw.status !== 'failure' && raw.product
    return new ProductLookup(
      raw.code ?? requestedCode,
      ok ? Product.fromApi({ code: raw.code ?? requestedCode, ...raw.product }) : null,
      raw.result?.id ?? null,
      (raw.errors ?? []).map((e) => e.message?.id).filter((id): id is string => Boolean(id)),
    )
  }

  get found(): boolean {
    return this.product !== null
  }

  get isInvalidCode(): boolean {
    return this.errors.includes('invalid_code')
  }
}
