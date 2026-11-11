import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Toast } from '../components/molecules/Toast'
import { BarcodeScannerViewport } from '../components/organisms/BarcodeScannerViewport'
import { ManualEntryCard } from '../components/organisms/ManualEntryCard'
import { RecentScansStrip } from '../components/organisms/RecentScansStrip'
import { PageTemplate } from '../components/templates/PageTemplate'
import { RECENT_SCANS } from './shared.mock'

/** Tempo para o toast de confirmação aparecer antes de abrir o produto. */
const OPEN_DELAY_MS = 800

/**
 * Leitura de código de barras. A câmera (html5-qrcode) ainda não está ligada:
 * o visor mostra só o fundo e a entrada manual leva ao produto.
 */
export function Scanner() {
  const navigate = useNavigate()
  const [torchOn, setTorchOn] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [recent, setRecent] = useState(RECENT_SCANS)
  const [found, setFound] = useState<string>()
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const open = (code: string) => {
    setFound(code)
    timer.current = window.setTimeout(() => navigate(`/produto/${code}`), OPEN_DELAY_MS)
  }

  return (
    <PageTemplate activeNav="scan">
      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-gutter-lg lg:py-space-xl">
        <div className="lg:col-span-7">
          <BarcodeScannerViewport
            onClose={() => navigate('/')}
            torchOn={torchOn}
            onToggleTorch={() => setTorchOn((t) => !t)}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-space-lg px-margin lg:col-span-5 lg:px-0">
          <ManualEntryCard onSubmit={open} sample={{ code: '7891000053508', label: 'Testar com Sucrilhos' }} />
          {recent.length > 0 && <RecentScansStrip items={recent} onClear={() => setRecent([])} />}
        </div>
      </div>
      <Toast visible={Boolean(found)} message={`Código ${found ?? ''} lido`} status="Abrindo..." />
    </PageTemplate>
  )
}
