import { useSyncExternalStore } from 'react'

/**
 * Lista de comparação (códigos de barras, na ordem em que foram escolhidos), guardada no aparelho:
 * vale para a Home, o comparador e o contador do menu, sobrevive a recarregar e se sincroniza
 * entre abas.
 * A chave fica fora do prefixo "scanbite:" do cache da API de propósito: a limpeza de versões do
 * cache (ResponseCache) apagaria a seleção da pessoa.
 */
const STORAGE_KEY = 'scanbite.compare'

/** Máximo de produtos no comparador (SPEC: 2 a 5). */
export const COMPARE_MAX = 5

const EMPTY: string[] = []
const listeners = new Set<() => void>()
let current: string[] | null = null

function read(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : EMPTY
  } catch {
    return EMPTY
  }
}

function snapshot(): string[] {
  current ??= read()
  return current
}

function emit(): void {
  for (const l of listeners) l()
}

/** Troca a lista inteira (sem repetidos, até COMPARE_MAX). */
export function setCompareList(codes: string[]): void {
  const next = [...new Set(codes)].slice(0, COMPARE_MAX)
  const prev = snapshot()
  if (next.length === prev.length && next.every((c, i) => c === prev[i])) return
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* sem armazenamento: vale só nesta aba */
  }
  emit()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  // Outra aba mudou a lista.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    current = read()
    emit()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Códigos na lista de comparação (atualiza quando ela muda, nesta ou em outra aba). */
export function useCompareList(): string[] {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY)
}
