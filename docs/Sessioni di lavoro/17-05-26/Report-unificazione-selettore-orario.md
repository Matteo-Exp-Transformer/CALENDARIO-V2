# Report — Unificazione selettore orario in tutta l'app

**Data**: 17-05-2026
**Branch**: Sviluppo-Dashboard-laterale

## Obiettivo

Prima c'erano 3 modi diversi di scegliere un orario nell'app, con comportamenti incoerenti: il cliente che prenotava poteva scegliere solo le mezz'ore, il ristoratore poteva aprire il locale solo a orari tondi, e le fasce di servizio avevano un selettore dall'aspetto diverso su ogni telefono/tablet/pc. Ora c'è **un unico selettore identico ovunque**, con i minuti completamente liberi (0-59) sia per il cliente che per il ristoratore.

## Cosa è stato fatto (in ordine)

1. **Selettore unico potenziato** — al componente orario condiviso (`TimePicker24h`) è stata aggiunta una modalità "compatta" per stare bene anche nei riquadri stretti del form pubblico su telefono, senza cambiare nulla per le schermate admin che lo usavano già (resa identica a prima).

2. **Form pubblico di prenotazione** — il cliente ora sceglie l'orario con il selettore unico e può indicare **qualsiasi minuto** (prima solo :00 o :30). Il controllo che impedisce di prenotare fuori dagli orari di apertura del locale è rimasto invariato.

3. **Editor orari di apertura (admin)** — il ristoratore ora imposta apertura e chiusura con minuti liberi (prima solo orari tondi).

4. **Fasce di servizio (admin)** — i due campi inizio/fine fascia, che prima usavano il selettore nativo del browser (diverso su ogni device), ora usano il selettore unico. L'avviso "fascia notturna" continua a funzionare.

5. **Pulizia codice** — il vecchio componente orario, ormai senza più utilizzi, è stato **eliminato del tutto** (file rimosso + export rimosso), così sparisce anche il suo CSS globale fragile. Nessun file orfano.

## File toccati e perché

- `src/components/ui/TimePicker24h.tsx` — aggiunta prop `compact` (Tailwind statiche, niente CSS globale); rimosso commento che citava il file eliminato.
- `src/features/booking/components/BookingRequestForm.tsx` — il cliente usa il selettore unico in modalità compatta.
- `src/features/booking/components/BusinessHoursEditor.tsx` — il ristoratore imposta apertura/chiusura col selettore unico.
- `src/features/booking/components/servizio/ServiceSlotsManager.tsx` — inizio/fine fascia col selettore unico (adattato il passaggio del valore: ora arriva la stringa diretta, non un evento).
- `src/components/ui/TimeInput.tsx` — **eliminato**.
- `src/components/ui/index.ts` — rimosso l'export del componente eliminato.

## Domande poste all'utente

Nessuna in questa sessione: le decisioni (minuti liberi ovunque, niente step, eliminazione del vecchio componente, una sola passata) erano già fissate nel piano approvato.

## Test eseguiti

- `npm run typecheck` → **verde**
- `npm run lint` → **zero warning**
- `npm run test` → **90/90 verdi**
- Grep finale `TimeInput` su `src/` → **zero occorrenze**

I warning IDE su `min-h-[3rem]`/`!bg-white` sono solo suggerimenti stilistici (classi preesistenti nel file), non regole ESLint bloccanti.

## Cosa resta per la prossima sessione

- **Verifica visiva manuale** ai 3 viewport (telefono ~390px, tablet ~768px, desktop) con `npm run dev`: form pubblico (compatto, leggibile, niente overflow nella griglia data/ora), editor orari apertura, fasce di servizio (i due selettori non si sovrappongono a 390px), e regressione delle schermate admin che già usavano il selettore (devono essere identiche a prima). Non eseguibile in automatico.

## Allineamento skill

- `docs/APP_CONTEXT_SKILL.md` §4 — aggiunta RULE: selettore orario unico `TimePicker24h`, minuti liberi, `TimeInput` eliminato.
- `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` — nuova voce `TimePicker24h` (con `compact` e nota su `onChange` stringa); rimosso `TimeInput` dalle zone LOCKED.
- `docs/per-ui-design-skill/UI_EDIT_SKILL.md` — rimosso `TimeInput` dai LOCK, aggiunta nota sul selettore unico.
- `docs/per-ui-design-skill/STYLING_AGENT_CONTEXT.md` — rimosso `TimeInput` dalla tabella LOCKED.

## Deviazioni dal piano

Nessuna deviazione funzionale. Unica aggiunta non esplicitata: rimosso il commento residuo in `TimePicker24h.tsx` che citava `TimeInput` (file ormai inesistente) — coerente con l'obiettivo "codice pulito, nessun riferimento orfano".
