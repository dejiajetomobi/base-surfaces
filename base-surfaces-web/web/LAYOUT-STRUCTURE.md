# Layout Structure & Centering Logic

## Final Layout Architecture

### Visual Structure
```
┌─────────────────────────────────────────────────────────────┐
│ viewport (full width)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ .page-layout (100% width)                               │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ .column-layout (flex, 100% width)                   │ │ │
│ │ │ ┌──────┬──────────────────────────────────────────┐ │ │ │
│ │ │ │ Side │ .column-layout-main                      │ │ │ │
│ │ │ │ Nav  │ (max: 1440px, centered)                  │ │ │ │
│ │ │ │ 280px│ ┌──────────────────────────────────────┐ │ │ │ │
│ │ │ │      │ │ container--fluid (100% + margins)    │ │ │ │ │
│ │ │ │      │ │ → TopBar, Headers                    │ │ │ │ │
│ │ │ │      │ └──────────────────────────────────────┘ │ │ │ │
│ │ │ │      │ ┌──────────────────────────────────────┐ │ │ │ │
│ │ │ │      │ │ container--standard (1160px + margins)│ │ │ │
│ │ │ │      │ │ → Page content                       │ │ │ │ │
│ │ │ │      │ └──────────────────────────────────────┘ │ │ │ │
│ │ │ └──────┴──────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## CSS Implementation

### Shell Layers

#### 1. Page Layout (Viewport Container)
```css
.page-layout {
  width: 100%;
  min-height: 100vh;
  background: var(--color-background-screen);
}
```
- **Purpose**: Full viewport coverage
- **Width**: 100% (no max-width)
- **Behavior**: Spans entire browser window

#### 2. Column Layout (Flex Container)
```css
.column-layout {
  display: flex;
  width: 100%;
  min-height: 100vh;
}
```
- **Purpose**: Horizontal layout for nav + content
- **Width**: 100% (full viewport)
- **Behavior**: Flexbox container

#### 3. Side Navigation (Left Column)
```css
.column-layout-left {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
```
- **Purpose**: Fixed navigation on left
- **Width**: 280px (fixed)
- **Position**: Left-aligned, sticky
- **Behavior**: Always 280px, doesn't shrink

#### 4. Content Area (Right Column)
```css
.column-layout-main {
  flex: 1;
  min-width: 0;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
```
- **Purpose**: Main content area (header + pages)
- **Width**: Flexible, max 1440px
- **Position**: **CENTERED** in remaining space
- **Behavior**: Grows to fill space, but caps at 1440px and centers

## Container System Within Content Area

### Fluid Container
```css
.container--fluid {
  max-width: none;  /* 100% of parent */
}
```
- **Used by**: TopBar, page headers
- **Width**: 100% of `.column-layout-main`
- **Margins**: 40px/32px/24px/16px (responsive)
- **Visual**: Spans full width of content area

### Standard Container
```css
.container--standard {
  max-width: 1160px;
}
```
- **Used by**: Page content
- **Width**: Max 1160px, centered
- **Margins**: 40px/32px/24px/16px (responsive)
- **Visual**: Constrained and centered

## Centering Logic

### Side Nav (No Centering)
- Left-aligned at 280px
- Fixed position
- Never moves

### Content Area (Centered)
- **When viewport > 1720px** (280px nav + 1440px content):
  - Side nav: 280px from left
  - Content: 1440px centered in remaining space
  - White space: Distributed equally on right

- **When viewport = 1720px**:
  - Side nav: 280px
  - Content: 1440px (fills remaining space exactly)
  - No white space

- **When viewport < 1720px**:
  - Side nav: 280px
  - Content: Fills remaining space (< 1440px)
  - No centering needed (already fills)

### Fluid vs Standard Within Content

Both use the same responsive margins but different max-widths:

| Container | Max-Width | Visual Effect |
|-----------|-----------|---------------|
| **Fluid** | none (100%) | Spans full content area width |
| **Standard** | 1160px | Constrained, centered in content area |

## Responsive Behavior

### XL (≥1160px) - Desktop with Side Nav
```
┌──────┬────────────────────────────────┐
│ Nav  │ Content (centered, max 1440px) │
│ 280px│ Fluid: full width              │
│      │ Standard: 1160px max           │
└──────┴────────────────────────────────┘
Margins: 40px
```

### LG (840-1159px) - Desktop with Hamburger
```
┌────────────────────────────────────────┐
│ [☰] Content (centered, max 1440px)     │
│     Fluid: full width                  │
│     Standard: 1160px max               │
└────────────────────────────────────────┘
Margins: 32px
Side nav: Hidden (hamburger overlay)
```

### MD (600-839px) - Tablet
```
┌────────────────────────────────────────┐
│ [☰] Content (fills available)          │
│     Fluid: full width                  │
│     Standard: fills width              │
└────────────────────────────────────────┘
Margins: 24px
```

### SM (<600px) - Mobile
```
┌────────────────────────────────────────┐
│ Content (full width)                   │
│ Fluid: full width                      │
│ Standard: full width                   │
└────────────────────────────────────────┘
Margins: 16px
Bottom tab bar visible
```

## Key Principles

1. **Shell Spans Full Viewport**: `.page-layout` and `.column-layout` are 100% width
2. **Side Nav Fixed Left**: Always 280px, left-aligned
3. **Content Centered**: `.column-layout-main` has max-width + margin auto
4. **Containers Manage Width**: Fluid (100%) vs Standard (1160px)
5. **Margins Always Applied**: Responsive margins on all containers
6. **Perfect Alignment**: Fluid and standard containers align to same grid

## Benefits

✅ **Side nav anchored left** - Familiar navigation pattern
✅ **Content centered** - Balanced, professional appearance
✅ **Fluid headers** - Full-width visual impact within content area
✅ **Constrained reading** - Optimal line length for content
✅ **Responsive margins** - Consistent spacing at all breakpoints
✅ **Scalable** - Easy to adjust max-widths independently
