import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { SortControl } from '../components/molecules/SortControl'
import { CompareTray } from '../components/organisms/CompareTray'
import { FilterPanel } from '../components/organisms/FilterPanel'
import { LoadingResults } from '../components/organisms/LoadingResults'
import { ProductResults } from '../components/organisms/ProductResults'
import { SearchHero } from '../components/organisms/SearchHero'
import { PageTemplate } from '../components/templates/PageTemplate'
import { SEARCH_PARAM, SEARCH_SUGGESTIONS } from '../config/search'
import { THRESHOLDS } from '../config/thresholds'
import { COMPARE_MAX, setCompareList, useCompareList } from '../hooks/useCompareList'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { toggleFavorite, useFavoriteCodes } from '../hooks/useFavorites'
import { useProductSearch } from '../hooks/useProductSearch'
import { useCategoryNames } from '../i18n/categoryNames'
import { buildCategoryOptions } from '../lib/categoryOptions'
import { toProductCard } from '../lib/productCard'
import type { Product } from '../models/Product'
import { EMPTY_FILTERS, type FilterState } from '../types/filters'
import { SORT_OPTIONS } from './home.mock'

const PAGE_SIZE = 12
/** Espera após mexer nos limiares antes de filtrar (o controle responde na hora). */
const THRESHOLD_DELAY_MS = 500

/** Sem nota vai para o fim na ordenação por Nutri-Score. */
const gradeRank = (p: Product) => p.nutriscore ?? 'z'

