import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type SegmentedOption<T extends string> = { value: T; label: string; icon?: string; badge?: string }

export type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  fullWidth?: boolean
  /** Mostra só os ícones (o rótulo vira aria-label). */
  iconOnly?: boolean
}

/** Alternador de visualização (ex.: "Gráficos Visuais" / "Tabela Completa", grade / lista). */
export function SegmentedControl<T extends string>({ options, value, onChange, label, fullWidth = false, iconOnly = false }: SegmentedControlProps<T>) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex items-center gap-1 rounded-xl bg-surface-container-low p-1', fullWidth ? 'w-full' : 'inline-flex')}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={iconOnly ? o.label : undefined}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg text-label-md transition-all',
              iconOnly ? 'h-8 w-8' : 'px-3 py-2',
              fullWidth && 'flex-1',
              active ? 'bg-surface-container-lowest font-bold text-primary shadow-sm' : 'font-semibold text-on-surface-variant hover:text-on-surface',
            )}
          >
            {o.icon && <Icon name={o.icon} size={18} />}
            {!iconOnly && o.label}
            {!iconOnly && o.badge && (
              <span className="rounded-full bg-primary px-1.5 text-[9px] font-extrabold tracking-wide text-on-primary uppercase">{o.badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
