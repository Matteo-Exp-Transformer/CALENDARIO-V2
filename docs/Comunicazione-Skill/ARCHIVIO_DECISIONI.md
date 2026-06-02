# ARCHIVIO DECISIONI — proposte chiuse (accettate / rifiutate / superate)

> **A cosa serve.** Storico delle proposte già **decise e codificate**. Tenuto qui per
> verifiche future, fuori da [PROPOSTE.md](PROPOSTE.md) che resta leggero con le sole
> **pendenze vive**. Non si lavora su questo file: si consulta. Quando una proposta in
> PROPOSTE.md viene decisa, la sua riga finale si sposta qui.
>
> Formato compatto: `[esito] (data) titolo → dove è codificata`. Il dettaglio storico sta
> nei report di sessione datati in `docs/Sessioni di lavoro/`.

---

## 02-06-26 — sessione Meta senior (dossier revisore)

- ✅ **Freno scope creep** → `PREPARA_PROMPT_SKILL.md` §2 + riga `Output attesi:` §1.A. 3 occorrenze; semi-enforcement (no hook: non verificabile da macchina che legge solo i file). Report: `Report-meta-senior-evoluzione-skill-system-02-06-26.md`.
- 🔶 **Guasto #1 (sezioni report saltate)** → hook `stop` v2 mirato (`.cursor/hooks/fine-sessione-nudge.mjs`) + istruzione qualitativa. NON nuova regola markdown (le sezioni erano già obbligatorie). Smart-allow. Vedi `EVOLUZIONE_SKILLS.md` M4.
- ✅ **«handoff due parti»** (copia-incolla + riepilogo) → ratificata in `PREPARA_PROMPT_SKILL.md` §3. Contenuto già richiesto da Matteo (OSSERVAZIONI 31-05); era irregolare solo il COME è entrata (deviazione sanata).
- ✅ **«prompt intero su correzione»** → regola di formato in `PREPARA_PROMPT_SKILL.md` §1.B. Se Matteo corregge un prompt, l'agente riconsegna il blocco intero, non il delta.
- ✅ **«sezione Analisi flusso prompt»** → di fatto risolta: è sezione obbligatoria del template (APP_CONTEXT §7.1) + ora rinforzata dall'istruzione qualitativa dell'hook. Non è una voce-trigger.
- 🟡 **«sticky»** → RITIRATA da VOCABOLARIO (era promossa senza ratifica), torna in OSSERVAZIONI. Per ripromuoverla serve ok esplicito di Matteo.
- ✅ **Zone confondibili anche in chat esplorativa** → blocco in `.cursor/rules/comandi-base.mdc` (`alwaysApply`). Niente hook sessionStart (i grilletti sono già iniettati).

## 31-05-26 — meta-analisi routing + revisione senior

- ✅ **Disambiguazione Prenota vs Menu QR** → `PREPARA_PROMPT_SKILL.md` §2. Unico danno dimostrato e ripetuto (fix su pagina sbagliata, ≥3 agenti). 3 proposte-doppione collassate qui.
- ✅ **Profilo + skill nel prompt esecutore** → `PREPARA_PROMPT_SKILL.md` §1.A. Riga fissa `Profilo · Modalità · Skill · Non caricare`. Costo zero.
- ✅ **Checklist QA: no URL, sì schermata+effetto** → già regola in `COMUNICAZIONE_UTENTE_SKILL.md`. Chiusa senza nuovo codice.

## 29-05-26 — miglioria skill system

- ✅ **Metriche successo chat** → `EVOLUZIONE_SKILLS.md` (M5). 4 criteri oggettivi + PAUSA-RACCOLTA.
- ✅ **Mockup HTML per scelta flusso UX** → `PREPARA_PROMPT_SKILL.md` §1.B. Esempio `mockup-salvataggio.html`.
- ✅ **Modalità light / standard / deep** → `PREPARA_PROMPT_SKILL.md` §1.A + `APP_CONTEXT_SKILL.md` §7.1. Deep automatico su DB/prod/LOCK/auth; l'esecutore può solo alzare.
- ✅ **«lavoro ok»** → VOCABOLARIO Liv.1 (task accettato + scrivi report completo).
- ✅ **«finestra/dialog di conferma»** → VOCABOLARIO Liv.1 (componente Modal, non window.confirm).
- ✅ **«revisiona e se ok committa»** → VOCABOLARIO Liv.2 (validate + stop su difetto logico).
- ✅ **Report unificato ciclo multi-agente** → `APP_CONTEXT_SKILL.md` §7.1.
- ✅ **Copy verbatim** → nota in `COMUNICAZIONE_UTENTE_SKILL.md` (cambia solo le stringhe citate).
- ✅ **Freno azioni strutturali rischiose** → `PREPARA_PROMPT_SKILL.md` §2 (misura impatto + AskUserQuestion).
- ❌ **«comportamenti ok ma voglio che cambi»** → ELIMINATA 01-06-26 (Matteo non la usa). Sostanza utile come prassi di stile in COMUNICAZIONE.
- ❌ **«compila report comunicazione»** (era Liv.2) → marcata pezza-a-dimenticanza, coperta da enforcement hook, NON promossa.

## 28-05-26 — mappatura iniziale vocabolario

- ✅ **«fai report finale»** → VOCABOLARIO Liv.1 (= commit+push, capitolo chiuso).
- ✅ **«dammi follow up»** (ex «dammi prompt proseguimento») → VOCABOLARIO Liv.1 (solo il prompt).
- ✅ **«revisione completa»** → VOCABOLARIO Liv.1 (revisione critica, mai ok di cortesia).
- ✅ **«spiegamelo semplice»** → VOCABOLARIO Liv.1 (metafora + chi-fa-cosa).
- ✅ **«scalabile e pulita / no parti obsolete»** → VOCABOLARIO Liv.1.
- ✅ **Scorciatoie d'area + stile** → VOCABOLARIO (zone Prenota/QR/admin/menu + sicurezza prod + plan-mode).
- ✅ **Termini profili di ingresso** (Esecuzione/Verifica/Meta) → VOCABOLARIO Liv.1 + `APP_CONTEXT_SKILL.md` §0.0.
- ❌ **«è un bug o è voluto?»** → RIFIUTATA (caso troppo raro).
- ❌ **«devo farlo io ogni volta?»** → RIMOSSA (non la dice abbastanza spesso).
