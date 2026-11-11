import type { ReactNode } from 'react'
import { Button } from '../atoms/Button'
import { Modal } from '../molecules/Modal'

export type MarketSyncModalProps = {
  open: boolean
  onClose: () => void
  /** Link curto da lista. */
  link: string
  /** QR code renderizado pela página (este componente não gera o código). */
  qrCode?: ReactNode
}

/** Modal "Modo supermercado": QR code e link para abrir a lista no celular. */
export function MarketSyncModal({ open, onClose, link, qrCode }: MarketSyncModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      centered
      icon="qr_code_scanner"
      title="Modo supermercado"
      description="Aponte a câmera do celular para abrir esta lista:"
    >
      {qrCode && <div className="rounded-xl bg-surface-container-lowest p-3 shadow-md">{qrCode}</div>}
      <span className="text-label-sm tracking-wider break-all text-outline uppercase">Link rápido: {link}</span>
      <Button fullWidth onClick={onClose}>
        Pronto, já abri!
      </Button>
    </Modal>
  )
}
