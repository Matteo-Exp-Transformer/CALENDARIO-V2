# Report deep — Nuovo modello limiti coperti (18-06-26)

> Profilo Esecuzione, modalità deep. Cambio di modello prodotto deciso da Matteo il 18-06: rimozione del
> limite coperti giornaliero, unico limite = per-fascia (opzionale, con interruttore globale) + nuovo
> vincolo orario. Supera la decisione M2 dell'11-06 (memoria `project_due_limiti_coperti`).

## In due parole (per Matteo)

Prima: nelle Impostazioni c'era la casella «Coperti massimi al giorno» che bloccava la pagina pubblica
quando si riempiva la giornata. **Ora quella casella non c'è più.** L'unico limite verso i clienti è
quello **per fascia oraria** (es. «a pranzo max 40»), e si accende con un interruttore generale «Attiva
limiti coperti per fascia». In più c'è un secondo interruttore «Rifiuta richieste fuori dalle fasce»: se
acceso, un cliente che chiede un orario fuori dagli orari di servizio non riesce a prenotare. Come sempre:
**questi blocchi valgono SOLO per i clienti sul sito; tu da admin puoi sempre creare** (al massimo un
avviso). Il pallino con la percentuale sul calendario ora si calcola sulla somma dei limiti delle fasce
del giorno; se anche una fascia non ha limite, mostra solo il numero di coperti.

## Scoperta architetturale chiave

Il limite «Coperti max» per fascia che l'utente imposta nel tab Impostazioni viene salvato in
`restaurant_settings.slot_guest_capacities` (`Record<slotId, number|null>`), **non** in
`service_slots.max_guests` (la UI Classic passa sempre `max_guests: null`). L'edge `create-booking`
leggeva **solo** `service_slots.max_guests` (sempre null in Classic) ed era gated da `slot_limit_enabled`
(default OFF) → **il limite per-fascia non bloccava nulla sul pubblico**. Fix cardine: allineare l'edge a
`slot_guest_capacities` con la stessa priorità del client `useCapacityCheck`
(`override → service_slots.max_guests → slot_guest_capacities[slotId]`).

## Modifiche

| Area | File | Cosa |
|------|------|------|
| Registry | `restaurantSettingRegistry.ts` | Rimosso `daily_guest_limit` (+ parser/schema/sentinella). Aggiunte chiavi boolean `slot_limit_enabled` e `booking_reject_out_of_slot` (default false). |
| Impostazioni (LOCK) | `RestaurantSettingsTab.tsx` | Rimossa sezione «Coperti massimi al giorno». Aggiunti 2 toggle in «Imposta Fasce Orarie». |
| Edge (LOCK) | `create-booking/index.ts` | Rimosso blocco `DAILY_LIMIT`. Cap per-fascia da `slot_guest_capacities`. Nuovo `OUT_OF_SLOT`. |
| Calendario (LOCK) | `BookingCalendar.tsx` | Badge %: denominatore = somma cap per-fascia del giorno (`resolveDayDenominator`); fallback conteggio. |
| Form admin | `AdminBookingForm.tsx` | Rimosso avviso giornaliero; resta l'avviso per-fascia (`useCapacityCheck`). |
| Hook | `useRestaurantSetting.ts` | Solo commento (esempio chiave admin-only aggiornato). |

Nessuna migrazione DB: le chiavi sono righe generiche in `restaurant_settings`. Default nuove aziende già
senza limiti (seed fasce con `max_guests` NULL, nessun seed `daily_guest_limit`).

## Test

- Rimossi/riscritti i test su `daily_guest_limit`: eliminati `restaurantSettingRegistry.dailyGuestLimit.*`
  e `adminBookingForm.dailyLimit.*` (feature rimossa). Nuovo `restaurantSettingRegistry.slotLimitToggles.*`.
- Aggiornati: `restaurantSettingRegistry.settingsM4.*`, `restaurantSettingRegistry.slotGuestCapacities.*`,
  `calendario.adminBlindatura.*` (badge per-fascia), `settingsTimeSlots.*` (toggle al Salva),
  `settingsSaveGuard.*` e `bookingCalendarGuard.*` (mock `useServiceSlotOverrides`).
- **`npm run validate` 814/814 verde** (lint + typecheck + test).

## Verifica edge su TEST (`docnnernvp`, v21)

