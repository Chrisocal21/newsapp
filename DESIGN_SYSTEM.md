# Archv Design System

## Overview
Archv features a professional dark theme inspired by digital archives and libraries. The design emphasizes readability, sophisticated aesthetics, and a premium reading experience for passively saved news content.

## Color Palette

### Base Colors
- **Primary Background**: `#0f1419` - Deep archive dark
- **Secondary Background**: `#1a2028` - Elevated surfaces
- **Tertiary Background**: `#232c36` - Cards and containers
- **Elevated Background**: `#2d3748` - Hover states

### Text Colors
- **Primary Text**: `#f7fafc` - High emphasis content
- **Secondary Text**: `#cbd5e0` - Medium emphasis content
- **Tertiary Text**: `#718096` - Low emphasis content
- **Muted Text**: `#4a5568` - Disabled/hints

### Accent Colors
- **Primary Accent**: `#f59e0b` - Amber (primary actions, links)
- **Secondary Accent**: `#d97706` - Darker amber (hover states)
- **Tertiary Accent**: `#fbbf24` - Lighter amber (highlights)

### Semantic Colors
- **Success**: `#10b981` - Emerald
- **Warning**: `#f59e0b` - Amber
- **Error**: `#ef4444` - Red
- **Info**: `#3b82f6` - Blue

### Category Colors
Each news category has a distinct color for visual differentiation:
- **Technology**: `#8b5cf6` - Purple
- **Business**: `#10b981` - Emerald
- **Sports**: `#3b82f6` - Blue
- **Entertainment**: `#ec4899` - Pink
- **Health**: `#ef4444` - Red
- **Science**: `#06b6d4` - Cyan
- **General**: `#64748b` - Slate

## Typography

### Scale
The typography system uses CSS custom properties for consistency:

- **Display**: `3rem` (48px) - Used for large hero titles
- **Headline**: `2rem` (32px) - Used for page titles and major headings
- **Title**: `1.5rem` (24px) - Used for card titles and section headers
- **Body**: `1rem` (16px) - Standard body text
- **Caption**: `0.875rem` (14px) - Small text, metadata
- **Label**: `0.75rem` (12px) - Labels, tags, badges

### Weights
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Subheadings
- **Bold**: 700 - Headings, buttons

### Line Heights
- **Tight**: 1.25 - Headlines and display text
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Components

### Cards (`.card`)
```css
background: var(--color-bg-tertiary);
border: 1px solid var(--color-border);
border-radius: 0.75rem;
padding: 1.5rem;
transition: all 0.3s ease;
```

**Features:**
- Subtle shadow that elevates on hover
- Smooth transitions
- Consistent border radius
- Responsive padding

### Buttons (`.btn-primary`)
```css
background: var(--color-accent-primary);
color: white;
padding: 0.625rem 1.25rem;
border-radius: 0.5rem;
font-weight: 500;
transition: all 0.2s ease;
```

**States:**
- Hover: Background darkens to `var(--color-accent-secondary)`
- Focus: Outline with accent color
- Active: Slight scale down

### Badges (`.badge`)
```css
display: inline-block;
padding: 0.25rem 0.75rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Usage:**
- Category indicators
- Status labels
- Featured tags

## Animations

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-in;
}
```

### Slide In
```css
@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### Shimmer
Used for loading states:
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

## Spacing

### Scale
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)

### Guidelines
- Use consistent spacing between related elements
- Increase spacing to separate distinct sections
- Maintain rhythm with a 8px base grid

## Accessibility

### Contrast Ratios
- **Text on Background**: 7.1+ (WCAG AAA)
- **Secondary Text**: 4.8+ (WCAG AA)
- **Muted Text**: 3.2+ (non-essential only)

### Focus States
All interactive elements have visible focus indicators:
- 2px outline with accent color
- 2px offset for clarity
- Rounded to match element shape

### Touch Targets
Minimum size: 44x44px for all interactive elements on mobile

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach
Start with mobile styles, then enhance for larger screens:
```css
/* Mobile (default) */
.element { font-size: 1rem; }

/* Tablet and up */
@media (min-width: 768px) {
  .element { font-size: 1.125rem; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element { font-size: 1.25rem; }
}
```

## Dark Theme Philosophy

### Core Principles
1. **Readability First**: High contrast text ensures comfortable reading
2. **Depth Through Layers**: Multiple background shades create visual hierarchy
3. **Subtle Elevation**: Shadow and border combinations suggest depth
4. **Warm Accents**: Amber tones provide warmth in the dark interface
5. **Category Distinction**: Vibrant category colors pop against dark backgrounds

### Best Practices
- Avoid pure black (#000000) - use deep grays instead
- Use semi-transparent overlays for modals
- Add subtle borders to define boundaries
- Apply backdrop blur for floating elements
- Maintain sufficient whitespace

## Implementation

### CSS Variables Usage
Always use CSS custom properties for consistency:

```tsx
// ✅ Good
<div className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">

// ❌ Bad
<div className="bg-[#0f1419] text-[#f7fafc]">
```

### Component Classes
Prefer utility classes over inline styles:

```tsx
// ✅ Good
<button className="btn-primary">Click me</button>

// ❌ Bad
<button style={{ background: '#f59e0b', color: 'white' }}>Click me</button>
```

### Dynamic Category Colors
Use the TypeScript helper for category-specific styling:

```tsx
import { getCategoryColors } from '@/config/colors';

const colors = getCategoryColors(article.category);
// Returns: { bg: string, text: string, hover: string }
```

## Future Enhancements

### Planned Additions
- [ ] Light mode support (user preference)
- [ ] High contrast mode for accessibility
- [ ] Custom theme builder
- [ ] Additional animation presets
- [ ] Loading skeleton screens
- [ ] Toast notification system
- [ ] Modal/dialog component styles

### Design Tokens
Consider expanding to a full design token system:
- Border radii tokens
- Shadow elevation system
- Z-index scale
- Transition duration standards

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Maintainer**: Archv Development Team
