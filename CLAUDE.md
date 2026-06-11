# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio site — no build step, no package manager, no framework. Open `index.html` directly in a browser to view it. There is nothing to install or compile.

## Development

To preview: open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Stack

- **HTML/CSS/JS** — vanilla, no bundler, no Bootstrap JS/CSS
- **Tailwind CSS** — loaded from CDN via `<script>` tag; config lives in `tailwind.config.js` (external file so the CSP doesn't need `'unsafe-inline'` for scripts)
- **Bootstrap Icons** — CDN icon font only (with SRI integrity hash) — no other Bootstrap usage
- **Google Fonts** — Space Grotesk (display), Inter (body), JetBrains Mono (code/labels/eyebrows)

## Architecture

The site is a single HTML page (`index.html`) with one CSS file (`css/styles.css`), one JS file (`scripts.js`), and the Tailwind config (`tailwind.config.js`). Sections in order: Navbar → Hero → Projects → About → Skills → Contact → Footer.

**CSS approach:** Tailwind's `preflight` is disabled. Tailwind utilities handle layout/spacing; custom CSS in `styles.css` handles all components and design tokens.

**Design tokens** live in `:root` inside `styles.css`. The Tailwind `theme.extend` in `tailwind.config.js` mirrors those same values so both systems stay in sync. When changing a colour or font, update both places. Palette: `#0A0A0F` base, `#6C63FF` violet accent (use `--accent-bright: #8B85FF` for violet *text* — plain `#6C63FF` fails WCAG AA on dark), `#00F5C4` mint (hover states and highlights only).

**Security:** a Content-Security-Policy `<meta>` tag in `<head>` allowlists self, Google Fonts, jsdelivr, and the Tailwind CDN — no inline scripts allowed. Keep JS in external files. All `target="_blank"` links need `rel="noopener noreferrer"`.

**Animations:** several systems, all gated behind `prefers-reduced-motion`:
- `.fade-up` — CSS keyframe animation with `--d` custom property delay, hero entrance only
- `.reveal` + `.visible` — JS IntersectionObserver adds `.visible` on scroll-enter, all other sections
- Hero canvas particles, typewriter subtitle, and orb parallax — all in `scripts.js`, each skipped when reduced motion is preferred

**Projects grid + filter:** cards are `<article class="project-card" data-type="webapp|automation|homelab">`. Filter buttons toggle `.is-hidden` on non-matching cards; the fade-out uses `transition: display allow-discrete` + `@starting-style` (graceful snap in older browsers). No DOM removal.

**Mobile nav:** vanilla toggle in `scripts.js` — `#navToggle` flips `.open` on `#navMenu` and syncs `aria-expanded` (the hamburger animation is keyed off `aria-expanded`).

**Contact form** (`scripts.js`) does client-side validation only — no backend. The submit handler simulates a 2.5 s async send with `setTimeout`, then resets the form.

## Assets

Static images live in `assets/`. Project cards use either a real `<img class="project-img">` or a gradient placeholder `<div class="project-media project-media--ph media-NAME">` with a Bootstrap icon.

## Adding a project card

1. Copy an existing `<article class="project-card">` inside `.projects-grid`
2. Set `data-type` to `webapp`, `automation`, or `homelab` (must match a `data-filter` button)
3. Pick the matching `type-badge--*` class for the badge
4. Use `<img class="project-img">` for a real screenshot, or add a new `media-NAME` gradient class in `styles.css` for a placeholder
5. Icon-only links need an `aria-label` and external links need `target="_blank" rel="noopener noreferrer"`