`get_project_url` → `docnnernvp` confermato prima del deploy. 4 scenari probe su org `test-classic`:

| Scenario | Atteso | Esito |
|----------|--------|-------|
| `daily_guest_limit=1`, 6 coperti, 12:00 | passa (daily ignorato) | **201** ✓ |
| `slot_limit_enabled=true`, cap Pranzo=4, 5 coperti, 12:00 | bloccato | **409 `SLOT_LIMIT`** ✓ |
| `booking_reject_out_of_slot=true`, 15:45 (fuori fascia) | bloccato | **409 `OUT_OF_SLOT`** ✓ |
| `booking_reject_out_of_slot=true`, 12:00 (in fascia) | passa | **201** ✓ |

Dati di probe ripuliti; impostazioni `test-classic` ripristinate allo stato originale.

## Scalabilità multi-tenant (FU-006)

Ok. Le chiavi sono per-`tenant_id` in `restaurant_settings`; l'edge legge sempre filtrando per `orgId`.
Nessun valore globale, nessun timer/leak introdotto. Il badge legge gli stessi hook per-tenant già usati.

## Stato deploy / FOLLOW_UP

- Edge su **TEST `docnnernvp` v21** ✓. **PROD `rwuxgvld` NON deployata** → `FU-LIMITI-PROD` (deploy solo
  con conferma esplicita di Matteo; interim: in PROD resta il vecchio `DAILY_LIMIT`).

## Allineamento skill

- `ADMIN_SETTINGS_CONTEXT.md` §4 + §8 (nuovo modello), §Divieti (whitelist anon).
- `ADMIN_CLASSIC_SKILL.md` §4 (RestaurantSettingsTab + edge/badge).
- `BOOKING_CALENDAR_LAYOUT_CONTEXT.md` §7-bis (denominatore badge).
- Memoria `project_due_limiti_coperti` aggiornata (modello cambiato) + indice MEMORY.md.

## Note

- Il file edge sul disco includeva già lavoro `marketing_consent` (preesistente, non di questa sessione,
  colonne presenti su TEST) — preservato nel deploy.
