// Consenso ai cookie statistici: Google Analytics 4 si carica solo dopo "Accetta".
// Incluso nell'<head> di ogni pagina al posto dello snippet gtag: definisce subito
// dataLayer e gtag(), cosi' analytics-events.js e gli script delle pagine possono
// chiamarli sempre; senza consenso gli eventi restano in coda e non partono mai.
// La scelta resta nel browser (localStorage "gd-consenso": "si" | "no").
// window.gdConsenso() riapre il banner (link nella pagina /privacy/).
(function () {
    var GA_ID = 'G-ZGK3RC2PZ9';
    var CHIAVE = 'gd-consenso';

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };

    function leggi() {
        try { return localStorage.getItem(CHIAVE); } catch (e) { return null; }
    }
    function salva(v) {
        try { localStorage.setItem(CHIAVE, v); } catch (e) { /* navigazione privata: vale per questa visita */ }
    }

    var caricato = false;
    function caricaGA() {
        if (caricato) return;
        caricato = true;
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    function chiudi(banner) {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    }

    function mostra() {
        if (document.getElementById('gd-consenso')) return;
        var b = document.createElement('div');
        b.id = 'gd-consenso';
        b.setAttribute('role', 'dialog');
        b.setAttribute('aria-live', 'polite');
        b.setAttribute('aria-label', 'Consenso ai cookie');
        b.innerHTML =
            '<p>Uso Google Analytics per contare le visite in forma aggregata. Si attiva solo se accetti. ' +
            '<a href="/privacy/">Privacy e cookie</a></p>' +
            '<div><button type="button" data-v="no">Rifiuta</button>' +
            '<button type="button" data-v="si">Accetta</button></div>';
        var st = document.createElement('style');
        st.textContent =
            '#gd-consenso{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:640px;margin:0 auto;' +
            'display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:14px 16px;' +
            'background:var(--darker-bg,#050810);color:var(--text-primary,#fff);border:1px solid var(--card-border,rgba(0,217,255,.2));' +
            'border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.4);font-size:.9rem;line-height:1.5}' +
            '#gd-consenso p{margin:0;flex:1 1 260px;color:var(--text-secondary,#a0aec0)}' +
            '#gd-consenso a{color:var(--primary-color,#00d9ff)}' +
            '#gd-consenso div{display:flex;gap:8px}' +
            '#gd-consenso button{font:inherit;cursor:pointer;border-radius:8px;padding:8px 14px;' +
            'border:1px solid var(--primary-color,#00d9ff);background:transparent;color:var(--text-primary,#fff)}' +
            '#gd-consenso button[data-v="si"]{background:var(--primary-color,#00d9ff);color:#050810;font-weight:600}' +
            '#gd-consenso button:focus-visible{outline:2px solid var(--primary-color,#00d9ff);outline-offset:2px}';
        b.appendChild(st);
        b.addEventListener('click', function (e) {
            var v = e.target.getAttribute && e.target.getAttribute('data-v');
            if (!v) return;
            salva(v);
            chiudi(b);
            if (v === 'si') {
                caricaGA();
            } else {
                // ritiro del consenso: cancello i cookie _ga e, se GA era attivo, ricarico senza
                document.cookie.split(';').forEach(function (c) {
                    var nome = c.split('=')[0].trim();
                    if (nome.indexOf('_ga') === 0) {
                        ['', '; domain=.' + location.hostname.replace(/^www\./, '')].forEach(function (d) {
                            document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
                        });
                    }
                });
                if (caricato) location.reload();
            }
        });
        document.body.appendChild(b);
    }

    window.gdConsenso = function () {
        if (document.body) mostra();
    };

    var scelta = leggi();
    if (scelta === 'si') {
        caricaGA();
    } else if (scelta !== 'no') {
        if (document.body) mostra();
        else document.addEventListener('DOMContentLoaded', mostra);
    }
})();
