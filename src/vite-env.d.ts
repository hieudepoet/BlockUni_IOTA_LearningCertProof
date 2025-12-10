/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IOTA_NETWORK: string;
    readonly VITE_PACKAGE_ID: string;
    readonly VITE_MODULE_NAME: string;
    readonly VITE_EXPLORER_URL: string;
    readonly VITE_NFT_BADGE_IMAGE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
