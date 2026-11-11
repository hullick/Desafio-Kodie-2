import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { SelectField, type SelectOption } from '../atoms/SelectField'
import { StatusPill } from '../atoms/StatusPill'
import { Breadcrumbs } from './Breadcrumbs'

export type ComparisonHeaderProps = {
  count: number
  category?: string
  /** Troca de categoria (seletor exibido no desktop). */
  categoryOptions?: SelectOption[]
  onCategoryChange?: (value: string) => void
  onClear: () => void
  basis?: string
}

/** Cabeçalho do comparador: título, categoria, contagem em duelo e ação de limpar. */
export function ComparisonHeader({ count, category, categoryOptions, onCategoryChange, onClear, basis = '100g' }: ComparisonHeaderProps) {
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="hidden lg:block">
        <Breadcrumbs items={[{ label: 'Início', href: '/' }, { label: 'Comparador Nutricional' }]} />
      </div>
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex flex-col">
          <span className="flex items-center gap-1.5 text-label-sm tracking-wider text-secondary uppercase">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name="balance" size={14} />
            </span>
            Duelo no corredor
          </span>
          <h1 className="mt-0.5 text-headline-lg font-extrabold text-on-surface">Comparar Alimentos</h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <p className="text-body-sm text-on-surface-variant">
              {count} produtos{category && <> na categoria <strong className="font-semibold text-on-surface">{category}</strong></>}
            </p>
            <StatusPill tone="success" shape="pill" icon="swipe" className="text-[10px] font-bold">
              {count} em duelo
            </StatusPill>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          {categoryOptions && onCategoryChange && (
            <div className="hidden items-center gap-space-sm rounded-xl bg-surface-container-lowest px-space-md py-2 shadow-sm lg:flex">
              <span className="text-label-md text-outline">Categoria:</span>
              <SelectField label="Categoria analisada" options={categoryOptions} value={category ?? ''} onChange={onCategoryChange} icon="expand_more" className="min-w-48 shadow-none" />
              <span className="flex items-center gap-1 text-label-md text-on-surface-variant">
                <Icon name="info" size={16} /> Porção: {basis}
              </span>
            </div>
          )}
          <Button variant="subtle" size="sm" shape="pill" icon="restart_alt" onClick={onClear} aria-label="Limpar comparação" className="shadow-sm">
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
