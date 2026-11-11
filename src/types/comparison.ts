import type { NovaGroup, NutriGrade } from './nutrition'

export type ComparedProduct = {
  id: string
  name: string
  /** Nome curto para legendas e colunas (ex.: "Aveia"). */
  shortName: string
  brand?: string
  imageUrl?: string
  nutriscore?: NutriGrade | null
  nova?: NovaGroup | null
  /** Posição no ranking (1 = melhor). */
  rank?: number
  href: string
}

/** Tom de um valor comparado: melhor, pior ou neutro. */
export type CompareTone = 'best' | 'worst' | 'neutral'
