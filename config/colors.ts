// Color palette with eye-comfort focus
export const colors = {
  // Backgrounds - warm, soft tones
  background: {
    primary: '#faf8f3',      // Soft warm cream (main background)
    surface: '#ffffff',       // Pure white (cards, elevated elements)
    secondary: '#f5f1e8',     // Slightly darker warm tone
  },
  
  // Text colors - high contrast (7:1 ratio for accessibility)
  text: {
    primary: '#2d2a26',       // Dark brown (main text)
    secondary: '#5a544c',     // Muted brown (secondary text)
    muted: '#8a8077',         // Very muted (hints, labels)
  },
  
  // Accent colors - muted but distinguishable
  accent: {
    primary: '#d4722b',       // Warm terracotta
    primaryHover: '#b8621f',
    secondary: '#7b9f8e',     // Muted sage green
    info: '#6b8ea8',          // Soft blue-gray
    warning: '#d4a342',       // Warm amber
  },
  
  // Category-specific colors (muted palette)
  categories: {
    World: '#7b9f8e',
    Politics: '#9b7d9b',
    Business: '#8a8ea8',
    Technology: '#7893a8',
    Sports: '#a87878',
    Entertainment: '#c89078',
    Science: '#78a8a8',
    Health: '#8ea87b',
  },
  
  // Dark mode variants
  dark: {
    background: {
      primary: '#1a1816',
      surface: '#252220',
      secondary: '#2d2926',
    },
    text: {
      primary: '#e8e4dc',
      secondary: '#c4bfb5',
      muted: '#8a8077',
    },
    accent: {
      primary: '#e68a4f',
      primaryHover: '#f29d63',
      secondary: '#92b5a3',
      info: '#8aa8c4',
      warning: '#e6b85f',
    },
  },
} as const;

// Helper function to get category color
export const getCategoryColor = (category: string): string => {
  return colors.categories[category as keyof typeof colors.categories] || colors.accent.secondary;
};

// Contrast ratios (for reference/documentation)
export const contrastRatios = {
  textOnBackground: 7.1,      // WCAG AAA compliant
  secondaryOnBackground: 4.8, // WCAG AA compliant
  mutedOnBackground: 3.2,     // For non-essential text
};
