import { cn } from '../../lib/cn'
import type { NovaGroup, NutriGrade } from '../../types/nutrition'
import { BadgeNova } from '../atoms/BadgeNova'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Button } from '../atoms/Button'
import { CartButton } from '../atoms/CartButton'
import { FavoriteButton } from '../atoms/FavoriteButton'
import { ProductThumb } from '../atoms/ProductThumb'
import { StatusPill, type StatusTone } from '../atoms/StatusPill'
import { CompareToggle } from '../molecules/CompareToggle'
import { ContributeCallout } from '../molecules/ContributeCallout'
import { NutrientTile, type NutrientTileProps } from '../molecules/NutrientTile'

export type ProductHighlight = { tone: StatusTone; icon: string; text: string }

export type ProductCardProps = {
  name: string
  brand?: string
  description?: string
  quantity?: string
  imageUrl?: string
  nutriscore?: NutriGrade | null
  nova?: NovaGroup | null
  /** Até 4 nutrientes exibidos em blocos. */
  nutrients: NutrientTileProps[]
  /** Destaque curto (ex.: "Alto teor de açúcar", "Excelente escolha"). */
  highlight?: ProductHighlight
  href: string
  favorite: boolean
  onToggleFavorite: () => void
  /** Botão de carrinho ao lado do coração (checklist de mercado). Só aparece abaixo de 1024px. */
  cart?: { active: boolean; onToggle: () => void }
  compare: { checked: boolean; onChange: (checked: boolean) => void; selectedCount: number; max: number }
  /** Mostra convite para completar dados quando faltam informações. */
  onContribute?: () => void
  /** row → foto à esquerda (lista mobile) · column → foto no topo (grade desktop). */
  layout?: 'row' | 'column'
}

/** Card de resultado de produto: foto, marca, badges, nutrientes, favoritar e comparar. */
export function ProductCard(props: ProductCardProps) {
  const { layout = 'row' } = props
  return layout === 'row' ? <RowCard {...props} /> : <ColumnCard {...props} />
}

function Badges({ nutriscore, nova, pill }: { nutriscore?: NutriGrade | null; nova?: NovaGroup | null; pill?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-space-xs">
      <BadgeNutriScore grade={nutriscore} variant={pill ? 'pill' : 'label'} />
      {nova && <BadgeNova group={nova} />}
      {!nutriscore && <span className="text-[11px] text-outline">Dados insuficientes</span>}
    </div>
  )
}

function RowCard(p: ProductCardProps) {
  const missingData = !p.nutriscore || p.nutrients.some((n) => !n.value)
  return (
    <article className="relative flex flex-col gap-space-sm overflow-hidden rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start gap-space-md">
        <a href={p.href} tabIndex={-1} aria-hidden>
          <ProductThumb src={p.imageUrl} alt={p.name} quantity={p.quantity} size="sm" />
        </a>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-1">
            {p.brand && <span className="text-label-sm tracking-wider text-outline uppercase">{p.brand}</span>}
            <div className="-mt-1 -mr-1 ml-auto flex items-center">
              {p.cart && <CartButton active={p.cart.active} onToggle={p.cart.onToggle} productName={p.name} className="lg:hidden" />}
              <FavoriteButton active={p.favorite} onToggle={p.onToggleFavorite} productName={p.name} />
            </div>
          </div>
          <h2 className="truncate text-headline-sm leading-tight font-bold text-on-surface">
            <a href={p.href} className="hover:text-primary">
              {p.name}
            </a>
          </h2>
          {p.description && <p className="truncate text-body-sm text-on-surface-variant">{p.description}</p>}
          <div className="mt-2">
            <Badges nutriscore={p.nutriscore} nova={p.nova} />
          </div>
        </div>
      </div>

      {p.nutrients.length > 0 && (
        <div className={cn('grid gap-1.5 pt-1', p.nutrients.length >= 4 ? 'grid-cols-4' : 'grid-cols-3')}>
          {p.nutrients.slice(0, 4).map((n) => (
            <NutrientTile key={n.label} {...n} />
          ))}
        </div>
      )}

      {missingData && p.onContribute ? (
        <ContributeCallout onAction={p.onContribute} />
      ) : (
        <div className="flex items-center justify-between pt-1">
          <CompareToggle {...p.compare} />
          {p.highlight && (
            <StatusPill variant="text" tone={p.highlight.tone} icon={p.highlight.icon}>
              {p.highlight.text}
            </StatusPill>
          )}
        </div>
      )}
    </article>
  )
}

function ColumnCard(p: ProductCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-md transition-shadow',
        p.compare.checked ? 'shadow-md ring-2 ring-primary' : 'shadow-sm hover:shadow-md',
      )}
    >
      <div>
        <div className="mb-space-sm flex items-center justify-between">
          <CompareToggle {...p.compare} compact />
          <div className="flex items-center gap-1.5">
            {p.cart && <CartButton active={p.cart.active} onToggle={p.cart.onToggle} productName={p.name} variant="filled" className="lg:hidden" />}
            <FavoriteButton active={p.favorite} onToggle={p.onToggleFavorite} productName={p.name} variant="filled" />
          </div>
        </div>
        <ProductThumb
          src={p.imageUrl}
          alt={p.name}
          quantity={p.quantity}
          size="full"
          className="mb-space-sm"
          overlay={
            p.highlight?.tone === 'error' ? (
              <StatusPill variant="solid" tone="error" icon={p.highlight.icon}>
                {p.highlight.text}
              </StatusPill>
            ) : undefined
          }
        />
        <div className="mb-space-xs">
          <Badges nutriscore={p.nutriscore} nova={p.nova} pill />
        </div>
        <h2 className="line-clamp-1 text-headline-sm text-on-surface transition-colors group-hover:text-primary">{p.name}</h2>
        {p.brand && <p className="mb-space-sm text-body-md text-outline">{p.brand}</p>}
        {p.nutrients.length > 0 && (
          <div className="mb-space-sm grid grid-cols-4 gap-1 rounded-xl bg-surface-container-low p-2">
            {p.nutrients.slice(0, 4).map((n) => (
              <NutrientTile key={n.label} {...n} variant="inline" />
            ))}
          </div>
        )}
      </div>
      <Button href={p.href} variant="subtle" size="md" trailingIcon="chevron_right" fullWidth className="mt-space-xs">
        Ver detalhes
      </Button>
    </article>
  )
}
