import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  icon?: string
  /** Centraliza ícone e textos (ex.: modal com QR code). */
  centered?: boolean
  size?: 'sm' | 'md'
  children: ReactNode
}

/** Janela modal acessível (usa <dialog> nativo: Esc fecha, foco preso no conteúdo). */
export function Modal({ open, onClose, title, description, icon, centered = false, size = 'md', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-2xl bg-surface-container-lowest p-0 shadow-2xl backdrop:bg-inverse-surface/60 backdrop:backdrop-blur-sm',
        size === 'sm' ? 'max-w-sm' : 'max-w-md',
      )}
    >
      <div className={cn('relative flex flex-col gap-space-lg p-space-xl', centered && 'items-center text-center')}>
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute top-4 right-4 text-outline transition-colors hover:text-on-surface">
          <Icon name="close" size={20} />
        </button>
        <div className={cn('flex flex-col gap-space-xs', centered && 'items-center')}>
          {icon && (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
              <Icon name={icon} size={28} />
            </span>
          )}
          <h2 id={titleId} className="text-headline-lg font-bold text-on-surface">
            {title}
          </h2>
          {description && <p className="text-body-md text-on-surface-variant">{description}</p>}
        </div>
        {children}
      </div>
    </dialog>
  )
}
