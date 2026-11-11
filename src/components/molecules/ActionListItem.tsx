import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type ActionListItemProps = {
  icon: string
  title: string
  description?: string
  trailingIcon?: string
  onClick: () => void
  /** muted → fundo cinza (dentro de cards/modais) · card → fundo branco com sombra e ícone em círculo. */
  tone?: 'muted' | 'card'
}

/** Opção clicável em lista (ex.: "Baixar em PDF", "Digitar outro código de barras"). */
export function ActionListItem({ icon, title, description, trailingIcon = 'chevron_right', onClick, tone = 'muted' }: ActionListItemProps) {
  const card = tone === 'card'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-between gap-space-sm text-left transition-colors',
        card
          ? 'min-h-12 rounded-2xl bg-surface-container-lowest px-space-md py-2 text-on-surface shadow-sm hover:text-primary'
          : 'rounded-xl bg-surface-container-low p-space-md hover:bg-surface-container',
      )}
    >
      <span className="flex items-center gap-space-sm">
        {card ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-primary">
            <Icon name={icon} size={20} />
          </span>
        ) : (
          <Icon name={icon} className="text-primary" />
        )}
        <span className="flex flex-col">
          <span className="text-label-lg font-bold text-on-surface">{title}</span>
          {description && <span className="text-body-sm text-outline">{description}</span>}
        </span>
      </span>
      <Icon name={trailingIcon} className="text-outline transition-colors group-hover:text-primary" />
    </button>
  )
}
