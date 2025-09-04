# Style Guide

## 1) Brand & Visual Foundations

### 1.1 Color Palette (Light Theme)

Define tokens (rename to your brand terms as needed).

* **Brand / Primary**

  * `--color-brand-600: #F05340` (Primary action, key highlights)
  * `--color-brand-700: #D34333` (Hover/active on brand surfaces)
  * `--color-brand-500: #F56A5A` (Subtle accents, charts)
* **Neutrals**

  * `--gray-50:  #FAFAFB` (Page background)
  * `--gray-100: #F3F4F6` (Panels, stripes)
  * `--gray-200: #E5E7EB` (Borders, dividers)
  * `--gray-300: #D1D5DB` (Quiet borders)
  * `--gray-500: #6B7280` (Secondary text)
  * `--gray-700: #374151` (Body text)
  * `--gray-900: #111827` (Headings, high contrast)
* **Semantic**

  * `--success-600: #16A34A`
  * `--warning-600: #D97706`
  * `--danger-600:  #DC2626`
  * `--info-600:    #2563EB`
* **Accents (optional)**

  * `--accent-teal-500:   #14B8A6`
  * `--accent-purple-500: #8B5CF6`
  * `--accent-amber-500:  #F59E0B`

**Usage**

* Use **brand-600** for primary buttons, active nav, key links on hover.
* Use **neutrals** for structure; let brand color be the emphasis, not the background.
* Use semantic colors narrowly and consistently (validation, status, alerts).
* Ensure **WCAG AA contrast** for all text/surfaces.

### 1.2 Color Palette (Dark Theme)

* Invert neutrals; keep high contrast:

  * `--bg: #0B0E12` · `--panel: #12161C` · `--border: #1F2937`
  * Text: `--text: #E5E7EB` (body), `--text-weak: #9CA3AF`
* Lift chroma \~+5–10% for brand/semantic to retain vibrancy on dark.
* Preserve AA contrast for small/regular text; AAA where feasible for body.

### 1.3 Elevation & Shadows

* **Base surfaces**: no shadow.
* **Raised (cards, menus):** subtle, soft blur

  * e.g., `0 1px 2px rgba(0,0,0,.06), 0 6px 24px rgba(0,0,0,.08)`
* **Hover**: slightly deepen Y-offset, never harsh/dense.

### 1.4 Borders & Radius

* **Border**: 1px solid `--gray-200` (light) / `--border` (dark).
* **Radius scale**: `sm 4px`, `md 6px`, `lg 8px`, `pill 999px`.
* Use the **same radius** family across inputs, buttons, cards, modals.

---

## 2) Typography

### 2.1 Families

* **UI Sans** (primary): Clean, modern sans-serif for interface elements and body text with excellent legibility.
* **UI Serif** (headings): Sophisticated serif for headings that provides elegant contrast and strong visual hierarchy.
* **Mono** (code/data): Monospace font optimized for code readability with proper character spacing.

### 2.2 Scale & Tokens

| Token       | Size  | Line-height | Weight  | Use                        |
| ----------- | ----- | ----------- | ------- | -------------------------- |
| `display-1` | 48–56 | 1.1–1.15    | 700     | Hero headlines (marketing) |
| `h1`        | 32–40 | 1.2         | 700     | Page titles                |
| `h2`        | 24–28 | 1.25        | 600     | Section heads              |
| `h3`        | 20–22 | 1.3         | 600     | Card titles, subheads      |
| `body`      | 16    | 1.6         | 400     | Primary reading size       |
| `body-sm`   | 14    | 1.5         | 400/500 | Meta, captions             |
| `mono`      | 14    | 1.5         | 400     | Code, logs                 |

**Guidelines**

* Prefer **sentence case** in UI; reserve **ALL CAPS** for compact labels/badges with +0.5–1px letter-spacing.
* Keep body text >=16px for long-form readability.
* Limit weights to **400/500/600/700**.

---

## 3) Spacing, Grid & Layout

### 3.1 Spatial System

* **Base unit:** 8px
* **Scale:** 4, 8, 12, 16, 24, 32, 40, 48, 64, 80
* Vertical rhythm examples:

  * Section padding: 48–80
  * Card internal padding: 16–24
  * Form field vertical gap: 12–16
  * Headline → paragraph: 12–16

### 3.2 Grid & Containers

* **Grid:** 12-column responsive.
* **Max content width:** 720–840px for text; wider for dashboards (up to 1200–1320px).
* **Gutters:** 16–24 (mobile 16, desktop 24/32).
* Maintain readable line length (\~60–75 chars) for long text.

### 3.3 Page Structure

