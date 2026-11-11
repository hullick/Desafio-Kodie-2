import { useMemo } from 'react'
import { createLocalStore } from '../lib/localStore'
import { Product, type ProductData } from '../models/Product'

/**
 * Favoritos guardados no aparelho (SPEC: localStorage, sem requisição para abrir).
 * Cada um guarda os dados do produto de quando foi salvo/atualizado: a lista abre na hora,
 * até sem internet. `product` ausente = dados de outro formato (versão antiga) → precisa atualizar.
 */
export type FavoriteEntry = {
  code: string
  /** Quando foi favoritado (ordem "Adicionados recentemente"). */
  addedAt: number
  product?: ProductData
  /** Quando `product` foi obtido da API. */
  savedAt?: number
}

/** Formato de ProductData guardado. Mudou o ProductData? Aumente: os dados viram "precisa atualizar". */
const DATA_VERSION = 1

/** Dados com mais tempo que isso são atualizados ao abrir a tela de Favoritos. */
export const FAVORITE_STALE_MS = 24 * 60 * 60_000

type Stored = { v: number; items: FavoriteEntry[] }

function parse(raw: unknown): FavoriteEntry[] {
  const data = raw as Partial<Stored> | null
  if (!data || !Array.isArray(data.items)) return []
  const sameVersion = data.v === DATA_VERSION
  return data.items
    .filter((e): e is FavoriteEntry => typeof e?.code === 'string' && typeof e.addedAt === 'number')
    .map((e) => (sameVersion ? e : { code: e.code, addedAt: e.addedAt }))
}

// Guarda { v, items } para saber o formato; para o resto do app, é a lista.
const raw = createLocalStore<Stored>('scanbite.favorites', (r) => ({ v: DATA_VERSION, items: parse(r) }), {
  v: DATA_VERSION,
  items: [],
})

const setItems = (fn: (items: FavoriteEntry[]) => FavoriteEntry[]) =>
  raw.set((prev) => {
    const items = fn(prev.items)
    return items === prev.items ? prev : { v: DATA_VERSION, items }
  })

/** Favorita ou desfavorita o produto. */
export function toggleFavorite(product: Product): void {
  const now = Date.now()
  setItems((items) =>
    items.some((e) => e.code === product.code)
      ? items.filter((e) => e.code !== product.code)
      : [...items, { code: product.code, addedAt: now, product: product.toJSON(), savedAt: now }],
  )
}

export function removeFavorite(code: string): void {
  setItems((items) => (items.some((e) => e.code === code) ? items.filter((e) => e.code !== code) : items))
}

export function clearFavorites(): void {
  setItems((items) => (items.length ? [] : items))
}

/** Atualiza os dados guardados dos favoritos que vieram da API (os demais ficam como estão). */
export function refreshFavorites(products: Product[]): void {
  const byCode = new Map(products.map((p) => [p.code, p]))
  const now = Date.now()
  setItems((items) =>
    items.some((e) => byCode.has(e.code))
      ? items.map((e) => {
          const p = byCode.get(e.code)
          return p ? { ...e, product: p.toJSON(), savedAt: now } : e
        })
      : items,
  )
}

/** Favoritos na ordem em que foram adicionados. */
export function useFavorites(): FavoriteEntry[] {
  return raw.use().items
}

/** Códigos favoritados, para marcar o coração/"Salvo" nas telas. */
export function useFavoriteCodes(): Set<string> {
  const items = useFavorites()
  return useMemo(() => new Set(items.map((e) => e.code)), [items])
}

/** Produto guardado do favorito (null se precisa atualizar). */
export function favoriteProduct(entry: FavoriteEntry): Product | null {
  return entry.product ? new Product(entry.product) : null
}
