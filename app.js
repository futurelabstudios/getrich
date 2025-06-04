// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initIntersectionObserver();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Add enhanced interactions
    addCardInteractions();
});

/**
 * Setup intersection observer to trigger animations when elements scroll into view
 */
function initIntersectionObserver() {
    // Get all section elements to observe
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.card');
    
    // Create options for the observer
    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };
    
    // Create observer for sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Create observer for cards with slight delay
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for a nice cascading effect
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 150);
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        sectionObserver.observe(section);
    });
    
    // Set initial state and observe cards
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        cardObserver.observe(card);
    });
}

/**
 * Setup smooth scrolling for navigation links with improved performance
 */
function setupSmoothScrolling() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // If target exists, scroll to it
            if (targetSection) {
                // Calculate the position with better offset handling
                const headerOffset = 60; // Adjust for better positioning
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Use a more reliable smooth scroll method
                smoothScrollTo(offsetPosition, 800);
                
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

/**
 * Custom smooth scroll function for better control
 */
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smooth animation
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

/**
 * Add enhanced card interactions with better performance
 */
function addCardInteractions() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Only add 3D effects on larger screens to avoid performance issues
        if (window.innerWidth > 768) {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });

            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                // Calculate mouse position relative to center
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                // Apply very subtle rotation for elegance
                const rotateX = mouseY * -0.01;
                const rotateY = mouseX * 0.01;
                
                // Use transform3d for better performance
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px) translateZ(0)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) translateZ(0)';
                card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
    });
}

/**
 * Handle direct navigation to sections via URL hash
 */
window.addEventListener('load', () => {
    // If there's a hash in the URL, scroll to that section
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            // Add a delay to ensure everything is loaded and animations are set
            setTimeout(() => {
                const headerOffset = 60;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                smoothScrollTo(offsetPosition, 600);
            }, 500);
        }
    }
});

/**
 * Optimize performance by debouncing resize events
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize card interactions if screen size changed significantly
        if (window.innerWidth <= 768) {
            // Disable card 3D effects on smaller screens
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.transform = '';
                card.style.transition = '';
            });
        }
    }, 250);
});

/**
 * Add subtle entrance animation for buttons
 */
const buttons = document.querySelectorAll('.btn');
buttons.forEach((button, index) => {
    button.style.opacity = '0';
    button.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        button.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        button.style.opacity = '1';
        button.style.transform = 'translateY(0)';
    }, 1000 + (index * 100)); // Stagger the animation
});