type Entry<T> = { value: T; expiresAt: number }

/** session → só a aba atual (sobrevive a recarregar) · local → todas as abas e reaberturas do app. */
export type CacheStorage = 'session' | 'local'

/**
 * Cache com validade: memória + sessionStorage/localStorage.
 * Falhas do armazenamento (modo privado, cota cheia) são ignoradas: fica só a memória.
 */
export class ResponseCache<T> {
  private readonly prefix: string
  private readonly ttlMs: number
  private readonly storageKind: CacheStorage
  private readonly memory = new Map<string, Entry<T>>()

  constructor(namespace: string, ttlMs: number, storage: CacheStorage = 'session') {
    this.prefix = `scanbite:${namespace}:`
    this.ttlMs = ttlMs
    this.storageKind = storage
  }

  /** Lido a cada uso: o acesso pode lançar erro (ex.: armazenamento bloqueado). */
  private get storage(): Storage {
    return this.storageKind === 'local' ? localStorage : sessionStorage
  }

  get(key: string): T | undefined {
    const entry = this.memory.get(key) ?? this.readStorage(key)
    if (!entry) return undefined
    if (entry.expiresAt <= Date.now()) {
      this.delete(key)
      return undefined
    }
    this.memory.set(key, entry)
    return entry.value
  }

  set(key: string, value: T): void {
    const entry = { value, expiresAt: Date.now() + this.ttlMs }
    this.memory.set(key, entry)
    try {
      this.storage.setItem(this.prefix + key, JSON.stringify(entry))
    } catch {
      /* sem armazenamento: segue só com a memória */
    }
  }

  delete(key: string): void {
    this.memory.delete(key)
    try {
      this.storage.removeItem(this.prefix + key)
    } catch {
      /* ignorado */
    }
  }

  private readStorage(key: string): Entry<T> | undefined {
    try {
      const raw = this.storage.getItem(this.prefix + key)
      return raw ? (JSON.parse(raw) as Entry<T>) : undefined
    } catch {
      return undefined
    }
  }
}
