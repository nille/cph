# cph

This repo contains the back-end tooling and contents for the website https://cph.nille.dev.

## Features

- **Static Site Generation**: Fast, SEO-friendly pages built with Astro
- **Markdown Content**: Easy-to-manage places written in markdown with proper typography styling
- **Interactive Map**: Pure Leaflet.js powered map with clustering showing all locations
- **Responsive Layout**: Works beautifully on all devices built with TailwindCSS 4.x
- **Content Collections**: Organized places with proper typing and validation
- **Typography Plugin**: Enhanced markdown rendering with @tailwindcss/typography

## Technology Stack

**Core Framework:**
- Astro 5.13.5 - Static site generation with TypeScript
- React 19.1.1 - Interactive components where needed

**Styling & Design:**
- TailwindCSS 4.1.12 - Utility-first CSS framework
- @tailwindcss/typography 0.5.16 - Enhanced markdown styling
- @tailwindcss/vite 4.1.12 - Vite integration for Tailwind

**Mapping & Geolocation:**
- Leaflet.js 1.9.4 - Interactive maps with OpenStreetMap
- leaflet.markercluster 1.5.3 - Marker clustering for better UX
- @types/leaflet 1.9.20 - TypeScript definitions

## Project Structure

```
/
├── .astro/                  # Astro build cache and generated types
├── .claude/                 # Claude Code configuration
├── context/                 # Development documentation
│   ├── design-principles.md # Comprehensive design system checklist
│   ├── style-guide.md       # Complete UI/UX style guide with tokens
│   └── leafletjs.md         # Comprehensive Leaflet.js development guide
├── public/                  # Static assets
│   ├── favicon.svg
│   └── images/              # Image assets organized by content type
│       ├── places/
│       ├── events/
│       └── tips/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/              # UI component library
│   │       └── leaflet-map.ts # Interactive map component
│   ├── config/              # Configuration files
│   │   └── emoji-mappings.ts # Emoji mapping for map markers
│   ├── content/             # Content collections
│   │   ├── config.ts        # Content collections schema configuration
│   │   └── places/          # Markdown files for places (cafés, restaurants, museums, etc.)
│   ├── layouts/             # Page layout templates
│   │   └── BaseLayout.astro # Main layout template
│   ├── pages/               # Route pages
│   │   ├── index.astro      # Homepage
│   │   ├── places.astro     # Places listing page
│   │   ├── events.astro     # Events listing page
│   │   ├── tips.astro       # Tips & tricks page
│   │   ├── map.astro        # Interactive map page
│   │   ├── about.astro      # About page (not in main navigation)
│   │   └── places/
│   │       └── [slug].astro # Dynamic place detail pages
│   └── styles/              # Global stylesheets
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
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

## Adding New Places

1. Create a new markdown file in `src/content/places/`
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

Write your place description in markdown format.
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

## Recent Changes

### Content Directory Restructure & Styling Fix (January 2025)
**Renamed "recommendations" to "places" and fixed markdown typography**

- ✅ **Renamed content collection** from `recommendations` to `places` for better clarity
- ✅ **Moved all content files** from `src/content/recommendations/` to `src/content/places/`
- ✅ **Updated all code references** throughout the codebase to use 'places' terminology
- ✅ **Fixed markdown styling** by adding and properly configuring `@tailwindcss/typography` plugin
- ✅ **Resolved typography issues** where headings and horizontal rules weren't properly styled
- ✅ **Updated TailwindCSS 4.x configuration** to use correct `@plugin` syntax instead of `@import`
- ✅ **Updated README and documentation** to reflect new structure

**26 place files successfully migrated** covering cafés, restaurants, museums, parks, and more Copenhagen locations.

### Map Implementation Upgrade (September 2025)
**Replaced React-Leaflet with Pure Leaflet.js Implementation**

- ✅ **Removed React-Leaflet dependencies** (`react-leaflet`, `react-leaflet-cluster`)
- ✅ **Added core Leaflet.js dependencies** (`leaflet`, `leaflet.markercluster`, `@types/leaflet`)
- ✅ **Created new pure Leaflet.js implementation** (`src/components/ui/leaflet-map.ts`)
- ✅ **Updated map page** to use pure Leaflet.js instead of React components
- ✅ **Preserved all functionality**: clustering, custom icons (home, parking), popups with external map links
- ✅ **Maintained design consistency** with existing styling approach
- ✅ **Added comprehensive documentation** (`context/leafletjs.md`) covering 551+ plugins and best practices

**Benefits of the new implementation:**
- Better performance with large datasets
- Direct access to Leaflet.js API and plugin ecosystem
- Reduced bundle size (removed React wrapper overhead)
- Standard Leaflet.js development patterns for easier maintenance
- Enhanced TypeScript support

**Technical Details:**
- Map initialization uses Copenhagen coordinates (55.6761, 12.5683)
- Marker clustering enabled by default using `leaflet.markercluster`
- Custom icons for home (🏠) and parking (P) locations
- Interactive popups with links to recommendation pages and external map services
- Standard OpenStreetMap tile layer with proper attribution
