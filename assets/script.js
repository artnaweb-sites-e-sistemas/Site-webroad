// WebRoad Landing Page JavaScript - Optimized

// Fallback for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback, options) {
        return setTimeout(callback, options?.timeout || 0);
    };
}

// Optimize DOM operations to reduce forced reflow
function optimizeDOMOperations() {
    // Use requestIdleCallback with longer timeout to avoid blocking main thread
    requestIdleCallback(() => {
        // Batch DOM operations
        const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
        
        // Process in smaller chunks to avoid long tasks
        const chunkSize = 3; // Further reduced chunk size
        let index = 0;
        
        function processChunk() {
            const end = Math.min(index + chunkSize, elements.length);
            for (let i = index; i < end; i++) {
                elements[i].style.willChange = 'transform, opacity';
            }
            index = end;
            
            if (index < elements.length) {
                requestAnimationFrame(processChunk); // Use RAF for better performance
            }
        }
        
        requestAnimationFrame(processChunk); // Start after initial render
        
        // Optimize scroll listener with throttling
        let ticking = false;
        let lastScrollY = 0;
        
        function updateScroll() {
            ticking = false;
            const currentScrollY = window.pageYOffset;
            
            if (Math.abs(currentScrollY - lastScrollY) > 10) { // Increased threshold for better performance
                lastScrollY = currentScrollY;
            }
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }, { timeout: 200 });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize critical functionality first
    initNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initYouTubeLazyLoad();
    optimizeDOMOperations();
    initLazyLoadImages();
    
    // Use setTimeout for better main thread distribution
    setTimeout(() => {
        initScrollAnimations();
        initContactVisual();
    }, 100);
    
    setTimeout(() => {
        initCounterAnimations();
        initMobileHeroCounters();
        initScrollUp();
    }, 200);
    
    // Heavy functionality with longer delays
    setTimeout(() => {
        initTeamCarousel();
    }, 2000); // Increased delay to reduce initial load
    
    // Delay CTA video loading until user scrolls near it
    requestIdleCallback(() => {
        const ctaSection = document.querySelector('.cta-section');
        const ctaVideo = document.getElementById('cta-video');
        
        if (ctaSection && ctaVideo) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Load video source on demand
                        const source = ctaVideo.querySelector('source[data-src]');
                        if (source) {
                            source.src = source.getAttribute('data-src');
                            source.removeAttribute('data-src');
                            ctaVideo.load();
                            ctaVideo.play().catch(() => {
                                // Silently fail if autoplay is blocked
                            });
                        }
                        initCTAVideo();
                        observer.disconnect();
                    }
                });
            }, { rootMargin: '300px' });
            
            observer.observe(ctaSection);
        }
    }, { timeout: 500 });
    
    setTimeout(() => {
        initParallaxEffects();
    }, 3000); // Further delayed to reduce initial load
});

