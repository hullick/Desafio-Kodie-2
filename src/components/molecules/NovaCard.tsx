import { cn } from '../../lib/cn'
import { NOVA_DESCRIPTION, NOVA_LABEL, NOVA_TEXT } from '../../lib/nutritionStyles'
import type { NovaGroup } from '../../types/nutrition'
import { BadgeNova } from '../atoms/BadgeNova'
import { Icon } from '../atoms/Icon'

export type NovaCardProps = {
  group: NovaGroup
  /** Link para explicação da escala. */
  learnMoreHref?: string
}

/** Cartão "Classificação NOVA": bloco do grupo, nome e descrição. */
export function NovaCard({ group, learnMoreHref }: NovaCardProps) {
  const ultra = group === 4
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-space-sm rounded-2xl p-space-md shadow-sm',
        ultra ? 'bg-error-container/20' : 'bg-surface-container-lowest',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-label-md tracking-wide text-on-surface-variant uppercase">Classificação NOVA</span>
        <Icon name="biotech" size={18} className="text-outline" />
      </div>
      <div className="flex items-center gap-space-md py-space-xs">
        <BadgeNova group={group} variant="block" />
        <div className="flex flex-col">
          <span className={cn('text-label-lg font-bold', NOVA_TEXT[group])}>{NOVA_LABEL[group]}</span>
          <span className="text-body-sm text-on-surface-variant">Grupo {group} de 4</span>
        </div>
      </div>
      <p className={cn('rounded-lg p-2 text-body-sm leading-tight', ultra ? 'bg-error-container/30 text-on-error-container' : 'bg-surface-container-low text-on-surface-variant')}>
        {NOVA_DESCRIPTION[group]}
      </p>
      {(ultra || learnMoreHref) && (
        <div className="flex items-center justify-between text-label-sm text-error">
          {ultra && (
            <span className="flex items-center gap-1">
              <Icon name="warning" size={16} /> Consumo frequente desaconselhado pelo Guia Alimentar
            </span>
          )}
          {learnMoreHref && (
            <a href={learnMoreHref} className="font-semibold underline hover:opacity-80">
              Entenda a escala
            </a>
          )}
        </div>
      )}
    </div>
  )
}
