import { Checkbox } from '../atoms/Checkbox'

export type CompareToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Quantos itens já estão no comparador. */
  selectedCount: number
  max: number
  /** Rótulo curto ("Comparar") para cards compactos. */
  compact?: boolean
}

/** Marca o produto para o comparador e mostra a contagem "Comparando (1/5)". */
export function CompareToggle({ checked, onChange, selectedCount, max, compact = false }: CompareToggleProps) {
  const full = !checked && selectedCount >= max
  const label = checked
    ? `Comparando (${selectedCount}/${max})`
    : full
      ? `Comparador cheio (${max})`
      : compact
        ? 'Comparar'
        : 'Comparar este item'

  return <Checkbox checked={checked} onChange={onChange} label={label} disabled={full} />
}
