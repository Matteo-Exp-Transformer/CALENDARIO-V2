---
name: calendarbackup-prenota
description: Usa questa skill per Pagina Prenota, BookingRequestPage, form pubblico, card tipologia, sub-tabs, sfondo, layout mobile, data/ora e riepilogo.
---

# CalendarBackup Pagina Prenota

Questa Roo Skill e un wrapper. La fonte di verita resta nei file `docs/`.

## Quando usarla

Usala per task su:

- Pagina Prenota pubblica;
- `BookingRequestPage`;
- card tipologia;
- sub-tabs;
- sfondo full-page;
- riepilogo;
- data/ora prenotazione;
- layout mobile e responsive del flusso pubblico.

## Fonti da leggere

1. `docs/Prenota-Skill/PRENOTA_SKILL.md`
2. `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` se il task riguarda layout, mobile o breakpoint.
3. `docs/per-ui-design-skill/UI_EDIT_SKILL.md` se il task riguarda classi, tema, componenti o stile.
4. `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se il task tocca dati, tipologie, sub-tabs o capability.

## Divieti

- Non confondere Pagina Prenota con Menu QR.
- Non toccare DB o flusso prenotazione se il task e solo layout.
- Non cambiare logica capability-driven con logica basata su nomi hardcoded.
- Non modificare file fuori area senza piano approvato.

## Output minimo

- Flusso coinvolto.
- File letti.
- LOCK rilevanti.
- Cosa puoi toccare.
- Cosa non tocchi.
- Test o QA previsti.
