// Tracking eventi GA4 minimo ma reale: CTA verso Lavora con me, click in uscita
// (Amazon, GitHub, AI Act Academy, demo), invio form newsletter.
// Usa il tag GA4 gia' presente in ogni pagina; un solo listener delegato al posto
// di un onClick su ogni link, cosi' vale anche per i link aggiunti in futuro.
(function () {
    function track(name, params) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params || {});
        }
    }
    // Disponibile per gli script inline delle pagine (form, lead magnet).
    window.gdTrack = track;

    function outbound(name, label, href) {
        track(name, {
            event_category: 'outbound',
            event_label: label,
            link_url: href,
            page_path: location.pathname
        });
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href') || '';

        if (href.indexOf('amzn.to/') !== -1 || href.indexOf('amazon.') !== -1) {
            outbound('click_amazon_book', href.indexOf('/author/') !== -1 ? 'Pagina autore Amazon' : 'Libro AI e DSA', href);
        } else if (href.indexOf('github.com') !== -1) {
            outbound('click_github_repo', 'GitHub Repository', href);
        } else if (href.indexOf('corsi.gianlucademontis.xyz') !== -1) {
            outbound('click_ai_act_academy', 'AI Act Academy', href);
        } else if (href.indexOf('/lavora-con-me/') !== -1 && location.pathname.indexOf('/lavora-con-me/') === -1) {
            track('lavora_con_me_click', { link_text: (link.textContent || '').trim().slice(0, 60), page_path: location.pathname });
        } else if (href.indexOf('generatore-dsa.streamlit.app') !== -1) {
            track('demo_click', { page_path: location.pathname });
        }
    }, true);

    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (form.classList && (form.classList.contains('newsletter-form') || form.classList.contains('newsletter-inline'))) {
            track('newsletter_signup_submit', { page_path: location.pathname });
        }
    }, true);
})();