// Mobile hero counters initialization
function initMobileHeroCounters() {
    const mobileHeroCounters = document.querySelectorAll('.mobile-stat-number');
    
    if (mobileHeroCounters.length > 0) {
        // Animate counters after a short delay to ensure mobile hero is visible
        setTimeout(() => {
            mobileHeroCounters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
            });
        }, 1500); // Delay to ensure mobile hero is fully loaded
    }
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect and section detection
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero');
        const mobileHeroSection = document.querySelector('.mobile-hero');
        const currentHero = window.innerWidth <= 768 ? mobileHeroSection : heroSection;
        const heroHeight = currentHero ? currentHero.offsetHeight : 0;
        const scrollY = window.scrollY;
        
        // Add scrolled class for blur effect
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Check which section is currently in view
        const servicesSection = document.querySelector('.services');
        const teamSection = document.querySelector('.team');
        const ctaSection = document.querySelector('.cta-section');
        
        // Get section positions
        const servicesTop = servicesSection ? servicesSection.offsetTop - 100 : 0;
        const servicesBottom = servicesSection ? servicesSection.offsetTop + servicesSection.offsetHeight + 100 : 0;
        const teamTop = teamSection ? teamSection.offsetTop - 100 : 0;
        const teamBottom = teamSection ? teamSection.offsetTop + teamSection.offsetHeight + 100 : 0;
        const ctaTop = ctaSection ? ctaSection.offsetTop - 100 : 0;
        const ctaBottom = ctaSection ? ctaSection.offsetTop + ctaSection.offsetHeight + 100 : 0;
        
        // Check if we're in hero section
        const inHeroSection = scrollY < heroHeight - 100;
        
        // Check if we're in any of the white sections (services, team, cta)
        const inWhiteSection = (scrollY >= servicesTop && scrollY <= servicesBottom) ||
                              (scrollY >= teamTop && scrollY <= teamBottom) ||
                              (scrollY >= ctaTop && scrollY <= ctaBottom);
        
        // Change colors based on section
        if (inHeroSection || inWhiteSection) {
            // In hero section or white sections - white colors
            navbar.classList.remove('other-section');
            navbar.classList.add('hero-section');
        } else {
            // In other sections - dark colors
            navbar.classList.remove('hero-section');
            navbar.classList.add('other-section');
        }
    });
    
    // Set initial state - start with hero section colors
    navbar.classList.add('hero-section');
    
    // Handle window resize to update hero detection
    window.addEventListener('resize', function() {
        // Re-trigger scroll detection after resize
        setTimeout(() => {
            const heroSection = document.querySelector('.hero');
            const mobileHeroSection = document.querySelector('.mobile-hero');
            const currentHero = window.innerWidth <= 768 ? mobileHeroSection : heroSection;
            const heroHeight = currentHero ? currentHero.offsetHeight : 0;
            const scrollY = window.scrollY;
            
            // Check which section is currently in view
            const servicesSection = document.querySelector('.services');
            const teamSection = document.querySelector('.team');
            const ctaSection = document.querySelector('.cta-section');
            
            // Get section positions
            const servicesTop = servicesSection ? servicesSection.offsetTop - 100 : 0;
            const servicesBottom = servicesSection ? servicesSection.offsetTop + servicesSection.offsetHeight + 100 : 0;
            const teamTop = teamSection ? teamSection.offsetTop - 100 : 0;
            const teamBottom = teamSection ? teamSection.offsetTop + teamSection.offsetHeight + 100 : 0;
            const ctaTop = ctaSection ? ctaSection.offsetTop - 100 : 0;
            const ctaBottom = ctaSection ? ctaSection.offsetTop + ctaSection.offsetHeight + 100 : 0;
            
            // Check if we're in hero section
            const inHeroSection = scrollY < heroHeight - 100;
            
            // Check if we're in any of the white sections (services, team, cta)
            const inWhiteSection = (scrollY >= servicesTop && scrollY <= servicesBottom) ||
                                  (scrollY >= teamTop && scrollY <= teamBottom) ||
                                  (scrollY >= ctaTop && scrollY <= ctaBottom);
            
            // Change colors based on section
            if (inHeroSection || inWhiteSection) {
                // In hero section or white sections - white colors
                navbar.classList.remove('other-section');
                navbar.classList.add('hero-section');
            } else {
                // In other sections - dark colors
                navbar.classList.remove('hero-section');
                navbar.classList.add('other-section');
            }
        }, 100);
    });
    
    // Active navigation link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) {
        return;
    }
    
    // Simple toggle function
    function toggleMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Add click event
    navToggle.onclick = function(e) {
        e.preventDefault();
        toggleMenu();
    };
    
    // Close menu when clicking on links
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.onclick = function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        };
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, { passive: false });
    });
    
    // Add passive scroll listeners for performance
    window.addEventListener('scroll', function() {
        // Scroll-based animations
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.parallax');
        
        parallax.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// Scroll animations - Optimized to reduce reflow
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        // Use requestAnimationFrame to batch style changes
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                
                    // Trigger counter animations for stats
                    if (entry.target.classList.contains('mission-stats')) {
                        animateCounters();
                    }
                }
            });
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .hero-content,
        .hero-visual,
        .mission-content,
        .differential-card,
        .service-card,
        .portfolio-item,
        .testimonial-card,
        .cta-content,
        .contact-info,
        .contact-visual
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animations for statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .mobile-stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    // Special handling for mobile hero counters
    const mobileHeroCounters = document.querySelectorAll('.mobile-stat-number');
    if (mobileHeroCounters.length > 0) {
        // Animate mobile hero counters immediately when page loads
        setTimeout(() => {
            mobileHeroCounters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 16);
            });
        }, 1000); // Delay to ensure mobile hero is visible
    }
}

