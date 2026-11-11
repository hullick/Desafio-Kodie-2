import type { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'
import { StatusPill } from '../atoms/StatusPill'
import { RankingPodium, type PodiumEntry } from '../molecules/RankingPodium'
import { TipCard } from '../molecules/TipCard'

export type VerdictInsight = { icon: string; title: string; text: string }

export type NutritionalVerdictCardProps = {
  /** Parecer em texto (pode conter <strong>). */
  summary: ReactNode
  podium: PodiumEntry[]
  insights?: VerdictInsight[]
  /** Selos do vencedor (ex.: "Amiga do coração", "Zero aditivos"). */
  tags?: Array<{ icon: string; label: string }>
  methodology?: string
}

/** Veredito da comparação: parecer, pódio, pontos de análise e selos do vencedor. */
export function NutritionalVerdictCard({ summary, podium, insights = [], tags = [], methodology }: NutritionalVerdictCardProps) {
  return (
    <section className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-secondary-container/30 p-4 shadow-sm lg:bg-none lg:bg-surface-container-low lg:p-space-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-space-xl">
        <div className="flex items-center gap-2 lg:flex-col">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm lg:h-16 lg:w-16 lg:rounded-2xl">
            <Icon name="psychology_alt" className="text-[18px] lg:text-[34px]" />
          </span>
          <div className="flex flex-col lg:hidden">
            <span className="text-label-lg font-extrabold text-on-surface">Veredito do ScanBite</span>
            <span className="text-[11px] font-semibold text-secondary">Análise de composição &amp; processamento</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-space-sm">
          <h2 className="hidden text-headline-lg font-extrabold tracking-tight text-on-surface lg:block">
            Veredito do ScanBite: composição &amp; processamento
          </h2>
          <p className="text-body-md leading-relaxed text-on-surface">{summary}</p>
          <RankingPodium entries={podium} />
          {insights.length > 0 && (
            <div className="hidden grid-cols-3 gap-space-md pt-2 lg:grid">
              {insights.map((i) => (
                <TipCard key={i.title} variant="insight" icon={i.icon} title={i.title}>
                  {i.text}
                </TipCard>
              ))}
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t, idx) => (
                <StatusPill key={t.label} tone={idx < 2 ? 'success' : 'neutral'} shape="pill" icon={t.icon} className="px-2.5 py-1 font-bold">
                  {t.label}
                </StatusPill>
              ))}
            </div>
          )}
          {methodology && (
            <p className="flex items-center gap-2 pt-space-xs text-body-sm text-outline">
              <Icon name="verified_user" size={16} /> {methodology}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
