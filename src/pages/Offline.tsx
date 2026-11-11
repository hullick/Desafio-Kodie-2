import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { OfflineCachePanel } from '../components/organisms/OfflineCachePanel'
import { QuickTipsCard } from '../components/organisms/QuickTipsCard'
import { PageTemplate } from '../components/templates/PageTemplate'
import { RECENT_SCANS } from './shared.mock'

/** Sem internet: mostra dicas e os produtos consultados que ficaram guardados no aparelho. */
export function Offline() {
  const navigate = useNavigate()
  const [retrying, setRetrying] = useState(false)

  const retry = () => {
    setRetrying(true)
    if (navigator.onLine) window.location.reload()
    else window.setTimeout(() => setRetrying(false), 1500)
  }

  return (
    <PageTemplate mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ErrorHeroBlock
          icon="wifi_off"
          badgeIcon="cloud_off"
          status={{ label: 'Modo offline', tone: 'neutral' }}
          title="Você está sem conexão"
          description="Verifique o Wi-Fi ou os dados móveis. Enquanto isso, os produtos que você já consultou continuam aqui."
          primaryAction={{ label: retrying ? 'Tentando reconectar...' : 'Tentar novamente', icon: 'refresh', loading: retrying, onClick: retry }}
        />
        <QuickTipsCard
          tips={[
            { icon: 'signal_cellular_alt', text: 'Em supermercados o sinal costuma ser fraco: perto da entrada ou dos caixas ele melhora.' },
            { icon: 'wifi', text: 'Muitos mercados oferecem Wi-Fi gratuito para clientes.' },
            { icon: 'favorite', text: 'Salve produtos nos favoritos para consultá-los sem internet.' },
          ]}
        />
        <OfflineCachePanel items={RECENT_SCANS} />
      </div>
    </PageTemplate>
  )
}
