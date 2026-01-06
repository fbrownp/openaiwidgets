# Widget Design System

This document describes the unified design system and style guidelines for all OpenAI widgets in this project.

## Overview

All widgets follow a consistent design language to provide a cohesive user experience across different dashboards and components. The design system emphasizes:

- **Dark Mode First**: All widgets default to dark mode for reduced eye strain and modern aesthetics
- **Consistent Layout**: Standardized positioning of controls and interactive elements
- **Unified Color Palette**: Shared color scheme across all widgets for brand consistency
- **Responsive Design**: Adapts to different screen sizes while maintaining usability
- **Smooth Interactions**: Consistent animations and transitions

## Theme Configuration

### Default Theme

**All widgets start in dark mode by default** (`DEFAULT_THEME = 'dark'`)

### Theme Toggle Position

The theme toggle is **always positioned under the dashboard title**, never in the upper right corner. This ensures:
- Consistent user experience across all widgets
- Clear association with the dashboard name
- Dedicated space in the upper right for the expand button

### Color Palette

#### Dark Mode (Default)
```typescript
{
  background: '#212121',           // Main background
  cardBackground: '#2d2d2d',       // Card/panel background
  cardBorder: '#404040',           // Card borders
  text: '#ffffff',                 // Primary text
  textSecondary: '#b0b0b0',        // Secondary text
  buttonActiveBg: '#8b5cf6',       // Active button (purple)
  purple: '#a78bfa',               // Accent color
  purpleDark: '#8b5cf6',           // Dark purple
  border: '#404040',               // Standard borders
  gridLine: '#404040'              // Chart grid lines
}
```

#### Light Mode
```typescript
{
  background: '#f9fafb',           // Main background
  cardBackground: 'white',         // Card/panel background
  cardBorder: '#f0f0f0',           // Card borders
  text: '#111827',                 // Primary text
  textSecondary: '#6b7280',        // Secondary text
  buttonActiveBg: '#7c3aed',       // Active button (purple)
  purple: '#8b5cf6',               // Accent color
  purpleDark: '#7c3aed',           // Dark purple
  border: '#e5e7eb',               // Standard borders
  gridLine: '#f0f0f0'              // Chart grid lines
}
```

## Layout Standards

### Page Structure

```
┌─────────────────────────────────────────────────────┐
│                                    [Expand Button]  │ <- Fixed top-right
│  Dashboard Title                                    │
│  Subtitle/Description                               │
│  [Theme Toggle: Light | Dark]                       │ <- Under title
│                                                      │
│  [Filters/Controls]                                 │
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐                        │
│  │ Card │ │ Card │ │ Card │  <- Widget cards       │
│  └──────┘ └──────┘ └──────┘                        │
│                                                      │
│  [Charts and Visualizations]                        │
└─────────────────────────────────────────────────────┘
```

### Expand Button

**Position**: Fixed top-right corner (top: 20px, right: 20px)

**Behavior**:
- Toggles between `fullscreen` and `inline` display modes
- Uses a 4-arrows icon indicating expand/contract
- Changes from expand to collapse based on current display mode

**Styling**:
```css
position: fixed;
top: 20px;
right: 20px;
padding: 10px;
border-radius: 8px;
z-index: 1000;
```

### Theme Toggle

**Position**: Directly below the dashboard title and subtitle

**Styling**:
```css
display: flex;
gap: 6px;
padding: 4px;
border-radius: 8px;
width: fit-content;
```

**Buttons**:
- Light/Dark or custom labels (e.g., "Blanco/Oscuro", "Light/Dark", "☀️/🌙")
- Active button highlighted with purple accent color
- Smooth transition on theme change

## Component Styles

### Cards

**Standard Widget Card**:
```css
padding: 16px;
border-radius: 8px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
transition: transform 0.2s ease, box-shadow 0.2s ease;
```

**Hover Effect**:
```css
transform: translateY(-4px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
```

### Typography

**Dashboard Title**:
- Font size: 28px
- Font weight: 700
- Margin bottom: 4px

**Subtitle/Description**:
- Font size: 14px
- Color: textSecondary
- Margin top: 4px

**Widget Card Title**:
- Font size: 14px
- Font weight: 600
- Color: text

### Buttons

**Standard Button**:
```css
padding: 8px 16px;
border-radius: 6px;
border: none;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s;
```

