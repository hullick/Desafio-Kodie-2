import { createLocalStore } from '../lib/localStore'
import type { Product } from '../models/Product'
import { NOVA_GROUPS, NUTRI_GRADES, type NovaGroup, type NutriGrade } from '../types/nutrition'

/**
 * Checklist de mercado (mobile): produtos que a pessoa pôs no carrinho (de qualquer card, favorito
 * ou não), na ordem em que entraram, e se já foram pegos. Guarda nome e detalhe do produto para a
 * lista abrir sem internet no mercado e sobreviver a recarregar, e Nutri-Score/NOVA para a nota do carrinho.
 */
export type ChecklistEntry = {
  code: string
  title: string
  /** Marca · quantidade. */
  detail?: string
  nutriscore: NutriGrade | null
  nova: NovaGroup | null
  checked: boolean
}

const store = createLocalStore<ChecklistEntry[]>(
  'scanbite.checklist',
  (raw) =>
    Array.isArray(raw)
      ? raw
          // Entradas sem título (formato anterior, só com o código) não têm o que mostrar: ficam de fora.
          .filter((e): e is ChecklistEntry => typeof e?.code === 'string' && typeof e.title === 'string')
          .map((e) => ({
            code: e.code,
            title: e.title,
            detail: typeof e.detail === 'string' ? e.detail : undefined,
            // Itens guardados antes da nota do carrinho não têm Nutri-Score/NOVA: contam como "sem nota".
            nutriscore: NUTRI_GRADES.includes(e.nutriscore as NutriGrade) ? e.nutriscore : null,
            nova: NOVA_GROUPS.includes(e.nova as NovaGroup) ? e.nova : null,
            checked: e.checked === true,
          }))
      : [],
  [],
)

/** Põe o produto no checklist ou tira dele. */
export function toggleChecklist(product: Product): void {
  store.set((items) =>
    items.some((e) => e.code === product.code)
      ? items.filter((e) => e.code !== product.code)
      : [
          ...items,
          {
            code: product.code,
            title: product.name ?? 'Produto sem nome',
            detail: [product.brand, product.quantity].filter(Boolean).join(' · ') || undefined,
            nutriscore: product.nutriscore,
            nova: product.nova,
            checked: false,
          },
        ],
  )
}

/** Marca ou desmarca o produto como pego. */
export function setChecklistChecked(code: string, checked: boolean): void {
  store.set((items) => (items.some((e) => e.code === code && e.checked !== checked) ? items.map((e) => (e.code === code ? { ...e, checked } : e)) : items))
}

/** Tira o produto do checklist. */
export function removeFromChecklist(code: string): void {
  store.set((items) => (items.some((e) => e.code === code) ? items.filter((e) => e.code !== code) : items))
}

/** Esvazia o checklist. */
export function clearChecklist(): void {
  store.set((items) => (items.length ? [] : items))
}

/** Itens do checklist (atualiza quando ele muda, nesta ou em outra aba). */
export const useChecklist = store.use
