import type { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'
import { StatusPill } from '../atoms/StatusPill'
import { DistributionBar, type DistributionSegment } from '../molecules/DistributionBar'

export type PantryDiagnosisCardProps = {
  /** Parecer em texto (pode conter <strong>). */
  summary: ReactNode
  distribution: DistributionSegment[]
  /** Nota geral (ex.: "8,8 / 10"). */
  score?: string
  /** Rótulo da distribuição (ex.: "Excelente"). */
  verdict?: string
  /** Destaque sobre processamento (ex.: "Apenas 1 item processado ou superior"). */
  processingNote?: string
  onSeeAnalysis?: () => void
  onClearList?: () => void
}

/** Diagnóstico da despensa: parecer, distribuição de Nutri-Score e ações da lista. */
export function PantryDiagnosisCard({ summary, distribution, score, verdict, processingNote, onSeeAnalysis, onClearList }: PantryDiagnosisCardProps) {
  return (
    <section className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-label-sm font-bold tracking-wider text-primary uppercase">Diagnóstico nutricional</span>
          <h2 className="flex items-center gap-space-xs text-headline-sm font-bold text-on-surface">
            <Icon name="health_and_safety" size={22} className="hidden text-primary lg:inline" />
            Sua despensa saudável
          </h2>
        </div>
        {score ? (
          <StatusPill tone="success" shape="pill" className="px-2.5 py-1 font-bold">
            {score}
          </StatusPill>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-primary">
            <Icon name="local_florist" />
          </span>
        )}
      </div>
      <p className="text-body-md leading-relaxed text-on-surface-variant">{summary}</p>
      <DistributionBar title="Distribuição Nutri-Score" segments={distribution} summary={verdict} />
      {processingNote && (
        <div className="flex items-center gap-space-md rounded-xl bg-surface-container-low p-space-md">
          <Icon name="eco" className="text-primary" />
          <div className="flex flex-col">
            <span className="text-label-md font-bold text-on-surface">Grau in natura / limpo</span>
            <span className="text-body-sm text-outline">{processingNote}</span>
          </div>
        </div>
      )}
      {(onSeeAnalysis || onClearList) && (
        <div className="flex items-center justify-between pt-2">
          {onSeeAnalysis && (
            <button type="button" onClick={onSeeAnalysis} className="flex items-center gap-1 text-label-md text-primary hover:underline">
              Ver análise completa <Icon name="arrow_forward" size={16} />
            </button>
          )}
          {onClearList && (
            <button type="button" onClick={onClearList} className="text-label-sm text-on-surface-variant transition-colors hover:text-error">
              Limpar lista
            </button>
          )}
        </div>
      )}
    </section>
  )
}
