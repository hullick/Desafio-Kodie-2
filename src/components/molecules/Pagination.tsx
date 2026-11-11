import { cn } from '../../lib/cn'
import { pageWindow } from '../../lib/pagination'
import { Icon } from '../atoms/Icon'

export type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
  /** Total de itens, para o texto "Exibindo 1 - 6 de 248 produtos". */
  totalItems?: number
  pageSize?: number
}

const BTN = 'flex h-9 w-9 items-center justify-center rounded-xl text-label-md transition-colors'

export function Pagination({ page, totalPages, onChange, totalItems, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null
  const first = pageSize ? (page - 1) * pageSize + 1 : undefined
  const last = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-sm"
    >
      {totalItems !== undefined && first !== undefined && last !== undefined ? (
        <span className="text-body-sm text-on-surface-variant">
          Exibindo{' '}
          <span className="font-semibold text-on-surface">
            {first} - {last}
          </span>{' '}
          de <span className="font-semibold text-on-surface">{totalItems}</span> produtos
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={cn(BTN, 'bg-surface-container-low text-on-surface hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50')}
        >
          <Icon name="chevron_left" size={18} />
        </button>
        {pageWindow(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="px-1 font-bold text-outline">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
              className={cn(
                BTN,
                p === page
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container',
              )}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className={cn(BTN, 'bg-surface-container-low text-on-surface hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-50')}
        >
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </nav>
  )
}
