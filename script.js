// DOM Elements
const topDashboard = document.getElementById('topDashboard');
const mobileToggle = document.getElementById('mobileToggle');
const mobileClose = document.getElementById('mobileClose');
const mobileNav = document.getElementById('mobileNav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const fullscreenSections = document.querySelectorAll('.fullscreen-section');
const resumeBtn = document.getElementById('resumeBtn');
const mobileResumeBtn = document.getElementById('mobileResumeBtn');
const contactForm = document.getElementById('contactForm');
const mobileTopResumeBtn = document.querySelector('.mobile-resume-btn');
const contactScrollLinks = document.querySelectorAll('.contact-scroll-link');

// Variables for scroll handling
let currentSection = 'home';
let isScrolling = false;
let scrollTimeout;
let lastScrollTime = 0;

// Initialize the page
function initPage() {
    // Set initial active section
    setActiveSection('home');
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add keyboard navigation
    window.addEventListener('keydown', handleKeyboard);
    
    // Add sticky behavior to dashboard
    window.addEventListener('scroll', handleDashboardScroll, { passive: true });
    
    // Initial setup
    handleDashboardScroll();
    setupNavigation();
    animateElementsOnScroll();
    
    // Initial scroll check
    setTimeout(() => {
        updateActiveSectionBasedOnScroll();
    }, 100);
}

// Handle keyboard navigation
function handleKeyboard(e) {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        navigateToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToPreviousSection();
    } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection('home');
    } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection('contact');
    }
}

// Navigate to next section
function navigateToNextSection() {
    const sections = Array.from(fullscreenSections);
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        scrollToSection(nextSection.id);
    }
}

// Navigate to previous section
function navigateToPreviousSection() {
    const sections = Array.from(fullscreenSections);
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    if (currentIndex > 0) {
        const prevSection = sections[currentIndex - 1];
        scrollToSection(prevSection.id);
    }
}

// Set active section
function setActiveSection(sectionId) {
    if (currentSection === sectionId) return;
    
    currentSection = sectionId;
    
    // Update navigation links
    updateNavLinks(sectionId);
    
    // Remove active class from all sections
    fullscreenSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to current section
    const currentSectionEl = document.getElementById(sectionId);
    if (currentSectionEl) {
        currentSectionEl.classList.add('active');
    }
    
    // Animate elements in the section
    animateSectionElements(currentSectionEl);
}

// Update navigation links
function updateNavLinks(activeId) {
    // Update top dashboard nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
    
    // Update mobile nav links
    mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
        }
    });
}

// Handle scroll events
function handleScroll() {
    if (isScrolling) return;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveSectionBasedOnScroll, 50);
    
    // Animate elements on scroll
    animateElementsOnScroll();
}

// Update active section based on scroll position
function updateActiveSectionBasedOnScroll() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Find which section is most visible in the viewport
    let activeSectionId = 'home';
    let maxVisibility = 0;
    
    fullscreenSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Calculate visible portion
        const visibleTop = Math.max(scrollPosition, sectionTop);
        const visibleBottom = Math.min(scrollPosition + windowHeight, sectionBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityPercentage = (visibleHeight / Math.min(sectionHeight, windowHeight)) * 100;
        
        if (visibilityPercentage > maxVisibility) {
            maxVisibility = visibilityPercentage;
            activeSectionId = section.id;
        }
    });
    
    // Update active section if changed
    if (activeSectionId !== currentSection && maxVisibility > 50) {
        setActiveSection(activeSectionId);
    }
}

// Handle dashboard scroll effect
function handleDashboardScroll() {
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        topDashboard.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.1)';
        topDashboard.style.backdropFilter = 'blur(10px)';
        topDashboard.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        topDashboard.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.08)';
        topDashboard.style.backdropFilter = 'none';
        topDashboard.style.backgroundColor = 'white';
    }
}

// Animate elements on scroll
function animateElementsOnScroll() {
    const elementsToAnimate = document.querySelectorAll('.info-item, .education-card, .skill-category, .project-card, .experience-card, .cert-card, .contact-grid-item, .contact-icon');
    
    elementsToAnimate.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
            element.classList.add('animate-in');
        }
    });
}

// Animate elements in section
function animateSectionElements(section) {
    const elementsToAnimate = section.querySelectorAll('.info-item, .education-card, .skill-category, .project-card, .experience-card, .cert-card, .contact-grid-item, .contact-icon');
    
    // Reset animations
    elementsToAnimate.forEach(element => {
        element.classList.remove('animate-in');
    });
    
    // Trigger staggered animation
    setTimeout(() => {
        elementsToAnimate.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 100);
        });
    }, 300);
}

// Setup navigation
function setupNavigation() {
    // Mobile Menu Functions
    function openMobileMenu() {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event Listeners
    mobileToggle.addEventListener('click', openMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);

    // Navigation link click handler
    function handleNavClick(e, link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
        
        // Close mobile menu if open
        if (mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    }

    // Mobile nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link));
    });

    // Desktop nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, link));
    });
}

// Scroll to specific section
function scrollToSection(sectionId) {
    if (isScrolling || sectionId === currentSection) return;
    
    isScrolling = true;
    const targetSection = document.getElementById(sectionId);
    
    if (targetSection) {
        // Smooth scroll to section
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });
        
        // Update active section after scroll completes
        setTimeout(() => {
            setActiveSection(sectionId);
            isScrolling = false;
        }, 500);
    }
}

// Resume Download Function
function downloadResume() {
    const resumeUrl = 'assets/documents/resume.pdf';
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Hemanthkumar_A_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Resume download started!');
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-color), #6366f1);
        color: white;
        padding: 15px 25px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-hover);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Event listeners for resume buttons
if (resumeBtn) {
    resumeBtn.addEventListener('click', downloadResume);
}

if (mobileResumeBtn) {
    mobileResumeBtn.addEventListener('click', downloadResume);
}

// Add event listener for mobile top resume button
const mobileTopResume = document.querySelector('.mobile-resume-btn');
if (mobileTopResume) {
    mobileTopResume.addEventListener('click', downloadResume);
}

// Add event listeners for contact scroll links
contactScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection('contact');
    });
});

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        showNotification(`Thank you ${name}! Your message has been sent. I'll get back to you soon.`);
        contactForm.reset();
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on desktop
    if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && 
        !e.target.closest('.mobile-nav-content') && 
        !e.target.closest('.mobile-toggle')) {
        mobileNav.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);