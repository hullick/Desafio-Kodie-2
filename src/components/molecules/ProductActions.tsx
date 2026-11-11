import { Button } from '../atoms/Button'

export type ProductActionsProps = {
  saved: boolean
  onToggleSave: () => void
  onShare: () => void
  onReport?: () => void
  /** Link para o comparador com alternativas da mesma categoria. */
  alternativesHref: string
  /** dock → barra inferior fixa (mobile) · panel → bloco na coluna lateral (desktop). */
  variant: 'dock' | 'panel'
}

/** Ações do produto: alternativas mais saudáveis, salvar, compartilhar e reportar. */
export function ProductActions({ saved, onToggleSave, onShare, onReport, alternativesHref, variant }: ProductActionsProps) {
  if (variant === 'dock') {
    return (
      <div className="mx-auto flex max-w-lg items-center gap-space-sm">
        <Button
          href={alternativesHref}
          variant="subtle"
          size="lg"
          icon="compare_arrows"
          trailingIcon="arrow_forward"
          className="h-[52px] flex-[1.4] justify-between truncate bg-secondary-container text-on-secondary-fixed-variant"
        >
          <span className="truncate text-body-sm font-bold">Alternativas mais saudáveis</span>
        </Button>
        <Button size="lg" icon={saved ? 'bookmark_added' : 'bookmark'} onClick={onToggleSave} aria-pressed={saved} className="h-[52px] flex-1">
          {saved ? 'Salvo' : 'Salvar'}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <Button href={alternativesHref} size="lg" icon="compare_arrows" fullWidth className="h-[52px]">
        Comparar com alternativas mais saudáveis
      </Button>
      <div className="grid grid-cols-3 gap-space-xs">
        <Button variant="subtle" size="sm" icon={saved ? 'favorite' : 'favorite_border'} onClick={onToggleSave} aria-pressed={saved} className="h-11 [&>span:first-child]:text-error">
          {saved ? 'Salvo' : 'Salvar'}
        </Button>
        <Button variant="subtle" size="sm" icon="share" onClick={onShare} className="h-11">
          Compartilhar
        </Button>
        {onReport && (
          <Button variant="subtle" size="sm" icon="flag" onClick={onReport} title="Informar rótulo desatualizado" className="h-11 hover:bg-error-container/40 hover:text-error">
            Reportar
          </Button>
        )}
      </div>
    </div>
  )
}
