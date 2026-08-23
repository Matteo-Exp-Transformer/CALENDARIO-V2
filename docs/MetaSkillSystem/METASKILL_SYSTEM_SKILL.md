---
name: metaskill-system
description: >-
  Progetta, osserva e valida il MetaSkillSystem: kernel, pacchetti, ruoli/chiavi,
  raccolta dati delle sedute, crescita della persona, crescita del sistema e
  qualità degli output. Usare per architettura dello skill system, telemetria,
  criteri di validazione, migrazioni della documentazione e analisi dei report.
---

# MetaSkillSystem — ingresso v0

> **Stato:** v0 in costruzione, modalità ombra. Il sistema esistente resta operativo finché i
> gate del piano non autorizzano il passaggio. Questo file smista: non conserva la storia.

## Agente freddo — ingresso rapido

Se devi lavorare sul MetaSkillSystem **senza** rileggere tutto il corpus, apri per primo
[`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md): comandi, flussi light/standard/revisione,
owner vs viste, limiti correnti e confine P2A/P2B. Poi `npm run mss:status` e `PLAN_V0.md` §15.

## Ordine di lavoro

1. Identificare il tipo di seduta e il perimetro autorizzato.
2. Per criteri e stati leggere `PARAMETRI_MACRO_V0.md`.
3. Per raccogliere dati dalla chat leggere `CONTRATTO_CAPSULA_SESSIONE_V0.md`.
4. Per stato, costruzione, progressi, parallelizzazione o migrazione leggere `PLAN_V0.md`: è il
   masterplan e l'unico proprietario dello stato di `SYS-1`.
5. Se la seduta riguarda dati o valutazioni di Matteo, caricare anche la Bussola del binario
   crescita. Le regole di prova personali restano proprietarie di quel binario.
6. Per capire l'origine di una revisione architetturale o verificare che una lacuna sia già stata
   registrata leggere
   `archive/osservazioni/REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md`
   (stub TTL al path storico root). Non usarlo come stato.
7. Se Matteo chiede di **preparare / condurre chat di fantasticazione o immaginazione** (input
   immaginario → lui descrive come si comporterebbe), leggere
   `TIPO_SEDUTA_FANTASTICAZIONE_V0.md`: intent del tipo, non stato di `SYS-1`.
8. Se Matteo chiede di **studiare / analizzare / riusare** le risposte di quelle sedute (meta-studio
   dei metodi di lettura), leggere `STUDIO_RISPOSTE_FANTASTICAZIONE_V0.md` e il pacchetto privato
   owner collegato. Non apre `WP-1`. Non sostituisce la conduzione CFG.
9. Se Matteo chiede di **catalogare sedute o architetture, progettare o valutare senior e metodi,
   oppure confrontare metodi in modo controllato**, leggere
   `Senior-Eval-Pack/SENIOR_EVAL_SKILL.md`. Il pacchetto è sperimentale e subordinato a `SYS-1`:
   non è un nuovo kernel, una remediation H-1.3 o un'autorizzazione per `WP-1`/`WP-3`.

## Attrezzi disponibili e stato prima di agire

Prima di ricostruire lo stato a mano, usare soltanto gli attrezzi necessari (dettaglio operativo:
`MANUALE_OPERATIVO_MSS_V0.md` §2):

- `npm run mss:status` — fotografia read-only di owner/Git; non sostituisce la lettura di
  `PLAN_V0.md`. D5 (P1) ha rimosso numeri stale da §4-bis; conteggi mobili restano sui comandi.
- `npm run mss:query -- --verifica|--regole|--modelli|--fail|--costo|--json` — lettore del corpus;
  il conteggio dinamico va chiesto qui, non copiato da un report.
- `npm run validate:mss -- --mode file --file <report> --kind report --require-capsule` — gate di
  un report; il comando senza argomenti mostra intenzionalmente usage.
- `npm run test:mss` e `npm run test:mss:tools` — suite del validator e degli attrezzi.
- `npm run mss:capsule -- --judgments <file.json>` — generatore; richiede giudizi espliciti, non è
  una chiusura automatica della seduta.

Lo stato tecnico corrente, i limiti e l’ordine degli interventi sono in
`AUDIT_STATO_REALE_23-08-26.md`. Se il task è P0, caricare anche
`PROMPT_PROSSIMO_ESECUTORE_MSS_23-08-26.md` prima di modificare codice.

## I tre assi che non si fondono

- **Persona:** che cosa Matteo decide, apprende, trasferisce, verifica o delimita.
- **Sistema:** come routing, regole, agenti e controlli funzionano o falliscono.
- **Output:** che cosa viene prodotto, da chi, per chi, con quale uso e quale verifica.

Un evento può toccare più assi, ma ogni osservazione ha un asse primario. Non usare un successo
del sistema per alzare una competenza di Matteo; non usare l'attività di Matteo per dichiarare
affidabile il sistema; non contare un report come prodotto solo perché esiste.

## Regole v0

- Raccogliere prima eventi osservabili; introdurre punteggi solo dopo il pilota.
- Marcare sempre attribuzione e provenienza. `Scritto dall'agente sotto regia di Matteo` non
  equivale a `scritto da Matteo`.
- Distinguere comportamento spontaneo, guidato, suggerito dall'agente e congiunto.
- Per ogni regola separare **governance dichiarata**, **comportamento osservato** ed
  **enforcement reale**. Per una regola critica vale il più debole dei tre.
- Trattare report, profili, roadmap e dashboard come viste: un valore dinamico ha un solo owner.
- Vietare profilazione nascosta e inferenze psicologiche non richieste. Le sonde sono pertinenti,
  trasparenti e registrate; i test sigillati seguono il protocollo del proprio dominio.
- `Nessuna osservazione` è un dato valido. Inventare un problema o un segnale invalida la raccolta.
- Non migrare o riscrivere la root durante il pilota. Costruire in parallelo e fare cutover solo
  dopo i gate di `PLAN_V0.md`.

## Arresto obbligatorio

Fermarsi prima di agire se rotta, ruolo, ambiente, privacy, owner o permessi di scrittura non sono
determinati; se due rotte confliggono; se il task richiede un LOCK non autorizzato; oppure se una
prova verrebbe contaminata. Durante la seduta fermarsi quando cambia area, output o autorità oltre
il contratto iniziale.

## Cosa produce una seduta MetaSkillSystem

Una seduta produce soltanto gli output autorizzati nel piano o nel prompt, più la capsula minima di
sessione. Nuove regole, metriche e parole di vocabolario restano candidate finché Matteo non le
approva nel loro processo proprietario.
