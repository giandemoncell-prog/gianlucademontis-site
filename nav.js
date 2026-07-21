// Mobile navigation toggle (hamburger menu)
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('nav-links-open');
        toggle.classList.toggle('nav-toggle-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('nav-links-open');
            toggle.classList.remove('nav-toggle-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
});
