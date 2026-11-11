import { NUTRI_VERDICT } from '../../lib/nutritionStyles'
import type { NutriGrade } from '../../types/nutrition'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Icon } from '../atoms/Icon'

export type NutriScoreCardProps = {
  grade?: NutriGrade | null
}

/** Cartão "Nutri-Score Oficial": escala A–E e parecer da nota. */
export function NutriScoreCard({ grade }: NutriScoreCardProps) {
  const bad = grade === 'd' || grade === 'e'
  return (
    <div className="flex flex-col justify-between gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-label-md tracking-wide text-on-surface-variant uppercase">Nutri-Score Oficial</span>
        <Icon name="info" size={18} className="text-outline" />
      </div>
      {grade ? (
        <>
          <BadgeNutriScore grade={grade} variant="scale" className="justify-center py-space-xs" />
          <div className={bad ? 'flex items-center gap-space-xs rounded-lg bg-warning-container/60 p-2' : 'flex items-center gap-space-xs rounded-lg bg-secondary-container/40 p-2'}>
            <Icon name={bad ? 'warning' : 'check_circle'} size={18} className={bad ? 'text-nutri-d' : 'text-primary'} />
            <p className="text-body-sm text-on-surface">
              Classificação <strong>{grade.toUpperCase()}</strong>: {NUTRI_VERDICT[grade]}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-2 py-space-xs">
          <BadgeNutriScore grade={null} variant="pill" />
          <p className="text-body-sm text-on-surface-variant">Dados insuficientes para calcular a nota.</p>
        </div>
      )}
    </div>
  )
}
