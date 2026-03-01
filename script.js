
// Custom Cursor with Trailing Animation
const cursorDot = document.querySelector('.cursor-dot');
const cursorTrails = document.querySelectorAll('.cursor-trail');

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;

// Trail positions array
const trailPositions = cursorTrails.map ? cursorTrails.map(() => ({ x: 0, y: 0 })) : Array.from(cursorTrails).map(() => ({ x: 0, y: 0 }));

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation loop for smooth cursor movement
function animateCursor() {
    // Smooth follow for main dot
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    
    if (cursorDot) {
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
    }
    
    // Animate trails with increasing delay
    cursorTrails.forEach((trail, index) => {
        const delay = (index + 1) * 0.15;
        trailPositions[index].x += (dotX - trailPositions[index].x) * (0.3 - index * 0.04);
        trailPositions[index].y += (dotY - trailPositions[index].y) * (0.3 - index * 0.04);
        
        trail.style.left = trailPositions[index].x + 'px';
        trail.style.top = trailPositions[index].y + 'px';
    });
    
    requestAnimationFrame(animateCursor);
}

// Start animation
if (cursorDot && cursorTrails.length > 0) {
    animateCursor();
}

// Hover effect on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .philosophy-card, .skill-icon, .nav-toggle');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorDot) cursorDot.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        if (cursorDot) cursorDot.classList.remove('hover');
    });
});

// Handle mouse leaving/entering window
document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    cursorTrails.forEach(trail => trail.style.opacity = '0');
});

document.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    cursorTrails.forEach((trail, index) => {
        trail.style.opacity = 0.6 - (index * 0.1);
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');

const navbarObserver = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    },
    { threshold: 0.1 }
);

if (heroSection) {
    navbarObserver.observe(heroSection);
}

// Scroll Spy - Update nav links based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100; // Offset for navbar height
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Run scroll spy on scroll and on page load
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

const contactForm = document.querySelector('#contact-form');
const thankYouPage = document.querySelector('#thank-you-page');
const backToContactBtn = document.querySelector('#back-to-contact');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        document.querySelector('.contact-form').style.display = 'none';
        thankYouPage.style.display = 'flex';

        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        );

        window.open(`mailto:yuvrajsarathe07@gmail.com?subject=${subject}&body=${body}`, '_blank');
    });
}

if (backToContactBtn) {
    backToContactBtn.addEventListener('click', (e) => {
        e.preventDefault();

        thankYouPage.style.display = 'none';
        document.querySelector('.contact-form').style.display = 'block';

        if (contactForm) {
            contactForm.reset();
        }
    });
}

const backToTop = document.querySelector('.back-to-top');

const backToTopObserver = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    },
    { threshold: 0.1 }
);

if (heroSection && backToTop) {
    backToTopObserver.observe(heroSection);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .project-card, .achievement-card, .philosophy-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

document.querySelectorAll('.project-card, .achievement-card, .philosophy-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

console.log('🚀 Portfolio loaded successfully!');