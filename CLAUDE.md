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

- `src/content/places/` - Markdown files for places recommendations (cafés, restaurants, museums, parks, etc.)
- `src/content/config.ts` - Content collection schema (defines required frontmatter fields)
- `src/layouts/BaseLayout.astro` - Main layout template
- `src/pages/` - Route pages including dynamic `[slug].astro` for recommendations
  - `places.astro` - Places listings with automatic filtering, pagination, and category detection
  - `places/[slug].astro` - Individual place detail pages with image gallery functionality
  - `events.astro` - Cultural events, festivals, exhibitions
  - `tips.astro` - Tips & tricks for Copenhagen living
  - `map.astro` - Interactive map showing all locations
  - `about.astro` - About page (not in main navigation)

### Content Schema

Recommendations must include frontmatter with:
- `title`, `subtitle`, `type`, `address`, `published`, `updated`
- Optional: `coordinates` (lat,lng string for map), `neighborhood`, `season`, `images`, `tags`, `price_range`, `website`, `instagram`

### Places System Features

#### Automatic Category Detection
The places system automatically detects and manages place categories without manual configuration:

- **Dynamic Type Discovery**: Scans all places and detects unique `type` values automatically
- **Intelligent Emoji Mapping**: 30+ predefined category emojis with smart pattern-matching fallbacks
- **Auto-Generated Filters**: Creates filter buttons dynamically based on detected categories
- **Maintenance-Free**: New categories are automatically supported when places are added

**Supported Categories**: cafe, restaurant, bar, pub, shop, museum, park, beach, market, area, parking, hotel, gallery, theater, bookstore, and more.

**Adding New Categories**: Simply use any `type` value in place frontmatter. The system will:
1. Assign an appropriate emoji (predefined or pattern-matched)
2. Create a filter button with proper display name
3. Enable filtering and pagination for the new category

#### Image Gallery System
Individual place pages (`/places/[slug]`) include a full-screen image gallery:

- **Hero Image**: First image displays between subtitle and main content
- **Sidebar Gallery**: Additional images appear in sidebar below map
- **Full-Screen Overlay**: Click any image to open in overlay with navigation
- **Keyboard Support**: Arrow keys for navigation, ESC to close
- **Responsive Design**: Optimized for both horizontal and vertical images

**Image Configuration**: Add `images: ["image1.jpg", "image2.jpg"]` array to place frontmatter.

#### Filtering & Pagination
Places listings page includes advanced navigation features:

- **Category Filtering**: Filter by any place type with emoji-labeled buttons
- **Pagination**: Shows 12 places per page with numbered navigation
- **Combined Functionality**: Filtering resets pagination, maintains state across interactions
- **Visual Indicators**: Each place displays with type-specific emoji in title
- **Clickable Images**: Place images link directly to detail pages

#### Interactive Enhancements
- **Hover Effects**: Consistent image zoom and shadow effects across listings
- **Smooth Transitions**: CSS animations for professional feel
- **Keyboard Navigation**: Full keyboard support for gallery and navigation
- **Mobile Responsive**: Optimized layouts for all screen sizes

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

### Technical Implementation Details

#### Places System Architecture
- **Server-Side Rendering**: Category detection and emoji mapping happen at build time for optimal performance
- **Client-Side Interactivity**: JavaScript handles filtering, pagination, and gallery navigation
- **Data Attributes**: Place cards include `data-place-type` attributes for reliable filtering
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features require it

#### Image Handling
- **Static Assets**: Images stored in `public/images/places/` directory
- **Flexible Paths**: Support for both relative filenames and absolute paths in frontmatter
- **Lazy Loading**: Gallery overlay loads images on demand for performance
- **Responsive Images**: CSS object-fit ensures proper aspect ratios across devices

#### Performance Considerations
- **Build-Time Processing**: Type detection and emoji assignment occur during site generation
- **Efficient Filtering**: Client-side filtering uses simple DOM manipulation, no re-rendering
- **Minimal JavaScript**: Gallery and pagination use vanilla JS for fast loading
- **CSS Transitions**: Hardware-accelerated transforms for smooth animations
