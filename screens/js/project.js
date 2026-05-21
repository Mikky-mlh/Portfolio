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
   SCROLL ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('will-change-pulse');
                requestAnimationFrame(() => {
                    el.classList.add('is-visible');
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

    const heroSection = document.querySelector('.project-hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver(([entry]) => {
        btn.hidden = entry.isIntersecting;
    }, { threshold: 0.1 });

    observer.observe(heroSection);
}

/* ═══════════════════════════════════════════════════════════
   HERO ENTRANCE
   ═══════════════════════════════════════════════════════════ */
function setupHeroEntrance() {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll('[data-reveal]').forEach(el => {
                if (el.closest('.project-hero')) {
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
    setupScrollAnimations();
    setupBackToTop();
    setupHeroEntrance();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', cycleTheme);
});
