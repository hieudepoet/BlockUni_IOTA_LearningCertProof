import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import { useProofOfLearning } from '../hooks/useProofOfLearning';
import type { MintResult } from '../hooks/useProofOfLearning';
import { NFT_BADGE_IMAGE_URL } from '../config/contract';

export interface LearningProgress {
    courseId: string;
    modulesCompleted: boolean[];
    startedAt: Date;
    completedAt?: Date;
    certificateId?: string;
    // On-chain data
    progressObjectId?: string;
}

export interface Certificate {
    id: string;
    courseId: string;
    courseName: string;
    issuedAt: Date;
    // Blockchain data
    transactionDigest?: string;
    objectId?: string;
    ownerAddress?: string;
}

interface LearningContextType {
    progress: Record<string, LearningProgress>;
    certificates: Certificate[];
    startCourse: (courseId: string) => Promise<void>;
    completeModule: (courseId: string, moduleIndex: number) => Promise<void>;
    isCourseCompleted: (courseId: string) => boolean;
    getCourseProgress: (courseId: string) => LearningProgress | undefined;
    mintCertificateNFT: (courseId: string, courseName: string) => Promise<Certificate | null>;
    isLoading: boolean;
    mintingStep: string;
    error: string | null;
    useBlockchain: boolean;
    setUseBlockchain: (use: boolean) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearning = (): LearningContextType => {
    const context = useContext(LearningContext);
    if (!context) {
        throw new Error('useLearning must be used within a LearningProvider');
    }
    return context;
};

interface LearningProviderProps {
    children: ReactNode;
}

export const LearningProvider: React.FC<LearningProviderProps> = ({ children }) => {
    const [progress, setProgress] = useState<Record<string, LearningProgress>>({});
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mintingStep, setMintingStep] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [useBlockchain, setUseBlockchain] = useState(true);

    const account = useCurrentAccount();
    const blockchain = useProofOfLearning();

    // Load user's on-chain data when wallet connects
    useEffect(() => {
        if (account && useBlockchain) {
            loadOnChainData();
        }
    }, [account, useBlockchain]);

    const loadOnChainData = async () => {
        try {
            // Load certificates from blockchain
            const onChainCerts = await blockchain.getUserCertificates();
            if (onChainCerts.length > 0) {
                const certs: Certificate[] = onChainCerts
                    .filter((c): c is NonNullable<typeof c> => c !== null)
                    .map(c => ({
                        id: c.objectId,
                        courseId: c.courseId,
                        courseName: c.courseName,
                        issuedAt: new Date(c.issuedAt * 1000), // epoch to date
                        objectId: c.objectId,
                        ownerAddress: account?.address,
                    }));
                setCertificates(certs);
            }

            // Load progress from blockchain
            const onChainProgress = await blockchain.getUserProgress();
            if (onChainProgress.length > 0) {
                const progressMap: Record<string, LearningProgress> = {};
                onChainProgress.forEach(p => {
                    progressMap[p.courseId] = {
                        courseId: p.courseId,
                        modulesCompleted: p.modulesCompleted,
                        startedAt: new Date(),
                        progressObjectId: p.objectId,
                        completedAt: p.modulesCompleted.every(Boolean) ? new Date() : undefined,
                    };
                });
                setProgress(prev => ({ ...prev, ...progressMap }));
            }
        } catch (err) {
            console.error('Failed to load on-chain data:', err);
        }
    };

