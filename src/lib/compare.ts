import type { CompareTone } from '../types/comparison'
import type { NovaGroup, NutriGrade } from '../types/nutrition'

/**
 * Marca o melhor e o pior valor de um nutriente entre os produtos comparados.
 * Empates no melhor/pior recebem o mesmo tom; se todos forem iguais, todos ficam neutros.
 */
export function rankTones(values: number[], lowerIsBetter: boolean): CompareTone[] {
  if (values.length < 2) return values.map(() => 'neutral')
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) return values.map(() => 'neutral')
  const best = lowerIsBetter ? min : max
  const worst = lowerIsBetter ? max : min
  return values.map((v) => (v === best ? 'best' : v === worst ? 'worst' : 'neutral'))
}

/** Largura das barras em % do maior valor do grupo. */
export function barPercents(values: number[]): number[] {
  const max = Math.max(...values, 0)
  return values.map((v) => (max === 0 ? 0 : Math.round((v / max) * 100)))
}

/** Pontuação para ordenar produtos: Nutri-Score primeiro, NOVA como desempate (menor é melhor). */
export function healthScore(nutriscore?: NutriGrade | null, nova?: NovaGroup | null): number {
  const grade = nutriscore ? 'abcde'.indexOf(nutriscore) : 5
  return grade * 10 + (nova ?? 5)
}

const NUMBER = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Formata número em pt-BR com unidade (ex.: 0.8 → "0,8 g"). */
export function formatAmount(value: number, unit: string): string {
  return `${NUMBER.format(value)} ${unit}`
}
