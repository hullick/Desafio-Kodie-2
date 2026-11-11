import { cn } from '../../lib/cn'

export type IconProps = {
  /** Nome do ícone Material Symbols (ex.: "search", "barcode_scanner"). */
  name: string
  filled?: boolean
  /** Tamanho em px (padrão 24). */
  size?: number
  className?: string
  /** Texto acessível. Sem ele, o ícone é decorativo (aria-hidden). */
  label?: string
}

export function Icon({ name, filled = false, size = 24, className, label }: IconProps) {
  return (
    <span
      className={cn('material-symbols-outlined', filled && 'icon-filled', className)}
      style={{ fontSize: size }}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  )
}
