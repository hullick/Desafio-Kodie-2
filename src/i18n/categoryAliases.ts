import type { Product } from '../models/Product'

/** "idioma:nome-normalizado" → tag de categoria (sem "en:"). Gerado por `npm run i18n:categories`. */
export type CategoryAliases = Record<string, string>

let loading: Promise<CategoryAliases> | null = null

/** Baixado só quando algum produto não tem categoria "en:"; uma vez por sessão. */
export function loadCategoryAliases(): Promise<CategoryAliases> {
  if (!loading) {
    loading = fetch('/i18n/categories/aliases.json').then((res) => {
      if (!res.ok) throw new Error(`Aliases de categorias: HTTP ${res.status}`)
      return res.json() as Promise<CategoryAliases>
    })
    // Falhou → permite tentar de novo depois.
    loading.catch(() => {
      loading = null
    })
  }
  return loading
}

/**
 * Chave de comparação de nomes: sem acento, minúsculas, palavras com "-" e sem o "s" final das
 * palavras com mais de 3 letras ("Bebida" e "Bebidas" → "bebida").
 * Igual a `aliasKey` em scripts/build-category-i18n.mjs — manter as duas em sincronia.
 */
export function categoryAliasKey(name: string): string {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 ? w.replace(/s$/, '') : w))
    .join('-')
}

/** Tags da taxonomia para as categorias em texto solto do produto ("pt:Bebida" → "beverages"). */
export function resolveLocalCategories(product: Product, aliases: CategoryAliases): string[] {
  const tags = product.localCategories
    .map((raw) => {
      const [lang, ...rest] = raw.split(':')
      return aliases[`${lang}:${categoryAliasKey(rest.join(':'))}`]
    })
    .filter((t): t is string => Boolean(t))
  return [...new Set(tags)]
}
