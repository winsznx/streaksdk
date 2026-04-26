export const MICROSTX_PER_STX = 1_000_000;
export const BLOCKS_PER_DAY = 144;
export const STREAK_DECAY_THRESHOLD = 2 * BLOCKS_PER_DAY; // 2 days

export const MULTIPLIERS = {
    TIER_1: { threshold: 7, value: 2 },
    TIER_2: { threshold: 14, value: 3 },
    TIER_3: { threshold: 30, value: 5 },
} as const;
