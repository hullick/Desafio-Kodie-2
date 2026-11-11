import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type ProductThumbProps = {
  src?: string
  alt: string
  /** Gramatura exibida sobre a imagem (ex.: "170g"). */
  quantity?: string
  /** sm → miniatura 96px (lista mobile) · full → largura total 176px de altura (card desktop). */
  size?: 'xs' | 'sm' | 'full'
  /** Conteúdo sobreposto no canto superior direito (ex.: alerta). */
  overlay?: ReactNode
  className?: string
}

const SIZES = {
  xs: 'h-11 w-11 rounded-lg',
  sm: 'h-24 w-24 rounded-xl',
  full: 'h-44 w-full rounded-xl',
}

/** Foto do produto com gramatura e estado "Sem foto cadastrada". */
export function ProductThumb({ src, alt, quantity, size = 'sm', overlay, className }: ProductThumbProps) {
  return (
    <div
      className={cn(
        'group/thumb relative flex shrink-0 items-center justify-center overflow-hidden bg-surface-container-low',
        SIZES[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-2 text-center">
          <Icon name="inventory_2" size={size === 'xs' ? 20 : 28} className="text-outline-variant" />
          {size !== 'xs' && (
            <span className="mt-1 text-[10px] leading-tight font-medium text-on-surface-variant">Sem foto cadastrada</span>
          )}
        </div>
      )}
      {quantity && size !== 'xs' && (
        <span
          className={cn(
            'absolute rounded bg-surface-container-lowest/90 px-1.5 py-0.5 text-[10px] font-bold text-on-surface shadow-sm',
            size === 'full' ? 'bottom-2 left-2 text-label-sm' : 'top-1 left-1',
          )}
        >
          {quantity}
        </span>
      )}
      {overlay && <div className="absolute top-2 right-2">{overlay}</div>}
    </div>
  )
}
