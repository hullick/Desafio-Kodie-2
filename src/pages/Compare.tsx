import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { BadgeNova } from '../components/atoms/BadgeNova'
import { BadgeNutriScore } from '../components/atoms/BadgeNutriScore'
import { Skeleton } from '../components/atoms/Skeleton'
import { ComparisonHeader } from '../components/molecules/ComparisonHeader'
import { ComparisonDuelCarousel } from '../components/organisms/ComparisonDuelCarousel'
import { ComparisonFullTable, type ComparisonGroup } from '../components/organisms/ComparisonFullTable'
import { DecisionBar } from '../components/organisms/DecisionBar'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { NutrientDuelSection, type NutrientDuelBlock } from '../components/organisms/NutrientDuelSection'
import { NutritionalVerdictCard, type VerdictInsight } from '../components/organisms/NutritionalVerdictCard'
import { RelatedProductsGrid } from '../components/organisms/RelatedProductsGrid'
import { PageTemplate } from '../components/templates/PageTemplate'
import { useCatalog } from '../hooks/useCatalog'
import { COMPARE_MAX, setCompareList, useCompareList } from '../hooks/useCompareList'
import { useCompareProducts } from '../hooks/useCompareProducts'
import { useCategoryNames } from '../i18n/categoryNames'
import { isValidBarcode, normalizeBarcode } from '../lib/barcode'
import { barPercents, formatAmount, healthScore, rankTones } from '../lib/compare'
import {
  basisLabel,
  relatedFrom,
  sharedCategory,
  sharedCategoryName,
  toCompareEntries,
  type CompareNutrients,
} from '../lib/compareProducts'
import type { CompareTone } from '../types/comparison'

type Metric = { key: keyof CompareNutrients; label: string; unit: string; lowerIsBetter: boolean }

const DUEL_METRICS: Array<Metric & { icon: string; iconTone: NutrientDuelBlock['iconTone']; criterion: string }> = [
  { key: 'sugar', label: 'Açúcares', unit: 'g', lowerIsBetter: true, icon: 'icecream', iconTone: 'error', criterion: 'Menor é melhor' },
  { key: 'fiber', label: 'Fibras alimentares', unit: 'g', lowerIsBetter: false, icon: 'grass', iconTone: 'primary', criterion: 'Maior é melhor' },
  { key: 'sodium', label: 'Sódio', unit: 'mg', lowerIsBetter: true, icon: 'water_drop', iconTone: 'error', criterion: 'Menor é melhor' },
  { key: 'saturatedFat', label: 'Gorduras saturadas', unit: 'g', lowerIsBetter: true, icon: 'opacity', iconTone: 'neutral', criterion: 'Menor é melhor' },
  { key: 'energy', label: 'Energia', unit: 'kcal', lowerIsBetter: true, icon: 'bolt', iconTone: 'neutral', criterion: 'Referência' },
]

const TABLE_GROUPS: Array<{ title: string; metrics: Metric[] }> = [
  { title: 'Carboidratos e açúcares', metrics: [{ key: 'sugar', label: 'Açúcares', unit: 'g', lowerIsBetter: true }] },
  { title: 'Fibras e proteínas', metrics: [
    { key: 'fiber', label: 'Fibras', unit: 'g', lowerIsBetter: false },
    { key: 'protein', label: 'Proteínas', unit: 'g', lowerIsBetter: false },
  ] },
  { title: 'Gorduras', metrics: [
    { key: 'fat', label: 'Gorduras totais', unit: 'g', lowerIsBetter: true },
    { key: 'saturatedFat', label: 'Gorduras saturadas', unit: 'g', lowerIsBetter: true },
  ] },
  { title: 'Minerais e energia', metrics: [
    { key: 'sodium', label: 'Sódio', unit: 'mg', lowerIsBetter: true },
    { key: 'energy', label: 'Energia', unit: 'kcal', lowerIsBetter: true },
  ] },
  { title: 'Ingredientes', metrics: [{ key: 'additives', label: 'Aditivos', unit: '', lowerIsBetter: true }] },
]

/** Códigos da URL (?ids=a,b,c): válidos, sem repetição, até COMPARE_MAX. */
function parseIds(raw: string | null): string[] {
  const ids = (raw ?? '').split(',').map(normalizeBarcode).filter(isValidBarcode)
  return [...new Set(ids)].slice(0, COMPARE_MAX)
}

