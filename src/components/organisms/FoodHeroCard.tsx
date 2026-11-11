import type { NovaGroup, NutriGrade } from '../../types/nutrition'
import { Icon } from '../atoms/Icon'
import { StatusPill } from '../atoms/StatusPill'
import { NovaCard } from '../molecules/NovaCard'
import { NutriScoreCard } from '../molecules/NutriScoreCard'

export type FoodHeroCardProps = {
  name: string
  brand?: string
  category?: string
  barcode: string
  imageUrl?: string
  nutriscore?: NutriGrade | null
  nova?: NovaGroup | null
  /** Alertas frontais da ANVISA (ex.: ["Alto em açúcar adicionado"]). */
  anvisaAlerts?: string[]
}

/**
 * Seção principal do produto: foto, identificação, alertas ANVISA e selos Nutri-Score/NOVA.
 * Mobile: tudo em coluna. Desktop: foto à esquerda, dados à direita.
 */
export function FoodHeroCard({ name, brand, category, barcode, imageUrl, nutriscore, nova, anvisaAlerts = [] }: FoodHeroCardProps) {
  return (
    <section className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-gutter-lg">
      <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:col-span-5 lg:p-space-lg">
        <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain p-space-md drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center text-outline">
              <Icon name="inventory_2" size={48} className="text-outline-variant" />
              <span className="mt-2 text-body-sm">Sem foto cadastrada</span>
            </div>
          )}
        </div>
        <div className="mt-space-md flex items-center justify-between rounded-xl bg-surface-container-low px-space-md py-space-xs">
          <span className="flex items-center gap-2 font-mono text-label-sm tracking-wider text-outline">
            <Icon name="barcode" size={18} /> EAN {barcode}
          </span>
          <span className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-primary" aria-hidden /> Open Food Facts
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-space-lg lg:col-span-7">
        <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
          {(brand || category) && (
            <div className="mb-1 flex flex-wrap items-center gap-2 text-label-md tracking-wider text-outline uppercase">
              {brand && <span>{brand}</span>}
              {brand && category && <span aria-hidden>•</span>}
              {category && <span>{category}</span>}
            </div>
          )}
          <h1 className="text-headline-md leading-snug text-on-surface lg:text-display-lg lg:font-extrabold lg:tracking-tight">{name}</h1>
          {anvisaAlerts.length > 0 && (
            <div className="mt-space-sm flex flex-wrap gap-1.5" aria-label="Alertas de rotulagem frontal ANVISA">
              {anvisaAlerts.map((a) => (
                <StatusPill key={a} variant="solid" tone="neutral" icon="search" uppercase className="bg-on-surface text-surface">
                  {a}
                </StatusPill>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <NutriScoreCard grade={nutriscore} />
          {nova && <NovaCard group={nova} />}
        </div>
      </div>
    </section>
  )
}
