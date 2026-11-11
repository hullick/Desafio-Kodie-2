import { Button } from '../atoms/Button'
import { StatusPill } from '../atoms/StatusPill'
import { AlternativeProductCard, type AlternativeProductCardProps } from '../molecules/AlternativeProductCard'

export type HealthierAlternativesProps = {
  items: Array<AlternativeProductCardProps & { id: string }>
  /** Abre o comparador com produtos da mesma categoria. */
  compareHref: string
  /**
   * healthier → Nutri-Score melhor que o do produto · similar → o produto não tem nota, então não
   * dá para dizer que algo é mais saudável: são os mais bem avaliados da mesma categoria.
   */
  mode?: 'healthier' | 'similar'
}

const TEXT = {
  healthier: {
    pill: 'Mesma categoria · Melhores escolhas',
    title: 'Alternativas Mais Saudáveis',
    description: 'Produtos similares com melhor pontuação nutricional.',
    empty: 'Não encontramos produtos comparáveis com Nutri-Score melhor na mesma categoria.',
  },
  similar: {
    pill: 'Mesma categoria',
    title: 'Opções da Mesma Categoria',
    description:
      'Este produto não tem Nutri-Score, então não dá para dizer qual é mais saudável. Estes são os mais bem avaliados da mesma categoria.',
    empty: 'Não encontramos outros produtos comparáveis com Nutri-Score na mesma categoria.',
  },
}

/** Alternativas: carrossel no mobile, grade de 3 colunas no desktop. Sem itens, mostra o aviso. */
export function HealthierAlternatives({ items, compareHref, mode = 'healthier' }: HealthierAlternativesProps) {
  const text = TEXT[mode]
  return (
    <section id="alternativas" className="flex flex-col gap-space-sm lg:mt-space-xl">
      <div className="flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
        <div>
          <StatusPill tone="success" shape="pill" icon="eco" className="mb-2">
            {text.pill}
          </StatusPill>
          <h2 className="text-headline-sm text-on-surface lg:text-headline-lg lg:font-extrabold">{text.title}</h2>
          <p className="text-body-sm text-on-surface-variant lg:text-body-md">{text.description}</p>
        </div>
        {items.length > 0 && (
          <Button href={compareHref} icon="compare" trailingIcon="arrow_forward" className="h-11">
            Comparar alternativas
          </Button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-surface-container-lowest p-space-lg text-center text-body-md text-on-surface-variant shadow-sm">
          {text.empty}
        </p>
      ) : (
        <div className="no-scrollbar -mx-gutter flex gap-space-md overflow-x-auto scroll-smooth px-gutter pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-gutter-md md:overflow-visible md:px-0">
          {items.map(({ id, ...card }) => (
            <AlternativeProductCard key={id} {...card} />
          ))}
        </div>
      )}
    </section>
  )
}
