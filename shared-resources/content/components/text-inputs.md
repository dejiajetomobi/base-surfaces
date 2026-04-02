# Text Input Component — Writing Guidelines

## Label Text

### Rules
- **Length:** No more than 3 words
- **Style:** Use nouns describing the required information, not verbs
- **Preference:** Single-word labels over instructional phrases

### Examples

#### ✓ Do
- "Email"
- "Phone number"
- "Account number"

#### ✗ Don't
- "Enter your email address" — Too long, instructional
- "Type phone number here" — Unnecessary instruction

## Description Text (Optional)

### When to Use
Only include when you have evidence users need additional context to enter the right information.

### Rules
- **Format:** Single sentence
- **Purpose:** Give extra context to help users enter correct information
- **Style:** Use sentence case with a full stop

### Example
"We'll send a confirmation code to this number."

## Placeholder Text

**Not recommended.** Avoid placeholders because:
- Users may confuse placeholder content with actual values
- Low contrast makes them difficult to read
- Often contain dummy values that don't help users

**Alternative:** Use the optional description field instead.

## When to Use Text Inputs

- When users must enter unique information not selectable from a preset list
- For known information like names, email addresses, IBANs, or card numbers

## When NOT to Use

- For multi-line text (use text area component)
- When you need to predetermine entry format (use specialized components like date input or password input)
- For selecting from predefined options (use dropdown or select)

## Password Inputs

- Hide text by default
- Users can choose to show content with the built-in toggle
- Never force visibility
