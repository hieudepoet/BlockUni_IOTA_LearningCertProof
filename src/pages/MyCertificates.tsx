import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentAccount } from '@iota/dapp-kit';
import { useLearning } from '../context/LearningContext';
import { courses } from '../data/courses';

export const MyCertificates: React.FC = () => {
    const { certificates } = useLearning();
    const account = useCurrentAccount();

    const explorerBaseUrl = 'https://explorer.rebased.iota.org';

    const getCourseInfo = (courseId: string) => {
        return courses.find(c => c.id === courseId);
    };

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
    };

    if (certificates.length === 0) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">🎓</div>
                        <h2 className="empty-state-title">No Certificates Yet</h2>
                        <p className="empty-state-description">
                            Complete courses to earn NFT certificates that prove your achievements on the blockchain.
                        </p>
                        <Link to="/" className="btn btn-primary">
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="section-header">
                    <h1>My Certificates</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Your earned NFT certificates, permanently stored on the IOTA blockchain.
                    {account && (
                        <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            Connected wallet: <code style={{ color: 'var(--primary-color)' }}>{formatAddress(account.address)}</code>
                        </span>
                    )}
                </p>

                <div className="certificates-grid">
                    {certificates.map((cert, index) => {
                        const course = getCourseInfo(cert.courseId);
                        const isOwner = cert.ownerAddress && account?.address &&
                            cert.ownerAddress.toLowerCase() === account.address.toLowerCase();

                        return (
                            <div
                                key={cert.id}
                                className={`glass-card certificate-card fade-in fade-in-delay-${(index % 4) + 1}`}
                            >
                                {/* NFT Badge Visual */}
                                <div className="certificate-card-badge" style={{ position: 'relative' }}>
                                    <img
                                        src="/nft-badge.png"
                                        alt="NFT Badge"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            borderRadius: '50%'
                                        }}
                                    />
                                </div>

                                <h3 style={{ marginBottom: '0.5rem' }}>{cert.courseName}</h3>

                                {/* Verification Badge */}
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    marginBottom: '1rem',
                                    background: isOwner ? 'rgba(16, 185, 129, 0.15)' : 'rgba(102, 126, 234, 0.15)',
                                    border: `1px solid ${isOwner ? 'var(--success-color)' : 'var(--primary-color)'}`,
                                    color: isOwner ? 'var(--success-color)' : 'var(--primary-color)'
                                }}>
                                    {isOwner ? '✓ Verified Owner' : '🔗 On-Chain NFT'}
                                </div>

                                <p style={{
                                    color: 'var(--text-muted)',
                                    fontSize: '0.85rem',
                                    marginBottom: '1rem'
                                }}>
                                    Issued: {cert.issuedAt.toLocaleDateString()}
                                </p>

                                {/* On-chain Data */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    textAlign: 'left'
                                }}>
                                    {cert.objectId && (
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>
                                                NFT Object ID
                                            </p>
                                            <a
                                                href={`${explorerBaseUrl}/object/${cert.objectId}?network=testnet`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.7rem',
                                                    color: 'var(--accent-color)',
                                                    wordBreak: 'break-all',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {formatAddress(cert.objectId)} ↗
                                            </a>
                                        </div>
                                    )}

                                    {cert.transactionDigest && (
                                        <div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.15rem' }}>
                                                Transaction
                                            </p>
                                            <a
                                                href={`${explorerBaseUrl}/txblock/${cert.transactionDigest}?network=testnet`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.7rem',
                                                    color: 'var(--primary-color)',
                                                    wordBreak: 'break-all',
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {formatAddress(cert.transactionDigest)} ↗
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                    {cert.transactionDigest && (
                                        <a
                                            href={`${explorerBaseUrl}/txblock/${cert.transactionDigest}?network=testnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                            style={{ width: '100%' }}
                                        >
                                            🔍 View on Explorer
                                        </a>
                                    )}

                                    {course && (
                                        <Link
                                            to={`/course/${course.id}`}
                                            className="btn btn-secondary btn-sm"
                                            style={{ width: '100%' }}
                                        >
                                            View Course
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
