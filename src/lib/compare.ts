import type { CompareTone } from '../types/comparison'
import type { NovaGroup, NutriGrade } from '../types/nutrition'

/**
 * Marca o melhor e o pior valor de um nutriente entre os produtos comparados.
 * Valor não informado (`null`) fica neutro e não entra na disputa. Empates no melhor/pior
 * recebem o mesmo tom; com menos de 2 valores, ou todos iguais, todos ficam neutros.
 */
export function rankTones(values: Array<number | null>, lowerIsBetter: boolean): CompareTone[] {
  const known = values.filter((v): v is number => v !== null)
  if (known.length < 2) return values.map(() => 'neutral')
  const min = Math.min(...known)
  const max = Math.max(...known)
  if (min === max) return values.map(() => 'neutral')
  const best = lowerIsBetter ? min : max
  const worst = lowerIsBetter ? max : min
  return values.map((v) => (v === best ? 'best' : v === worst ? 'worst' : 'neutral'))
}

/** Largura das barras em % do maior valor do grupo. Sem valor → sem barra. */
export function barPercents(values: Array<number | null>): Array<number | undefined> {
  const max = Math.max(...values.map((v) => v ?? 0), 0)
  return values.map((v) => (v === null ? undefined : max === 0 ? 0 : Math.round((v / max) * 100)))
}

/** Pontuação para ordenar produtos: Nutri-Score primeiro, NOVA como desempate (menor é melhor). */
export function healthScore(nutriscore?: NutriGrade | null, nova?: NovaGroup | null): number {
  const grade = nutriscore ? 'abcde'.indexOf(nutriscore) : 5
  return grade * 10 + (nova ?? 5)
}

const NUMBER = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

/** Formata número em pt-BR com unidade (ex.: 0.8 → "0,8 g"); sem valor → "—". */
export function formatAmount(value: number | null, unit: string): string {
  return value === null ? '—' : `${NUMBER.format(value)} ${unit}`.trim()
}
