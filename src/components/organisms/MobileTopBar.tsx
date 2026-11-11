import type { ReactNode } from 'react'
import { Button } from '../atoms/Button'
import { CountBadge } from '../atoms/CountBadge'
import { Logo } from '../atoms/Logo'

export type MobileTopBarProps = {
  /** Com `onBack`, vira cabeçalho de pilha: botão voltar + título. */
  onBack?: () => void
  title?: string
  /** Ações extras à direita (substituem a lupa e o carrinho). */
  actions?: ReactNode
  /** Abre o modal de busca (lupa). Sem ele, a lupa não aparece (ex.: Home, que tem a própria busca). */
  onOpenSearch?: () => void
  /** Abre o checklist de mercado (carrinho). Sem ele, o carrinho não aparece. */
  onOpenCart?: () => void
  /** Itens ainda não pegos no checklist (contador sobre o carrinho). */
  cartCount?: number
}

/** Cabeçalho mobile: logo (abas) ou voltar + título (pilha), com lupa de busca e carrinho (checklist de mercado). */
export function MobileTopBar({ onBack, title, actions, onOpenSearch, onOpenCart, cartCount = 0 }: MobileTopBarProps) {
  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-2 px-gutter">
        {onBack ? (
          <div className="flex min-w-0 items-center gap-1">
            <Button variant="ghost" size="lg" icon="arrow_back" iconOnly aria-label="Voltar" onClick={onBack} className="-ml-2" />
            {title && <h1 className="truncate text-headline-sm text-on-surface">{title}</h1>}
          </div>
        ) : (
          <Logo size="sm" />
        )}
        <div className="flex items-center gap-1">
          {actions ?? (
            <>
              {onOpenSearch && (
                <Button variant="ghost" size="lg" icon="search" iconOnly aria-label="Buscar alimentos" onClick={onOpenSearch} />
              )}
              {onOpenCart && (
                <span className="relative">
                  <Button
                    variant="ghost"
                    size="lg"
                    icon="shopping_cart"
                    iconOnly
                    aria-label={cartCount > 0 ? `Checklist de mercado (${cartCount} para pegar)` : 'Checklist de mercado'}
                    aria-haspopup="dialog"
                    onClick={onOpenCart}
                  />
                  {cartCount > 0 && <CountBadge count={cartCount} tone="primary" className="pointer-events-none absolute top-1 right-0" />}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
