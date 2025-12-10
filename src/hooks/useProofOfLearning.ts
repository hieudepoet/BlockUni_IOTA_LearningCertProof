import { useSignAndExecuteTransaction, useCurrentAccount } from '@iota/dapp-kit';
import { useIotaClient } from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import { useCallback, useState } from 'react';
import { PACKAGE_ID, MODULE_NAME, TYPES } from '../config/contract';

export interface MintResult {
    transactionDigest: string;
    objectId: string;
    ownerAddress: string;
}

export interface ProgressObject {
    objectId: string;
    courseId: string;
    modulesCompleted: boolean[];
}

export function useProofOfLearning() {
    const client = useIotaClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Start learning a course - creates LearningProgress object
    const startLearning = useCallback(async (courseId: string): Promise<string | null> => {
        if (!account) {
            setError('Please connect your wallet first');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::start_learning_entry`,
                arguments: [
                    tx.pure.vector('u8', Array.from(new TextEncoder().encode(courseId))),
                ],
            });

            const result = await signAndExecute({
                transaction: tx,
            });

            // Wait for transaction to be indexed
            await client.waitForTransaction({ digest: result.digest });

            // Get the created object
            const txDetails = await client.getTransactionBlock({
                digest: result.digest,
                options: { showObjectChanges: true },
            });

            const createdObject = txDetails.objectChanges?.find(
                (change) => change.type === 'created' &&
                    'objectType' in change &&
                    change.objectType.includes('LearningProgress')
            );

            if (createdObject && 'objectId' in createdObject) {
                return createdObject.objectId;
            }

            return null;
        } catch (err) {
            console.error('Failed to start learning:', err);
            setError(err instanceof Error ? err.message : 'Failed to start learning');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [account, client, signAndExecute]);

    // Complete a module
    const completeModule = useCallback(async (
        progressObjectId: string,
        moduleId: number
    ): Promise<boolean> => {
        if (!account) {
            setError('Please connect your wallet first');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::complete_module`,
                arguments: [
                    tx.object(progressObjectId),
                    tx.pure.u8(moduleId),
                ],
            });

            const result = await signAndExecute({
                transaction: tx,
            });

            await client.waitForTransaction({ digest: result.digest });
            return true;
        } catch (err) {
            console.error('Failed to complete module:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete module');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [account, client, signAndExecute]);

    // Mint certificate NFT
    const mintCertificate = useCallback(async (
        progressObjectId: string,
        courseName: string,
        imageUrl: string
    ): Promise<MintResult | null> => {
        if (!account) {
            setError('Please connect your wallet first');
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tx = new Transaction();

            tx.moveCall({
                target: `${PACKAGE_ID}::${MODULE_NAME}::mint_certificate`,
                arguments: [
                    tx.object(progressObjectId),
                    tx.pure.vector('u8', Array.from(new TextEncoder().encode(courseName))),
                    tx.pure.vector('u8', Array.from(new TextEncoder().encode(imageUrl))),
                ],
            });

            const result = await signAndExecute({
                transaction: tx,
            });

            await client.waitForTransaction({ digest: result.digest });

            // Get the created certificate object
            const txDetails = await client.getTransactionBlock({
                digest: result.digest,
                options: { showObjectChanges: true },
            });

            const createdCert = txDetails.objectChanges?.find(
                (change) => change.type === 'created' &&
                    'objectType' in change &&
                    change.objectType.includes('CourseCertificate')
            );

            if (createdCert && 'objectId' in createdCert) {
                return {
                    transactionDigest: result.digest,
                    objectId: createdCert.objectId,
                    ownerAddress: account.address,
                };
            }

            return {
                transactionDigest: result.digest,
                objectId: '',
                ownerAddress: account.address,
            };
        } catch (err) {
            console.error('Failed to mint certificate:', err);
            setError(err instanceof Error ? err.message : 'Failed to mint certificate');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [account, client, signAndExecute]);

    // Get user's learning progress objects
    const getUserProgress = useCallback(async (): Promise<ProgressObject[]> => {
        if (!account) return [];

        try {
            const objects = await client.getOwnedObjects({
                owner: account.address,
                filter: {
                    StructType: TYPES.LEARNING_PROGRESS,
                },
                options: {
                    showContent: true,
                },
            });

            return objects.data.map((obj) => {
                const content = obj.data?.content;
                if (content && 'fields' in content) {
                    const fields = content.fields as Record<string, unknown>;
                    return {
                        objectId: obj.data?.objectId || '',
                        courseId: String(fields.course_id || ''),
                        modulesCompleted: [
                            Boolean(fields.module_1_completed),
                            Boolean(fields.module_2_completed),
                            Boolean(fields.module_3_completed),
                            Boolean(fields.module_4_completed),
                        ],
                    };
                }
                return {
                    objectId: obj.data?.objectId || '',
                    courseId: '',
                    modulesCompleted: [false, false, false, false],
                };
            });
        } catch (err) {
            console.error('Failed to get user progress:', err);
            return [];
        }
    }, [account, client]);

    // Get user's certificates
    const getUserCertificates = useCallback(async () => {
        if (!account) return [];

        try {
            const objects = await client.getOwnedObjects({
                owner: account.address,
                filter: {
                    StructType: TYPES.COURSE_CERTIFICATE,
                },
                options: {
                    showContent: true,
                },
            });

            return objects.data.map((obj) => {
                const content = obj.data?.content;
                if (content && 'fields' in content) {
                    const fields = content.fields as Record<string, unknown>;
                    return {
                        objectId: obj.data?.objectId || '',
                        courseId: String(fields.course_id || ''),
                        courseName: String(fields.course_name || ''),
                        issuedAt: Number(fields.issued_at || 0),
                        imageUrl: String(fields.image_url || ''),
                    };
                }
                return null;
            }).filter(Boolean);
        } catch (err) {
            console.error('Failed to get certificates:', err);
            return [];
        }
    }, [account, client]);

    return {
        startLearning,
        completeModule,
        mintCertificate,
        getUserProgress,
        getUserCertificates,
        isLoading,
        error,
        clearError: () => setError(null),
    };
}
