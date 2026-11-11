import { cn } from '../../lib/cn'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

export type ProductActionsProps = {
  saved: boolean
  onToggleSave: () => void
  onShare: () => void
  onReport?: () => void
  /** Link para o comparador com alternativas da mesma categoria. */
  alternativesHref: string
  /** Checklist de mercado: botão de carrinho na barra inferior (o checklist só existe no mobile). */
  cart?: { active: boolean; onToggle: () => void }
  /** dock → barra inferior fixa (mobile) · panel → bloco na coluna lateral (desktop). */
  variant: 'dock' | 'panel'
}

/** Ações do produto: alternativas mais saudáveis, salvar, carrinho (mobile), compartilhar e reportar. */
export function ProductActions({ saved, onToggleSave, onShare, onReport, alternativesHref, cart, variant }: ProductActionsProps) {
  if (variant === 'dock') {
    // Ícone e texto lado a lado; cada botão parte da largura do próprio texto (cabe em 360px).
    const dockBtn = 'flex h-[52px] min-w-0 flex-auto items-center justify-center gap-1.5 rounded-xl px-2 text-label-md font-bold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
    return (
      <div className="mx-auto flex max-w-lg items-center gap-space-xs">
        <a href={alternativesHref} className={cn(dockBtn, 'bg-secondary-container text-on-secondary-fixed-variant')}>
          <Icon name="compare_arrows" size={20} />
          <span className="truncate">Alternativas</span>
        </a>
        <button type="button" onClick={onToggleSave} aria-pressed={saved} className={cn(dockBtn, 'bg-primary text-on-primary hover:bg-primary-container')}>
          <Icon name={saved ? 'bookmark_added' : 'bookmark'} size={20} />
          <span className="truncate">{saved ? 'Salvo' : 'Salvar'}</span>
        </button>
        {cart && (
          <button
            type="button"
            onClick={cart.onToggle}
            aria-pressed={cart.active}
            aria-label={cart.active ? 'Tirar do checklist de mercado' : 'Adicionar ao checklist de mercado'}
            className={cn(dockBtn, cart.active ? 'bg-secondary-container text-primary' : 'bg-surface-container-low text-on-surface hover:bg-secondary-container')}
          >
            <Icon name={cart.active ? 'shopping_cart' : 'add_shopping_cart'} filled={cart.active} size={20} />
            <span className="truncate">{cart.active ? 'No carrinho' : 'Adicionar'}</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <Button href={alternativesHref} size="lg" icon="compare_arrows" fullWidth className="h-[52px]">
        Comparar com alternativas mais saudáveis
      </Button>
      <div className="grid grid-cols-3 gap-space-xs">
        <Button variant="subtle" size="sm" icon={saved ? 'favorite' : 'favorite_border'} onClick={onToggleSave} aria-pressed={saved} className="h-11 [&>span:first-child]:text-error">
          {saved ? 'Salvo' : 'Salvar'}
        </Button>
        <Button variant="subtle" size="sm" icon="share" onClick={onShare} className="h-11">
          Compartilhar
        </Button>
        {onReport && (
          <Button variant="subtle" size="sm" icon="flag" onClick={onReport} title="Informar rótulo desatualizado" className="h-11 hover:bg-error-container/40 hover:text-error">
            Reportar
          </Button>
        )}
      </div>
    </div>
  )
}
