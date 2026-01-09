/**
 * Liquid Glass Design Tokens - Typography
 * Type scale: 12/14/16/18/24/32/48
 */

export const typography = {
  xs: {
    fontSize: 12,
    lineHeight: 14,
  },
  sm: {
    fontSize: 14,
    lineHeight: 16,
  },
  base: {
    fontSize: 16,
    lineHeight: 20,
  },
  lg: {
    fontSize: 18,
    lineHeight: 22,
  },
  xl: {
    fontSize: 24,
    lineHeight: 28,
  },
  '2xl': {
    fontSize: 32,
    lineHeight: 36,
  },
  '3xl': {
    fontSize: 48,
    lineHeight: 52,
  },
} as const;

export type Typography = typeof typography;

