/**
 * Liquid Glass Design Tokens - Blur Strength
 * For frosted glass effects
 */

export const blur = {
  light: 20,
  medium: 40,
  heavy: 60,
} as const;

export type Blur = typeof blur;


