import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/** Variáveis obrigatórias em todo ambiente (ver .env.example). */
const REQUIRED_ENV = ['VITE_OFF_BASE_URL'] as const

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Falha no início do dev/build se faltar variável, em vez de o app quebrar (ou ir para o
  // endereço errado) só quando fizer a primeira requisição.
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const missing = REQUIRED_ENV.filter((key) => !env[key]?.trim())
  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente ausentes no modo "${mode}": ${missing.join(', ')}. ` +
        `Crie .env.${mode} a partir de .env.example (ou defina-as no ambiente de deploy).`,
    )
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
