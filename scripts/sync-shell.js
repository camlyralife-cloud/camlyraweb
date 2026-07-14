#!/usr/bin/env node
/* ============================================================
 *  Calmyra · Unified Header & Footer Sync
 *  Rewrites <nav id="navbar">…</nav> and <footer id="footer" class="site-footer">…</footer>
 *  in every .html page to one canonical template, with paths
 *  auto-adjusted for the file's directory depth.
 *
 *  Usage:  node scripts/sync-shell.js
 * ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE_DIRS = new Set(['node_modules', '.git', 'scripts', 'frontend', 'backend', 'memory', 'test_reports', 'tests', '.emergent']);

/* ---------- Canonical NAVBAR template ---------- */
/*   {BASE} is replaced with "", "../", "../../", etc. depending on depth. */
const NAVBAR_TEMPLATE = `<nav id="navbar" data-testid="site-nav">
            <div class="nav-container">
                <a href="{BASE}index.html" class="nav-brand" aria-label="Calmyra home" data-testid="brand-logo">
                    <img src="{BASE}assets/images/logo.png" alt="Calmyra — Where clarity meets calm" width="2000" height="2000" decoding="async" fetchpriority="high">
                </a>
                <div class="nav-menu" id="nav-menu">
                    <div class="nav-menu-primary">
                    <a href="{BASE}index.html" data-testid="nav-home">Home</a>
                    <a href="{BASE}team.html" data-testid="nav-about">About</a>
                    <div class="nav-mega-wrap">
                        <button type="button" class="nav-mega-btn" id="nav-mega-services-btn" aria-expanded="false"
                            aria-controls="mega-services-panel" aria-haspopup="true" data-testid="nav-services-btn">
                            Services
                            <span class="nav-mega-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="mega-panel" id="mega-services-panel" role="navigation" aria-label="India mental health and wellness services" hidden>
                            <div class="mega-market-banner mega-market-banner--india">
                                <span class="mega-market-banner-name">Calmyra India</span>
                                <span class="mega-market-banner-sub">Mental Health &amp; Wellness &middot; Bangalore</span>
                            </div>
                            <div class="mega-panel-inner mega-layout-grouped">
                                <div class="mega-group">
                                    <p class="mega-group-title">Therapy</p>
                                    <nav class="mega-group-nav" aria-label="Therapy and counselling">
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Anxiety.html">Anxiety &amp; Stress</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Mooddisorder.html">Depression &amp; Mood</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/PTSD.html">Trauma &amp; PTSD</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/OCD.html">OCD</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Postpartumdepression.html">Postpartum Depression</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Sleepingdisorder.html">Sleep Disorders</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Eatingdisorder.html">Eating Disorders</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Substanceabuse.html">Substance Abuse</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Personalitydisorder.html">Personality Disorders</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Phobias.html">Phobias</a>
                                        <a class="mega-group-link" href="{BASE}services/specific-disorders/Psychosis.html">Psychosis</a>
                                    </nav>
                                </div>
                                <div class="mega-group">
                                    <p class="mega-group-title">Relationships</p>
                                    <nav class="mega-group-nav" aria-label="Relationship services">
                                        <a class="mega-group-link" href="{BASE}services/relationship/couple-counselling.html">Couple Counselling</a>
                                        <a class="mega-group-link" href="{BASE}services/relationship/marriage-counselling.html">Marriage Counselling</a>
                                        <a class="mega-group-link" href="{BASE}services/relationship/pre-marital-counselling.html">Pre-Marital Counselling</a>
                                        <a class="mega-group-link" href="{BASE}services/relationship/divorce-counselling.html">Divorce Counselling</a>
                                        <a class="mega-group-link" href="{BASE}services/relationship/parent-counselling.html">Parental Counselling</a>
                                    </nav>
                                </div>
                                <div class="mega-group">
                                    <p class="mega-group-title">Specialist Care</p>
                                    <nav class="mega-group-nav" aria-label="Specialist care">
                                        <a class="mega-group-link" href="{BASE}assessment.html">Assessments</a>
                                        <a class="mega-group-link" href="{BASE}services/neuro-psychology.html">Neuro-Psychology</a>
                                        <a class="mega-group-link" href="{BASE}services/Teen-and-childern/adolescent-anxiety.html">Child &amp; Adolescent</a>
                                        <a class="mega-group-link mega-group-link--cta" href="{BASE}index.html#india-services">All India Services &rarr;</a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="{BASE}dr-safina.html" data-testid="nav-dr-safina">Dr. Safina</a>
                    <div class="nav-ns-wrap nav-coaching-wrap">
                        <button type="button" class="nav-ns-btn" id="nav-coaching-btn" aria-expanded="false"
                            aria-controls="coaching-dropdown-panel" aria-haspopup="true" data-testid="nav-coaching-btn">
                            Dubai
                            <span class="nav-ns-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="ns-dropdown ns-dropdown--personas" id="coaching-dropdown-panel" role="navigation" aria-label="Dubai coaching and consulting services" hidden>
                            <div class="ns-market-header ns-market-header--dubai">
                                <span class="ns-market-name">Calmyra Dubai</span>
                                <span class="ns-market-sub">Coaching &amp; Consulting &middot; UAE</span>
                            </div>
                            <div class="ns-dropdown-cols">
                                <div class="ns-dropdown-col">
                                    <p class="ns-dropdown-heading">By Your Profile</p>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/life-coaching.html">For Women</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/life-coaching.html">For Parents &amp; Families</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/career/Executivecoaching.html">For Executives &amp; Leaders</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/executive-wellness.html">For HNWI &amp; Founders</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/career/Leadership-Psychology.html">For CFO / CXO</a>
                                </div>
                                <div class="ns-dropdown-col">
                                    <p class="ns-dropdown-heading">Programmes</p>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/life-coaching.html">Life Coaching</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/mindset-coaching.html">Mindset Coaching</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/coaching/executive-wellness.html">Executive Wellness</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/career/Executivecoaching.html">Leadership Development</a>
                                    <a class="ns-dropdown-link" href="{BASE}services/career/Productivity.html">High-Performance Coaching</a>
                                    <a class="ns-dropdown-link ns-dropdown-link--cta" href="{BASE}index.html#dubai-services">All Dubai Programmes &rarr;</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="nav-actions">
                        <a href="tel:+917092099209" class="btn-nav-call" aria-label="Call Calmyra" data-testid="header-cta-call">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3l1.5 4L7 9.5a12 12 0 0 0 7.5 7.5l1.5-2.5 4 1.5v3a2 2 0 0 1-2.2 2C10.5 20.5 3.5 13.5 3 6.2A2 2 0 0 1 5 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                        </a>
                        <a href="https://wa.me/message/GQJZQIRBDB6AD1" class="btn btn-primary btn-nav btn-nav--book" data-testid="header-cta-book" target="_blank" rel="noopener">
                            <svg class="btn-nav-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 12A8.5 8.5 0 1 1 6.7 4.9L4 20l5.2-2.6A8.47 8.47 0 0 0 20.5 12z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                            <span>Book an Appointment</span>
                        </a>
                        <a href="{BASE}assets/calmyra-workbook.pdf" class="btn btn-secondary btn-nav btn-nav--workbook" download data-testid="header-cta-workbook">
                            <svg class="btn-nav-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M7.5 1.25v8.25M4.1 6.4l3.4 3.4 3.4-3.4M2.25 12.75h10.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            <span>Download Free Workbook</span>
                        </a>
                    </div>
                </div>
                <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu" data-testid="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>`;

