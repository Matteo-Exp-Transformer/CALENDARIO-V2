#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
estrai_prompt.py — ondata P0-EX dell'Indagine Skill Matteo.

Estrae dai transcript Cursor SOLO i messaggi scritti da Matteo, li data e li classifica
secondo la regola di attribuzione del piano (PIANO_INDAGINE.md §3.3).

Perche' uno script e non un agente che legge: 4.000+ messaggi su 800+ chat vanno estratti
in modo deterministico e ripetibile. Cinque agenti diversi produrrebbero cinque corpus diversi.

Input   : C:\\Users\\matte.MIO\\.cursor\\projects\\<proj>\\agent-transcripts\\<uuid>\\<uuid>.jsonl
Output  : docs/_lavoro/Indagine-Corpus/prompts_<label>.jsonl   (FUORI da git)
          docs/_lavoro/Indagine-Corpus/_STATISTICHE.md

Uso:
    python estrai_prompt.py                 # estrae tutto
    python estrai_prompt.py --dry-run       # conta e basta, non scrive nulla
    python estrai_prompt.py --solo CB-v2    # un solo progetto

Due trappole del formato, gestite qui dentro:
 1. i .jsonl NON sono sempre un oggetto per riga: capita che due oggetti siano concatenati
    senza a capo. Si usa un decoder incrementale sull'intero file, non split per righe.
 2. il timestamp del messaggio esiste solo in una parte dei transcript (~20%). Quando manca
    si usa la data di modifica del file, e il campo date_src lo dichiara.
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

# --------------------------------------------------------------------------- config

BASE_TRANSCRIPTS = Path(r"C:\Users\matte.MIO\.cursor\projects")
BASE_OUT = Path(r"c:\Users\matte.MIO\Documents\GitHub\CalendarBackup-v2\docs\_lavoro\Indagine-Corpus")

# cartella progetto Cursor -> etichetta usata nei report dell'indagine
PROGETTI = {
    "c-Users-matte-MIO-Documents-GitHub-CalendarBackup-v2": "CB-v2",
    "c-Users-matte-MIO-Documents-GitHub-Calendarbackup": "CB-old",
    "c-Users-matte-MIO-Documents-GitHub-Calendarbackup-worktrees-remove-coperto-increase-caraffe": "CB-old-wt",
    "c-Users-matte-MIO-Documents-GitHub-BHM-v-2": "BHM-v2",
    "c-Users-matte-MIO-Documents-GitHub-BHM-Zen": "BHM-Zen",
    "c-Users-matte-MIO-Documents-GitHub-Trade-Analyst-Agent": "Trade-Analyst",
    "c-Users-matte-MIO-Documents-GitHub-Trading-Platform-main": "Trading-Platform",
    "c-Users-matte-MIO-Documents-GitHub-MathBoy2-main": "MathBoy2",
    "c-Users-matte-MIO-Documents-GitHub-Game": "Game",
    "c-Users-matte-MIO-Documents-GitHub-Qwen-Test": "Qwen-Test",
}

MESI = {m: i + 1 for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])}

RE_TIMESTAMP = re.compile(r"<timestamp>(.*?)</timestamp>", re.S)
RE_QUERY = re.compile(r"<user_query>(.*?)</user_query>", re.S)
RE_DATA = re.compile(r"\b([A-Z][a-z]{2}) (\d{1,2}), (\d{4})")

# --- classificazione (PIANO_INDAGINE.md §3.3) -------------------------------------

# prompt preparato da un agente e incollato da Matteo: conta come REGIA, non come sua scrittura
RE_REGIA_TESTA = re.compile(r"^\s*(profilo|prompt)\s*[:\-]", re.I)
MARCATORI_REGIA = ("modalità:", "modalita:", "skill da leggere:", "output attesi:",
                   "non caricare:", "criterio di fatto:")

# comandi brevi del vocabolario di Matteo -> ratifica, non decisione argomentata
COMANDI_OK = {
    "ok", "si", "sì", "no", "va bene", "vabene", "perfetto", "procedi", "continua", "vai",
    "lavoro ok", "fai report finale", "dammi follow up", "prepara", "prepara prompt",
    "spiegamelo semplice", "ragioniamo", "ottimo", "ottimo lavoro", "grazie", "fatto",
    "si procedi", "ok procedi", "ok grazie", "si grazie", "conferma", "confermo",
}

