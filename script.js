
// ================================
// GLOBAL VARIABLES & CONFIGURATION
// ================================

// Cursor system variables
const cursor = document.querySelector('.cursor');
const trails = [];
let mouseX = 0, mouseY = 0;

// Configuration object - CHANGE THESE VALUES TO CUSTOMIZE BEHAVIOR
const CONFIG = {
    // Cursor settings
    cursorTrailLength: 10,          // Number of trail dots - CHANGE THIS
    cursorTrailSpeed: 0.1,          // Trail follow speed (0.1 = slow, 0.9 = fast)
    
    // Particle settings
    particleSpawnRate: 300,         // Milliseconds between particles - LOWER = MORE PARTICLES
    particleLifetime: 5000,         // How long particles live (ms)
    particleSizeRange: [2, 6],      // Min and max particle size
    
    // Animation settings
    magneticStrength: 0.1,          // How strong magnetic buttons are
    scrollColorShiftRange: 60,      // Color shift range on scroll
    
    // Typing animation settings
    typeSpeed: 80,                  // Typing speed (ms per character)
    typeDelay: 1000,               // Delay between typing animations
};

// ================================
// CUSTOM CURSOR SYSTEM
// ================================

/**
 * Initialize custom cursor and trail system
 * MODIFY: Change trail count, colors, or sizes here
 */
function initializeCursor() {
    // Create cursor trail elements
    for (let i = 0; i < CONFIG.cursorTrailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }

    // Mouse move event listener
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update main cursor position
        if (cursor) {
            cursor.style.left = mouseX - 10 + 'px';
            cursor.style.top = mouseY - 10 + 'px';
        }
    });

    // Start trail animation
    animateTrails();
}

/**
 * Animate cursor trails
 * MODIFY: Change trail behavior, colors, or opacity here
 */
function animateTrails() {
    let x = mouseX;
    let y = mouseY;
    
    trails.forEach((trail, index) => {
        // Smooth follow animation
        trail.x += (x - trail.x) * CONFIG.cursorTrailSpeed;
        trail.y += (y - trail.y) * CONFIG.cursorTrailSpeed;
        
        // Update trail position
        trail.element.style.left = trail.x - 3 + 'px';
        trail.element.style.top = trail.y - 3 + 'px';
        
        // Fade out trail based on distance from cursor
        trail.element.style.opacity = (CONFIG.cursorTrailLength - index) / CONFIG.cursorTrailLength;
        
        // Pass position to next trail
        x = trail.x;
        y = trail.y;
    });
    
    requestAnimationFrame(animateTrails);
}

/**
 * Add cursor hover effects to elements
 * MODIFY: Change cursor colors, sizes, or effects here
 */
function setupCursorHoverEffects() {
    const hoverElements = document.querySelectorAll('a, .service-card, .glow-card, button, .magnetic-btn');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (cursor) {
                cursor.style.transform = 'scale(2)'; // CHANGE HOVER SIZE HERE
                cursor.style.background = 'linear-gradient(45deg, #39FF14, #FF6B35)'; // CHANGE HOVER COLOR
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (cursor) {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'linear-gradient(45deg, #00FFFF, #0066FF)';
            }
        });
    });
}

// ================================
// MAGNETIC BUTTON EFFECTS
// ================================

/**
 * Create magnetic effect for buttons
 * MODIFY: Change magnetic strength or affected elements
 */
function setupMagneticButtons() {
    const magneticElements = document.querySelectorAll('.magnetic-btn');
    
    magneticElements.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Apply magnetic movement - CHANGE STRENGTH HERE
            btn.style.transform = `translate(${x * CONFIG.magneticStrength}px, ${y * CONFIG.magneticStrength}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}

// ================================
// PARALLAX & 3D EFFECTS
// ================================

/**
 * Create parallax effect for service cards
 * MODIFY: Change tilt strength or affected elements
 */
function setupParallaxEffects() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.service-card');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.5; // CHANGE PARALLAX SPEED HERE
            const rotateY = (x - 0.5) * speed;
            const rotateX = (y - 0.5) * speed;
            
            // Apply 3D rotation
            card.style.transform += ` rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        });
    });
}

// ================================
// FLOATING PARTICLES SYSTEM
// ================================

/**
 * Create a single floating particle
 * MODIFY: Change particle appearance, colors, or behavior
 */
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Randomize particle properties
    const size = Math.random() * (CONFIG.particleSizeRange[1] - CONFIG.particleSizeRange[0]) + CONFIG.particleSizeRange[0];
    const colors = ['0, 255, 255', '57, 255, 20', '138, 43, 226']; // ADD MORE COLORS HERE
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Set particle styles
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's'; // CHANGE SPEED RANGE
    particle.style.backgroundColor = `rgba(${randomColor}, ${Math.random() * 0.5 + 0.1})`;
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, CONFIG.particleLifetime);
}

