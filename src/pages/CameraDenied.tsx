import { useLocation, useNavigate } from 'react-router'
import { TipCard } from '../components/molecules/TipCard'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ManualEntryCard } from '../components/organisms/ManualEntryCard'
import { PermissionGuideCard } from '../components/organisms/PermissionGuideCard'
import { PageTemplate } from '../components/templates/PageTemplate'
import { SCANNED_STATE } from '../hooks/useRecentScans'
import type { CameraFailure } from '../lib/cameraPermission'

const COPY: Record<CameraFailure, { icon: string; status: string; title: string; description: string }> = {
  denied: {
    icon: 'no_photography',
    status: 'Acesso à câmera bloqueado',
    title: 'Precisamos da sua câmera',
    description: 'Para ler o código de barras, o navegador precisa de permissão para usar a câmera. Nada é gravado ou enviado.',
  },
  unavailable: {
    icon: 'videocam_off',
    status: 'Câmera indisponível',
    title: 'Não conseguimos abrir a câmera',
    description: 'O aparelho pode não ter câmera, ou ela está em uso por outro app. Feche os outros apps que usam a câmera e tente de novo.',
  },
  insecure: {
    icon: 'lock_open',
    status: 'Conexão sem HTTPS',
    title: 'A câmera precisa de conexão segura',
    description: 'O navegador só libera a câmera em páginas abertas por https://. Abra o ScanBite pelo endereço seguro, ou digite o código abaixo.',
  },
}

/** Câmera bloqueada ou indisponível: explica o motivo e oferece a digitação do código. */
export function CameraDenied() {
  const navigate = useNavigate()
  const { state } = useLocation()
  // Sem motivo (link direto para a tela): trata como bloqueio, o caso mais comum.
  const reason: CameraFailure = (state as { reason?: CameraFailure } | null)?.reason ?? 'denied'
  const copy = COPY[reason] ?? COPY.denied
  const retry = () => navigate('/scanner')

  return (
    <PageTemplate activeNav="scan" mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ErrorHeroBlock
          icon={copy.icon}
          badgeIcon={reason === 'denied' ? 'lock' : 'warning'}
          status={{ label: copy.status, tone: 'error' }}
          title={copy.title}
          description={copy.description}
          primaryAction={reason === 'unavailable' ? { label: 'Tentar novamente', icon: 'replay', onClick: retry } : undefined}
        />
        {reason === 'denied' && (
          <PermissionGuideCard
            title="Como habilitar em 3 passos"
            subtitle="Procedimento rápido e sem complicações"
            steps={[
              { title: 'Abra os ajustes do navegador', description: 'Toque no cadeado ao lado do endereço do site ou nas configurações do aparelho.' },
              { title: 'Ative o acesso à câmera', description: 'Em "Permissões", marque a câmera como permitida durante o uso.' },
              { title: 'Volte ao ScanBite', description: 'Toque em "Tentar novamente" para reabrir o leitor.' },
            ]}
            onRetry={retry}
          />
        )}
        <ManualEntryCard
          title="Alternativa sem câmera"
          description="Digite os números impressos abaixo das barras."
          onSubmit={(code) => navigate(`/produto/${code}`, { state: SCANNED_STATE })}
        />
        <TipCard title="Sua privacidade é respeitada" icon="shield">
          A câmera é usada só para ler o código. Nenhuma imagem sai do seu aparelho.
        </TipCard>
      </div>
    </PageTemplate>
  )
}
