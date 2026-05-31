# Analisi e raccolta dati — Skill system e lavoro con agenti

**Data:** 2026-05-28  
**Autore analisi:** sessione Cursor (Matteo)  
**Fonti:** solo documentazione versionata in repo (`docs/`, report in `docs/Sessioni di lavoro/`, `docs/_lavoro/` dove indicato) + pattern da conversazioni non sempre archiviate in report.  
**Limite:** dove un fatto non è in un file citato, è marcato come *non documentato in repo*.

Documento correlato (preferenze di spiegazione): [`Metodo_spiegazioni_agenti_coding.md`](Metodo_spiegazioni_agenti_coding.md).

---

## 1. Contesto del sistema documentale

CalendarBackup-v2 si appoggia a un **skill system** sotto `docs/`: file markdown che orientano gli agenti su aree (admin, DB, UI, marketing, legal, ecc.). Il file radice per il routing è `docs/APP_CONTEXT_SKILL.md` (Skill 0: tabella aree, invarianti LOCK, RULE §4, convenzione report §7).

| Elemento | Ruolo osservato |
|--------|------------------|
| `APP_CONTEXT_SKILL.md` | Mappa aree → skill; regole globali; cresce soprattutto in §4 RULE per feature nuove (es. Pagina Prenota v2) |
| `SESSION_LOG.md` | Indice cronologico one-liner verso report completi |
| `docs/Sessioni di lavoro/GG-MM-AA/Report-*.md` | Memoria operativa delle sessioni |
| `COMUNICAZIONE_UTENTE_SKILL.md` | Stile risposta: breve default; dettaglio se Matteo chiede; tabella tecnico → utente |
| Skill di area | `ADMIN_CLASSIC`, `DB_SKILL`, `PUBLIC_MENU_*`, `Marketing-Skill/`, ecc. |
| `docs/_lavoro/` | Piani e bozze locali (es. PWA, metodo spiegazioni); non sempre allineati alle skill ufficiali |

**Revisione skill già avvenuta (24-05-26):** creazione `DATA_FLOW_SKILL.md`, cartella `Marketing-Skill/`, spostamento cronologia in `SESSION_LOG.md`, alleggerimento regola LOCK (“verifica strutturale” al posto dei “5 punti”), RULE linguaggio utente (`Report-skill-system-revisione.md`).

---

## 2. Cosa i report registrano oggi (§7 APP_CONTEXT)

Obbligo formale a fine sessione (se Matteo conferma successo): report con cosa fatto, file toccati in linguaggio utente, domande/risposte, test (`npm run validate`), skill aggiornate, resto per sessione successiva, deviazioni plan.

**Presente spesso nei report recenti (25–28/05):**
- Cronologia implementazione e file toccati
- `npm run validate` / typecheck / lint
- Tabella Q&A in alcune sessioni (es. sfondo Prenota 28-05)
- “Cosa resta” e test manuale **consigliato** (spesso non eseguito in CI)
- Deviazioni plan ed estensioni mid-sessione da Matteo

**Presente in modo irregolare o assente:**
- Preferenze UI espresse a voce consolidate in tabella dedicata
- Spiegazioni “semplici” richieste da Matteo dopo proposte tecniche (cache, build, deploy)
- Distinzione esplicita “cosa fa Matteo / cosa fa tool / cosa fa agente una tantum”
- Frasi ricorrenti di Matteo mappate a comportamento agente desiderato
- Check prod (SQL editor, branch Vercel, hard refresh PWA) con esito “fatto / da fare”
- Backlog “candidati aggiornamento skill” strutturato

---

## 3. Ruoli osservati: Matteo vs agenti

Ricostruzione da report maggio 2026 (nessun conteggio messaggi chat).

### Matteo — azioni ricorrenti documentate

| Area | Esempi nei report |
|------|-------------------|
| Prodotto e scope | Q1–Q11 promo; modello ibrido `tenant_features`; conferma due mondi Menu / Personalizza form; XOR card/carosello |
| UX visiva | Crema `#faf7f1`, set 3+3 foto, striscia mobile 20vw, Phosphor, UI leggera, header full-width |
| Flusso business | Prezzo card vs override Mario; eccezioni riepilogo solo card/carosello |
| Validazione reale | «ottimo funziona»; form mobile ok; striscia stretta ma voluta (27-05) |
| Operazioni | Deploy edge; segnalazione incident prod; query SQL prod dopo warning Supabase |
| Contenuti | Consegna asset WebP; re-upload immagini in prod dopo migrazione TEST→PROD |
| Organizzazione | Report in `Sessioni di lavoro/` non `_lavoro/`; scope refactor ridotto su richiesta |

