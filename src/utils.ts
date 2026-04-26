import { MULTIPLIERS } from './constants';

/**
 * Computes the multiplier based on the current streak.
 */
export function calculateMultiplier(streak: number): number {
    if (streak >= MULTIPLIERS.TIER_3.threshold) return MULTIPLIERS.TIER_3.value;
    if (streak >= MULTIPLIERS.TIER_2.threshold) return MULTIPLIERS.TIER_2.value;
    if (streak >= MULTIPLIERS.TIER_1.threshold) return MULTIPLIERS.TIER_1.value;
    return 1;
}

/**
 * Checks if a streak is expired based on current block height.
 */
export function checkExpiry(lastBlock: number, currentBlock: number, threshold: number): boolean {
    return (currentBlock - lastBlock) > threshold;
}
