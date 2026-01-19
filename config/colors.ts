/**
 * Archv Color System
 * A sophisticated dark palette for the passive news archive
 */

export const colors = {
  // Base backgrounds
  background: {
    primary: '#0f1419',    // Deep archive dark
    secondary: '#1a2028',  // Elevated surfaces
    tertiary: '#232c36',   // Cards and containers
    elevated: '#2d3748',   // Hover states
  },
  
  // Text colors
  text: {
    primary: '#f7fafc',    // High emphasis
    secondary: '#cbd5e0',  // Medium emphasis
    tertiary: '#718096',   // Low emphasis
    muted: '#4a5568',      // Disabled/hints
  },
  
  // Accent colors
  accent: {
    primary: '#f59e0b',    // Amber - primary actions
    secondary: '#d97706',  // Darker amber - hover
    tertiary: '#fbbf24',   // Lighter amber - highlights
  },
  
  // Semantic colors
  semantic: {
    success: '#10b981',    // Emerald
    warning: '#f59e0b',    // Amber
    error: '#ef4444',      // Red
    info: '#3b82f6',       // Blue
  },
  
  // Border colors
  border: {
    default: '#2d3748',
    light: '#374151',
    heavy: '#4b5563',
  },
};

/**
 * Category-specific colors for visual distinction
 * Carefully selected for accessibility and visual harmony
 */
export const categoryColors = {
  technology: {
    bg: '#8b5cf6',      // Purple
    text: '#ffffff',
    hover: '#7c3aed',
  },
  business: {
    bg: '#10b981',      // Emerald
    text: '#ffffff',
    hover: '#059669',
  },
  sports: {
    bg: '#3b82f6',      // Blue
    text: '#ffffff',
    hover: '#2563eb',
  },
  entertainment: {
    bg: '#ec4899',      // Pink
    text: '#ffffff',
    hover: '#db2777',
  },
  health: {
    bg: '#ef4444',      // Red
    text: '#ffffff',
    hover: '#dc2626',
  },
  science: {
    bg: '#06b6d4',      // Cyan
    text: '#ffffff',
    hover: '#0891b2',
  },
  general: {
    bg: '#64748b',      // Slate
    text: '#ffffff',
    hover: '#475569',
  },
};

/**
 * Get colors for a specific category
 */
export function getCategoryColors(category: string) {
  const normalizedCategory = category.toLowerCase() as keyof typeof categoryColors;
  return categoryColors[normalizedCategory] || categoryColors.general;
}

/**
 * Dark theme variants for different contexts
 */
export const darkVariants = {
  surface: {
    default: colors.background.tertiary,
    hover: colors.background.elevated,
    active: '#374151',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.4)',
    medium: 'rgba(0, 0, 0, 0.6)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },
  glow: {
    amber: 'rgba(245, 158, 11, 0.1)',
    purple: 'rgba(139, 92, 246, 0.1)',
    blue: 'rgba(59, 130, 246, 0.1)',
  },
};

export default colors;
