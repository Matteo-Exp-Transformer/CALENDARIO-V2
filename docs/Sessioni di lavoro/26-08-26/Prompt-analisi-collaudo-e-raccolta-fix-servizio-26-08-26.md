# Prompt — Analisi collaudo Servizio + raccolta fix (senza implementare)

**Salvato:** 26-08-2026 · dopo chiusura docs `5399020` su `env/test`  
**Stato:** **SUPERSEDED** per il proseguimento WP-1 istanza 2 — usa invece  
[`Prompt-wp1-istanza2-diagnosi-O-e-T7bis-26-08-26.md`](Prompt-wp1-istanza2-diagnosi-O-e-T7bis-26-08-26.md)  
(primo compito = sub-agent su T7-bis + tutte le prove `[O]`, poi proposte fix).  
Questo file resta come bozza storica generica.

**Uso (storico):** incolla il blocco sotto in una **nuova chat** (agente freddo).

---

Profilo: Verifica  
Modalità: standard (puoi solo ALZARE a deep se emergono LOCK/DB/auth multi-view da toccare in analisi strutturale; non abbassare)  
Skill da leggere: `docs/Testing-Skill/TESTING_SKILL.md` · `.cursor/skills/calendarbackup-testing/SKILL.md` · `.cursor/skills/calendarbackup-admin/SKILL.md` (area Servizio) · `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` (solo sezioni rilevanti ai sintomi) · `docs/COMUNICAZIONE_UTENTE_SKILL.md` · `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` (solo se Matteo chiede report)  
Non caricare: MetaSkillSystem intero · skill Prenota/QR intere salvo file sospetti del form pubblico emersi dai sintomi  
Output attesi: (1) elenco fix actionable P0/P1/P2 con schermata + effetto staff + ipotesi + file sospetti; (2) mappa note collaudo → priorità; (3) domande Sì/No a Matteo solo se bloccano la priorità — **niente output in più senza chiedere Sì/No prima** (no patch `src/`, no migrazioni, no commit salvo richiesta esplicita)

---

## Mandato

Analizza il collaudo manuale di Matteo sulla pagina **Admin → Servizio** (e i punti collegati Calendario / form pubblico Prenota Classic+Pro) e produci un **backlog di fix prioritizzati**.  
**Non implementare** nulla finché Matteo non scrive «implementa» (o equivalente Liv.1 sul pezzo scelto).

Branch obbligatorio: `env/test`. Ambiente: **solo TEST** (`docnnernvp`).  
**WP-1** resta **IN PILOTA ombra** — **non** dichiararlo chiuso. Cutover (`WP-6`) **vietato**. Zero scritture PROD.

## Contesto minimo (cosa è vero adesso)

- Checklist umana: `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` — conteggio ufficiale **25/26**.
- Aperta solo **T7-bis** 🔴 (`FU-SERV-TURNO-SALA-1`).
- **T9** è `[O]`: Matteo ripete che **non può selezionare un tavolo già occupato** (solo liberi) → la prova delle tre radio non è stata eseguibile come scritto.
- Chiusura docs: `docs/Sessioni di lavoro/26-08-26/Report-chiusura-collaudo-checklist-servizio-26-08-26.md` (commit `5399020`).
- Esiti / episodio dati Pro / catalogo note: `docs/Sessioni di lavoro/26-08-26/Esiti-collaudo-manuale-servizio-parziali-26-08-26.md`.
- Screenshot: `docs/Sessioni di lavoro/26-08-26/Screenshot 2026-08-26 *.png` (111302=T17; 114900=T15 Classic orari; 115258/115307=dati Pro; 120612=altro della seduta).
- Gap-analysis WP-1 i2: `docs/Sessioni di lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md` (§5 = già coperto da test automatici: **non rifare** come collaudo).
- Follow-up aperti noti: `docs/FOLLOW_UP.md` → `FU-SERV-TURNO-SALA-1`, `FU-SERV-BADGE-CASCATA-1`, `FU-SERV-MANOPOLE-CONSOLE-1` (e correlati Servizio già chiusi: non riaprirli).

## Cosa leggere (ordine)

