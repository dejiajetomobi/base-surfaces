# Breakpoint Migration Summary

## Changes Applied (2026-03-06)

### Old System → New System

| Old Name | Old Range | New Name | New Range | Change |
|----------|-----------|----------|-----------|--------|
| Desktop | ≥1024px | **XL** | ≥1160px | Threshold increased by 136px |
| - | - | **LG** | 840-1159px | NEW breakpoint |
| Tablet | 768-1023px | **MD** | 600-839px | Range shifted down 168px |
| Mobile | <768px | **SM** | <600px | Threshold decreased by 168px |

### Key Behavioral Changes

#### XL (Extra Large) ≥1160px
- **Navigation:** Side nav visible (280px width)
- **Content:** Two-column layouts on CurrentAccount and CurrencyPage
- **Layout:** Full desktop experience

#### LG (Large) 840-1159px **[NEW]**
- **Navigation:** Hamburger menu (side nav hidden)
- **Content:** Two-column layouts PRESERVED (same as XL)
- **Layout:** Desktop content with mobile navigation pattern
- **Padding:** 44px horizontal (same as XL)

#### MD (Medium) 600-839px
- **Navigation:** Hamburger menu
- **Content:** Single column, segmented control tabs
- **Layout:** Tablet experience
- **Padding:** 24px horizontal (tighter than LG)

#### SM (Small) <600px
- **Navigation:** Bottom tab bar (MobileNav)
- **Content:** Single column, compact
- **Layout:** Mobile experience
- **Padding:** 16px horizontal

### Files Modified

1. **`web/src/styles.css`**
   - Updated all `@media` queries (38 instances)
   - Added LG-specific rules at line 1930
   - Updated responsive section comments

2. **`web/src/components/PrototypeSettings.tsx`**
   - Updated documentation at lines 77, 643-647
   - Updated prompt instructions for designers

3. **`CLAUDE.md`**
   - Updated "Responsive Breakpoints" section (lines 70-85)
   - Added LG tier documentation

4. **`web/BREAKPOINTS.md`** (new)
   - Comprehensive breakpoint specification
   - Implementation patterns
   - Migration notes

### Testing Checklist

- [ ] XL (≥1160px): Side nav visible, two-column layouts work
- [ ] LG (840-1159px): Hamburger shows, two-column layouts work, no side nav
- [ ] MD (600-839px): Hamburger shows, single column, segmented controls
- [ ] SM (<600px): Bottom tab bar shows, compact mobile layout
- [ ] Resize window across all breakpoints smoothly
- [ ] All flow pages work at all breakpoints (responsive body column)
- [ ] Account page responsive behavior correct
- [ ] CurrencyPage desktop/mobile toggle correct

### Backup

Original file backed up to:
`web/src/styles.css.backup`

### Rollback Command

```bash
cd /Users/heeran.master/Documents/GitHub/web-layouts/web
mv src/styles.css.backup src/styles.css
git restore src/components/PrototypeSettings.tsx ../CLAUDE.md
rm BREAKPOINTS.md BREAKPOINT-MIGRATION.md
```

## Notes

- The 700px breakpoint remains for specific component needs (not a primary tier)
- The 480px breakpoint remains for very small mobile devices
- Neptune DS Logo uses 576px internally (unchanged, DS-controlled)
- All custom breakpoints now align with the 4-tier system
