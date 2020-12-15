// slide on click button
const slider = document.querySelector('.slide-menu');
//bar percent - abilitity
const progress = document.querySelector('.ability-ul');
const progressPercent = [87, 87, 69, 70, 63, 67, 85];
// FOR NAVBAR 
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
// scroll appear
const scrollShow = document.querySelectorAll(".scroll-animate, .scroll-animate-x, .scroll-animate-xx, .scroll-animate-y");
const screenPosition = window.innerHeight / 1;
const screenBar = window.innerHeight / 1;
// animation start.
const progressBar    = document.querySelectorAll('.progress-bar');
// Typed.js
const typedTwo = new Typed('#typedTwo', {
    strings: [
        'Onyekachi',
        '<span style="color: #f8f9fa;">a</span> Web Designer',
        '<span style="color: #f8f9fa;">a</span> Web Developer',
        '<span style="color: #f8f9fa;">a</span> Freelancer',
        'Onyekachi'
    ],
    typeSpeed: 60,
    backSpeed: 50,
    smartBackspace: true,
    backDelay: 6000,
    cursorChar: '<i class="fas fa-pen fa-1x"></i>',
    loop: true
});
// loader
// SPINNER CODE.
window.onload = () => {
    setTimeout(() => {
        document.querySelector("body").classList.add("display");
        mainFunc();
    }, 2000);
}
// slider on click button
slider.addEventListener("click", function(){
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
            if (window.pageYOffset >= section.offsetTop - 20) {
                navLinks.forEach(function (navLink) {
                    navLink.classList.remove("navbarChange");
                });
                if(navLinks[i]){
                    navLinks[i].classList.add("navbarChange");
                }
            }
        });
    }
    navbarScroll();
    // bar percent-ability
    function barPercent() {
        if (window.pageYOffset + window.innerHeight >= progress.offsetTop) {
            progressBar.forEach(function (element, i) {
                element.style.width = `${progressPercent[i]}%`;
                element.nextElementSibling.textContent = progressPercent[i] + "%";
                let scrollBar = element.getBoundingClientRect().top;
                if (scrollBar < screenBar) {
                    element.classList.add("progress-bar-play");
                    element.nextElementSibling.classList.add("progress-bar-play");
                }
            });
        }
    }
    barPercent();
}
// smooth scroll to page on link click. 
navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
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

function isNotEmpty(caller){
    if(caller.val() == ""){
        caller.css('border-bottom', '1px solid red');
        return false;
    }
    else{
        caller.css('bored-border', '');
        return true;
    }
}

const root = document.querySelector('#navbarMenu');
// const dropdown = root.querySelector('')
document.addEventListener('click', (event) => {
    if (!root.contains(event.target)) {
        if(root.classList.contains('show')){
            console.log('close o');
            root.classList.remove('show');
            document.querySelector('.container-wrapper').classList.remove('change');
        }
    }
});
