/**
 * Liquid Glass Design Tokens - Animation
 * Duration and easing curves
 */

export const animation = {
  duration: {
    micro: 200,
    standard: 300,
    macro: 500,
  },
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material standard
} as const;

export type Animation = typeof animation;


