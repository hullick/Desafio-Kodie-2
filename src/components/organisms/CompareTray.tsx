import { Button } from '../atoms/Button'
import { CountBadge } from '../atoms/CountBadge'
import { ProductThumb } from '../atoms/ProductThumb'
import { StatusPill } from '../atoms/StatusPill'

export type CompareTrayProps = {
  count: number
  /** Último produto adicionado (miniatura e categoria). */
  lastItem?: { name: string; imageUrl?: string; category?: string }
  onClear: () => void
  compareHref: string
  /** Mínimo para abrir o comparador. */
  min?: number
}

/** Barra flutuante com os itens selecionados para comparação. */
export function CompareTray({ count, lastItem, onClear, compareHref, min = 2 }: CompareTrayProps) {
  if (count === 0) return null
  const ready = count >= min

  return (
    // No mobile fica acima do menu inferior (80px + o botão do scanner, que sobe ~26px); no desktop não há menu.
    <aside className="pointer-events-none fixed bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] left-1/2 lg:bottom-6 z-40 w-full max-w-[800px] -translate-x-1/2 px-4" aria-live="polite">
      <div className="pointer-events-auto flex w-full items-center justify-between gap-space-md rounded-2xl bg-inverse-surface p-space-sm px-space-md text-inverse-on-surface shadow-2xl">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div className="relative shrink-0 rounded-xl bg-surface-container-lowest p-0.5">
            <ProductThumb src={lastItem?.imageUrl} alt={lastItem?.name ?? 'Produto'} size="xs" />
            <CountBadge count={count} tone="primary" className="absolute -top-1 -right-1" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-bold">
                {count} {count === 1 ? 'produto' : 'produtos'} no comparador
              </span>
              {lastItem?.category && (
                <StatusPill tone="inverse" shape="pill" uppercase className="text-[10px]">
                  {lastItem.category}
                </StatusPill>
              )}
            </div>
            <p className="truncate text-body-sm text-outline-variant">
              {ready ? 'Pronto para comparar lado a lado' : 'Selecione outro item para abrir o duelo nutricional'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onClear} className="px-2 py-1.5 text-label-sm text-outline-variant transition-colors hover:text-white">
            Limpar
          </button>
          <Button href={compareHref} size="md" trailingIcon="compare" aria-disabled={!ready} className={ready ? undefined : 'pointer-events-none opacity-60'}>
            Abrir Comparador
          </Button>
        </div>
      </div>
    </aside>
  )
}
