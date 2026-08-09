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

## Ordine di lavoro

1. Identificare il tipo di seduta e il perimetro autorizzato.
2. Per criteri e stati leggere `PARAMETRI_MACRO_V0.md`.
3. Per raccogliere dati dalla chat leggere `CONTRATTO_CAPSULA_SESSIONE_V0.md`.
4. Per stato, costruzione, progressi, parallelizzazione o migrazione leggere `PLAN_V0.md`: è il
   masterplan e l'unico proprietario dello stato di `SYS-1`.
5. Se la seduta riguarda dati o valutazioni di Matteo, caricare anche la Bussola del binario
   crescita. Le regole di prova personali restano proprietarie di quel binario.
6. Per capire l'origine di una revisione architetturale o verificare che una lacuna sia già stata
   registrata leggere `REPORT_001_OSSERVAZIONI_ARCHITETTURALI_09-08-26.md`. Non usarlo come stato.

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