1. `COLLAUDO_MANUALE_OBBLIGATORIO.md` — checklist rapida + note Matteo + sequenze T5/T7-bis/T9 + **T17**.
2. `Esiti-collaudo-manuale-servizio-parziali-26-08-26.md` — episodio Pro + tabella problemi.
3. `Report-chiusura-collaudo-checklist-servizio-26-08-26.md` — cappello/handoff (WP-1 non chiuso).
4. `FOLLOW_UP.md` (solo righe `FU-SERV-*` aperte).
5. Gap-analysis 25-08 §5 «non rifare» — per non confondere debito già blindato con bug nuovi.
6. Solo **dopo** i sintomi: apri i file sospetti in `src/` in sola lettura per ipotesi (path possibili tipici Servizio: assegnazione tavoli, walk-in, fasce/capienza, form pubblico orari, Calendario badge). Non modificare.

## Obiettivo deliverable

Un elenco **actionable** in italiano semplice (stile Matteo: schermata → effetto per lo staff → risultato verificabile), raggruppato:

| Priorità | Criterio |
|---|---|
| **P0** | Blocca servizio in sala / dati assenti / Classic senza orari / perdita assegnazione |
| **P1** | Bug prodotto confermati o fortemente sospetti (T3, T5 warning fuori scope, T9 non eseguibile, T17 libera tavolata, FU-SERV-TURNO-SALA-1) |
| **P2** | UX/copy/idee (V1 spazio grigio, V3 messaggio, T1 ordine orari/prezzo persona, metri vs pixel, mobile Servizio) |

Per **ogni** voce includi obbligatoriamente:

1. **ID** (es. T15, T17, FU-SERV-…)  
2. **Schermata** (es. Servizio → Mappa → Assegna; `/prenota/test-classic`; Calendario giorno)  
3. **Effetto per lo staff** (1 frase)  
4. **Sintomo** (parole Matteo / screen)  
5. **Ipotesi** (max 2–3, etichettate A/B/C — non verdetto se non verificato)  
6. **File sospetti** (path probabili, senza patch)  
7. **Gate di accettazione** (come Matteo verifica dopo un eventuale fix)  
8. **Dipendenze** (es. T7-bis ↔ FU-SERV-TURNO-SALA-1; T13 ↔ FU-SERV-BADGE-CASCATA-1)

Includi esplicitamente almeno:

- Catalogo note da COLLAUDO/Esiti (V1, V3, V5, T1, T3, T4, T5, T7-bis, T9, T10, T11, T13, T15, T16/episodio Pro, **T17**).
- FU-SERV aperti.
- Decisione: T9 è bug UI (non selezionabile occupato) vs istruzione checklist ancora poco chiara.

## Divieti

- **Non** implementare fix, **non** aprire PR di codice, **non** migrare DB.
- **Non** dichiarare WP-1 chiuso; **non** cutover; **non** scrivere PROD.
- **Non** inventare OK/KO su prove non annotate; cita fonte (checklist / esiti / screen).
- **Non** rifare le prove già coperte da §5 COLLAUDO / gap-analysis come se fossero debito nuovo.
- **Non** usare Playwright al posto di Matteo sulle voci «solo umano» per chiudere WP-1.
- Superfici: se proponi fix UI, elenca impatto **desktop + mobile (~375)** + eventuali modali/overlay Servizio (Assegna, Walk-in, Fine turno, Briefing) — senza implementarli.

## Criterio di fatto (fine analisi)

Hai finito quando Matteo può:

1. Leggere la lista P0→P2 e scegliere cosa «implementa» per primo.  
2. Vedere per ogni P0/P1 un gate di verifica chiaro.  
3. Sapere cosa resta aperto in checklist (**T7-bis**) vs cosa è debito prodotto già catalogato.

## Chiusura verso Matteo (obbligatoria in chat)

Titoli utili: **Cosa cambia per te** · **Dove siamo** · **Ti consiglio** · **Pronto per il prossimo passo** · **Tua azione**.  
Prima frase autosufficiente: elemento → intervento → risultato verificabile (niente sigle nude).

Se Matteo chiede «lavoro ok» / report: modalità standard, report in `docs/Sessioni di lavoro/26-08-26/`, capsula + §11, **senza** dichiarare WP-1 chiuso. Allinea skill solo se hai cambiato comportamenti documentati (in questa seduta di sola analisi: tipicamente nessuno).

## Da verificare (non bloccanti)

- Priorità relativa T15 Classic vs T17 vs T3 vs episodio Pro multi-tab.  
- Se T9 richiede redesign (permettere click su tavolo occupato) o solo guida UI diversa.  
- Idea metri vs pixel (T10): solo bozza prodotto, non implementazione.
