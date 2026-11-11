import { createLocalStore } from '../lib/localStore'
import type { Product } from '../models/Product'
import { NUTRI_GRADES, type NutriGrade } from '../types/nutrition'

/**
 * Escaneados recentemente: produtos abertos a partir do scanner (câmera ou código digitado),
 * do mais recente para o mais antigo. Guarda o necessário para a faixa abrir sem requisição.
 * Só entra o que existe na Open Food Facts: código não encontrado não vira histórico.
 */
export type RecentScan = {
  code: string
  scannedAt: number
  name: string
  brand?: string
  quantity?: string
  imageUrl?: string
  nutriscore: NutriGrade | null
}

/** Mais que isso, os mais antigos saem. */
const MAX_RECENT = 12

const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined)

const store = createLocalStore<RecentScan[]>(
  'scanbite.recent-scans',
  (raw) =>
    Array.isArray(raw)
      ? raw
          .filter((e) => typeof e?.code === 'string' && typeof e.scannedAt === 'number' && typeof e.name === 'string')
          .map((e) => ({
            code: e.code,
            scannedAt: e.scannedAt,
            name: e.name,
            brand: str(e.brand),
            quantity: str(e.quantity),
            imageUrl: str(e.imageUrl),
            nutriscore: NUTRI_GRADES.includes(e.nutriscore) ? e.nutriscore : null,
          }))
          .slice(0, MAX_RECENT)
      : [],
  [],
)

/** Registra a leitura; o mesmo produto lido de novo sobe para o início. */
export function addRecentScan(product: Product): void {
  const entry: RecentScan = {
    code: product.code,
    scannedAt: Date.now(),
    name: product.name ?? 'Produto sem nome',
    brand: product.brand ?? undefined,
    quantity: product.quantity ?? undefined,
    imageUrl: product.imageSmallUrl ?? product.imageUrl ?? undefined,
    nutriscore: product.nutriscore,
  }
  store.set((items) => [entry, ...items.filter((e) => e.code !== entry.code)].slice(0, MAX_RECENT))
}

export function clearRecentScans(): void {
  store.set((items) => (items.length ? [] : items))
}

/** Histórico de leituras (atualiza quando muda, nesta ou em outra aba). */
export const useRecentScans = store.use

/** Estado de navegação que marca a abertura do produto como leitura do scanner. */
export const SCANNED_STATE = { scanned: true } as const

const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

/** Curto, cabe no card compacto: "Hoje, 14:32" · "Ontem, 09:10" · "Há 3 dias" · "Em 02/10". */
export function scannedLabel(at: number, now = Date.now()): string {
  const startOfDay = (t: number) => new Date(t).setHours(0, 0, 0, 0)
  const days = Math.round((startOfDay(now) - startOfDay(at)) / 86_400_000)
  if (days <= 0) return `Hoje, ${time.format(at)}`
  if (days === 1) return `Ontem, ${time.format(at)}`
  if (days < 7) return `Há ${days} dias`
  return `Em ${date.format(at)}`
}
