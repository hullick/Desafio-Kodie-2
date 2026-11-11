import { Icon } from '../atoms/Icon'

export type ActionListItemProps = {
  icon: string
  title: string
  description?: string
  trailingIcon?: string
  onClick: () => void
}

/** Opção clicável em lista (ex.: "Baixar em PDF", "Enviar para WhatsApp"). */
export function ActionListItem({ icon, title, description, trailingIcon = 'chevron_right', onClick }: ActionListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-space-sm rounded-xl bg-surface-container-low p-space-md text-left transition-colors hover:bg-surface-container"
    >
      <span className="flex items-center gap-space-sm">
        <Icon name={icon} className="text-primary" />
        <span className="flex flex-col">
          <span className="text-label-lg font-bold text-on-surface">{title}</span>
          {description && <span className="text-body-sm text-outline">{description}</span>}
        </span>
      </span>
      <Icon name={trailingIcon} className="text-outline transition-colors group-hover:text-primary" />
    </button>
  )
}
