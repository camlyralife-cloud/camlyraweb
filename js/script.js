// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function setMobileNavOpen(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('active', open);
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    if (open) {
        closeAllNavDropdowns();
    }
}

function isMobileNavLayout() {
    return window.matchMedia('(max-width: 768px)').matches;
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        setMobileNavOpen(!navMenu.classList.contains('active'));
    });
}

window.addEventListener('resize', function() {
    if (!isMobileNavLayout()) {
        setMobileNavOpen(false);
    }
});

document.addEventListener('click', function(e) {
    if (!navMenu || !navMenu.classList.contains('active')) return;
    if (e.target.closest('.nav-container')) return;
    setMobileNavOpen(false);
});

if (navMenu) {
    navMenu.querySelectorAll('a[href]').forEach(function(link) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) return;
        link.addEventListener('click', function() {
            setMobileNavOpen(false);
        });
    });
}

function closeMegaServices() {
    const wrap = document.querySelector('.nav-mega-wrap');
    const btn = document.getElementById('nav-mega-services-btn');
    const panel = document.getElementById('mega-services-panel');
    if (!wrap || !btn || !panel) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('hidden', '');
}

function closeNewServicesNav() {
    const wrap = document.querySelector('.nav-ns-wrap:not(.nav-coaching-wrap)');
    const btn = document.getElementById('nav-ns-btn');
    const panel = document.getElementById('ns-dropdown-panel');
    if (!wrap || !btn || !panel) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('hidden', '');
}

function closeCoachingNav() {
    const wrap = document.querySelector('.nav-coaching-wrap');
    const btn = document.getElementById('nav-coaching-btn');
    const panel = document.getElementById('coaching-dropdown-panel');
    if (!wrap || !btn || !panel) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('hidden', '');
}

function closeAllNavDropdowns() {
    closeMegaServices();
    closeNewServicesNav();
    closeCoachingNav();
}

function openMegaServices() {
    closeNewServicesNav();
    closeCoachingNav();
    const wrap = document.querySelector('.nav-mega-wrap');
    const btn = document.getElementById('nav-mega-services-btn');
    const panel = document.getElementById('mega-services-panel');
    if (!wrap || !btn || !panel) return;
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
}

function toggleMegaServices() {
    const wrap = document.querySelector('.nav-mega-wrap');
    if (wrap && wrap.classList.contains('is-open')) {
        closeMegaServices();
    } else {
        openMegaServices();
    }
}

function showMegaL2Set(l1) {
    document.querySelectorAll('.mega-l2-set').forEach((set) => {
        set.hidden = set.dataset.l1 !== l1;
    });
}

function showMegaL3Set(l1, l2) {
    document.querySelectorAll('.mega-l3-set').forEach((set) => {
        const match = set.dataset.l1 === l1 && set.dataset.l2 === l2;
        set.hidden = !match;
    });
}

function syncFlyoutMode(l1) {
    const flyouts = document.getElementById('mega-flyouts');
    if (!flyouts) return;
    flyouts.classList.toggle('mega-flyouts--single', l1 !== 'individual');
}

function initMegaMenu() {
    const wrap = document.querySelector('.nav-mega-wrap');
    const btn = document.getElementById('nav-mega-services-btn');
    const panel = document.getElementById('mega-services-panel');
    if (!wrap || !btn || !panel) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMegaServices();
    });

    document.querySelectorAll('.mega-l1-btn').forEach((b) => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const l1 = b.dataset.l1;
            document.querySelectorAll('.mega-l1-btn').forEach((x) => x.classList.remove('is-active'));
            b.classList.add('is-active');
            showMegaL2Set(l1);
            syncFlyoutMode(l1);
            const activeSet = document.querySelector('.mega-l2-set[data-l1="' + l1 + '"]');
            if (!activeSet) return;
            const firstL2 = activeSet.querySelector('.mega-l2-btn');
            document.querySelectorAll('.mega-l2-btn').forEach((x) => x.classList.remove('is-active'));
            if (firstL2) {
                firstL2.classList.add('is-active');
                showMegaL3Set(l1, firstL2.dataset.l2);
            } else {
                document.querySelectorAll('.mega-l3-set').forEach((s) => {
                    s.hidden = true;
                });
            }
        });
    });

    document.querySelectorAll('.mega-l2-btn').forEach((b) => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const l1 = b.dataset.l1;
            const l2 = b.dataset.l2;
            const set = b.closest('.mega-l2-set');
            if (!set) return;
            set.querySelectorAll('.mega-l2-btn').forEach((x) => x.classList.remove('is-active'));
            b.classList.add('is-active');
            showMegaL3Set(l1, l2);
        });
    });

    document.addEventListener('click', () => {
        closeAllNavDropdowns();
    });

    panel.addEventListener('click', (e) => e.stopPropagation());
}

