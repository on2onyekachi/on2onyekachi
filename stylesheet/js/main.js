/* =========================================================
   main.js — Portfolio
   GSAP handles all scroll animations.
   CSS scroll-animate classes kept as no-JS fallback only.
========================================================= */

// ── NAVBAR ───────────────────────────────────────────────
const sliderBtn = document.querySelector('.slide-menu');
const navbarMenu = document.querySelector('#navbarMenu');
const navLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('section');

let navOpen = false;

if (sliderBtn && navbarMenu) {
    sliderBtn.addEventListener('click', function () {
        navOpen = !navOpen;
        document.querySelector('.container-wrapper').classList.toggle('change');
        navbarMenu.classList.toggle('nav-open', navOpen);
    });
}

// Close on outside click
document.addEventListener('click', function (e) {
    if (!navbarMenu || !sliderBtn) return;
    if (!navbarMenu.contains(e.target) && !sliderBtn.contains(e.target) && navOpen) {
        navOpen = false;
        navbarMenu.classList.remove('nav-open');
        document.querySelector('.container-wrapper').classList.remove('change');
    }
});

// Smooth scroll + close nav on link click
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('href')?.slice(1);
        const target = id && document.getElementById(id);
        if (!target) return;
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        navOpen = false;
        navbarMenu.classList.remove('nav-open');
        document.querySelector('.container-wrapper').classList.remove('change');
    });
});

// Active nav highlight on scroll — throttled with rAF to avoid layout thrashing
let rafScheduled = false;
window.addEventListener('scroll', function () {
    if (rafScheduled) return;
    rafScheduled = true;
    window.requestAnimationFrame(function () {
        pageSections.forEach(function (section, i) {
            if (window.scrollY >= section.offsetTop - 400) {
                navLinks.forEach(nl => nl.classList.remove('navbarChange'));
                if (navLinks[i]) navLinks[i].classList.add('navbarChange');
            }
        });
        rafScheduled = false;
    });
});

// ── LOADER + GSAP INIT ───────────────────────────────────
const loader = document.querySelector('.loader-container');

window.onload = function () {
    setTimeout(function () {
        document.body.classList.add('display');
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
        initGSAP();
    }, 1000);
};

