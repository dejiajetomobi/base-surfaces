# Base Surfaces

## Content & Writing

When the user asks you to write, review, or come up with content — UI copy, translations, button labels, error messages, snackbar text, modal copy, page descriptions, or any user-facing text — **read the writing guidelines first**:

1. Start with `shared-resources/content/writing-guidelines.md` — the master guide covering tone, grammar, vocabulary, and all component rules
2. For component-specific copy, also read the matching file in `shared-resources/content/components/` (e.g. `buttons.md` for button labels, `snackbars.md` for confirmation messages, `info-prompts.md` for error/warning/success text)
3. For vocabulary questions, check `shared-resources/content/vocabulary.md` for Wise-specific terminology and words to avoid

All content must follow Wise's tone of voice (concise, modern, energetic) and use British English spelling. See the guidelines for full rules.

## On First Message

Before doing anything else, check that the following MCP servers are available. If any are missing, tell the user which ones are missing and offer to help install them:

1. **Figma MCP** — required for reading Figma designs. Look for `figma` in the MCP server list.
2. **GitHub MCP** — required for pushing code, creating branches, and managing repos. Look for `github` in the MCP server list.
3. **Wise Design System (Storybook) MCP** — required for accessing Neptune component docs and props. Should be auto-configured via `.mcp.json` in this repo. If missing, install with:
   ```
   claude mcp add --transport http --client-id cdf3737dff9d485485968e50b63fd8b4 wise-design-system https://storybook.wise.design/mcp --scope project
   ```
