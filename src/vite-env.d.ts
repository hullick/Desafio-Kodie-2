/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endereço da API da Open Food Facts. Obrigatória (o vite.config.ts recusa iniciar sem ela). */
  readonly VITE_OFF_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