/* ---------- Canonical FOOTER template ---------- */
const FOOTER_TEMPLATE = `<footer id="footer" class="site-footer" data-testid="site-footer">
        <div class="container footer-inner">
            <div class="footer-grid">
                <div class="footer-col footer-brand">
                    <a href="{BASE}index.html" class="footer-logo-link" aria-label="Calmyra home">
                        <img src="{BASE}assets/images/logo.png" alt="Calmyra — Where clarity meets calm" width="2000" height="2000" decoding="async">
                    </a>
                    <p class="footer-tagline">Where clarity meets calm.<br>Premium mental wellness — Dubai &middot; Bangalore &middot; Online.</p>
                    <div class="footer-cta-row">
                        <a href="https://wa.me/message/GQJZQIRBDB6AD1" class="btn btn-primary footer-cta" target="_blank" rel="noopener">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 12A8.5 8.5 0 1 1 6.7 4.9L4 20l5.2-2.6A8.47 8.47 0 0 0 20.5 12z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                            Book an Appointment
                        </a>
                        <a href="tel:+917092099209" class="footer-cta-call" aria-label="Call Calmyra">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3l1.5 4L7 9.5a12 12 0 0 0 7.5 7.5l1.5-2.5 4 1.5v3a2 2 0 0 1-2.2 2C10.5 20.5 3.5 13.5 3 6.2A2 2 0 0 1 5 4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
                        </a>
                    </div>
                    <ul class="footer-social" aria-label="Calmyra on social media">
                        <li><a href="https://www.facebook.com/profile.php?id=61563363544044&locale=en_GB" aria-label="Calmyra on Facebook" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 9h2.5V6H14c-1.93 0-3.5 1.57-3.5 3.5V12H8v3h2.5v6H14v-6h2.5l.5-3h-3V9.8c0-.44.36-.8.8-.8H14z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></a></li>
                        <li><a href="https://www.instagram.com/hearandheal_blr/" aria-label="Calmyra on Instagram" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor"/></svg></a></li>
                        <li><a href="https://wa.me/message/GQJZQIRBDB6AD1" aria-label="Message Calmyra on WhatsApp" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.65-1.22A9 9 0 1 0 12 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 8.7c.2-.5.4-.5.6-.5h.5c.16 0 .37 0 .53.4.2.5.6 1.5.65 1.6.06.13.1.28.02.45-.08.17-.13.28-.26.42-.13.15-.27.33-.39.45-.13.13-.26.27-.11.53.15.27.68 1.1 1.46 1.79 1 .88 1.85 1.16 2.11 1.29.27.13.42.11.58-.07.16-.18.65-.76.83-1.02.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.45.2.51.31.07.13.07.7-.16 1.38-.24.68-1.38 1.3-1.9 1.38-.5.09-1.02.13-2.9-.6-2.44-.97-4-3.44-4.16-3.6-.15-.16-1.26-1.67-1.26-3.2s.83-2.27 1.11-2.58z" fill="currentColor"/></svg></a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">India — Mental Health</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}services/specific-disorders/Anxiety.html">Anxiety &amp; Stress</a></li>
                        <li><a href="{BASE}services/specific-disorders/Mooddisorder.html">Depression &amp; Mood</a></li>
                        <li><a href="{BASE}services/specific-disorders/PTSD.html">Trauma &amp; PTSD</a></li>
                        <li><a href="{BASE}services/relationship/couple-counselling.html">Relationship Counselling</a></li>
                        <li><a href="{BASE}assessment.html">Psychological Assessments</a></li>
                        <li><a href="{BASE}services/Teen-and-childern/adolescent-anxiety.html">Child &amp; Adolescent</a></li>
                        <li><a href="{BASE}index.html#india-services" class="footer-link-cta">All India Services →</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Dubai — Coaching</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}services/coaching/life-coaching.html">Life Coaching</a></li>
                        <li><a href="{BASE}services/coaching/mindset-coaching.html">Mindset Coaching</a></li>
                        <li><a href="{BASE}services/coaching/executive-wellness.html">Executive Wellness</a></li>
                        <li><a href="{BASE}services/career/Executivecoaching.html">Leadership &amp; Development</a></li>
                        <li><a href="{BASE}services/career/Productivity.html">High-Performance Coaching</a></li>
                        <li><a href="{BASE}index.html#dubai-services" class="footer-link-cta">All Dubai Programmes →</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Company</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}team.html">About Us</a></li>
                        <li><a href="{BASE}dr-safina.html">Dr. Safina Naaz</a></li>
                        <li><a href="{BASE}index.html#get-started">Contact Us</a></li>
                        <li><a href="{BASE}privacy.html">Privacy Policy</a></li>
                        <li><a href="{BASE}terms.html">Terms &amp; Conditions</a></li>
                        <li><a href="{BASE}terms.html">Cancellation &amp; Refund Policy</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-visit" id="locations" aria-label="Clinic locations">
                <div class="footer-visit-card">
                    <span class="footer-address-label">Dubai Clinic</span>
                    <p class="footer-address">By appointment &middot; Dubai, UAE</p>
                    <p class="footer-contact-links">
                        <a href="mailto:dubai@calmyra.com"><svg class="footer-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4V6z" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6"/></svg>dubai@calmyra.com</a>
                    </p>
                </div>
                <div class="footer-visit-card">
                    <span class="footer-address-label">Bangalore Clinic</span>
                    <p class="footer-address">R H Plaza, 1st Floor, No. 3, Near Marks &amp; Spencer, 100 Feet Road, Ejipura, Koramangala, Bengaluru — 560047</p>
                    <p class="footer-contact-links">
                        <a href="tel:+917092099209"><svg class="footer-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3l1.5 4L7 9.5a12 12 0 0 0 7.5 7.5l1.5-2.5 4 1.5v3a2 2 0 0 1-2.2 2C10.5 20.5 3.5 13.5 3 6.2A2 2 0 0 1 5 4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>+91 70920 99209</a>
                        <a href="mailto:bangalore@calmyra.com"><svg class="footer-contact-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16v12H4V6z" stroke="currentColor" stroke-width="1.6"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6"/></svg>bangalore@calmyra.com</a>
                    </p>
                </div>
            </div>

            <div class="footer-helplines" aria-label="Emergency mental health helplines">
                <span class="footer-helplines-label">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-6.5-4.35-9.2-8.76C1.1 9.2 2.4 5.6 5.6 4.7c2-.56 3.9.2 5 1.9C11.7 5 13.6 4.14 15.6 4.7c3.2.9 4.5 4.5 2.8 7.54C15.7 16.65 12 21 12 21z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                    In crisis? Reach out now
                </span>
                <ul class="footer-helpline-list">
                    <li>UAE Aman <span>800 4673</span></li>
                    <li>UAE MOHAP <span>800 4673</span></li>
                    <li>India iCall <span>+91 9152987821</span></li>
                    <li>India Tele MANAS <span>14416</span></li>
                    <li>India NIMHANS <span>080 4611 0007</span></li>
                </ul>
            </div>

            <div class="footer-bottom-bar">
                <p class="footer-copyright footer-copyright--wide">Calmyra India: Registered Professionals &nbsp;&middot;&nbsp; Calmyra Dubai: Qualified Coaches &amp; Consultants &nbsp;&middot;&nbsp; &copy; <span data-year>2026</span> Calmyra Mental Wellness. All rights reserved.</p>
            </div>
        </div>
    </footer>`;

