/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Sheet id backing the running log. */
  readonly VITE_RUNNING_LOG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
