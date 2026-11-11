/**
 * Link de suporte (abertura de issues no GitHub), vindo de VITE_SUPPORT_URL (ver .env.example).
 * Opcional: sem a variável (ou com um endereço que não seja http/https), vale null: o rodapé aponta
 * para "#" e os convites "Abra uma issue" das páginas institucionais não aparecem.
 */
function supportUrl(): string | null {
  const raw = import.meta.env.VITE_SUPPORT_URL?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

export const SUPPORT_URL = supportUrl()

/** Destino do link "Suporte" do rodapé: a URL configurada ou "#" enquanto ela não existir (o link aparece sempre). */
export const SUPPORT_HREF = SUPPORT_URL ?? '#'
