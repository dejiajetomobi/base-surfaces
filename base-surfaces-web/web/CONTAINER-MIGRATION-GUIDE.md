# Container Migration Guide

## Pattern: Wrapping Page Content

### Before (Direct in container-content)
```tsx
<main className="container-content" id="main">
  <Home ... />
</main>
```

### After (Wrapped in container)
```tsx
<main className="container-content" id="main">
  <div className="container container--standard">
    <Home ... />
  </div>
</main>
```

## Container Variant Selection

### Standard (1160px) - Default for most pages
- **Home** - Main launchpad with cards, tasks, transactions
- **Cards** - Card management
- **Transactions** - Transaction list
- **Payments** - Payment methods
- **Recipients** - Recipient list
- **Insights** - Analytics dashboard
- **Team** - Team management

### Narrow (840px) - Focused content
- **Account** (Profile settings) - Form-heavy, reading-focused
- **CurrentAccount** - Account details (could be standard, TBD)
- **CurrencyPage** - Currency details (could be standard, TBD)

### Compact (600px) - Flows and single-purpose
- **SendFlow** - Money transfer flow
- **AddMoneyFlow** - Add money flow
- **ConvertFlow** - Currency conversion
- **RequestFlow** - Money request
- **PaymentLinkFlow** - Payment link creation

### Fluid (100%) - Full-width when needed
- Currently none, but available for data visualizations or wide tables

## Component Updates Needed

### 1. App.tsx (renderContent)
Wrap page components in container:

```tsx
// Before
<Home onNavigate={...} />

// After
<div className="container container--standard">
  <Home onNavigate={...} />
</div>
```

### 2. Flow Components
Already use compact layout via body structure, update to container:

```tsx
// Before
<div className="add-money-flow__body">

// After
<div className="container container--compact">
```

### 3. Individual Page Components
Pages can assume they're in a container, no wrapper needed internally.
All sections/content flows naturally within container margins.

## CSS Updates

### Remove from Pages
- ❌ Direct padding/margin
- ❌ Max-width constraints
- ❌ Breakpoint-based width adjustments

### Keep in Pages
- ✅ Internal spacing (gaps, section padding)
- ✅ Component-specific layout
- ✅ Content-responsive behavior

## Flow Pages Special Handling

Flows currently have their own body structure:

```css
/* Before */
.add-money-flow__body {
  max-width: 522px;
  width: 100%;
  margin: 0 auto;
  padding: 112px 0 64px;
  flex: 1;
}

@media (max-width: 599px) {
  .add-money-flow__body {
    max-width: none;
    padding: 72px 16px 48px;
  }
}
```

**Strategy:** Keep flow body classes for vertical padding, replace width/margin logic with container:

```css
/* After */
.add-money-flow__body {
  padding-top: 112px;
  padding-bottom: 64px;
  flex: 1;
}

@media (max-width: 599px) {
  .add-money-flow__body {
    padding: 72px 0 48px;
  }
}

/* Container handles width + horizontal margins */
```

## Testing Checklist

After migration, verify:

- [ ] XL (1160px+): Content centered, 40px margins
- [ ] LG (840-1159px): Content centered, 32px margins
- [ ] MD (600-839px): Content centered, 24px margins
- [ ] SM (<600px): Content full-width, 16px margins
- [ ] Content never touches viewport edges
- [ ] Container variants apply correct max-widths
- [ ] Flows work at all breakpoints
- [ ] No horizontal scroll at any size

## Migration Order

1. ✅ CSS: Add container system
2. ✅ CSS: Remove old shell padding/margin
3. ⏳ App.tsx: Wrap renderContent pages
4. ⏳ Flows: Update body structure to use containers
5. ⏳ Test all pages at all breakpoints
6. ⏳ Clean up unused CSS rules
7. ⏳ Document patterns in design-system/

## Rollback

If issues arise:
```bash
git checkout web/src/styles.css
```

Container classes can be safely removed from JSX without breaking (content will just be full-width).
