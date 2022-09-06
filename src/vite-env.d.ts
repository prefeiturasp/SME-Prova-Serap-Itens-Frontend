/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERAP_ITEM_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
