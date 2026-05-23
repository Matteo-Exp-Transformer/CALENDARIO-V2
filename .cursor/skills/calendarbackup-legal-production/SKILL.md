---
name: calendarbackup-legal-production
description: >-
  Skill di assistenza per documenti, configurazioni e adempimenti legali/operativi
  per portare CalendarBackup-v2 in produzione commerciale con clienti UE.
  Copre: Privacy Policy, DPA Supabase, DPA verso clienti ristoranti,
  Registro trattamenti art. 30 GDPR, runbook data breach, cookie banner,
  configurazioni Supabase di compliance (SSL, PITR, MFA, ecc.), checklist
  produzione. Usare quando l'utente chiede aiuto su privacy, GDPR, contratti,
  conformità, "cose da fare per produzione", riscrittura Privacy Policy,
  generazione DPA, registro trattamenti, data breach, cookie banner, o
  qualunque messa in produzione "commerciale" (NON deploy tecnico).
---

# CalendarBackup — Legal & Production (Cursor)

## Obbligo prima di assistere

1. **WebSearch** per info aggiornate (norme, URL fornitori, modelli). Vedi §0.1 nella skill master.
2. Leggi nel repository, nell'ordine:
   - `docs/Legal-Production-Skill/LEGAL_PRODUCTION_SKILL.md` (entry point completo)
   - `docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` (stato attuale)
   - + uno o più context specifici secondo la tabella nella skill master §0.2
3. Verifica nel CODICE cosa fa davvero l'app (data inventory).
4. Confronta dichiarato vs realtà → segnala discrepanze.
5. Produci/aggiorna documenti.
6. Aggiorna `LEGAL_STATE_CONTEXT.md` + `docs/_lavoro/Per matteo/Cose-da-fare-per-produzione.md`.

## Cosa non duplicare qui

Tutto il contenuto sostanziale (regole, struttura documenti, sub-processor,
workflow) sta in `docs/Legal-Production-Skill/`. Questa skill è solo un
puntatore stabile per Cursor.

## Stile comunicazione

Utente non tecnico né legale. Spiega PERCHÉ prima di COSA. Esempi concreti
(Mario prenota, Luigi è admin). Nessun gergo legale senza traduzione.
Riassumere a fine messaggio. Costi sempre dichiarati per servizi esterni.