- FU-051 cita `adminBookingForm.dailyLimit.*` come candidato date-mock: file ora rimosso (incidentale).

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Prompt iniziale (profilo Esecuzione, deep, PLAN MODE), direttive verbatim chiave:
«Modalità: deep — avviare in PLAN MODE (mappare i campi esatti e far confermare prima di scrivere). Non
abbassare la modalità.» · Output 1: «Rimozione del limite coperti giornaliero `daily_guest_limit`: casella
in RestaurantSettingsTab + chiave nel registry + blocco DAILY_LIMIT nell'edge create-booking.» · Output 2:
«Limite coperti PER-FASCIA opzionale che blocca SOLO la pagina pubblica Prenota (via edge), mai l'admin.» ·
Output 3: «Vincolo ORARIO opzionale: se l'orario richiesto non cade in NESSUNA fascia oraria configurata →
la richiesta pubblica viene rifiutata (admin libero).» · Output 4: «Badge % nel calendario ricalcolato: %
sulla SOMMA dei limiti per-fascia del giorno; se una fascia/giorno non ha limite coperti → mostra solo il
conteggio coperti, niente %.» · Output 5: «Bug: disattivando una fascia oraria, il suo limite coperti non
deve restare "appeso"/attivo.» · Output 6: «Nessuna capienza/limite di DEFAULT per le nuove aziende.» ·
Vincoli: «lavora e applica migrazioni/edge SOLO su TEST (docnnernvp); chiama get_project_url prima di ogni
write. La modifica all'edge in PRODUZIONE (rwuxgvld) richiede CONFERMA ESPLICITA di Matteo: preparala ma
NON deployare su PROD da solo.» Risposte all'intervista plan (AskUserQuestion): vincolo orario = «Nuovo
toggle dedicato (OFF)»; limite per-fascia = «Con interruttore globale»; badge = «Solo conteggio coperti»;
bug appeso = «Eliminazione fascia (già) + disattiva sezione». Poi: «prosegui / riprendi lavoro».

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ho riaperto `git status --short` + `git diff --stat`. **Verificato:** i file che ho modificato io
sono `restaurantSettingRegistry.ts`, `RestaurantSettingsTab.tsx`, `create-booking/index.ts`,
`BookingCalendar.tsx`, `AdminBookingForm.tsx`, `useRestaurantSetting.ts`, i 5 test aggiornati + 1 nuovo
(`restaurantSettingRegistry.slotLimitToggles.*`) + 2 eliminati (`adminBookingForm.dailyLimit.*`,
`restaurantSettingRegistry.dailyGuestLimit.*`), e i 4 doc/skill + report. **Correzione importante al
report:** il working tree contiene anche file **NON miei** — `BookingRequestForm.tsx`,
`DietaryRestrictionsSection.tsx`, `useBookingRequests.ts`, `PrivacyPolicyPage.tsx`, `types/booking.ts`,
`types/database.ts`, `supabase/migrations/053_marketing_consent.sql`: sono il lavoro `marketing_consent`
preesistente (già presente nel git status a inizio sessione). Il report lo nota già; qui lo confermo file
per file. La versione edge deployata su TEST è **v21** (output deploy reale). `npm run validate` 814/814 è
il valore reale dell'ultima esecuzione. I 4 esiti probe (201/409 SLOT_LIMIT/409 OUT_OF_SLOT/201) sono
output curl reali.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati in questa chiusura: `ADMIN_SETTINGS_CONTEXT.md` (§4 famiglia limiti, §8 nuovo modello,
§Divieti whitelist anon), `ADMIN_CLASSIC_SKILL.md` (§4 RestaurantSettingsTab + check disponibilità fascia),
`BOOKING_CALENDAR_LAYOUT_CONTEXT.md` (§7-bis denominatore badge), memoria `project_due_limiti_coperti` +
indice `MEMORY.md`, `FOLLOW_UP.md` (FU-LIMITI-PROD). Test correlati tutti aggiornati (vedi §Test). **Tipi:**
`src/types/database.ts`/`booking.ts` risultano modificati ma da lavoro `marketing_consent` altrui, **non**
dal mio cambio — il mio cambio non ha aggiunto colonne DB (le chiavi sono righe generiche in
`restaurant_settings`, già tipizzate come `Json`), quindi non richiede rigenerazione tipi. `useCapacityCheck.ts`
NON toccato (legge già `slot_guest_capacities` come fallback): coerente, nessun allineamento necessario.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato?
✅ R4: (1) **Deploy edge su PROD `rwuxgvld`** — volutamente NON fatto: il prompt richiede conferma
esplicita di Matteo; preparato + FU-LIMITI-PROD. (2) **Nessun test unit per l'edge** (Deno, non in vitest):
coperto dalla probe HTTP reale su TEST invece che da unit test — accettabile ma non è copertura automatica
in `npm run validate`. (3) Non ho ripulito la citazione stale di `adminBookingForm.dailyLimit.*` dentro
FU-051 (file ora rimosso): lasciata perché è una nota storica in un FU aperto, non un errore funzionale.
(4) Niente commit/push: è «lavoro ok», non «report finale».

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti?
✅ R5: Attrito: il file edge è stato modificato sotto di me a metà sessione (`marketing_consent` apparso tra
una Read e l'Edit → errore "File has been modified since read"), costringendomi a distinguere il mio diff
da quello altrui e a deployare un file che include lavoro non mio. Miglioria: una nota a inizio sessione che
elenchi i file già "dirty" nel working tree NON appartenenti al task (il git status iniziale c'era, ma una
riga esplicita "questi file sono di un altro lavoro in corso, non toccarli/non rivendicarli" eviterebbe
ambiguità nel report e nel deploy). In più: per le edge LOCK, un avviso che il deploy MCP bundla l'intero
file corrente del disco (quindi eventuale lavoro altrui finisce in TEST) sarebbe utile come safeguard.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto**: la mappatura per-file richiesta dal prompt (skill area + context + edge + DB)
ha permesso di scoprire il mismatch `slot_guest_capacities` vs `service_slots.max_guests` senza navigare a
tappeto. Il puntatore `ADMIN_CLASSIC_SKILL §4` (priorità capienza `useCapacityCheck`) è stato il tassello
che ha chiuso il cerchio. Hook: i reminder TodoWrite erano per lo più rumore (todo list già aggiornata).
L'hook `stop` di fine-sessione è stato **utile**: ha correttamente intercettato la sezione 11 mancante nel
report — senza, l'avrei saltata.
