import { useEffect, useId, useRef, useState } from 'react'
import { healthScore } from '../../lib/healthScore'
import type { NovaGroup, NutriGrade } from '../../types/nutrition'
import { BadgeNutriScore } from '../atoms/BadgeNutriScore'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { ChecklistItem } from '../molecules/ChecklistItem'
import { ConfirmModal } from '../molecules/ConfirmModal'
import { DistributionBar } from '../molecules/DistributionBar'

export type CartDrawerProps = {
  open: boolean
  onClose: () => void
  items: Array<{ id: string; title: string; detail?: string; nutriscore: NutriGrade | null; nova: NovaGroup | null; checked: boolean }>
  onToggle: (id: string, checked: boolean) => void
  /** Tira o item do carrinho. */
  onRemove?: (id: string) => void
  /** Esvazia o carrinho (pede confirmação antes). */
  onClear?: () => void
}

/**
 * Painel lateral (menu sanduíche) com o checklist de mercado, aberto pelo carrinho do cabeçalho mobile.
 * Usa <dialog> nativo: Esc fecha e o foco fica preso no painel; tocar fora fecha.
 */
export function CartDrawer({ open, onClose, items, onToggle, onRemove, onClear }: CartDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const active = items.filter((i) => !i.checked).length
  const health = healthScore(items)

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      // O React propaga o `close` de um <dialog> aninhado (ex.: confirmação dentro do painel): só o próprio fecha.
      onClose={(e) => e.target === e.currentTarget && onClose()}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-0 ml-auto h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-surface-container-lowest p-0 shadow-2xl backdrop:bg-inverse-surface/60 backdrop:backdrop-blur-sm"
    >
      <div className="pt-safe pb-safe flex h-full flex-col">
        <div className="flex items-center justify-between gap-space-sm border-b border-outline-variant/40 px-space-md py-space-md">
          <h2 id={titleId} className="flex items-center gap-space-xs text-headline-sm font-bold text-on-surface">
            <Icon name="checklist" size={22} className="text-secondary" /> Checklist de mercado
          </h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="flex h-10 w-10 items-center justify-center rounded-full text-outline transition-colors hover:text-on-surface">
            <Icon name="close" size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-space-md p-space-lg text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name="add_shopping_cart" size={28} />
            </span>
            <p className="text-body-md text-on-surface-variant">Toque no carrinho de um produto para levá-lo ao mercado.</p>
            <Button href="/" variant="subtle" icon="search">
              Buscar produtos
            </Button>
          </div>
        ) : (
          <>
            <section aria-label="Quão saudável está o carrinho" className="mx-space-md mt-space-md flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md">
              {health.graded > 0 ? (
                <>
                  <div className="flex items-end justify-between gap-space-sm">
                    <div className="flex flex-col">
                      <span className="text-label-sm tracking-wider text-outline uppercase">Nota do carrinho</span>
                      <span className="text-headline-lg font-bold text-on-surface">{health.scoreLabel}/10</span>
                    </div>
                    <span className="text-label-md font-bold text-primary">{health.verdict}</span>
                  </div>
                  <DistributionBar title={`${health.healthyShare}% com Nutri-Score A ou B`} segments={health.distribution} />
                </>
              ) : (
                <p className="text-body-sm text-on-surface-variant">Nenhum produto do carrinho tem Nutri-Score para calcular a nota.</p>
              )}
              {health.ultra > 0 && (
                <p className="flex items-center gap-1 text-label-sm text-error">
                  <Icon name="warning" size={16} />
                  {health.ultra} {health.ultra === 1 ? 'ultraprocessado' : 'ultraprocessados'} (NOVA 4)
                </p>
              )}
            </section>
            <p className="px-space-md pt-space-md text-label-sm text-outline">
              {active} {active === 1 ? 'item para pegar' : 'itens para pegar'} de {items.length}
            </p>
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-space-sm py-space-sm">
              {items.map((i) => (
                <div key={i.id} className="flex items-center gap-1">
                  <div className="min-w-0 flex-1">
                    <ChecklistItem
                      title={i.title}
                      detail={i.detail}
                      checked={i.checked}
                      onChange={(c) => onToggle(i.id, c)}
                      trailing={<BadgeNutriScore grade={i.nutriscore} variant="circle" className="shrink-0" />}
                    />
                  </div>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(i.id)}
                      aria-label={`Tirar ${i.title} do carrinho`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-outline transition-colors hover:bg-error-container/40 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Icon name="delete" size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {onClear && (
              <div className="border-t border-outline-variant/40 p-space-md">
                <Button
                  variant="subtle"
                  size="md"
                  icon="remove_shopping_cart"
                  fullWidth
                  onClick={() => setConfirmClear(true)}
                  className="hover:bg-error-container/40 hover:text-error"
                >
                  Limpar carrinho
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {onClear && (
        <ConfirmModal
          open={confirmClear}
          onClose={() => setConfirmClear(false)}
          onConfirm={onClear}
          icon="remove_shopping_cart"
          title="Limpar carrinho?"
          description={`${items.length} ${items.length === 1 ? 'produto sai' : 'produtos saem'} do checklist de mercado. Os favoritos não mudam.`}
          confirmLabel="Limpar carrinho"
          tone="danger"
        />
      )}
    </dialog>
  )
}
