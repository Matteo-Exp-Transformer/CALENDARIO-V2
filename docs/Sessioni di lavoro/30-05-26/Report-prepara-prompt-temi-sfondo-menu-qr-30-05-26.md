# Report sessione — Prepara prompt temi sfondo Menu QR

**Data:** 30-05-26  
**Profilo agente:** Meta / prepara-prompt (Ask mode — nessun codice)  
**Modalità:** light  
**Codice app:** nessuna modifica a `src/`  
**Test:** N/A (sessione solo prompt + report)  
**Storage DB:** nessuna modifica  

---

## In 3 righe (milestone M2)

- **Cosa è cambiato:** pronto un prompt copia-incolla per un agente che generi **≥5 coppie PNG** (header + body) per lo sfondo della pagina Menu QR, mobile-first, con mappa zone scoperte e riferimento allo screenshot `Trattoria da Matteo`.
- **Cosa resta:** esecuzione generazione immagini (agente separato); eventuale task codice footer ~1/4 e integrazione asset in `public/menu-themes/` (FU-021).
- **Serve una tua azione:** sì — avviare agente in Agent mode con prompt finale + screenshot allegato; poi scegliere quali temi integrare in app.

---

## Sintesi per Matteo

Hai chiesto aiuto per un **prompt esecutore** (skill prepara-prompt) che guidi la generazione di sfondi per la **pagina Menu QR** — quella che il cliente vede scansionando il QR: nome ristorante, carosello, tab categorie, card bianche.

In chat abbiamo:
1. Mappato **dove lo sfondo si vede davvero** (margini laterali ~16px, gap tra card, zona bassa sopra footer).
2. Allineato i vincoli agli asset attuali (`header` + `body` in `public/menu-themes/`, 1672×941 px, body con ~40% alto sfumato chiaro).
3. Iterato il prompt su tue correzioni: niente terza immagine; un solo header progettato anche per la barra categoria; **leggera sfumatura dall’alto** per il testo; footer previsto più basso (~1/4) per mostrare più tema in basso.
4. Consegnato il **prompt finale snello** (2 PNG per idea, minimo 10 file).

Nessun file dell’app è stato modificato.

---

## Cosa è stato fatto (cronologico)

1. Lettura `docs/PREPARA_PROMPT_SKILL.md` e documentazione layout Menu QR (`PUBLIC_MENU_LAYOUT_CONTEXT.md`, `PublicMenuPage.tsx`, asset in `public/menu-themes/`).
2. **Prompt v1** — obiettivo 5 idee × 2 PNG; mappa zone scoperte; vincoli tecnici header/body; checklist controllo.
3. **Prompt v2** — dopo screenshot mobile: footer ~1/4; header categoria come terzo file separato; mobile 375px esplicito.
4. **Correzione Matteo** — «non 3 immagini»: tornati a **2 PNG per idea**; header unico con nota d’uso barra categoria + sfumatura alta per testo; rimosso scope non richiesto.
5. **Prompt finale** consegnato in chat (blocco copia-incolla).
6. **Report sessione** + note comunicazione (questo file).

---

## Contesto prodotto (dove nell’app)

| Schermata | Cosa vede il ristoratore/cliente | Asset tema |
|-----------|----------------------------------|------------|
| **Home Menu QR** | Cliente apre QR → sfondo decorativo dietro titolo, carosello, tab e card categorie | `headerImage` (fascia alta) + `bodyImage` (scroll) — scelti in admin «Tema homepage» del QR, salvati come `theme_key` su `menu_qr_codes` |
| **Categoria aperta** | Cliente entra in «Antipasti» → barra sticky in alto riusa lo **stesso** PNG header (crop ~56px); lista piatti su sfondo grigio chiaro | Stesso `headerImage` del tema QR |

**Zone scoperte (priorità mobile ~375px):**
- Colonne laterali ~16px per tutta la pagina (sfondo body protagonista).
- Gap ~12px tra card categorie bianche.
- Zona sopra footer (footer previsto più sottile → più body visibile).
- Fascia header sopra/sotto carosello e ai lati del titolo.

---

## Prompt finale (versione consegnata)

Vedi sezione «Prompt esecutore — versione v3 (finale)» sotto. Da incollare in nuova chat Agent mode con screenshot `Trattoria da Matteo` allegato.

---

## File toccati

