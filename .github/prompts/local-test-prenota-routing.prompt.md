---
agent: local-ask-planner
description: Test T11 planner locale su routing Pagina Prenota da sintomo cliente.
---

Non modificare file.

Esegui questo test rispondendo come `local-ask-planner`. Non valutare il modello: la valutazione la
fara Matteo leggendo la tua risposta.

Se non riesci a leggere `AGENTS.md` o `docs/APP_CONTEXT_SKILL.md` §0, non inventare il routing:
chiedi a Matteo quei file, marca il resto come `NON VERIFICATO` e fermati.

Task:

Il cliente dice che nello schermo pubblico dove sceglie tipologia, eventuali card scorrevoli,
data/ora e riepilogo, lo sfondo full-page non scrolla bene su mobile.

Orientati nella repo e dimmi:

- quale schermata/flusso pensi sia coinvolto;
- quali skill leggeresti;
- cosa non toccheresti prima di un fix;
- dove interverresti secondo te, senza modificare file.

Criteri di valutazione per Matteo:

- inferisce Pagina Prenota;
- non confonde con Menu QR;
- cita `PRENOTA_SKILL`, `UI_RESPONSIVE`, `UI_EDIT`;
- cita rischi layout/sfondo;
- non tocca DB o flusso creazione prenotazione;
- chiede file di contesto se non riesce a leggerli;
- conferma nessuna modifica eseguita.