### Agenti — azioni ricorrenti documentate

| Area | Esempi nei report |
|------|-------------------|
| Codice | Prenota v2, modale QR, resolver, XOR, layout calendario, promo generiche |
| DB | Migrazioni su TEST via MCP; allineamento schema; hardening RLS |
| Qualità | `npm run validate`; sub-agent dead code; revisione strutturale parallela |
| Documentazione | Report sessione; aggiornamento skill area se architettura cambia |
| Diagnosi | Incident 026 vs `main`; serializer `setting_value` NOT NULL |

**Schema ricorrente:** Matteo imposta obiettivo o preferenza → agente implementa e documenta → Matteo prova o chiede chiarimento → aggiustamenti. Plan “completo” senza chiarimenti iniziali (25-05 Prenota v2) → lunga autonomia agente; estensioni UX spesso in corso sessione (28-05: cinque estensioni sfondo oltre al fix iniziale).

---

## 4. Tipi di informazione utili (tassonomia descrittiva)

Categorie che **emergono** dalle sessioni come dati che Matteo usa o ripete; non tutte sono archiviate in modo uniforme.

| Tipo | Contenuto tipico | Dove compare oggi | Frequenza gap |
|------|------------------|-------------------|---------------|
| **Decisione prodotto** | Scope, A/B, “voluto non bug” | Analisi onboarding; tabelle Q&A sparse | Media |
| **Q&A operativa** | «Devo fare X ogni volta?», commit/prod | Report puntuali; spesso solo in chat | Alta in chat, bassa in repo |
| **Spiegazione semplice** | Metafora + tu/tool/agente | `Metodo_spiegazioni_*` (locale); raro in report | Alta |
| **Preferenza UI** | Leggerezza, colori, layout, icone | Frasi in report; RULE §4 dopo consolidamento | Media |
| **Preferenza processo/codice** | Scope minimo, una libreria icone, TEST only | APP_CONTEXT, user rules; parziale in report | Media |
| **Check abituali** | validate agente vs browser/SQL Matteo | “Test manuale consigliato”; “Matteo deve provare” | Alta |
| **Deviazione plan** | Aggiunte mid-session | Sezione deviazioni quando presente | Media |
| **Decisione plan** | Cosa escluso e perché | Refactor grouping “scope ridotto” | Bassa |
| **Incident / lezione** | DB deploy senza client su main | `Report-incident-prod` | Puntuale, alto valore |

---

## 5. Domande e decisioni — campione documentato (maggio 2026)

### 5.1 Domande con risposta in report (esempi)

| Domanda (sintesi) | Risposta documentata | Fonte |
|-------------------|----------------------|-------|
| Sfondo striscia: bianco o crema? | Crema `#faf7f1` | Report-sessione-completa 28-05 |
| Quante foto striscia / full-page? | 3 + 3 | Idem |
| Striscia su mobile/tablet? | Sì, 20vw | Idem |
| Modello tenant_features? | Ibrido edition + override | Report-tenant-features 24-05 |
| UI backoffice flag? | No, solo SQL/MCP per ora | Report-skill-system-revisione 24-05 |
| Promo legacy preservare? | No; DELETE `booking_vol_au_vent_*` | Report-refactor-promo 23-05 |

### 5.2 Decisioni prodotto consolidate in skill o analisi

