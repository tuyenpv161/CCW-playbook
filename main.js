/**
 * CCW Brand Playbook - Main JavaScript
 * Handles TOC interactions, scroll spy, mobile menu, and other interactive features
 */

(function() {
    'use strict';

    // ===================================
    // Variables & Elements
    // ===================================

    const toc = document.getElementById('toc');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.content-section');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const backToTop = document.getElementById('backToTop');

    let isScrolling = false;
    let currentSection = '';

    // ===================================
    // Smooth Scroll to Section
    // ===================================

    function smoothScrollToSection(event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            closeMobileMenu();

            const offset = 20;
            const targetPosition = targetSection.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            updateActiveLink(targetId);
        }
    }

    // ===================================
    // Update Active TOC Link
    // ===================================

    function updateActiveLink(targetId) {
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ===================================
    // Scroll Spy - Detect Current Section
    // ===================================

    function scrollSpy() {
        if (isScrolling) return;

        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    updateActiveLink(sectionId);
                }
            }
        });
    }

    // ===================================
    // Mobile Menu Toggle
    // ===================================

    function toggleMobileMenu() {
        toc.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');

        if (toc.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMobileMenu() {
        toc.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===================================
    // Back to Top Button
    // ===================================

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    function scrollToTop(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===================================
    // Throttle Function
    // ===================================

    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;

        return function(...args) {
            const currentTime = Date.now();

            if (currentTime - lastExecTime < delay) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    lastExecTime = currentTime;
                    func.apply(this, args);
                }, delay);
            } else {
                lastExecTime = currentTime;
                func.apply(this, args);
            }
        };
    }

    // ===================================
    // Debounce Function
    // ===================================

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // ===================================
    // Handle Scroll Event
    // ===================================

    const handleScroll = throttle(function() {
        scrollSpy();
        toggleBackToTopButton();
    }, 100);

    // ===================================
    // Handle Resize Event
    // ===================================

    const handleResize = debounce(function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250);

    // ===================================
    // Initialize Event Listeners
    // ===================================

    function initEventListeners() {
        tocLinks.forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }

        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && toc.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ===================================
    // Initialize Scroll Spy on Load
    // ===================================

    function initScrollSpy() {
        scrollSpy();
        toggleBackToTopButton();
    }

    // ===================================
    // Handle Hash Navigation
    // ===================================

    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                setTimeout(() => {
                    const offset = 20;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    updateActiveLink(hash);
                }, 100);
            }
        }
    }

    // ===================================
    // Initialize App
    // ===================================

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initEventListeners();
                initScrollSpy();
                handleHashNavigation();
            });
        } else {
            initEventListeners();
            initScrollSpy();
            handleHashNavigation();
        }
    }

    init();

    // ===================================
    // Public API
    // ===================================

    window.CCWPlaybook = {
        scrollToSection: function(sectionId) {
            const targetSection = document.querySelector(sectionId);
            if (targetSection) {
                const offset = 20;
                const targetPosition = targetSection.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                updateActiveLink(sectionId);
            }
        },
        closeMobileMenu: closeMobileMenu,
        updateActiveLink: updateActiveLink
    };

})();
