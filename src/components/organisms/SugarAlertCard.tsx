import { Icon } from '../atoms/Icon'
import { RingGauge } from '../atoms/RingGauge'
import { SpoonMeter } from '../atoms/SpoonMeter'
import { StatusPill } from '../atoms/StatusPill'

export type SugarAlertCardProps = {
  /** Gramas de açúcar por 100 g/ml. */
  sugarGrams: number
  /** Gramas por colher de chá usadas na conversão (padrão 5 g). */
  gramsPerSpoon?: number
  unit?: '100g' | '100ml'
}

/** Alerta crítico: açúcar convertido em colheres de chá e percentual do produto. */
export function SugarAlertCard({ sugarGrams, gramsPerSpoon = 5, unit = '100g' }: SugarAlertCardProps) {
  const spoons = Math.round((sugarGrams / gramsPerSpoon) * 2) / 2
  const spoonsText = spoons.toLocaleString('pt-BR')
  const grams = sugarGrams.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-error-container/70 via-error-container/30 to-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
      <div className="flex flex-col items-start gap-space-lg md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md items-start gap-space-md">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-error text-on-error shadow-md lg:hidden">
            <Icon name="cookie" size={28} />
          </span>
          <div className="flex flex-col">
            <StatusPill variant="solid" tone="error" shape="pill" icon="priority_high" uppercase className="w-fit">
              Atenção crítica
            </StatusPill>
            <h2 className="mt-2 text-headline-sm text-on-error-container lg:text-headline-lg lg:font-bold lg:text-error">
              Equivale a {spoonsText} colheres de chá de açúcar a cada {unit}!
            </h2>
            <p className="mt-1 text-body-md leading-snug text-on-surface-variant">
              São <strong>{grams} g</strong> de açúcar em cada {unit === '100g' ? '100 g' : '100 ml'} do produto.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-space-lg">
          <RingGauge value={sugarGrams} label="Açúcar" className="hidden md:flex" />
          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest/80 p-2.5 shadow-sm">
            <span className="mb-0.5 text-label-sm font-semibold text-on-surface-variant">Colheres / {unit}</span>
            <SpoonMeter spoons={spoons} />
          </div>
        </div>
      </div>
    </section>
  )
}
