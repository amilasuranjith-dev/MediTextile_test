// Mobile Menu Toggle
const btn = document.querySelector('button.mobile-menu-button');
const menu = document.querySelector('.mobile-menu');

btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.classList.add('shadow-md');
        navbar.classList.replace('bg-white/90', 'bg-white/95');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.replace('bg-white/95', 'bg-white/90');
    }
});

// Reveal Animations on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section > div').forEach((section) => {
    section.classList.add('opacity-0'); // Initial state
    observer.observe(section);
});

// Dark Mode Toggle
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    themeToggleBtns.forEach(btn => {
        const darkIcon = btn.querySelector('.theme-toggle-dark-icon');
        const lightIcon = btn.querySelector('.theme-toggle-light-icon');

        if (isDark) {
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
        } else {
            lightIcon.classList.remove('hidden');
            darkIcon.classList.add('hidden');
        }
    });
}

// Initial check
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}
updateThemeIcons();

themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        // Toggle theme
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateThemeIcons();
    });
});

