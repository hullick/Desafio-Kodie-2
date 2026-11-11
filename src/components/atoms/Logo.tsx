import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type LogoProps = {
  /** Mostra o slogan abaixo do nome. */
  showTagline?: boolean
  size?: 'sm' | 'md'
  href?: string
  className?: string
}

/** Marca ScanBite: ícone em quadrado verde + nome. */
export function Logo({ showTagline = false, size = 'md', href = '/', className }: LogoProps) {
  return (
    <a href={href} className={cn('group flex items-center gap-2', className)} aria-label="ScanBite, página inicial">
      <span
        className={cn(
          'flex items-center justify-center bg-primary text-on-primary shadow-sm transition-colors group-hover:bg-primary-container',
          size === 'md' ? 'h-10 w-10 rounded-xl' : 'h-8 w-8 rounded-lg',
        )}
      >
        <Icon name="qr_code_scanner" size={size === 'md' ? 24 : 18} />
      </span>
      <span className="flex flex-col">
        <span className="text-headline-sm leading-tight font-extrabold tracking-tight text-primary">
          Scan<span className="text-on-surface">Bite</span>
        </span>
        {showTagline && (
          <span className="text-label-sm tracking-wider text-outline uppercase">Decisões Claras</span>
        )}
      </span>
    </a>
  )
}
