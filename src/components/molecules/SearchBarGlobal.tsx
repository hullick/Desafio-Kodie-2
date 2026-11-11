import type { FormEvent } from 'react'
import { Button } from '../atoms/Button'
import { InputField, type InputFieldVariant } from '../atoms/InputField'

export type SearchBarGlobalProps = {
  value: string
  onChange: (value: string) => void
  /** Disparado só no Enter ou no envio (a API limita buscas a 10/min). */
  onSubmit: (value: string) => void
  placeholder?: string
  /** compact → cabeçalho desktop · default → mobile · hero → destaque da página inicial. */
  variant?: InputFieldVariant
  shortcut?: string
  /** Abre filtros avançados (botão à direita na variante hero). */
  onOpenFilters?: () => void
  className?: string
}

export function SearchBarGlobal({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar produto, marca ou código...',
  variant = 'default',
  shortcut,
  onOpenFilters,
  className,
}: SearchBarGlobalProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const term = value.trim()
    if (term) onSubmit(term)
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <InputField
        label="Buscar produto, marca ou código de barras"
        type="search"
        enterKeyHint="search"
        leadingIcon="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={variant === 'default' ? () => onChange('') : undefined}
        shortcut={shortcut}
        variant={variant}
        trailing={
          variant === 'hero' && onOpenFilters ? (
            <Button variant="subtle" size="md" icon="tune" iconOnly aria-label="Filtros avançados" onClick={onOpenFilters} className="mr-1 rounded-xl" />
          ) : undefined
        }
      />
    </form>
  )
}
