# cph

This repo contains the back-end tooling and contents for the website https://cph.nille.dev.

## Features

- **Static Site Generation**: Fast, SEO-friendly pages built with Astro
- **Markdown Content**: Easy-to-manage recommendations written in markdown
- **Interactive Map**: Leaflet.js powered map showing all locations
- **Responsive Layout**: Works beautifully on all devices
- **Content Collections**: Organized recommendations with proper typing and validation

## Project Structure

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── content/
│   │   ├── config.ts        # Content collections configuration
│   │   └── recommendations/ # Markdown files for recommendations
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout template
│   └── pages/
│       ├── index.astro      # Homepage
│       ├── places.astro     # Places listing page (cafés, restaurants, museums, parks)
│       ├── events.astro     # Events listing page
│       ├── tips.astro       # Tips & tricks page
│       ├── map.astro        # Interactive map page
│       ├── about.astro      # About page (not in main navigation)
│       └── recommendations/
│           └── [slug].astro # Dynamic recommendation pages
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── context/
│   ├── design-principles.md # Comprehensive design system checklist
│   └── style-guide.md       # Complete UI/UX style guide with tokens
├── CLAUDE.md                # Claude Code configuration
└── README.md                # This file
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and visit `http://localhost:4321`

## Adding New Recommendations

1. Create a new markdown file in `src/content/recommendations/`
2. Use the following frontmatter structure:

```markdown
---
title: "Place Name"
category: "places" # or "events", "tips"
type: "museum" # or "cafe", "restaurant", "concert", "advice", etc.
location: "Address, Copenhagen"
address: "Specific street address" # optional, for map integration
coordinates: # optional, for map pins
  lat: 55.6761
  lng: 12.5683
neighborhood: "District Name" # optional
description: "Brief description"
tags: ["tag1", "tag2", "tag3"] # e.g., ["cafe", "cozy", "wifi"]
rating: 5 # 1-5 stars
visited: "2024-08-15" # YYYY-MM-DD format
season: "Summer" # optional
price_range: "$$" # optional
---

# Your content here

Write your recommendation in markdown format.
```

## Building for Production

```bash
npm run build
```

The built site will be in the `dist/` directory, ready for deployment to any static hosting service.

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`     |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |


## Claude Code Integration

### Playwright MCP Server (Optional)

For enhanced browser automation and testing capabilities with Claude Code:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

This enables:
- Automated browser testing for design changes
- Visual regression testing with screenshots
- Interactive page navigation and validation
- Console error detection and reporting

**Note**: This requires Claude Code CLI to be installed and configured.

### Magic MCP Server (Optional)

For advanced AI-powered development capabilities with Claude Code:

```bash
claude mcp add magic --scope user --env API_KEY="your_api_key_here" -- npx -y @21st-dev/magic@latest
```

Replace `your_api_key_here` with your actual Magic MCP API key from [21st.dev/mcp](https://21st.dev/mcp).

Magic MCP provides:
- Advanced code analysis and optimization suggestions
- Intelligent refactoring assistance
- Smart documentation generation
- Context-aware development insights
- Enhanced AI reasoning capabilities

Visit [21st.dev/mcp](https://21st.dev/mcp) for more information and configuration options.

**Note**: This requires Claude Code CLI to be installed and configured.

## Visual Development

### Design System Documentation

**Core References:**
- **Design Principles** (`/context/design-principles.md`): S-tier design checklist covering philosophy, accessibility, and module-specific guidance
- **Style Guide** (`/context/style-guide.md`): Complete UI/UX specification with design tokens, component states, and implementation details

**Key Features:**
- Color palettes with light/dark theme tokens
- Typography scale and hierarchy system  
- Spacing system based on 8px grid
- Comprehensive component specifications
- Accessibility standards (WCAG AA+)
- Responsive breakpoints and mobile patterns
- Motion and micro-interaction guidelines
- QA checklist for visual implementation

When making visual changes, always reference both documentation files for consistency.

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing
