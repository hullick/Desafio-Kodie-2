/** `scan` não está em NAV_ITEMS (o scanner é o botão de destaque), mas marca a aba ativa nele. */
export type NavId = 'home' | 'scan' | 'compare' | 'favorites'

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
  { id: 'home', label: 'Início / Explorar', shortLabel: 'Início', href: '/', icon: 'home' },
  { id: 'compare', label: 'Comparador', shortLabel: 'Comparar', href: '/comparar', icon: 'compare_arrows' },
  { id: 'favorites', label: 'Meus Favoritos', shortLabel: 'Favoritos', href: '/favoritos', icon: 'favorite' },
]

export const SCAN_HREF = '/scanner'
