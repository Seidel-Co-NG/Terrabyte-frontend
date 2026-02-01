/**
 * Centralized Color System
 * 
 * To change the brand color globally, update the CSS variable in src/index.css:
 * --brand-primary: #1812AE; (change this value)
 * 
 * All components using brand colors will automatically update.
 */

export const BRAND_COLORS = {
  primary: '#1812AE',
  primaryDark: '#141098',
  primaryLight: '#2d26c2',
  primaryLighter: 'rgba(24, 18, 174, 0.1)',
  primaryLightest: 'rgba(24, 18, 174, 0.05)',
} as const;

/**
 * CSS Variable Names (for reference)
 * These are defined in src/index.css and work with both light and dark themes
 */
export const CSS_VARIABLES = {
  brandPrimary: 'var(--brand-primary)',
  brandPrimaryDark: 'var(--brand-primary-dark)',
  brandPrimaryLight: 'var(--brand-primary-light)',
  brandPrimaryLighter: 'var(--brand-primary-lighter)',
  brandPrimaryLightest: 'var(--brand-primary-lightest)',
} as const;

