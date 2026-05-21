'use strict';

/* ═══════════════════════════════════════════════════════════
   THEME SYSTEM
   ═══════════════════════════════════════════════════════════ */
const THEMES = [
    { id: 'obsidian',   label: 'Obsidian' },
    { id: 'phosphor',   label: 'Phosphor' },
    { id: 'manuscript', label: 'Manuscript' },
    { id: 'alabaster',  label: 'Alabaster' },
];

let currentThemeIdx = 0;
let themeSwitchTimer = null;

function loadTheme() {
    const saved = localStorage.getItem('portfolio-theme');
    const idx   = THEMES.findIndex(t => t.id === saved);
    currentThemeIdx = idx >= 0 ? idx : 0;
    applyTheme(THEMES[currentThemeIdx], true);
}

function applyTheme(theme, immediate) {
    if (immediate) {
        document.documentElement.setAttribute('data-theme', theme.id);
    } else {
        document.documentElement.setAttribute('data-theme-switching', '');
        document.documentElement.setAttribute('data-theme', theme.id);
        clearTimeout(themeSwitchTimer);
        themeSwitchTimer = setTimeout(() => {
            document.documentElement.removeAttribute('data-theme-switching');
        }, 20);
    }
    localStorage.setItem('portfolio-theme', theme.id);
}

function cycleTheme() {
    currentThemeIdx = (currentThemeIdx + 1) % THEMES.length;
    applyTheme(THEMES[currentThemeIdx]);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════ */
function setupScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop    = window.scrollY;
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width    = pct + '%';
    }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   NAV — scroll effect + scroll spy
   ═══════════════════════════════════════════════════════════ */
function setupNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], header[id]');

    const onScroll = () => {
        const offset = 90;
        let current  = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - offset) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU — Full-screen overlay
   ═══════════════════════════════════════════════════════════ */
