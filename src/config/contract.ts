// IOTA Contract Configuration
// Uses environment variables from .env file

// Network
export const NETWORK = import.meta.env.VITE_IOTA_NETWORK || 'testnet';

// Package ID from deployment
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID || '';

// Module name in the package
export const MODULE_NAME = import.meta.env.VITE_MODULE_NAME || 'certificate';

// Validate Package ID
if (!PACKAGE_ID) {
    console.warn('⚠️ VITE_PACKAGE_ID is not set in .env file. Blockchain features will not work.');
}

// Struct types
export const TYPES = {
    LEARNING_PROGRESS: `${PACKAGE_ID}::${MODULE_NAME}::LearningProgress`,
    COURSE_CERTIFICATE: `${PACKAGE_ID}::${MODULE_NAME}::CourseCertificate`,
};

// IOTA Explorer URLs
export const EXPLORER_URL = import.meta.env.VITE_EXPLORER_URL || 'https://explorer.rebased.iota.org';

export const getExplorerUrl = {
    transaction: (digest: string) => `${EXPLORER_URL}/txblock/${digest}?network=${NETWORK}`,
    object: (objectId: string) => `${EXPLORER_URL}/object/${objectId}?network=${NETWORK}`,
    address: (address: string) => `${EXPLORER_URL}/address/${address}?network=${NETWORK}`,
    package: () => `${EXPLORER_URL}/object/${PACKAGE_ID}?network=${NETWORK}`,
};

// NFT Badge image URL for on-chain metadata
export const NFT_BADGE_IMAGE_URL = import.meta.env.VITE_NFT_BADGE_IMAGE_URL || '/nft-badge.png';

// Check if blockchain is properly configured
export const isBlockchainConfigured = (): boolean => {
    return Boolean(PACKAGE_ID && PACKAGE_ID !== '0x_YOUR_PACKAGE_ID_HERE');
};

// Deployment info (for reference)
export const DEPLOYMENT = {
    transactionDigest: 'EsW9mK7cjw2YMijxSiNfvFZujkn4FFGgn1tKtA3TKakS',
    deployedAt: '2024-12-10T17:28:00+07:00',
    network: NETWORK,
};