// Parallax effects for hero section - Optimized
function initParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    let ticking = false;
    let lastScrollY = 0;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        // Only update if scroll is significant
        if (Math.abs(scrolled - lastScrollY) > 5) {
            shapes.forEach((shape, index) => {
                const speed = 0.2 + (index * 0.1);
                shape.style.transform = `translate3d(0, ${scrolled * speed}px, 0) rotate(${scrolled * 0.02}deg)`;
            });
            
            floatingCards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                card.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
            });
            
            lastScrollY = scrolled;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Contact visual interactions
function initContactVisual() {
    const contactImageBox = document.querySelector('.contact-image-box');
    
    if (contactImageBox) {
        // Add click event to contact image box
        contactImageBox.addEventListener('click', function() {
            // Scroll to top or perform other action
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add keyboard support
        contactImageBox.setAttribute('tabindex', '0');
        contactImageBox.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Portfolio hover effects
function initPortfolioEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Service cards interaction
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
    });
}

// Testimonials carousel (if needed)
function initTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    // Add carousel functionality if more than 3 testimonials
    if (testimonialCards.length > 3) {
        // Implementation for carousel would go here
        console.log('Testimonials carousel initialized');
    }
}

// Loading screen (optional)
function initLoadingScreen() {
    window.addEventListener('load', function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const optimizedScrollHandler = throttle(function() {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Initialize additional effects after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioEffects();
    initServiceCards();
    initTestimonialsCarousel();
    initLoadingScreen();
    initRotatingText();
    initParticles();
    initCounters();
    initMouseFollower();
});

// Add CSS for mobile menu
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: right 0.3s ease;
            z-index: 999;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .nav-menu a {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .nav-menu a.active {
            color: var(--primary-purple);
            position: relative;
        }
        
        .nav-menu a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(135deg, var(--primary-purple), var(--primary-light));
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Rotating Text Animation
function initRotatingText() {
    const textItems = document.querySelectorAll('.text-item');
    let currentIndex = 0;
    
    if (textItems.length === 0) return;
    
    setInterval(() => {
        textItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % textItems.length;
        textItems[currentIndex].classList.add('active');
    }, 2000);
}

// Particles Animation
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const mobileCanvas = document.getElementById('mobile-particles-canvas');
    
    // Initialize desktop particles
    if (canvas) {
        initParticlesCanvas(canvas);
    }
    
    // Initialize mobile particles
    if (mobileCanvas) {
        initParticlesCanvas(mobileCanvas);
    }
}

function initParticlesCanvas(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createParticle() {
        const isMobile = canvas.id === 'mobile-particles-canvas';
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: isMobile ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
            opacity: isMobile ? Math.random() * 0.7 + 0.3 : Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticlesArray() {
        particles = [];
        // Further reduce particle count for better performance
        const isMobile = canvas.id === 'mobile-particles-canvas';
        const divisor = isMobile ? 50000 : 30000; // Reduced particle count
        const particleCount = Math.floor((canvas.width * canvas.height) / divisor);
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticlesArray();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticlesArray();
    });
}

// Animated Counter
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

// Initialize counters when they come into view
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Mouse Follower
function initMouseFollower() {
    const follower = document.querySelector('.mouse-follower');
    if (!follower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isAnimating = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Mouse follower should always be visible
        follower.style.display = 'block';
        
        // Check if mouse is over team thumbnails for custom cursor (not main image)
        const teamThumbnails = document.querySelectorAll('.team-thumbnail');
        const teamMainImage = document.querySelector('.team-main-image-container');
        let isOverTeamThumbnail = false;
        
        teamThumbnails.forEach(thumbnail => {
            const rect = thumbnail.getBoundingClientRect();
            const isOverThumbnail = mouseX >= rect.left && mouseX <= rect.right && 
                                  mouseY >= rect.top && mouseY <= rect.bottom;
            if (isOverThumbnail) {
                isOverTeamThumbnail = true;
            }
        });
        
        // Don't show custom cursor over main image
        if (teamMainImage) {
            const mainRect = teamMainImage.getBoundingClientRect();
            const isOverMainImage = mouseX >= mainRect.left && mouseX <= mainRect.right && 
                                  mouseY >= mainRect.top && mouseY <= mainRect.bottom;
            if (isOverMainImage) {
                isOverTeamThumbnail = false;
            }
        }
        
        // Check if mouse is over hero button specifically
        const heroButton = document.querySelector('.hero-buttons .btn-primary, .mobile-hero-buttons .btn-primary');
        let isOverHeroButton = false;
        
        if (heroButton) {
            const rect = heroButton.getBoundingClientRect();
            const isOverButton = mouseX >= rect.left && mouseX <= rect.right && 
                               mouseY >= rect.top && mouseY <= rect.bottom;
            if (isOverButton) {
                isOverHeroButton = true;
            }
        }
        
        // Check if mouse is over other CTA buttons
        const ctaButtons = document.querySelectorAll('.btn-secondary, .btn-cta, .scroll-up');
        let isOverCTAButton = false;
        
        ctaButtons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const isOverButton = mouseX >= rect.left && mouseX <= rect.right && 
                               mouseY >= rect.top && mouseY <= rect.bottom;
            if (isOverButton) {
                isOverCTAButton = true;
            }
        });
        
        // Add/remove classes for hover effects
        if (isOverTeamThumbnail) {
            follower.classList.add('team-hover');
            follower.classList.remove('cta-hover', 'hero-hover');
        } else if (isOverHeroButton) {
            follower.classList.add('hero-hover');
            follower.classList.remove('team-hover', 'cta-hover');
        } else if (isOverCTAButton) {
            follower.classList.add('cta-hover');
            follower.classList.remove('team-hover', 'hero-hover');
        } else {
            follower.classList.remove('team-hover', 'cta-hover', 'hero-hover');
        }
        
        if (!isAnimating) {
            isAnimating = true;
            requestAnimationFrame(updateFollower);
        }
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-toggle, .floating-card, .portfolio-item, .service-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            follower.classList.remove('hover');
        });
    });
    
    function updateFollower() {
        const diffX = mouseX - followerX;
        const diffY = mouseY - followerY;
        
        // More responsive movement
        if (Math.abs(diffX) > 0.5 || Math.abs(diffY) > 0.5) {
            followerX += diffX * 0.5;
            followerY += diffY * 0.5;
            
            follower.style.left = followerX - 10 + 'px';
            follower.style.top = followerY - 10 + 'px';
            
            requestAnimationFrame(updateFollower);
        } else {
            isAnimating = false;
        }
    }
    
    // Hide follower on mobile
    if (window.innerWidth <= 768) {
        follower.style.display = 'none';
    }
}

