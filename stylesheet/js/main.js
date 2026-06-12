// FOR NAVBAR 
const sliderBtn = document.querySelector('.slide-menu');
const navbarMenu = document.querySelector('#navbarMenu');
const navLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll("section");

let navOpen = false;

if (sliderBtn && navbarMenu) {
    sliderBtn.addEventListener("click", function () {
        navOpen = !navOpen;
        // Toggle X on hamburger
        document.querySelector('.container-wrapper').classList.toggle('change');
        // Flag-drop: toggle our own class, NOT bootstrap's
        if (navOpen) {
            navbarMenu.classList.add('nav-open');
        } else {
            navbarMenu.classList.remove('nav-open');
        }
    });
}

// Close on outside click
document.addEventListener('click', function (e) {
    if (!navbarMenu || !sliderBtn) return;
    if (!navbarMenu.contains(e.target) && !sliderBtn.contains(e.target)) {
        if (navOpen) {
            navOpen = false;
            navbarMenu.classList.remove('nav-open');
            document.querySelector('.container-wrapper').classList.remove('change');
        }
    }
});
// scroll appear
const scrollShow = document.querySelectorAll(".scroll-animate, .scroll-animate-x, .scroll-animate-xx, .scroll-animate-y");
const screenPosition = window.innerHeight / 1;
const screenBar = window.innerHeight / 1;
// loader
// SPINNER CODE.
const loader = document.querySelector('.loader-container');
window.onload = setTimeout(() => {
    const body = document.querySelector("body");
    body.classList.add("display");
    body.removeChild(loader);
    // mainFunc();
    // Init GSAP after page is shown
    initGSAP();
}, 1000)

// window scroll
window.addEventListener('scroll', function () {
    mainFunc();
});
// main scroll effect function-
function mainFunc() {
    // for scroll appear
    function scrollAppear() {
        scrollShow.forEach(function (ss) {
            let scrollPosition = ss.getBoundingClientRect().top;
            if (scrollPosition < screenPosition) {
                ss.classList.add("show-section");
            } else {
                ss.classList.remove("show-section");
            }
        });
    }
    scrollAppear();
    // for navbar current view page highlight.
    function navbarHighlight() {
        pageSections.forEach(function (section, i) {
            if (window.pageYOffset >= section.offsetTop - 400) {
                navLinks.forEach(nl => nl.classList.remove("navbarChange"));
                if (navLinks[i]) navLinks[i].classList.add("navbarChange");
            }
        });
    }
    navbarHighlight();
}
// Smooth scroll + close nav on link click
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        if (!href) return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
        // Close menu
        navOpen = false;
        navbarMenu.classList.remove('nav-open');
        document.querySelector('.container-wrapper').classList.remove('change');
    });
});

// ─── GSAP ─────────────────────────────────────────────────
function initGSAP() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        // Fallback: make everything visible if GSAP failed to load
        document.querySelectorAll(
            '.gsap-section-title, .gsap-from-left, .gsap-from-right, .gsap-contact-form, .gsap-contact-info, .gsap-tech-el, .hero-name, .hero-title, .project-card-info, .matrix-item'
        ).forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ── 5. TECH STACK stagger pop ────────────────────────
    gsap.to(".tech-element", {
        opacity: 1, scale: 1,
        duration: 0.45, stagger: 0.06, ease: "back.out(1.4)",
        scrollTrigger: {
            trigger: ".periodic-table-wrapper",
            start: "top 82%",
            toggleActions: "play none none reverse"
        }
    });
    

   // ── HORIZONTAL SCROLL PROJECTS (ARCHITECTURAL UPDATE) ───
const track = document.querySelector(".horizontal-content");

if (track) {
    // Set explicit starting positions for target content items
    gsap.set(".project-num", { opacity: 0, x: -35 });
    gsap.set(".project-details", { opacity: 0, y: 30 });

    // Horizontal pin & scroll tween
    const scrollTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: ".horizontal-wrapper",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + track.scrollWidth,
            invalidateOnRefresh: true,
        }
    });

    // Handle per-slide modular animation timelines
    gsap.utils.toArray(".project-slide").forEach((slide) => {
        const numElement = slide.querySelector(".project-num");
        const detailsElement = slide.querySelector(".project-details");
        const maskElement = slide.querySelector(".image-container-wrapper");

        // Staggered presentation for typography
        gsap.to(numElement, {
            opacity: 0.95,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
                trigger: numElement,
                containerAnimation: scrollTween,
                start: "left 85%",
                toggleActions: "play none none reverse"
            }
        });

        gsap.to(detailsElement, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: detailsElement,
                containerAnimation: scrollTween,
                start: "left 78%",
                toggleActions: "play none none reverse"
            }
        });

        // Crisp Circle Mask Expansion Reveal
        gsap.to(maskElement, {
            clipPath: "circle(100% at 50% 50%)",
            duration: 0.95,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: maskElement,
                containerAnimation: scrollTween,
                start: "left 72%",
                toggleActions: "play none none reverse"
            }
        });
    });
}

}