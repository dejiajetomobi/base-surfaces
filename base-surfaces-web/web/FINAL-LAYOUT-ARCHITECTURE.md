# Final Layout Architecture: Container-Driven System

## Core Principle
**No hardcoded shell constraints.** All width management is delegated to the container system. The shell provides structure; containers provide constraints.

---

## Layout Hierarchy

### 1. Shell (No Width Constraints)
```css
.page-layout {
  width: 100%;                    /* Full viewport */
}

.column-layout {
  display: flex;
  width: 100%;                    /* Full viewport */
}

.column-layout-left {
  width: 280px;                   /* Fixed: pinned left */
  flex-shrink: 0;
}

.column-layout-main {
  flex: 1;                        /* Fills remaining space */
  min-width: 0;
  /* ❌ NO max-width */
  /* ❌ NO margin: 0 auto */
  /* Containers handle their own centering */
}
```

**Key Changes:**
- ✅ Removed `max-width: 1440px` from `.column-layout-main`
- ✅ Removed `margin: 0 auto` from `.column-layout-main`
- ✅ Shell now has **zero width constraints**

---

## 2. Container System (Manages All Width Logic)

### Base Container
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;          /* ✅ Centering logic */
  padding-left: var(--container-margin);
  padding-right: var(--container-margin);
}
```

**Behavior:**
- `width: 100%`: Takes full width of parent
- `margin: auto`: Centers when max-width is set
- `padding`: Responsive margins (40/32/24/16px)

### Container Variants

#### Fluid (Full-Width)
```css
.container--fluid {
  max-width: none;
}
```
- **Used by**: TopBar, page headers
- **Width**: 100% of `.column-layout-main` minus margins
- **Centered**: N/A (spans full width)
- **Example**: On 1920px viewport with 280px nav = 1640px - 80px margins = 1560px content width

#### Standard (Constrained)
```css
.container--standard {
  max-width: 1160px;
}
```
- **Used by**: Page content
- **Width**: Max 1160px (plus margins)
- **Centered**: Yes (via `margin: auto` from base)
- **Example**: On 1920px viewport = 1160px centered in 1640px space

#### Narrow (Focused Content)
```css
.container--narrow {
  max-width: 840px;
}
```
- **Future use**: Reading-focused pages
- **Centered**: Yes

#### Compact (Flows)
```css
.container--compact {
  max-width: 600px;
}
```
- **Used by**: Flow overlays (Send, Add, Convert)
- **Centered**: Yes

---

## Visual Structure

### Desktop (XL: ≥1160px)
```
┌──────────────────────────────────────────────────────────────┐
│ Viewport (e.g., 1920px)                                      │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ .page-layout (100%)                                    │   │
│ │ ┌──────────────────────────────────────────────────┐   │   │
│ │ │ .column-layout (flex)                            │   │   │
│ │ │ ┌──────┬───────────────────────────────────────┐ │   │   │
│ │ │ │ Nav  │ .column-layout-main (fills remaining) │ │   │   │
│ │ │ │ 280px│ ┌───────────────────────────────────┐ │ │   │   │
│ │ │ │      │ │ .container--fluid (1640px - 80px) │ │ │   │   │
│ │ │ │      │ │ = 1560px                          │ │ │   │   │
│ │ │ │      │ │ [TopBar spans full width]         │ │ │   │   │
│ │ │ │      │ └───────────────────────────────────┘ │ │   │   │
│ │ │ │      │        ┌─────────────────────┐        │ │   │   │
│ │ │ │      │        │ .container--standard│        │ │   │   │
│ │ │ │      │        │ (1160px max)        │        │ │   │   │
│ │ │ │      │        │ [Centered content]  │        │ │   │   │
│ │ │ │      │        └─────────────────────┘        │ │   │   │
│ │ │ └──────┴───────────────────────────────────────┘ │   │   │
│ │ └──────────────────────────────────────────────────┘   │   │
│ └────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Tablet/Mobile (MD/SM)
```
┌──────────────────────────────────────┐
│ [☰] .container--fluid (full width)   │
│     [TopBar]                         │
│                                      │
│     ┌──────────────────────┐         │
│     │ .container--standard │         │
│     │ (centered)           │         │
│     └──────────────────────┘         │
└──────────────────────────────────────┘
```

---

## Behavior by Viewport Size

