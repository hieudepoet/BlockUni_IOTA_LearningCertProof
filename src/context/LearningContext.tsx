import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LearningProgress {
    courseId: string;
    modulesCompleted: boolean[];
    startedAt: Date;
    completedAt?: Date;
    certificateId?: string;
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
    startCourse: (courseId: string) => void;
    completeModule: (courseId: string, moduleIndex: number) => void;
    isCourseCompleted: (courseId: string) => boolean;
    getCourseProgress: (courseId: string) => LearningProgress | undefined;
    mintCertificate: (courseId: string, courseName: string, walletAddress?: string) => Promise<Certificate>;
    isLoading: boolean;
    mintingStep: string;
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

    const startCourse = useCallback((courseId: string) => {
        setProgress(prev => {
            if (prev[courseId]) return prev;
            return {
                ...prev,
                [courseId]: {
                    courseId,
                    modulesCompleted: [false, false, false, false],
                    startedAt: new Date()
                }
            };
        });
    }, []);

    const completeModule = useCallback((courseId: string, moduleIndex: number) => {
        setProgress(prev => {
            const courseProgress = prev[courseId];
            if (!courseProgress) return prev;

            const newModulesCompleted = [...courseProgress.modulesCompleted];
            newModulesCompleted[moduleIndex] = true;

            const allCompleted = newModulesCompleted.every(Boolean);

            return {
                ...prev,
                [courseId]: {
                    ...courseProgress,
                    modulesCompleted: newModulesCompleted,
                    completedAt: allCompleted ? new Date() : undefined
                }
            };
        });
    }, []);

    const isCourseCompleted = useCallback((courseId: string): boolean => {
        const courseProgress = progress[courseId];
        return courseProgress?.modulesCompleted.every(Boolean) ?? false;
    }, [progress]);

    const getCourseProgress = useCallback((courseId: string): LearningProgress | undefined => {
        return progress[courseId];
    }, [progress]);

    const mintCertificate = useCallback(async (
        courseId: string,
        courseName: string,
        walletAddress?: string
    ): Promise<Certificate> => {
        setIsLoading(true);

        try {
            // Step 1: Preparing transaction
            setMintingStep('Preparing transaction...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Step 2: Signing with wallet
            setMintingStep('Waiting for wallet signature...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 3: Broadcasting to network
            setMintingStep('Broadcasting to IOTA network...');
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Step 4: Confirming transaction
            setMintingStep('Confirming transaction...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Generate mock but realistic-looking blockchain data
            // In production, these would come from actual blockchain response
            const mockTransactionDigest = generateMockDigest();
            const mockObjectId = generateMockDigest();

            const certificate: Certificate = {
                id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                courseId,
                courseName,
                issuedAt: new Date(),
                transactionDigest: mockTransactionDigest,
                objectId: mockObjectId,
                ownerAddress: walletAddress
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
        } finally {
            setIsLoading(false);
            setTimeout(() => setMintingStep(''), 2000);
        }
    }, []);

    const value: LearningContextType = {
        progress,
        certificates,
        startCourse,
        completeModule,
        isCourseCompleted,
        getCourseProgress,
        mintCertificate,
        isLoading,
        mintingStep
    };

    return (
        <LearningContext.Provider value={value}>
            {children}
        </LearningContext.Provider>
    );
};

// Helper function to generate mock IOTA-style digests
function generateMockDigest(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 44; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
