# Collectii Brand Guidelines

## Brand Identity

**Name**: Collectii  
**Tagline**: A Modern Productivity & Workforce Platform  
**Mission**: Empowering teams, communities, and organizations to get more done together.

---

## Typography

### Primary Font Family
**Lexend** (Google Fonts)

- **Headlines**: `font-family: 'Lexend', sans-serif`
- **Body Text**: `font-family: 'Lexend', sans-serif`

### Secondary Font Family
**Inter** (Google Fonts)

- **UI Elements**: `font-family: 'Inter', sans-serif`
- **Code/Monospace**: `font-family: monospace`

### Font Weights Available

### Font Weights Available
- 100 (Thin)
- 200 (Extra Light)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semi Bold)
- 700 (Bold)
- 800 (Extra Bold)
- 900 (Black)

### Usage in Tailwind
- **Body**: `font-body`
- **Headlines**: `font-headline`
- **Code**: `font-code`

---

## Color Palette

### Light Mode (Default)

#### Core Colors
- **Background**: `hsl(0 0% 100%)` - Pure white
- **Foreground**: `hsl(0 0% 3.9%)` - Near black text
- **Primary**: `hsl(232 100% 56%)` - Vibrant blue (#2E5CFF)
- **Primary Foreground**: `hsl(0 0% 100%)` - White text on primary

#### UI Elements
- **Card**: `hsl(0 0% 100%)` - White
- **Card Foreground**: `hsl(0 0% 3.9%)` - Dark text
- **Popover**: `hsl(0 0% 100%)` - White
- **Popover Foreground**: `hsl(0 0% 3.9%)` - Dark text

#### Secondary Colors
- **Secondary**: `hsl(0 0% 96.1%)` - Light gray
- **Secondary Foreground**: `hsl(0 0% 9%)` - Dark gray
- **Muted**: `hsl(0 0% 96.1%)` - Light gray
- **Muted Foreground**: `hsl(0 0% 45.1%)` - Medium gray
- **Accent**: `hsl(0 0% 96.1%)` - Light gray
- **Accent Foreground**: `hsl(0 0% 9%)` - Dark gray

#### Feedback Colors
- **Destructive**: `hsl(0 84.2% 60.2%)` - Red for errors/warnings
- **Destructive Foreground**: `hsl(0 0% 98%)` - Near white

#### Borders & Inputs
- **Border**: `hsl(0 0% 89.8%)` - Light gray
- **Input**: `hsl(0 0% 89.8%)` - Light gray
- **Ring**: `hsl(232 100% 56%)` - Primary blue (focus rings)

#### Chart Colors
- **Chart 1**: `hsl(12 76% 61%)` - Coral/Orange
- **Chart 2**: `hsl(173 58% 39%)` - Teal
- **Chart 3**: `hsl(197 37% 24%)` - Dark blue
- **Chart 4**: `hsl(43 74% 66%)` - Yellow
- **Chart 5**: `hsl(27 87% 67%)` - Orange

---

### Dark Mode

#### Core Colors
- **Background**: `hsl(0 0% 4%)` - Near black
- **Foreground**: `hsl(0 0% 98%)` - Near white text
- **Primary**: `hsl(232 100% 56%)` - Vibrant blue (same as light)
- **Primary Foreground**: `hsl(0 0% 100%)` - White text

#### UI Elements
- **Card**: `hsl(0 0% 8%)` - Very dark gray
- **Card Foreground**: `hsl(0 0% 98%)` - Light text
- **Popover**: `hsl(0 0% 4%)` - Near black
- **Popover Foreground**: `hsl(0 0% 98%)` - Light text

#### Secondary Colors
- **Secondary**: `hsl(0 0% 12%)` - Dark gray
- **Secondary Foreground**: `hsl(0 0% 98%)` - Light text
- **Muted**: `hsl(0 0% 12%)` - Dark gray
- **Muted Foreground**: `hsl(0 0% 64%)` - Medium gray
- **Accent**: `hsl(0 0% 12%)` - Dark gray
- **Accent Foreground**: `hsl(0 0% 98%)` - Light text

#### Feedback Colors
- **Destructive**: `hsl(0 63% 31%)` - Dark red
- **Destructive Foreground**: `hsl(0 0% 98%)` - Light text

#### Borders & Inputs
- **Border**: `hsl(0 0% 12%)` - Dark gray
- **Input**: `hsl(0 0% 12%)` - Dark gray
- **Ring**: `hsl(232 100% 56%)` - Primary blue

#### Chart Colors (Dark Mode)
- **Chart 1**: `hsl(220 70% 50%)` - Blue
- **Chart 2**: `hsl(160 60% 45%)` - Teal/Green
- **Chart 3**: `hsl(30 80% 55%)` - Orange
- **Chart 4**: `hsl(280 65% 60%)` - Purple
- **Chart 5**: `hsl(340 75% 55%)` - Pink/Red

---

## Design Tokens

### Border Radius
- **Large**: `0.5rem` (8px)
- **Medium**: `calc(0.5rem - 2px)` (6px)
- **Small**: `calc(0.5rem - 4px)` (4px)

Usage: `rounded-lg`, `rounded-md`, `rounded-sm`

### Spacing
Uses Tailwind's default spacing scale (4px increments)

### Container
- **Max Width**: `1400px` (2xl breakpoint)
- **Padding**: `2rem` (32px)
- **Centered**: Yes

---

## Animations

### Float Animations
Custom keyframe animations for subtle motion effects:

#### Float Slow
- **Duration**: 8 seconds
- **Class**: `animate-float-slow`
- **Effect**: Gentle vertical movement (-20px) with 5deg rotation

#### Float Slower
- **Duration**: 12 seconds
- **Class**: `animate-float-slower`
- **Effect**: Slower vertical movement (-25px) with -8deg rotation

#### Float Fast
- **Duration**: 6 seconds
- **Class**: `animate-float-fast`
- **Effect**: Quicker vertical movement (-15px) with -3deg rotation

### Accordion Animations
- **Accordion Down**: 0.2s ease-out expansion
- **Accordion Up**: 0.2s ease-out collapse

---

## Theme Settings

### Default Theme
- **Light/Dark**: Dark mode by default
- **System Detection**: Enabled
- **Theme Provider**: Custom React context with `ThemeProvider`
- **Class-based**: Uses `.dark` class for dark mode styling

---

## Brand Elements

### Logo Format
- **Text**: "Collectii**.**" (with period in primary color)
- **Icon**: Package2 icon from Lucide React
- **Color**: Primary blue (`text-primary`)

### Typography Styling
- **Antialiasing**: Enabled (`antialiased`)
- **Base Font Size**: Browser default (16px)
- **Line Height**: Default Tailwind scale

---

## Usage Guidelines

### Color Usage
1. **Primary Blue**: Use for CTAs, links, focus states, and brand accents
2. **Muted**: Use for less prominent UI elements and backgrounds
3. **Destructive**: Reserve for error states and destructive actions only
4. **Charts**: Use the chart color palette for data visualization

### Typography Hierarchy
1. **Headlines**: Use `font-headline` with appropriate weight (600-800)
2. **Body**: Use `font-body` with regular weight (400-500)
3. **Emphasis**: Use semi-bold (600) or bold (700)

### Accessibility
- Maintain WCAG AA contrast ratios minimum
- Use semantic HTML
- Ensure focus indicators are visible (ring colors)
- Support system dark mode preferences
