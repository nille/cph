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
- **Styling**: TailwindCSS 4.x (configured via Vite plugin) with custom pastel color palette
- **Content Management**: Astro Content Collections with Zod schema validation
- **Typography**: Courgette (headings) + Libre Baskerville (body)
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
- `title`, `category` (places|events|tips), `type`, `location`, `description`
- `rating` (1-5), `visited` (YYYY-MM-DD format)
- Optional: `address`, `coordinates` (lat/lng for map), `neighborhood`, `season`, `tags`, `price_range`

## Design Principles

The site follows japandi aesthetics with a modern pastel twist: simplicity, natural materials, functionality over decoration. Uses a custom color palette with sage green, sky blue, lavender, and peach pastels alongside the stone neutrals. Clean typography hierarchy with Courgette script font for headers and Libre Baskerville serif for body text.

## Development Notes

- TypeScript is configured with Astro's strict preset
- Markdown supports drafts and uses 'min-light' syntax highlighting
- Content collections provide type safety for recommendation data
- All styling should use TailwindCSS classes following the existing design system