// Typing Animation
const typingTexts = [
    "I ship production-ready executables",
    "Patterns are learned, not discovered",
    "Cyber Security Mindset",
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
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeText, typeSpeed);
}

// Start typing animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
});

// Smooth scroll for navigation links
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');
let animated = false;

function animateSkillBars() {
    if (animated) return;
    
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;
    
    const rect = skillsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight * 0.8) {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        animated = true;
    }
}

window.addEventListener('scroll', animateSkillBars);

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Form submission handling
const contactForm = document.querySelector('#contact-form');
const thankYouPage = document.querySelector('#thank-you-page');
const backToContactBtn = document.querySelector('#back-to-contact');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Show thank you page
        document.querySelector('.contact-form').style.display = 'none';
        thankYouPage.style.display = 'flex';

        // Optional: Send email in the background
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        );

        // Create mailto link (opens in new tab/window)
        window.open(`mailto:yuvrajsarathe07@gmail.com?subject=${subject}&body=${body}`, '_blank');
    });
}

// Handle back to contact form button
if (backToContactBtn) {
    backToContactBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Hide thank you page and show form again
        thankYouPage.style.display = 'none';
        document.querySelector('.contact-form').style.display = 'block';

        // Reset form
        if (contactForm) {
            contactForm.reset();
        }
    });
}

// Back to top button visibility
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});

// Intersection Observer for fade-in animations
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

// Observe sections and cards
document.querySelectorAll('.section, .project-card, .achievement-card, .philosophy-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add CSS for fade-in animation
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