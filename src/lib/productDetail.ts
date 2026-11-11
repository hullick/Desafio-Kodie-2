import type { AlternativeProductCardProps } from '../components/molecules/AlternativeProductCard'
import type { AllergenAlertProps } from '../components/molecules/AllergenAlert'
import type { Crumb } from '../components/molecules/Breadcrumbs'
import type { NutritionFactRowProps } from '../components/molecules/NutritionFactRow'
import type { FoodHeroCardProps } from '../components/organisms/FoodHeroCard'
import { ANVISA_LIMITS } from '../config/anvisa'
import type { CategoryNames } from '../i18n/categoryNames'
import type { NutritionBasis, Product } from '../models/Product'
import type { NutrientLevel } from '../types/nutrition'

/** Dados da tela de detalhes, já no formato dos componentes. */
export type ProductDetailView = {
  hero: FoodHeroCardProps
  category?: Crumb
  unit: NutritionBasis
  /** Açúcares por 100 g/ml (alerta de colheres). */
  sugarGrams?: number
  nutrition: NutritionFactRowProps[]
  ingredients?: string
  allergens?: AllergenAlertProps
}

export type AlternativeItem = AlternativeProductCardProps & { id: string }

const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })

/** Alérgenos da OFF (tags em inglês) → português. Sem tradução: a própria tag, legível. */
const ALLERGEN_NAMES: Record<string, string> = {
  gluten: 'Glúten',
  milk: 'Leite',
  eggs: 'Ovos',
  soybeans: 'Soja',
  peanuts: 'Amendoim',
  nuts: 'Castanhas',
  fish: 'Peixe',
  crustaceans: 'Crustáceos',
  molluscs: 'Moluscos',
  celery: 'Aipo',
  mustard: 'Mostarda',
  'sesame-seeds': 'Gergelim',
  lupin: 'Tremoço',
  'sulphur-dioxide-and-sulphites': 'Sulfitos',
  wheat: 'Trigo',
  barley: 'Cevada',
  oats: 'Aveia',
  rye: 'Centeio',
  lactose: 'Lactose',
}

function allergenName(tag: string): string {
  const name = ALLERGEN_NAMES[tag] ?? tag.replace(/-/g, ' ')
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function allergensOf(p: Product): AllergenAlertProps | undefined {
  if (p.allergens.length === 0 && p.traces.length === 0) return undefined
  return { contains: p.allergens.map(allergenName), mayContain: p.traces.map(allergenName) }
}

/** Categoria mais específica com nome no idioma (a API lista da geral para a específica). */
function categoryOf(p: Product, names: CategoryNames | null): Crumb | undefined {
  const tag = names && [...p.categories].reverse().find((t) => names[t])
  return tag && names ? { label: names[tag], href: `/?categoria=${tag}` } : undefined
}

function anvisaAlerts(p: Product): string[] {
  return ANVISA_LIMITS.filter(({ field, limit }) => {
    const v = p.nutriments[field]
    return v !== null && v >= limit[p.basis]
  }).map((a) => a.label)
}

function nutritionRows(p: Product): NutritionFactRowProps[] {
  const n = p.nutriments
  const l = p.nutrientLevels
  const row = (
    label: string,
    value: number | null,
    format: (v: number) => string,
    extra: { secondary?: string; level?: NutrientLevel | null } = {},
  ): NutritionFactRowProps | null =>
    value === null ? null : { label, value: format(value), secondary: extra.secondary, level: extra.level ?? undefined }
  const g = (v: number) => `${decimal.format(v)} g`

  return [
    row('Energia', n.energyKcal, (v) => `${integer.format(v)} kcal`, {
      secondary: n.energyKj === null ? undefined : `(${integer.format(n.energyKj)} kJ)`,
    }),
    row('Açúcares', n.sugars, g, { level: l.sugars }),
    row('Açúcares adicionados', n.addedSugars, g),
    row('Carboidratos', n.carbohydrates, g),
    row('Proteínas', n.proteins, g),
    row('Gorduras totais', n.fat, g, { level: l.fat }),
    row('Gorduras saturadas', n.saturatedFat, g, { level: l.saturatedFat }),
    row('Gorduras trans', n.transFat, g),
    row('Fibras alimentares', n.fiber, g),
    // O semáforo da OFF é por sal; sódio e sal andam juntos.
    row('Sódio', n.sodiumMg, (v) => `${integer.format(v)} mg`, { level: l.salt }),
  ].filter((r): r is NutritionFactRowProps => r !== null)
}

/** Converte um produto da Open Food Facts nos dados da tela de detalhes. */
export function toProductDetail(p: Product, names: CategoryNames | null): ProductDetailView {
  const category = categoryOf(p, names)
  return {
    hero: {
      name: p.name ?? 'Produto sem nome',
      brand: p.brand ?? undefined,
      category: category?.label,
      barcode: p.code,
      imageUrl: p.imageUrl ?? undefined,
      nutriscore: p.nutriscore,
      nova: p.nova,
      anvisaAlerts: anvisaAlerts(p),
    },
    category,
    unit: p.basis,
    sugarGrams: p.nutriments.sugars ?? undefined,
    nutrition: nutritionRows(p),
    ingredients: p.ingredientsText ?? undefined,
    allergens: allergensOf(p),
  }
}

/** Card de alternativa: compara o açúcar com o do produto aberto. */
export function toAlternative(alt: Product, current: Product): AlternativeItem {
  const sugar = alt.nutriments.sugars
  const base = current.nutriments.sugars
  const delta =
    sugar !== null && base !== null && base > 0 ? Math.round(((sugar - base) / base) * 100) : null
  return {
    id: alt.code,
    name: alt.name ?? 'Produto sem nome',
    subtitle: [alt.brand, alt.quantity].filter(Boolean).join(' · ') || undefined,
    imageUrl: alt.imageSmallUrl ?? alt.imageUrl ?? undefined,
    nutriscore: alt.nutriscore,
    nova: alt.nova,
    metric:
      sugar === null
        ? undefined
        : {
            label: `Açúcar por ${alt.basis === '100ml' ? '100ml' : '100g'}`,
            value: `${decimal.format(sugar)} g`,
            delta: delta === null || delta === 0 ? undefined : `${delta > 0 ? '+' : ''}${delta}%`,
          },
    href: `/produto/${alt.code}`,
  }
}
