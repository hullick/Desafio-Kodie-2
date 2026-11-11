import { Button } from '../atoms/Button'
import { Modal } from './Modal'

export type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  icon?: string
  confirmLabel: string
  cancelLabel?: string
  /** danger → botão de confirmar vermelho (ações que apagam algo). */
  tone?: 'primary' | 'danger'
}

/** Confirmação em modal (substitui o window.confirm do navegador). Esc ou tocar fora cancelam. */
export function ConfirmModal({ open, onClose, onConfirm, title, description, icon, confirmLabel, cancelLabel = 'Cancelar', tone = 'primary' }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} icon={icon} centered size="sm">
      <div className="flex w-full flex-col gap-space-sm">
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          size="lg"
          fullWidth
          data-autofocus
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          {confirmLabel}
        </Button>
        <Button variant="subtle" size="lg" fullWidth onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  )
}
