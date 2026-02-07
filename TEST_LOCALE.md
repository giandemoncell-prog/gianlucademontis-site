# Test Locale del Sito

## Come testare il sito localmente prima di caricarlo su GitHub

### Metodo 1: Python HTTP Server (Raccomandato)

1. Apri il terminale nella cartella dove hai scaricato i file
2. Esegui:
   ```bash
   python3 -m http.server 8000
   ```
   o per Python 2:
   ```bash
   python -m SimpleHTTPServer 8000
   ```
3. Apri il browser e vai su: http://localhost:8000

### Metodo 2: Node.js HTTP Server

1. Installa http-server globalmente:
   ```bash
   npm install -g http-server
   ```
2. Nella cartella dei file, esegui:
   ```bash
   http-server
   ```
3. Apri il browser all'indirizzo indicato (di solito http://localhost:8080)

### Metodo 3: Live Server (VS Code)

1. Installa l'estensione "Live Server" in VS Code
2. Fai click destro su index.html
3. Seleziona "Open with Live Server"

## Cosa verificare

✅ Lo sfondo animato con circuiti e particelle si muove
✅ La tua foto appare sulla destra
✅ Il testo è leggibile sulla sinistra
✅ I bottoni "Scopri di più" e "Contattami" funzionano
✅ La navigazione è fluida
✅ Il sito è responsive (prova a ridimensionare la finestra)
✅ La favicon appare nella tab del browser

## Problemi comuni

**Lo sfondo non si anima:**
- Controlla la console del browser (F12) per errori JavaScript
- Verifica che script.js sia caricato correttamente

**L'immagine non appare:**
- Verifica che profile_transparent.png sia nella stessa cartella di index.html
- Controlla il nome del file (è case-sensitive)

**Errori CORS:**
- Usa uno dei server HTTP sopra invece di aprire direttamente index.html nel browser
