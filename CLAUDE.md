# Base Surfaces

## On First Message

Before doing anything else, check that the following MCP servers are available. If any are missing, tell the user which ones are missing and offer to help install them:

1. **Figma MCP** — required for reading Figma designs. Look for `figma` in the MCP server list.
2. **GitHub MCP** — required for pushing code, creating branches, and managing repos. Look for `github` in the MCP server list.
3. **Wise Design System (Storybook) MCP** — required for accessing Neptune component docs and props. Should be auto-configured via `.mcp.json` in this repo. If missing, install with:
   ```
   claude mcp add --transport http --client-id cdf3737dff9d485485968e50b63fd8b4 wise-design-system https://storybook.wise.design/mcp --scope project
   ```
