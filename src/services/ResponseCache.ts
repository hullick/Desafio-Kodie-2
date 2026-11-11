type Entry<T> = { value: T; expiresAt: number }

/**
 * Versão do formato dos dados guardados. Mudou o formato (ex.: campo novo em ProductData)?
 * Aumente: o que foi gravado antes é ignorado e apagado, em vez de chegar incompleto à interface.
 */
const CACHE_VERSION = 2
const ROOT_PREFIX = 'scanbite:'
const VERSION_PREFIX = `${ROOT_PREFIX}v${CACHE_VERSION}:`

/** Apaga chaves de versões anteriores do cache (uma vez por carga do app). */
function purgeOldVersions(): void {
  for (const storage of [() => sessionStorage, () => localStorage]) {
    try {
      const s = storage()
      const old: string[] = []
      for (let i = 0; i < s.length; i++) {
        const key = s.key(i)
        if (key?.startsWith(ROOT_PREFIX) && !key.startsWith(VERSION_PREFIX)) old.push(key)
      }
      old.forEach((key) => s.removeItem(key))
    } catch {
      /* sem armazenamento */
    }
  }
}
purgeOldVersions()

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
    this.prefix = `${VERSION_PREFIX}${namespace}:`
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