| Area | File | Nota |
|------|------|------|
| Report | `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-temi-sfondo-menu-qr-30-05-26.md` | Questo report |
| Log | `docs/SESSION_LOG.md` | +1 riga |
| Comunicazione | `docs/Comunicazione-Skill/OSSERVAZIONI.md` | +blocco sessione |
| Codice / asset | — | Nessuno |

---

## Test eseguiti

N/A — nessun `npm run validate` (zero modifiche codice).

Verifica read-only: dimensioni PNG esistenti 1672×941 px; layout da `PublicMenuPage.tsx` e `PUBLIC_MENU_LAYOUT_CONTEXT.md`.

---

## File di skill aggiornati (§7.2)

| File | Modifica | Perché |
|------|----------|--------|
| Nessuno skill di area | — | Sessione prepara-prompt, no codice |
| `docs/SESSION_LOG.md` | +1 riga | §7.1 light con report |
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | +blocco 30-05-26 | Dati comunicazione richiesti |
| `docs/FOLLOW_UP.md` | Nota su FU-021 | Prompt pronto, esecuzione rimandata |

---

## Derivazione errori

| Tipo | Cosa | Come evitare |
|------|------|--------------|
| **prompt ambiguo/incompleto** (agente prepara) | v2 introdusse **3 PNG per idea** non richiesti da Matteo | Restare sulle richieste esplicite; chiedere prima di aggiungere deliverable (es. «vuoi file separato per header categoria?») |
| **errore agente** (prepara) | v1 troppo verboso (checklist, follow-up codice, categoryHeaderImage) | Matteo ha chiesto riformulazione «non aggiungere cose che non ti ho chiesto» — prompt v3 snellito |

Nessun bug preesistente né vincolo strutturale bloccante in sessione.

---

## Follow-up

| ID | Azione |
|----|--------|
| **FU-021** (aperto) | Prompt generazione asset pronto; prossimo passo = agente genera PNG + Matteo sceglie temi; poi integrazione `menuThemes.ts` / `public/menu-themes/` |
| *(nuovo, implicito)* | Ridurre altezza visiva `MenuFooterCard` a ~1/4 — **non in scope** questa chat; citato nel prompt per composizione sfondo |
| *(nuovo, implicito)* | Avviare generazione con prompt v3 + screenshot in Agent mode |

---

## Prompt esecutore — versione v3 (finale)

```
Modalità: light

## Obiettivo

Generare **almeno 5 idee visive diverse** per lo sfondo della pagina pubblica **Menu QR** (menu à la carte ristorante), **mobile-first** (~375px).

Per ogni idea: **2 PNG**:
- `{slug}-header.png` — fascia alta homepage; la stessa immagine verrà usata anche come barra header (~56px) nella pagina categoria aperta
- `{slug}-body.png` — sfondo del corpo pagina (tab, card categorie, area scroll)

**Minimo 10 file** (5 idee × 2 immagini).

**Riferimento layout:** usa lo screenshot mobile allegato (Trattoria da Matteo) come guida compositiva — margini laterali, card bianche, carosello, tab pill, footer compatto in basso.

Non modificare codice: solo immagini + breve tabella riepilogo.

## Vincoli immagini

**Formato:** 1672 × 941 px (~16:9), PNG.

**Header (`{slug}-header.png`):**
- Progettalo sapendo che funge da fascia hero in homepage e da barra stretta in pagina categoria (crop dalla cima).
- **Leggera sfumatura dall’alto dell’immagine** per favorire la lettura del testo sovrapposto (titolo ristorante / titolo categoria).
- Parte alta riconoscibile e bilanciata anche se visibile solo in ~56px.

**Body (`{slug}-body.png`):**
- Primi ~40% altezza: sfumatura verso bianco/tono chiaro (transizione con header).
- Resto: texture/motivo/decoro per le zone dove lo sfondo resta visibile.
- L’app usa `background-size: 100% auto` — niente composizioni che richiedono cover sull’intero body.

## Zone scoperte (mobile 375px)

Decora soprattutto dove lo sfondo si vede davvero:
- **Margini laterali ~16px** (sinistra e destra) per tutta la scroll — zona principale
- **Gap ~12px** tra le card categorie bianche
- **Zona bassa** sopra il footer: la card data/ora sarà **~1/4 dell’altezza attuale** — molto più sfondo visibile in basso
- **Area tab categorie** all’inizio scroll (semi-trasparente, body visibile dietro)

Evita decoro busy al centro dove ci sono card bianche e carosello.

## Libertà creativa

Tema ristorante / menu à la carte. Stili liberi (elegante, rustico, watercolor come ref., illustrato, anche concept playful) purché coerenti. **Almeno 5 idee distinte** tra loro.

## Output per idea

- Nome + slug kebab-case
- `{slug}-header.png` + `{slug}-body.png`
- accentColor e headerTextColor suggeriti (hex)
- 1 riga: mood/palette

Cartella: `generated-menu-themes/idea-XX-{slug}/`

## Criterio di fatto

≥5 coppie header+body, tabella riepilogo, coerenza mobile 375px con layout dello screenshot ref.
```

