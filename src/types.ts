/**
 * Core types for the StreakSDK.
 */

export type NetworkType = 'mainnet' | 'testnet';

export interface StreakConfig {
    readonly network: NetworkType;
    readonly contractAddress: string;
    readonly contractName: string;
}

export interface RawStreakState {
    readonly streak: number;
    readonly lastCheckInBlock: number;
    readonly totalCheckIns: number;
    readonly active: boolean;
}

export interface LiveStreakState extends RawStreakState {
    /** The computed multiplier based on the current streak */
    readonly liveMultiplier: number;
    /** Whether the streak has expired based on the current block height */
    readonly isExpired: boolean;
    /** Blocks remaining until the streak decays */
    readonly blocksUntilDecay: number;
}