/** Parâmetro da URL com a categoria (tag sem "en:"), ex.: /?categoria=milk-powders. */
const CATEGORY_PARAM = 'categoria'

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  // O termo buscado vive na URL (/?busca=...): a lupa das outras telas abre a Home já buscando,
  // e voltar/avançar no navegador troca a busca.
  const term = (searchParams.get(SEARCH_PARAM) ?? '').trim()
  const [query, setQuery] = useState(term)
  const [page, setPage] = useState(1)
  const [shownTerm, setShownTerm] = useState(term)
  if (shownTerm !== term) {
    // Termo mudou pela URL (outra busca, voltar/avançar): o campo e a paginação acompanham.
    setShownTerm(term)
    setQuery(term)
    setPage(1)
  }
  // Links de outras telas (comparador, detalhes) abrem a Home já filtrada pela categoria.
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...EMPTY_FILTERS,
    category: searchParams.get(CATEGORY_PARAM) ?? '',
  }))
  const [sort, setSort] = useState('relevance')
  const favorites = useFavoriteCodes()
  // Seleção para comparar: a mesma lista guardada que o comparador usa (volta ao reabrir o app).
  const compare = useCompareList()

  // Só abrir a Home (catálogo em cache) ou buscar um texto vai à API. Categoria, Nutri-Score,
  // NOVA, ordenação e paginação filtram os produtos já carregados, sem novas requisições.
  const search = useProductSearch(term)
  const thresholds = useDebouncedValue(filters.thresholds, THRESHOLD_DELAY_MS)
  const categoryNames = useCategoryNames()

  // Categorias do filtro: as que aparecem nos produtos carregados, no idioma do navegador.
  // A escolhida (ex.: vinda da URL) entra mesmo fora das principais, para o filtro aparecer marcado.
  const categories = useMemo(() => {
    if (search.status !== 'success' || !categoryNames) return []
    const options = buildCategoryOptions(search.page.products, categoryNames)
    const selected = filters.category
    if (!selected || options.some((o) => o.value === selected)) return options
    const count = search.page.products.filter((p) => p.categories.includes(selected)).length
    return [{ value: selected, label: `${categoryNames[selected] ?? selected} (${count})` }, ...options]
  }, [search, categoryNames, filters.category])

  const results = useMemo(() => {
    if (search.status !== 'success') return []
    const category = filters.category
    // Limiar ativo: só passa quem tem o valor informado e dentro do limite.
    const limits = THRESHOLDS.filter((t) => thresholds[t.key].enabled)
    const list = search.page.products.filter(
      (p) =>
        (!category || p.categories.includes(category)) &&
        limits.every((t) => {
          const v = p.nutriments[t.field]
          return v !== null && v <= thresholds[t.key].max
        }) &&
        (filters.nutriscore.length === 0 || (p.nutriscore && filters.nutriscore.includes(p.nutriscore))) &&
        (filters.nova.length === 0 || (p.nova && filters.nova.includes(p.nova))),
    )
    if (sort === 'name') list.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'pt-BR'))
    if (sort === 'nutriscore') list.sort((a, b) => gradeRank(a).localeCompare(gradeRank(b)))
    return list
  }, [search, filters.category, filters.nutriscore, filters.nova, thresholds, sort])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  /** Mantém a categoria da URL igual à do filtro (recarregar ou compartilhar o link mantém a escolha). */
  const syncCategoryParam = (category: string) => {
    if ((searchParams.get(CATEGORY_PARAM) ?? '') === category) return
    const next = new URLSearchParams(searchParams)
    if (category) next.set(CATEGORY_PARAM, category)
    else next.delete(CATEGORY_PARAM)
    setSearchParams(next, { replace: true })
  }
  const submitSearch = (t: string) => {
    const next = new URLSearchParams(searchParams)
    const clean = t.trim()
    if (clean) next.set(SEARCH_PARAM, clean)
    else next.delete(SEARCH_PARAM)
    // Outros produtos → outras categorias: a escolhida pode não existir mais.
    next.delete(CATEGORY_PARAM)
    setFilters((f) => ({ ...f, category: '' }))
    setQuery(t)
    setPage(1)
    // Entra no histórico: "voltar" desfaz a busca.
    setSearchParams(next)
  }
  const changeFilters = (f: FilterState) => {
    setFilters(f)
    syncCategoryParam(f.category)
    setPage(1)
  }

  const lastCompared = results.find((p) => p.code === compare[compare.length - 1])
  const sortProps = { options: SORT_OPTIONS, value: sort, onChange: setSort }

  return (
    <PageTemplate activeNav="home" compareCount={compare.length} hideSearch fullWidth>
      <div className="px-margin lg:px-0">
        <SearchHero value={query} onChange={setQuery} onSubmit={submitSearch} suggestions={SEARCH_SUGGESTIONS} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-space-lg px-margin py-space-md lg:flex-row lg:px-margin-lg">
        <div className="lg:hidden">
          <FilterPanel variant="inline" value={filters} onChange={changeFilters} categories={categories} sort={sortProps} />
        </div>
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterPanel
            variant="sidebar"
            value={filters}
            onChange={changeFilters}
            categories={categories}
            thresholds={THRESHOLDS}
            claims={[
              { value: 'sem-gluten', label: 'Sem glúten' },
              { value: 'vegano', label: 'Vegano' },
              { value: 'organico', label: 'Orgânico' },
            ]}
            tip={{ title: 'Dica', text: 'Prefira alimentos com Nutri-Score A ou B e NOVA 1 ou 2.' }}
          />
        </div>

        <div className="min-w-0 flex-1">
          {search.status === 'loading' ? (
            <LoadingResults count={PAGE_SIZE / 2} message="Buscando produtos na Open Food Facts..." />
          ) : (
            <ProductResults
              total={results.length}
              compareCount={compare.length}
              compareMax={COMPARE_MAX}
              sort={<SortControl variant="segmented" {...sortProps} />}
              products={pageItems.map((p) => ({
                ...toProductCard(p),
                id: p.code,
                href: `/produto/${p.code}`,
                favorite: favorites.has(p.code),
                onToggleFavorite: () => toggleFavorite(p),
                compare: {
                  checked: compare.includes(p.code),
                  onChange: () => setCompareList(toggle(compare, p.code)),
                  selectedCount: compare.length,
                  max: COMPARE_MAX,
                },
                onContribute: () => {},
              }))}
              pagination={
                results.length > 0
                  ? { page, totalPages, onChange: setPage, totalItems: results.length, pageSize: PAGE_SIZE }
                  : undefined
              }
              empty={
                <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
                  {search.status === 'error'
                    ? 'Não foi possível carregar os produtos. Tente novamente.'
                    : 'Nenhum produto encontrado para os filtros escolhidos.'}
                </p>
              }
            />
          )}
        </div>
      </div>

      <CompareTray
        count={compare.length}
        lastItem={lastCompared && { name: lastCompared.name ?? 'Produto', imageUrl: lastCompared.imageSmallUrl ?? undefined }}
        onClear={() => setCompareList([])}
        compareHref={`/comparar?ids=${compare.join(',')}`}
      />
    </PageTemplate>
  )
}
