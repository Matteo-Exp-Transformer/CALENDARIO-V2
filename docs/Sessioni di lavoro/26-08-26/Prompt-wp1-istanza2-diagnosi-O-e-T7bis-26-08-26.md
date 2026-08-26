# Prompt — WP-1 istanza 2 (proseguimento): perché T7-bis / [O] non testabili → proposte fix

> **Uso:** incolla il blocco sotto in una **nuova chat** su branch `env/test`.  
> **Sostituisce** (per questo giro) il mandato generico  
> `Prompt-analisi-collaudo-e-raccolta-fix-servizio-26-08-26.md` — qui il **primo compito** è  
> obbligatorio e MSS-scoped.  
> **Istanza:** **2 di N** di `WP-1` (ombra) — **non** chiudere WP-1.  
> **Istanza 1 (chiusa):** blindatura automatica Servizio —  
> `docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza1-servizio-blindatura-25-08-26.md`.  
> **Istanza 2 finora:** checklist umana scritta + collaudo Matteo **25/26** —  
> `Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md` +  
> `Report-chiusura-collaudo-checklist-servizio-26-08-26.md` (commit chiusura docs `5399020`).

---

```
Profilo: Verifica (+ proposta fix; implementazione solo dopo «implementa» di Matteo)
Modalità: deep
Protocollo pilota: MSS-PILOT-001 · capsula mss.session/0.1.1 / freeze-2
Skill da leggere (in ordine):
  - docs/COMUNICAZIONE_UTENTE_SKILL.md (§ Regola zero · Domande per te)
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md (solo § pilota / capsula — non corpus storico)
  - docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (chiusura istanza)
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
  - .cursor/skills/calendarbackup-admin/SKILL.md → docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md
  - .cursor/skills/calendarbackup-testing/SKILL.md → docs/Testing-Skill/TESTING_SKILL.md §8
  - docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md (fonte ufficiale spunte + note)
  - docs/Sessioni di lavoro/26-08-26/Esiti-collaudo-manuale-servizio-parziali-26-08-26.md
  - docs/Sessioni di lavoro/26-08-26/Report-chiusura-collaudo-checklist-servizio-26-08-26.md
  - docs/Sessioni di lavoro/25-08-26/Report-wp1-istanza2-checklist-qa-servizio-25-08-26.md
  - docs/Sessioni di lavoro/25-08-26/Gap-analysis-Servizio-QA-manuale-25-08-26.md (§5 = non rifare automatici)
  - docs/FOLLOW_UP.md (solo FU-SERV-* aperti)
Non caricare: cutover WP-6 · Senior-Eval intero · skill Prenota/QR intere (salvo file sospetti da sintomi T1/T15)
Output attesi:
  (1) report diagnosi «non testabile» per T7-bis + ogni prova [O]
  (2) elenco fix P0/P1/P2 con gate di verifica per Matteo
  (3) handoff «riprova queste prove» (checklist ridotta)
  — niente patch src/ finché Matteo non scrive «implementa» (o equivalente Liv.1 sul pezzo)
  — niente output in più senza chiedere Sì/No prima
```

---

## Contesto MSS (ombra — proseguimento istanza 2)

| Fatto | Valore |
|---|---|
| Branch | `env/test` |
| Ambiente DB | solo TEST `docnnernvp` — **mai PROD** |
| WP-1 | **IN PILOTA ombra** — **non** dichiarare chiuso |
| Cutover WP-6 | **vietato** |
| Vecchio skill system | resta confronto operativo |
| Istanza 1 | test automatici Servizio verdi (257 Vitest + E2E 6+13 + createUpdate) |
| Istanza 2 deliverable docs | checklist `COLLAUDO_MANUALE_OBBLIGATORIO.md` (setup QA-Manuale, V1–V8, T1–T16, T7-bis) |
| Collaudo umano | **25/26** fatte (`[x]` o `[O]`); aperta solo **T7-bis** |
| Persona | nessuna promozione inventata; `non_osservato` valido |
| Chiusura seduta | report in `docs/Sessioni di lavoro/26-08-26/` + capsula `mss:capsule` + `validate:mss --require-capsule` · **non** «WP-1 finito» |

