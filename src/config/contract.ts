// IOTA Testnet Configuration
// Package deployed at: 2024-12-10

export const NETWORK = 'testnet';

// Package ID from deployment transaction
export const PACKAGE_ID = '0x48c65c6023dc037a8433617843c62645a9f52b40d63fe0e6afca65e4ffa5dda9';

// Module name in the package
export const MODULE_NAME = 'certificate';

// Struct types
export const TYPES = {
    LEARNING_PROGRESS: `${PACKAGE_ID}::${MODULE_NAME}::LearningProgress`,
    COURSE_CERTIFICATE: `${PACKAGE_ID}::${MODULE_NAME}::CourseCertificate`,
};

// IOTA Explorer URLs
export const EXPLORER_URL = 'https://explorer.rebased.iota.org';

export const getExplorerUrl = {
    transaction: (digest: string) => `${EXPLORER_URL}/txblock/${digest}?network=${NETWORK}`,
    object: (objectId: string) => `${EXPLORER_URL}/object/${objectId}?network=${NETWORK}`,
    address: (address: string) => `${EXPLORER_URL}/address/${address}?network=${NETWORK}`,
    package: () => `${EXPLORER_URL}/object/${PACKAGE_ID}?network=${NETWORK}`,
};

// NFT Badge image URL for on-chain metadata
export const NFT_BADGE_IMAGE_URL = 'https://iota-proof-of-learning.vercel.app/nft-badge.png';

// Deployment info
export const DEPLOYMENT = {
    transactionDigest: 'EsW9mK7cjw2YMijxSiNfvFZujkn4FFGgn1tKtA3TKakS',
    deployedAt: '2024-12-10T17:28:00+07:00',
};
