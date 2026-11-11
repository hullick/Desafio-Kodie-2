import { useNavigate, useSearchParams } from 'react-router'
import { BadgeNova } from '../components/atoms/BadgeNova'
import { BadgeNutriScore } from '../components/atoms/BadgeNutriScore'
import { ComparisonHeader } from '../components/molecules/ComparisonHeader'
import { ComparisonDuelCarousel } from '../components/organisms/ComparisonDuelCarousel'
import { ComparisonFullTable, type ComparisonGroup } from '../components/organisms/ComparisonFullTable'
import { DecisionBar } from '../components/organisms/DecisionBar'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { NutrientDuelSection, type NutrientDuelBlock } from '../components/organisms/NutrientDuelSection'
import { NutritionalVerdictCard } from '../components/organisms/NutritionalVerdictCard'
import { RelatedProductsGrid } from '../components/organisms/RelatedProductsGrid'
import { PageTemplate } from '../components/templates/PageTemplate'
import { barPercents, formatAmount, healthScore, rankTones } from '../lib/compare'
import type { CompareTone } from '../types/comparison'
import { COMPARE_PRODUCTS, DEFAULT_COMPARE_IDS, type CompareEntry, type CompareNutrients } from './compare.mock'
import { POPULAR_ITEMS } from './shared.mock'

const COMPARE_MAX = 5

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

function parseIds(raw: string | null): string[] {
  const ids = raw === null ? DEFAULT_COMPARE_IDS : raw.split(',').filter(Boolean)
  return [...new Set(ids)].filter((id) => COMPARE_PRODUCTS.some((p) => p.id === id)).slice(0, COMPARE_MAX)
}

export function Compare() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const ids = parseIds(params.get('ids'))
  const setIds = (next: string[]) => setParams({ ids: next.join(',') }, { replace: true })

  const list = ids.map((id) => COMPARE_PRODUCTS.find((p) => p.id === id)).filter((p): p is CompareEntry => Boolean(p))
  const ranked = [...list].sort((a, b) => healthScore(a.nutriscore, a.nova) - healthScore(b.nutriscore, b.nova))
  const products = list.map((p) => ({ ...p, rank: ranked.indexOf(p) + 1 }))

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
      winner: winner && m.key !== 'energy' ? `Vencedor: ${winner.shortName} (${formatAmount(winner.nutrients[m.key], m.unit)})` : undefined,
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
        return { label: m.label, cells: v.map((x, i) => ({ value: m.unit ? formatAmount(x, m.unit) : String(x), tone: tones[i] })) }
      }),
    })),
  ]

  const bySugar = [...products].sort((a, b) => a.nutrients.sugar - b.nutrients.sugar)
  const bySodium = [...products].sort((a, b) => a.nutrients.sodium - b.nutrients.sodium)
  const sugarSaved = Math.max(...values('sugar')) - best.nutrients.sugar
  const related = POPULAR_ITEMS.filter((item) => !ids.includes(item.id))

  return (
    <PageTemplate activeNav="compare" compareCount={products.length}>
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ComparisonHeader count={products.length} category="Cereais e matinais" onClear={() => setIds([])} />

        <ComparisonDuelCarousel products={products} onRemove={(id) => setIds(ids.filter((x) => x !== id))} onSwap={() => navigate('/')} />

        <NutrientDuelSection blocks={blocks} products={products} />

        <ComparisonFullTable products={products} groups={groups} />

        <NutritionalVerdictCard
          summary={
            <>
              <strong>{best.shortName}</strong> é a opção mais equilibrada desta comparação: Nutri-Score{' '}
              {best.nutriscore?.toUpperCase() ?? '—'} e NOVA {best.nova ?? '—'}.
            </>
          }
          podium={podium.map((p) => ({ name: p.shortName, score: p.nutriscore?.toUpperCase() }))}
          insights={[
            { icon: 'monitor_heart', title: 'Controle glicêmico', text: `${bySugar[0].shortName} tem o menor teor de açúcar: ${formatAmount(bySugar[0].nutrients.sugar, 'g')} por 100 g.` },
            { icon: 'cardiology', title: 'Proteção cardiovascular', text: `${bySodium[0].shortName} tem o menor teor de sódio: ${formatAmount(bySodium[0].nutrients.sodium, 'mg')} por 100 g.` },
          ]}
          methodology="Comparação baseada no Nutri-Score, na classificação NOVA e nos valores por 100 g da Open Food Facts. Não substitui orientação de um profissional de saúde."
        />

        {related.length > 0 && <RelatedProductsGrid eyebrow="Para comparar também" title="Outros bem avaliados" items={related} seeAllHref="/" seeAllLabel="Ver na busca" />}

        <DecisionBar
          message={
            sugarSaved > 0
              ? `Economize ${formatAmount(sugarSaved, 'g')} de açúcar a cada 100 g escolhendo ${best.shortName}.`
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
