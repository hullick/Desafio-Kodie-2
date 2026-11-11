import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeading } from '../components/molecules/PageHeading'
import { StatHighlight } from '../components/molecules/StatHighlight'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ExportListModal } from '../components/organisms/ExportListModal'
import { FavoritesToolbar, type FavoritesFilter } from '../components/organisms/FavoritesToolbar'
import { ListAlertsCard } from '../components/organisms/ListAlertsCard'
import { MarketSyncModal } from '../components/organisms/MarketSyncModal'
import { PantryDiagnosisCard } from '../components/organisms/PantryDiagnosisCard'
import { ProductGrid } from '../components/organisms/ProductGrid'
import { PageTemplate } from '../components/templates/PageTemplate'
import { toggleChecklist, useChecklist } from '../hooks/useChecklist'
import { COMPARE_MAX, setCompareList, useCompareList } from '../hooks/useCompareList'
import {
  clearFavorites,
  FAVORITE_STALE_MS,
  favoriteProduct,
  refreshFavorites,
  removeFavorite,
  useFavorites,
} from '../hooks/useFavorites'
import { healthScore } from '../lib/healthScore'
import { toProductCard } from '../lib/productCard'
import type { Product } from '../models/Product'
import { getProductsByCodes } from '../services/openFoodFacts'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Adicionados recentemente' },
  { value: 'nutriscore', label: 'Melhor Nutri-Score' },
  { value: 'name', label: 'Nome (A-Z)' },
]

const FILTERS: Array<{ value: string; label: string; icon?: string; match: (p: Product) => boolean }> = [
  { value: 'all', label: 'Todos', match: () => true },
  { value: 'healthy', label: 'Nutri-Score A/B', icon: 'eco', match: (p) => p.nutriscore === 'a' || p.nutriscore === 'b' },
  { value: 'ultra', label: 'Ultraprocessados', icon: 'warning', match: (p) => p.nova === 4 },
  { value: 'drinks', label: 'Bebidas', icon: 'local_drink', match: (p) => p.categories.includes('beverages') },
]

const decimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Alertas "alto em" da lista, pelo semáforo da Open Food Facts (valores por 100 g/ml). */
function highAlerts(p: Product): Array<{ title: string; text: string; tone: 'error' }> {
  const n = p.nutriments
  const l = p.nutrientLevels
  const per = p.isLiquid ? '100 ml' : '100 g'
  const name = p.name ?? 'Produto sem nome'
  const items: Array<[boolean, string, string | null]> = [
    [l.sugars === 'high', 'açúcar', n.sugars === null ? null : `${decimal.format(n.sugars)} g`],
    [l.saturatedFat === 'high', 'gordura saturada', n.saturatedFat === null ? null : `${decimal.format(n.saturatedFat)} g`],
    [l.fat === 'high', 'gordura', n.fat === null ? null : `${decimal.format(n.fat)} g`],
    [l.salt === 'high', 'sódio', n.sodiumMg === null ? null : `${decimal.format(n.sodiumMg)} mg`],
  ]
  return items
    .filter(([high]) => high)
    .map(([, label, value]) => ({
      title: `Alto em ${label}`,
      text: value ? `${name} (${value} por ${per})` : name,
      tone: 'error' as const,
    }))
}

