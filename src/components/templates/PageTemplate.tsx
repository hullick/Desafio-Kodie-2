import type { ReactNode } from 'react'
import type { NavId } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { DesktopHeaderNav } from '../organisms/DesktopHeaderNav'
import { MobileBottomTabNav } from '../organisms/MobileBottomTabNav'
import { MobileTopBar } from '../organisms/MobileTopBar'
import { SiteFooter } from '../organisms/SiteFooter'

/**
 * tab   → MobileTabTemplate: top bar + conteúdo + barra de abas fixa.
 * stack → MobileStackTemplate: top bar com voltar + conteúdo + dock opcional de ações.
 */
export type MobileMode = { mode: 'tab' } | { mode: 'stack'; title: string; onBack: () => void; dock?: ReactNode }

export type PageTemplateProps = {
  activeNav?: NavId
  compareCount?: number
  mobile?: MobileMode
  onHeaderSearch?: (term: string) => void
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
  compareCount = 0,
  mobile = { mode: 'tab' },
  onHeaderSearch,
  fullWidth = false,
  children,
}: PageTemplateProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-body-md text-on-surface antialiased">
      <div className="hidden lg:block">
        <DesktopHeaderNav activeId={activeNav} onSearch={onHeaderSearch} />
      </div>
      <div className="lg:hidden">
        {mobile.mode === 'stack' ? <MobileTopBar onBack={mobile.onBack} title={mobile.title} /> : <MobileTopBar />}
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
          <MobileBottomTabNav activeId={activeNav} compareCount={compareCount} />
        ) : (
          mobile.dock && (
            <div className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 p-4 shadow-[0_-2px_12px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              {mobile.dock}
            </div>
          )
        )}
      </div>
      <div className="hidden lg:block">
        <SiteFooter />
      </div>
    </div>
  )
}
