import { useState } from 'react'
import { PageHeading } from '../components/molecules/PageHeading'
import { StatHighlight } from '../components/molecules/StatHighlight'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ExportListModal } from '../components/organisms/ExportListModal'
import { FavoritesToolbar, type FavoritesFilter } from '../components/organisms/FavoritesToolbar'
import { ListAlertsCard } from '../components/organisms/ListAlertsCard'
import { MarketSyncModal } from '../components/organisms/MarketSyncModal'
import { PantryDiagnosisCard } from '../components/organisms/PantryDiagnosisCard'
import { ProductGrid } from '../components/organisms/ProductGrid'
import { ShoppingChecklist } from '../components/organisms/ShoppingChecklist'
import { PageTemplate } from '../components/templates/PageTemplate'
import { NUTRI_BG } from '../lib/nutritionStyles'
import { NUTRI_GRADES, type NutriGrade } from '../types/nutrition'
import { MOCK_PRODUCTS, type MockProduct } from './home.mock'

const COMPARE_MAX = 5
/** Pontos por nota para a média da despensa (A = 10 … E = 2). */
const GRADE_POINTS: Record<NutriGrade, number> = { a: 10, b: 8, c: 6, d: 4, e: 2 }

const SORT_OPTIONS = [
  { value: 'recent', label: 'Adicionados recentemente' },
  { value: 'nutriscore', label: 'Melhor Nutri-Score' },
  { value: 'name', label: 'Nome (A-Z)' },
]

const FILTERS: Array<{ value: string; label: string; icon?: string; match: (p: MockProduct) => boolean }> = [
  { value: 'all', label: 'Todos', match: () => true },
  { value: 'healthy', label: 'Nutri-Score A/B', icon: 'eco', match: (p) => p.nutriscore === 'a' || p.nutriscore === 'b' },
  { value: 'ultra', label: 'Ultraprocessados', icon: 'warning', match: (p) => p.nova === 4 },
  { value: 'drinks', label: 'Bebidas', icon: 'local_drink', match: (p) => p.category === 'bebidas' },
]

/** Favoritos de exemplo: produtos da Home, guardados apenas no estado da página por enquanto. */
const INITIAL_FAVORITES = MOCK_PRODUCTS.slice(0, 5).map((p) => p.id)

function pantryVerdict(score: number) {
  if (score >= 8) return 'Excelente'
  if (score >= 6) return 'Boa'
  if (score >= 4) return 'Atenção'
  return 'Precisa melhorar'
}