RE_PASTE = re.compile(
    r"(npm ERR|Traceback \(most recent|\bat [A-Za-z$_][\w.$]*\s*\(|"
    r"^\s*(PASS|FAIL|✓|✗|×)\s|error TS\d{3,}|Uncaught \w*Error|"
    r"DOM Path:|Console Error|warning:.*\n.*\n)", re.M)

# pattern che rendono un messaggio non citabile nei report (resta nel corpus, fuori da git)
RE_SEGRETI = re.compile(
    r"(sk-[A-Za-z0-9_\-]{12,}|eyJ[A-Za-z0-9_\-]{20,}|SERVICE_ROLE|BREVO_API_KEY|"
    r"SUPABASE_[A-Z_]*KEY|xkeysib-|password\s*[:=]|[\w.+-]+@[\w-]+\.[a-z]{2,})", re.I)


def ripulisci(testo: str) -> str:
    """
    Toglie gli ALLEGATI e lascia la prosa umana.

    Serve perche' Cursor accoda automaticamente roba al messaggio: un click sull'elemento
    aggiunge 'DOM Path: div#root > ...', un errore aggiunge lo stack. Senza questa pulizia
    un messaggio come 'metti l'effetto luminoso al passaggio del mouse DOM Path: div[3]...'
    finirebbe tra i paste e si perderebbe un'istruzione vera di Matteo.
    """
    t = re.sub(r"```.*?```", " ", testo, flags=re.S)          # blocchi di codice
    t = re.sub(r"DOM Path:.*?(?:\n|$)", " ", t, flags=re.S)    # allegato elemento Cursor
    t = re.sub(r"Position:\s*top=.*?(?:\n|$)", " ", t, flags=re.S)      # selezione elemento
    t = re.sub(r"(React Component|HTML Element|Selected Element):.*?(?:\n|$)", " ", t, flags=re.S)
    t = re.sub(r"^.*(?:npm ERR|Traceback \(most recent|error TS\d{3,}|"
               r"Uncaught \w*Error|Console Error|^\s*at [A-Za-z$_][\w.$]*\s*\().*$",
               " ", t, flags=re.M)                             # righe di errore/stack
    t = re.sub(r"^\s*(PASS|FAIL|✓|✗|×)\s.*$", " ", t, flags=re.M)  # output test
    return re.sub(r"\s+", " ", t).strip()


def classifica(testo: str, umano: str) -> str:
    """
    Una sola etichetta per messaggio. L'ordine dei controlli conta.
    `umano` = testo senza allegati: e' su quello che si decide se c'e' contenuto suo.
    """
    t = testo.strip()
    basso = t.lower()

    # 1. prompt preparato: struttura riconoscibile, indipendente dalla lunghezza
    if RE_REGIA_TESTA.match(t) and any(m in basso for m in MARCATORI_REGIA):
        return "M-REGIA"
    if basso.count("\n") > 3 and sum(m in basso for m in MARCATORI_REGIA) >= 2:
        return "M-REGIA"

    # 2. comando secco / ratifica
    comando = re.sub(r"[.!,\s]+$", "", umano.lower())
    if len(umano) <= 60 and (comando in COMANDI_OK or
                             any(comando.startswith(c + " ") for c in ("ok", "si", "sì", "lavoro ok"))):
        return "M-OK"

    # 3. allegato senza prosa: e' M-PASTE solo se e' stato TOLTO qualcosa di sostanzioso.
    #    Un messaggio corto e basta ("commit e push su main") e' un'istruzione sua, non un incollato.
    allegato_tolto = len(t) - len(umano)
    if len(umano) < 25 and allegato_tolto > 40:
        return "M-PASTE"
    # solo riferimenti a file ("@PROMPT_AGENTI.md (113-155)"): e' un allegato, non una richiesta.
    # Ma "compila un report e mettilo in @docs/..." e' una richiesta: conta cosa resta tolti gli @.
    if umano.count("@") >= 1 and len(re.sub(r"@\S+", " ", umano).strip(" .,:()0-9-")) < 20:
        return "M-PASTE"

    # 4. parole sue (anche se il messaggio portava un allegato in coda)
    return "M-VOCE"


