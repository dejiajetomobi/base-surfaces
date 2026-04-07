# Shared Design System Documentation

This directory contains design system documentation shared across all Base Surfaces prototypes (web, mobile, iOS, onboarding).

## What's Shared

These docs are platform-agnostic or common enough to be referenced by multiple projects:

| Doc | Used By | Contents |
|-----|---------|----------|
| `icons.md` | All 4 projects | Icon usage, sizes, color contexts, @transferwise/icons reference |
| `flags-and-art.md` | All 4 projects | @wise/art Flag and Illustration usage (CDN-based) |
| `components.md` | Web + Mobile | Neptune component inventory and usage patterns (React) |
| `tokens.md` | Web + Onboarding Web | Neptune color, typography, spacing tokens (CSS variables) |
| `neptune-css.md` | Web + Onboarding Web | Neptune CSS utilities, modifiers, and patterns |
| `neptune-tokens.md` | Cross-platform | Platform-agnostic Neptune token reference |

## What's Project-Specific

Each project maintains its own `design-system/` directory for platform-specific overrides and custom components:

### base-surfaces-web
- `custom-tokens.md` — web-specific token extensions
- `custom-components.md` — web custom components (2,089 lines)
- `page-structure.md` — web layout shell and CSS custom properties
- `illustration-3d.md` — 3D illustration usage
- `utilities.md`, `setup.md`, `figma-references.md`

### base-surfaces-mobile
- `tokens.md` — **DIFFERENT from shared** (mobile has additional tokens)
- `custom-tokens.md` — mobile-specific tokens
- `custom-components.md` — mobile home page components
- `custom-components-account.md` — account & currency page components
- `custom-components-flows.md` — flow overlays and patterns
- `ios-components.md` — iOS-specific components (liquid glass, DeviceFrame)
- `ios-context.md` — iOS-specific context
- `neptune-css.md` — **DIFFERENT from shared** (includes MAKE_OVERRIDES)
- `page-structure.md` — mobile layout specifics

### base-surfaces-ios
- `ios-tokens.md` — SwiftUI Neptune tokens
- `ios-custom-tokens.md` — iOS custom tokens
- `ios-components.md` — Neptune SwiftUI component reference
- `ios-custom-components.md` — iOS custom components and patterns
- `neptune-custom-tokens.md` — iOS Neptune custom tokens

### base-surfaces-onboarding-web
- `custom-tokens.md` — onboarding-specific tokens
- `custom-components.md` — flow-specific components
- `components.md` — **DIFFERENT from shared** (smaller, onboarding-specific subset)

## Routing Pattern

Each project's `CLAUDE.md` references this shared directory using relative paths:

```markdown
## Design System Reference

Shared cross-platform docs in `../shared-resources/design-system/`:
- `icons.md`, `flags-and-art.md`, `components.md`, etc.

[Platform]-specific design system docs in `[path]/design-system/`:
- Custom tokens, custom components, platform-specific patterns
```

## Benefits

- **Single source of truth** for Neptune core docs (icons, flags, components, tokens)
- **-780 lines** of duplication removed
- **Easier maintenance** — update once, affects all projects
- **Clear separation** — shared vs. platform-specific is explicit
- **Mirrors data structure** — same pattern as `shared-resources/data/` and `shared-resources/account-logic/`
