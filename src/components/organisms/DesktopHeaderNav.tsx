import { NAV_ITEMS, SCAN_HREF, type NavId } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { Avatar } from '../atoms/Avatar'
import { Button } from '../atoms/Button'
import { Logo } from '../atoms/Logo'

export type DesktopHeaderNavProps = {
  activeId?: NavId
  /** Abre o modal de busca (lupa). Sem ele, a lupa não aparece (ex.: Home, que tem a própria busca). */
  onOpenSearch?: () => void
  avatarUrl?: string
}

/** Cabeçalho fixo desktop: logo, links, CTA Escanear, lupa de busca e perfil. */
export function DesktopHeaderNav({ activeId, onOpenSearch, avatarUrl }: DesktopHeaderNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-surface/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-gutter px-margin-lg">
        <Logo showTagline />

        <nav aria-label="Principal" className="hidden items-center gap-1 rounded-xl bg-surface-container-low/60 p-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.id === activeId
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-xl px-space-md py-space-sm text-label-lg transition-all',
                  active
                    ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface',
                )}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={SCAN_HREF} icon="barcode_scanner" className="hidden sm:inline-flex">
            Escanear
          </Button>
          {onOpenSearch && (
            <Button variant="ghost" icon="search" iconOnly aria-label="Buscar alimentos" onClick={onOpenSearch} className="rounded-xl" />
          )}
          <a href="/perfil" aria-label="Perfil" className="ml-1">
            <Avatar src={avatarUrl} />
          </a>
        </div>
      </div>
    </header>
  )
}