def data_da_timestamp(raw: str):
    """'Sunday, Aug 2, 2026, 2:53 PM (UTC+2)' -> '2026-08-02'. None se non parsabile."""
    m = RE_DATA.search(raw or "")
    if not m:
        return None
    mese, giorno, anno = m.group(1), int(m.group(2)), int(m.group(3))
    if mese not in MESI:
        return None
    try:
        return datetime(anno, MESI[mese], giorno).strftime("%Y-%m-%d")
    except ValueError:
        return None


def oggetti_json(testo: str):
    """
    I .jsonl Cursor a volte hanno piu' oggetti sulla stessa riga, senza a capo.
    Un decoder incrementale li prende tutti; il parsing per righe ne perderebbe.
    """
    dec = json.JSONDecoder()
    i, n = 0, len(testo)
    while i < n:
        while i < n and testo[i] in " \r\n\t":
            i += 1
        if i >= n:
            return
        try:
            obj, fine = dec.raw_decode(testo, i)
        except ValueError:
            # riga corrotta: salta al prossimo inizio oggetto plausibile
            nxt = testo.find('{"role"', i + 1)
            if nxt == -1:
                return
            i = nxt
            continue
        yield obj
        i = fine


def testo_utente(obj):
    """Estrae il testo dei blocchi 'text' di un messaggio user. '' se non e' un messaggio user."""
    if obj.get("role") != "user":
        return ""
    contenuto = (obj.get("message") or {}).get("content") or []
    if isinstance(contenuto, str):
        return contenuto
    pezzi = [c.get("text", "") for c in contenuto
             if isinstance(c, dict) and c.get("type") == "text"]
    return "\n".join(p for p in pezzi if p)


def estrai_progetto(cartella: Path, etichetta: str):
    """Ritorna (righe, scartati, n_chat) per un progetto Cursor."""
    radice = cartella / "agent-transcripts"
    if not radice.is_dir():
        return [], 0, 0

    righe, scartati, chat = [], 0, 0
    for f in sorted(radice.glob("*/*.jsonl")):
        chat += 1
        try:
            grezzo = f.read_text(encoding="utf-8", errors="replace")
        except OSError as e:
            print(f"  ! illeggibile {f.name}: {e}", file=sys.stderr)
            continue

        data_file = datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y-%m-%d")
        seq = 0
        for obj in oggetti_json(grezzo):
            testo = testo_utente(obj)
            if not testo:
                continue
            q = RE_QUERY.search(testo)
            if not q:
                # messaggi iniettati dal sistema Cursor: non sono parole di Matteo
                scartati += 1
                continue
            corpo = q.group(1).strip()
            if not corpo:
                scartati += 1
                continue

            ts = RE_TIMESTAMP.search(testo)
            data_msg = data_da_timestamp(ts.group(1)) if ts else None
            umano = ripulisci(corpo)
            seq += 1
            righe.append({
                "proj": etichetta,
                "chat_uuid": f.stem,
                "seq": seq,
                "date": data_msg or data_file,
                "date_src": "msg" if data_msg else "file",
                "chars": len(corpo),
                "chars_umani": len(umano),
                "class": classifica(corpo, umano),
                "has_secret": bool(RE_SEGRETI.search(corpo)),
                "text": corpo,       # originale, allegati compresi
                "text_umano": umano,  # solo la prosa: e' questo che si legge e si cita
            })
    return righe, scartati, chat


def tabella(titolo, intestazioni, dati):
    out = [f"### {titolo}", "", "| " + " | ".join(intestazioni) + " |",
           "|" + "|".join(["---"] * len(intestazioni)) + "|"]
    for riga in dati:
        out.append("| " + " | ".join(str(c) for c in riga) + " |")
    out.append("")
    return out


