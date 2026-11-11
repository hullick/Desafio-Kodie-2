export type Locale = 'pt-BR' | 'en' | 'es'

/** Idioma do app a partir do navegador: pt* → pt-BR, es* → es, resto → en. */
export function detectLocale(): Locale {
  const langs = typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language])
  for (const lang of langs) {
    const base = lang.toLowerCase().split('-')[0]
    if (base === 'pt') return 'pt-BR'
    if (base === 'es') return 'es'
    if (base === 'en') return 'en'
  }
  return 'pt-BR'
}
