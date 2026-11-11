/** Sugestões rápidas de busca (Home e modal de busca do cabeçalho). */
export const SEARCH_SUGGESTIONS = ['Iogurte natural', 'Aveia', 'Refrigerante zero', 'Biscoito integral']

/** Parâmetro da URL com o termo buscado na Home, ex.: /?busca=aveia. */
export const SEARCH_PARAM = 'busca'

/** Endereço da Home buscando `term`. */
export const searchHref = (term: string) => `/?${new URLSearchParams({ [SEARCH_PARAM]: term })}`
