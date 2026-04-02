# Snackbar Component — Writing Guidelines

## Message Content Rules

### Core Pattern
- **Confirm what just happened** in present tense
- **Use the pattern: noun + verb**
- **Be 3 words or less**
- **Have no full stop**

### Examples
- "Transfer sent"
- "Card frozen"
- "Payment received"
- "Details saved"

## Button Copy Guidelines

When including a button (use sparingly):

### ✓ Do
- Start with a verb like "Pay" or "Send"
- Keep to 1-2 words
- Describe the action clearly
- Use consistent language with the message
- Apply sentence case capitalization
- Omit periods

### ✗ Don't Use These
- **"Cancel"** — Actions already occurred, so cancellation is impossible
- **"Close"** — Redundant since snackbars auto-dismiss
- **"Confirm"** — Users don't need to acknowledge understanding
- **"Go"** — Too vague about intended action

## Best Practices

- Only show information that users can find elsewhere on screen
- Buttons are rarely necessary — include only when essential
- Never use for critical information — some users miss auto-dismissing notifications
- Limit frequency to prevent disruption for users with cognitive or visual impairments

## When to Use

Use snackbars to confirm an action just completed. Don't use them for:
- Critical information that must be seen
- Actions that haven't happened yet
- Information that isn't available elsewhere
