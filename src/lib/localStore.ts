import { useSyncExternalStore } from 'react'

export type LocalStore<T> = {
  get: () => T
  /** Troca o valor (ou calcula a partir do atual). Valor igual (Object.is) não notifica ninguém. */
  set: (next: T | ((prev: T) => T)) => void
  /** Valor atual num componente; re-renderiza quando muda nesta ou em outra aba. */
  use: () => T
}

/**
 * Valor guardado no localStorage, compartilhado pelo app inteiro e sincronizado entre abas.
 * `parse` valida o que veio do armazenamento (formato antigo ou corrompido → `fallback`).
 * Sem armazenamento (modo privado, cota cheia), vale só na memória desta aba.
 */
export function createLocalStore<T>(key: string, parse: (raw: unknown) => T, fallback: T): LocalStore<T> {
  const listeners = new Set<() => void>()
  let current: T | null = null

  const read = (): T => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : parse(JSON.parse(raw))
    } catch {
      return fallback
    }
  }

  const get = (): T => {
    current ??= read()
    return current
  }

  const emit = () => {
    for (const l of listeners) l()
  }

  const set = (next: T | ((prev: T) => T)) => {
    const prev = get()
    const value = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
    if (Object.is(value, prev)) return
    current = value
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* sem armazenamento: vale só nesta aba */
    }
    emit()
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    // Outra aba mudou o valor.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return
      current = read()
      emit()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  const use = () => useSyncExternalStore(subscribe, get, () => fallback)

  return { get, set, use }
}
