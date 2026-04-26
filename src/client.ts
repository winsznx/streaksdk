import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { 
    cvToValue, 
    fetchCallReadOnlyFunction, 
    makeContractCall, 
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    uintCV
} from '@stacks/transactions';
import { StreakConfig, RawStreakState, LiveStreakState } from './types';
import { calculateMultiplier, checkExpiry } from './utils';
import { STREAK_DECAY_THRESHOLD } from './constants';

export class StreakClient {
    private readonly config: StreakConfig;
    private readonly networkInstance: typeof STACKS_MAINNET | typeof STACKS_TESTNET;

    constructor(config: StreakConfig) {
        this.config = config;
        this.networkInstance = config.network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
    }

    /**
     * Fetches the current state and computes live metrics.
     */
    async getLiveState(userAddress: string, habitId: number = 0): Promise<LiveStreakState> {
        const raw = await this.fetchRawState(userAddress, habitId);
        
        // Mock current block height for logic demonstration
        const currentBlock = 100000; 

        const isExpired = checkExpiry(raw.lastCheckInBlock, currentBlock, STREAK_DECAY_THRESHOLD);
        const liveStreak = isExpired ? 0 : raw.streak;

        return {
            ...raw,
            streak: liveStreak,
            liveMultiplier: calculateMultiplier(liveStreak),
            isExpired,
            blocksUntilDecay: Math.max(0, STREAK_DECAY_THRESHOLD - (currentBlock - raw.lastCheckInBlock))
        };
    }

    private async fetchRawState(userAddress: string, habitId: number): Promise<RawStreakState> {
        try {
            const cv = await fetchCallReadOnlyFunction({
                contractAddress: this.config.contractAddress,
                contractName: this.config.contractName,
                functionName: 'get-streak',
                functionArgs: [uintCV(habitId)],
                senderAddress: userAddress,
                network: this.networkInstance
            });
            const value = cvToValue(cv) as any;
            return {
                streak: Number(value?.streak || 0),
                lastCheckInBlock: Number(value?.['last-check-in'] || 0),
                totalCheckIns: Number(value?.['total-check-ins'] || 0),
                active: !!value?.active
            };
        } catch (error) {
            console.error('Failed to fetch raw streak state', error);
            throw error;
        }
    }

    /**
     * Submits a transaction to the Stacks blockchain.
     */
    async submitAction(functionName: string, senderKey: string, args: any[] = []): Promise<string> {
        const txOptions = {
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName,
            functionArgs: args.map(arg => typeof arg === 'number' ? uintCV(arg) : arg),
            senderKey,
            network: this.networkInstance,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        } as any;

        const transaction = await makeContractCall(txOptions);
        const result = await broadcastTransaction(transaction);
        
        if ('error' in result && result.error) {
            throw new Error(`Transaction failed: ${result.error}`);
        }
        
        return result.txid;
    }
}