// Team Carousel Functionality - Especificações Detalhadas
function initTeamCarousel() {
    // Ler dados dinamicamente do HTML
    function getTeamDataFromHTML() {
        const thumbnails = document.querySelectorAll('.team-thumbnail');
        const teamData = [];
        
        thumbnails.forEach((thumbnail, index) => {
            const img = thumbnail.querySelector('.thumbnail-image');
            const name = thumbnail.querySelector('.thumbnail-name');
            
            if (img && name) {
                // Extrair informações dos atributos data-* ou do HTML
                const memberData = {
                    id: thumbnail.getAttribute('data-member') || `member-${index}`,
                    nome: name.textContent.trim(),
                    funcao: thumbnail.getAttribute('data-role') || 'Membro da Equipe',
                    foto: thumbnail.getAttribute('data-photo-hd') || img.src.replace('w=320&h=180', 'w=640&h=800'),
                    linkedin: thumbnail.getAttribute('data-linkedin') || '#',
                    bioCurta: thumbnail.getAttribute('data-bio') || 'Membro da equipe WebRoad'
                };
                
                teamData.push(memberData);
            }
        });
        
        return teamData;
    }
    
    const teamData = getTeamDataFromHTML();

    // Elementos DOM
    const memberName = document.querySelector('.team-member-name');
    const memberRole = document.querySelector('.team-member-role');
    const memberBio = document.querySelector('.team-member-bio');
    const mainImage = document.querySelector('.team-main-image-container');
    const thumbnails = document.querySelectorAll('.team-thumbnail');
    const thumbnailsContainer = document.querySelector('.team-thumbnails-container');

    let currentIndex = 0;
    let isTransitioning = false;

    // Função para atualizar membro com transições
    function updateMember(index) {
        if (isTransitioning || index === currentIndex) return;
        
        isTransitioning = true;
        const member = teamData[index];
        
        // Transição de fade para imagem
        mainImage.classList.add('fade-transition');
        
        setTimeout(() => {
            // Atualizar conteúdo
            memberName.textContent = member.nome;
            memberRole.textContent = member.funcao;
            memberBio.textContent = member.bioCurta;
            
            // Atualizar imagem
            const imgElement = mainImage.querySelector('img');
            if (imgElement) {
                // Adicionar event listeners para fallback
                imgElement.onload = function() {
                    this.style.opacity = '1';
                };
                
                imgElement.onerror = function() {
                    // Fallback para imagem padrão se a específica falhar
                    this.src = 'assets/imgs/imgequipe.png';
                    this.alt = `Retrato de ${member.nome}, ${member.funcao}`;
                };
                
                imgElement.src = member.foto;
                imgElement.alt = `Retrato de ${member.nome}, ${member.funcao}`;
            }
            
            // Remover fade e aplicar scale-in
            mainImage.classList.remove('fade-transition');
            
            // Atualizar estado ativo das miniaturas (CSS vai ocultar a ativa)
            thumbnails.forEach((thumb, i) => {
                const isActive = i === index;
                thumb.classList.toggle('active', isActive);
                thumb.setAttribute('aria-selected', isActive);
                thumb.setAttribute('tabindex', isActive ? '0' : '-1');
            });
            
            // Scroll inteligente para a próxima miniatura visível
            if (thumbnailsContainer) {
                setTimeout(() => {
                    // Encontrar todas as miniaturas não ativas
                    const visibleThumbnails = Array.from(thumbnails).filter((thumb, i) => i !== index);
                    
                    if (visibleThumbnails.length > 0) {
                        // Escolher a próxima miniatura na sequência
                        const nextIndex = (index + 1) % teamData.length;
                        const nextThumbnail = thumbnails[nextIndex];
                        
                        if (nextThumbnail && nextThumbnail !== thumbnails[index]) {
                            const containerWidth = thumbnailsContainer.offsetWidth;
                            const thumbnailWidth = nextThumbnail.offsetWidth;
                            const thumbnailOffset = nextThumbnail.offsetLeft;
                            
                            // Calcular posição central
                            const targetScroll = thumbnailOffset - (containerWidth / 2) + (thumbnailWidth / 2);
                            
                            console.log(`Scroll: De ${index} para ${nextIndex}, target: ${targetScroll}`);
                            
                            thumbnailsContainer.scrollTo({
                                left: Math.max(0, targetScroll),
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }
                    }
                }, 100);
            }
            
            currentIndex = index;
            isTransitioning = false;
        }, 100);
    }

    // Navegação automática
    function navigateNext() {
        const newIndex = currentIndex < teamData.length - 1 ? currentIndex + 1 : 0;
        console.log(`Carrossel: Navegando de ${currentIndex} para ${newIndex}`);
        updateMember(newIndex);
    }

    // Event listeners para miniaturas
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateMember(index);
        });

        // Navegação por teclado
        thumbnail.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateMember(index);
            }
        });
    });

    // Navegação por teclado global
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.closest('.team-carousel-column')) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateUp();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateDown();
            }
        }
    });

    // Scroll com mouse wheel
    if (thumbnailsContainer) {
        thumbnailsContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                navigateNext();
            } else {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : teamData.length - 1;
                updateMember(newIndex);
            }
        }, { passive: false }); // Explicitly set passive: false since we need preventDefault
    }

    // Lazy loading de imagens
    function preloadImages() {
        teamData.forEach((member, index) => {
            if (index !== currentIndex) {
                const img = new Image();
                img.src = member.foto;
            }
        });
    }

    // Inicializar
    updateMember(0);
    preloadImages();

    // Preload próximo/anterior
    setInterval(() => {
        const nextIndex = currentIndex < teamData.length - 1 ? currentIndex + 1 : 0;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : teamData.length - 1;
        
        const nextImg = new Image();
        nextImg.src = teamData[nextIndex].foto;
        
        const prevImg = new Image();
        prevImg.src = teamData[prevIndex].foto;
    }, 5000);

    // Carrossel automático simples
    let autoPlayInterval;
    let isSectionVisible = false;

    function startAutoPlay() {
        // Só iniciar se a seção estiver visível
        if (!isSectionVisible) return;
        
        // Limpar intervalo anterior se existir
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        
        // Iniciar carrossel automático
        autoPlayInterval = setInterval(() => {
            // Verificar novamente se a seção ainda está visível
            if (isSectionVisible) {
                navigateNext();
            } else {
                stopAutoPlay();
            }
        }, 4000); // Troca a cada 4 segundos
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Verificar se a seção da equipe está visível
    function checkSectionVisibility() {
        const teamSection = document.querySelector('.team');
        if (!teamSection) return false;
        
        const rect = teamSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Considerar visível se pelo menos 30% da seção está na tela
        const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
        
        if (isVisible !== isSectionVisible) {
            isSectionVisible = isVisible;
            console.log(`Seção da equipe visível: ${isVisible}`);
            
            if (isVisible) {
                startAutoPlay();
            } else {
                stopAutoPlay();
            }
        }
        
        return isVisible;
    }

    // Pausar quando hover na imagem principal
    const mainImageContainer = document.querySelector('.team-main-image-container');
    if (mainImageContainer) {
        mainImageContainer.addEventListener('mouseenter', stopAutoPlay);
        mainImageContainer.addEventListener('mouseleave', () => {
            if (isSectionVisible) {
                startAutoPlay();
            }
        });
    }

    // Pausar quando a página não está visível
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else if (isSectionVisible) {
            startAutoPlay();
        }
    });

    // Verificar visibilidade da seção durante o scroll
    window.addEventListener('scroll', debounce(checkSectionVisibility, 100));

    // Verificar visibilidade inicial
    setTimeout(checkSectionVisibility, 1000);
}

