import { Button } from '../atoms/Button'
import { ActionListItem } from '../molecules/ActionListItem'
import { Modal } from '../molecules/Modal'

export type ExportListModalProps = {
  open: boolean
  onClose: () => void
  onExportPdf: () => void
  onShareWhatsApp: () => void
}

/** Modal "Exportar lista saudável": PDF ou WhatsApp. */
export function ExportListModal({ open, onClose, onExportPdf, onShareWhatsApp }: ExportListModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="share"
      title="Exportar lista saudável"
      description="Escolha o formato para levar suas compras ao supermercado."
    >
      <div className="flex flex-col gap-space-sm">
        <ActionListItem icon="picture_as_pdf" title="Baixar em PDF" description="Inclui Nutri-Score e ingredientes" trailingIcon="download" onClick={onExportPdf} />
        <ActionListItem icon="chat" title="Enviar para WhatsApp" description="Texto com caixas de seleção [ ]" trailingIcon="send" onClick={onShareWhatsApp} />
      </div>
      <Button variant="subtle" fullWidth onClick={onClose} className="h-12">
        Cancelar
      </Button>
    </Modal>
  )
}
