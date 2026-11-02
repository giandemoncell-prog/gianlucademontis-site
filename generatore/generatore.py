# generatore.py — Generatore di materiali didattici inclusivi
# Richiede: google-generativeai, python-docx, python-pptx, pyyaml

import os
import sys
import yaml
import argparse
import google.generativeai as genai
from docx import Document
from docx.shared import Pt, RGBColor
from pptx import Presentation
from pptx.util import Inches, Pt as PptPt
from datetime import datetime


# ─── CONFIGURAZIONE ───────────────────────────────────────────────────────────

def carica_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        try:
            with open(".env") as f:
                for line in f:
                    if line.startswith("GEMINI_API_KEY="):
                        key = line.split("=", 1)[1].strip()
        except FileNotFoundError:
            pass
    if not key:
        sys.exit("Errore: chiave API Gemini non trovata. "
                 "Crea un file .env con GEMINI_API_KEY=la_tua_chiave")
    return key


def carica_profilo(nome_studente: str) -> dict:
    percorso = f"profili/profilo_{nome_studente.lower().replace(' ', '_')}.yaml"
    try:
        with open(percorso, encoding="utf-8") as f:
            return yaml.safe_load(f)
    except FileNotFoundError:
        sys.exit(f"Errore: profilo non trovato in {percorso}")


