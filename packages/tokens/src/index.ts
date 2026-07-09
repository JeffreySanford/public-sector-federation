export const primitive = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#2563eb',
    600: '#1d4ed8',
    700: '#1e40af',
    800: '#1e3a8a',
    900: '#172554',
    950: '#0f172a',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  red: {
    50: '#fef2f2',
    500: '#dc2626',
    700: '#b91c1c',
  },
  green: {
    50: '#f0fdf4',
    500: '#16a34a',
    700: '#15803d',
  },
} as const;

export const semantic = {
  light: {
    surfaceBackground: primitive.slate[50],
    surfaceCard: '#ffffff',
    surfaceBorder: primitive.slate[200],
    textPrimary: primitive.slate[900],
    textSecondary: primitive.slate[600],
    primaryBackground: primitive.blue[600],
    primaryForeground: '#ffffff',
    focusRingColor: primitive.blue[500],
    dangerColor: primitive.red[500],
    successColor: primitive.green[500],
  },
  dark: {
    surfaceBackground: primitive.slate[950],
    surfaceCard: primitive.slate[900],
    surfaceBorder: primitive.slate[700],
    textPrimary: primitive.slate[50],
    textSecondary: primitive.slate[300],
    primaryBackground: primitive.blue[400],
    primaryForeground: primitive.slate[950],
    focusRingColor: primitive.blue[300],
    dangerColor: '#f87171',
    successColor: '#4ade80',
  },
} as const;

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
} as const;

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

export const typography = {
  fontFamily: '"Inter", "Segoe UI", Arial, sans-serif',
  bodySize: '1rem',
  bodyLineHeight: '1.5',
  headingLineHeight: '1.2',
} as const;
