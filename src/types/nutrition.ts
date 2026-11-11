export type NutriGrade = 'a' | 'b' | 'c' | 'd' | 'e'
export type NovaGroup = 1 | 2 | 3 | 4
/** Nível do nutriente (low/moderate/high), como em `nutrient_levels` da Open Food Facts. */
export type NutrientLevel = 'low' | 'moderate' | 'high'

export const NUTRI_GRADES: NutriGrade[] = ['a', 'b', 'c', 'd', 'e']
export const NOVA_GROUPS: NovaGroup[] = [1, 2, 3, 4]
