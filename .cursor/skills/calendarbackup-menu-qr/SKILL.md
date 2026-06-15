---
name: calendarbackup-menu-qr
description: >-
  Entry point for the public QR Menu (Menu Digitale, /menu/:slug/qr/:shortCode)
  in CalendarBackup-v2: public menu pages, MenuQrModal create/edit, carosello,
  visible categories, hidden ingredients, homepage theme, qrMenu flag. Use when
  working on the QR menu area, its admin modal, or its data flow.
---

# CalendarBackup — Menu QR (Cursor pointer)

Puntatore stabile per Cursor. **Non duplica** regole/LOCK: vivono nei file versionati del repo.

## Prima di toccare il codice
1. Leggi il **mini-pack** (ingresso rapido, ~1 schermata): `docs/Menu-QR-Skill/MENU_QR_MINI.md`.
2. Poi la **skill piena** intera: `docs/Menu-QR-Skill/MENU_QR_SKILL.md`, e **solo** il file di
   `docs/Menu-QR-Skill/contesto/` che ti serve (la mappa è nel mini-pack §4).
3. Flusso dati admin ↔ pubblico: `contesto/MENU_QR_DATA_FLOW_CONTEXT.md` è **OBBLIGATORIO** prima di
   modificare i dati.

Routing ufficiale e profili (Esecuzione/Verifica/Meta): `docs/APP_CONTEXT_SKILL.md` §0 + §0.0b.