def main():
    try:  # console Windows in cp1252: senza questo le frecce e gli accenti esplodono
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, OSError):
        pass
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="conta soltanto, non scrive")
    ap.add_argument("--solo", help="etichetta di un solo progetto (es. CB-v2)")
    args = ap.parse_args()

    if not args.dry_run:
        BASE_OUT.mkdir(parents=True, exist_ok=True)

    classi = ["M-VOCE", "M-REGIA", "M-PASTE", "M-OK"]
    totali, per_mese, riepilogo = {}, {}, []
    tot_righe = tot_chat = tot_scartati = tot_segreti = 0

    for cartella, etichetta in PROGETTI.items():
        if args.solo and etichetta != args.solo:
            continue
        percorso = BASE_TRANSCRIPTS / cartella
        if not percorso.is_dir():
            print(f"- {etichetta}: cartella assente, salto")
            continue

        righe, scartati, chat = estrai_progetto(percorso, etichetta)
        if not righe:
            print(f"- {etichetta}: 0 messaggi ({chat} chat)")
            continue

        conteggi = {c: sum(1 for r in righe if r["class"] == c) for c in classi}
        segreti = sum(1 for r in righe if r["has_secret"])
        con_data_msg = sum(1 for r in righe if r["date_src"] == "msg")
        totali[etichetta] = conteggi
        tot_righe += len(righe)
        tot_chat += chat
        tot_scartati += scartati
        tot_segreti += segreti

        for r in righe:
            per_mese.setdefault(r["date"][:7], {c: 0 for c in classi})[r["class"]] += 1

        riepilogo.append([etichetta, chat, len(righe),
                          conteggi["M-VOCE"], conteggi["M-REGIA"],
                          conteggi["M-PASTE"], conteggi["M-OK"],
                          segreti, f"{con_data_msg * 100 // len(righe)}%",
                          f"{min(r['date'] for r in righe)} → {max(r['date'] for r in righe)}"])

        print(f"- {etichetta}: {len(righe)} messaggi su {chat} chat "
              f"(voce {conteggi['M-VOCE']} | regia {conteggi['M-REGIA']} | "
              f"paste {conteggi['M-PASTE']} | ok {conteggi['M-OK']}) — scartati {scartati}")

        if not args.dry_run:
            dest = BASE_OUT / f"prompts_{etichetta}.jsonl"
            with dest.open("w", encoding="utf-8") as fh:
                for r in righe:
                    fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(f"\nTOTALE: {tot_righe} messaggi di Matteo su {tot_chat} chat "
          f"({tot_scartati} scartati, {tot_segreti} con pattern sensibili)")

    if args.dry_run:
        return

    md = [
        "# P0-EX — Corpus delle parole di Matteo (statistiche)", "",
        f"> Generato da `tools/estrai_prompt.py` il {datetime.now().strftime('%d-%m-%Y %H:%M')}.",
        "> Il corpus vive accanto a questo file, **fuori da git**. Qui ci sono solo i numeri.",
        "> Regole di classificazione: `PIANO_INDAGINE.md` §3.3. `M-VOCE` e `M-REGIA` non si sommano mai.",
        "",
        f"**Totale: {tot_righe} messaggi di Matteo su {tot_chat} chat.** "
        f"Scartati {tot_scartati} messaggi iniettati dal sistema (non sono parole sue). "
        f"{tot_segreti} messaggi contengono pattern sensibili: **non citabili** nei report.", "",
    ]
    md += tabella("Per progetto",
                  ["Progetto", "Chat", "Messaggi", "M-VOCE", "M-REGIA", "M-PASTE", "M-OK",
                   "Sensibili", "Data dal msg", "Periodo"],
                  sorted(riepilogo, key=lambda r: -r[2]))
    md += tabella("Per mese (tutti i progetti)",
                  ["Mese", "M-VOCE", "M-REGIA", "M-PASTE", "M-OK", "Totale"],
                  [[m, v["M-VOCE"], v["M-REGIA"], v["M-PASTE"], v["M-OK"], sum(v.values())]
                   for m, v in sorted(per_mese.items())])
    md += [
        "### Come si legge", "",
        "- **M-VOCE** = parole sue. È la colonna che vale come pensiero e decisione.",
        "- **M-REGIA** = prompt preparati da un agente e incollati. Valgono come *direzione*, mai come scrittura.",
        "- **M-PASTE** = errori, log, output incollati. Contesto, non decisione.",
        "- **M-OK** = comandi brevi e ratifiche. Misurano il ritmo, non il contenuto.",
        "- **Data dal msg** = quota di messaggi con timestamp reale; sul resto vale la data del file (fine chat).",
        "",
    ]
    (BASE_OUT / "_STATISTICHE.md").write_text("\n".join(md), encoding="utf-8")
    print(f"Scritto: {BASE_OUT}")


if __name__ == "__main__":
    main()
