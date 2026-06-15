---
name: calendarbackup-prenota
description: >-
  Entry point for the public Booking page (Pagina Prenota, /prenota/:slug) in
  CalendarBackup-v2: customer reservation form, vetrina, Personalizza form,
  card/carosello tipologie, photo strip, summary sidebar. Use when working on
  the booking page, its admin config, or its data flow.
---

# CalendarBackup — Pagina Prenota (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (ingresso rapido, ~1 schermata): `docs/Prenota-Skill/PRENOTA_MINI.md`.
2. Poi la **skill piena** intera: `docs/Prenota-Skill/PRENOTA_SKILL.md`, e **solo** il file di
   `docs/Prenota-Skill/contesto/` che ti serve (la mappa è nel mini-pack §4).
3. Flusso dati magazzino ↔ vetrina ↔ pubblico: `contesto/PRENOTA_DATA_FLOW_CONTEXT.md` è
   **OBBLIGATORIO** prima di modificarlo.

Routing ufficiale e profili (Esecuzione/Verifica/Meta): `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