export function Compare() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const stored = useCompareList()
  // ?ids= na URL (link da Home, dos detalhes, compartilhado) manda; sem ele (menu "Comparador"),
  // volta a última comparação guardada no aparelho.
  const fromUrl = params.get('ids')
  const ids = parseIds(fromUrl ?? stored.join(','))
  const key = ids.join(',')

  useEffect(() => {
    if (fromUrl !== null) setCompareList(key ? key.split(',') : [])
    else if (key) setParams({ ids: key }, { replace: true })
  }, [fromUrl, key, setParams])

  /** Remover/limpar: atualiza a URL e a lista guardada juntas. */
  const setIds = (next: string[]) => {
    setCompareList(next)
    setParams(next.length ? { ids: next.join(',') } : {}, { replace: true })
  }

  const state = useCompareProducts(ids)
  const catalog = useCatalog()
  const categoryNames = useCategoryNames()
  const loaded = useMemo(() => (state.status === 'success' ? state.products : []), [state])

  const products = useMemo(() => {
    const list = toCompareEntries(loaded)
    const ranked = [...list].sort((a, b) => healthScore(a.nutriscore, a.nova) - healthScore(b.nutriscore, b.nova))
    return list.map((p) => ({ ...p, rank: ranked.indexOf(p) + 1 }))
  }, [loaded])

  if (state.status === 'loading') return <CompareLoading count={ids.length} />

  if (products.length < 2) {
    return (
      <PageTemplate activeNav="compare" compareCount={products.length}>
        <div className="px-margin py-space-2xl lg:px-0">
          <ErrorHeroBlock
            icon="compare_arrows"
            title="Escolha pelo menos 2 produtos"
            description="Na busca, marque “Comparar” nos produtos que você quer colocar lado a lado (até 5)."
            primaryAction={{ label: 'Buscar produtos', icon: 'search', href: '/' }}
            secondaryAction={{ label: 'Escanear um produto', icon: 'barcode_scanner', href: '/scanner' }}
          />
        </div>
      </PageTemplate>
    )
  }

  const basis = basisLabel(loaded)
  const per = basis === '100ml' ? '100 ml' : basis === '100g' ? '100 g' : '100 g/ml'
  const values = (key: keyof CompareNutrients) => products.map((p) => p.nutrients[key])
  const best = products.find((p) => p.rank === 1) ?? products[0]
  const podium = [...products].sort((a, b) => a.rank - b.rank)

  const blocks: NutrientDuelBlock[] = DUEL_METRICS.map((m) => {
    const v = values(m.key)
    const tones = rankTones(v, m.lowerIsBetter)
    const percents = barPercents(v)
    const winner = products[tones.indexOf('best')]
    return {
      title: m.label,
      icon: m.icon,
      iconTone: m.iconTone,
      criterion: m.criterion,
      winner:
        winner && m.key !== 'energy'
          ? `Vencedor: ${winner.shortName} (${formatAmount(winner.nutrients[m.key], m.unit)})`
          : undefined,
      bars: products.map((p, i) => ({ label: p.shortName, value: formatAmount(v[i], m.unit), percent: percents[i], tone: m.key === 'energy' ? 'neutral' : tones[i] })),
    }
  })

  const rankTone = (rank: number): CompareTone => (rank === 1 ? 'best' : rank === products.length ? 'worst' : 'neutral')
  const groups: ComparisonGroup[] = [
    {
      title: 'Classificações gerais',
      rows: [
        { label: 'Nutri-Score', cells: products.map((p) => ({ value: <BadgeNutriScore grade={p.nutriscore} variant="pill" />, tone: rankTone(p.rank) })) },
        { label: 'NOVA', cells: products.map((p) => ({ value: p.nova ? <BadgeNova group={p.nova} /> : '—' })) },
      ],
    },
    ...TABLE_GROUPS.map((g) => ({
      title: g.title,
      rows: g.metrics.map((m) => {
        const v = values(m.key)
        const tones = rankTones(v, m.lowerIsBetter)
        return { label: m.label, cells: v.map((x, i) => ({ value: formatAmount(x, m.unit), tone: tones[i] })) }
      }),
    })),
  ]

  /** Produto com o menor valor informado do nutriente (só se 2+ produtos tiverem o valor). */
  const lowest = (key: 'sugar' | 'sodium') => {
    const known = products.filter((p) => p.nutrients[key] !== null)
    return known.length < 2 ? undefined : [...known].sort((a, b) => a.nutrients[key]! - b.nutrients[key]!)[0]
  }
  const leastSugar = lowest('sugar')
  const leastSodium = lowest('sodium')
  const insights: VerdictInsight[] = []
  if (leastSugar) {
    insights.push({
      icon: 'monitor_heart',
      title: 'Controle glicêmico',
      text: `${leastSugar.shortName} tem o menor teor de açúcar: ${formatAmount(leastSugar.nutrients.sugar, 'g')} por ${per}.`,
    })
  }
  if (leastSodium) {
    insights.push({
      icon: 'cardiology',
      title: 'Proteção cardiovascular',
      text: `${leastSodium.shortName} tem o menor teor de sódio: ${formatAmount(leastSodium.nutrients.sodium, 'mg')} por ${per}.`,
    })
  }

  const sugars = values('sugar').filter((v): v is number => v !== null)
  const sugarSaved = best.nutrients.sugar === null || sugars.length < 2 ? 0 : Math.max(...sugars) - best.nutrients.sugar

  // Sugestões do catálogo da Home (o mesmo cache; busca só se não estiver guardado).
  const category = sharedCategory(loaded)
  const related = relatedFrom(catalog ?? [], category, ids)

  return (
    <PageTemplate activeNav="compare" compareCount={products.length}>
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ComparisonHeader
          count={products.length}
          category={sharedCategoryName(loaded, categoryNames)}
          onClear={() => setIds([])}
          basis={basis}
        />

        <ComparisonDuelCarousel products={products} onRemove={(id) => setIds(ids.filter((x) => x !== id))} onSwap={() => navigate('/')} />

        <NutrientDuelSection blocks={blocks} products={products} basis={basis} />

        <ComparisonFullTable products={products} groups={groups} basis={basis} />

        <NutritionalVerdictCard
          summary={
            <>
              <strong>{best.shortName}</strong> é a opção mais equilibrada desta comparação: Nutri-Score{' '}
              {best.nutriscore?.toUpperCase() ?? '—'} e NOVA {best.nova ?? '—'}.
            </>
          }
          podium={podium.map((p) => ({ name: p.shortName, nutriscore: p.nutriscore, nova: p.nova }))}
          insights={insights}
          methodology={`Comparação baseada no Nutri-Score, na classificação NOVA e nos valores por ${per} da Open Food Facts. Valores não informados aparecem como "—". Não substitui orientação de um profissional de saúde.`}
        />

        {related.length > 0 && (
          <RelatedProductsGrid
            eyebrow="Para comparar também"
            title="Outros bem avaliados"
            items={related}
            // Abre a busca já filtrada pela categoria da comparação (só existe sugestão com categoria comum).
            seeAllHref={`/?categoria=${category}`}
            seeAllLabel="Ver mais nesta categoria"
          />
        )}

        <DecisionBar
          message={
            sugarSaved > 0
              ? `Economize ${formatAmount(sugarSaved, 'g')} de açúcar a cada ${per} escolhendo ${best.shortName}.`
              : `${best.shortName} tem a melhor classificação geral.`
          }
          primaryLabel={`Ver ${best.shortName}`}
          onPrimary={() => navigate(best.href)}
          onCompareAnother={() => navigate('/')}
        />
      </div>
    </PageTemplate>
  )
}

/** Carregando os produtos da comparação. */
function CompareLoading({ count }: { count: number }) {
  return (
    <PageTemplate activeNav="compare" compareCount={count}>
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl" aria-busy>
        <span className="sr-only">Carregando produtos...</span>
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
          {Array.from({ length: Math.max(2, count) }, (_, i) => (
            <Skeleton key={i} shimmer className="h-56 rounded-2xl" />
          ))}
        </div>
        <Skeleton tone="soft" className="h-72 w-full rounded-2xl" />
      </div>
    </PageTemplate>
  )
}