def carica_testo(percorso_testo: str) -> str:
    try:
        with open(percorso_testo, encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        sys.exit(f"Errore: file testo non trovato: {percorso_testo}")


# ─── COSTRUZIONE DEL PROMPT ───────────────────────────────────────────────────

def costruisci_istruzioni(profilo: dict) -> str:
    p = profilo.get("presentazione", {})
    difficolta = profilo.get("profilo_cognitivo", {}).get("aree_difficolta", {})
    note = profilo.get("note_osservazioni", [])

    istruzioni = []

    if "lettura" in difficolta:
        istruzioni.append("Usa frasi brevi (max 20 parole). Evita subordinate complesse.")
    if "memoria_di_lavoro" in difficolta:
        istruzioni.append("Un concetto per paragrafo. Non unire più idee nello stesso blocco.")
    if difficolta.get("scrittura"):
        istruzioni.append("Usa elenchi puntati invece di paragrafi continui dove possibile.")

    max_punti = p.get("max_punti_per_slide", 3)
    max_righe = p.get("max_righe_paragrafo", 4)
    istruzioni.append(f"Ogni blocco concettuale: massimo {max_punti} punti elenco.")
    istruzioni.append(f"Ogni paragrafo: massimo {max_righe} righe.")
    istruzioni.append("Evidenzia in grassetto le parole chiave (massimo 3 per paragrafo).")
    istruzioni.append("Usa corsivo per i termini tecnici alla prima occorrenza.")

    for nota in note:
        istruzioni.append(nota)

    return "\n".join(f"- {i}" for i in istruzioni)


def costruisci_prompt_testo(testo: str, istruzioni: str) -> str:
    return f"""Sei un esperto di didattica inclusiva per studenti con DSA e BES.
Adatta il seguente testo didattico rispettando TUTTE queste regole:

{istruzioni}

Produci:
1. Una versione adattata del testo (mantieni TUTTI i concetti, cambia solo la forma)
2. Un glossario con le 6-8 parole più difficili del testo, con definizione semplice

Formato risposta:
---TESTO ADATTATO---
[testo qui]
---GLOSSARIO---
termine: definizione
termine: definizione

TESTO ORIGINALE DA ADATTARE:
{testo}"""


def costruisci_prompt_infografica(testo: str, istruzioni: str) -> str:
    return f"""Sei un esperto di didattica inclusiva. Crea un'infografica testuale dal testo seguente.

Regole:
{istruzioni}
- Identifica 3-5 concetti principali
- Per ogni concetto: titolo breve (max 5 parole) + 2-3 punti elenco
- Suggerisci un'immagine descrittiva per ogni blocco (descrizione in 10 parole)
- Aggiungi un titolo generale e un glossario finale con 6 termini chiave

Formato risposta:
---TITOLO---
[titolo infografica]
---BLOCCO 1---
TITOLO: [titolo]
IMMAGINE: [descrizione immagine da generare]
• punto 1
• punto 2
• punto 3
[ripeti per ogni blocco]
---GLOSSARIO---
termine: definizione breve

TESTO:
{testo}"""


def costruisci_prompt_slide(testo: str, istruzioni: str) -> str:
    return f"""Crea una presentazione didattica dal testo seguente per studenti con DSA.

Regole:
{istruzioni}
- Slide 1: titolo + materia
- Slide 2: "Cosa impariamo oggi" con 3 obiettivi
- Slide 3-N: una slide per concetto (titolo + max 3 punti + descrizione immagine)
- Penultima slide: mappa concettuale testuale dei temi trattati
- Ultima slide: 5-8 parole chiave con definizione

Formato risposta:
---SLIDE 1---
TITOLO: [titolo]
SOTTOTITOLO: [materia e classe]
---SLIDE 2---
TITOLO: Cosa impariamo oggi
• obiettivo 1
• obiettivo 2
• obiettivo 3
---SLIDE N---
TITOLO: [titolo]
IMMAGINE: [descrizione]
• punto 1
• punto 2
• punto 3
[continua]

TESTO:
{testo}"""


# ─── GENERAZIONE CONTENUTI ────────────────────────────────────────────────────

def genera_contenuto(prompt: str, model) -> str:
    try:
        risposta = model.generate_content(prompt)
        return risposta.text
    except Exception as e:
        print(f"Errore Gemini: {e}")
        return ""


# ─── SALVATAGGIO OUTPUT ───────────────────────────────────────────────────────

def salva_testo_docx(contenuto: str, profilo: dict, percorso: str):
    doc = Document()
    p = profilo.get("presentazione", {})

    font_nome = p.get("font", "Arial").split()[0]
    stile = doc.styles["Normal"]
    stile.font.name = font_nome
    stile.font.size = Pt(12)

    sezioni = contenuto.split("---")
    testo_corrente = ""
    glossario_corrente = ""
    in_glossario = False

    for sezione in sezioni:
        sezione = sezione.strip()
        if sezione == "TESTO ADATTATO":
            in_glossario = False
        elif sezione == "GLOSSARIO":
            in_glossario = True
        elif sezione:
            if in_glossario:
                glossario_corrente = sezione
            else:
                testo_corrente = sezione

    for riga in testo_corrente.split("\n"):
        if riga.strip():
            para = doc.add_paragraph(riga)
            para.paragraph_format.space_after = Pt(6)

    if glossario_corrente:
        doc.add_paragraph()
        heading = doc.add_paragraph("Parole chiave")
        heading.style = doc.styles["Heading 2"]
        for voce in glossario_corrente.split("\n"):
            if ":" in voce:
                termine, defin = voce.split(":", 1)
                para = doc.add_paragraph()
                run_t = para.add_run(termine.strip() + ": ")
                run_t.bold = True
                para.add_run(defin.strip())

    doc.save(percorso)


def salva_slide_pptx(contenuto: str, profilo: dict, percorso: str):
    prs = Presentation()
    p = profilo.get("presentazione", {})
    font_nome = p.get("font", "Arial").split()[0]
    layout_vuoto = prs.slide_layouts[6]

    slide_testi = contenuto.split("---SLIDE")
    for blocco in slide_testi:
        blocco = blocco.strip()
        if not blocco or blocco.isdigit():
            continue

        linee = [l.strip() for l in blocco.split("\n") if l.strip()]
        titolo = ""
        punti = []

        for linea in linee:
            if linea.startswith("TITOLO:"):
                titolo = linea.replace("TITOLO:", "").strip()
            elif linea.startswith("IMMAGINE:"):
                pass
            elif linea.startswith("•") or linea.startswith("-"):
                punti.append(linea.lstrip("•- ").strip())
            elif linea.startswith("SOTTOTITOLO:"):
                punti.insert(0, linea.replace("SOTTOTITOLO:", "").strip())

        if not titolo:
            continue

        slide = prs.slides.add_slide(layout_vuoto)

        txBox = slide.shapes.add_textbox(
            Inches(0.3), Inches(0.2), Inches(9), Inches(1.2)
        )
        tf = txBox.text_frame
        tf.word_wrap = True
        p_titolo = tf.paragraphs[0]
        p_titolo.text = titolo
        p_titolo.runs[0].font.size = PptPt(28)
        p_titolo.runs[0].font.bold = True
        p_titolo.runs[0].font.name = font_nome

        if punti:
            txBox2 = slide.shapes.add_textbox(
                Inches(0.3), Inches(1.5), Inches(9), Inches(5)
            )
            tf2 = txBox2.text_frame
            tf2.word_wrap = True
            for i, punto in enumerate(punti[:3]):
                para = tf2.paragraphs[0] if i == 0 else tf2.add_paragraph()
                para.text = f"• {punto}"
                if para.runs:
                    para.runs[0].font.size = PptPt(18)
                    para.runs[0].font.name = font_nome

    prs.save(percorso)


def salva_infografica_txt(contenuto: str, percorso: str):
    with open(percorso, "w", encoding="utf-8") as f:
        f.write(contenuto)


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Genera materiali didattici inclusivi con Gemini AI"
    )
    parser.add_argument("--studente", required=True,
                        help="Nome del profilo studente (es. 'mario')")
    parser.add_argument("--testo", required=True,
                        help="Percorso del file testo da adattare")
    parser.add_argument("--nota", default="",
                        help="Istruzione aggiuntiva opzionale per questa elaborazione")
    parser.add_argument("--tag", default="",
                        help="Etichetta per i file di output (es. 'lotta-investiture')")
    args = parser.parse_args()

    print(f"Carico il profilo di {args.studente}...")
    api_key = carica_api_key()
    profilo = carica_profilo(args.studente)
    testo = carica_testo(args.testo)
    genai.configure(api_key=api_key)
    # Se questo nome è obsoleto: verifica su aistudio.google.com/models
    model = genai.GenerativeModel("gemini-2.0-flash")

    istruzioni = costruisci_istruzioni(profilo)
    if args.nota:
        istruzioni += f"\n- {args.nota}"

    data_oggi = datetime.now().strftime("%Y-%m-%d")
    nome_studente = args.studente.lower().replace(" ", "_")
    suffisso = f"_{args.tag}" if args.tag else ""
    cartella_out = f"output/{nome_studente}/{data_oggi}{suffisso}"
    os.makedirs(cartella_out, exist_ok=True)

    print("Genero il testo adattato...")
    testo_adattato = genera_contenuto(
        costruisci_prompt_testo(testo, istruzioni), model
    )
    salva_testo_docx(
        testo_adattato, profilo,
        f"{cartella_out}/testo_adattato.docx"
    )

    print("Genero l'infografica...")
    infografica = genera_contenuto(
        costruisci_prompt_infografica(testo, istruzioni), model
    )
    salva_infografica_txt(infografica, f"{cartella_out}/infografica.txt")

    print("Genero le slide...")
    slide_content = genera_contenuto(
        costruisci_prompt_slide(testo, istruzioni), model
    )
    salva_slide_pptx(
        slide_content, profilo,
        f"{cartella_out}/presentazione.pptx"
    )

    print(f"\nDone. File salvati in: {cartella_out}/")
    print("  - testo_adattato.docx")
    print("  - infografica.txt")
    print("  - presentazione.pptx")


if __name__ == "__main__":
    main()
