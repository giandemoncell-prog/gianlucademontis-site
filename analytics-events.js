// Tracking eventi GA4 minimo ma reale: CTA verso Lavora con me, click Amazon,
// click demo, invio form newsletter. Usa il tag GA4 gia' presente in ogni pagina.
(function () {
    function track(name, params) {
        if (typeof gtag === 'function') {
            gtag('event', name, params || {});
        }
    }

    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href') || '';

        if (href.indexOf('amzn.to/') !== -1 || href.indexOf('amazon.') !== -1) {
            track('amazon_click', { link_url: href, page_path: location.pathname });
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
