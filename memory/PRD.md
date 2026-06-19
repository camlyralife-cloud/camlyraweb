# Calmyra Mental Wellness — Website Rebrand PRD

## Original Problem Statement
The user (Mahi-kehkasha / camlyralife-cloud) brought an existing static HTML/CSS/JS therapy/wellness website (Calmyra Mental Wellness — Dubai & Bangalore) and asked for: a single unified header/logo across every page, clearer logo visibility, premium pastel light-green design polish, scroll-reveal animations, premium CTA buttons, smooth/sticky/responsive behaviour, and full mobile/tablet/desktop responsiveness. They imported the existing GitHub repo `camlyralife-cloud/camlyraweb` and asked the agent to work directly on it.

## Stack
- Pure HTML / CSS / vanilla JS (no React, no build step).
- Express static server on `:3000` (`/app/frontend/server.js`).
- Stub FastAPI backend on `:8001` exposing `/api/health` only (`/app/backend/server.py`).
- 45+ HTML pages: root pages (`index`, `team`, `dr-safina`, `assessment`, `privacy`, `terms`) and deep service pages under `/services/{relationship,specific-disorders,coaching,career,group-therapy,geriatrics,life-crises,Teen-and-childern}/`.
- CSS: existing design system in `css/styles.css` (~4800 lines) + `css/pastel-overrides.css` (now ~1350 lines incl. v2 polish).

## What's Implemented
- **Unified header & footer (2026-06-19)** — wrote `scripts/sync-shell.js`, an idempotent Node.js sync that walks every `.html` file and replaces `<nav id="navbar">…</nav>` and `<footer id="footer" class="site-footer">…</footer>` with one canonical template, auto-resolving `{BASE}` (relative path) by directory depth and using a balanced-tag matcher (handles inner `<nav class="mega-group-nav">…</nav>` correctly). Synced 46 files.
- **Canonical header** = brand-logo (Calmyra) + Home / About / Services▾ (3-column mega-panel: Clinical Therapy / Relationships / Specialist Care) / Coaching▾ / Assessment / Locations + "Book a Consultation" CTA + hamburger toggle.
- **Canonical footer** = 5 columns (Brand+contact / Services / Company / Legal / Emergency helplines) + DHA + RCI copyright with `[data-year]` auto-stamp.
- **`data-testid` attributes** added to all interactive header & footer elements (`site-nav`, `brand-logo`, `nav-home`, `nav-about`, `nav-services-btn`, `nav-coaching-btn`, `nav-assessment`, `nav-locations`, `header-book-cta`, `nav-toggle`, `site-footer`).
- **Premium polish layer** appended to `css/pastel-overrides.css` (section 25): sticky-header blur, logo hover lift, nav-link underline grow, CTA premium hover (`translateY(-2px)` + soft shadow), accessible focus rings, scroll-reveal CSS, premium card hover, mobile/tablet logo + nav tuning.
- **JS polish layer** appended to `js/script.js`: auto-tags common section blocks as `.reveal`, IntersectionObserver-driven `.is-visible`, active-nav highlighting (anchor-aware so /index.html → only `nav-home` lights up, NOT `nav-locations`), `[data-year]` stamp.
- **Bug fix**: mega-services-panel was previously visible by default on inner pages because the old team.html / inner pages had a different nav structure that left orphan tags. The sync script now cleanly replaces the entire navbar block. Verified `[hidden]` is respected at page load on every page.

## Test Status (iteration 2)
- 100% frontend pass (12/12 verification categories) on 9 representative pages including deep `/services/` paths.
- Single cosmetic note: brand wordmark could be slightly bolder on mobile (logo asset is original repo's `assets/images/logo.png` — left untouched per "preserve existing branding").
- No backend tests required (stub `/api/health` confirmed 200).

## How to Extend
- To change header / footer site-wide: edit `scripts/sync-shell.js` (NAVBAR_TEMPLATE / FOOTER_TEMPLATE), then `node scripts/sync-shell.js`. Idempotent.
- To add a CSS rule: append to `css/pastel-overrides.css` (section 25+).
- To add JS behaviour: append to `js/script.js` (avoid touching the existing functions which power the mega-menu).

## Files Touched This Session
- `scripts/sync-shell.js` (new)
- `index.html`, `team.html`, `dr-safina.html`, `assessment.html`, `privacy.html`, `terms.html`, and 40 service pages (header + footer regenerated)
- `css/pastel-overrides.css` (appended ~120 lines of v2 polish)
- `js/script.js` (appended ~70 lines: reveal observer + active-nav + year stamp)

## Backlog (P1 / P2)
- (P2) Replace `assets/images/logo.png` with a slightly bolder version for better mobile contrast — optional.
- (P2) Fix the duplicate `id="locations"` on `/index.html` (one on the in-page section, one on the footer brand col). Browsers handle it but it's invalid HTML.
- (P2) `services/Teen-and-childern/school-stress.html` is a 0-byte file in the repo — sync script skipped it. Pre-existing; flag for content team.