    const startCourse = useCallback(async (courseId: string) => {
        if (progress[courseId]) return;

        setIsLoading(true);
        setError(null);

        try {
            let progressObjectId: string | undefined;

            if (useBlockchain && account) {
                setMintingStep('Creating learning progress on-chain...');
                const objectId = await blockchain.startLearning(courseId);
                progressObjectId = objectId || undefined;
            }

            setProgress(prev => ({
                ...prev,
                [courseId]: {
                    courseId,
                    modulesCompleted: [false, false, false, false],
                    startedAt: new Date(),
                    progressObjectId,
                }
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to start course');
        } finally {
            setIsLoading(false);
            setMintingStep('');
        }
    }, [progress, useBlockchain, account, blockchain]);

    const completeModule = useCallback(async (courseId: string, moduleIndex: number) => {
        const courseProgress = progress[courseId];
        if (!courseProgress) return;

        setIsLoading(true);
        setError(null);

        try {
            // If using blockchain and we have a progress object ID
            if (useBlockchain && account && courseProgress.progressObjectId) {
                setMintingStep(`Completing module ${moduleIndex + 1} on-chain...`);
                const success = await blockchain.completeModule(
                    courseProgress.progressObjectId,
                    moduleIndex + 1 // Module IDs are 1-indexed in contract
                );
                if (!success) {
                    throw new Error('Failed to complete module on blockchain');
                }
            }

            // Update local state
            const newModulesCompleted = [...courseProgress.modulesCompleted];
            newModulesCompleted[moduleIndex] = true;
            const allCompleted = newModulesCompleted.every(Boolean);

            setProgress(prev => ({
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    modulesCompleted: newModulesCompleted,
                    completedAt: allCompleted ? new Date() : undefined
                }
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to complete module');
        } finally {
            setIsLoading(false);
            setMintingStep('');
        }
    }, [progress, useBlockchain, account, blockchain]);

    const isCourseCompleted = useCallback((courseId: string): boolean => {
        const courseProgress = progress[courseId];
        return courseProgress?.modulesCompleted.every(Boolean) ?? false;
    }, [progress]);

    const getCourseProgress = useCallback((courseId: string): LearningProgress | undefined => {
        return progress[courseId];
    }, [progress]);

    const mintCertificateNFT = useCallback(async (
        courseId: string,
        courseName: string
    ): Promise<Certificate | null> => {
        const courseProgress = progress[courseId];

        setIsLoading(true);
        setError(null);

        try {
            let result: MintResult | null = null;

            if (useBlockchain && account && courseProgress?.progressObjectId) {
                // Real blockchain minting
                setMintingStep('Preparing transaction...');
                await new Promise(r => setTimeout(r, 500));

                setMintingStep('Waiting for wallet signature...');

                result = await blockchain.mintCertificate(
                    courseProgress.progressObjectId,
                    courseName,
                    NFT_BADGE_IMAGE_URL
                );

                if (!result) {
                    throw new Error('Failed to mint certificate');
                }

                setMintingStep('Transaction confirmed!');
            } else {
                // Demo mode - simulate
                setMintingStep('Preparing transaction...');
                await new Promise(r => setTimeout(r, 800));

                setMintingStep('Waiting for wallet signature...');
                await new Promise(r => setTimeout(r, 1000));

                setMintingStep('Broadcasting to IOTA network...');
                await new Promise(r => setTimeout(r, 1200));

                setMintingStep('Confirming transaction...');
                await new Promise(r => setTimeout(r, 800));

                result = {
                    transactionDigest: generateMockDigest(),
                    objectId: generateMockDigest(),
                    ownerAddress: account?.address || '',
                };
            }

            const certificate: Certificate = {
                id: `cert-${Date.now()}`,
                courseId,
                courseName,
                issuedAt: new Date(),
                transactionDigest: result.transactionDigest,
                objectId: result.objectId,
                ownerAddress: result.ownerAddress,
            };

            setCertificates(prev => [...prev, certificate]);

            setProgress(prev => ({
                ...prev,
                [courseId]: {
                    ...prev[courseId],
                    certificateId: certificate.id
                }
            }));

            setMintingStep('Certificate minted successfully!');

            return certificate;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mint certificate');
            return null;
        } finally {
            setIsLoading(false);
            setTimeout(() => setMintingStep(''), 2000);
        }
    }, [progress, useBlockchain, account, blockchain]);

    const value: LearningContextType = {
        progress,
        certificates,
        startCourse,
        completeModule,
        isCourseCompleted,
        getCourseProgress,
        mintCertificateNFT,
        isLoading,
        mintingStep,
        error,
        useBlockchain,
        setUseBlockchain,
    };

    return (
        <LearningContext.Provider value={value}>
            {children}
        </LearningContext.Provider>
    );
};

// Helper function to generate mock IOTA-style digests for demo mode
function generateMockDigest(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
