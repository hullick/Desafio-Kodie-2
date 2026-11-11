import { Icon } from '../atoms/Icon'

export type Crumb = { label: string; href?: string }

/** Trilha de navegação (Início › Categoria › Produto). O último item é a página atual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="flex items-center gap-space-xs text-label-md text-outline">
      {items.map((c, i) => {
        const last = i === items.length - 1
        return (
          <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-space-xs">
            {i > 0 && <Icon name="chevron_right" size={14} />}
            {last || !c.href ? (
              <span className={last ? 'max-w-[280px] truncate font-semibold text-on-surface' : undefined} aria-current={last ? 'page' : undefined}>
                {c.label}
              </span>
            ) : (
              <a href={c.href} className="flex items-center gap-1 transition-colors hover:text-primary">
                {i === 0 && <Icon name="home" size={16} />}
                {c.label}
              </a>
            )}
          </span>
        )
      })}
    </nav>
  )
}
