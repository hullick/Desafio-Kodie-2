import { createLocalStore } from '../lib/localStore'

/** Máximo de produtos no comparador (SPEC: 2 a 5). */
export const COMPARE_MAX = 5

/**
 * Lista de comparação (códigos de barras, na ordem em que foram escolhidos), guardada no aparelho:
 * vale para a Home, o comparador e o contador do menu, sobrevive a recarregar e se sincroniza
 * entre abas.
 * A chave fica fora do prefixo "scanbite:" do cache da API de propósito: a limpeza de versões do
 * cache (ResponseCache) apagaria a seleção da pessoa.
 */
const store = createLocalStore<string[]>(
  'scanbite.compare',
  (raw) => (Array.isArray(raw) ? raw.filter((c): c is string => typeof c === 'string') : []),
  [],
)

/** Troca a lista inteira (sem repetidos, até COMPARE_MAX). Lista igual não notifica ninguém. */
export function setCompareList(codes: string[]): void {
  const next = [...new Set(codes)].slice(0, COMPARE_MAX)
  store.set((prev) => (next.length === prev.length && next.every((c, i) => c === prev[i]) ? prev : next))
}

/** Códigos na lista de comparação (atualiza quando ela muda, nesta ou em outra aba). */
export const useCompareList = store.use