* **Top bar:** 56–64px height, sticky optional.
* **Primary nav:** top or left sidebar (220–260px).
* **Footer:** high-contrast band with compact links.
* **Whitespace:** prefer space over borders to group/separate.

---

## 4) Iconography, Illustration & Imagery

### 4.1 Icons

* **Style:** outline or minimal solid; consistent stroke weight.
* **Sizes:** 16, 20, 24 (buttons/menus), 32+ for feature callouts.
* **Color:** neutral by default; semantic/brand when indicating state or action.
* Provide **accessible labels** when icons are actionable.

### 4.2 Illustration Motifs (optional)

* Abstract geometric blocks, light 3D hints, or isometric shapes.
* Low-contrast background ornaments; never obscure content.
* Use accent palette sparingly to avoid noise.

### 4.3 Photography

* Clean, well-lit, modern editorial style.
* Use soft overlays to harmonize with palette if needed.

---

## 5) Core Components (with States)

> Each component supports: **default, hover, active/pressed, focus-visible, disabled**, plus **invalid/success** where relevant.

### 5.1 Buttons

* **Primary**: `bg brand-600`, text white, radius `md`, padding `8–12 / 16–20`

  * Hover: brand-700; Active: brand-700 −2% lightness; Focus: 2px focus ring
  * Disabled: reduce contrast, remove shadow/hover
* **Secondary (outline)**: transparent bg, 1px border `gray-300`, text `gray-700`

  * Hover: bg `gray-100`; Active: border `gray-400`
* **Tertiary (ghost/text)**: no border, text `gray-700` (or brand for link-style)

  * Hover: underline or subtle bg
* **Destructive**: like primary but `danger-600`
* **Icon button**: 36–40px square/circle hit target; hover bg subtle

### 5.2 Links

* Default: text `brand-600`; Hover: underline; Focus: focus ring
* External links may include an “↗” icon.

### 5.3 Inputs

* **Text/Email/Password**

  * Height 40–44, padding 10–12, border `gray-300`, radius `md`, bg white
  * Placeholder `gray-500`
  * Focus: border brand-600 or 2px ring
  * Invalid: border `danger-600`, helper text `danger-600`
* **Textarea**: same visual language; minimum 120–160px height
* **Select**

  * Chevron icon at right, same field chrome; menu as raised surface with 8–12px option padding
* **Checkbox/Radio**

  * 16–18px control; checked fill brand-600; large label click target
* **Switch**

  * Track 40×20; knob 16; OFF `gray-300`, ON brand-600; includes visible label
* **Helper/Hint**

  * `body-sm` in `gray-500`, 6–8px spacing below control

### 5.4 Form Patterns

* Label above input; consistent 8–12px gap.
* Group related fields in sections with subhead + brief description.
* Use **progressive disclosure** for advanced fields.
* Provide **inline validation** on blur; summarize on submit.

### 5.5 Cards

* White surface, radius `md`, subtle shadow, 16–24 padding.
* Title (h3), optional meta row, content area; consistent internal spacing.
* Clickable cards: hover lift (shadow +2), outline on focus.

### 5.6 Navigation

* **Top Nav**

  * Left: logo; Center/Left: primary links; Right: search, profile, actions.
  * Active link: brand underline or pill; Hover: underline.
* **Sidebar**

  * 220–260px; grouped sections; active item with left rail or bg highlight.
  * Collapsible to icons on narrow screens.
* **Tabs**

  * Underline or pill style; active is brand; use focus styles.

### 5.7 Tables

* Row height 44–52; cell padding 12–16.
* Header: medium weight, `gray-700`, optional `gray-100` bg.
* Row hover: subtle bg `gray-50`; zebra optional.
* Sorting: chevrons with active column color/weight.
* Responsive: horizontal scroll **or** stacked key-value cards on mobile.
* Actions column: consistent icon buttons with tooltips.

### 5.8 Feedback & Status

* **Alerts (inline)**

  * Soft tinted bg + 1px border; left icon; concise copy
  * Success (green), Warning (amber), Error (red), Info (blue)
* **Toasts**

  * Corner stack; 3–5s life; allow action + close.
* **Badges**

  * Small pills, 12–14px text; use semantic/brand hues; uppercase optional.
* **Progress**

  * Determinate bar: neutral track, brand fill, rounded ends
  * Indeterminate: thin brand bar or spinner

### 5.9 Overlays

* **Modal**

  * Centered, 560–720 width; radius `lg`; 24–32 padding; header/title, body, footer actions
  * Backdrop 40–60% black; focus trap; ESC/close button
* **Drawer**

  * Right/left slide for secondary tasks; same surface/radius.
* **Popover/Dropdown**

  * Card-like, arrow optional; 8–12 option padding; shadow subtle.

### 5.10 Tooltips

