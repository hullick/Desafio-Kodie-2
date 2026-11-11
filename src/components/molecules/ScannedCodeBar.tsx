import { Icon } from '../atoms/Icon'
import { StatusPill, type StatusTone } from '../atoms/StatusPill'

export type ScannedCodeBarProps = {
  barcode: string
  status: string
  tone?: StatusTone
}

/** Faixa com o código lido e o seu status (ex.: "EAN 789... · Não indexado"). */
export function ScannedCodeBar({ barcode, status, tone = 'error' }: ScannedCodeBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-full bg-surface-container-low px-space-md py-space-sm shadow-sm">
      <span className="flex min-w-0 items-center gap-space-xs">
        <Icon name="barcode_scanner" size={18} filled className="text-outline" />
        <span className="truncate text-label-md text-on-surface">EAN: {barcode}</span>
      </span>
      <StatusPill tone={tone} shape="pill" dot pulse uppercase className="shrink-0">
        {status}
      </StatusPill>
    </div>
  )
}
