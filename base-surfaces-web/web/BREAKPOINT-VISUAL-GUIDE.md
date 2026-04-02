# Breakpoint Visual Guide

## Layout Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│  XL: ≥1160px                                                     │
│  ┌───────┬─────────────────────────────────────────────────┐    │
│  │ Side  │ [Logo] [Avatar] [Earn]                          │    │
│  │ Nav   │                                                  │    │
│  │       │ Main Content Area (two-column where applicable) │    │
│  │ 280px │                                                  │    │
│  └───────┴─────────────────────────────────────────────────┘    │
│  Margin: 0 92px | Padding: 0 44px                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LG: 840-1159px                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [☰] [Logo] [Avatar] [Earn]                              │    │
│  │                                                          │    │
│  │ Main Content Area (two-column preserved from XL)        │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Margin: 0 | Padding: 0 44px (SAME content width as XL)         │
│  Hamburger menu opens side nav overlay                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MD: 600-839px                                                   │
│  ┌───────────────────────────────────────────────────────┐      │
│  │ [☰] [Logo] [Avatar] [Earn]                            │      │
│  │                                                        │      │
│  │ Main Content (single column)                          │      │
│  │ [Tab 1] [Tab 2] [Tab 3] ← Segmented control           │      │
│  │                                                        │      │
│  └───────────────────────────────────────────────────────┘      │
│  Margin: 0 | Padding: 0 24px (tighter than LG)                  │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│  SM: <600px                          │
│  ┌────────────────────────────────┐  │
│  │ [Logo] [Avatar] [Earn]         │  │
│  │                                │  │
│  │ Compact Content                │  │
│  │                                │  │
│  │ [Home][Cards][Pay][More][Acct] │  │
│  └────────────────────────────────┘  │
│  Padding: 0 16px                     │
│  Bottom tab bar (68px + safe area)  │
└──────────────────────────────────────┘
```

## Navigation Patterns

| Breakpoint | Primary Nav | Secondary Access | Top Bar Height |
|------------|-------------|------------------|----------------|
| **XL** | Side nav (visible) | - | 136px |
| **LG** | Hamburger menu | Side nav overlay | 136px |
| **MD** | Hamburger menu | Side nav overlay | 136px |
| **SM** | Bottom tab bar | - | 88px |

## Component-Specific Behavior

### CurrentAccount / CurrencyPage

| Breakpoint | Layout | Sidebar Content |
|------------|--------|-----------------|
| **XL** | Two-column (60/40) | Visible in right column |
| **LG** | Two-column (60/40) | Visible in right column |
| **MD** | Single column | Segmented control tabs |
| **SM** | Single column | Segmented control tabs |

### Flow Pages (Add, Send, Convert, Request)

| Breakpoint | Body Width | Body Padding |
|------------|------------|--------------|
| **XL** | 522px max | 112px 0 64px |
| **LG** | 522px max | 112px 0 64px |
| **MD** | 522px max | 112px 0 64px |
| **SM** | 100% | 72px 16px 48px |

**SM Threshold:** <600px (formerly 554px)

## Testing URLs

Test at these exact pixel widths:

- **1160px** - XL/LG boundary (side nav should appear)
- **1159px** - LG (hamburger, two columns)
- **840px** - LG/MD boundary (content should stack to single column)
- **839px** - MD (single column, tighter padding)
- **600px** - MD/SM boundary (bottom tab bar should appear)
- **599px** - SM (compact mobile layout)

## Browser DevTools Setup

```javascript
// Chrome DevTools Console - Quick resize commands
window.resizeTo(1160, 900); // XL
window.resizeTo(1000, 900); // LG
window.resizeTo(720, 900);  // MD
window.resizeTo(400, 900);  // SM
```

Or use responsive mode:
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
3. Set custom dimensions: 1160, 1000, 720, 400

## Expected Visual Changes

### At 1159px → 1160px (entering XL)
- ✅ Side nav slides in from left
- ✅ Content shifts right
- ✅ Hamburger disappears
- ✅ Content width adjusts

### At 840px → 839px (entering MD)
- ✅ Two-column layouts stack to single column
- ✅ Sidebar content moves to segmented control tabs
- ✅ Horizontal padding reduces (44px → 24px)
- ✅ Content reflows

### At 600px → 599px (entering SM)
- ✅ Bottom tab bar appears
- ✅ Hamburger disappears
- ✅ Top bar shrinks (136px → 88px)
- ✅ Horizontal padding reduces (24px → 16px)
- ✅ Account switcher condenses to avatar only