Gate iniziale:

```bash
npm run mss:status
```

Atteso: WP-1 IN PILOTA ombra; cutover no.

---

## Cosa è vero adesso (non inventare)

- Checklist ufficiale: `docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` — tabella Conteggio **25/26**.
- **Aperta:** solo **T7-bis** 🔴 (`FU-SERV-TURNO-SALA-1`) — Matteo: *non vede i turni sui tavoli*; *nel modal modifica tavolo non c’è Elimina*.
- Prove **`[O]`** (fatte con nota / non eseguibili come scritto) — elenco obbligatorio da diagnosticare:

| ID | Sintomo Matteo (checklist / esiti) | Screen |
|---|---|---|
| **V3** | Messaggio overlap fasce sbagliato («pranzo» vs «AG-B2»); copy «Coperti massimi…» incompleto | — |
| **V5** | Limite walk-in impostato ma posso comunque inserire oltre | — |
| **T9** 🔴 | **Impossibile selezionare tavolo già occupato** — solo liberi → tre radio non provabili | — |
| **T10** | A 375 scorre tutta la pagina in verticale; idea metri vs pixel (FU prodotto, non blocco diagnosi) | — |
| **T15** 🔴 | Classic: form senza orari pur con aperture/fasce | `Screenshot 2026-08-26 114900.png` |
| **T16** | Episodio: dati Pro (prenotazioni poi sale/tavoli) spariti con 2 tab Classic+Pro, poi tornati — causa non accertata | `115258.png` / `115307.png` |

- Note su prove `[x]` che restano bug/debito (catalogare ma **secondo** rispetto a T7-bis+[O]): V1 spazio grigio mappa · T1 orari non ordinati / prezzo a persona · T3 walk-in non già assegnato in mappa · T4 «Aggiungi tavolo» resta · T5 warning fascia fuori Servizio anche con checkbox spenta · T11 mobile · T13 badge mese · **T17** libera tutta la tavolata (screen `111302.png`).
- FU aperti: `FU-SERV-TURNO-SALA-1`, `FU-SERV-BADGE-CASCATA-1`, `FU-SERV-MANOPOLE-CONSOLE-1`.
- §5 COLLAUDO / gap-analysis: **non** confondere «già coperto da E2E» con «Matteo non ha potuto eseguire la prova umana».

---

## Ordine di lavoro (obbligatorio)

### Fase A — Sub-agent in parallelo (sola lettura): «perché non testabile?»

Lancia **almeno 2** sub-agent `explore` (o equivalenti) in **sola lettura**, mandati disgiunti:

1. **Sub-agent T7-bis + turni + elimina tavolo**  
   - Domanda: perché Matteo non vede «turni» e non trova Elimina nel modal tavolo?  
   - Dove dovrebbe comparire il conto turni in UI (Lista / Mappa / modale)? Esiste? Nascosto? Solo dopo max_turns?  
   - Path delete tavolo: Lista vs Modifica vs modal — etichette reali.  
   - Collegamento a `FU-SERV-TURNO-SALA-1` (comportamento atteso *oggi* vs dopo fix P6).  
   - Output: diagnosi + file:riga citati.

2. **Sub-agent prove [O] (V3, V5, T9, T10, T15, T16)**  
   - Per **ciascuna**: classificare in una sola etichetta:  
     - `BUG_UI` — l’azione richiesta dalla checklist esiste ma l’UI la impedisce (es. T9)  
     - `CHECKLIST_SBAGliATA` — la prova chiede qualcosa che il prodotto non offre / wording errato  
     - `ATTESO_PRODOTTO` — comportamento voluto (es. V5 limite morbido?) da confermare a Matteo  
     - `AMBIENTE` — config/tenant/rate-limit/multi-tab (es. T15, T16)  
     - `NON_VERIFICATO` — serve prova browser o dati TEST  
   - T9: confrontare checklist vs codice assegnazione (tavolo occupato selezionabile sì/no; dove si apre la modale tre radio).  
   - T15: business hours + fasce Classic vs form pubblico (screen 114900).  
   - T16: ipotesi A–F già in Esiti — non inventare causa; dire cosa misurare al prossimo ripetersi.  
   - Output: tabella ID → etichetta → prova (file:riga o «NON_VERIFICATO — perché»).

