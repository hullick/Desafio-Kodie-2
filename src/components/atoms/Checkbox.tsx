import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  disabled?: boolean
  className?: string
  labelClassName?: string
}

/** Checkbox com caixa customizada (verde quando marcada). */
export function Checkbox({ checked, onChange, label, disabled, className, labelClassName }: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-2 select-none',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white transition-colors',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1',
          checked ? 'bg-primary' : 'bg-surface-container',
        )}
        aria-hidden
      >
        {checked && <Icon name="check" size={16} />}
      </span>
      <span className={cn('text-label-md', checked ? 'font-bold text-primary' : 'text-on-surface-variant', labelClassName)}>
        {label}
      </span>
    </label>
  )
}
