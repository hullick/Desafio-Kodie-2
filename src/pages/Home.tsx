import { useMemo, useState } from 'react'
import { SortControl } from '../components/molecules/SortControl'
import { CompareTray } from '../components/organisms/CompareTray'
import { FilterPanel } from '../components/organisms/FilterPanel'
import { LoadingResults } from '../components/organisms/LoadingResults'
import { ProductResults } from '../components/organisms/ProductResults'
import { SearchHero } from '../components/organisms/SearchHero'
import { PageTemplate } from '../components/templates/PageTemplate'
import { HOME_CATEGORIES, offCategoryTag } from '../config/categories'
import { THRESHOLDS } from '../config/thresholds'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useProductSearch } from '../hooks/useProductSearch'
import { toProductCard } from '../lib/productCard'
import type { Product } from '../models/Product'
import { EMPTY_FILTERS, type FilterState } from '../types/filters'
import { SORT_OPTIONS, SUGGESTIONS } from './home.mock'

const COMPARE_MAX = 4
const PAGE_SIZE = 12
/** Espera após mexer nos limiares antes de filtrar (o controle responde na hora). */
const THRESHOLD_DELAY_MS = 500

/** Sem nota vai para o fim na ordenação por Nutri-Score. */
const gradeRank = (p: Product) => p.nutriscore ?? 'z'

export function Home() {
  const [query, setQuery] = useState('')
  const [term, setTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])

  // Só abrir a Home (catálogo em cache) ou buscar um texto vai à API. Categoria, Nutri-Score,
  // NOVA, ordenação e paginação filtram os produtos já carregados, sem novas requisições.
  const search = useProductSearch(term)
  const thresholds = useDebouncedValue(filters.thresholds, THRESHOLD_DELAY_MS)

  const results = useMemo(() => {
    if (search.status !== 'success') return []
    const category = offCategoryTag(filters.category)
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
  const submitSearch = (t: string) => {
    setQuery(t)
    setTerm(t.trim())
    setPage(1)
  }
  const changeFilters = (f: FilterState) => {
    setFilters(f)
    setPage(1)
  }

  const lastCompared = results.find((p) => p.code === compare[compare.length - 1])
  const sortProps = { options: SORT_OPTIONS, value: sort, onChange: setSort }

  return (
    <PageTemplate activeNav="home" compareCount={compare.length} onHeaderSearch={submitSearch} fullWidth>
      <div className="px-margin lg:px-0">
        <SearchHero value={query} onChange={setQuery} onSubmit={submitSearch} suggestions={SUGGESTIONS} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-space-lg px-margin py-space-md lg:flex-row lg:px-margin-lg">
        <div className="lg:hidden">
          <FilterPanel variant="inline" value={filters} onChange={changeFilters} categories={HOME_CATEGORIES} sort={sortProps} />
        </div>
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterPanel
            variant="sidebar"
            value={filters}
            onChange={changeFilters}
            categories={HOME_CATEGORIES}
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
                favorite: favorites.includes(p.code),
                onToggleFavorite: () => setFavorites((f) => toggle(f, p.code)),
                compare: {
                  checked: compare.includes(p.code),
                  onChange: () => setCompare((c) => toggle(c, p.code)),
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
        onClear={() => setCompare([])}
        compareHref="/comparar"
      />
    </PageTemplate>
  )
}