function initNewServicesNav() {
    const wrap = document.querySelector('.nav-ns-wrap:not(.nav-coaching-wrap)');
    const btn = document.getElementById('nav-ns-btn');
    const panel = document.getElementById('ns-dropdown-panel');
    if (!wrap || !btn || !panel) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrap.classList.contains('is-open')) {
            closeNewServicesNav();
        } else {
            closeMegaServices();
            closeCoachingNav();
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            panel.removeAttribute('hidden');
        }
    });

    panel.addEventListener('click', (e) => e.stopPropagation());
}

function initCoachingNav() {
    const wrap = document.querySelector('.nav-coaching-wrap');
    const btn = document.getElementById('nav-coaching-btn');
    const panel = document.getElementById('coaching-dropdown-panel');
    if (!wrap || !btn || !panel) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (wrap.classList.contains('is-open')) {
            closeCoachingNav();
        } else {
            closeMegaServices();
            closeNewServicesNav();
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            panel.removeAttribute('hidden');
        }
    });

    panel.addEventListener('click', (e) => e.stopPropagation());
}

initMegaMenu();
initNewServicesNav();
initCoachingNav();

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllNavDropdowns();
        setMobileNavOpen(false);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }
        e.preventDefault();
        closeAllNavDropdowns();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            if (href.startsWith('#service-')) {
                const preview = document.getElementById('service-preview-image');
                const src = target.getAttribute('data-image-src');
                if (preview && src) {
                    preview.src = src;
                }
                document.querySelectorAll('.service-line').forEach((line) => line.classList.remove('active'));
                if (target.classList.contains('service-line')) {
                    target.classList.add('active');
                }
            }
            setMobileNavOpen(false);
        }
    });
});

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe sections for fade-in
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Service image hover preview
const serviceLines = document.querySelectorAll('.service-line[data-image-src]');
const previewImage = document.getElementById('service-preview-image');
const defaultImage = previewImage ? previewImage.src : '';

serviceLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
        const imageSrc = line.getAttribute('data-image-src');
        if (previewImage && imageSrc) {
            previewImage.src = imageSrc;
        }
        serviceLines.forEach(item => item.classList.remove('active'));
        line.classList.add('active');
    });

    line.addEventListener('mouseleave', () => {
        if (previewImage && defaultImage) {
            previewImage.src = defaultImage;
        }
        line.classList.remove('active');
    });

    line.addEventListener('focus', () => {
        const imageSrc = line.getAttribute('data-image-src');
        if (previewImage && imageSrc) {
            previewImage.src = imageSrc;
        }
        serviceLines.forEach(item => item.classList.remove('active'));
        line.classList.add('active');
    });

    line.addEventListener('blur', () => {
        if (previewImage && defaultImage) {
            previewImage.src = defaultImage;
        }
        line.classList.remove('active');
    });
});

// Testimonial carousel controls
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');

function showTestimonial(index) {
    testimonialSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
    });
    testimonialDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => showTestimonial(index));
});

// FAQ accordion (single open item)
const faqItems = document.querySelectorAll('.faq-item');

function setFaqItemOpen(item, open) {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    item.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
        panel.removeAttribute('hidden');
    } else {
        panel.setAttribute('hidden', '');
    }
}

faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
        const opening = !item.classList.contains('is-open');
        faqItems.forEach((other) => setFaqItemOpen(other, false));
        if (opening) {
            setFaqItemOpen(item, true);
        }
    });
});

// Get Started form (static site — no backend; show feedback only)
const getStartedForm = document.getElementById('get-started-form');
const getStartedNote = document.getElementById('get-started-form-note');

if (getStartedForm && getStartedNote) {
    getStartedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!getStartedForm.checkValidity()) {
            getStartedForm.reportValidity();
            return;
        }
        getStartedNote.hidden = false;
        getStartedNote.classList.remove('is-error');
        getStartedNote.textContent = 'Thank you — we will respond within 4 working hours.';
        getStartedForm.reset();
    });
}

// Specialized services stacked scroll reveal
function initSpecializedServicesScroll() {
    const section = document.getElementById('specialized-services');
    if (!section) return;

    const refCards = Array.from(section.querySelectorAll('.specialized-ref-card[data-service]'));
    const refLabels = Array.from(section.querySelectorAll('.specialized-ref-label[data-service]'));
    const hasReferenceMapping = refCards.length && refLabels.length;

    if (hasReferenceMapping) {
        let activeService = refCards[0].getAttribute('data-service');

        function setReferenceActive(serviceValue) {
            activeService = serviceValue;
            refCards.forEach((card) => {
                const isActive = card.getAttribute('data-service') === serviceValue;
                card.classList.toggle('active', isActive);
                card.classList.toggle('is-active', isActive);
            });
            refLabels.forEach((label) => {
                const isActive = label.getAttribute('data-service') === serviceValue;
                label.classList.toggle('active', isActive);
                label.classList.toggle('is-active', isActive);
                label.setAttribute('aria-pressed', String(isActive));
            });
        }

        function syncReferenceWithScroll() {
            if (window.matchMedia('(max-width: 900px)').matches) {
                setReferenceActive(refCards[0].getAttribute('data-service'));
                return;
            }

            const sectionRect = section.getBoundingClientRect();
            const sectionScrollable = Math.max(1, section.offsetHeight - window.innerHeight);
            const scrolledWithinSection = Math.max(0, Math.min(sectionScrollable, -sectionRect.top));
            const progress = scrolledWithinSection / sectionScrollable;
            const nextIndex = Math.min(refCards.length - 1, Math.floor(progress * refCards.length));
            const nextService = refCards[nextIndex].getAttribute('data-service');
            if (nextService !== activeService) {
                setReferenceActive(nextService);
            }
        }

        refLabels.forEach((label) => {
            label.addEventListener('click', () => {
                const serviceValue = label.getAttribute('data-service');
                if (!serviceValue) return;
                setReferenceActive(serviceValue);

                const targetCard = refCards.find((card) => card.getAttribute('data-service') === serviceValue);
                targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        setReferenceActive(activeService);
        syncReferenceWithScroll();
        window.addEventListener('scroll', syncReferenceWithScroll, { passive: true });
        window.addEventListener('resize', syncReferenceWithScroll);
        return;
    }

    const cards = Array.from(section.querySelectorAll('.specialized-card'));
    const navPills = Array.from(section.querySelectorAll('.specialized-nav-pill'));
    if (!cards.length) return;
    // If pills are not interactive controls (no indices), skip scroll-story mode.
    const hasIndexedControls = navPills.some((pill) => pill.hasAttribute('data-service-index'));
    if (!hasIndexedControls) return;

    let activeIndex = 0;

    function setActiveIndex(nextIndex) {
        activeIndex = Math.max(0, Math.min(cards.length - 1, nextIndex));
        cards.forEach((card, idx) => {
            card.classList.toggle('is-revealed', idx <= activeIndex);
            card.classList.toggle('is-active', idx === activeIndex);
        });
        navPills.forEach((pill, idx) => {
            pill.classList.toggle('is-active', idx === activeIndex);
        });
    }

    function syncWithScroll() {
        // On smaller screens keep all cards open and disable scroll-story behavior.
        if (window.matchMedia('(max-width: 900px)').matches) {
            cards.forEach((card, idx) => {
                card.classList.add('is-revealed');
                card.classList.toggle('is-active', idx === 0);
            });
            navPills.forEach((pill, idx) => pill.classList.toggle('is-active', idx === 0));
            return;
        }

        // Sticky-story progress: map section scroll progress to one active card.
        const sectionRect = section.getBoundingClientRect();
        const sectionScrollable = Math.max(1, section.offsetHeight - window.innerHeight);
        const scrolledWithinSection = Math.max(0, Math.min(sectionScrollable, -sectionRect.top));
        const progress = scrolledWithinSection / sectionScrollable;
        const nextIndex = Math.min(cards.length - 1, Math.floor(progress * cards.length));
        if (nextIndex !== activeIndex) {
            setActiveIndex(nextIndex);
        }
    }

    navPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const idx = Number(pill.getAttribute('data-service-index'));
            if (Number.isNaN(idx)) return;
            setActiveIndex(idx);
            cards[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });

    setActiveIndex(0);
    syncWithScroll();
    window.addEventListener('scroll', syncWithScroll, { passive: true });
    window.addEventListener('resize', syncWithScroll);
}

initSpecializedServicesScroll();

// Fold specialized service cards while scrolling through section
function initSpecializedServicesFoldState() {
    const section = document.getElementById('specialized-services');
    if (!section) return;
    if (section.classList.contains('section-specialized-reference')) return;

    function updateFoldState() {
        if (window.matchMedia('(max-width: 900px)').matches) {
            section.classList.remove('is-folded');
            return;
        }

        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // Start folding earlier and keep it stable while section is in view.
        const shouldFold = rect.top < vh * 0.28 && rect.bottom > vh * 0.28;
        section.classList.toggle('is-folded', shouldFold);
    }

    updateFoldState();
    window.addEventListener('scroll', updateFoldState, { passive: true });
    window.addEventListener('resize', updateFoldState);
}

initSpecializedServicesFoldState();
/* ============================================================
   ─── Calmyra · Premium polish (v2) — additive only
   • Scroll reveal (IntersectionObserver)
   • Active-nav highlighting
   • [data-year] stamp
   ============================================================ */
(function () {
  'use strict';

  // ---------- Auto-tag common section blocks as .reveal (without changing HTML) ----------
  const AUTO_REVEAL_SELECTOR = [
    '.team-hero-inner', '.team-stats', '.team-card',
    '.assessment-hero-card', '.ass-q-card', '.ass-section',
    '.relationship-hero', '.pf-row', '.pf-side', '.insight-card',
    '.legal-section',
    '.svc-row',
    '.section-eyebrow', '.section-title',
    '.new-service-card', '.coaching-card', '.testimonial-card',
    '.hero-copy', '.hero-visual',
    '.footer-col'
  ].join(', ');
  document.querySelectorAll(AUTO_REVEAL_SELECTOR).forEach(el => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-stagger')) {
      el.classList.add('reveal');
    }
  });

  // ---------- IntersectionObserver-driven reveal ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Active-nav link highlight ----------
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHomePage = (here === 'index.html' || here === '');
  const navLinks = document.querySelectorAll('.nav-menu-primary > a, .nav-menu-primary > .nav-mega-wrap > .nav-mega-btn, .nav-menu-primary > .nav-ns-wrap > .nav-ns-btn');
  navLinks.forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (!href) return;
    const [pathPart, hashPart] = href.split('#');
    const target = (pathPart.split('/').pop() || 'index.html');
    // Only mark "current" for page-level matches (anchors on home page shouldn't all light up)
    if (hashPart) {
      // anchor link — only highlight if we're on its page AND it's the canonical Home anchor (#hero)
      if (target === here && hashPart === 'hero' && isHomePage) a.classList.add('is-current');
    } else {
      if (target === here) a.classList.add('is-current');
    }
  });

  // ---------- Year stamp ----------
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
