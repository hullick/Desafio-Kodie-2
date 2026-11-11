export type StatHighlightProps = {
  label: string
  value: string
  /** Indicador ao lado (ex.: "85% Nutri-Score A ou B"). */
  indicator?: string
}

/** Destaque numérico com indicador pulsante (ex.: "Acervo pessoal · 12 produtos"). */
export function StatHighlight({ label, value, indicator }: StatHighlightProps) {
  return (
    <div className="flex items-center gap-space-md rounded-2xl bg-surface-container-lowest px-space-lg py-space-sm shadow-sm">
      <div className="flex flex-col">
        <span className="text-label-sm tracking-wider text-outline uppercase">{label}</span>
        <span className="text-headline-sm font-bold text-on-surface">{value}</span>
      </div>
      {indicator && (
        <>
          <span className="h-8 w-px bg-surface-container" aria-hidden />
          <span className="flex items-center gap-space-xs text-label-md font-bold text-primary">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" aria-hidden />
            {indicator}
          </span>
        </>
      )}
    </div>
  )
}
