import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { ChecklistItem } from '../molecules/ChecklistItem'

export type ShoppingChecklistProps = {
  items: Array<{ id: string; title: string; detail?: string; checked: boolean }>
  onToggle: (id: string, checked: boolean) => void
  onOpenOnPhone?: () => void
  onPrint?: () => void
}

/** Checklist de mercado gerado a partir dos favoritos. */
export function ShoppingChecklist({ items, onToggle, onOpenOnPhone, onPrint }: ShoppingChecklistProps) {
  const active = items.filter((i) => !i.checked).length
  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-space-xs text-headline-sm font-bold text-on-surface">
          <Icon name="checklist" size={22} className="text-secondary" /> Checklist de mercado
        </h2>
        <span className="text-label-sm text-outline">
          {active} {active === 1 ? 'item ativo' : 'itens ativos'}
        </span>
      </div>
      <div className="flex flex-col gap-2 pt-1">
        {items.map((i) => (
          <ChecklistItem key={i.id} title={i.title} detail={i.detail} checked={i.checked} onChange={(c) => onToggle(i.id, c)} />
        ))}
      </div>
      {(onOpenOnPhone || onPrint) && (
        <div className="flex flex-col gap-2 pt-2">
          {onOpenOnPhone && (
            <Button icon="qr_code_2" fullWidth onClick={onOpenOnPhone} className="h-11">
              Abrir no celular para o mercado
            </Button>
          )}
          {onPrint && (
            <Button variant="subtle" size="sm" icon="print" fullWidth onClick={onPrint} className="h-10">
              Imprimir versão econômica
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
