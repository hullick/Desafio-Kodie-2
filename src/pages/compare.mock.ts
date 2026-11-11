import type { ComparedProduct } from '../types/comparison'

/** Valores por 100 g usados no comparador. */
export type CompareNutrients = {
  sugar: number
  fiber: number
  /** mg */
  sodium: number
  fat: number
  saturatedFat: number
  /** kcal */
  energy: number
  protein: number
  additives: number
}

export type CompareEntry = Omit<ComparedProduct, 'rank'> & { nutrients: CompareNutrients }

/** Dados de exemplo do comparador enquanto a API não está integrada. */
export const COMPARE_PRODUCTS: CompareEntry[] = [
  {
    id: '7891000053508',
    name: 'Sucrilhos Original 300g',
    shortName: 'Sucrilhos',
    brand: "Kellogg's",
    nutriscore: 'd',
    nova: 4,
    href: '/produto/7891000053508',
    nutrients: { sugar: 32, fiber: 2.5, sodium: 330, fat: 0.6, saturatedFat: 0.1, energy: 378, protein: 4.4, additives: 1 },
  },
  {
    id: '7896005800027',
    name: 'Aveia em Flocos Finos 200g',
    shortName: 'Aveia',
    brand: 'Quaker',
    nutriscore: 'a',
    nova: 1,
    href: '/produto/7896005800027',
    nutrients: { sugar: 1.2, fiber: 9.1, sodium: 2, fat: 7, saturatedFat: 1.3, energy: 380, protein: 13.9, additives: 0 },
  },
  {
    id: '7891000244807',
    name: 'Corn Flakes Tradicional 240g',
    shortName: 'Corn Flakes',
    brand: 'Nestlé',
    nutriscore: 'c',
    nova: 3,
    href: '/produto/7891000244807',
    nutrients: { sugar: 7.9, fiber: 3.1, sodium: 650, fat: 1, saturatedFat: 0.3, energy: 375, protein: 7, additives: 1 },
  },
  {
    id: '7891000100103',
    name: 'Iogurte Natural Integral 170g',
    shortName: 'Iogurte',
    brand: 'Nestlé',
    nutriscore: 'a',
    nova: 1,
    href: '/produto/7891000100103',
    nutrients: { sugar: 4.5, fiber: 0, sodium: 50, fat: 3.2, saturatedFat: 2, energy: 61, protein: 5.1, additives: 0 },
  },
]

export const DEFAULT_COMPARE_IDS = ['7891000053508', '7896005800027', '7891000244807']