function setupMobileMenu() {
    const hamburger    = document.getElementById('hamburger');
    const overlay      = document.getElementById('mobileOverlay');
    if (!hamburger || !overlay) return;

    const closeMenu = () => {
        hamburger.classList.remove('is-open');
        overlay.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        hamburger.classList.add('is-open');
        overlay.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    overlay.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeMenu();
        }
    });
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   ═══════════════════════════════════════════════════════════ */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href   = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS (IntersectionObserver) — blur reveal
   ═══════════════════════════════════════════════════════════ */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Toggle will-change for GPU acceleration
                el.classList.add('will-change-pulse');
                requestAnimationFrame(() => {
                    el.classList.add('is-visible');
                    // Remove will-change after transition completes
                    setTimeout(() => {
                        el.classList.remove('will-change-pulse');
                    }, 1000);
                });
                observer.unobserve(el);
            }
        });
    }, {
        threshold:   0.08,
        rootMargin: '0px 0px -60px 0px',
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP BUTTON
   ═══════════════════════════════════════════════════════════ */
function setupBackToTop() {
    const btn = document.getElementById('backTop');
    if (!btn) return;

    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver(([entry]) => {
        btn.hidden = entry.isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(heroSection);
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — with real validation
   ═══════════════════════════════════════════════════════════ */
function setupContactForm() {
    const form      = document.getElementById('contactForm');
    const thankYou  = document.getElementById('thankYou');
    const backBtn   = document.getElementById('backToForm');
    if (!form || !thankYou) return;

    // Field validators
    const validators = {
        name:    v => v.trim().length >= 2    ? '' : 'Name must be at least 2 characters.',
        email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
        subject: v => v.trim().length >= 3    ? '' : 'Subject must be at least 3 characters.',
        message: v => v.trim().length >= 10   ? '' : 'Message must be at least 10 characters.',
    };

    function showError(fieldId, msg) {
        const input = document.getElementById(fieldId);
        const err   = document.getElementById(fieldId + 'Error');
        if (input) input.classList.toggle('is-invalid', !!msg);
        if (err)   err.textContent = msg;
    }

    function validateField(fieldId, value) {
        const fn  = validators[fieldId];
        const msg = fn ? fn(value) : '';
        showError(fieldId, msg);
        return !msg;
    }

    // Live validation on blur
    ['name', 'email', 'subject', 'message'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => validateField(id, el.value));
        el.addEventListener('input', () => {
            if (el.classList.contains('is-invalid')) {
                validateField(id, el.value);
            }
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const nameEl    = document.getElementById('name');
        const emailEl   = document.getElementById('email');
        const subjectEl = document.getElementById('subject');
        const msgEl     = document.getElementById('message');

        const valid = [
            validateField('name',    nameEl?.value    || ''),
            validateField('email',   emailEl?.value   || ''),
            validateField('subject', subjectEl?.value || ''),
            validateField('message', msgEl?.value     || ''),
        ].every(Boolean);

        if (!valid) return;

        // Open mailto
        const subj = encodeURIComponent(subjectEl.value);
        const body = encodeURIComponent(
            `Name: ${nameEl.value}\nEmail: ${emailEl.value}\n\nMessage:\n${msgEl.value}`
        );
        window.open(`mailto:yuvrajsarathe07@gmail.com?subject=${subj}&body=${body}`, '_blank');

        // Show thank you
        form.hidden        = true;
        thankYou.hidden    = false;
    });

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            form.reset();
            form.hidden     = false;
            thankYou.hidden = true;
            ['name','email','subject','message'].forEach(id => showError(id, ''));
        });
    }
}

/* ═══════════════════════════════════════════════════════════
   CLICKSPARK — animated sparks on click (port of React Bits)
   ═══════════════════════════════════════════════════════════ */
function setupClickSpark() {
    const canvas = document.createElement('canvas');
    canvas.className = 'click-spark-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let sparks = [];
    let raf;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function getAccentColor() {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--accent').trim() || '#e8704a';
    }

    function handleClick(e) {
        const sparkColor = getAccentColor();
        const sparkCount = 8;
        const sparkSize = 10;
        const sparkRadius = 15;
        const duration = 400;
        const extraScale = 1;
        const now = performance.now();

        for (let i = 0; i < sparkCount; i++) {
            const angle = (2 * Math.PI * i) / sparkCount;
            sparks.push({
                x: e.clientX,
                y: e.clientY,
                angle,
                startTime: now
            });
        }

        if (!raf) {
            raf = requestAnimationFrame(draw);
        }
    }

    function draw(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const sparkColor = getAccentColor();

        sparks = sparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= 400) return false;

            const progress = elapsed / 400;
            const eased = progress * (2 - progress);
            const distance = eased * 15 * 1;
            const lineLength = 10 * (1 - eased);

            const x1 = spark.x + distance * Math.cos(spark.angle);
            const y1 = spark.y + distance * Math.sin(spark.angle);
            const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
            const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

            ctx.strokeStyle = sparkColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            return true;
        });

        if (sparks.length > 0) {
            raf = requestAnimationFrame(draw);
        } else {
            raf = null;
        }
    }

    document.addEventListener('click', handleClick);

    // Re-read accent on theme toggle
    window.__sparkAccent = getAccentColor;
}

/* ═══════════════════════════════════════════════════════════
    HERO — stagger on load with blur reveal
   ═══════════════════════════════════════════════════════════ */
function setupHeroEntrance() {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                if (el.closest('.hero')) {
                    el.classList.add('will-change-pulse');
                    el.classList.add('is-visible');
                    setTimeout(() => el.classList.remove('will-change-pulse'), 1000);
                }
            });
        });
    });
}

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setupScrollProgress();
    setupNav();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
    setupBackToTop();
    setupContactForm();
    setupHeroEntrance();
    setupClickSpark();

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', () => {
        cycleTheme();
        if (window.__updateCursorTrail) window.__updateCursorTrail();
    });
});