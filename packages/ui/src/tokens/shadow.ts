/**
 * Liquid Glass Design Tokens - Shadows
 * For elevation and depth
 */

export const shadow = {
  default: '0 4px 20px rgba(0, 0, 0, 0.1)',
  medium: '0 8px 30px rgba(0, 0, 0, 0.15)',
  large: '0 12px 40px rgba(0, 0, 0, 0.2)',
} as const;

export type Shadow = typeof shadow;



