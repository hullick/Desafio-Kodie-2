import { useNavigate } from 'react-router'
import { TechIdSnippet } from '../components/molecules/TechIdSnippet'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ServiceMonitorCard } from '../components/organisms/ServiceMonitorCard'
import { PageTemplate } from '../components/templates/PageTemplate'
import { useErrorRouteState } from '../hooks/useApiErrorRedirect'

export type ServerErrorProps = {
  /** Código para o usuário informar ao suporte. */
  requestId?: string
}

/** Erro 500 / Open Food Facts indisponível (ex.: limite de requisições atingido). */
export function ServerError({ requestId }: ServerErrorProps) {
  const navigate = useNavigate()
  const { from, status, kind } = useErrorRouteState()
  // Bloqueio: o navegador não expõe o status, então o código técnico diz o motivo.
  const blocked = kind === 'blocked'
  const techId = requestId ?? (blocked ? '#SB-LIMITE' : `#SB-${status ?? 500}`)
  return (
    <PageTemplate mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ErrorHeroBlock
          icon="cloud_off"
          badgeIcon="warning"
          status={{ label: blocked ? 'Limite de consultas' : 'Instabilidade temporária', tone: 'warning', pulse: true }}
          title={blocked ? 'A base de alimentos pediu uma pausa' : 'Não conseguimos falar com a base de alimentos'}
          description={
            blocked
              ? 'A Open Food Facts limitou o acesso por excesso de consultas em pouco tempo. Aguarde alguns minutos e tente de novo.'
              : 'A Open Food Facts não respondeu agora. Isso costuma passar em poucos minutos.'
          }
          primaryAction={{ label: 'Tentar novamente', icon: 'refresh', onClick: () => navigate(from, { replace: true }) }}
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
        <TechIdSnippet id={techId} />
      </div>
    </PageTemplate>
  )
}
