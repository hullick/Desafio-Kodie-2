import { Icon } from '../atoms/Icon'
import { StatusPill } from '../atoms/StatusPill'
import { ProductCardCompact, type ProductCardCompactProps } from '../molecules/ProductCardCompact'

export type OfflineCachePanelProps = {
  items: Array<ProductCardCompactProps & { id: string }>
  title?: string
  /** Mensagem de rodapé (ex.: sincronização na reconexão). */
  footnote?: string
}

/** Itens consultados recentemente e guardados no aparelho, disponíveis sem internet. */
export function OfflineCachePanel({
  items,
  title = 'Histórico recente em cache',
  footnote = 'Sincronização automática na reconexão',
}: OfflineCachePanelProps) {
  return (
    <section className="flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-space-xs text-label-lg font-bold text-on-surface">
          <Icon name="history_toggle_off" size={20} className="text-primary" /> {title}
        </h2>
        <StatusPill tone="success" shape="pill">
          {items.length} {items.length === 1 ? 'disponível' : 'disponíveis'}
        </StatusPill>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl bg-surface-container-low p-space-md text-center text-body-sm text-on-surface-variant">
          Nenhum produto salvo no aparelho ainda.
        </p>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {items.map(({ id, ...item }) => (
            <ProductCardCompact key={id} {...item} />
          ))}
        </div>
      )}
      {footnote && (
        <p className="flex items-center justify-center gap-space-xs pt-space-xs text-body-sm text-outline">
          <Icon name="cloud_sync" size={16} /> {footnote}
        </p>
      )}
    </section>
  )
}
