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
                            India &middot; Mental Health
                            <span class="nav-mega-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="mega-panel" id="mega-services-panel" role="navigation" aria-label="India mental health services" hidden>
                            <div class="mega-market-banner mega-market-banner--india">
                                <span class="mega-market-banner-name">Calmyra India</span>
                                <span class="mega-market-banner-sub">Mental Health &amp; Wellness &middot; Bangalore</span>
                            </div>
                            <div class="mega-panel-inner mega-layout-grouped">
                                <div class="mega-group">
                                    <p class="mega-group-title">Therapy &amp; Counselling</p>
                                    <nav class="mega-group-nav" aria-label="Clinical therapy">
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
                                        <a class="mega-group-link" href="{BASE}assessment.html">Psychological Assessments</a>
                                        <a class="mega-group-link" href="{BASE}services/neuro-psychology.html">Neuro-Psychology</a>
                                        <a class="mega-group-link" href="{BASE}services/Teen-and-childern/adolescent-anxiety.html">Child &amp; Adolescent Psychology</a>
                                        <a class="mega-group-link mega-group-link--cta" href="{BASE}index.html#india-services">All India Services</a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nav-ns-wrap nav-coaching-wrap">
                        <button type="button" class="nav-ns-btn" id="nav-coaching-btn" aria-expanded="false"
                            aria-controls="coaching-dropdown-panel" aria-haspopup="true" data-testid="nav-coaching-btn">
                            Dubai &middot; Coaching
                            <span class="nav-ns-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="ns-dropdown ns-dropdown--wide" id="coaching-dropdown-panel" role="navigation" aria-label="Dubai coaching services" hidden>
                            <div class="ns-market-header ns-market-header--dubai">
                                <span class="ns-market-name">Calmyra Dubai</span>
                                <span class="ns-market-sub">Coaching &amp; Growth &middot; UAE</span>
                            </div>
                            <p class="ns-dropdown-heading">Personal Growth</p>
                            <a class="ns-dropdown-link" href="{BASE}services/coaching/life-coaching.html">Life Coaching</a>
                            <a class="ns-dropdown-link" href="{BASE}services/coaching/mindset-coaching.html">Mindset Coaching</a>
                            <a class="ns-dropdown-link" href="{BASE}services/career/Burnout.html">Confidence &amp; Self-Worth Coaching</a>
                            <p class="ns-dropdown-heading">Professional Excellence</p>
                            <a class="ns-dropdown-link" href="{BASE}services/coaching/executive-wellness.html">Executive Wellness Programme</a>
                            <a class="ns-dropdown-link" href="{BASE}services/career/Executivecoaching.html">Leadership &amp; Development</a>
                            <a class="ns-dropdown-link" href="{BASE}services/career/Productivity.html">High-Performance Coaching</a>
                            <a class="ns-dropdown-link ns-dropdown-link--cta" href="{BASE}index.html#dubai-services">All Dubai Services</a>
                        </div>
                    </div>
                    <a href="{BASE}assessment.html" data-testid="nav-assessment">Assessment</a>
                    <a href="{BASE}index.html#locations" data-testid="nav-locations">Locations</a>
                    </div>
                    <div class="nav-actions">
                        <a href="{BASE}index.html#get-started" class="btn btn-primary btn-sm" data-testid="header-book-cta">Book a Consultation</a>
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
                <div class="footer-col footer-brand" id="locations">
                    <a href="{BASE}index.html" class="footer-logo-link" aria-label="Calmyra home">
                        <img src="{BASE}assets/images/logo.png" alt="Calmyra — Where clarity meets calm" width="2000" height="2000" decoding="async">
                    </a>
                    <p class="footer-tagline">Where clarity meets calm. Premium mental wellness — Dubai · Bangalore · Online Worldwide.</p>
                    <div class="footer-contact-block">
                        <span class="footer-address-label">Dubai</span>
                        <p class="footer-address">By appointment &middot; Dubai, UAE</p>
                        <p class="footer-contact-links">
                            <a href="mailto:dubai@calmyra.com">dubai@calmyra.com</a>
                        </p>
                    </div>
                    <div class="footer-contact-block">
                        <span class="footer-address-label">Bangalore</span>
                        <p class="footer-address">R H Plaza, 1st Floor, No. 3<br>
                            Near Marks &amp; Spencer, 100 Feet Road<br>
                            Ejipura, Koramangala, Bengaluru — 560047</p>
                        <p class="footer-contact-links">
                            <a href="tel:+917092099209">+91 70920 99209</a><br>
                            <a href="mailto:bangalore@calmyra.com">bangalore@calmyra.com</a>
                        </p>
                    </div>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">India — Mental Health</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}services/specific-disorders/Anxiety.html">Clinical Therapy</a></li>
                        <li><a href="{BASE}services/relationship/couple-counselling.html">Relationship Counselling</a></li>
                        <li><a href="{BASE}assessment.html">Psychological Assessments</a></li>
                        <li><a href="{BASE}services/neuro-psychology.html">Neuro-Psychology</a></li>
                        <li><a href="{BASE}services/specific-disorders/Anxiety.html">Anxiety &amp; Stress</a></li>
                        <li><a href="{BASE}services/specific-disorders/Mooddisorder.html">Depression &amp; Mood</a></li>
                        <li><a href="{BASE}services/specific-disorders/PTSD.html">Trauma &amp; PTSD</a></li>
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
                        <li><a href="{BASE}services/career/Burnout.html">Confidence &amp; Self-Worth</a></li>
                        <li><a href="{BASE}index.html#dubai-services" class="footer-link-cta">All Dubai Services →</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Company</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}team.html">About Us</a></li>
                        <li><a href="{BASE}team.html">Our Team</a></li>
                        <li><a href="{BASE}dr-safina.html">Dr. Safina Naaz</a></li>
                        <li><a href="{BASE}assessment.html">Assessment</a></li>
                        <li><a href="{BASE}index.html#get-started">Careers</a></li>
                        <li><a href="{BASE}index.html#locations">Dubai Centre</a></li>
                        <li><a href="{BASE}index.html#locations">Bangalore Centre</a></li>
                        <li><a href="{BASE}index.html#get-started">Online</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Legal</h4>
                    <ul class="footer-col-list">
                        <li><a href="{BASE}privacy.html">Privacy Policy</a></li>
                        <li><a href="{BASE}terms.html">Terms &amp; Conditions</a></li>
                        <li><a href="{BASE}terms.html">Cancellation &amp; Refund Policy</a></li>
                        <li><a href="{BASE}privacy.html">Cookie Policy</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4 class="footer-col-title">Emergency Helplines</h4>
                    <ul class="footer-helpline-list">
                        <li>UAE: Aman — 800 4673 (free, 24/7)</li>
                        <li>UAE: MOHAP Mental Health — 800 4673</li>
                        <li>India: iCall — +91 9152987821</li>
                        <li>India: Tele MANAS — 14416</li>
                        <li>India: NIMHANS — 080 4611 0007</li>
                    </ul>
                </div>
            </div>
            <div class="footer-scope-notice" aria-label="Scope of service — Dubai coaching">
                <p><strong>Scope of service (Calmyra Dubai):</strong> Coaching and consulting programmes are developmental and performance-focused. They are not clinical psychology, diagnosis, or mental-health treatment, and are provided independently of any DHA-licensed clinical service. Where a clinical need is identified, we refer you to an appropriately licensed professional.</p>
            </div>
            <div class="footer-bottom-bar">
                <p class="footer-copyright footer-copyright--wide">Calmyra India: RCI Registered Professionals &nbsp;&middot;&nbsp; Calmyra Dubai: Qualified Coaches &amp; Consultants &nbsp;&middot;&nbsp; &copy; <span data-year>2026</span> Calmyra Mental Wellness. All rights reserved.</p>
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