export function Favorites() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const [compare, setCompare] = useState<string[]>([])
  const [checked, setChecked] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [modal, setModal] = useState<'export' | 'market' | null>(null)

  const saved = favorites.map((id) => MOCK_PRODUCTS.find((p) => p.id === id)).filter((p): p is MockProduct => Boolean(p))
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const term = query.trim().toLowerCase()
  const activeFilter = FILTERS.find((f) => f.value === filter) ?? FILTERS[0]
  const visible = saved.filter((p) => activeFilter.match(p) && (!term || `${p.name} ${p.brand ?? ''}`.toLowerCase().includes(term)))
  if (sort === 'name') visible.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'nutriscore') visible.sort((a, b) => (a.nutriscore ?? 'z').localeCompare(b.nutriscore ?? 'z'))

  const graded = saved.filter((p): p is MockProduct & { nutriscore: NutriGrade } => Boolean(p.nutriscore))
  const score = graded.length ? graded.reduce((s, p) => s + GRADE_POINTS[p.nutriscore], 0) / graded.length : 0
  const scoreLabel = score.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
  const healthyShare = graded.length ? Math.round((graded.filter((p) => GRADE_POINTS[p.nutriscore] >= 8).length / graded.length) * 100) : 0
  const ultra = saved.filter((p) => p.nova === 4)

  const alerts = saved.flatMap((p) =>
    p.nutrients
      .filter((n) => n.level === 'high')
      .map((n) => ({ title: `Alto em ${n.label.toLowerCase()}`, text: `${p.name} (${n.value} por 100 g)`, tone: 'error' as const })),
  )

  const filters: FavoritesFilter[] = FILTERS.map(({ value, label, icon, match }) => ({ value, label, icon, count: saved.filter(match).length }))

  const listText = saved.map((p) => `• ${p.name}${p.brand ? ` (${p.brand})` : ''}`).join('\n')
  const shareUrl = `${window.location.origin}/favoritos`

  return (
    <PageTemplate activeNav="favorites" compareCount={compare.length}>
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <PageHeading
          title="Meus alimentos salvos"
          subtitle={`${saved.length} ${saved.length === 1 ? 'produto salvo' : 'produtos salvos'} neste aparelho`}
          description="Acompanhe a qualidade nutricional da sua lista e leve-a para o mercado."
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Favoritos' }]}
          aside={graded.length > 0 && <StatHighlight label="Nota da despensa" value={`${scoreLabel}/10`} indicator={`${healthyShare}% Nutri-Score A ou B`} />}
        />

        {saved.length === 0 ? (
          <div className="py-space-xl">
            <ErrorHeroBlock
              icon="favorite"
              title="Sua lista está vazia"
              description="Toque no coração de um produto para salvá-lo aqui."
              primaryAction={{ label: 'Buscar produtos', icon: 'search', href: '/' }}
            />
          </div>
        ) : (
          <>
            <FavoritesToolbar
              query={query}
              onQueryChange={setQuery}
              filters={filters}
              activeFilter={filter}
              onFilterChange={setFilter}
              sortOptions={SORT_OPTIONS}
              sort={sort}
              onSortChange={setSort}
              view={view}
              onViewChange={setView}
              onExport={() => setModal('export')}
              onMarketMode={() => setModal('market')}
            />

            <div className="grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-8">
                {visible.length === 0 ? (
                  <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
                    Nenhum favorito corresponde à busca ou ao filtro.
                  </p>
                ) : (
                  <ProductGrid
                    view={view}
                    maxColumns={2}
                    products={visible.map((p) => ({
                      ...p,
                      href: `/produto/${p.id}`,
                      favorite: true,
                      onToggleFavorite: () => setFavorites((f) => f.filter((x) => x !== p.id)),
                      compare: {
                        checked: compare.includes(p.id),
                        onChange: () => setCompare((c) => toggle(c, p.id)),
                        selectedCount: compare.length,
                        max: COMPARE_MAX,
                      },
                    }))}
                  />
                )}
              </div>

              <aside className="flex flex-col gap-space-lg lg:sticky lg:top-24 lg:col-span-4">
                <PantryDiagnosisCard
                  summary={
                    <>
                      Sua lista tem <strong>{healthyShare}%</strong> de itens com Nutri-Score A ou B.
                    </>
                  }
                  distribution={NUTRI_GRADES.map((g) => ({
                    label: g.toUpperCase(),
                    count: graded.filter((p) => p.nutriscore === g).length,
                    colorClass: NUTRI_BG[g],
                  })).filter((s) => s.count > 0)}
                  score={graded.length ? `${scoreLabel} / 10` : undefined}
                  verdict={graded.length ? pantryVerdict(score) : undefined}
                  processingNote={`${ultra.length} ${ultra.length === 1 ? 'item ultraprocessado' : 'itens ultraprocessados'} (NOVA 4)`}
                  onClearList={() => setFavorites([])}
                />
                {alerts.length > 0 && <ListAlertsCard alerts={alerts} />}
                <div className="hidden lg:block">
                  <ShoppingChecklist
                    items={saved.map((p) => ({ id: p.id, title: p.name, detail: [p.brand, p.quantity].filter(Boolean).join(' · '), checked: checked.includes(p.id) }))}
                    onToggle={(id) => setChecked((c) => toggle(c, id))}
                    onOpenOnPhone={() => setModal('market')}
                    onPrint={() => window.print()}
                  />
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      <ExportListModal
        open={modal === 'export'}
        onClose={() => setModal(null)}
        onExportPdf={() => window.print()}
        onShareWhatsApp={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Minha lista ScanBite:\n${listText}`)}`, '_blank', 'noopener')}
      />
      <MarketSyncModal open={modal === 'market'} onClose={() => setModal(null)} link={shareUrl} />
    </PageTemplate>
  )
}