/**
 * Start particle system
 * MODIFY: Change spawn rate or particle density
 */
function startParticleSystem() {
    setInterval(createParticle, CONFIG.particleSpawnRate);
}

// ================================
// SCROLL EFFECTS
// ================================

/**
 * Handle scroll-based animations and effects
 * MODIFY: Change scroll triggers or effects
 */
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Background color shift on scroll
        const hue = scrollPercent * CONFIG.scrollColorShiftRange;
        const bgAnimation = document.querySelector('.bg-animation');
        if (bgAnimation) {
            bgAnimation.style.filter = `hue-rotate(${hue}deg)`;
        }
        
        // Header background opacity on scroll
        const header = document.getElementById('header');
        if (header) {
            const opacity = Math.min(scrollPercent * 2, 0.95);
            header.style.background = `rgba(10, 22, 40, ${opacity})`;
        }
    });
}

// ================================
// INTERSECTION OBSERVER ANIMATIONS
// ================================

/**
 * Setup scroll-triggered animations for elements
 * MODIFY: Change animation triggers or effects
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,                    // Trigger when 10% visible - CHANGE THIS
        rootMargin: '0px 0px -50px 0px'    // Trigger 50px before element enters view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class for fade-in animation
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatedElements = document.querySelectorAll('.service-card, .glow-card, .section-title');
    animatedElements.forEach(element => {
        // Set initial state for animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)'; // CHANGE INITIAL OFFSET
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; // CHANGE ANIMATION SPEED
        observer.observe(element);
    });
}

// ================================
// TYPING ANIMATION SYSTEM
// ================================

/**
 * Create typewriter effect for text
 * MODIFY: Change typing speed or animation style
 * @param {HTMLElement} element - Element to type into
 * @param {string} text - Text to type
 * @param {number} speed - Typing speed in milliseconds
 */
function typeWriter(element, text, speed = CONFIG.typeSpeed) {
    element.innerHTML = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add blinking cursor effect after typing
            element.innerHTML += '<span class="typing-cursor">|</span>';
            setTimeout(() => {
                const cursor = element.querySelector('.typing-cursor');
                if (cursor) cursor.remove();
            }, 2000);
        }
    }
    type();
}

/**
 * Initialize typing animations for hero text
 * MODIFY: Change texts, delays, or elements to animate
 */
function initializeTypingAnimations() {
    const bloomTexts = document.querySelectorAll('.bloom-text');
    const texts = ['People Bloom', 'Technology Bloom', 'World Bloom']; // CHANGE TEXTS HERE
    
    bloomTexts.forEach((element, index) => {
        setTimeout(() => {
            typeWriter(element, texts[index], CONFIG.typeSpeed);
        }, index * CONFIG.typeDelay); // CHANGE DELAY BETWEEN ANIMATIONS
    });
}

// ================================
// COLOR ZONE EFFECTS
// ================================

/**
 * Setup dynamic color effects for different zones
 * MODIFY: Add new color zones or change color schemes
 */
function setupColorZoneEffects() {
    // Define color schemes for different zones
    const colorSchemes = {
        'color-zone-1': {
            colors: ['#39FF14', '#00FFFF'],
            name: 'Green-Cyan Theme'
        },
        'color-zone-2': {
            colors: ['#8A2BE2', '#FF6B35'],
            name: 'Purple-Orange Theme'
        },
        'color-zone-3': {
            colors: ['#0066FF', '#39FF14'],
            name: 'Blue-Green Theme'
        }
        // ADD MORE COLOR ZONES HERE
    };
    
    // Apply effects to all color zones
    document.querySelectorAll('[class*="color-zone"]').forEach(zone => {
        zone.addEventListener('mouseenter', (e) => {
            const zoneClass = Array.from(e.target.classList).find(cls => cls.startsWith('color-zone'));
            
            if (zoneClass && colorSchemes[zoneClass]) {
                const { colors } = colorSchemes[zoneClass];
                const [color1, color2] = colors;
                
                // Apply glow effect
                e.target.style.boxShadow = `0 0 30px ${color1}40, 0 0 60px ${color2}20`;
                
                // Optional: Change border color
                e.target.style.borderColor = `${color1}80`;
            }
        });
        
        zone.addEventListener('mouseleave', (e) => {
            // Reset effects
            e.target.style.boxShadow = '';
            e.target.style.borderColor = '';
        });
    });
}

// ================================
// CLICK EFFECTS SYSTEM
// ================================

/**
 * Create ripple effect on click
 * MODIFY: Change ripple color, size, or duration
 */