| Decisione | Effetto per Mario (ristoratore) | Dove documentato |
|-----------|--------------------------------|------------------|
| Tab Menu = magazzino; Personalizza form = vetrina `sub_tabs[]` | Testi/prezzi su Prenota indipendenti dal nome preset in Menu | Analisi-flusso onboarding 26-05; APP_CONTEXT §4 |
| XOR card **o** carosello per tipologia | Non si mescolano presentazioni sulla stessa modalità | Report XOR 26-05; APP_CONTEXT §4 |
| Carosello Prenota senza griglia menù in pubblico | Solo foto/testi overlay | Report carosello 26-05 |
| Niente omaggio automatico promo | Solo banner testuali configurati | Refactor promo 23-05 |
| Salva per sezione; niente «Conferma selezione sfondo» | Sfondo si salva con Salva sezione | Report salvataggio 26-05 |
| PWA admin: aggiornamento all’apertura, no reload in sessione | Mario non interrotto mentre compila | `PWA_UPDATE_STRATEGY_PLAN.md`; report caroselli PWA 28-05 |
| Migrazione DB + client devono essere su `main` insieme | Evita impostazioni bloccate in prod | Report-incident-prod 23-05 |

### 5.3 Temi ancora aperti nei report

- Gap layout pulsante Invio vs footer (`Report-prenota-layout-gap-sessione-28-05-26-B.md`)
- Foto full-page portrait WebP + `<picture>` (report sessione completa 28-05, “prossima sessione”)
- Prezzi commerciali reali (`EDITION_PRICING_CONTEXT.md` placeholder)
- QA merge branch promo prima di `main` (report promo-db-allineamento 23-05, stato al momento del report)

---

## 6. Comunicazione: due layer documentali

### 6.1 `COMUNICAZIONE_UTENTE_SKILL.md` (repo)

- Default: 2–3 frasi, effetto sul ristoratore, no gergo non richiesto.
- Dettaglio solo se Matteo chiede.
- Tabella esempi tecnico → utente (invalidateQueries, buildFeatures, ecc.).
- Errori: cosa non funzionava per l’utente, non stack trace salvo richiesta.

### 6.2 `Metodo_spiegazioni_agenti_coding.md` (`_lavoro`)

Più esteso del file repo. Include:

- Ruoli Matteo vs agente (allineato ai report).
- Schema fix: Problema → Componente → Flusso dati prima/dopo → Flusso utente → Perché corretto.
- Blocco “semplice”: immagine pratica; separazione modifica agente / regola operativa Matteo / automatico tool / config una-tantum / scelta UX.
- Dubbi da segnalare (prod vs test, Menu QR vs Prenota, bozza vs salvato, ecc.).
- Pattern: meccanismo tecnico → richiesta semplice → metafora + chi fa cosa.

**Gap osservato:** il Metodo locale è più ricco sulle spiegazioni didattiche e sui dubbi da fermare; `COMUNICAZIONE_UTENTE_SKILL.md` è più corto e non include lo schema “tu / tool / agente” né l’esempio cache/build.

### 6.3 Pattern conversazione (anche da chat non sempre in report)

Sequenza osservata ripetutamente:

1. Agente propone meccanismo tecnico (header cache, SW, RLS, serializer, migrazione).
2. Matteo chiede versione semplice, esempio pratico, «devo farlo io ogni volta?».
3. Risposta efficace documentata in chat (es. file usa-e-getta vs indice; Vite rinomina in build; `vercel.json` una tantum) — *non* riversata nei report PWA versionati, solo decisione prodotto in `PWA_UPDATE_STRATEGY_PLAN.md`.

---

## 7. Frasi e richieste ricorrenti di Matteo (da report + Metodo)

| Intenzione (sintesi) | Esempi documentati |
|----------------------|-------------------|
| Spiegazione accessibile | «Spiegamelo semplice», esempio cache/Vite (*chat*) |
| Chiarire abitudini operative | «È una rule che devo ricordare?» (*chat*) |
| Direzione UX | UI leggera; niente anteprima separata; Phosphor; font/colore header |
| Direzione scope | Solo fix critici; non nascondere striscia; scope refactor ridotto |
| Conferma funzionale | «Ottimo funziona»; form mobile già allineato |
| Conferma visiva | Striscia mobile va bene; crema non bianco |
| Flusso business | Prezzo preset nel campo ma override Mario nel riepilogo |
| Sicurezza / prod | Audit spietato; massima cautela su query prod |
| Organizzazione doc | Report in `Sessioni di lavoro/` |

---

## 8. Check abituali — chi fa cosa (da report)

