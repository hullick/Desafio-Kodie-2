type Entry<T> = { value: T; expiresAt: number }

/**
 * Cache com validade: memória + sessionStorage (sobrevive a recarregar a página na mesma aba).
 * Falhas do sessionStorage (modo privado, cota cheia) são ignoradas: fica só a memória.
 */
export class ResponseCache<T> {
  private readonly prefix: string
  private readonly ttlMs: number
  private readonly memory = new Map<string, Entry<T>>()

  constructor(namespace: string, ttlMs: number) {
    this.prefix = `scanbite:${namespace}:`
    this.ttlMs = ttlMs
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
      sessionStorage.setItem(this.prefix + key, JSON.stringify(entry))
    } catch {
      /* sem sessionStorage: segue só com a memória */
    }
  }

  delete(key: string): void {
    this.memory.delete(key)
    try {
      sessionStorage.removeItem(this.prefix + key)
    } catch {
      /* ignorado */
    }
  }

  private readStorage(key: string): Entry<T> | undefined {
    try {
      const raw = sessionStorage.getItem(this.prefix + key)
      return raw ? (JSON.parse(raw) as Entry<T>) : undefined
    } catch {
      return undefined
    }
  }
}
