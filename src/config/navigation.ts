export type NavId = 'home' | 'scan' | 'compare' | 'favorites' | 'help'

export type NavItem = {
  id: NavId
  /** Rótulo no menu desktop. */
  label: string
  /** Rótulo curto na barra inferior mobile. */
  shortLabel: string
  href: string
  icon: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Início / Explorar', shortLabel: 'Início', href: '/', icon: 'search' },
  { id: 'compare', label: 'Comparador', shortLabel: 'Comparar', href: '/comparar', icon: 'compare_arrows' },
  { id: 'favorites', label: 'Meus Favoritos', shortLabel: 'Favoritos', href: '/favoritos', icon: 'favorite' },
  { id: 'scan', label: 'Escanear EAN', shortLabel: 'Escanear', href: '/scanner', icon: 'barcode_scanner' },
  { id: 'help', label: 'Ajuda', shortLabel: 'Ajuda', href: '/ajuda', icon: 'help' },
]

export const SCAN_HREF = '/scanner'
