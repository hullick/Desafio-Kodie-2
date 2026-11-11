import { Button } from '../atoms/Button'
import { Chip } from '../atoms/Chip'
import { InputField } from '../atoms/InputField'
import { SegmentedControl } from '../atoms/SegmentedControl'
import { SelectField, type SelectOption } from '../atoms/SelectField'

export type FavoritesFilter = { value: string; label: string; count?: number; icon?: string }

export type FavoritesToolbarProps = {
  query: string
  onQueryChange: (value: string) => void
  filters: FavoritesFilter[]
  activeFilter: string
  onFilterChange: (value: string) => void
  sortOptions: SelectOption[]
  sort: string
  onSortChange: (value: string) => void
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  onExport: () => void
  onMarketMode?: () => void
}

/**
 * Ferramentas da lista de favoritos: busca local, exportar, modo mercado, filtros em chips,
 * ordenação e alternância grade/lista (estes dois só no desktop).
 */
export function FavoritesToolbar(p: FavoritesToolbarProps) {
  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col items-center justify-between gap-space-md lg:flex-row lg:rounded-2xl lg:bg-surface-container-lowest lg:p-space-md lg:shadow-sm">
        <InputField
          label="Buscar nos favoritos"
          type="search"
          leadingIcon="search"
          placeholder="Buscar nos seus favoritos..."
          value={p.query}
          onChange={(e) => p.onQueryChange(e.target.value)}
          onClear={() => p.onQueryChange('')}
          containerClassName="lg:w-96 lg:bg-surface-container-low lg:shadow-none"
        />
        <div className="hidden w-full items-center justify-end gap-space-sm lg:flex lg:w-auto">
          <Button variant="subtle" size="lg" icon="ios_share" onClick={p.onExport}>
            Exportar (PDF/WhatsApp)
          </Button>
          {p.onMarketMode && (
            <Button size="lg" icon="shopping_cart_checkout" onClick={p.onMarketMode}>
              Modo compra no mercado
            </Button>
          )}
        </div>
      </div>

      <div className="no-scrollbar -mx-gutter flex items-center gap-space-xs overflow-x-auto px-gutter py-1 lg:mx-0 lg:px-0">
        {p.filters.map((f) => (
          <Chip key={f.value} selected={p.activeFilter === f.value} showCheck onClick={() => p.onFilterChange(f.value)}>
            {f.label}
            {f.count !== undefined && ` (${f.count})`}
          </Chip>
        ))}
      </div>

      <div className="hidden items-center justify-between lg:flex">
        <div className="flex items-center gap-space-xs text-label-md text-outline">
          <span>Ordenar por:</span>
          <SelectField label="Ordenar favoritos" options={p.sortOptions} value={p.sort} onChange={p.onSortChange} icon="expand_more" className="min-w-56" />
        </div>
        <SegmentedControl
          label="Modo de visualização"
          iconOnly
          value={p.view}
          onChange={p.onViewChange}
          options={[
            { value: 'grid', label: 'Visualização em grade', icon: 'grid_view' },
            { value: 'list', label: 'Visualização em linhas', icon: 'view_list' },
          ]}
        />
      </div>
    </div>
  )
}
