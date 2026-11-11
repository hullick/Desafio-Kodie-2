import { Icon } from '../atoms/Icon'

export type CrowdsourcingUploadCardProps = {
  onSendPhotos: () => void
  /** Pontos de incentivo (ex.: 50). Sem valor, o selo não aparece. */
  points?: number
  title?: string
  description?: string
}

const SHOTS = [
  { icon: 'photo_camera_front', label: 'Frente da embalagem' },
  { icon: 'table_chart', label: 'Tabela de nutrientes' },
]

/** Card colaborativo: incentiva fotografar frente e tabela do rótulo para completar a base. */
export function CrowdsourcingUploadCard({
  onSendPhotos,
  points,
  title = 'Fotografar rótulo e tabela',
  description = 'Envie fotos da frente e da tabela nutricional para a Open Food Facts. A comunidade completa os dados e o Nutri-Score passa a aparecer para todos.',
}: CrowdsourcingUploadCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-secondary p-space-lg text-on-primary shadow-lg">
      <span className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-primary-fixed/15 blur-xl" aria-hidden />
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest/20 px-3 py-1 text-primary-fixed backdrop-blur-md">
          <Icon name="stars" size={16} filled />
          <span className="text-label-sm tracking-wide uppercase">Missão colaborativa</span>
        </span>
        {points !== undefined && (
          <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-label-md font-bold text-on-primary-fixed shadow-sm">+{points} pts</span>
        )}
      </div>
      <h2 className="mt-space-md text-headline-md font-bold text-on-primary">{title}</h2>
      <p className="mt-space-xs text-body-md leading-relaxed text-on-primary/90">{description}</p>
      <ul className="mt-space-md grid grid-cols-2 gap-space-sm">
        {SHOTS.map((s) => (
          <li key={s.label} className="flex items-center gap-space-xs rounded-xl bg-surface-container-lowest/15 p-space-sm backdrop-blur-sm">
            <Icon name={s.icon} size={20} className="text-primary-fixed" />
            <span className="text-label-sm leading-tight text-on-primary">{s.label}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onSendPhotos}
        className="mt-space-lg flex h-14 w-full items-center justify-center gap-space-xs rounded-2xl bg-surface-container-lowest text-label-lg font-bold text-primary shadow-md transition-all duration-200 hover:bg-surface-container-low active:scale-[0.98]"
      >
        <Icon name="add_a_photo" filled /> Enviar fotos do rótulo
      </button>
    </section>
  )
}
