import { useNavigate } from 'react-router'
import { TipCard } from '../components/molecules/TipCard'
import { ErrorHeroBlock } from '../components/organisms/ErrorHeroBlock'
import { ManualEntryCard } from '../components/organisms/ManualEntryCard'
import { PermissionGuideCard } from '../components/organisms/PermissionGuideCard'
import { PageTemplate } from '../components/templates/PageTemplate'

/** Câmera bloqueada: explica como liberar e oferece a digitação do código. */
export function CameraDenied() {
  const navigate = useNavigate()
  return (
    <PageTemplate activeNav="scan" mobile={{ mode: 'stack', title: 'Escanear', onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <ErrorHeroBlock
          icon="no_photography"
          badgeIcon="lock"
          status={{ label: 'Acesso à câmera bloqueado', tone: 'error' }}
          title="Precisamos da sua câmera"
          description="Para ler o código de barras, o navegador precisa de permissão para usar a câmera. Nada é gravado ou enviado."
        />
        <PermissionGuideCard
          title="Como habilitar em 3 passos"
          subtitle="Procedimento rápido e sem complicações"
          steps={[
            { title: 'Abra os ajustes do navegador', description: 'Toque no cadeado ao lado do endereço do site ou nas configurações do aparelho.' },
            { title: 'Ative o acesso à câmera', description: 'Em "Permissões", marque a câmera como permitida durante o uso.' },
            { title: 'Volte ao ScanBite', description: 'Toque em "Tentar novamente" para reabrir o leitor.' },
          ]}
          onRetry={() => navigate('/scanner')}
        />
        <ManualEntryCard
          title="Alternativa sem câmera"
          description="Digite os números impressos abaixo das barras."
          onSubmit={(code) => navigate(`/produto/${code}`)}
        />
        <TipCard title="Sua privacidade é respeitada" icon="shield">
          A câmera é usada só para ler o código. Nenhuma imagem sai do seu aparelho.
        </TipCard>
      </div>
    </PageTemplate>
  )
}
