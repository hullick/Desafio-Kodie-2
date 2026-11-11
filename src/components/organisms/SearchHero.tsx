import { SCAN_HREF } from '../../config/navigation'
import { Button } from '../atoms/Button'
import { StatusPill } from '../atoms/StatusPill'
import { SearchBarGlobal } from '../molecules/SearchBarGlobal'
import { SearchSuggestions } from '../molecules/SearchSuggestions'

export type SearchHeroProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (term: string) => void
  suggestions?: string[]
  onOpenFilters?: () => void
  scanHref?: string
}

/**
 * Bloco de busca da página inicial.
 * Mobile: campo + botão "Escanear" de largura total.
 * Desktop: título, subtítulo, CTA de escanear e busca em destaque com sugestões.
 */
export function SearchHero({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onOpenFilters,
  scanHref = SCAN_HREF,
}: SearchHeroProps) {
  return (
    <section className="w-full lg:bg-gradient-to-b lg:from-surface-container-low/70 lg:via-surface lg:to-surface lg:pt-space-lg lg:pb-space-xl">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 lg:gap-0 lg:px-margin-lg">
        <div className="mb-space-lg hidden items-end justify-between gap-space-lg lg:flex">
          <div className="max-w-2xl">
            <StatusPill tone="success" shape="pill" icon="verified" uppercase className="mb-space-xs">
              Classificações NOVA &amp; Nutri-Score
            </StatusPill>
            <h1 className="text-display-lg tracking-tight text-on-surface">Avalie alimentos e faça escolhas conscientes</h1>
            <p className="mt-space-xs max-w-xl text-body-lg text-on-surface-variant">
              Decifre tabelas nutricionais instantaneamente. Compare açúcares, sódio e aditivos para encher seu carrinho
              com saúde.
            </p>
          </div>
          <Button href={scanHref} size="lg" icon="barcode_scanner">
            Escanear Código / Digitar EAN
          </Button>
        </div>

        <SearchBarGlobal value={value} onChange={onChange} onSubmit={onSubmit} className="lg:hidden" />
        <SearchBarGlobal
          variant="hero"
          shortcut="/"
          placeholder="Digite nome do produto, ingrediente ou marca..."
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          onOpenFilters={onOpenFilters}
          className="hidden lg:block"
        />

        <Button href={scanHref} size="lg" icon="photo_camera" fullWidth className="h-[52px] lg:hidden">
          Escanear código de barras
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-space-sm hidden lg:block">
            <SearchSuggestions items={suggestions} onSelect={onSubmit} />
          </div>
        )}
      </div>
    </section>
  )
}