/* ---------- Helpers ---------- */
function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (IGNORE_DIRS.has(name) || name.startsWith('.')) continue;
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) walk(p, out);
    else if (stat.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

function baseFor(filePath) {
  const rel = path.relative(path.dirname(filePath), ROOT);
  if (!rel) return '';
  // Normalise to forward slashes + trailing slash
  return rel.split(path.sep).join('/') + '/';
}

function replaceBlock(html, openRegex, openTagName, closeTag, replacement) {
  const openMatch = html.match(openRegex);
  if (!openMatch) return { html, changed: false, found: false };
  const start = openMatch.index;
  // Walk forward, counting nested <openTagName ...> opens and closeTag closes
  // to find the MATCHING close for the opening tag we matched.
  const openTagRe = new RegExp('<' + openTagName + '(\\s|>)', 'g');
  const closeTagRe = new RegExp(closeTag.replace('/', '\\/'), 'g');
  openTagRe.lastIndex = start + 1;        // skip the opening tag we already matched
  closeTagRe.lastIndex = start + 1;
  let depth = 1;
  let pos = start + 1;
  while (depth > 0) {
    openTagRe.lastIndex = pos;
    closeTagRe.lastIndex = pos;
    const o = openTagRe.exec(html);
    const c = closeTagRe.exec(html);
    if (!c) return { html, changed: false, found: false };
    if (o && o.index < c.index) {
      depth++;
      pos = o.index + 1;
    } else {
      depth--;
      pos = c.index + closeTag.length;
      if (depth === 0) {
        const end = pos;
        const before = html.slice(0, start);
        const after = html.slice(end);
        return { html: before + replacement + after, changed: true, found: true };
      }
    }
  }
  return { html, changed: false, found: false };
}

function getIndent(html, openRegex) {
  const m = html.match(openRegex);
  if (!m) return '';
  const lineStart = html.lastIndexOf('\n', m.index) + 1;
  return html.slice(lineStart, m.index);
}

function syncFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const base = baseFor(filePath);
  const navHtml = NAVBAR_TEMPLATE.replace(/\{BASE\}/g, base);
  const footerHtml = FOOTER_TEMPLATE.replace(/\{BASE\}/g, base);

  // Replace navbar
  const navRegex = /<nav\s+id="navbar"[^>]*>/;
  const navIndent = getIndent(html, navRegex);
  const navIndented = navIndent + navHtml;
  const navResult = replaceBlock(html, navRegex, 'nav', '</nav>', navIndented);
  if (navResult.found) html = navResult.html;

  // Replace footer
  const footerRegex = /<footer\s+id="footer"[^>]*>/;
  const footerIndent = getIndent(html, footerRegex);
  const footerIndented = footerIndent + footerHtml;
  const footerResult = replaceBlock(html, footerRegex, 'footer', '</footer>', footerIndented);
  if (footerResult.found) html = footerResult.html;

  // Ensure pastel-overrides.css is linked (idempotent)
  if (!html.includes('css/pastel-overrides.css')) {
    html = html.replace(
      /(<link[^>]+href="[^"]*css\/styles\.css"[^>]*>)/,
      '$1\n    <link rel="stylesheet" href="' + base + 'css/pastel-overrides.css">'
    );
  }

  // Ensure shared JS is linked before </body>
  if (!html.includes('js/script.js')) {
    html = html.replace(
      /<\/body>/,
      '    <script src="' + base + 'js/script.js"></script>\n</body>'
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  return { nav: navResult.found, footer: footerResult.found };
}

/* ---------- Run ---------- */
const files = walk(ROOT);
let navCount = 0;
let footerCount = 0;
let total = 0;

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const r = syncFile(f);
  if (r.nav || r.footer) total++;
  if (r.nav) navCount++;
  if (r.footer) footerCount++;
  const tag = (r.nav ? 'N' : '-') + (r.footer ? 'F' : '-');
  console.log(`  [${tag}]  ${rel}`);
}

console.log(`\n✓ Synced ${total} file(s)  ·  navbars: ${navCount}  ·  footers: ${footerCount}`);
