import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@iota/dapp-kit';
import { courses, getModulesForCourse } from '../data/courses';
import { useLearning } from '../context/LearningContext';
import { CertificateNFTDisplay } from '../components/CertificateNFTDisplay';

export const CourseLearning: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const account = useCurrentAccount();
    const {
        startCourse,
        completeModule,
        getCourseProgress,
        isCourseCompleted,
        mintCertificate,
        certificates,
        isLoading,
        mintingStep
    } = useLearning();

    const [showCertificate, setShowCertificate] = useState(false);

    const course = courses.find(c => c.id === courseId);
    const modules = courseId ? getModulesForCourse(courseId) : [];
    const progress = courseId ? getCourseProgress(courseId) : undefined;
    const completed = courseId ? isCourseCompleted(courseId) : false;
    const existingCertificate = certificates.find(c => c.courseId === courseId);

    useEffect(() => {
        if (courseId && !progress) {
            startCourse(courseId);
        }
    }, [courseId, progress, startCourse]);

    useEffect(() => {
        if (completed && !existingCertificate) {
            setShowCertificate(true);
        }
    }, [completed, existingCertificate]);

    if (!course || !courseId) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h2 className="empty-state-title">Course Not Found</h2>
                        <p className="empty-state-description">
                            The course you're looking for doesn't exist.
                        </p>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleCompleteModule = (moduleIndex: number) => {
        if (!progress?.modulesCompleted[moduleIndex]) {
            completeModule(courseId, moduleIndex);
        }
    };

    const handleMintCertificate = async () => {
        if (!account) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            await mintCertificate(courseId, course.title, account.address);
        } catch (error) {
            console.error('Failed to mint certificate:', error);
        }
    };

    const completedModulesCount = progress?.modulesCompleted.filter(Boolean).length ?? 0;
    const progressPercent = (completedModulesCount / 4) * 100;

    return (
        <div className="page">
            <div className="container progress-container">
                <div className="progress-header">
                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-secondary"
                        style={{ marginBottom: '1rem' }}
                    >
                        ← Back to Courses
                    </button>
                    <h1>{course.title}</h1>
                    <p style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        {course.description}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                    <div className="progress-bar-label">
                        <span>Course Progress</span>
                        <span>{completedModulesCount}/4 Modules Completed</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Module Cards */}
                <div className="modules-grid">
                    {modules.map((module, index) => {
                        const isCompleted = progress?.modulesCompleted[index] ?? false;
                        const canComplete = !isCompleted && (index === 0 || progress?.modulesCompleted[index - 1]);

                        return (
                            <div
                                key={module.id}
                                className={`module-card fade-in fade-in-delay-${index + 1} ${isCompleted ? 'completed' : ''}`}
                            >
                                <div className="module-number">
                                    {isCompleted ? '✓' : module.id}
                                </div>
                                <div className="module-content">
                                    <h3 className="module-title">{module.title}</h3>
                                    <p className="module-status">
                                        {isCompleted ? 'Completed' : module.description}
                                    </p>
                                </div>
                                <div className="module-action">
                                    <button
                                        onClick={() => handleCompleteModule(index)}
                                        disabled={!canComplete || isCompleted}
                                        className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
                                    >
                                        {isCompleted ? 'Completed ✓' : `Complete Module ${module.id}`}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Certificate Section - Show existing certificate */}
                {existingCertificate && (
                    <div className="certificate-section fade-in">
                        <CertificateNFTDisplay
                            courseName={existingCertificate.courseName}
                            courseId={existingCertificate.courseId}
                            issuedAt={existingCertificate.issuedAt}
                            certificateId={existingCertificate.id}
                            transactionDigest={existingCertificate.transactionDigest}
                            objectId={existingCertificate.objectId}
                            ownerAddress={existingCertificate.ownerAddress}
                            connectedAddress={account?.address}
                        />
                    </div>
                )}

                {/* Minting Section - Show when completed but no certificate yet */}
                {showCertificate && !existingCertificate && (
                    <div className="certificate-section fade-in">
                        {isLoading ? (
                            <div className="minting-animation">
                                <div className="minting-spinner"></div>
                                <p className="minting-text">{mintingStep || 'Minting...'}</p>
                                <div className="minting-steps">
                                    <div className={`minting-step ${mintingStep.includes('Preparing') ? 'active' : mintingStep ? 'completed' : ''}`}>
                                        ✓ Preparing transaction
                                    </div>
                                    <div className={`minting-step ${mintingStep.includes('wallet') ? 'active' : mintingStep.includes('Broadcasting') || mintingStep.includes('Confirming') ? 'completed' : ''}`}>
                                        ✓ Wallet signature
                                    </div>
                                    <div className={`minting-step ${mintingStep.includes('Broadcasting') ? 'active' : mintingStep.includes('Confirming') ? 'completed' : ''}`}>
                                        ✓ Broadcasting to IOTA
                                    </div>
                                    <div className={`minting-step ${mintingStep.includes('Confirming') || mintingStep.includes('successfully') ? 'active' : ''}`}>
                                        ✓ Confirming transaction
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="certificate-badge">
                                    <span className="certificate-icon">🏆</span>
                                </div>
                                <h2 className="certificate-title">Course Completed! 🎉</h2>
                                <p className="certificate-message">
                                    Amazing work! You've completed all modules. Mint your certificate NFT to prove your achievement on the IOTA blockchain.
                                </p>

                                {!account ? (
                                    <p style={{ color: 'var(--warning-color)', marginBottom: '1rem' }}>
                                        ⚠️ Please connect your wallet to mint your certificate
                                    </p>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        Connected: {account.address.slice(0, 8)}...{account.address.slice(-6)}
                                    </p>
                                )}

                                <button
                                    onClick={handleMintCertificate}
                                    disabled={!account || isLoading}
                                    className="btn btn-success btn-lg"
                                >
                                    🎖️ Mint Certificate NFT
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
