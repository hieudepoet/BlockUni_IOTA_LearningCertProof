import React from 'react';

interface CertificateNFTDisplayProps {
    courseName: string;
    courseId: string;
    issuedAt: Date;
    certificateId: string;
    transactionDigest?: string;
    objectId?: string;
    ownerAddress?: string;
    connectedAddress?: string;
}

export const CertificateNFTDisplay: React.FC<CertificateNFTDisplayProps> = ({
    courseName,
    issuedAt,
    certificateId,
    transactionDigest,
    objectId,
    ownerAddress,
    connectedAddress
}) => {
    const explorerBaseUrl = 'https://explorer.rebased.iota.org';
    const isOwner = ownerAddress && connectedAddress &&
        ownerAddress.toLowerCase() === connectedAddress.toLowerCase();

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="nft-display-container">
            {/* NFT Visual Badge */}
            <div className="nft-badge-wrapper">
                <div className="nft-badge-glow"></div>
                <div className="nft-badge-card">
                    <img
                        src="/nft-badge.png"
                        alt="NFT Certificate Badge"
                        className="nft-badge-image"
                    />
                    <div className="nft-badge-overlay">
                        <span className="nft-badge-course">{courseName}</span>
                    </div>
                </div>
                <div className="nft-badge-shine"></div>
            </div>

            {/* Certificate Details */}
            <div className="nft-details">
                <h3 className="nft-title">🎓 Proof of Learning Certificate</h3>
                <p className="nft-subtitle">{courseName}</p>

                {/* Verification Status */}
                <div className={`nft-verification ${isOwner ? 'verified' : 'unverified'}`}>
                    {isOwner ? (
                        <>
                            <span className="verification-icon">✓</span>
                            <span>Verified Owner</span>
                        </>
                    ) : ownerAddress ? (
                        <>
                            <span className="verification-icon">⚠️</span>
                            <span>Not Connected Wallet Owner</span>
                        </>
                    ) : (
                        <>
                            <span className="verification-icon">🔗</span>
                            <span>On-Chain NFT</span>
                        </>
                    )}
                </div>

                {/* On-chain Data */}
                <div className="nft-chain-data">
                    {objectId && (
                        <div className="chain-data-item">
                            <span className="chain-data-label">NFT Object ID</span>
                            <a
                                href={`${explorerBaseUrl}/object/${objectId}?network=testnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chain-data-value chain-data-link"
                            >
                                {formatAddress(objectId)}
                                <span className="external-icon">↗</span>
                            </a>
                        </div>
                    )}

                    {transactionDigest && (
                        <div className="chain-data-item">
                            <span className="chain-data-label">Transaction</span>
                            <a
                                href={`${explorerBaseUrl}/txblock/${transactionDigest}?network=testnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chain-data-value chain-data-link"
                            >
                                {formatAddress(transactionDigest)}
                                <span className="external-icon">↗</span>
                            </a>
                        </div>
                    )}

                    {ownerAddress && (
                        <div className="chain-data-item">
                            <span className="chain-data-label">Owner Wallet</span>
                            <a
                                href={`${explorerBaseUrl}/address/${ownerAddress}?network=testnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chain-data-value chain-data-link"
                            >
                                {formatAddress(ownerAddress)}
                                <span className="external-icon">↗</span>
                            </a>
                        </div>
                    )}

                    <div className="chain-data-item">
                        <span className="chain-data-label">Issued At</span>
                        <span className="chain-data-value">{formatDate(issuedAt)}</span>
                    </div>

                    <div className="chain-data-item">
                        <span className="chain-data-label">Certificate ID</span>
                        <span className="chain-data-value mono">{formatAddress(certificateId)}</span>
                    </div>

                    <div className="chain-data-item">
                        <span className="chain-data-label">Network</span>
                        <span className="chain-data-value">
                            <span className="network-badge">IOTA Testnet</span>
                        </span>
                    </div>
                </div>

                {/* Explorer Links */}
                <div className="nft-explorer-links">
                    {transactionDigest && (
                        <a
                            href={`${explorerBaseUrl}/txblock/${transactionDigest}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            🔍 View on IOTA Explorer
                        </a>
                    )}
                    {objectId && (
                        <a
                            href={`${explorerBaseUrl}/object/${objectId}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            🖼️ View NFT Object
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
