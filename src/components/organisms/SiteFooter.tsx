import { SUPPORT_HREF, SUPPORT_URL } from '../../config/links'
import { Logo } from '../atoms/Logo'

type FooterLink = { label: string; href: string; external?: boolean }

const LINKS: FooterLink[] = [
  { label: 'Sobre a Metodologia', href: '/sobre' },
  { label: 'Privacidade', href: '/privacidade' },
  // Suporte = abrir uma issue no GitHub (VITE_SUPPORT_URL); sem a variável, aponta para "#".
  { label: 'Suporte', href: SUPPORT_HREF, external: SUPPORT_URL !== null },
]

/** Rodapé institucional (desktop). */
export function SiteFooter() {
  return (
    <footer className="mt-space-2xl w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-[1200px] px-margin-lg py-space-xl">
        <div className="flex flex-col items-center justify-between gap-space-lg md:flex-row">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="ml-1 hidden text-body-sm text-outline sm:inline-block">
              — Transparência nutricional e escolhas conscientes
            </span>
          </div>
          <nav aria-label="Institucional" className="flex items-center gap-space-lg text-label-md text-on-surface-variant">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-space-lg flex flex-col items-center justify-between pt-space-md text-body-sm text-outline sm:flex-row">
          <p>Dados da Open Food Facts, alinhados aos padrões NOVA e Nutri-Score.</p>
          <p className="mt-2 sm:mt-0">Alimentação saudável simplificada.</p>
        </div>
      </div>
    </footer>
  )
}