export function Favorites() {
  const favorites = useFavorites()
  const compare = useCompareList()
  const checklist = useChecklist()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [modal, setModal] = useState<'export' | 'market' | null>(null)

  // Mais recentes primeiro; favoritos sem dados (formato antigo) esperam a atualização abaixo.
  const saved = useMemo(
    () =>
      [...favorites]
        .sort((a, b) => b.addedAt - a.addedAt)
        .map(favoriteProduct)
        .filter((p): p is Product => p !== null),
    [favorites],
  )
  const pending = favorites.length - saved.length

  // Produtos no checklist de mercado (carrinho do card; a lista abre pelo carrinho do cabeçalho).
  const inCart = new Set(checklist.map((e) => e.code))

  // Dados guardados com mais de 24 h (ou ausentes) são atualizados numa busca só (code=a,b,c).
  // Falhou (sem internet, limite da API) ou o produto sumiu da base? Fica com os dados guardados,
  // e o código não é tentado de novo enquanto a tela estiver aberta.
  const attempted = useRef(new Set<string>())
  useEffect(() => {
    const now = Date.now()
    const stale = favorites
      .filter((e) => !attempted.current.has(e.code))
      .filter((e) => !e.product || !e.savedAt || now - e.savedAt > FAVORITE_STALE_MS)
      .map((e) => e.code)
    if (stale.length === 0) return
    stale.forEach((c) => attempted.current.add(c))
    getProductsByCodes(stale).then(refreshFavorites, () => {
      /* mantém os dados guardados */
    })
  }, [favorites])

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  const term = query.trim().toLowerCase()
  const activeFilter = FILTERS.find((f) => f.value === filter) ?? FILTERS[0]
  const visible = saved.filter((p) => activeFilter.match(p) && (!term || `${p.name ?? ''} ${p.brands.join(' ')}`.toLowerCase().includes(term)))
  if (sort === 'name') visible.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'pt-BR'))
  if (sort === 'nutriscore') visible.sort((a, b) => (a.nutriscore ?? 'z').localeCompare(b.nutriscore ?? 'z'))

  const health = healthScore(saved)
  const { scoreLabel, healthyShare, ultra } = health

  const alerts = saved.flatMap(highAlerts)

  const filters: FavoritesFilter[] = FILTERS.map(({ value, label, icon, match }) => ({ value, label, icon, count: saved.filter(match).length }))

  const listText = saved.map((p) => `• ${p.name ?? 'Produto sem nome'}${p.brand ? ` (${p.brand})` : ''}`).join('\n')
  const shareUrl = `${window.location.origin}/favoritos`

  return (
    <PageTemplate activeNav="favorites">
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <PageHeading
          title="Meus alimentos salvos"
          subtitle={`${favorites.length} ${favorites.length === 1 ? 'produto salvo' : 'produtos salvos'} neste aparelho`}
          description="Acompanhe a qualidade nutricional da sua lista e leve-a para o mercado."
          breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Favoritos' }]}
          aside={health.graded > 0 && <StatHighlight label="Nota da despensa" value={`${scoreLabel}/10`} indicator={`${healthyShare}% Nutri-Score A ou B`} />}
        />

        {favorites.length === 0 ? (
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
                {pending > 0 && (
                  <p className="mb-space-sm text-body-sm text-on-surface-variant" role="status">
                    Atualizando {pending} {pending === 1 ? 'produto' : 'produtos'}...
                  </p>
                )}
                {visible.length === 0 ? (
                  <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
                    Nenhum favorito corresponde à busca ou ao filtro.
                  </p>
                ) : (
                  <ProductGrid
                    view={view}
                    maxColumns={2}
                    products={visible.map((p) => ({
                      ...toProductCard(p),
                      id: p.code,
                      href: `/produto/${p.code}`,
                      favorite: true,
                      onToggleFavorite: () => removeFavorite(p.code),
                      cart: { active: inCart.has(p.code), onToggle: () => toggleChecklist(p) },
                      compare: {
                        checked: compare.includes(p.code),
                        onChange: () => setCompareList(toggle(compare, p.code)),
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
                  distribution={health.distribution}
                  score={health.graded ? `${scoreLabel} / 10` : undefined}
                  verdict={health.graded ? health.verdict : undefined}
                  processingNote={`${ultra} ${ultra === 1 ? 'item ultraprocessado' : 'itens ultraprocessados'} (NOVA 4)`}
                  onClearList={() => {
                    if (window.confirm('Remover todos os produtos dos favoritos?')) clearFavorites()
                  }}
                />
                {alerts.length > 0 && <ListAlertsCard alerts={alerts} />}
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
