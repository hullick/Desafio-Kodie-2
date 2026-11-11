import { NAV_ITEMS, SCAN_HREF, type NavId } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { CountBadge } from '../atoms/CountBadge'
import { Icon } from '../atoms/Icon'

export type MobileBottomTabNavProps = {
  activeId?: NavId
  /** Itens no comparador (badge sobre "Comparar"). */
  compareCount?: number
}

const TABS: NavId[] = ['home', 'compare', 'favorites']

/** Barra inferior fixa: Início, Escanear (botão central), Comparar e Favoritos. */
export function MobileBottomTabNav({ activeId, compareCount = 0 }: MobileBottomTabNavProps) {
  const [home, compare, favorites] = TABS.map((id) => NAV_ITEMS.find((n) => n.id === id)!)

  const tab = (item: typeof home, badge?: number) => {
    const active = item.id === activeId
    return (
      <a
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-12 min-w-16 flex-col items-center justify-center transition-colors',
          active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface',
        )}
      >
        <span className="relative flex items-center justify-center">
          <Icon name={item.icon} filled={active && item.id === 'favorites'} />
          {badge !== undefined && badge > 0 && (
            <CountBadge count={badge} className="absolute -top-1 -right-2" label={`${badge} itens no comparador`} />
          )}
        </span>
        <span className="mt-space-xs text-label-sm">{item.shortLabel}</span>
      </a>
    )
  }

  return (
    <nav
      aria-label="Principal"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 shadow-[0_-2px_12px_rgba(15,23,42,0.05)] backdrop-blur-xl"
    >
      <div className="relative flex h-20 items-center justify-around px-space-xs">
        {tab(home)}
        <div className="relative -top-4 flex items-center justify-center">
          <a
            href={SCAN_HREF}
            aria-label="Escanear alimento"
            aria-current={activeId === 'scan' ? 'page' : undefined}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,105,72,0.35)] transition-all hover:bg-primary-container active:scale-95"
          >
            <Icon name="barcode_scanner" size={28} />
          </a>
        </div>
        {tab(compare, compareCount)}
        {tab(favorites)}
      </div>
    </nav>
  )
}
