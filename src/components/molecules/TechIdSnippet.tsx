import { useState } from 'react'
import { Icon } from '../atoms/Icon'

export type TechIdSnippetProps = {
  /** Código da requisição (ex.: "#NS-98421"). */
  id: string
  label?: string
}

/** Código de referência da requisição com botão de copiar em um clique. */
export function TechIdSnippet({ id, label = 'Código de referência:' }: TechIdSnippetProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center gap-1 text-body-sm text-outline">
      <span>{label}</span>
      <code className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[11px] font-semibold text-on-surface">Req-ID: {id}</code>
      <button type="button" onClick={copy} aria-label={copied ? 'Código copiado' : 'Copiar código'} className="flex items-center rounded p-1 text-outline transition-colors hover:text-primary">
        <Icon name={copied ? 'check' : 'content_copy'} size={14} />
      </button>
      <span className="sr-only" role="status">
        {copied ? 'Código copiado' : ''}
      </span>
    </div>
  )
}
