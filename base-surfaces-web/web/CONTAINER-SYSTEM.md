# Container System Architecture

## Philosophy

**Separation of Concerns:**
- **Breakpoints** manage global shell (navigation, top bar, chrome)
- **Containers** manage content width, margins, and internal spacing
- **Content** is agnostic to viewport size, responds only to container

## Container Variants

### Standard (Default)
- **Max-width:** 1160px
- **Use case:** Main page content, most surfaces
- **Examples:** Home, Cards, Transactions, Payments, Recipients

### Narrow
- **Max-width:** 840px
- **Use case:** Focused content, reading experiences
- **Examples:** Account settings pages, form-heavy flows

### Compact
- **Max-width:** 600px
- **Use case:** Single-purpose interfaces, mobile-first content
- **Examples:** Flow overlays (Send, Add, Convert)

### Fluid
- **Max-width:** 100%
- **Use case:** Full-width experiences, data visualizations
- **Examples:** Insights charts, wide tables

## Responsive Margins (Internal to Container)

Margins are nested **inside** the container, ensuring grid alignment:

| Breakpoint | Margin | Container Effective Width |
|------------|--------|---------------------------|
| XL (≥1160px) | 40px | max-width - 80px |
| LG (840-1159px) | 32px | max-width - 64px |
| MD (600-839px) | 24px | max-width - 48px |
| SM (<600px) | 16px | 100% - 32px |

## HTML Structure

```html
<!-- Page Shell (managed by breakpoints) -->
<div class="page-layout">
  <div class="column-layout">
    <div class="column-layout-left"><!-- Side nav --></div>
    <div class="column-layout-main">
      <TopBar />
      <main class="container-content">

        <!-- Container (manages content width & margins) -->
        <div class="container container--standard">
          <!-- Content (agnostic to viewport) -->
          <section class="section">...</section>
          <section class="section">...</section>
        </div>

      </main>
    </div>
  </div>
</div>
```

## CSS Architecture

```css
/* Container base */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-margin);
  padding-right: var(--container-margin);
}

/* Variants */
.container--standard { max-width: 1160px; }
.container--narrow { max-width: 840px; }
.container--compact { max-width: 600px; }
.container--fluid { max-width: none; }

/* Responsive margins (CSS custom properties) */
:root {
  --container-margin: 16px; /* SM default */
}

@media (min-width: 600px) {
  :root { --container-margin: 24px; } /* MD */
}

@media (min-width: 840px) {
  :root { --container-margin: 32px; } /* LG */
}

@media (min-width: 1160px) {
  :root { --container-margin: 40px; } /* XL */
}
```

## Migration Path to Container Queries

When browser support allows:

```css
/* Phase 2: Replace breakpoint-based margins with container queries */
.container {
  container-type: inline-size;
  container-name: main-container;
}

@container main-container (min-width: 600px) {
  .container { padding-left: 24px; padding-right: 24px; }
}

@container main-container (min-width: 840px) {
  .container { padding-left: 32px; padding-right: 32px; }
}

@container main-container (min-width: 1160px) {
  .container { padding-left: 40px; padding-right: 40px; }
}
```

## Component Patterns

### Standard Page
```tsx
<main className="container-content">
  <div className="container container--standard">
    <TotalBalanceHeader />
    <ActionButtonRow />
    <Carousel>...</Carousel>
  </div>
</main>
```

### Flow Overlay
```tsx
<div className="flow-overlay">
  <FlowNavigation />
  <div className="container container--compact">
    <ExpressiveMoneyInput />
    <Button>Continue</Button>
  </div>
</div>
```

### Full-Width Section with Constrained Content
```tsx
<section className="section section--full-bleed">
  <div className="container container--standard">
    <h2>Section Title</h2>
    <p>Constrained content</p>
  </div>
</section>
```

## Benefits

1. **Decoupled Logic:** Content doesn't know about breakpoints
2. **Reusable Components:** Same component works in any container
3. **Future-Proof:** Easy migration to container queries
4. **Consistent Spacing:** Grid alignment guaranteed
5. **Simpler Testing:** Test containers independently of viewport

## Shell vs Container Responsibilities

| Concern | Managed By | Examples |
|---------|------------|----------|
| Navigation visibility | Shell (breakpoints) | Side nav, hamburger, bottom tabs |
| Top bar height | Shell (breakpoints) | 136px → 88px |
| Chrome spacing | Shell (breakpoints) | Nav width, top bar padding |
| **Content width** | **Container** | **Max-width variants** |
| **Content margins** | **Container** | **Responsive padding** |
| **Internal layout** | **Content** | **Component composition** |

## Current State (Before Refactor)

`.column-layout-main` currently manages both:
- ❌ Shell margin (0 92px on XL)
- ❌ Content padding (0 44px)

This couples shell and content logic.

## Target State (After Refactor)

`.column-layout-main` manages only shell:
- ✅ No margins/padding (100% width)

`.container` manages content:
- ✅ Max-width
- ✅ Responsive margins
- ✅ Centering

Content is fully decoupled from shell breakpoints.
