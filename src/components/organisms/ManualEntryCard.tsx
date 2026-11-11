import { useState, type FormEvent } from 'react'
import { isValidBarcode, normalizeBarcode } from '../../lib/barcode'
import { Button } from '../atoms/Button'
import { Chip } from '../atoms/Chip'
import { Icon } from '../atoms/Icon'
import { BarcodeInput } from '../molecules/BarcodeInput'

export type ManualEntryCardProps = {
  /** Recebe o código já validado e sem espaços. */
  onSubmit: (barcode: string) => void
  /** Código de exemplo para teste rápido. */
  sample?: { code: string; label: string }
  title?: string
  description?: string
}

/** Busca alternativa por digitação do código de barras (para código danificado ou câmera indisponível). */
export function ManualEntryCard({
  onSubmit,
  sample,
  title = 'O código está danificado ou ilegível?',
  description = 'Digite a sequência numérica impressa abaixo das barras.',
}: ManualEntryCardProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidBarcode(value)) {
      setError('Código inválido: use de 8 a 14 números.')
      return
    }
    setError(undefined)
    onSubmit(normalizeBarcode(value))
  }

  return (
    <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-xl">
      <div>
        <span className="mb-1 flex items-center gap-space-xs text-label-sm tracking-wide text-primary uppercase">
          <Icon name="keyboard" size={20} /> Busca alternativa
        </span>
        <h2 className="text-headline-sm font-semibold text-on-surface">{title}</h2>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="mt-space-xs flex flex-col gap-space-xs">
        <BarcodeInput
          value={value}
          onChange={(v) => {
            setValue(v)
            if (error) setError(undefined)
          }}
          error={error}
        />
        <Button type="submit" size="lg" trailingIcon="arrow_forward" fullWidth className="mt-1 h-[50px] shadow-md">
          Buscar produto
        </Button>
      </form>
      {sample && (
        <div className="flex items-center justify-between gap-2 pt-space-xs">
          <span className="text-body-sm text-on-surface-variant">Teste rápido:</span>
          <Chip size="sm" selected leading={<Icon name="touch_app" size={16} />} onClick={() => setValue(sample.code)}>
            {sample.code} ({sample.label})
          </Chip>
        </div>
      )}
    </section>
  )
}
