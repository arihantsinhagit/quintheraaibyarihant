document.addEventListener('DOMContentLoaded', () => {

    /* --- Particle Background Animation --- */
    const particlesContainer = document.getElementById('particles-js');
    const particleCount = 100; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 1; // Random size between 1px and 6px
        const duration = Math.random() * 20 + 10; // Random duration between 10s and 30s
        const opacity = Math.random() * 0.4 + 0.1; // Random opacity between 0.1 and 0.5
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const hue = Math.random() * 360;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.opacity = opacity;
        particle.style.backgroundColor = `hsl(${hue}, 80%, 70%)`; // Dynamic, colorful particles
        particle.style.animation = `particle-float ${duration}s linear infinite`;
        
        particlesContainer.appendChild(particle);
    }

    // Add CSS for particle animation (inline style for simplicity)
    const styleSheet = document.createElement("style");
    styleSheet.innerHTML = `
        @keyframes particle-float {
            0% { transform: translate(0, 0) rotate(0); opacity: 0; }
            50% { transform: translate(calc(var(--rand-x) * 100px), calc(var(--rand-y) * 100px)) rotate(calc(var(--rand-deg) * 360deg)); opacity: 1; }
            100% { transform: translate(calc(var(--rand-x) * 200px), calc(var(--rand-y) * 200px)) rotate(calc(var(--rand-deg) * 720deg)); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);


    /* --- Smooth Scrolling for Navigation Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu after clicking a link
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
            }
        });
    });


    /* --- Dark Mode Toggle --- */
    const darkModeToggle = document.getElementById('dark-mode-icon');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Optional: Save preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.textContent = '🌓';
        }
    });
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }


    /* --- Mobile Hamburger Menu Toggle --- */
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenu = document.querySelector('.nav-menu');
    hamburgerMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });


    /* --- Animated Statistics Counters --- */
    const statsSection = document.getElementById('statistics');
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observerOptions = {
        root: null, // relative to viewport
        rootMargin: '0px',
        threshold: 0.5 // trigger when 50% of the element is visible
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    let current = 0;
                    const increment = target / 200; // Adjust for speed
                    const interval = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target.toLocaleString();
                            clearInterval(interval);
                        } else {
                            counter.textContent = Math.ceil(current).toLocaleString();
                        }
                    }, 10);
                });
                hasAnimated = true; // Prevents re-animation
                observer.unobserve(statsSection);
            }
        });
    }, observerOptions);
    counterObserver.observe(statsSection);


    /* --- Scroll-Triggered Fade-in Animations --- */
    const animatedElements = document.querySelectorAll('.scroll-animate');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });


    /* --- FAQ Accordion --- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            // Close all open answers
            document.querySelectorAll('.faq-question.active').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
                q.nextElementSibling.style.padding = '0 20px';
            });
            // Open the clicked answer
            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '0 20px 20px';
            }
        });
    });


    /* --- Button Ripple Effect Micro-interaction --- */
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            ripple.addEventListener('animationend', () => {
                this.removeChild(ripple);
            });
        });
    });

});