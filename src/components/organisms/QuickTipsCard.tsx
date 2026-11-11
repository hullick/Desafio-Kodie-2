import { Icon } from '../atoms/Icon'

export type QuickTipsCardProps = {
  title?: string
  tips: Array<{ icon: string; text: string }>
}

/** Lista curta de dicas práticas com ícone (ex.: como recuperar o sinal no mercado). */
export function QuickTipsCard({ title = 'Dicas práticas rápidas', tips }: QuickTipsCardProps) {
  if (tips.length === 0) return null
  return (
    <section className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
      <h2 className="flex items-center gap-space-xs text-label-lg font-bold text-on-surface">
        <Icon name="tips_and_updates" size={20} className="text-primary" /> {title}
      </h2>
      <ul className="flex flex-col gap-space-xs">
        {tips.map((t) => (
          <li key={t.text} className="flex items-start gap-space-sm rounded-xl bg-surface-container-low p-3">
            <Icon name={t.icon} size={20} className="mt-0.5 shrink-0 text-secondary" />
            <p className="text-body-sm text-on-surface-variant">{t.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
