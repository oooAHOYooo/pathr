/**
 * Liquid Glass Design Tokens - Spacing
 * 4px base scale for consistent rhythm
 */

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

export type Spacing = typeof spacing;

