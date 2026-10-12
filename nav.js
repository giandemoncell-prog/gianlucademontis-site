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

// Anti-bot per il form newsletter (webhook n8n newsletter-signup): campo trappola nascosto
// + istante di caricamento. Il webhook scarta i POST senza "t", troppo veloci o con la trappola
// compilata: ad agosto 2026 i bot avevano iscritto 240 indirizzi chiamando il webhook direttamente.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form[action*="newsletter-signup"]').forEach(form => {
        const trap = document.createElement('input');
        trap.type = 'text';
        trap.name = 'website';
        trap.tabIndex = -1;
        trap.autocomplete = 'off';
        trap.setAttribute('aria-hidden', 'true');
        trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
        const t = document.createElement('input');
        t.type = 'hidden';
        t.name = 't';
        t.value = String(Date.now());
        form.append(trap, t);
    });
});
