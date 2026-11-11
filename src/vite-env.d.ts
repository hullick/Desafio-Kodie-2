/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endereço da API da Open Food Facts. Obrigatória (o vite.config.ts recusa iniciar sem ela). */
  readonly VITE_OFF_BASE_URL: string
  /** Link de suporte (abertura de issues no GitHub). Opcional: sem ele, o link "Suporte" do rodapé aponta para "#". */
  readonly VITE_SUPPORT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