function createRippleEffect(e) {
    const ripple = document.createElement('div');
    
    // Ripple styling
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 255, 255, 0.6)'; // CHANGE RIPPLE COLOR
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear'; // CHANGE DURATION
    ripple.style.left = (e.clientX - 25) + 'px';
    ripple.style.top = (e.clientY - 25) + 'px';
    ripple.style.width = '50px'; // CHANGE RIPPLE SIZE
    ripple.style.height = '50px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    
    document.body.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

/**
 * Setup click effects throughout the page
 */
function setupClickEffects() {
    document.addEventListener('click', createRippleEffect);
}

// ================================
// SMOOTH SCROLLING SYSTEM
// ================================

/**
 * Setup smooth scrolling for anchor links
 * MODIFY: Change scroll behavior or add custom easing
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Custom smooth scroll with offset for fixed header
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra offset
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth' // CHANGE TO 'auto' FOR INSTANT SCROLL
                });
            }
        });
    });
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

/**
 * Throttle function to limit event frequency
 * MODIFY: Change throttle delay for better performance
 */
function throttle(func, delay = 16) { // 16ms = ~60fps
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

/**
 * Debounce function to delay execution
 * MODIFY: Change debounce delay as needed
 */
function debounce(func, delay = 250) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ================================
// RESPONSIVE BEHAVIOR
// ================================

/**
 * Handle responsive behavior changes
 * MODIFY: Add custom responsive behaviors here
 */
function setupResponsiveBehavior() {
    const checkScreenSize = () => {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Disable certain effects on mobile for performance
        if (isMobile) {
            // Reduce particle spawn rate on mobile
            CONFIG.particleSpawnRate = 600; // SLOWER ON MOBILE
            CONFIG.cursorTrailLength = 5;   // FEWER TRAILS ON MOBILE
        } else {
            // Reset to full effects on desktop
            CONFIG.particleSpawnRate = 300;
            CONFIG.cursorTrailLength = 10;
        }
        
        // Hide custom cursor on touch devices
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = isMobile ? 'none' : 'block';
        }
    };
    
    // Check on load and resize
    checkScreenSize();
    window.addEventListener('resize', debounce(checkScreenSize));
}

// ================================
// ACCESSIBILITY FEATURES
// ================================

/**
 * Setup accessibility features
 * MODIFY: Add more accessibility enhancements
 */
function setupAccessibility() {
    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-medium', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
        
        // Stop particle system
        CONFIG.particleSpawnRate = 0;
    }
    
    // Keyboard navigation enhancement
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            // Add visible focus indicators when tabbing
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        // Remove focus indicators when using mouse
        document.body.classList.remove('keyboard-navigation');
    });
}

// ================================
// ERROR HANDLING
// ================================

/**
 * Global error handler
 * MODIFY: Add custom error handling logic
 */
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.warn('Animation error caught:', e.error);
        // Continue execution without breaking the page
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.warn('Promise rejection caught:', e.reason);
        e.preventDefault(); // Prevent console error
    });
}

// ================================
// INITIALIZATION SYSTEM
// ================================

/**
 * Initialize all systems when DOM is loaded
 * MODIFY: Add or remove initialization calls here
 */
function initializeWebsite() {
    try {
        // Core systems
        initializeCursor();
        setupCursorHoverEffects();
        
        // Interactive effects
        setupMagneticButtons();
        setupParallaxEffects();
        setupColorZoneEffects();
        setupClickEffects();
        
        // Animation systems
        setupScrollEffects();
        setupScrollAnimations();
        setupSmoothScrolling();
        
        // Particle system
        startParticleSystem();
        
        // Responsive and accessibility
        setupResponsiveBehavior();
        setupAccessibility();
        setupErrorHandling();
        
        console.log('🚀 Bloomtech website initialized successfully!');
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

/**
 * Initialize typing animations after a short delay
 */
function initializeDelayedAnimations() {
    setTimeout(() => {
        initializeTypingAnimations();
    }, 500); // CHANGE DELAY HERE
}

// ================================
// EVENT LISTENERS
// ================================

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWebsite);
    document.addEventListener('DOMContentLoaded', initializeDelayedAnimations);
} else {
    // DOM already loaded
    initializeWebsite();
    initializeDelayedAnimations();
}

// Initialize when page is fully loaded (including images)
window.addEventListener('load', () => {
    // Add any post-load initializations here
    console.log('🌟 All resources loaded, website ready!');
});

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Utility function to get random number between range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Utility function to get random array element
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Utility function to convert hex to rgba
 * @param {string} hex - Hex color code
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ================================
// EXPORT FOR DEBUGGING (OPTIONAL)
// ================================

// Make functions available globally for debugging
// REMOVE IN PRODUCTION IF NOT NEEDED
if (typeof window !== 'undefined') {
    window.BloomtechWebsite = {
        config: CONFIG,
        utils: {
            getRandomBetween,
            getRandomElement,
            hexToRgba,
            throttle,
            debounce
        },
        // Add any functions you want to access from console
        createParticle,
        createRippleEffect
    };
}
