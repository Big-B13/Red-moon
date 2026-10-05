// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ========== NAV ACTIVE STATE ==========
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ========== ABOUT PAGE SLIDESHOW ==========
let slideIndex = 1;
let slideTimer;

function showSlide(n) {
    let slides = document.getElementsByClassName('slide');
    let dots = document.getElementsByClassName('dot');

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }

    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlide(slideIndex = n);
    autoSlide();
}

function autoSlide() {
    slideTimer = setTimeout(() => {
        slideIndex++;
        showSlide(slideIndex);
        autoSlide();
    }, 5000);
}

// ========== PROJECT PAGE SLIDESHOWS ==========
function goToSlide(slideshowId, index) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide-item');
    const dots = slideshow.querySelectorAll('.slideshow-dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function autoSlideProject(slideshowId) {
    const slideshow = document.getElementById(slideshowId);
    if (!slideshow) return;

    const slides = slideshow.querySelectorAll('.slide-item');
    let current = 0;

    setInterval(() => {
        slides[current].classList.remove('active');
        slideshow.querySelectorAll('.slideshow-dot')[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
        slideshow.querySelectorAll('.slideshow-dot')[current].classList.add('active');
    }, 5000);
}

// ========== LOCAL VIDEO PLAYER ==========
function playLocalVideo(button) {
    const videoContainer = button.closest('.project-media');
    const video = videoContainer.querySelector('.local-video-player');
    const thumbnail = videoContainer.querySelector('.video-thumbnail-placeholder');
    const playBtn = videoContainer.querySelector('.play-button');

    if (video) {
        if (thumbnail) thumbnail.style.display = 'none';
        playBtn.style.display = 'none';
        video.style.display = 'block';
        video.play();

        let hideTimer;
        const hideControls = () => { video.style.cursor = 'none'; };
        const showControls = () => {
            video.style.cursor = 'auto';
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hideControls, 3000);
        };

        video.addEventListener('mousemove', showControls);
        video.addEventListener('mouseenter', showControls);
        video.addEventListener('mouseleave', hideControls);

        video.addEventListener('ended', function () {
            clearTimeout(hideTimer);
            if (thumbnail) thumbnail.style.display = 'flex';
            playBtn.style.display = 'flex';
            video.style.display = 'none';
            video.style.cursor = 'auto';
            video.removeEventListener('mousemove', showControls);
            video.removeEventListener('mouseenter', showControls);
            video.removeEventListener('mouseleave', hideControls);
        }, { once: true });
    }
}

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    // About page slideshow
    if (document.getElementsByClassName('slide').length > 0) {
        showSlide(slideIndex);
        autoSlide();
    }

    // Project page slideshows
    if (document.getElementById('slideshow1')) {
        autoSlideProject('slideshow1');
    }
    if (document.getElementById('slideshow2')) {
        autoSlideProject('slideshow2');
    }
});