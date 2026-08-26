# Prompt — Meta senior: comunicazione (2 istanze) + decisione turni tavolo + prepara fix voci [O]

> **Uso:** incolla il blocco sotto in una **nuova chat** (Meta senior / Opus).  
> **Branch:** `env/test` · **WP-1:** resta **IN PILOTA ombra** — non chiudere WP-1 · cutover vietato.  
> **Dopo P0/P1:** codice multi-tavolo + refresh già shippati; Matteo ritesta (COLLAUDO § RITEST).

---

```
Profilo: Meta senior (revisione + decisione prodotto + prepara-prompt; NON implementare src/ in questa chat salvo Matteo dica «implementa»)
Modalità: deep
Protocollo: MSS-PILOT-001 · ombra · freeze-2
Skill da leggere (in ordine):
  - docs/COMUNICAZIONE_UTENTE_SKILL.md (§ Regola zero · Domande per te)
  - docs/Comunicazione-Skill/VOCABOLARIO.md
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (fail capsula obbligatori in report — aggiunto 26-08)
  - docs/Comunicazione-Skill/OSSERVAZIONI.md (26-08: output causa→effetto; fail capsula)
  - docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md (Playbook Meta senior)
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md (solo § pilota / capsula)
  - docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md (§ turni / S4-FIX-5 / refresh 26-08)
  - docs/Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md (§ Conteggio 26/26 · RITEST · note T7-bis/T9 · [O])
  - docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-diagnosi-O-e-T7bis-26-08-26.md
  - docs/Sessioni di lavoro/26-08-26/Report-wp1-istanza2-p0-p1-fix-servizio-26-08-26.md (§4-bis fail capsula)
  - docs/FOLLOW_UP.md (FU-SERV-TURNO-SALA-1, BADGE, MANOPOLE)
Non caricare: cutover WP-6 · corpus Senior-Eval intero · skill Prenota/QR intere
Gate: npm run mss:status → WP-1 IN PILOTA ombra

## Contesto fatto (non inventare)

- Collaudo umano Servizio: **26/26** chiuse; T7-bis e T9 con riserve; ritest P0/P1/UX in COLLAUDO.
- P0 fatto: Rimetti in attesa / Archivia liberano **tutta** la tavolata.
- P1 fatto: Nuova prenotazione admin → Servizio senza F5.
- UX T9: overlay + hint Assegna.
- Voci ancora `[O]` **senza fix codice:** V3, V5, T10, T16 (+ debiti note su T1/T3/T4/T5/T11/T13/T15 — secondari).
- Turni tavolo: Matteo dubita del senso di «consumo turno» dopo delete tavolo/sala; chiede se ha senso mantenere turni-tavolo o solo limite coperti.

## Tre mandati (in ordine)

### A — Analisi 2 istanze comunicazione (solo dati → proposte)

Istanza 1: dopo diagnosi Verifica, output agente troppo denso (P0/P1/P2 + molte ipotesi/domande); Matteo chiede causa→effetto→soluzione, meno info, domande solo se mancano dati.
Istanza 2: fail procedura capsula in chiusura P0/P1 (titolo Capsula senza JSONL; judgments incompleti) — ora regola in CHIUSURA_SESSIONE + §4-bis report; Matteo vuole raccogliere più errori di procedura agenti nei report.

Output A (breve, causa→effetto→soluzione):
1. Verdetto per istanza: regola da promuovere / resta osservazione / scarta.
2. Eventuali bozze voce VOCABOLARIO o patch CHIUSURA/COMUNICAZIONE (testo proposto, Liv. consigliato) — **non** promuovere senza OK Matteo.
3. Come misurare la prossima occorrenza.

### B — Decisione prodotto: turni tavolo

Domanda Matteo (parafrasi fedele): se elimino tavolo/sala, perché misurare «turno consumato»? Serve solo che le prenotazioni tornino da assegnare? Ha senso i turni per tavolo o basta il tetto coperti fascia?

Output B:
1. Opzioni A/B (max 2) in linguaggio sala — effetto staff.
2. Impatto su FU-SERV-TURNO-SALA-1 / T7-bis / UI «turni residui».
3. Domanda Sì/No unica a Matteo per chiudere la decisione (niente griglia lunga).

### C — Prepara prompt per fixare le voci [O]

Per ciascuna: V3, V5, T10, T16 (e se utile un blocco «debiti secondari» T1/T3/T15-copy senza mescolare).

Per ogni voce: un prompt **auto-contenuto** pronto per agente Esecuzione su `env/test`, con:
- causa → effetto → soluzione attesa
- file sospetti (dai report diagnosi)
- gate ritest Matteo (1–3 click)
- divieti: PROD, cutover, non chiudere WP-1
Ordine consigliato P0/P1/P2 tra le [O].

## Forma risposta a Matteo

Titoli: **Cosa cambia per te** · **Dove siamo** · **Ti consiglio** · **Pronto** · **Tua azione**.  
Prima frase: elemento → intervento → risultato verificabile.  
Default breve; tabelle solo dove servono (A/B/C).  
Niente patch `src/` in questa chat.  
A fine: se Matteo accetta decisioni, aggiorna OSSERVAZIONI/PROPOSTE come da Playbook senior — non VOCABOLARIO senza OK.
```
