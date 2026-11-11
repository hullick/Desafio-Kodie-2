import type { NovaGroup, NutriGrade } from '../../types/nutrition'
import { BadgeNova } from '../atoms/BadgeNova'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Button } from '../atoms/Button'
import { ProductThumb } from '../atoms/ProductThumb'
import { StatusPill } from '../atoms/StatusPill'

export type AlternativeProductCardProps = {
  name: string
  subtitle?: string
  imageUrl?: string
  nutriscore?: NutriGrade | null
  nova?: NovaGroup | null
  /** Selo sobre a foto (ex.: "Top Escolha", "Baixo Açúcar"). */
  tag?: string
  /** Métrica de comparação (ex.: { label: "Açúcar por 100g", value: "1,0 g", delta: "-97%" }). */
  metric?: { label: string; value: string; delta?: string }
  href: string
  onCompare?: () => void
}

/** Card de alternativa mais saudável da mesma categoria. */
export function AlternativeProductCard({ name, subtitle, imageUrl, nutriscore, nova, tag, metric, href, onCompare }: AlternativeProductCardProps) {
  return (
    <article className="flex min-w-[260px] max-w-[280px] shrink-0 flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-md shadow-sm transition-shadow hover:shadow-md md:max-w-none md:min-w-0 lg:p-space-lg">
      <div>
        <div className="relative mb-space-sm">
          <ProductThumb src={imageUrl} alt={name} size="full" className="h-32 md:h-44" />
          {tag && (
            <StatusPill variant="solid" tone="success" shape="pill" className="absolute top-2 left-2">
              {tag}
            </StatusPill>
          )}
        </div>
        <div className="my-space-xs flex flex-wrap items-center gap-1.5">
          <BadgeNutriScore grade={nutriscore} variant="pill" />
          {nova && <BadgeNova group={nova} />}
        </div>
        <h3 className="line-clamp-1 text-label-lg text-on-surface md:text-headline-sm md:font-bold">{name}</h3>
        {subtitle && <p className="mt-0.5 text-body-sm text-on-surface-variant">{subtitle}</p>}
        {metric && (
          <div className="mt-space-sm flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm text-label-md">
            <span className="text-outline">{metric.label}</span>
            <span className="font-bold text-primary">
              {metric.value} {metric.delta && <span className="text-xs font-normal text-outline">({metric.delta})</span>}
            </span>
          </div>
        )}
      </div>
      <div className="mt-space-md flex flex-col gap-2">
        {onCompare && (
          <Button variant="subtle" icon="compare_arrows" fullWidth onClick={onCompare} className="h-11 hover:bg-primary hover:text-on-primary">
            Comparar diretamente
          </Button>
        )}
        <Button href={href} variant="subtle" fullWidth className="h-11 text-primary">
          Ver detalhes
        </Button>
      </div>
    </article>
  )
}