| Check | Chi nei report | Note |
|-------|----------------|------|
| `npm run validate` / typecheck / lint | Agente | Quasi sempre citato con esito |
| Test Vitest | Agente | 137/137 citato spesso |
| Test manuale browser (breakpoint, URL) | Matteo | “Consigliato”, “da svolgere”, “confermato” |
| Migrazione applicata TEST | Agente MCP | Con project ref test |
| Query / migrazione PROD | Matteo | “Deve provare da SQL editor”; commit dopo conferma |
| Deploy Vercel / branch `main` | Misto | Incident 026: lag main vs migrazione prod |
| Hard refresh / PWA dopo deploy | Matteo | Suggerito post-incident |
| Consegna asset (foto, WebP) | Matteo | Dopo perdita asset o migrazione storage |
| Re-upload immagini prod | Matteo | Dopo sync dati TEST→PROD senza storage |

---

## 9. Informazione che tende a restare fuori dallo skill system

- **Preferenze UX** dette in chat prima di finire in RULE §4 (ritardo tra sessione e consolidamento).
- **Spiegazioni didattiche** utili per sessioni future (cache, build, deploy) — in chat o in `_lavoro/Metodo`, non in skill ufficiali.
- **Conferme visive** (“mi piace così”) che bloccano fix proposti da sub-agent (striscia 20vw mobile, 27-05).
- **Scope esplicitamente non fatto** (card `defaultExpanded`, client pubblico su MenuSelection) — a volte solo in “Cosa NON è stato fatto”.
- **Piani in `_lavoro`** (PWA) vs RULE deploy/cache ancora incomplete in APP_CONTEXT.

---

## 10. Cronologia tematica sessioni (indice `SESSION_LOG.md`, maggio 2026)

| Periodo | Temi principali |
|---------|-----------------|
| 15–22/05 | Fasce orarie; check disponibilità fascia; pallino tavolo calendario |
| 23/05 | Calendario responsive; promo generiche; audit sicurezza; incident prod; pulizia docs/dead code |
| 24/05 | Menu QR fase 1; `tenant_features`; revisione skill system + Marketing-Skill |
| 25/05 | Prenota v2, sottotab, menù compose, modale QR, foto categorie |
| 26/05 | Personalizza form, carosello, XOR, `field_overrides`, validazione |
| 27/05 | Footer/striscia, editor preset, query prod, revisione strutturale |
| 28/05 | Sfondo striscia/full-page, asset, caselle form, PWA/caroselli separati, allineamento DB |

---

## 11. Riferimenti file per approfondimento

| File | Contenuto rilevante per questa analisi |
|------|----------------------------------------|
| `docs/APP_CONTEXT_SKILL.md` | §0 routing, §4 RULE, §7 report |
| `docs/COMUNICAZIONE_UTENTE_SKILL.md` | Stile risposta breve |
| `docs/SESSION_LOG.md` | Cronologia |
| `docs/_lavoro/Metodo_spiegazioni_agenti_coding.md` | Preferenze spiegazione Matteo |
| `docs/_lavoro/PWA_UPDATE_STRATEGY_PLAN.md` | Decisione PWA (senza dettaglio cache HTTP in repo) |
| `docs/Sessioni di lavoro/24-05-26/Report-skill-system-revisione.md` | Ultima revisione strutturale skill |
| `docs/Sessioni di lavoro/26-05-26/Analisi-flusso-admin-onboarding-prenota-26-05-26.md` | Decisioni prodotto + lacune L1–L9 |
| `docs/Sessioni di lavoro/28-05-26/Report-sessione-completa-28-05-26.md` | Tabella Q&A sfondo Prenota |

---

## 12. Nota su tentativi precedenti in questa conversazione

In una sessione Cursor (28-05-28) erano stati creati poi **rimossi** da Matteo: `docs/META_SKILL_RACCOLTA_DATI.md`, `ANALISI-domande-decisioni-e-ruoli-matteo-agenti.md` in `Sessioni di lavoro/`, e collegamenti extra in `APP_CONTEXT` / `COMUNICAZIONE` / skill Cursor. Motivo: preferenza per **un solo file di analisi in `_lavoro`**, senza istruzioni operative agli agenti né modifiche allo skill system ufficiale. Il presente documento sostituisce quel materiale.

---

*Documento descrittivo — nessuna istruzione operativa inclusa.*