// Console welcome message
console.log(`
🚀 WebRoad Landing Page
✨ Desenvolvido com HTML, CSS e JavaScript
🎨 Design moderno e responsivo
📱 Otimizado para todos os dispositivos

Transformando ideias em experiências digitais memoráveis!
`);

// Scroll Up Button Functionality
function initScrollUp() {
    const scrollUpBtn = document.getElementById('scrollUp');
    
    if (!scrollUpBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const showThreshold = 300; // Show button after scrolling 300px
        
        if (scrollY > showThreshold) {
            scrollUpBtn.classList.add('visible');
        } else {
            scrollUpBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    scrollUpBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add keyboard support
    scrollUpBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// CTA Video initialization for mobile compatibility
function initCTAVideo() {
    const ctaVideo = document.getElementById('cta-video');
    const fallback = document.getElementById('cta-video-fallback');
    const playButton = document.getElementById('play-video-btn');
    
    if (!ctaVideo) return;
    
    let videoPlaying = false;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Function to attempt video play
    function attemptVideoPlay() {
        if (ctaVideo.paused) {
            ctaVideo.play().then(() => {
                videoPlaying = true;
                if (fallback) {
                    fallback.classList.add('hidden');
                }
                console.log('Video started playing');
            }).catch(error => {
                console.log('Video autoplay failed:', error);
                videoPlaying = false;
                
                // Show fallback on mobile or if autoplay fails
                if (isMobile || !videoPlaying) {
                    if (fallback) {
                        fallback.classList.remove('hidden');
                    }
                }
            });
        }
    }
    
    // Function to hide fallback when video is playing
    function hideFallback() {
        if (fallback) {
            fallback.classList.add('hidden');
        }
    }
    
    // Function to show fallback when video is not playing
    function showFallback() {
        if (fallback && !videoPlaying) {
            fallback.classList.remove('hidden');
        }
    }
    
    // Play button click handler
    if (playButton) {
        playButton.addEventListener('click', function() {
            ctaVideo.play().then(() => {
                videoPlaying = true;
                hideFallback();
            }).catch(error => {
                console.log('Manual video play failed:', error);
            });
        });
    }
    
    // Video event listeners
    ctaVideo.addEventListener('play', function() {
        videoPlaying = true;
        hideFallback();
    });
    
    ctaVideo.addEventListener('pause', function() {
        videoPlaying = false;
        if (isMobile) {
            showFallback();
        }
    });
    
    ctaVideo.addEventListener('ended', function() {
        videoPlaying = false;
        if (isMobile) {
            showFallback();
        }
    });
    
    ctaVideo.addEventListener('error', function() {
        console.log('Video error occurred');
        videoPlaying = false;
        showFallback();
    });
    
    // Try to play immediately
    attemptVideoPlay();
    
    // Try again when video is loaded
    ctaVideo.addEventListener('loadeddata', attemptVideoPlay);
    
    // Try again when video can play
    ctaVideo.addEventListener('canplay', attemptVideoPlay);
    
    // Handle visibility change (when user switches tabs/apps)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && ctaVideo.paused) {
            attemptVideoPlay();
        }
    });
    
    // Handle page focus (when user returns to the page)
    window.addEventListener('focus', function() {
        if (ctaVideo.paused) {
            attemptVideoPlay();
        }
    });
    
    // Handle scroll to CTA section
    const ctaSection = document.querySelector('.cta-section');
    if (ctaSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && ctaVideo.paused) {
                    attemptVideoPlay();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(ctaSection);
    }
    
    // Fallback: Show play button after 3 seconds if video hasn't started
    setTimeout(() => {
        if (!videoPlaying && isMobile) {
            showFallback();
        }
    }, 3000);
}

