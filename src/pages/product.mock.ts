import type { AlternativeProductCardProps } from '../components/molecules/AlternativeProductCard'
import type { AllergenAlertProps } from '../components/molecules/AllergenAlert'
import type { NutritionFactRowProps } from '../components/molecules/NutritionFactRow'
import type { FoodHeroCardProps } from '../components/organisms/FoodHeroCard'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './home.mock'

/** Dados de exemplo da tela de detalhes enquanto a API não está integrada. */
export type MockProductDetail = {
  hero: FoodHeroCardProps
  category?: { label: string; href: string }
  unit: '100g' | '100ml'
  /** Açúcares por 100 g/ml (mostra o alerta de colheres quando ≥ 15 g sólidos / 7,5 g líquidos). */
  sugarGrams?: number
  nutrition: NutritionFactRowProps[]
  ingredients?: string
  allergens?: AllergenAlertProps
  alternatives: Array<AlternativeProductCardProps & { id: string }>
}

const ALTERNATIVES: MockProductDetail['alternatives'] = [
  {
    id: '7896005800027',
    name: 'Aveia em Flocos Finos',
    subtitle: 'Quaker · 200g',
    nutriscore: 'a',
    nova: 1,
    tag: 'Top escolha',
    metric: { label: 'Açúcar por 100g', value: '1,2 g', delta: '-96%' },
    href: '/produto/7896005800027',
  },
  {
    id: '7891000100103',
    name: 'Iogurte Natural Integral',
    subtitle: 'Nestlé · 170g',
    nutriscore: 'a',
    nova: 1,
    tag: 'Baixo açúcar',
    metric: { label: 'Açúcar por 100g', value: '4,5 g', delta: '-86%' },
    href: '/produto/7891000100103',
  },
]

const DETAILS: Record<string, MockProductDetail> = {
  '7891000053508': {
    hero: {
      name: 'Sucrilhos Original',
      brand: "Kellogg's",
      category: 'Cereais matinais',
      barcode: '7891000053508',
      nutriscore: 'd',
      nova: 4,
      anvisaAlerts: ['Alto em açúcar adicionado'],
    },
    category: { label: 'Cereais', href: '/?categoria=cereais' },
    unit: '100g',
    sugarGrams: 32,
    nutrition: [
      { label: 'Açúcares', value: '32,0 g', description: '64% do limite diário recomendado', level: 'high' },
      { label: 'Energia', value: '378 kcal', secondary: '(1.582 kJ)', level: 'moderate' },
      { label: 'Sódio', value: '0,33 g', secondary: '(330 mg)', level: 'moderate' },
      { label: 'Fibras alimentares', value: '2,5 g' },
      { label: 'Gorduras totais', value: '0,6 g', level: 'low' },
      { label: 'Gorduras saturadas', value: '0,1 g', level: 'low' },
    ],
    ingredients:
      'Milho, açúcar, extrato de malte de cevada, sal, vitaminas (A, B1, B2, B6, B12, C, niacina, ácido fólico), minerais (ferro, zinco) e antioxidante BHT.',
    allergens: { contains: ['Glúten', 'Cevada'], mayContain: ['Soja', 'Trigo'] },
    alternatives: ALTERNATIVES,
  },
  '7891000244807': {
    hero: {
      name: 'Corn Flakes Tradicional',
      brand: 'Nestlé',
      category: 'Cereais matinais',
      barcode: '7891000244807',
      nutriscore: 'c',
      nova: 3,
      anvisaAlerts: ['Alto em sódio'],
    },
    category: { label: 'Cereais', href: '/?categoria=cereais' },
    unit: '100g',
    sugarGrams: 7.9,
    nutrition: [
      { label: 'Açúcares', value: '7,9 g', level: 'moderate' },
      { label: 'Energia', value: '375 kcal', level: 'moderate' },
      { label: 'Sódio', value: '0,65 g', secondary: '(650 mg)', level: 'high' },
      { label: 'Fibras alimentares', value: '3,1 g' },
      { label: 'Gorduras totais', value: '1,0 g', level: 'low' },
      { label: 'Gorduras saturadas', value: '0,3 g', level: 'low' },
    ],
    alternatives: ALTERNATIVES,
  },
}

/** Monta um detalhe simples a partir dos produtos da Home (para os links da busca funcionarem). */
function fromHomeProduct(id: string): MockProductDetail | undefined {
  const p = MOCK_PRODUCTS.find((x) => x.id === id)
  if (!p) return undefined
  const category = MOCK_CATEGORIES.find((c) => c.value === p.category)
  const isLiquid = p.quantity?.endsWith('ml') ?? false
  const sugar = p.nutrients.find((n) => n.label === 'Açúcar')?.value
  return {
    hero: {
      name: p.name,
      brand: p.brand,
      category: category?.label,
      barcode: p.id,
      imageUrl: p.imageUrl,
      nutriscore: p.nutriscore,
      nova: p.nova,
    },
    category: category && { label: category.label, href: `/?categoria=${category.value}` },
    unit: isLiquid ? '100ml' : '100g',
    sugarGrams: sugar ? Number.parseFloat(sugar.replace(',', '.')) : undefined,
    nutrition: p.nutrients
      .filter((n): n is typeof n & { value: string } => Boolean(n.value))
      .map((n) => ({ label: n.label, value: n.value, level: n.level })),
    alternatives: ALTERNATIVES.filter((a) => a.id !== id),
  }
}

export function getMockProductDetail(id: string): MockProductDetail | undefined {
  return DETAILS[id] ?? fromHomeProduct(id)
}
