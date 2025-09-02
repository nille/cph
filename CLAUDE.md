# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based static site for Copenhagen recommendations with a japandi design aesthetic.

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
- **Styling**: TailwindCSS 4.x (configured via Vite plugin)
- **Content Management**: Astro Content Collections with Zod schema validation
- **Typography**: Crimson Text (headings) + Inter (body)

### Key Directories

- `src/content/recommendations/` - Markdown files for places and food recommendations
- `src/content/config.ts` - Content collection schema (defines required frontmatter fields)
- `src/layouts/BaseLayout.astro` - Main layout template
- `src/pages/` - Route pages including dynamic `[slug].astro` for recommendations

### Content Schema

Recommendations must include frontmatter with:
- `title`, `category` (places|food), `type`, `location`, `description`
- `rating` (1-5), `visited` (YYYY-MM-DD format)
- Optional: `neighborhood`, `season`, `tags`, `price_range`

## Design Principles

The site follows japandi aesthetics: simplicity, natural materials, functionality over decoration. Keep designs clean and minimal with plenty of whitespace. Use the established stone color palette and typography hierarchy.

## Development Notes

- TypeScript is configured with Astro's strict preset
- Markdown supports drafts and uses 'min-light' syntax highlighting
- Content collections provide type safety for recommendation data
- All styling should use TailwindCSS classes following the existing design system