// Lazy Load Images - Optimized
function initLazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image with proper error handling
                    const loadImage = () => {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Add error handling
                        img.onerror = function() {
                            this.style.display = 'none';
                        };
                        
                        // Add load event
                        img.onload = function() {
                            this.style.opacity = '1';
                        };
                        
                        imageObserver.unobserve(img);
                    };
                    
                    // Use requestIdleCallback for better performance
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(loadImage, { timeout: 100 });
                    } else {
                        setTimeout(loadImage, 100);
                    }
                }
            });
        }, {
            rootMargin: '100px 0px', // Increase margin for earlier loading
            threshold: 0.01
        });
        
        images.forEach(img => {
            // Set initial opacity for smooth loading
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    }
}

// YouTube Lazy Loading - Optimized
function initYouTubeLazyLoad() {
    const placeholders = document.querySelectorAll('.youtube-placeholder');
    
    placeholders.forEach(placeholder => {
        // Ensure thumbnail image loads with proper cache headers
        const img = placeholder.querySelector('img');
        if (img && !img.complete) {
            // Force cache headers via fetch
            const imgUrl = img.src;
            fetch(imgUrl, {
                method: 'HEAD',
                cache: 'force-cache',
                headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable'
                }
            }).then(() => {
                img.src = imgUrl + '?v=' + Date.now(); // Force reload with cache
            }).catch(() => {
                // Fallback to hqdefault if maxresdefault fails
                if (imgUrl.includes('maxresdefault')) {
                    img.src = imgUrl.replace('maxresdefault', 'hqdefault');
                }
            });
            
            img.onerror = function() {
                // Fallback to hqdefault if maxresdefault fails
                if (this.src.includes('maxresdefault')) {
                    this.src = this.src.replace('maxresdefault', 'hqdefault');
                }
            };
        }
        
        placeholder.addEventListener('click', function() {
            const videoId = this.dataset.videoId;
            const iframe = document.createElement('iframe');
            
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
            iframe.title = 'WebRoad - Agência Digital';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            
            // Style iframe to fill container
            iframe.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 12px;
            `;
            
            // Clear placeholder and add iframe
            this.innerHTML = '';
            this.appendChild(iframe);
        });
    });
}

// Export functions for external use if needed
window.WebRoad = {
    showNotification,
    debounce,
    throttle,
    initYouTubeLazyLoad
};