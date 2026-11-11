import { useId } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type BarcodeInputProps = {
  value: string
  onChange: (value: string) => void
  error?: string
}

/** Campo numérico para digitar o código EAN (8 a 14 dígitos), com limpar e mensagem de erro. */
export function BarcodeInput({ value, onChange, error }: BarcodeInputProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="sr-only">
        Código de barras
      </label>
      <div
        className={cn(
          'flex items-center gap-space-xs rounded-xl bg-surface-container-low px-space-md py-1.5 transition-all focus-within:bg-surface-container',
          error && 'ring-2 ring-error',
        )}
      >
        <Icon name="pin" size={22} className="text-outline" />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={14}
          placeholder="Digite os 13 dígitos do EAN..."
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d\s]/g, ''))}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="h-10 w-full bg-transparent text-body-lg text-on-surface outline-none placeholder:text-outline"
        />
        {value && (
          <button type="button" aria-label="Limpar código" onClick={() => onChange('')} className="p-1 text-outline hover:text-on-surface">
            <Icon name="cancel" size={18} />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  )
}
