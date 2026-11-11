import type { ScannerDebug } from '../../hooks/useBarcodeScanner'

/** Diagnóstico da leitura (só com /scanner?debug): se começou, quantos quadros foram lidos e o que o leitor devolveu. */
export function ScannerDebugPanel({ debug, phase }: { debug: ScannerDebug; phase: string }) {
  const rows: Array<[string, string]> = [
    ['Etapa', phase],
    ['Câmera', debug.camera],
    ['Leitor', debug.decoder],
    ['Vídeo', debug.video],
    ['Quadro lido', debug.frame],
    ['Tentativas', `${debug.attempts} (${debug.hits} com código, ${debug.errors} com erro)`],
    ['Tempo por quadro', debug.attempts ? `${debug.lastMs} ms (média ${debug.avgMs} ms)` : '-'],
    ['Nitidez / contraste', debug.attempts ? `${debug.sharpness ?? 0} / ${debug.contrast ?? 0}` : '-'],
  ]
  return (
    <section aria-label="Diagnóstico do leitor" className="mt-space-sm rounded-xl bg-inverse-surface p-space-md font-mono text-label-sm text-inverse-on-surface">
      <dl className="grid grid-cols-[auto_1fr] gap-x-space-md gap-y-0.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-inverse-on-surface/60">{k}</dt>
            <dd className="break-words">{v}</dd>
          </div>
        ))}
      </dl>
      {debug.preview && (
        <figure className="mt-space-sm border-t border-inverse-on-surface/20 pt-space-sm">
          <img src={debug.preview} alt="Quadro que o leitor recebeu" className="w-full max-w-[360px] rounded-md" />
          <figcaption className="mt-1 text-inverse-on-surface/60">O que o leitor está recebendo (recorte do visor)</figcaption>
        </figure>
      )}
      <ol className="mt-space-sm flex flex-col gap-0.5 border-t border-inverse-on-surface/20 pt-space-sm">
        {debug.events.length === 0 ? <li className="text-inverse-on-surface/60">sem eventos ainda</li> : debug.events.map((e, i) => <li key={`${i}-${e}`}>{e}</li>)}
      </ol>
    </section>
  )
}