### Wide Viewport (>1720px)
**Example: 1920px viewport**

| Element | Width | Position |
|---------|-------|----------|
| Viewport | 1920px | - |
| Side nav | 280px | Left-pinned |
| Remaining space | 1640px | Flex fill |
| Fluid container | 1560px | Spans full (minus 80px margins) |
| Standard container | 1160px | **Centered** in 1640px space |

**Visual:**
```
[Nav 280] [─── 1640px remaining space ───]
          [Fluid: ──── 1560px ────]
          [─ 240px ─][Standard 1160px][─ 240px ─]
```

### Medium Viewport (1440px)
| Element | Width | Position |
|---------|-------|----------|
| Viewport | 1440px | - |
| Side nav | 280px | Left-pinned |
| Remaining space | 1160px | Flex fill |
| Fluid container | 1080px | Spans full (minus 80px margins) |
| Standard container | 1080px | Fills space (below max-width) |

### Small Viewport (<1160px)
- Side nav hidden (hamburger or bottom tabs)
- Fluid container: Spans full viewport minus margins
- Standard container: Fills available space (below max-width)

---

## Centering Logic

### How Centering Works

1. **Shell has no constraints**
   - `.column-layout-main` has `flex: 1` (fills space)
   - No max-width, no margin auto

2. **Containers center themselves**
   - All containers have `margin-left: auto; margin-right: auto`
   - Containers with `max-width` center when parent is wider
   - Fluid containers (no max-width) span full width

### Example Calculation (1920px viewport)

**Fluid Container:**
```
Parent width: 1640px (1920 - 280 nav)
Container width: 100%
Margin (XL): 40px each side
Content width: 1640 - 80 = 1560px
Centering: N/A (spans full width)
```

**Standard Container:**
```
Parent width: 1640px (1920 - 280 nav)
Container max-width: 1160px
Margin (XL): 40px each side
Content width: 1160 - 80 = 1080px
Left margin: auto (calculates to 240px)
Right margin: auto (calculates to 240px)
Result: CENTERED
```

---

## Responsive Margins

Consistent across all containers via CSS custom property:

| Breakpoint | Margin | Applied To |
|------------|--------|------------|
| XL (≥1160px) | 40px | Both fluid and standard |
| LG (840-1159px) | 32px | Both fluid and standard |
| MD (600-839px) | 24px | Both fluid and standard |
| SM (<600px) | 16px | Both fluid and standard |

---

## Key Benefits

### ✅ No Hardcoded Shell Constraints
- Shell is purely structural
- No 1440px or any other max-width on shell
- Complete flexibility

### ✅ Container-Driven Width Management
- Each container declares its own max-width
- Containers self-center via margin auto
- Easy to add new container variants

### ✅ Perfect Alignment
- Fluid and standard containers use same margins
- Content edges align to consistent grid
- Responsive margins scale together

### ✅ Side Nav Pinned Left
- Always 280px
- Always left-aligned
- Never affected by container logic

### ✅ Content Centered in Remaining Space
- Automatic centering via margin auto
- Works at any viewport size
- No JavaScript required

### ✅ Scalable & Maintainable
- Add new container variants easily
- Change max-widths without affecting shell
- Clear separation of concerns

---

## Migration Path

### Current State ✅
- Breakpoint-based container margins
- Shell has no constraints
- Containers manage all width logic

### Future: Container Queries
When browser support allows:

```css
.container {
  container-type: inline-size;
}

@container (min-width: 600px) {
  .container {
    padding-left: 24px;
    padding-right: 24px;
  }
}
```

Benefits:
- Truly viewport-independent
- Reusable containers in any context
- Nested containers with isolated behavior

---

## Summary

**Before (Legacy):**
```
.page-layout { max-width: 1440px }  ❌ Shell constrained
.column-layout-main { max-width: 1440px; margin: 0 auto }  ❌ Redundant
```

**After (Container-Driven):**
```
.column-layout-main { flex: 1 }  ✅ No constraints
.container { margin: auto }  ✅ Self-centering
.container--standard { max-width: 1160px }  ✅ Variant-specific
.container--fluid { max-width: none }  ✅ Full-width option
```

**Result:**
- Side nav pinned left
- Content fills remaining space
- Containers center themselves
- Responsive margins on everything
- Zero hardcoded shell constraints
