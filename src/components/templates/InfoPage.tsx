import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Icon } from '../atoms/Icon'
import { PageHeading } from '../molecules/PageHeading'
import { PageTemplate } from './PageTemplate'

export type InfoSection = { id: string; title: string; icon: string; body: ReactNode }

export type InfoPageProps = {
  title: string
  subtitle: string
  description?: string
  sections: InfoSection[]
  /** Conteúdo depois das seções (ex.: contato, data de atualização). */
  footer?: ReactNode
}

/** Página institucional de leitura (metodologia, privacidade): título, seções em cartões e rodapé de texto. */
export function InfoPage({ title, subtitle, description, sections, footer }: InfoPageProps) {
  const navigate = useNavigate()
  return (
    <PageTemplate mobile={{ mode: 'stack', title, onBack: () => navigate('/') }}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-space-lg px-margin py-space-md lg:px-0 lg:py-space-xl">
        <PageHeading title={title} subtitle={subtitle} description={description} breadcrumbs={[{ label: 'Início', href: '/' }, { label: title }]} />
        {sections.map((s) => (
          <section key={s.id} aria-labelledby={`${s.id}-title`} className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-sm lg:p-space-lg">
            <h2 id={`${s.id}-title`} className="flex items-center gap-space-xs text-headline-sm font-bold text-on-surface">
              <Icon name={s.icon} size={22} className="text-primary" /> {s.title}
            </h2>
            {s.body}
          </section>
        ))}
        {footer && <div className="flex flex-col gap-space-xs px-space-xs text-body-sm text-outline">{footer}</div>}
      </div>
    </PageTemplate>
  )
}