* Dark surface, white text, 12px, 6×8 padding; delay short; arrow optional.
* Triggered on hover **and** focus; never hide critical info only in tooltip.

### 5.11 Empty States

* Friendly headline, one-line guidance, primary CTA.
* Optional small illustration (low saturation, on-brand).

---

## 6) Content, Code & Media

### 6.1 Rich Text (Marketing/Docs)

* Headings: `h1/h2/h3` tokens; clear hierarchy.
* Paragraph width constrained (720–840px).
* Lists: comfortable indent; 8–12 spacing between items.
* Blockquotes: left border `brand-600` at 2–4px, subdued text.
* Code blocks: mono 14px, line numbers optional; surface `gray-50`; copy button.

### 6.2 Code Inline/Blocks

* Inline code: mono 90%, padded 2–4px, bg `gray-100`, radius `sm`.
* Blocks: 12–16 padding; maintain accessible contrast; support dark theme.

### 6.3 Media

* Images responsive (`max-width:100%`), captions in `body-sm`.
* SVG for icons/illustrations; PNG/JPEG optimized; WebP where possible.
* Respect reduced-data contexts where feasible.

---

## 7) Accessibility (AA+)

* **Contrast**: Text/surfaces meet AA (4.5:1 for body, 3:1 for large).
* **Focus**: Always visible (2px ring or outline with offset).
* **Keyboard**: Tab order follows DOM; ESC closes modals/menus; arrow keys in menus/lists.
* **Labels**: Inputs tied to `<label>`; icons have `aria-label`/`title` where action-only.
* **Motion**: Respect `prefers-reduced-motion`; provide non-motion alternatives.
* **Color Independence**: Don’t rely on color alone for meaning (use icons/text).
* **Live Regions**: Announce async results (toasts/alerts) via ARIA where applicable.

---

## 8) Responsiveness & Dark Mode

### 8.1 Breakpoints (example)

* **xs** ≤ 480 · **sm** ≤ 640 · **md** ≤ 768 · **lg** ≤ 1024 · **xl** ≤ 1280 · **2xl** ≤ 1536
* Collapse sidebars to drawers <= `md`. Increase spacing/typography gradually ≥ `lg`.

### 8.2 Mobile Patterns

* Single column flow; stacked sections; large tap targets (≥44px).
* Replace hover-only affordances with persistent icons or explicit actions.

### 8.3 Dark Mode Rules

* Backgrounds near-black; panels deep gray; borders subtle.
* Increase text opacity; tweak brand/semantic hues for contrast.
* Preserve component states (hover/focus) with visible deltas.

---

## 9) Motion & Micro-interactions

* **Durations**: 150–250ms for UI; 200–300ms for overlays.
* **Easing**: ease-in-out; use subtle transforms (opacity + 2–6px translate).
* **Feedback**: button press (opacity/scale 0.98), spinner in button for pending.
* **Entrances**: dropdowns fade+slide 6–8px; modals fade+scale 0.98→1.
* **No blocking**: animations never impede task flow.

---

## 10) Data Visualization (if applicable)

* Use neutral gridlines; highlight current series in brand color.
* Limit palette to 6–8 hues; add patterns for color-blind safety.
* Axes labels 12–14px; legends clickable (toggle series).
* Tooltips high-contrast; values mono for readability.

---

## 11) Copy & Tone

* Clear, concise, action-oriented.
* Buttons: verbs (“Create project”, “Save changes”).
* Errors: human, specific (“We couldn’t save. Check your connection and try again.”).
* Empty states: encouraging guidance + CTA.

---

## 12) Assets & Favicon

* Provide SVG logo (horizontal + square), monochrome and full-color.
* Favicon set (16, 32, 48, 180, 512); dark and light safe variant if needed.
* Social preview (OG image) on brand background with large title.

---

## 13) Implementation Notes (agnostic)

* Centralize **design tokens** (colors, spacing, radius, typography).
* Reuse **component primitives**; document props/variants/states.
* Ship **minified CSS**, defer non-critical; self-host fonts with `font-display: swap`.
* Audit unused CSS regularly; test across major browsers/devices.

---

## 14) QA Checklist (Per Page/Feature)

* [ ] Visual parity with tokens (colors, type, spacing, radius).
* [ ] States: hover/active/focus/disabled/invalid implemented.
* [ ] Keyboard: full traversal; visible focus; ESC/Enter behavior.
* [ ] Contrast: AA pass for text/icons; check on dark/light.
* [ ] Responsive: layouts at xs/sm/md/lg/xl; no overflow.
* [ ] Motion: durations/easing consistent; reduced-motion honored.
* [ ] Content: headings hierarchical; links descriptive; alt text present.
* [ ] Performance: images optimized; CSS size reasonable; no layout shifts.



