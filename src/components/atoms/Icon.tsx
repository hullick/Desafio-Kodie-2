import { cn } from '../../lib/cn'

export type IconProps = {
  /** Nome do ícone Material Symbols (ex.: "search", "barcode_scanner"). */
  name: string
  filled?: boolean
  /**
   * Tamanho em px. Sem ele, vale 24px ou a classe de tamanho passada em `className`
   * (útil para tamanhos responsivos, ex.: "text-[18px] lg:text-[34px]").
   */
  size?: number
  className?: string
  /** Texto acessível. Sem ele, o ícone é decorativo (aria-hidden). */
  label?: string
}

export function Icon({ name, filled = false, size, className, label }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined',
        !size && !className?.includes('text-[') && 'text-[24px]',
        filled && 'icon-filled',
        className,
      )}
      style={size ? { fontSize: size } : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {name}
    </span>
  )
}
