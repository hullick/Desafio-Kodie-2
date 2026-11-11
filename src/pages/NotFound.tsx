import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { PageTemplate } from '../components/templates/PageTemplate'

/** Rota inexistente. */
export function NotFound() {
  return (
    <PageTemplate>
      <div className="px-margin py-space-2xl lg:px-0">
        <ErrorHeroBlock
          icon="explore_off"
          title="Página não encontrada"
          description="O endereço acessado não existe ou foi alterado."
          primaryAction={{ label: 'Voltar ao início', icon: 'home', href: '/' }}
          secondaryAction={{ label: 'Escanear um produto', icon: 'barcode_scanner', href: '/scanner' }}
        />
      </div>
    </PageTemplate>
  )
}
