---
name: report-admin-dietary-display-batch2-18-06-26
description: >-
  Admin Classic — copy off-platform + badge rosso su BookingRequestCard;
  DetailsTab nasconde intolleranze se esiste tab Intolleranze e Note (tipi con menu).
---

# Report — Admin display dietary GDPR (batch 2, 18-06-26)

## Cappello

- **Cosa è cambiato:** in Admin → Prenotazioni, le richieste con intolleranze ma senza consenso GDPR mostrano un messaggio più chiaro e un badge rosso «Consenso non fornito»; nel modal dettaglio, per ristorante/evento con menù la sezione intolleranze resta solo nel tab dedicato, non duplicata in Dettagli.
- **Cosa resta:** niente in scope di questa sessione (DietaryTab, email, Prenota, DB fuori scope esplicito).
- **Serve una tua azione:** no — verifica manuale con checklist sotto.

## Cosa è stato fatto

1. **Card richiesta espansa (PendingRequestsTab):** se `dietary_off_platform_notice === true`, il box ambra ha il nuovo testo di Matteo e accanto al titolo «Intolleranze Alimentari» compare il badge rosso «Consenso non fornito» (stesso pattern del badge verde «Consenso esplicito»).
2. **Card con consenso:** badge verde e lista intolleranze invariati.
3. **Modal Dettagli Prenotazione → tab Dettagli:** la sezione «Intolleranze Alimentari» non compare più quando il `booking_type` usa menù (helper `bookingTypeUsesMenuSelections` — stesso criterio del tab «⚠️ Intolleranze e Note»). Per **tavolo** la sezione resta in Dettagli (unico posto).

## File toccati e perché

| File | Perché |
|------|--------|
| `src/features/booking/components/BookingRequestCard.tsx` | Copy off-platform + badge rosso |
| `src/features/booking/components/DetailsTab.tsx` | Nascondere blocco intolleranze se tipo con tab dietary |

## Test eseguiti e risultato

- `npm run validate` — **847/847** test, 0 errori lint/typecheck (1° run: flake `useRateLimit.test.ts` timer; 2° run verde).

## File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| nessuno | — | `ADMIN_CLASSIC_SKILL.md` e contesti `docs/Admin-Skill/` non documentano il display dietary; comportamento già tracciato nel report GDPR 18-06-26 senza tabella per-tipologia |

## Dati comunicazione

- Prompt esecutore unico, profilo Esecuzione standard, 3 punti output esatti + fuori scope esplicito.
- Matteo chiede copy verbatim per off-platform e checklist chiusura in linguaggio semplice.

## Analisi flusso prompt, efficienza e statistiche

- 1 prompt sostanziale · 0 correzioni · 0 follow-up generati · modalità standard invariata.
- Prompt efficace: file + righe + criteri di fatto + fuori scope delimitato.

## La tua lettura della sessione

- **Impressioni:** task chirurgico; LOCK rispettato leggendo i file interi; helper `bookingTypeUsesMenuSelections` già in DetailsTab via import evita prop drilling dal modal.
- **Difficoltà:** validate flake su `useRateLimit` (preesistente, non legato al diff) — risolto con secondo run.
- **Migliorie suggerite:** documentare in un contesto admin (es. `ADMIN_CRM_CONTEXT` o nota in report GDPR) la regola «intolleranze in DetailsTab solo per tavolo».

## Derivazione errori

- **useRateLimit flake** — bug preesistente / test timer sensibile al carico parallelo della suite; non introdotto da questa sessione.

## Cosa resta per la prossima sessione

- Nessun FU nuovo da questa sessione.

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt esecutore unico (profilo Esecuzione, modalità standard): 3 output — (1) BookingRequestCard off-platform nuovo copy + badge rosso «Consenso non fornito»; (2) stesso badge speculare al verde; (3) DetailsTab senza blocco intolleranze se `bookingTypeUsesMenuSelections`; fuori scope DietaryTab/email/Prenota/DB; validate verde; checklist chiusura + report §7.

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Verificati `BookingRequestCard.tsx` righe off-platform (badge `bg-red-100 text-red-700`, testo con ⚠️), `DetailsTab.tsx` condizione `!bookingTypeUsesMenuSelections(formData.booking_type)`, import helper. `npm run validate` output letto (847/847). `BookingDetailsModal.tsx` invariato (logica in DetailsTab).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna skill area da aggiornare (grep dietary in `docs/Admin-Skill/` vuoto). `DietaryTab.tsx`, `buildBookingEmailSummary.ts` non toccati per scope. Tipi DB invariati.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: Non aggiornato copy off-platform in `DetailsTab` (solo per tavolo, testo legacy «comunicherà esigenze» — fuori dai 3 punti richiesti). Non smoke browser manuale (validate + logica verificata). Non commit/push (non richiesti).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow, e come lo miglioreresti?
✅ R5: Attrito: flake `useRateLimit` sotto carico suite. Miglioria: isolare test timer-sensitive o `vi.useFakeTimers` più robusto in CI.

❓ Q6 — Contesto & hook: il contesto caricato era troppo / giusto / troppo poco?
✅ R6: Giusto — prompt con file e righe; report GDPR 18-06-26 per contesto campi `dietary_*` sufficiente.
