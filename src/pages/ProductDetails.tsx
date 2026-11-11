import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Breadcrumbs } from '../components/molecules/Breadcrumbs'
import { ProductActions } from '../components/molecules/ProductActions'
import { Skeleton } from '../components/atoms/Skeleton'
import { FoodHeroCard } from '../components/organisms/FoodHeroCard'
import { HealthierAlternatives } from '../components/organisms/HealthierAlternatives'
import { IngredientsPanel } from '../components/organisms/IngredientsPanel'
import { NutritionTable } from '../components/organisms/NutritionTable'
import { SugarAlertCard } from '../components/organisms/SugarAlertCard'
import { PageTemplate } from '../components/templates/PageTemplate'
import { toggleFavorite, useFavoriteCodes } from '../hooks/useFavorites'
import { useProductDetails } from '../hooks/useProductDetails'
import { useCategoryNames } from '../i18n/categoryNames'
import { toAlternative, toProductDetail } from '../lib/productDetail'
import { ProductNotFound } from './ProductNotFound'

/** Limite de "alto em açúcar adicionado" da ANVISA (RDC 429/2020) por 100 g / 100 ml. */
const SUGAR_HIGH = { '100g': 15, '100ml': 7.5 }

export function ProductDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const favorites = useFavoriteCodes()
  const details = useProductDetails(id)
  const categoryNames = useCategoryNames()

  const view = useMemo(() => {
    if (details.status !== 'success') return null
    const { product } = details
    const alts = details.alternatives
    return {
      ...toProductDetail(product, categoryNames),
      // Só aparece depois de buscar: carregando ou com falha (ex.: limite da API), fica oculta.
      alternatives: alts.status === 'ready' ? alts.list.map((alt) => toAlternative(alt, product)) : null,
      alternativesMode: product.nutriscore ? ('healthier' as const) : ('similar' as const),
    }
  }, [details, categoryNames])

  if (details.status === 'not-found') return <ProductNotFound barcode={id} />
  if (!view) return <ProductDetailsLoading failed={details.status === 'error'} onBack={() => navigate(-1)} />

  const { hero, unit, sugarGrams, nutrition, ingredients, allergens, alternatives, alternativesMode, category } = view
  const showSugarAlert = sugarGrams !== undefined && sugarGrams >= SUGAR_HIGH[unit]
  const alternativesHref = `/comparar?ids=${[id, ...(alternatives ?? []).map((a) => a.id)].join(',')}`

  const share = () => {
    const url = window.location.href
    if (navigator.share) navigator.share({ title: hero.name, url }).catch(() => {})
    else navigator.clipboard?.writeText(url)
  }

  // `view` só existe com o produto carregado.
  const product = details.status === 'success' ? details.product : null
  const actions = {
    saved: product !== null && favorites.has(product.code),
    onToggleSave: () => product && toggleFavorite(product),
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

        {alternatives && (
          <HealthierAlternatives items={alternatives} compareHref={alternativesHref} mode={alternativesMode} />
        )}
      </div>
    </PageTemplate>
  )
}

/** Carregando o produto (ou erro sem tela própria): mesmo esqueleto da página. */
function ProductDetailsLoading({ failed, onBack }: { failed: boolean; onBack: () => void }) {
  return (
    <PageTemplate activeNav="home" mobile={{ mode: 'stack', title: 'Detalhes do alimento', onBack }}>
      <div className="flex flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl" aria-busy={!failed}>
        {failed ? (
          <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
            Não foi possível carregar o produto. Tente novamente.
          </p>
        ) : (
          <>
            <span className="sr-only">Carregando produto...</span>
            <Skeleton shimmer className="h-64 w-full rounded-2xl" />
            <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12 lg:gap-gutter-lg">
              <Skeleton className="hidden h-72 rounded-2xl lg:col-span-5 lg:block" />
              <div className="flex flex-col gap-space-lg lg:col-span-7">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton tone="soft" className="h-32 w-full rounded-2xl" />
              </div>
            </div>
          </>
        )}
      </div>
    </PageTemplate>
  )
}
