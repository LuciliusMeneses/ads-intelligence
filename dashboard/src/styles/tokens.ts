/**
 * ADS INTELLIGENCE Design Tokens
 * Precision Ads Console inspired, but with own ADS INTELLIGENCE identity
 * Identity: ADS INTELLIGENCE (not Google Ads)
 */

// ADS INTELLIGENCE Brand Identity
export const brand = {
  // Primary brand color - distinctive purple/violet for AI-native intelligence
  primary: '#6B4EFF',
  primaryHover: '#5A3DE8',
  primaryPressed: '#4D35CC',
  primaryContainer: '#F0EDFA',
  primaryOnContainer: '#4D35CC',

  // Secondary brand color - complementary teal
  secondary: '#00B8A9',
  secondaryHover: '#00A396',
  secondaryContainer: '#E0F8F6',
  secondaryOnContainer: '#006E66',

  // AI Accent - distinct color for AI-powered elements
  aiAccent: '#8B5CF6',
  aiAccentHover: '#7C3AED',
  aiAccentContainer: '#F5F0FF',
  aiAccentOnContainer: '#6D28D9',

  // AI Specialist colors for different agent types
  aiSpecialist: {
    budget: '#6B4EFF',
    creative: '#EC4899',
    audience: '#06B6D4',
    bid: '#F59E0B',
    performance: '#10B981',
    market: '#8B5CF6',
  },
} as const;

export const colors = {
  // Background & Surface
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceHover: '#F8FAFD',
  surfacePressed: '#F1F3F4',
  surfaceElevated: '#FFFFFF',

  // Borders
  border: '#DADCE0',
  borderHover: '#BDC1C6',
  borderFocus: brand.primary,

  // Brand Primary (ADS INTELLIGENCE Purple)
  primary: brand.primary,
  primaryHover: brand.primaryHover,
  primaryPressed: brand.primaryPressed,
  primaryContainer: brand.primaryContainer,
  primaryOnContainer: brand.primaryOnContainer,

  // Brand Secondary (Teal)
  secondary: brand.secondary,
  secondaryHover: brand.secondaryHover,
  secondaryContainer: brand.secondaryContainer,
  secondaryOnContainer: brand.secondaryOnContainer,

  // AI Accent (for AI-powered elements)
  aiAccent: brand.aiAccent,
  aiAccentHover: brand.aiAccentHover,
  aiAccentContainer: brand.aiAccentContainer,
  aiAccentOnContainer: brand.aiAccentOnContainer,

  // Success (Google Green)
  success: '#1E8E3E',
  successHover: '#1B7D36',
  successContainer: '#E6F4EA',
  successOnContainer: '#137333',

  // Warning (Material Amber)
  warning: '#F9AB00',
  warningHover: '#E69B00',
  warningContainer: '#FEF7E0',
  warningOnContainer: '#7A5700',

  // Danger/Error (Google Red)
  danger: '#D93025',
  dangerHover: '#C5221F',
  dangerContainer: '#FCE8E6',
  dangerOnContainer: '#C5221F',

  // Text
  textPrimary: '#202124',
  textSecondary: '#5F6368',
  textTertiary: '#80868B',
  textOnPrimary: '#FFFFFF',
  textOnSurface: '#202124',
  textOnSurfaceVariant: '#5F6368',
  textOnSurfaceDisabled: '#80868B',

  // Status Colors
  statusActive: '#1E8E3E',
  statusActiveBg: '#E6F4EA',
  statusScaling: brand.aiAccent,  // Use AI accent for scaling (AI-driven)
  statusScalingBg: brand.aiAccentContainer,
  statusPaused: '#5F6368',
  statusPausedBg: '#F1F3F4',
  statusError: '#D93025',
  statusErrorBg: '#FCE8E6',
  statusAttention: '#F9AB00',
  statusAttentionBg: '#FEF7E0',
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  gutter: '1.5rem',   // 24px (was 16px)
  gutterDense: '1rem', // 16px (was 8px)
  margin: '2rem',   // 32px (was 24px)
  marginMobile: '1rem', // 16px (was 12px)
} as const;

export const radius = {
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  full: '9999px',   // pill
} as const;

export const typography = {
  fontFamily: {
    sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px (was 13px)
    base: ['0.875rem', { lineHeight: '1.5rem' }], // 14px with better line height
    lg: ['1rem', { lineHeight: '1.5rem' }],        // 16px
    xl: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
    '2xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
    '3xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '4xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '5xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    metric: ['2rem', { lineHeight: '2.5rem', fontWeight: '600' }], // 32px
    metricTable: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }], // 14px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.01em',
    wider: '0.015em',
  },
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(60,64,67,0.3)',
  DEFAULT: '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
  lg: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
} as const;

export const transitions = {
  fast: '150ms ease',
  DEFAULT: '200ms ease',
  slow: '300ms ease',
} as const;

export const zIndex = {
  dropdown: 30,
  sticky: 30,
  sidebar: 40,
  modal: 50,
  toast: 60,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

export const table = {
  headerHeight: '40px',
  rowHeight: '44px',
  rowHeightDense: '36px',
  borderColor: '#E8EAED',
  hoverBg: '#F8FAFD',
  stickyHeaderBg: '#F8F9FA',
} as const;

export const componentSizes = {
  button: {
    sm: { height: '28px', paddingX: '12px', fontSize: '13px' },
    md: { height: '36px', paddingX: '16px', fontSize: '14px' },
    lg: { height: '44px', paddingX: '24px', fontSize: '15px' },
  },
  input: {
    sm: { height: '32px', paddingX: '12px', fontSize: '13px' },
    md: { height: '36px', paddingX: '14px', fontSize: '14px' },
    lg: { height: '44px', paddingX: '16px', fontSize: '15px' },
  },
  badge: {
    sm: { height: '18px', paddingX: '6px', fontSize: '11px' },
    md: { height: '22px', paddingX: '8px', fontSize: '12px' },
    lg: { height: '26px', paddingX: '10px', fontSize: '13px' },
  },
} as const;