// ── GSAP ─────────────────────────────────────────────────
function initGSAP() {
    // 1. CRITICAL FALLBACK MODULE (Runs if GSAP fails to load)
    if (typeof gsap === 'undefined') {
        console.warn("GSAP CDN failed to load. Initiating native CSS scroll fallback module.");

        // Target every hidden element that needs a scroll reveal fallback
        const fallbackTargets = document.querySelectorAll(
            '.scroll-animate, .about-img-col, .about-text-col, .image-container-wrapper, .tech-element, .gsap-contact-form, .gsap-contact-info'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.10 // Triggers a bit earlier on mobile frames
        };

        const fallbackObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible-fallback');

                    // Specific fix: Force project images to open up completely if clipPath fails
                    if (entry.target.classList.contains('image-container-wrapper')) {
                        entry.target.style.clipPath = 'circle(100% at 50% 50%)';
                    }

                    observer.unobserve(entry.target); // Stop tracking once animated in
                }
            });
        }, observerOptions);

        fallbackTargets.forEach(target => fallbackObserver.observe(target));
        return; // Halt execution so no broken GSAP calls run
    }

    // 2. MAIN GSAP MODULE (Runs perfectly if GSAP is available)
    // Signal the CSS module to ignore native transitions and let GSAP take control
    document.body.classList.add('gsap-loaded');

    gsap.registerPlugin(ScrollTrigger);

    // ── 1. SECTION HEADERS ───────────────────────────────
    gsap.utils.toArray('.scroll-animate').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: -30 },
            {
                opacity: 1, y: 0,
                duration: 0.8, ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // ── 2. ABOUT — image + text ───────────────────────────
    gsap.fromTo('.about-img-col',
        { opacity: 0, x: -45 },
        {
            opacity: 1, x: 0,
            duration: 0.9, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 78%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    gsap.fromTo('.about-text-col',
        { opacity: 0, y: 45 },
        {
            opacity: 1, y: 0,
            duration: 0.9, delay: 0.15, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 78%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ── 3. ABOUT CV LINK ─────────────────────────────────
    gsap.fromTo('.link-btn-style',
        { opacity: 0, y: 10 },
        {
            opacity: 1, y: 0,
            duration: 0.6, delay: 0.4, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-text-col',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // ── 4. TECH STACK — stagger pop ──────────────────────
    gsap.to('.tech-element', {
        opacity: 1, scale: 1,
        duration: 0.45, stagger: 0.06, ease: 'back.out(1.4)',
        scrollTrigger: {
            trigger: '.periodic-table-wrapper',
            start: 'top 82%',
            toggleActions: 'play none none reverse'
        }
    });

    // ── 5. HORIZONTAL SCROLL PROJECTS (desktop only) ──────────────
    // Guard: the GSAP pin / scrub is ONLY applied on viewports ≥ 961px.
    // Below that breakpoint the CSS already stacks slides vertically, so
    // initialising the pin would freeze the page with no horizontal movement.
    const track = document.querySelector('.horizontal-content');

    if (track) {
        ScrollTrigger.matchMedia({
            // ── DESKTOP: enable horizontal scroll hijack ────────────
            '(min-width: 961px)': function () {
                gsap.set('.project-num', { opacity: 0, x: -35 });
                gsap.set('.project-details', { opacity: 0, y: 30 });

                const scrollTween = gsap.to(track, {
                    x: () => -(track.scrollWidth - window.innerWidth),
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.horizontal-wrapper',
                        pin: true,
                        scrub: 1,
                        start: 'top top',
                        end: () => '+=' + (track.scrollWidth - window.innerWidth),
                        invalidateOnRefresh: true,
                    }
                });

                gsap.utils.toArray('.project-slide').forEach(slide => {
                    const numEl = slide.querySelector('.project-num');
                    const detailsEl = slide.querySelector('.project-details');
                    const maskEl = slide.querySelector('.image-container-wrapper');

                    if (numEl) {
                        gsap.to(numEl, {
                            opacity: 0.95, x: 0,
                            duration: 0.7, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: numEl,
                                containerAnimation: scrollTween,
                                start: 'left 90%',
                                toggleActions: 'play none none reverse'
                            }
                        });
                    }

                    if (detailsEl) {
                        gsap.to(detailsEl, {
                            opacity: 1, y: 0,
                            duration: 0.75, delay: 0.1, ease: 'power3.out',
                            scrollTrigger: {
                                trigger: detailsEl,
                                containerAnimation: scrollTween,
                                start: 'left 95%',
                                toggleActions: 'play none none reverse'
                            }
                        });
                    }

                    if (maskEl) {
                        gsap.to(maskEl, {
                            clipPath: 'circle(100% at 50% 50%)',
                            duration: 0.95, ease: 'power2.inOut',
                            scrollTrigger: {
                                trigger: maskEl,
                                containerAnimation: scrollTween,
                                start: 'left 85%',
                                toggleActions: 'play none none reverse'
                            }
                        });
                    }
                });
            },

            // ── MOBILE: no pin, just reveal images on scroll ─────────
            '(max-width: 960px)': function () {
                // Ensure all elements that GSAP set to opacity:0 are visible
                gsap.set('.project-num', { opacity: 0.95, x: 0 });
                gsap.set('.project-details', { opacity: 1, y: 0 });

                // Simple scroll-reveal for images without pin or scrub
                gsap.utils.toArray('.image-container-wrapper').forEach(maskEl => {
                    gsap.to(maskEl, {
                        clipPath: 'circle(100% at 50% 50%)',
                        duration: 0.95, ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: maskEl,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    });
                });
            }
        });
    }

    // ── 6. CONTACT ────────────────────────────────────────
    const contactTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    contactTl
        .to('.gsap-contact-form', {
            opacity: 1, x: 0,
            duration: 0.8, ease: 'power2.out'
        })
        .to('.gsap-contact-info', {
            opacity: 1, x: 0,
            duration: 0.8, ease: 'power2.out'
        }, '-=0.55')
        .fromTo('.contact-input, .contact-form textarea',
            { scaleX: 0, opacity: 0 },
            {
                scaleX: 1,
                opacity: 1,
                transformOrigin: 'left center',
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            },
            '-=0.4'
        )
        .from('.social-media-link', {
            y: 16, opacity: 0,
            stagger: 0.1, duration: 0.4, ease: 'back.out(1.7)'
        }, '-=0.2');
}

// ── THEME TOGGLE ENGINE ─────────────────────────────────
(function themeToggleModule(){
    const THEME_KEY = 'site-theme';
    const toggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme){
        root.setAttribute('data-theme', theme);
        if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }

    function getInitialTheme(){
        const stored = localStorage.getItem(THEME_KEY);
        if (stored) return stored;
        return prefersDark ? 'dark' : 'light';
    }

    let current = getInitialTheme();
    applyTheme(current);

    if (toggle) {
        toggle.addEventListener('click', function(){
            current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(current);
            try { localStorage.setItem(THEME_KEY, current); } catch (e) { /* no-op */ }
        });
    }
})();