**Active State**:
```css
background-color: buttonActiveBg (#8b5cf6);
color: white;
```

### Charts

**Container**:
```css
border-radius: 12px;
padding: 24px;
border: 1px solid cardBorder;
```

**Grid Lines**: Use `gridLine` color from theme

**Bars/Data Elements**: Use purple accent colors for primary data

## Grid Layouts

### Three-Column Grid (Widget Cards)
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;
```

### Two-Column Grid (Charts)
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 20px;
```

## Animations and Transitions

### Standard Transition
```css
transition: all 0.2s ease;
```

### Fade In Up (Cards)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: fadeInUp 0.4s ease-out;
```

### Loading Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
border: 3px solid #e5e7eb;
border-top-color: #8b5cf6;
animation: spin 0.8s linear infinite;
```

## Responsive Breakpoints

### Desktop (Default)
- Full 3-column grid for cards
- 2-column grid for charts
- 24px padding

### Tablet (≤1024px)
```css
.widget-grid-3 {
  grid-template-columns: repeat(2, 1fr);
}
.widget-grid-2 {
  grid-template-columns: 1fr;
}
```

### Mobile (≤640px)
```css
.widget-grid-3 {
  grid-template-columns: 1fr;
}
padding: 16px;
font-size adjustments for titles
```

## Usage Guide

### Implementing in a New Widget

1. **Import theme utilities**:
```typescript
import { getThemeColors, DEFAULT_THEME, Theme } from '../widget_styles/theme';
import '../widget_styles/common.css';
```

2. **Initialize theme state**:
```typescript
const [theme, setTheme] = React.useState<Theme>(DEFAULT_THEME);
const themeColors = getThemeColors(theme);
```

3. **Add expand button handler**:
```typescript
const handleExpand = async () => {
  try {
    if (typeof window !== 'undefined' && window.openai?.requestDisplayMode) {
      const currentMode = window.openai.displayMode;
      const newMode = currentMode === 'fullscreen' ? 'inline' : 'fullscreen';
      await window.openai.requestDisplayMode({ mode: newMode });
    }
  } catch (error) {
    console.error('Failed to toggle display mode:', error);
  }
};
```

4. **Structure your layout**:
   - Position expand button in top-right (fixed)
   - Place title and subtitle
   - Add theme toggle below title
   - Add your content (filters, cards, charts)

## Widget-Specific Customizations

While maintaining the core design system, widgets can have specific customizations:

### Barplot Widget
- Uses custom chart components for data visualization
- Maintains metric selector in chart header
- Consistent card styling for chart containers

### Indexing Dashboard
- Three summary cards: Documents Indexed, Documents Processed, etc.
- Horizontal barplot for detailed view
- Filter dropdowns using standard styling

### SNIFA Dashboard Faltas
- Emoji icons in theme toggle (☀️/🌙)
- Multiple horizontal stacked barplots
- Specialized gravedad (severity) color coding

### Reclamacion Identifier Widget
- Carousel-based layout for observations
- Specialized chip colors for different categories
- URL clickable cards with observation details

## Design Principles

1. **Consistency Over Customization**: Prefer standard patterns unless there's a strong functional reason
2. **Dark Mode First**: Design and test in dark mode, ensure light mode works well
3. **Accessibility**: Maintain sufficient contrast ratios in both themes
4. **Performance**: Use CSS transforms for animations to ensure smooth 60fps
5. **Modularity**: Keep theme logic in shared files, widget logic in widget files
6. **Responsiveness**: Test on mobile, tablet, and desktop viewports

## File Structure

```
src/
├── widget_styles/
│   ├── theme.ts              # Theme colors and utilities
│   ├── common.css            # Shared CSS classes
│   └── widget_styles.md      # This documentation
├── barplot/
│   └── Dashboard.tsx         # Barplot widget
├── indexing_dashboard/
│   └── Dashboard.tsx         # Indexing widget
├── snifa_dashboard_faltas/
│   └── Dashboard.tsx         # SNIFA widget
└── widget_reclamacion_identifier/
    └── Dashboard.tsx         # Reclamacion widget
```

## Version History

- **v1.0.0** (2026-01-06): Initial unified design system
  - Standardized dark mode as default
  - Unified theme toggle position
  - Consistent expand button behavior
  - Shared color palette and component styles
