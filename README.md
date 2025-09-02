# cph

This repo contains the back-end tooling and contents for the website https://cph.nille.dev.

## Features

- **Static Site Generation**: Fast, SEO-friendly pages built with Astro
- **Markdown Content**: Easy-to-manage recommendations written in markdown
- **Interactive Map**: Leaflet.js powered map showing all locations
- **Responsive Layout**: Works beautifully on all devices
- **Content Collections**: Organized recommendations with proper typing and validation
- **Custom Design**: Japandi-inspired aesthetics with pastel color palette

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

## Design Philosophy

This site embodies japandi principles:
- **Simplicity**: Clean layouts with plenty of whitespace
- **Natural materials**: Inspired color palette using stone and neutral tones
- **Functionality**: Every element serves a purpose
- **Quality**: Focus on well-crafted content over quantity
- **Serenity**: Calm, uncluttered user experience

## Typography & Design

- **Headers**: Courgette (script) - artistic and distinctive
- **Body**: Libre Baskerville (serif) - elegant and readable
- **Colors**: Custom pastel palette (sage green, sky blue, lavender, peach) with stone neutrals
- **Map**: Interactive Leaflet.js map for location visualization

## Development Commands

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`     |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |
