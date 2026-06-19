# Calmyra — Mental Wellness Website · PRD

## Problem Statement (Original)
Full redesign and premium upgrade of the existing Calmyra static website (HTML / CSS / JS only):
- Pastel palette with **soft pastel light green** as the primary theme.
- Calming wellness aesthetic, soft neutrals, minimal, elegant, professional.
- Fix all text visibility issues (white-on-white) — use proper dark text on light backgrounds.
- One unified header & footer across every page (~46 HTML pages).
- Replace poor / irrelevant images with high-quality, on-brand wellness imagery; keep aspect ratios clean.
- Polish all CSS — spacing, alignment, typography, buttons, cards, sections, animations.
- Fully responsive (desktop, tablet, mobile).
- Keep everything in pure HTML, CSS, JS — no frameworks.
- Preserve all existing functionality.

## Tech Stack
- Static site: HTML5, CSS3, vanilla JS.
- `Frontend` (port 3000): Express static server (`/app/frontend/server.js`) that serves `/app` as the document root.
- `Backend` (port 8001): minimal FastAPI placeholder (`/app/backend/server.py`) with `/api/health` and `/api/contact` so the platform supervisor stays green.
- MongoDB present in cluster but unused — site is fully static.

## Architecture / File Layout
```
/app/
├── index.html, team.html, assessment.html, dr-safina.html, privacy.html, terms.html
├── services/  (relationship/, career/, coaching/, geriatrics/, life-crises/,
│              Teen-and-childern/, specific-disorders/, group-therapy/,
│              neuro-psychology.html)
├── css/
│   ├── tokens.css            ← rewritten: pastel light-green design tokens
│   ├── calmyra-theme.css     ← rewritten: light base theme (Fraunces + Inter)
│   ├── pastel-overrides.css  ← NEW: unified pastel-green override layer (loaded last)
│   ├── styles.css            ← legacy layout (kept; colors flipped via tokens + overrides)
│   ├── assessment.css, coaching.css, relationship.css, team.css, legal.css ← color-swept
│   ├── bridge.css            ← unused (kept for archaeological reference)
├── assets/ (images, css/, png/, jpeg/, svg/)
├── js/script.js              ← nav, mega menu, FAQ accordion, testimonials, reveal
├── frontend/ (server.js + package.json — Express static server)
└── backend/  (server.py + requirements.txt — FastAPI placeholder)
```

## What's Been Implemented (Jan 2026)

### Design System
- **Pastel light-green palette**: `--mint-50/100/200/300/400/500/600/700/800` plus sage, cream, and complementary pastels (blush, peach, lavender, sky, butter).
- **Typography**: serif headings in `Fraunces` (with `Cormorant Garamond` fallback) + body in `Inter` / `DM Sans`.
- **Buttons**: pill-shaped, mint gradient primary, white outlined secondary, full hover lift + sheen animation.
- **Cards**: white surfaces, soft mint borders, subtle shadow, top accent line that sweeps in on hover.

### Layout & Theme
- Light page background (cream + soft mint radial gradients), proper dark text everywhere — fixed every reported visibility issue.
- Unified nav: glass-pastel header with rounded mega menus and dropdowns.
- Unified footer: deep forest pastel green (`#1c3127` → `#14241c` gradient) with mint accent column titles, pill location labels, accessible link colors.
- Hero: pastel mint gradient, dashed concentric rings around the practitioner image, dark Fraunces wordmark headline.
- Sections (Trust bar, About, Services, Why Calmyra, Specialized, Testimonials, Activate, Get Started, FAQ, CTA) all skinned to the pastel system.
- Inner service / coaching / assessment / team / legal pages inherit the light pastel surface; navy / black accents previously used in `relationship.css`, `assessment.css`, `coaching.css`, `team.css`, `legal.css` were sed-swapped to forest mint tones.
- Mobile: hamburger nav opens a full-width pastel sheet; grids collapse cleanly; hero stacks vertically; form fields become single-column.

### Code Tasks Completed
1. Created `/app/frontend/{package.json, server.js}` — tiny Express static server.
2. Created `/app/backend/{server.py, requirements.txt}` — minimal FastAPI placeholder.
3. Rewrote `/app/css/tokens.css` with the new pastel design tokens.
4. Rewrote `/app/css/calmyra-theme.css` with the new light base theme.
5. Authored `/app/css/pastel-overrides.css` (~24 themed sections) and injected `<link>` into all 46 HTML pages via sed.
6. Created empty `assets/css/design-system.css` and `assets/css/main.css` to silence 404s from legacy `<link>` tags.
7. Sed-swept dark navy / black hard-coded colors across `relationship.css`, `assessment.css`, `coaching.css`, `team.css`, `legal.css` → forest mint pastels.
8. Replaced default font stack from Cormorant Garamond → Fraunces (more distinctive editorial serif).

### Testing Done
- Visual QA across home, team, assessment, anxiety service page, couple counselling service page, mega menu, dropdown — all rendering with consistent pastel green theme and excellent text contrast.
- Mega menu opens with white card on click; coaching dropdown shows soft pastel hover.

## Known Items / Backlog
- P2: Replace remaining decorative legacy images (e.g., brain-illustration in assessment page) with on-brand pastel-green illustrations.
- P2: Polish the assessment page's "Explore More" pill — currently dark forest pill; could be unified with mint gradient style.
- P2: Add subtle scroll-reveal animations to service tiles and testimonial slides.
- P3: Cleanup dead CSS (`bridge.css` no longer referenced; could be deleted in a future pass).
- P3: Real form submission backend (current form is wired to `#` placeholder).

## Test Credentials
N/A (no auth on site).

## Next Action Items
- Gather user feedback on pastel green saturation and font weight balance.
- Replace any final placeholder imagery the user flags.
- (Optional) Wire the Get-Started form to `POST /api/contact` already stubbed in backend.
