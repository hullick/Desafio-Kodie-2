import { useMemo, useState } from 'react'
import { SortControl } from '../components/molecules/SortControl'
import { CompareTray } from '../components/organisms/CompareTray'
import { FilterPanel } from '../components/organisms/FilterPanel'
import { ProductResults } from '../components/organisms/ProductResults'
import { SearchHero } from '../components/organisms/SearchHero'
import { PageTemplate } from '../components/templates/PageTemplate'
import { EMPTY_FILTERS, type FilterState } from '../types/filters'
import { MOCK_CATEGORIES, MOCK_PRODUCTS, SORT_OPTIONS, SUGGESTIONS } from './home.mock'

const COMPARE_MAX = 4
const PAGE_SIZE = 6

export function Home() {
  const [query, setQuery] = useState('')
  const [term, setTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])

  const results = useMemo(() => {
    const t = term.trim().toLowerCase()
    const list = MOCK_PRODUCTS.filter(
      (p) =>
        (!t || `${p.name} ${p.brand ?? ''}`.toLowerCase().includes(t)) &&
        (filters.nutriscore.length === 0 || (p.nutriscore && filters.nutriscore.includes(p.nutriscore))) &&
        (filters.nova.length === 0 || (p.nova && filters.nova.includes(p.nova))) &&
        (!filters.category || p.category === filters.category),
    )
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'nutriscore') list.sort((a, b) => (a.nutriscore ?? 'z').localeCompare(b.nutriscore ?? 'z'))
    return list
  }, [term, filters, sort])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  const search = (t: string) => {
    setQuery(t)
    setTerm(t)
    setPage(1)
  }
  const changeFilters = (f: FilterState) => {
    setFilters(f)
    setPage(1)
  }

  const lastCompared = MOCK_PRODUCTS.find((p) => p.id === compare[compare.length - 1])
  const sortProps = { options: SORT_OPTIONS, value: sort, onChange: setSort }

  return (
    <PageTemplate activeNav="home" compareCount={compare.length} onHeaderSearch={search} fullWidth>
      <div className="px-margin lg:px-0">
        <SearchHero value={query} onChange={setQuery} onSubmit={search} suggestions={SUGGESTIONS} />
      </div>

      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-space-lg px-margin py-space-md lg:flex-row lg:px-margin-lg">
        <div className="lg:hidden">
          <FilterPanel variant="inline" value={filters} onChange={changeFilters} categories={MOCK_CATEGORIES} sort={sortProps} />
        </div>
        <div className="hidden w-72 shrink-0 lg:block">
          <FilterPanel
            variant="sidebar"
            value={filters}
            onChange={changeFilters}
            categories={MOCK_CATEGORIES}
            thresholds={[
              { label: 'Açúcares', valueLabel: '≤ 5g / 100g', percent: 25 },
              { label: 'Sódio', valueLabel: 'Qualquer teor', percent: 100, active: false },
            ]}
            claims={[
              { value: 'sem-gluten', label: 'Sem glúten' },
              { value: 'vegano', label: 'Vegano' },
              { value: 'organico', label: 'Orgânico' },
            ]}
            tip={{ title: 'Dica', text: 'Prefira alimentos com Nutri-Score A ou B e NOVA 1 ou 2.' }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <ProductResults
            total={results.length}
            compareCount={compare.length}
            compareMax={COMPARE_MAX}
            sort={<SortControl variant="segmented" {...sortProps} />}
            products={pageItems.map((p) => ({
              ...p,
              href: `/produto/${p.id}`,
              favorite: favorites.includes(p.id),
              onToggleFavorite: () => setFavorites((f) => toggle(f, p.id)),
              compare: {
                checked: compare.includes(p.id),
                onChange: () => setCompare((c) => toggle(c, p.id)),
                selectedCount: compare.length,
                max: COMPARE_MAX,
              },
              onContribute: () => {},
            }))}
            pagination={{ page, totalPages, onChange: setPage, totalItems: results.length, pageSize: PAGE_SIZE }}
            empty={
              <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
                Nenhum produto encontrado para os filtros escolhidos.
              </p>
            }
          />
        </div>
      </div>

      <CompareTray
        count={compare.length}
        lastItem={lastCompared && { name: lastCompared.name, imageUrl: lastCompared.imageUrl }}
        onClear={() => setCompare([])}
        compareHref="/comparar"
      />
    </PageTemplate>
  )
}
