import type { NovaGroup, NutriGrade } from '../types/nutrition'

/** Fundo da nota Nutri-Score (cores oficiais). */
export const NUTRI_BG: Record<NutriGrade, string> = {
  a: 'bg-nutri-a',
  b: 'bg-nutri-b',
  c: 'bg-nutri-c',
  d: 'bg-nutri-d',
  e: 'bg-nutri-e',
}

export const NUTRI_TEXT: Record<NutriGrade, string> = {
  a: 'text-nutri-a',
  b: 'text-nutri-b',
  c: 'text-nutri-c',
  d: 'text-nutri-d',
  e: 'text-nutri-e',
}

/** Cor do texto sobre o fundo da nota (amarelo C pede texto escuro). */
export const NUTRI_ON: Record<NutriGrade, string> = {
  a: 'text-white',
  b: 'text-white',
  c: 'text-on-surface',
  d: 'text-white',
  e: 'text-white',
}

export const NOVA_LABEL: Record<NovaGroup, string> = {
  1: 'In natura',
  2: 'Ingrediente culinário',
  3: 'Processado',
  4: 'Ultraprocessado',
}
