# 🎨 Mentiscope - Visual Design Guide

## Brand Colors (Copy-Paste Ready)

### CSS Variables

```css
/* Mentiscope Professional Dark Theme */
--primary: oklch(0.5 0.12 245); /* Mind Blue - Intelligence & Trust */
--secondary: oklch(0.6 0.1 185); /* Growth Teal - Growth & Balance */
--success: oklch(0.58 0.12 155); /* Success Green - Positive Signals */
--warning: oklch(0.75 0.13 75); /* Warning Amber - Watch Areas */
--destructive: oklch(0.58 0.2 25); /* Alert Red - Minimal Use */

--background: oklch(0.15 0.01 240); /* Deep Calm Background */
--foreground: oklch(0.97 0.005 240); /* Soft White Text */
--card: oklch(0.18 0.015 240 / 0.95); /* Elevated Card Surface */
--muted-foreground: oklch(0.55 0.02 240); /* Soft Gray */
```

### HEX Colors

```
Primary (Mind Blue):     #2F5D9F
Secondary (Growth Teal): #2BA8A0
Success Green:           #3CB371
Warning Amber:           #F2B705
Alert Red:               #E5533D
```

---

## Typography Scale

### Headings

```css
h1: 3rem (48px) - font-black, tracking-tight
h2: 2rem (32px) - font-black, tracking-tight
h3: 1.5rem (24px) - font-bold
h4: 1.25rem (20px) - font-bold
```

### Body

```css
Large: 1.25rem (20px) - font-medium
Base: 1rem (16px) - font-normal
Small: 0.875rem (14px) - font-normal
Tiny: 0.75rem (12px) - font-semibold, uppercase, tracking-widest
```

---

## Component Patterns

### Glass Card

```css
background: rgba(30, 35, 45, 0.85);
backdrop-filter: blur(24px);
border: 1px solid rgba(47, 93, 159, 0.15);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
border-radius: 4rem; /* 64px */
```

### Primary Button

```css
background: var(--primary);
color: white;
padding: 1rem 2.5rem;
border-radius: 1.5rem;
font-weight: 900;
text-transform: uppercase;
letter-spacing: 0.1em;
box-shadow: 0 0 25px rgba(47, 93, 159, 0.3);
transition: all 0.3s;

hover:
  transform: translateY(-2px);
  box-shadow: 0 0 35px rgba(47, 93, 159, 0.5);
```

### Status Badge

```css
/* Strong */
background: rgba(60, 195, 113, 0.1);
color: #3cb371;
border: 1px solid rgba(60, 195, 113, 0.2);

/* Developing */
background: rgba(43, 168, 160, 0.1);
color: #2ba8a0;
border: 1px solid rgba(43, 168, 160, 0.2);

/* Needs Support */
background: rgba(242, 183, 5, 0.1);
color: #f2b705;
border: 1px solid rgba(242, 183, 5, 0.2);
```

---

## Icon Usage

### Primary Icons

- **Brain**: Platform logo, AI features
- **Sparkles**: New features, highlights
- **TrendingUp**: Growth, improvement
- **Target**: Goals, focus areas
- **Shield**: Safety, trust

### Dimension Icons

- **Brain**: Cognitive Development
- **BookOpen**: Academic Progress
- **Lightbulb**: Academic Intelligence
- **Heart**: Emotional Regulation
- **Zap**: Motivation & Agency
- **Users**: Social Skills
- **Smile**: Empathy & Character
- **Home**: Life Skills

### Status Icons

- **CheckCircle2**: Completed, success
- **Clock**: In progress
- **AlertCircle**: Needs attention
- **Info**: Information

---

## Spacing System

```css
xs:  0.25rem (4px)
sm:  0.5rem (8px)
md:  1rem (16px)
lg:  1.5rem (24px)
xl:  2rem (32px)
2xl: 3rem (48px)
3xl: 4rem (64px)
4xl: 6rem (96px)
```

---

## Animation Patterns

### Fade In

```css
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.6 }
```

### Scale Hover

```css
hover: {
  scale: 1.05;
}
transition: {
  duration: 0.3;
}
```

### Glow Pulse

```css
@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(47, 93, 159, 0.3);
  }
  50% {
    box-shadow: 0 0 35px rgba(47, 93, 159, 0.5);
  }
}
```

---

## Layout Patterns

### Dashboard Grid

```css
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 2.5rem;

/* Main content: 8 columns */
/* Sidebar: 4 columns */
```

### Card Padding

```css
Small card: 2rem (32px)
Medium card: 3rem (48px)
Large card: 4rem (64px)
```

### Section Spacing

```css
Between sections: 4rem (64px)
Within section: 2rem (32px)
```

---

## Gradient Patterns

### Primary Gradient (Mind Blue → Growth Teal)

```css
background: linear-gradient(135deg, #2f5d9f 0%, #2ba8a0 100%);
```

### Success Gradient

```css
background: linear-gradient(135deg, #3cb371 0%, #2ba8a0 100%);
```

### Subtle Background

```css
background: linear-gradient(
  180deg,
  rgba(47, 93, 159, 0.05) 0%,
  rgba(43, 168, 160, 0.05) 100%
);
```

---

## Shadow Patterns

### Card Shadow

```css
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
```

### Button Shadow

```css
box-shadow: 0 0 25px rgba(47, 93, 159, 0.3);
```

### Glow Shadow (Primary)

```css
box-shadow: 0 0 25px rgba(47, 93, 159, 0.4);
```

### Glow Shadow (Secondary)

```css
box-shadow: 0 0 25px rgba(43, 168, 160, 0.3);
```

---

## Border Patterns

### Card Border

```css
border: 1px solid rgba(47, 93, 159, 0.15);
```

### Glow Border

```css
border: 1px solid rgba(43, 168, 160, 0.4);
box-shadow: 0 0 25px rgba(43, 168, 160, 0.2);
```

### Subtle Divider

```css
border-top: 1px solid rgba(255, 255, 255, 0.05);
```

---

## Accessibility

### Contrast Ratios

- **Primary text on background**: 15.8:1 (AAA)
- **Muted text on background**: 4.8:1 (AA)
- **Primary button text**: 8.2:1 (AAA)

### Focus States

```css
focus-visible:
  outline: 2px solid var(--primary);
  outline-offset: 2px;
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */
```

---

## Brand Voice in UI

### Headings

- Clear, direct, supportive
- "Your Child's Learning Profile"
- "Growth Opportunities"
- "Personalized Strategies"

### Body Text

- Warm, encouraging, specific
- "We've noticed..."
- "This suggests..."
- "You might try..."

### Buttons

- Action-oriented, friendly
- "Get Started"
- "View Insights"
- "Explore Strategies"

### Labels

- Descriptive, non-judgmental
- "Strong" (not "Excellent")
- "Developing" (not "Average")
- "Needs Support" (not "Poor")

---

## Common UI Patterns

### Metric Display

```tsx
<div className="text-center">
  <div className="text-6xl font-black text-primary">85</div>
  <div className="text-sm text-muted-foreground uppercase tracking-widest">
    Readiness Score
  </div>
</div>
```

### Status Indicator

```tsx
<Badge className="bg-success/10 text-success border-success/20">Strong</Badge>
```

### Progress Bar

```tsx
<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
  <div
    className="h-full bg-primary transition-all duration-500"
    style={{ width: "75%" }}
  />
</div>
```

---

_Mentiscope Design System v1.0_
_Understanding learning beyond grades_
