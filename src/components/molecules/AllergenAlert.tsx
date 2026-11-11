import { Icon } from '../atoms/Icon'

export type AllergenAlertProps = {
  /** Alérgenos declarados (ex.: ["Glúten", "Cevada"]). */
  contains: string[]
  /** Traços possíveis (ex.: ["Soja", "Trigo"]). */
  mayContain?: string[]
}

/** Alerta de alérgenos: "CONTÉM ..." e "PODE CONTER ...". */
export function AllergenAlert({ contains, mayContain = [] }: AllergenAlertProps) {
  if (contains.length === 0 && mayContain.length === 0) return null
  return (
    <div className="flex items-start gap-3 rounded-xl bg-warning-container/70 p-3.5" role="note">
      <Icon name="warning" size={24} className="mt-0.5 shrink-0 text-on-warning-container" />
      <div className="flex flex-col">
        <span className="text-label-md font-bold tracking-wide text-on-warning-container uppercase">Alerta de alergênicos</span>
        {contains.length > 0 && (
          <p className="mt-0.5 text-body-sm leading-snug font-semibold text-on-surface uppercase">Contém {contains.join(', ')}.</p>
        )}
        {mayContain.length > 0 && (
          <p className="mt-0.5 text-body-sm leading-snug text-on-surface-variant">Pode conter {mayContain.join(', ')}.</p>
        )}
      </div>
    </div>
  )
}
