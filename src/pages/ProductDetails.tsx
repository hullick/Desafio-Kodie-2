import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumbs } from '../components/molecules/Breadcrumbs'
import { ProductActions } from '../components/molecules/ProductActions'
import { FoodHeroCard } from '../components/organisms/FoodHeroCard'
import { HealthierAlternatives } from '../components/organisms/HealthierAlternatives'
import { IngredientsPanel } from '../components/organisms/IngredientsPanel'
import { NutritionTable } from '../components/organisms/NutritionTable'
import { SugarAlertCard } from '../components/organisms/SugarAlertCard'
import { PageTemplate } from '../components/templates/PageTemplate'
import { ProductNotFound } from './ProductNotFound'
import { getMockProductDetail } from './product.mock'

/** Limite de "alto em açúcar adicionado" da ANVISA (RDC 429/2020) por 100 g / 100 ml. */
const SUGAR_HIGH = { '100g': 15, '100ml': 7.5 }

export function ProductDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const product = getMockProductDetail(id)

  if (!product) return <ProductNotFound barcode={id} />

  const { hero, unit, sugarGrams, nutrition, ingredients, allergens, alternatives, category } = product
  const showSugarAlert = sugarGrams !== undefined && sugarGrams >= SUGAR_HIGH[unit]
  const alternativesHref = `/comparar?ids=${[id, ...alternatives.map((a) => a.id)].join(',')}`

  const share = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: hero.name, url }).catch(() => {})
    else navigator.clipboard?.writeText(url)
  }

  const actions = {
    saved,
    onToggleSave: () => setSaved((s) => !s),
    onShare: share,
    alternativesHref,
  }

  return (
    <PageTemplate
      activeNav="home"
      mobile={{
        mode: 'stack',
        title: 'Detalhes do alimento',
        onBack: () => navigate(-1),
        dock: <ProductActions variant="dock" {...actions} />,
      }}
    >
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <div className="hidden lg:block">
          <Breadcrumbs
            items={[{ label: 'Início', href: '/' }, ...(category ? [category] : []), { label: hero.name }]}
          />
        </div>

        <FoodHeroCard {...hero} />

        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-gutter-lg">
          <div className="hidden lg:sticky lg:top-24 lg:col-span-5 lg:block">
            <ProductActions variant="panel" {...actions} />
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-7">
            {showSugarAlert && <SugarAlertCard sugarGrams={sugarGrams} unit={unit} />}
            {nutrition.length > 0 && <NutritionTable rows={nutrition} basis={unit} />}
            {(ingredients || allergens) && <IngredientsPanel ingredients={ingredients} allergens={allergens} />}
          </div>
        </div>

        {alternatives.length > 0 && <HealthierAlternatives items={alternatives} compareHref={alternativesHref} />}
      </div>
    </PageTemplate>
  )
}
