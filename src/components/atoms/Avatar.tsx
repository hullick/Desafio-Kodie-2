import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type AvatarProps = {
  src?: string
  alt?: string
  size?: 'sm' | 'md'
  /** Indicador de status no canto. */
  status?: 'online' | 'offline'
  className?: string
}

/** Foto de perfil circular. Sem `src`, mostra ícone de pessoa. */
export function Avatar({ src, alt = 'Perfil', size = 'sm', status, className }: AvatarProps) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img src={src} alt={alt} className={cn(box, 'rounded-full object-cover')} />
      ) : (
        <span className={cn(box, 'flex items-center justify-center rounded-full bg-primary text-on-primary')}>
          <Icon name="person" size={size === 'sm' ? 18 : 22} label={alt} />
        </span>
      )}
      {status && (
        <span
          className={cn(
            'absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-surface',
            status === 'online' ? 'bg-success' : 'bg-outline',
          )}
          aria-label={status === 'online' ? 'Online' : 'Offline'}
        />
      )}
    </span>
  )
}
