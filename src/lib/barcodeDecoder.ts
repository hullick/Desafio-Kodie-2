/**
 * Decodificador de códigos de produto (EAN-13, EAN-8, UPC-A, UPC-E) a partir de um quadro da câmera.
 *
 * - Leitor nativo do navegador (BarcodeDetector) quando ele lê EAN: Chrome no Android, macOS e ChromeOS.
 * - Senão, ZXing-C++ em WebAssembly (zxing-wasm), carregado só quando o scanner abre e servido pelo
 *   próprio app (sem CDN). Lê fotos reais (embalagem colorida em volta, leve desfoque e inclinação),
 *   que o ZXing em JavaScript do html5-qrcode não lia.
 */

export type DecodeFrame = (canvas: HTMLCanvasElement) => Promise<string | null>

/** Qual leitor está em uso (aparece no painel de diagnóstico). */
export type DecoderKind = 'native' | 'wasm'
export type BarcodeDecoder = { kind: DecoderKind; decode: DecodeFrame }

/** Tipos mínimos do BarcodeDetector (ainda fora do lib.dom do TypeScript). */
type NativeDetector = { detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>> }
type NativeDetectorCtor = {
  new (options: { formats: string[] }): NativeDetector
  getSupportedFormats: () => Promise<string[]>
}

const NATIVE_FORMATS = ['ean_13', 'ean_8', 'upc_a', 'upc_e']

async function nativeDecoder(): Promise<BarcodeDecoder | null> {
  const Ctor = (window as unknown as { BarcodeDetector?: NativeDetectorCtor }).BarcodeDetector
  if (!Ctor) return null
  try {
    const supported = await Ctor.getSupportedFormats()
    const formats = NATIVE_FORMATS.filter((f) => supported.includes(f))
    if (!formats.includes('ean_13')) return null
    const detector = new Ctor({ formats })
    return { kind: 'native', decode: async (canvas) => (await detector.detect(canvas))[0]?.rawValue ?? null }
  } catch {
    return null
  }
}

async function wasmDecoder(): Promise<BarcodeDecoder> {
  const [{ prepareZXingModule, readBarcodes }, { default: wasmUrl }] = await Promise.all([
    import('zxing-wasm/reader'),
    import('zxing-wasm/reader/zxing_reader.wasm?url'),
  ])
  await prepareZXingModule({
    overrides: { locateFile: (path: string, prefix: string) => (path.endsWith('.wasm') ? wasmUrl : prefix + path) },
    fireImmediately: true,
  })
  return {
    kind: 'wasm',
    decode: async (canvas) => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return null
      const results = await readBarcodes(ctx.getImageData(0, 0, canvas.width, canvas.height), {
        formats: ['EAN-13', 'EAN-8', 'UPC-A', 'UPC-E'],
        tryHarder: true,
        maxNumberOfSymbols: 1,
      })
      return results[0]?.text ?? null
    },
  }
}

let decoder: Promise<BarcodeDecoder> | null = null

/** Decodificador pronto (criado uma vez por sessão; o wasm é baixado na primeira vez). */
export function getBarcodeDecoder(): Promise<BarcodeDecoder> {
  decoder ??= nativeDecoder()
    .then((native) => native ?? wasmDecoder())
    .catch((error) => {
      decoder = null // falhou ao baixar (sem internet): tenta de novo na próxima vez
      throw error
    })
  return decoder
}