**Tu (parent):** controverifica di persona **almeno 3** voci gravi (obbligo: T7-bis, T9, T15) aprendo il codice — non pubblicare output grezzo dei sub-agent.

### Fase B — Proposte fix (senza implementare)

Da Fase A, produci backlog:

| Priorità | Criterio |
|---|---|
| **P0** | Blocca collaudo 🔴 o servizio in sala (T9 non eseguibile, T15 Classic senza orari, perdita dati) |
| **P1** | T7-bis eseguibile + FU-SERV-TURNO-SALA-1 + T3/T5/T17 se confermati |
| **P2** | Copy/UX (V3, V1, T1 orari, metri/pixel, mobile T11) |

Per ogni voce: **ID · Schermata · Effetto staff · Sintomo · Diagnosi (etichetta Fase A) · Ipotesi A/B max 2 · File sospetti · Gate «Matteo riprova così» · Dipendenze FU**.

### Fase C — Handoff riprove (per Matteo)

Elenco corto: «Dopo i fix che scegli, riprova nell’ordine: …» con riferimenti alle sequenze già in COLLAUDO (non riscrivere tutto il file salvo mismatch grave wording → allora patch **solo docs** checklist e chiedi Sì/No).

### Fase D — Stop e attendi Matteo

Mostra lista P0→P2. **Non** toccare `src/` finché Matteo non dice **«implementa»** (o sceglie ID + «implementa»).  
Se/quando implementa: branch `env/test`, TEST only, validate; allinea skill Servizio se cambia comportamento; **non** dichiarare WP-1 chiuso.

---

## Perimetro scrittura (questa seduta di analisi)

| Consentito | Vietato |
|---|---|
| Report diagnosi + proposte in `docs/Sessioni di lavoro/26-08-26/` | `src/` senza «implementa» |
| Patch **minima** checklist solo se wording T7-bis/T9 è falso rispetto al codice (chiedi Sì/No prima) | Migrazioni · PROD · cutover |
| Capsula + §11 a «lavoro ok» / chiusura | «WP-1 chiuso» · inventare OK/KO collaudo |
| `mss:status` · lettura codice · sub-agent explore | Playwright al posto di Matteo per chiudere prove umane |

---

## Criterio di fatto (fine analisi, prima di implementare)

Matteo può:

1. Capire **perché** T7-bis e ogni `[O]` non erano testabili (etichetta chiara per ID).  
2. Scegliere cosa «implementa» per primo (P0/P1).  
3. Sapere **come riprovare** T7-bis / T9 / T15 dopo il fix.  
4. Vedere WP-1 ancora **IN PILOTA ombra** (non chiuso).

---

## Chiusura verso Matteo (obbligatoria in chat)

Titoli: **Cosa cambia per te** · **Dove siamo** · **Ti consiglio** · **Pronto per il prossimo passo** · **Tua azione**.  
Prima frase: elemento → intervento → risultato verificabile (niente sigle nude).

A «lavoro ok»: report completo + capsula; sezione breve «MSS istanza 2 vs skill normale» (osservazione orchestrazione sub-agent, no promozioni Persona).

---

## Da verificare (non bloccanti)

- Priorità relativa T15 vs T9 vs T17 vs episodio Pro.  
- V5: soft-limit voluto o bug copy?  
- Idea metri vs pixel (T10): solo bozza prodotto.
```

---

## Nota per Matteo (fuori dal blocco da incollare)

- **Default:** l’agente **non** implementa finché non scrivi «implementa» (o ID + implementa).  
- Se preferisci che, dopo la tua OK sulla lista, implementi i P0/P1 **nella stessa chat**, diglielo esplicitamente dopo Fase B.  
- File salvato: questo path. Il vecchio `Prompt-analisi-collaudo-e-raccolta-fix-servizio-26-08-26.md` resta storico; **usa questo** per il proseguimento.
