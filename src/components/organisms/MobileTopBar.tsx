import type { ReactNode } from 'react'
import { Avatar } from '../atoms/Avatar'
import { Button } from '../atoms/Button'
import { Logo } from '../atoms/Logo'

export type MobileTopBarProps = {
  /** Com `onBack`, vira cabeçalho de pilha: botão voltar + título. */
  onBack?: () => void
  title?: string
  /** Ações extras à direita (substituem notificações e perfil). */
  actions?: ReactNode
  avatarUrl?: string
}

/** Cabeçalho mobile: logo (abas) ou voltar + título (pilha), com sininho e perfil. */
export function MobileTopBar({ onBack, title, actions, avatarUrl }: MobileTopBarProps) {
  return (
    <header className="pt-safe fixed inset-x-0 top-0 z-50 bg-surface/85 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-2 px-gutter">
        {onBack ? (
          <div className="flex min-w-0 items-center gap-1">
            <Button variant="ghost" size="lg" icon="arrow_back" iconOnly aria-label="Voltar" onClick={onBack} className="-ml-2" />
            {title && <h1 className="truncate text-headline-sm text-on-surface">{title}</h1>}
          </div>
        ) : (
          <Logo size="sm" />
        )}
        <div className="flex items-center gap-1">
          {actions ?? (
            <>
              <Button variant="ghost" size="lg" icon="notifications" iconOnly aria-label="Notificações" />
              <a href="/perfil" aria-label="Perfil" className="flex h-11 w-11 items-center justify-center rounded-full">
                <Avatar src={avatarUrl} />
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
