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

// Banner giorni gratis ebook IT (26/11 9:00 → 1/12 9:00 ora italiana, = KDP 26/11 00:00 → 30/11 23:59 PST).
// Si spegne da solo dopo la scadenza: niente testo scaduto online. Solo pagine IT del filone libro/scuola.
(function () {
    var INIZIO = Date.parse('2026-11-26T09:00:00+01:00');
    var FINE = Date.parse('2026-12-01T09:00:00+01:00');
    var ora = Date.now();
    if (ora < INIZIO || ora >= FINE) return;
    var p = location.pathname;
    if (!/^\/($|index\.html|libro\/|blog\/|prompt-dsa\/|generatore\/|generatore-profili\/|ai-act\/)/.test(p)) return;
    document.addEventListener('DOMContentLoaded', function () {
        var ultimo = ora >= Date.parse('2026-11-30T00:00:00+01:00');
        var bar = document.createElement('div');
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'Promozione libro');
        // Fissa subito sotto la navbar (anch'essa fixed); in basso la coprirebbe il banner dei cookie.
        var nav = document.querySelector('.navbar');
        var navH = nav && getComputedStyle(nav).position === 'fixed' ? nav.offsetHeight : 0;
        bar.style.cssText = 'background:#E87722;color:#fff;text-align:center;padding:10px 44px 10px 16px;font:600 15px/1.4 system-ui,sans-serif;position:fixed;left:0;right:0;top:' + navH + 'px;z-index:999';
        var chiudi = document.createElement('button');
        chiudi.type = 'button';
        chiudi.setAttribute('aria-label', 'Chiudi');
        chiudi.textContent = '×';
        chiudi.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 8px';
        chiudi.addEventListener('click', function () { bar.remove(); document.body.style.paddingTop = padOrig; });
        bar.appendChild(chiudi);
        var a = document.createElement('a');
        a.href = 'https://www.amazon.it/dp/B0H3DS3BHG';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.cssText = 'color:#fff;text-decoration:underline';
        a.textContent = 'Scaricalo gratis su Amazon';
        bar.appendChild(document.createTextNode((ultimo ? '⏰ Ultime ore: l' : '🎁 L') +
            '\u2019ebook \u00abIntelligenza Artificiale per la Didattica Inclusiva\u00bb \u00e8 gratis fino a marted\u00ec 1/12 ore 9. '));
        bar.appendChild(a);
        var padOrig = document.body.style.paddingTop;
        document.body.appendChild(bar);
        document.body.style.paddingTop = (parseFloat(getComputedStyle(document.body).paddingTop) || 0) + bar.offsetHeight + 'px';
    });
})();
