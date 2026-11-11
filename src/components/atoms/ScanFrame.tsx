import { cn } from '../../lib/cn'
import { Icon } from './Icon'

export type ScanFrameProps = {
  /** Mostra a linha de leitura animada e o selo "Escaneando...". */
  scanning?: boolean
  className?: string
}

const CORNER = 'absolute h-8 w-8 border-success'

/** Moldura de leitura do código de barras: cantos verdes, laser animado e status. */
export function ScanFrame({ scanning = true, className }: ScanFrameProps) {
  return (
    <div className={cn('relative flex h-[190px] w-full max-w-[300px] items-center justify-center overflow-hidden rounded-xl shadow-2xl', className)} aria-hidden>
      <span className="absolute inset-0 bg-on-surface/10 backdrop-blur-[1px]" />
      <span className={cn(CORNER, 'top-0 left-0 rounded-tl-xl border-t-[3.5px] border-l-[3.5px]')} />
      <span className={cn(CORNER, 'top-0 right-0 rounded-tr-xl border-t-[3.5px] border-r-[3.5px]')} />
      <span className={cn(CORNER, 'bottom-0 left-0 rounded-bl-xl border-b-[3.5px] border-l-[3.5px]')} />
      <span className={cn(CORNER, 'right-0 bottom-0 rounded-br-xl border-r-[3.5px] border-b-[3.5px]')} />
      {scanning && (
        <>
          <span className="absolute inset-x-0 h-[2px] animate-scan-laser bg-gradient-to-r from-transparent via-success to-transparent shadow-[0_0_12px_var(--color-success)]" />
          <span className="absolute bottom-2 flex items-center gap-1 rounded-full bg-inverse-surface/80 px-space-sm py-0.5 text-tertiary-fixed-dim">
            <Icon name="sync" size={14} className="animate-spin" />
            <span className="text-label-sm tracking-wider uppercase">Escaneando...</span>
          </span>
        </>
      )}
    </div>
  )
}
