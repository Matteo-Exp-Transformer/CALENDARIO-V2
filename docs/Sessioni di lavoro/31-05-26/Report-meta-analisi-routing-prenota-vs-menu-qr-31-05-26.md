# Meta-analisi — fix sfondo scroll: Pagina Prenota vs Menu QR (#8) (31-05-26)

**Ruolo:** prepara-prompt (raccolta dati per sessione Meta)  
**Trigger:** Matteo — «le modifiche sono sbagliate, andavano fatte a Pagina Prenota»; già detto a ≥3 agenti; QA #8 QR segnato OK senza problema reale su Menu QR.

**Non riforma skill** — alimenta `ERRORI_PROCESSO.md`, `OSSERVAZIONI.md`, `PROPOSTE.md`.

---

## Sintesi (1 riga)

Fix tecnico corretto (**layer sfondo fisso**) applicato sulla **schermata sbagliata** (homepage Menu QR); il sintomo segnalato da Matteo riguarda **Pagina Prenota** (`BookingRequestPage`).

---

## Cosa ha cambiato l’esecutore (solo codice, non committato su main al 31-05-26)

**File:** `src/pages/PublicMenuPage.tsx` → `MenuContent`

| Prima | Dopo |
|-------|------|
| PNG tema sul **div che scrolla** (`style={pageBgStyle}` su wrapper `min-h-svh`) | PNG su **div separato** `fixed inset-0 -z-10` |
| `pageBgRef` (ref inutilizzato dopo) | Rimosso |

**Effetto visivo su Menu QR:** minimo se non c’era bug — lo sfondo resta lo stesso PNG ripetuto; cambia solo che il layer non si muove col documento. Matteo: **nessun problema scroll percepito** su QR.

**Cosa NON ha toccato:** `BookingRequestPage.tsx` (Pagina Prenota).

---

## Dove andava il fix (Pagina Prenota)

**Schermata:** **Pagina Prenota** — form pubblico prenotazione (`/prenota/...` o slug tenant), non il link menu QR.

**File:** `src/pages/BookingRequestPage.tsx`

**Storage:** `restaurant_settings.public_booking_page_background` (gradiente, tile legacy `repeat-y`, foto full-page, striscia laterale).

**Stato codice oggi (rilevante):**

| Modalità sfondo | Comportamento attuale |
|-----------------|------------------------|
| Foto full-page | Già **layer `fixed inset-0`** (portrait mobile / landscape desktop) — pattern già “corretto” |
| Tile legacy | `repeat-y` sul **root che scrolla** (`div.min-h-screen` riga ~161) — **stesso anti-pattern** che l’esecutore ha “fixato” su QR |
| Gradiente | `cover` sul root scrollabile |
| Striscia foto sx | layout diverso (striscia sticky) |

**Ipotesi sintomo Matteo:** salto/lampeggio sfondo in fondo pagina (footer Orari+Contatti) con **tile legacy** o scroll lungo form menù — su **Prenota**, non su homepage QR.

---

## Catena processo (perché è successo)

### 1. Checklist 8 note — voce #8 fissata su Menu QR

Nel report prepara-prompt ciclo 30-05-26, nota **#8** è testualmente:

> «Scroll footer **homepage QR**» · smoke `/menu/test-pro/qr/...`

Tutti i prompt (Prompt 2, Prompt B, handoff) hanno ereditato **Menu QR** come target. Se Matteo aveva descritto il problema su **Prenota**, la trascrizione in checklist è il **primo punto di deriva**.

### 2. KO #8 su QR — possibile doppia lettura

- **A)** Bug reale su QR (raro) + fix Prompt B risolve teoricamente ma Matteo non lo nota.
- **B)** Matteo ha testato **Prenota** ma ha spuntato la riga **#8 QR** nel foglio ciclo.
- **C)** Agente/revisore ha “confermato” KO da test automatico (layer position) senza allineare al sintomo umano.

### 3. QA «#8 OK» senza validazione schermata

Matteo ha risposto «esecutore ha finito 8 OK» in chat prepara-prompt **senza** rieseguire smoke esplicito su URL QR in quella chat. Prepara-prompt ha aggiornato docs come OK.

**Gap:** nessun gate «URL/slug nel prompt = URL che Matteo ha testato».

### 4. Ripetizione «Prenota» ignorata

Matteo segnala di aver detto **Pagina Prenota** a ≥3 agenti. Nei doc del ciclo Menu QR compare soprattutto:

- D2 «stile **Prenota**» per **card QR** (riferimento layout, non schermata target)
- `BookingMenuComposeGrid` / soglia 700px (fix viewport, non sfondo footer)

Il vocabolario **«come Prenota»** ≠ **«su Prenota»** — ambiguità non disambiguata dal filtro prepara-prompt.

### 5. Esecutore + Playwright

Report esecutore: test «layer `top=0` dopo 3 cicli scroll» su URL QR — **test tecnico**, non «Matteo vede flash». Conferma implementazione, non conferma sintomo su schermata giusta.

---

## Classificazione cause (schema ERRORI_PROCESSO)

| Causa | Contributo |
|-------|------------|
| **prompt ambiguo** | Checklist #8 ancorata a QR; «Prenota» usata come riferimento layout |
| **errore agente** | Esecutore non ha confrontato con richieste Matteo su Prenota; prepara-prompt non ha chiesto conferma schermata dopo KO/OK |
| **vincolo strutturale** | Due superfici pubbliche simili (sfondo `repeat-y` + footer) — facile confonderle |
| **bug preesistente** | Ipotesi: tile legacy Prenota su root scrollabile (da verificare con Matteo sul layout attivo) |

---

## Cosa fare ora (raccomandazione prepara-prompt)

| Step | Azione | Perché |
|------|--------|--------|
| 1 | **Revert** modifiche non committate su `PublicMenuPage.tsx` + doc QR che citano «layer fisso #8» | QR non aveva sintomo; evita regressione silent e doc falsi |
| 2 | **Riaprire** voce lavoro: «sfondo scroll footer — **Pagina Prenota**» (nuovo ID o nota in FU-014/FU-021 separata) | Target corretto |
| 3 | **Prompt esecutore** su `BookingRequestPage.tsx`: stesso pattern layer fisso per path **tile legacy `repeat-y`**; non toccare full-page (già fixed); verificare striscia/gradiente a parte | Fix mirato |
| 4 | **QA Matteo** con tabella esplicita: slug **prenota** + scroll fino footer Orari/Contatti | Gate schermata |
| 5 | **Sessione Meta** — promuovere regola disambiguazione zone (vedi PROPOSTE) | Evitare 4° giro |

**Revert:** sicuro se le modifiche Prompt B **non sono ancora su prod** (solo working tree / branch locale). Se già deployate: revert commit + redeploy.

---

## Dati per metriche ciclo (prepara-prompt)

| Metrica | Valore |
|---------|--------|
| Prompt Matteo nel ciclo | ≥4 (ciclo 8 note, viewport, Prompt B, OK errato) |
| Correzioni dopo 1ª risposta agente | 1 grave (schermata sbagliata) |
| Follow-up generati | 1 (Prenota sfondo) + revert |
| Modalità alzata | deep su task non necessario (QR) |

---

## Riferimenti

- [Report prepara-prompt ciclo 30-05-26](../30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md) § nota #8
- [Report Prompt B esecutore](./Report-fix-menu-qr-footer-scroll-31-05-26.md) — **stato QA da correggere**
- `src/pages/BookingRequestPage.tsx` (~116–136, 161, 169–181)
- `APP_CONTEXT_SKILL.md` §0 zone: Pagina Prenota vs Menu QR
