const typingTexts = [
    "I ship production-ready executables",
    "Patterns are learned, not discovered",
    "Security-Focused Development",
    "Efficiency Obsessed"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector('.typing-text');

function typeText() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeText, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
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

const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(10, 15, 26, 0.98);
        padding: 20px;
        gap: 15px;
        border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    }
`;
document.head.appendChild(style);

console.log('🚀 Portfolio loaded successfully!');