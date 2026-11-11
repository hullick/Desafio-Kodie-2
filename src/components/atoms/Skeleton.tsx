import { cn } from '../../lib/cn'

export type SkeletonProps = {
  /** Classes de tamanho e forma (ex.: "h-4 w-28 rounded"). */
  className?: string
  /** strong → tom mais escuro (títulos, imagens) · soft → tom claro (textos secundários). */
  tone?: 'strong' | 'soft'
  /** Faixa de brilho deslizando (para imagens). */
  shimmer?: boolean
}

/** Bloco de carregamento (placeholder pulsante). */
export function Skeleton({ className, tone = 'strong', shimmer = false }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative block animate-pulse overflow-hidden',
        tone === 'strong' ? 'bg-surface-container-highest' : 'bg-surface-container-high',
        className,
      )}
    >
      {shimmer && (
        <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-surface-container-low/60 to-transparent" />
      )}
    </span>
  )
}
