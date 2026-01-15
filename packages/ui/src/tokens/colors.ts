/**
 * Liquid Glass Design Tokens - Colors
 * Light and dark mode support
 */

export const colors = {
  light: {
    base: '#FFFFFF',
    surface: '#F5F5F7',
    primary: '#007AFF',
    text: '#000000',
    textSecondary: '#6E6E73',
    border: 'rgba(0, 0, 0, 0.1)',
    accent: {
      from: '#667EEA',
      to: '#764BA2',
    },
  },
  dark: {
    base: '#000000',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    text: '#FFFFFF',
    textSecondary: '#98989D',
    border: 'rgba(255, 255, 255, 0.1)',
    accent: {
      from: '#667EEA',
      to: '#764BA2',
    },
  },
} as const;

export type ColorMode = 'light' | 'dark';
export type Colors = typeof colors.light;



