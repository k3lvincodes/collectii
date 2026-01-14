# User Interface Design Documentation

> **Design Pattern**: "Soft Modernism" / "Bento UI"
> **Reference**: `uploaded_image_1766008711598.png`

## 1. Core Philosophy
The design is a friendly, high-end dashboard characterized by **extreme roundness**, **soft pastels mixed with high-contrast black**, and a **floating bento-grid layout**. It avoids harsh lines and standard administrative gray-scales in favor of a "lifestyle app" feel.

## 2. Navigation & Header (Critical)
The reference image demonstrates a **Horizontal Top Navigation**, not a traditional vertical sidebar. However, if a sidebar is required, it must follow the "Floating Pill" aesthetic.

### Top Navbar Pattern
-   **Container**: Transparent or blending with the background. No visible box or heavy bottom border.
-   **Items**: "Pills" floating in space.
    -   **Active State**:
        -   Background: **Black** (`#111827`)
        -   Text: **White** (`#FFFFFF`)
        -   Shape: Fully Rounded (`rounded-full`)
        -   Padding: Generous (`px-6 py-2.5`)
    -   **Inactive State**:
        -   Background: Transparent
        -   Text: **Slate Gray** (`#6B7280`)
        -   Hover: Subtle gray background (`bg-gray-100/50`) or text darkening.

### Icon Actions (Top Right)
-   **Search, Bell, Theme, Profile**: All circular buttons (`rounded-full`).
-   **Style**: White background with soft shadow (`shadow-sm`) or transparent with hover state.

## 3. Color System

### Base Colors
-   **Page Background**: `#F3F4F6` (Cool Light Gray) - Creates contrast for white cards.
-   **Card Background**: `#FFFFFF` (White)
-   **Text Primary**: `#111827` (Rich Black)
-   **Text Secondary**: `#6B7280` (Cool Gray)

### Accent Palette (The "Vibe")
-   **Brand Black**: `#000000` (Used for primary calls to actions, active states).
-   **Soft Purple**: `#C4B5FD` (Violet-300) - Used for "Speed & Power" tags/widgets.
-   **Soft Yellow**: `#FDE68A` (Amber-200) - Used for "Pace Training" tags.
-   **Soft Blue**: `#BAE6FD` (Sky-200) - Used for other metrics.
-   **Chart Color**: Black bars or thick wavy colored lines (Yellow/Blue).

## 4. Typography
*Font: Sans-serif (likely Plus Jakarta Sans, Outfit, or Montserrat).*

-   **H1 / Page Title**:
    -   Size: `3rem` (48px)
    -   Weight: `Medium` to `SemiBold`
    -   Tracking: Tighter (`-0.02em`)
    -   Example: "Revamp Your Routine"
-   **Section Headers**:
    -   Size: `1.25rem` (20px)
    -   Weight: `SemiBold`
    -   Example: "Workout Schedule"
-   **Big Metrics**:
    -   Size: `3.5rem` (56px)
    -   Weight: `Bold`
    -   Example: "14.5"

## 5. Component Shapes & Effects

### Bento Cards
-   **Radius**: `rounded-[32px]` (Very rounded).
-   **Shadow**: Ultra-soft, large blur, low opacity. `box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);`
-   **Border**: None (rely on shadow and contrast).

### Buttons
-   **Primary**: Black background, White text, `rounded-full`.
    -   *Icon*: Often a simple `+` or arrow.
-   **Secondary/Tag**:
    -   Background: Pastel colors (Purple/Yellow/Blue).
    -   Text: Dark Variant of that color.
    -   Shape: `rounded-full` or `rounded-[20px]`.

### Visual Details ("The Polish")
-   **Avatars**: Often grouped (overlap), surrounded by white border.
-   **Toggles**: Large, friendly switches.
-   **Tags**: "Premium member" -> Pill shape, gradient text or soft background.

## 6. Layout Rules
-   **Padding**: Cards have internal padding of `p-6` or `p-8`.
-   **Gap**: Grid gap is substantial (`gap-6` or `gap-8`), allowing the gray background to show through as "breathing room".

## 7. CSS/Tailwind Reference

```css
.bento-card {
  @apply bg-white rounded-[32px] shadow-sm p-6;
}

.nav-pill-active {
  @apply bg-gray-900 text-white rounded-full px-6 py-2.5 font-medium transition-all;
}

.nav-pill-inactive {
  @apply text-gray-500 hover:text-gray-900 px-6 py-2.5 font-medium transition-all;
}

.title-display {
  @apply text-4xl font-semibold tracking-tight text-gray-900;
}
```
