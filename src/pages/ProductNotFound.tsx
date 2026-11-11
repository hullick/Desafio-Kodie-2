import { useNavigate } from 'react-router'
import { ActionListItem } from '../components/molecules/ActionListItem'
import { ScannedCodeBar } from '../components/molecules/ScannedCodeBar'
import { CrowdsourcingUploadCard } from '../components/organisms/CrowdsourcingUploadCard'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { RelatedProductsGrid } from '../components/organisms/RelatedProductsGrid'
import { PageTemplate } from '../components/templates/PageTemplate'
import { POPULAR_ITEMS } from './shared.mock'

export type ProductNotFoundProps = {
  /** Código lido ou digitado que não existe na base. */
  barcode: string
}

/** 404 de produto: o código não está na Open Food Facts; convida a cadastrar ou tentar de novo. */
export function ProductNotFound({ barcode }: ProductNotFoundProps) {
  const navigate = useNavigate()
  const addUrl = `https://br.openfoodfacts.org/cgi/product.pl?type=add&code=${encodeURIComponent(barcode)}`

  return (
    <PageTemplate activeNav="scan" mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate(-1) }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ScannedCodeBar barcode={barcode} status="Não cadastrado" />

        <ErrorHeroBlock
          icon="inventory_2"
          badgeIcon="search_off"
          title="Ainda não conhecemos este produto"
          description="Este código não está na base aberta da Open Food Facts. Você pode cadastrá-lo e ajudar outras pessoas."
        />

        <CrowdsourcingUploadCard onSendPhotos={() => window.open(addUrl, '_blank', 'noopener')} />

        <div className="flex flex-col gap-space-sm">
          <ActionListItem tone="card" icon="barcode_scanner" title="Escanear novamente" description="Confira se o código ficou nítido" onClick={() => navigate('/scanner')} />
          <ActionListItem tone="card" icon="search" title="Buscar pelo nome" description="Encontre o produto pela busca" onClick={() => navigate('/')} />
        </div>

        {POPULAR_ITEMS.length > 0 && (
          <RelatedProductsGrid eyebrow="Enquanto isso" title="Produtos populares" items={POPULAR_ITEMS} seeAllHref="/" seeAllLabel="Ver mais" />
        )}
      </div>
    </PageTemplate>
  )
}
