import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'

export type DecisionBarProps = {
  /** Ex.: "Economize 31,2 g de açúcar adicionado com a Aveia Quaker." */
  message: string
  primaryLabel: string
  onPrimary: () => void
  onCompareAnother: () => void
  onSave?: () => void
}

/** Decisão recomendada: ação principal de troca e ações secundárias (trocar item, salvar duelo). */
export function DecisionBar({ message, primaryLabel, onPrimary, onCompareAnother, onSave }: DecisionBarProps) {
  return (
    <section className="flex flex-col gap-2.5 pt-1 lg:sticky lg:bottom-4 lg:z-40 lg:rounded-2xl lg:bg-surface-container-lowest/95 lg:p-space-lg lg:shadow-xl lg:ring-1 lg:ring-black/5 lg:backdrop-blur-md">
      <div className="flex flex-col items-center justify-between gap-space-md lg:flex-row">
        <div className="hidden w-full items-center gap-space-sm lg:flex lg:w-auto">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
            <Icon name="recommend" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-label-lg font-extrabold text-on-surface">Decisão recomendada: troca inteligente</h3>
            <p className="text-body-sm text-on-surface-variant">{message}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2.5 lg:w-auto lg:flex-row-reverse lg:items-center">
          <Button size="lg" icon="shopping_cart_checkout" onClick={onPrimary} fullWidth className="h-[52px] shadow-md lg:w-auto">
            {primaryLabel}
          </Button>
          <div className="grid grid-cols-2 gap-space-sm lg:flex">
            <Button variant="surface" size="lg" icon="find_replace" onClick={onCompareAnother} className="text-on-surface lg:bg-surface-container-low">
              Comparar com outro
            </Button>
            {onSave && (
              <Button variant="surface" size="lg" icon="bookmark_add" onClick={onSave} className="text-on-surface lg:bg-surface-container-low">
                Salvar duelo
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
