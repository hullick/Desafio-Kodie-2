import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type InputFieldVariant = 'compact' | 'default' | 'hero'

export type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  /** Rótulo acessível (visível só para leitores de tela). */
  label: string
  leadingIcon?: string
  /** Atalho exibido à direita (ex.: "⌘K" ou "/"). */
  shortcut?: string
  /** Mostra botão de limpar quando há valor. */
  onClear?: () => void
  /** Conteúdo extra à direita (ex.: botão de filtros). */
  trailing?: ReactNode
  variant?: InputFieldVariant
  containerClassName?: string
}

/** Campo de texto para busca ou código de barras EAN-13, com slots de ícone e atalho. */
export function InputField({
  label,
  leadingIcon,
  shortcut,
  onClear,
  trailing,
  variant = 'default',
  containerClassName,
  className,
  id,
  value,
  ...rest
}: InputFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hasValue = value !== undefined && String(value).length > 0

  return (
    <div
      className={cn(
        'relative flex w-full items-center bg-surface-container-lowest transition-all',
        variant === 'hero' && 'gap-2 rounded-2xl p-1 shadow-md focus-within:shadow-xl',
        variant === 'default' && 'rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary',
        variant === 'compact' && 'rounded-xl px-3 py-1 shadow-level-1',
        containerClassName,
      )}
    >
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>

      {leadingIcon &&
        (variant === 'hero' ? (
          <span className="ml-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-primary">
            <Icon name={leadingIcon} size={26} />
          </span>
        ) : (
          <span className={cn('pointer-events-none text-outline', variant === 'default' ? 'pl-4' : 'mr-1')}>
            <Icon name={leadingIcon} size={variant === 'compact' ? 20 : 24} />
          </span>
        ))}

      <input
        id={inputId}
        value={value}
        className={cn(
          'w-full min-w-0 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none',
          '[&::-webkit-search-cancel-button]:hidden',
          variant === 'default' && 'h-12 px-3 text-body-lg',
          variant === 'hero' && 'py-2 text-body-lg placeholder:text-outline',
          variant === 'compact' && 'text-body-md placeholder:text-outline',
          className,
        )}
        {...rest}
      />

      {shortcut && (
        <kbd
          className={cn(
            'hidden shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] text-outline select-none sm:inline-block',
            variant === 'hero' ? 'mr-1 bg-surface-container-high text-[11px]' : 'bg-surface-container-low',
          )}
        >
          {shortcut}
        </kbd>
      )}

      {onClear && hasValue && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar campo"
          className="flex items-center pr-4 text-outline transition-colors hover:text-on-surface"
        >
          <Icon name="cancel" size={20} />
        </button>
      )}

      {trailing}
    </div>
  )
}
