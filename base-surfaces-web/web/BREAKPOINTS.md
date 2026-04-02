# Breakpoint System

## Current Specification (2026-03-06)

| Name | Range | Notes |
|------|-------|-------|
| **XL (Extra Large)** | ≥ 1160px | Full desktop layout with side navigation visible |
| **LG (Large)** | 840px – 1159px | Desktop content layout + hamburger menu navigation |
| **MD (Medium)** | 600px – 839px | Tablet layout, single column, segmented controls |
| **SM (Small)** | < 600px | Mobile layout, bottom tab bar, compact spacing |

## Implementation

### CSS Media Queries

```css
/* SM: Mobile */
@media (max-width: 599px) { }

/* MD: Tablet */
@media (min-width: 600px) { }
@media (min-width: 600px) and (max-width: 839px) { }

/* LG: Large (XL content, MD nav) */
@media (min-width: 840px) and (max-width: 1159px) { }

/* XL: Desktop */
@media (min-width: 1160px) { }

/* Hide below breakpoint */
@media (max-width: 839px) { /* Hide above MD */ }
@media (max-width: 1159px) { /* Hide above LG */ }
```

## Key Layout Behaviors

### Side Navigation
- **XL (≥1160px):** Visible, 280px width
- **LG (840-1159px):** Hidden, hamburger menu
- **MD (600-839px):** Hidden, hamburger menu
- **SM (<600px):** Hidden, bottom tab bar

### Content Layout
- **XL:** Two-column where applicable (CurrentAccount, CurrencyPage)
- **LG:** Two-column (same as XL)
- **MD:** Single column, segmented control tabs
- **SM:** Single column, compact spacing

### Navigation Pattern
- **XL:** Side nav
- **LG:** Hamburger menu (same as MD)
- **MD:** Hamburger menu
- **SM:** Bottom tab bar (MobileNav)

## Migration Notes

### Old → New Mapping

| Old | Old Range | New | New Range |
|-----|-----------|-----|-----------|
| Desktop | ≥1024px | XL | ≥1160px |
| - | - | LG | 840-1159px |
| Tablet | 768-1023px | MD | 600-839px |
| Mobile | <768px | SM | <600px |

### Critical Changes

1. **Side nav threshold:** 1024px → 1160px
2. **New LG breakpoint:** 840-1159px maintains XL content layout but uses hamburger
3. **Tablet threshold:** 768px → 600px
4. **Mobile threshold:** 768px → 600px
5. **Flow body responsive:** 554px → 600px (align with SM breakpoint)
