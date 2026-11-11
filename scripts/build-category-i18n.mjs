#!/usr/bin/env node
/**
 * Gera os nomes das categorias da Open Food Facts por idioma, a partir da taxonomia oficial:
 *   public/i18n/categories/<locale>.json  →  { "breakfast-cereals": "Cereais matinais", ... }
 *
 * O navegador baixa só o arquivo do idioma do usuário (a taxonomia completa tem ~5 MB).
 * Só entram tags "en:" (as que o app usa); a chave fica sem o prefixo, como em Product.categories.
 * Correções manuais em i18n/overrides/<locale>.json têm prioridade sobre a taxonomia.
 *
 * Também gera public/i18n/categories/aliases.json: { "pt:bebida": "beverages", ... }. Alguns
 * produtos só têm categorias em texto solto (ex.: "pt:Bebida"); o app as converte na tag "en:"
 * pelo nome no idioma, normalizado (ver `categoryAliasKey` em src/i18n/categoryAliases.ts).
 *
 * Roda sozinho no build (`prebuild`) e no dev (`predev`, só se os arquivos não existirem).
 * Os arquivos gerados não são versionados; as correções manuais são.
 *
 * Uso:
 *   npm run i18n:categories                              (baixa a taxonomia)
 *   npm run i18n:categories -- caminho/categories.json   (usa um arquivo já baixado)
 *   node scripts/build-category-i18n.mjs --if-missing    (não faz nada se os arquivos já existem)
 *
 * Se o download falhar (a OFF responde 503 com frequência), tenta de novo; persistindo,
 * mantém os arquivos de uma geração anterior, se houver, em vez de quebrar o build.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const TAXONOMY_URL = 'https://static.openfoodfacts.org/data/taxonomies/categories.json'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public/i18n/categories')
const OVERRIDES_DIR = join(ROOT, 'i18n/overrides')

/** Idioma do app → idioma na taxonomia (não existe pt_BR lá, só pt). */
const LOCALES = { 'pt-BR': 'pt', en: 'en', es: 'es' }

/** Espera entre as tentativas de download. */
const RETRY_DELAYS_MS = [5_000, 15_000]

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function download() {
  for (let attempt = 0; ; attempt++) {
    try {
      console.log(`[i18n] Baixando ${TAXONOMY_URL} ...`)
      const res = await fetch(TAXONOMY_URL, { headers: { 'User-Agent': 'ScanBite/0.0 (build script)' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt >= RETRY_DELAYS_MS.length) throw err
      console.warn(`[i18n] Falhou (${err.message}); nova tentativa em ${RETRY_DELAYS_MS[attempt] / 1000}s`)
      await sleep(RETRY_DELAYS_MS[attempt])
    }
  }
}

async function loadTaxonomy(path) {
  return path ? JSON.parse(await readFile(path, 'utf8')) : download()
}

const exists = (file) => access(file).then(() => true, () => false)
const outFile = (locale) => join(OUT_DIR, `${locale}.json`)
const ALIASES_FILE = join(OUT_DIR, 'aliases.json')

/** Idiomas das categorias em texto solto convertidas pelo nome (produtos do Brasil vêm em pt). */
const ALIAS_LANGS = ['pt', 'es']

/**
 * Chave de comparação de nomes: sem acento, minúsculas, palavras com "-" e sem o "s" final das
 * palavras com mais de 3 letras ("Bebida" e "Bebidas" → "bebida").
 * Igual a `categoryAliasKey` em src/i18n/categoryAliases.ts — manter as duas em sincronia.
 */
const aliasKey = (name) =>
  name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((w) => (w.length > 3 ? w.replace(/s$/, '') : w))
    .join('-')

async function allOutputsExist() {
  const files = [...Object.keys(LOCALES).map(outFile), ALIASES_FILE]
  const checks = await Promise.all(files.map(exists))
  return checks.every(Boolean)
}

async function loadOverrides(locale) {
  try {
    return JSON.parse(await readFile(join(OVERRIDES_DIR, `${locale}.json`), 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return {}
    throw err
  }
}

/** "laticínios" → "Laticínios" (a taxonomia mistura maiúsculas e minúsculas). */
const capitalize = (s) => s.charAt(0).toLocaleUpperCase() + s.slice(1)

const args = process.argv.slice(2)
const ifMissing = args.includes('--if-missing')
const path = args.find((a) => !a.startsWith('--'))

if (ifMissing && (await allOutputsExist())) {
  console.log('[i18n] Nomes de categorias já gerados; nada a fazer.')
  process.exit(0)
}

let taxonomy
try {
  taxonomy = await loadTaxonomy(path)
} catch (err) {
  if (await allOutputsExist()) {
    console.warn(`[i18n] Não foi possível obter a taxonomia (${err.message}); mantendo os arquivos já gerados.`)
    process.exit(0)
  }
  console.error(`[i18n] Não foi possível obter a taxonomia (${err.message}) e não há arquivos gerados antes.`)
  console.error('[i18n] Tente de novo mais tarde ou rode: npm run i18n:categories -- caminho/categories.json')
  process.exit(1)
}
await mkdir(OUT_DIR, { recursive: true })

/** Nomes finais (com correções) por idioma da taxonomia, para os aliases. */
const namesByLang = {}

for (const [locale, lang] of Object.entries(LOCALES)) {
  const names = {}
  for (const [id, entry] of Object.entries(taxonomy)) {
    if (!id.startsWith('en:')) continue
    const name = entry.name?.[lang]?.trim()
    if (name) names[id.slice(3)] = capitalize(name)
  }
  const overrides = await loadOverrides(locale)
  Object.assign(names, overrides)
  namesByLang[lang] = names

  const sorted = Object.fromEntries(Object.entries(names).sort(([a], [b]) => a.localeCompare(b)))
  const json = JSON.stringify(sorted)
  await writeFile(outFile(locale), json + '\n')
  console.log(`[i18n] ${locale}: ${Object.keys(sorted).length} nomes (${Object.keys(overrides).length} correções) → ${(json.length / 1024).toFixed(0)} KB`)
}

// Nome no idioma → tag "en:". Nomes repetidos em tags diferentes: fica a primeira na ordem da taxonomia.
const aliases = {}
for (const lang of ALIAS_LANGS) {
  for (const [tag, name] of Object.entries(namesByLang[lang] ?? {})) {
    const key = aliasKey(name)
    if (key && !aliases[`${lang}:${key}`]) aliases[`${lang}:${key}`] = tag
  }
}
const aliasesJson = JSON.stringify(aliases)
await writeFile(ALIASES_FILE, aliasesJson + '\n')
console.log(`[i18n] aliases: ${Object.keys(aliases).length} nomes → ${(aliasesJson.length / 1024).toFixed(0)} KB`)
