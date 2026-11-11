/** Espera `ms`, interrompendo se o sinal for abortado. */
export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/**
 * Janela deslizante: no máximo `max` chamadas a cada `windowMs`.
 * Chamadas além do limite esperam a vez (em ordem), em vez de serem enviadas e tomarem 503.
 */
export class RateLimiter {
  private readonly max: number
  private readonly windowMs: number
  private readonly stamps: number[] = []
  private queue: Promise<void> = Promise.resolve()

  constructor(max: number, windowMs: number) {
    this.max = max
    this.windowMs = windowMs
  }

  acquire(signal?: AbortSignal): Promise<void> {
    const turn = this.queue.then(async () => {
      for (;;) {
        const now = Date.now()
        while (this.stamps.length && now - this.stamps[0] >= this.windowMs) this.stamps.shift()
        if (this.stamps.length < this.max) {
          this.stamps.push(now)
          return
        }
        await sleep(this.windowMs - (now - this.stamps[0]) + 50, signal)
      }
    })
    // Um abort não pode travar a fila para as próximas chamadas.
    this.queue = turn.catch(() => {})
    return turn
  }
}
