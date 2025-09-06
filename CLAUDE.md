# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based static site for Copenhagen recommendations.

## Development Commands

Development commands:

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Astro CLI commands
npm run astro -- <command>
```

## Architecture

- **Framework**: Astro 5.x with TypeScript
- **Styling**: TailwindCSS 4.x (configured via Vite plugin) with custom pastel color palette
- **Content Management**: Astro Content Collections with Zod schema validation
- **Interactive Map**: Leaflet.js for location mapping

### Key Directories

- `src/content/recommendations/` - Markdown files for places, events, and tips recommendations
- `src/content/config.ts` - Content collection schema (defines required frontmatter fields)
- `src/layouts/BaseLayout.astro` - Main layout template
- `src/pages/` - Route pages including dynamic `[slug].astro` for recommendations
  - `places.astro` - All location-based content (cafés, restaurants, museums, parks)
  - `events.astro` - Cultural events, festivals, exhibitions
  - `tips.astro` - Tips & tricks for Copenhagen living
  - `map.astro` - Interactive map showing all locations
  - `about.astro` - About page (not in main navigation)

### Content Schema

Recommendations must include frontmatter with:
- `title`, `category` (places|events|tips), `type`, `address`, `description`
- Optional: `coordinates` (lat/lng for map), `neighborhood`, `season`, `tags`, `price_range`

## Visual Development

### Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual check 
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages 
2. **Navigate to affected pages** - Use `mcp_playwright_browser_navigate` to visit each changed view 
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request 
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view 
7. **Check for errors** - Run `mcp_playwright_browser_console_messages` 

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

## Development Notes

- TypeScript is configured with Astro's strict preset
- Markdown supports drafts and uses 'min-light' syntax highlighting
- Content collections provide type safety for recommendation data
- All styling should use TailwindCSS classes following the existing design system