---

## Dati comunicazione

### Frasi / richieste ricorrenti (con conteggio)

| Frase / tema | × | Esito |
|--------------|---|--------|
| «prepara prompt» / `@PREPARA_PROMPT_SKILL.md` | 1 | Prompt v1 completo |
| «spiegami in parole semplici» + componente + storage (user rule) | implicita | Spiegazione schermata Menu QR + zone scoperte + `menu_qr_codes.theme_key` / `public/menu-themes/` |
| Screenshot allegato + allinea mobile | 1 | Prompt v2 |
| «non 3 immagini» / «non aggiungere cose non richieste» | 1 | Prompt v3 snellito — **correzione efficace** |
| «fai report sessione e note comunicazione» | 1 | Questo report |

### Cronologia / prompt di Matteo (annotati)

1. **Intento:** prompt per agente che generi immagini sfondo Menu QR, mobile-first; mappa zone scoperte; ≥5 idee × 2 immagini; tema ristorante; header mini abbinato per categorie (interpretato in v1 come stesso file crop).
2. **Allegato screenshot** + footer ridotto 1/4 + header categoria può differire da home → agente estese a 3 file (errore scope).
3. **Correzione:** solo 2 PNG; header unico con sfumatura alta per testo; niente extra → v3 accettata implicitamente (nessuna ulteriore correzione).
4. **Chiusura:** report + note comunicazione.

### Spiegazioni che hanno funzionato

- **Tabella zone scoperte** (margine 16px, gap card, footer basso) + riferimento allo screenshot reale.
- **Doppio livello:** «cosa vede il cliente» + nome tecnico asset (`header`/`body`) solo dove serve per l’agente esecutore.
- **Correzione scope:** riformulazione breve del prompt intero invece di difendere v2.

### Voci Liv.2 applicate

Nessuna voce vocabolario esplicita in questa chat.

### Pattern nuovi (candidati)

| Pattern | Proposta |
|---------|----------|
| «non aggiungere cose che non ti ho chiesto» dopo prepara-prompt | Già coperto da PREPARA_PROMPT scope + ERRORI_PROCESSO; rinforzo: chiedere Sì/No prima di aggiungere deliverable (es. N file per tema) |
| Task **solo asset/prompt generazione** senza codice | Modalità light OK; report breve + prompt verbatim in report |

### Automatizzabile vs manuale

| Automatizzabile | Manuale |
|-----------------|--------|
| Mappa zone scoperte da `PUBLIC_MENU_LAYOUT_CONTEXT.md` | Scelta estetica dei 5 temi (Matteo) |
| Template prompt con dimensioni 1672×941 da repo | Generazione immagini (agente creativo) |
| Checklist post-generazione 375px | Integrazione tema scelto in app (task codice) |

### Token risparmiabili

- v1 troppo lungo: checklist, revisione accurata, follow-up codice non richiesti — **v3 ~40% più corto** rispetto a v1.
- Per task «solo prompt»: consegnare subito prompt snello + 1 paragrafo contesto, espandere solo se Matteo chiede.

### Cosa non è successo in chat

| Tipo | Dettaglio |
|------|-----------|
| Generazione immagini | Non eseguita (Ask mode / solo preparazione) |
| Modifica codice footer 1/4 | Solo citato nel prompt per composizione |
| Commit | Non richiesto |
| Conferma «ok funziona» su output | Matteo non ha ancora lanciato agente generazione |
| Aggiornamento `menuThemes.ts` | Fuori scope |
| `npm run validate` | N/A |
| Domanda esplicita A/B (tool generazione) | Proposta in v1, Matteo non ha risposto — **non ripetuta in v3** |

---

## Stato finale

**Ciclo task:** prompt pronto — puoi aprire nuova chat Agent mode con prompt v3 + screenshot.  
**Resta fuori:** generazione PNG, scelta temi, commit, riduzione footer in codice, aggiornamento FU-021 a «fatto» solo dopo integrazione asset.
