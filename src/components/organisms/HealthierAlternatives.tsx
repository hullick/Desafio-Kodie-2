import { Button } from '../atoms/Button'
import { StatusPill } from '../atoms/StatusPill'
import { AlternativeProductCard, type AlternativeProductCardProps } from '../molecules/AlternativeProductCard'

export type HealthierAlternativesProps = {
  items: Array<AlternativeProductCardProps & { id: string }>
  /** Abre o comparador com produtos da mesma categoria. */
  compareHref: string
}

/** Alternativas mais saudáveis: carrossel no mobile, grade de 3 colunas no desktop. */
export function HealthierAlternatives({ items, compareHref }: HealthierAlternativesProps) {
  if (items.length === 0) return null
  return (
    <section id="alternativas" className="flex flex-col gap-space-sm lg:mt-space-xl">
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
        <div>
          <StatusPill tone="success" shape="pill" icon="eco" className="mb-2">
            Mesma categoria · Melhores escolhas
          </StatusPill>
          <h2 className="text-headline-sm text-on-surface lg:text-headline-lg lg:font-extrabold">Alternativas Mais Saudáveis</h2>
          <p className="text-body-sm text-on-surface-variant lg:text-body-md">Produtos similares com melhor pontuação nutricional.</p>
        </div>
        <Button href={compareHref} icon="compare" trailingIcon="arrow_forward" className="h-11">
          Comparar alternativas
        </Button>
      </div>
      <div className="no-scrollbar -mx-gutter flex gap-space-md overflow-x-auto scroll-smooth px-gutter pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-gutter-md md:overflow-visible md:px-0">
        {items.map(({ id, ...card }) => (
          <AlternativeProductCard key={id} {...card} />
        ))}
      </div>
    </section>
  )
}
