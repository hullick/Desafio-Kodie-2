import { NUTRI_GRADES, type NovaGroup, type NutriGrade } from '../types/nutrition'
import { NUTRI_BG } from './nutritionStyles'

/** Pontos por nota para a média (A = 10 … E = 2). */
const GRADE_POINTS: Record<NutriGrade, number> = { a: 10, b: 8, c: 6, d: 4, e: 2 }

export type HealthScore = {
  /** Produtos com Nutri-Score (os sem nota ficam fora da média). */
  graded: number
  /** Média de 0 a 10 (0 sem produtos avaliados). */
  score: number
  /** Média formatada (ex.: "7,3"). */
  scoreLabel: string
  verdict: string
  /** % dos avaliados com Nutri-Score A ou B. */
  healthyShare: number
  /** Produtos NOVA 4. */
  ultra: number
  /** Quantos por nota, para DistributionBar (só as notas presentes). */
  distribution: Array<{ label: string; count: number; colorClass: string }>
}

function verdictOf(score: number) {
  if (score >= 8) return 'Excelente'
  if (score >= 6) return 'Boa'
  if (score >= 4) return 'Atenção'
  return 'Precisa melhorar'
}

/** Quão saudável é uma lista de produtos (Favoritos: "Nota da despensa"; checklist: nota do carrinho). */
export function healthScore(items: Array<{ nutriscore: NutriGrade | null; nova: NovaGroup | null }>): HealthScore {
  const grades = items.flatMap((i) => (i.nutriscore ? [i.nutriscore] : []))
  const score = grades.length ? grades.reduce((s, g) => s + GRADE_POINTS[g], 0) / grades.length : 0
  return {
    graded: grades.length,
    score,
    scoreLabel: score.toLocaleString('pt-BR', { maximumFractionDigits: 1 }),
    verdict: verdictOf(score),
    healthyShare: grades.length ? Math.round((grades.filter((g) => GRADE_POINTS[g] >= 8).length / grades.length) * 100) : 0,
    ultra: items.filter((i) => i.nova === 4).length,
    distribution: NUTRI_GRADES.map((g) => ({ label: g.toUpperCase(), count: grades.filter((x) => x === g).length, colorClass: NUTRI_BG[g] })).filter((s) => s.count > 0),
  }
}
