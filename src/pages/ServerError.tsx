import { useNavigate } from 'react-router'
import { TechIdSnippet } from '../components/molecules/TechIdSnippet'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ServiceMonitorCard } from '../components/organisms/ServiceMonitorCard'
import { PageTemplate } from '../components/templates/PageTemplate'

export type ServerErrorProps = {
  /** Código para o usuário informar ao suporte. */
  requestId?: string
}

/** Erro 500 / Open Food Facts indisponível (ex.: limite de requisições atingido). */
export function ServerError({ requestId = '#SB-500' }: ServerErrorProps) {
  const navigate = useNavigate()
  return (
    <PageTemplate mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ErrorHeroBlock
          icon="cloud_off"
          badgeIcon="warning"
          status={{ label: 'Instabilidade temporária', tone: 'warning', pulse: true }}
          title="Não conseguimos falar com a base de alimentos"
          description="A Open Food Facts não respondeu agora. Isso costuma passar em poucos minutos."
          primaryAction={{ label: 'Tentar novamente', icon: 'refresh', onClick: () => window.location.reload() }}
          secondaryAction={{ label: 'Ver meus favoritos', icon: 'favorite', href: '/favoritos' }}
        />
        <ServiceMonitorCard
          services={[
            { name: 'Base Open Food Facts', description: 'Consulta de produtos', state: 'offline' },
            { name: 'Busca por nome', description: 'Pesquisa de produtos', state: 'maintenance' },
            { name: 'Dados do aparelho', description: 'Favoritos e histórico', state: 'operational' },
          ]}
          tip="Seus favoritos e o histórico recente continuam disponíveis neste aparelho."
        />
        <TechIdSnippet id={requestId} />
      </div>
    </PageTemplate>
  )
}
