/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_ADSENSE_CLIENT_ID?: string;
  readonly VITE_TRAVELPAYOUTS_MARKER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
