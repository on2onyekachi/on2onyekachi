// slide on click button
const slider = document.querySelector('.slide-menu');
// FOR NAVBAR 
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
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
}, 1000)
// slider on click button
slider.addEventListener("click", function () {
    document.querySelector('.container-wrapper').classList.toggle('change');
});
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
    function navbarScroll() {
        sections.forEach(function (section, i) {
            if (window.pageYOffset >= section.offsetTop - 400) {
                navLinks.forEach(function (navLink) {
                    navLink.classList.remove("navbarChange");
                });
                if (navLinks[i]) {
                    navLinks[i].classList.add("navbarChange");
                }
            }
        });
    }
    navbarScroll();
}
// smooth scroll to page on link click. 
navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        let position = element.offsetTop;
        window.scrollTo({
            left: 0,
            top: position
        });
    });
});
const root = document.querySelector('#navbarMenu');
// const dropdown = root.querySelector('')
document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
        if (root.classList.contains('show')) {
            console.log('close o');
            root.classList.remove('show');
            document.querySelector('.container-wrapper').classList.remove('change');
        }
    }
});