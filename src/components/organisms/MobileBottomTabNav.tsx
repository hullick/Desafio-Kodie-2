import { NAV_ITEMS, SCAN_HREF, type NavId } from '../../config/navigation'
import { cn } from '../../lib/cn'
import { Icon } from '../atoms/Icon'

export type MobileBottomTabNavProps = {
  activeId?: NavId
}

const TABS: NavId[] = ['home', 'favorites']

/** Barra inferior fixa: Início, Escanear (botão central em destaque) e Favoritos. */
export function MobileBottomTabNav({ activeId }: MobileBottomTabNavProps) {
  const [home, favorites] = TABS.map((id) => NAV_ITEMS.find((n) => n.id === id)!)

  const tab = (item: typeof home) => {
    const active = item.id === activeId
    return (
      <a
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex h-12 min-w-20 flex-col items-center justify-center transition-colors',
          active ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface',
        )}
      >
        <Icon name={item.icon} filled={active} />
        <span className="mt-space-xs text-label-sm">{item.shortLabel}</span>
      </a>
    )
  }

  const scanActive = activeId === 'scan'

  return (
    <nav
      aria-label="Principal"
      className="pb-safe fixed inset-x-0 bottom-0 z-50 bg-surface-container-lowest/90 shadow-[0_-2px_12px_rgba(15,23,42,0.05)] backdrop-blur-xl"
    >
      <div className="relative flex h-20 items-center justify-around px-space-md">
        {tab(home)}
        <a
          href={SCAN_HREF}
          aria-current={scanActive ? 'page' : undefined}
          className="group relative -top-5 flex flex-col items-center"
        >
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_6px_20px_rgba(0,105,72,0.45)] ring-4 ring-surface-container-lowest transition-all group-hover:bg-primary-container group-active:scale-95">
            <Icon name="barcode_scanner" size={34} />
          </span>
          <span className={cn('mt-1 text-label-md font-bold', scanActive ? 'text-primary' : 'text-on-surface')}>Escanear</span>
        </a>
        {tab(favorites)}
      </div>
    </nav>
  )
}
