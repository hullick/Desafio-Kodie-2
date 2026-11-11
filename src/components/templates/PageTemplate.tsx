import { useState, type ReactNode } from 'react'
import type { NavId } from '../../config/navigation'
import { clearChecklist, removeFromChecklist, setChecklistChecked, useChecklist } from '../../hooks/useChecklist'
import { cn } from '../../lib/cn'
import { CartDrawer } from '../organisms/CartDrawer'
import { DesktopHeaderNav } from '../organisms/DesktopHeaderNav'
import { MobileBottomTabNav } from '../organisms/MobileBottomTabNav'
import { MobileTopBar } from '../organisms/MobileTopBar'
import { SearchModal } from '../organisms/SearchModal'
import { SiteFooter } from '../organisms/SiteFooter'

/**
 * tab   → MobileTabTemplate: top bar + conteúdo + barra de abas fixa.
 * stack → MobileStackTemplate: top bar com voltar + conteúdo + dock opcional de ações.
 */
export type MobileMode = { mode: 'tab' } | { mode: 'stack'; title: string; onBack: () => void; dock?: ReactNode }

export type PageTemplateProps = {
  activeNav?: NavId
  mobile?: MobileMode
  /** Esconde a lupa do cabeçalho (a Home tem a própria busca). */
  hideSearch?: boolean
  /** Largura do conteúdo no desktop (padrão: contido em 1200px). */
  fullWidth?: boolean
  children: ReactNode
}

/**
 * Estrutura de página responsiva.
 * Desktop (≥1024px): DesktopHeaderNav fixo + container centralizado + SiteFooter.
 * Mobile: MobileTopBar + conteúdo rolável + barra inferior (abas ou dock).
 */
export function PageTemplate({
  activeNav,
  mobile = { mode: 'tab' },
  hideSearch = false,
  fullWidth = false,
  children,
}: PageTemplateProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const checklist = useChecklist()
  const cartCount = checklist.filter((i) => !i.checked).length
  const openSearch = hideSearch ? undefined : () => setSearchOpen(true)
  const openCart = () => setCartOpen(true)

  return (
    <div className="flex min-h-screen flex-col bg-surface text-body-md text-on-surface antialiased">
      <div className="hidden lg:block">
        <DesktopHeaderNav activeId={activeNav} onOpenSearch={openSearch} />
      </div>
      <div className="lg:hidden">
        {mobile.mode === 'stack' ? (
          <MobileTopBar onBack={mobile.onBack} title={mobile.title} onOpenSearch={openSearch} onOpenCart={openCart} cartCount={cartCount} />
        ) : (
          <MobileTopBar onOpenSearch={openSearch} onOpenCart={openCart} cartCount={cartCount} />
        )}
      </div>

      <main
        className={cn(
          'relative flex w-full flex-1 flex-col pt-16 pb-24 lg:pt-20 lg:pb-0',
          !fullWidth && 'lg:mx-auto lg:max-w-[1200px] lg:px-margin-lg',
        )}
      >
        {children}
      </main>

      <div className="lg:hidden">
        {mobile.mode === 'tab' ? (
          <MobileBottomTabNav activeId={activeNav} />
        ) : (
          mobile.dock && (
            <div className="fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-[0_-2px_12px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              {mobile.dock}
            </div>
          )
        )}
      </div>
      <div className="hidden lg:block">
        <SiteFooter />
      </div>

      {openSearch && <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={checklist.map(({ code, ...item }) => ({ id: code, ...item }))}
        onToggle={setChecklistChecked}
        onRemove={removeFromChecklist}
        onClear={clearChecklist}
      />
    </div>
  )
}
