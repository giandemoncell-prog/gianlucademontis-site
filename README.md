# Gianluca Demontis - Personal Website

Sito web personale di Gianluca Demontis - Tech Coach, innovatore in automazione e content creator.

## 🚀 Deploy su GitHub e Cloudflare

### Prerequisiti
- Account GitHub
- Account Cloudflare
- Git installato sul tuo computer

### Passo 1: Carica i file su GitHub

1. Crea un nuovo repository su GitHub:
   - Vai su https://github.com/new
   - Nome repository: `gianlucademontis-website` (o quello che preferisci)
   - Lascia pubblico
   - NON aggiungere README, .gitignore o license (già inclusi)
   - Clicca "Create repository"

2. Carica i file dal tuo computer:
   ```bash
   # Naviga nella cartella dove hai salvato i file
   cd /path/to/your/files
   
   # Inizializza git
   git init
   
   # Aggiungi tutti i file
   git add .
   
   # Fai il primo commit
   git commit -m "Initial commit: Gianluca Demontis website"
   
   # Collega il repository remoto (sostituisci USERNAME con il tuo username GitHub)
   git remote add origin https://github.com/USERNAME/gianlucademontis-website.git
   
   # Pusha i file
   git branch -M main
   git push -u origin main
   ```

### Passo 2: Configura Cloudflare Pages

1. Accedi a Cloudflare Dashboard (https://dash.cloudflare.com)

2. Vai su "Workers & Pages" nel menu laterale

3. Clicca su "Create application" → "Pages" → "Connect to Git"

4. Seleziona il repository `gianlucademontis-website`

5. Configura il build:
   - **Project name**: gianlucademontis (o quello che preferisci)
   - **Production branch**: main
   - **Build command**: lascia vuoto (sito statico)
   - **Build output directory**: `/` (root)

6. Clicca "Save and Deploy"

7. Attendi che il deploy sia completato (1-2 minuti)

### Passo 3: Collega il dominio personalizzato

1. Nella dashboard di Cloudflare Pages, vai al tuo progetto

2. Clicca su "Custom domains"

3. Clicca "Set up a custom domain"

4. Inserisci: `gianlucademontis.xyz`

5. Cloudflare configurerà automaticamente i record DNS

6. Se il dominio è già su Cloudflare:
   - Il setup sarà automatico
   - Attendi 1-5 minuti per la propagazione
   
7. Se il dominio NON è su Cloudflare:
   - Aggiungi i nameserver Cloudflare al tuo registrar
   - Cloudflare ti fornirà i nameserver (es. `ava.ns.cloudflare.com`)

### Passo 4: Verifica

1. Visita https://gianlucademontis.xyz
2. Il sito dovrebbe essere online!

## 📁 Struttura File

```
.
├── index.html                      # Pagina principale
├── styles.css                      # Stili CSS
├── script.js                       # JavaScript per animazioni sfondo
├── profile_transparent.png         # Tua foto scontornata
├── favicon.ico                     # Favicon (formato ICO)
├── favicon.png                     # Favicon (formato PNG)
├── favicon.svg                     # Favicon (formato SVG)
├── apple-touch-icon.png           # Icona per dispositivi Apple
├── android-chrome-192x192.png     # Icona Android 192x192
├── android-chrome-512x512.png     # Icona Android 512x512
├── site.webmanifest               # Manifest per PWA
├── .gitignore                      # File da ignorare in Git
└── README.md                       # Questo file
```

## 🎨 Caratteristiche del Sito

- **Sfondo animato**: Canvas con linee circuitali, nodi pulsanti e particelle fluttuanti
- **Layout responsive**: Si adatta perfettamente a desktop, tablet e mobile
- **Immagine professionale**: Foto scontornata con effetti drop-shadow luminosi
- **Navigazione smooth**: Scroll fluido tra le sezioni
- **Performance ottimizzate**: Animazioni hardware-accelerated

## 🔄 Aggiornamenti Futuri

Per aggiornare il sito:

```bash
# Modifica i file necessari
# Poi esegui:

git add .
git commit -m "Descrizione delle modifiche"
git push

# Cloudflare aggiornerà automaticamente il sito in 1-2 minuti
```

## 🎨 Personalizzazioni

### Colori
Modifica le variabili CSS in `styles.css`:
```css
:root {
    --primary-color: #00d9ff;     /* Colore principale */
    --secondary-color: #0099cc;   /* Colore secondario */
    --dark-bg: #0a0e1a;          /* Sfondo scuro */
}
```

### Contenuti
Modifica il testo in `index.html` nelle sezioni:
- Hero (`<section id="hero">`)
- About (`<section id="about">`)
- Contact (`<section id="contact">`)

### Animazioni
Regola le animazioni in `script.js`:
- Velocità delle particelle
- Numero di linee circuitali
- Effetti di pulsazione

## 🛠️ Tecnologie

- HTML5
- CSS3 (con variabili CSS e animazioni)
- JavaScript Vanilla (Canvas API per animazioni)
- Font: Inter (Google Fonts)

## 📱 Responsive

Il sito è completamente responsive e ottimizzato per:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## ⚡ Performance

- Caricamento veloce
- Animazioni ottimizzate (Canvas)
- Nessuna dipendenza esterna eccetto Google Fonts
- Codice minimalista

## 📞 Supporto

Per problemi o domande:
- Email: info@gianlucademontis.xyz
- Issues: Apri un issue sul repository GitHub

## 📄 License

© 2026 Gianluca Demontis. Tutti i diritti riservati.
