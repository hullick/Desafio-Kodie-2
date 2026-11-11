import type { ProductCardProps } from '../components/organisms/ProductCard'

/** Dados de exemplo para visualizar a Home enquanto a API não está integrada. */
export type MockProduct = Pick<
  ProductCardProps,
  'name' | 'brand' | 'description' | 'quantity' | 'imageUrl' | 'nutriscore' | 'nova' | 'nutrients' | 'highlight'
> & { id: string; category: string }

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: '7891000100103',
    name: 'Iogurte Natural Integral',
    brand: 'Nestlé',
    description: 'Iogurte natural sem açúcar',
    quantity: '170g',
    category: 'laticinios',
    nutriscore: 'a',
    nova: 1,
    nutrients: [
      { label: 'Açúcar', value: '4,5g', level: 'low' },
      { label: 'Gordura', value: '3,2g', level: 'moderate' },
      { label: 'Sódio', value: '50mg', level: 'low' },
      { label: 'Proteína', value: '5,1g' },
    ],
    highlight: { tone: 'success', icon: 'thumb_up', text: 'Excelente escolha' },
  },
  {
    id: '7894900011517',
    name: 'Refrigerante Cola',
    brand: 'Coca-Cola',
    description: 'Bebida gaseificada sabor cola',
    quantity: '350ml',
    category: 'bebidas',
    nutriscore: 'e',
    nova: 4,
    nutrients: [
      { label: 'Açúcar', value: '10,6g', level: 'high' },
      { label: 'Gordura', value: '0g', level: 'low' },
      { label: 'Sódio', value: '10mg', level: 'low' },
      { label: 'Calorias', value: '42kcal' },
    ],
    highlight: { tone: 'error', icon: 'warning', text: 'Alto teor de açúcar' },
  },
  {
    id: '7896004000855',
    name: 'Biscoito Recheado Chocolate',
    brand: 'Bauducco',
    description: 'Biscoito com recheio sabor chocolate',
    quantity: '140g',
    category: 'snacks',
    nutriscore: 'e',
    nova: 4,
    nutrients: [
      { label: 'Açúcar', value: '32g', level: 'high' },
      { label: 'Gordura', value: '19g', level: 'high' },
      { label: 'Sódio', value: '280mg', level: 'moderate' },
      { label: 'Calorias', value: '480kcal' },
    ],
    highlight: { tone: 'error', icon: 'warning', text: 'Ultraprocessado' },
  },
  {
    id: '7896005800027',
    name: 'Aveia em Flocos Finos',
    brand: 'Quaker',
    description: 'Aveia integral em flocos',
    quantity: '200g',
    category: 'cereais',
    nutriscore: 'a',
    nova: 1,
    nutrients: [
      { label: 'Açúcar', value: '1,2g', level: 'low' },
      { label: 'Gordura', value: '7g', level: 'moderate' },
      { label: 'Sódio', value: '2mg', level: 'low' },
      { label: 'Fibras', value: '9,1g' },
    ],
    highlight: { tone: 'success', icon: 'eco', text: 'Rico em fibras' },
  },
  {
    id: '7891991010856',
    name: 'Suco de Laranja Integral',
    brand: 'Natural One',
    description: 'Suco 100% laranja, sem adição de açúcar',
    quantity: '900ml',
    category: 'bebidas',
    nutriscore: 'c',
    nova: 1,
    nutrients: [
      { label: 'Açúcar', value: '9,8g', level: 'moderate' },
      { label: 'Gordura', value: '0g', level: 'low' },
      { label: 'Sódio', value: '0mg', level: 'low' },
      { label: 'Calorias', value: '45kcal' },
    ],
    highlight: { tone: 'warning', icon: 'info', text: 'Açúcar natural moderado' },
  },
  {
    id: '7896036090244',
    name: 'Macarrão Instantâneo Galinha',
    brand: 'Nissin',
    description: 'Lámen sabor galinha caipira',
    quantity: '85g',
    category: 'massas',
    nutriscore: 'd',
    nova: 4,
    nutrients: [
      { label: 'Açúcar', value: '2g', level: 'low' },
      { label: 'Gordura', value: '17g', level: 'high' },
      { label: 'Sódio', value: '1.640mg', level: 'high' },
      { label: 'Calorias', value: '450kcal' },
    ],
    highlight: { tone: 'error', icon: 'warning', text: 'Alto teor de sódio' },
  },
  {
    id: '7898215151708',
    name: 'Granola Artesanal',
    brand: 'Marca Local',
    quantity: '250g',
    category: 'cereais',
    nutriscore: null,
    nova: 3,
    nutrients: [
      { label: 'Açúcar', value: '18g', level: 'high' },
      { label: 'Gordura' },
      { label: 'Sódio' },
      { label: 'Calorias', value: '410kcal' },
    ],
  },
]

export const MOCK_CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'cereais', label: 'Cereais' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'massas', label: 'Massas' },
]

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'nutriscore', label: 'Melhor Nutri-Score' },
  { value: 'name', label: 'Nome (A-Z)' },
]

export const SUGGESTIONS = ['Iogurte natural', 'Aveia', 'Refrigerante zero', 'Biscoito integral']
