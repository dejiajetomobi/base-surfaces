# Flow Structure Rules

Patterns established by the Add Money flow. All future flows must follow these conventions.

## Overlay Architecture

```css
position: fixed;
inset: 0;
z-index: 100;
background: var(--color-background-screen);
display: flex;
flex-direction: column;
overflow-y: auto;
```

Replaces the entire page layout when active.

## ActiveFlow State (App.tsx)

- `activeFlow` is a union type in `App.tsx` — `null` when no flow is open.
- When set, App renders the flow component instead of the page layout.
- Close callback sets `activeFlow = null`, returning to the previous page/subPage (which remain in state).

## Header

- **With steps**: Use `FlowNavigation` from `@transferwise/components` (e.g. Add Money has Amount → Verification → Payment).
- **Without steps**: Use `OverlayHeader` from `@transferwise/components` (e.g. Convert has logo + avatar + close only).
- Close button must be centred: `display: flex; align-items: center; justify-content: center`.

## Avatar

- 48px `AvatarView`.
- **Personal**: uses `imgSrc` (photo).
- **Business**: `{ backgroundColor: '#163300', color: '#9fe870' }` with initials.

## Account Avatar Styles

Used inside currency selectors and labels to represent the account:

- **Personal**: `{ backgroundColor: 'var(--color-interactive-accent)', color: 'var(--color-interactive-control)' }` with Wise logo icon.
- **Business**: `{ backgroundColor: '#163300', color: '#9fe870' }` with Wise logo icon.
- **Taxes jar**: `{ backgroundColor: '#FFEB69', color: '#3a341c' }` with `Money` icon.

## Body Column

```css
max-width: 522px;
width: 100%;
margin: 0 auto;
padding: 112px 0 64px;
flex: 1;
```

Responsive breakpoint at **554px** (522 + 32px margins):

```css
@media (max-width: 554px) {
  max-width: none;
  padding: 72px 16px 48px;
}
```

## Currency Selector

DS `Button` (md, secondary-neutral) with:
- `addonStart`: double avatar `[accountIcon, currencyFlag]`
- `addonEnd`: `ChevronDown` icon
- Rendered via `ExpressiveMoneyInput.currencySelector.customRender`
- No dropdown menu (non-functional selector)

## ButtonCue

Shared component at `src/components/ButtonCue.tsx`. Wraps the primary action button.

- Surface grows from bottom (24px radius, 5px inset).
- Hint text uses `--color-content-primary`.
- Appears after 500ms delay on mount.
- Hides during loading state.
- Re-shows when button returns to disabled.

## Button State Machine

```
disabled → loading (2s) → active
active → loading (2s) → disabled → cue re-appears
```

Loading state uses `mix-blend-mode: luminosity; opacity: 0.45`.

## Props Pattern

Flows receive:
```ts
{
  onClose: () => void;
  accountType: AccountType;
  avatarUrl: string;
  initials: string;
  // ...flow-specific props (currencies, labels, jar)
}
```

## Translations

All UI text uses `t()` keys from the Language context. Every flow needs keys in all supported languages (en/es/de/fr).

## Focus Behaviour

Delay focus on the primary input by 400ms so the user sees the inactive→active animation.
