# 🚀 Portfolio Gianluca Demontis

Portfolio personale di Gianluca Demontis - Educatore, Innovatore e Content Creator.

## 🌐 Live Demo

Il sito è disponibile su: [gianlucademontis.xyz](https://gianlucademontis.xyz)

## ✨ Caratteristiche

- **Design Moderno**: Interfaccia pulita e professionale con animazioni fluide
- **Responsive**: Ottimizzato per tutti i dispositivi (desktop, tablet, mobile)
- **Performance**: Sito statico ultra-veloce
- **SEO Ottimizzato**: Meta tags completi per motori di ricerca e social media
- **Accessibilità**: Design accessibile e navigazione intuitiva

## 🛠️ Tecnologie Utilizzate

- HTML5
- CSS3 (con animazioni e variabili CSS)
- JavaScript Vanilla
- Google Fonts (Syne, Work Sans, IBM Plex Mono)

## 📦 Deploy su Cloudflare Pages

### Metodo 1: Deploy Automatico da GitHub

1. Vai su [Cloudflare Pages](https://pages.cloudflare.com/)
2. Clicca su "Create a project"
3. Connetti il tuo account GitHub
4. Seleziona il repository `gianlucademontis-portfolio`
5. Configura il build:
   - **Build command**: (lascia vuoto)
   - **Build output directory**: `/`
6. Clicca su "Save and Deploy"

### Metodo 2: Deploy Manuale

```bash
# Installa Wrangler CLI
npm install -g wrangler

# Login a Cloudflare
wrangler login

# Deploy il progetto
wrangler pages deploy .
```

### Configurazione DNS

Dopo il deploy, vai nelle impostazioni del progetto su Cloudflare Pages e aggiungi il dominio personalizzato:
- Aggiungi `gianlucademontis.xyz` come custom domain
- Cloudflare configurerà automaticamente i record DNS necessari

## 📁 Struttura del Progetto

```
gianlucademontis-portfolio/
├── index.html          # File principale del sito
└── README.md           # Questo file
```

## 🔄 Aggiornamenti

Per aggiornare il sito:

1. Modifica il file `index.html`
2. Commit e push su GitHub:
   ```bash
   git add .
   git commit -m "Descrizione delle modifiche"
   git push origin main
   ```
3. Cloudflare Pages rileverà automaticamente le modifiche e rideploya il sito

## 📝 Personalizzazione

### Colori

I colori principali sono definiti come variabili CSS in `:root`:

```css
--color-bg: #0a0e1a;           /* Sfondo principale */
--color-accent: #00d9ff;       /* Colore accento (blu cyan) */
--color-secondary: #7c3aed;    /* Colore secondario (viola) */
--color-tertiary: #ff6b35;     /* Colore terziario (arancione) */
```

### Font

Il sito utilizza tre famiglie di font:
- **Syne**: Per titoli e heading
- **Work Sans**: Per testo body
- **IBM Plex Mono**: Per elementi monospace/code

### Sezioni

Il sito è organizzato in 5 sezioni principali:
1. **Hero**: Introduzione e CTA
2. **About**: Chi sono e focus principali
3. **Services**: Competenze e servizi offerti
4. **Projects**: Progetti e presenza online
5. **Contact**: Form di contatto

## 📧 Contatti

- **Email**: info@gianlucademontis.xyz
- **Website**: [gianlucademontis.xyz](https://gianlucademontis.xyz)
- **n8n Instance**: [n8n.gianlucademontis.xyz](https://n8n.gianlucademontis.xyz)

## 📄 Licenza

© 2026 Gianluca Demontis. Tutti i diritti riservati.

---

Made with ❤️ by Gianluca Demontis
