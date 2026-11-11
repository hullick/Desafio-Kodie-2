import { NutritionFactRow, type NutritionFactRowProps } from '../molecules/NutritionFactRow'

export type NutritionTableProps = {
  rows: NutritionFactRowProps[]
  /** Base dos valores (ex.: "100g", "100ml"). */
  basis?: string
}

/** Tabela nutricional por 100 g/ml com linhas coloridas por nível. */
export function NutritionTable({ rows, basis = '100g' }: NutritionTableProps) {
  if (rows.length === 0) return null
  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-headline-sm text-on-surface lg:text-headline-md lg:font-bold">Tabela Nutricional</h2>
          <p className="text-body-sm text-on-surface-variant">Valores de referência por {basis}</p>
        </div>
        <span className="shrink-0 rounded-full bg-surface-container-high px-2.5 py-1 text-label-sm text-on-surface">Porção {basis}</span>
      </div>
      <div className="flex flex-col gap-space-sm">
        {rows.map((r) => (
          <NutritionFactRow key={r.label} {...r} />
        ))}
      </div>
    </section>
  )
}
