import { useEffect, useState } from 'react'
import { detectLocale, type Locale } from './locale'

/** Tag de categoria (sem "en:") → nome no idioma. Gerado por `npm run i18n:categories`. */
export type CategoryNames = Record<string, string>

/** Uma requisição por idioma durante a sessão (o navegador também guarda o arquivo em cache). */
const loading = new Map<Locale, Promise<CategoryNames>>()

export function loadCategoryNames(locale: Locale): Promise<CategoryNames> {
  let promise = loading.get(locale)
  if (!promise) {
    promise = fetch(`/i18n/categories/${locale}.json`).then((res) => {
      if (!res.ok) throw new Error(`Nomes de categorias (${locale}): HTTP ${res.status}`)
      return res.json() as Promise<CategoryNames>
    })
    // Falhou → permite tentar de novo depois.
    promise.catch(() => loading.delete(locale))
    loading.set(locale, promise)
  }
  return promise
}

/** Nomes das categorias no idioma do navegador; `null` enquanto carrega ou se falhar. */
export function useCategoryNames(): CategoryNames | null {
  const [names, setNames] = useState<CategoryNames | null>(null)
  useEffect(() => {
    let active = true
    loadCategoryNames(detectLocale()).then(
      (n) => active && setNames(n),
      () => {
        /* sem nomes: o filtro de categorias fica oculto */
      },
    )
    return () => {
      active = false
    }
  }, [])
  return names
}
