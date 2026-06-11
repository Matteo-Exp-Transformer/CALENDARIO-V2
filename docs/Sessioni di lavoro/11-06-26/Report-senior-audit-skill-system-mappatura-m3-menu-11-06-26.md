# Report — Audit skill system + Mappatura M3 (Menu/magazzino) — 11-06-26

**Cosa è cambiato:** lo skill system è stato riallineato al codice reale (corretti nomi LOCK morti e doppie-verità) e l'area **Menu/magazzino** è ora **intervistata + mappata** (M3 avanza nel masterplan).
**Cosa resta:** M3 va **implementata** (3-4 pezzi nuovi) e poi testata/blindata; restano aperti i punti organizzativi minori già chiusi qui. Lavoro Calendario-tablet di un'altra sessione lasciato intatto nel working tree.
**Serve una tua azione:** no — commit fatto su `env/test` (doc-only, niente deploy production).

Sessione **senior** (profilo Verifica/Meta-mappatura). Modalità: **deep** (più aree doc + nuova mappa che genererà migrazione DB in M3). Solo documentazione: **nessun file `src/` toccato da questa sessione**.

---

## 1. Obiettivo
Su richiesta di Matteo: (1) come agente senior, **verificare prima dell'intervista** che lo skill system fosse allineato al codice reale e ben organizzato (single source of truth + divisione per tipologia), via sub-agent; (2) **intervistare** Matteo per la prossima fase di mappatura del masterplan, cogliendo flusso utente e flusso dati.

## 2. Audit skill system (2 sub-agent, pre-intervista)
Due sub-agent hanno confrontato i doc di contesto col codice reale: uno sulle aree **da mappare** (M2-operative, M3 Menu, M4 Settings), uno sulle aree **già blindate** (Prenota, Menu QR, Shell, Calendario) + verità del masterplan.

**Esito:** struttura a strati sana (entry "senso+mappa" + `contesto/` per tipologia); aree blindate allineate. Disallineamenti reali trovati e **corretti**:

| Problema | Correzione |
|---|---|
| Nomi LOCK morti `BookingForm.tsx` / `BookingsList.tsx` (file inesistenti dopo refactor) | → `AdminBookingForm.tsx` + `BookingRequestForm.tsx` e `PendingRequestsTab.tsx` + `ArchiveTab.tsx` (+ `BookingRequestCard.tsx`) in `ADMIN_CLASSIC_SKILL.md` §1 e `APP_CONTEXT_SKILL.md` §0/§4 |
| Settings: tabella chiavi incompleta (mancava `daily_guest_limit`) e **duplicata/divergente** con `ADMIN_DATA_FLOW §3` | `ADMIN_SETTINGS_CONTEXT.md §4` reso **puntatore unico** a `restaurantSettingRegistry.ts` (`RESTAURANT_SETTING_KEYS_V1`), orientamento per famiglia, no più lista divergente |
| Masterplan: contraddizione conteggio test Calendario (29 vs 41) | riconciliato a **41 (+2 No-show)** |
| Mappa cartelle `src/` priva di `publicBooking/` | aggiunta in `APP_CONTEXT §3` |
| `category_images` ambiguo (homepage QR legacy vs per-QR) | marcato legacy in `MENU_ADMIN_CONTEXT.md §2` |

## 3. Intervista M3 — Menu / magazzino (flusso utente + dati)
Area spezzata in 4 sotto-parti (A categorie+piatti · B preset · C QR · D rename/delete). Decisioni fissate (verbale completo e autorevole in **`ADMIN_MENU_MAGAZZINO_CONTEXT.md §9`**):

- **Limiti DURI** (solo su nuovi inserimenti, non rompere chi ha già sforato): 7 categorie · 12 prodotti/categoria · 6 preset · 6 QR. Cap caratteri su **nome + descrizione** (piatti e categorie), priorità mobile.
- **Foto** piatto opzionale; upload già auto-converte/comprime (webp ≤450KB) → nessun formato richiesto all'utente; HEIC grezzo da desktop = unico caso che fallisce → messaggio gentile.
- **Flusso dati — SNAPSHOT (cardine):** verificato nel codice che `booking_requests.menu_selection` congela nome+prezzo+quantità del menù scelto → modificare/eliminare il magazzino **non altera mai** pending/accettate/archivio. Asterisco accettato: snapshot non include descrizione/foto.
- **Propagazione viva:** modifiche al magazzino aggiornano subito Prenota + QR. Preset non riscrive la fonte. Modifiche per-QR restano locali. QR spento → "menu non disponibile".

**Da COSTRUIRE in M3 (non solo mappatura):**
1. Blocchi duri 7/12/6/6.
2. Cap nome+descrizione (oggi liberi).
3. **Nuovo toggle disponibilità nel magazzino** = nuova colonna booleana su `menu_items` + `menu_categories` (oggi assente), "spento qui = nascosto ovunque" → richiede migrazione + rispetto del flag in Prenota e QR, senza rompere lo snapshot. Distinto dal toggle per-preset (locale).
4. Avviso "tocchi anche Prenota/QR" da estendere al salvataggio **ingredienti** (oggi solo su categoria).

**Controtest obbligatori in blindatura:** rename/delete categoria (sync multi-risorsa senza transazione unica, radice FU-MQR-3); nuovo toggle (off in entrambe le vetrine, snapshot intatto); cap retroattivi.

## 4. File toccati (solo doc)
- `docs/ADMIN_CLASSIC_SKILL.md` — nomi LOCK corretti.
- `docs/APP_CONTEXT_SKILL.md` — nomi LOCK §0/§4, `publicBooking/`, riferimento registry settings.
- `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` — **§9 mappa M3** + stato.
- `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md` — tabella chiavi → puntatore registry; nome autosave.
- `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` — legacy `category_images`.
- `docs/MASTERPLAN_BLINDATURA.md` — riga M3 + sezione M3 + fix contraddizione test.

## 5. Stato finale e prossimo passo
M3 ha superato **intervista → mappa**. Prossimo step: **implementazione** (profilo Esecuzione, area Menu) dei 4 pezzi nuovi + migrazione DB toggle, poi test → controtest → blindatura. Memoria aggiornata (`project_m3_menu_magazzino_mappatura`).

## 6. Nota chiusura
Commit doc-only su `env/test`: **non** tocca `src/` → niente deploy PrenotaZen (regola §merge masterplan). Lavoro Calendario-tablet di altra sessione (`BookingCalendar.tsx`, `BOOKING_CALENDAR_LAYOUT_CONTEXT.md`, report tablet, `SESSION_LOG.md`, `OSSERVAZIONI.md`) **lasciato intatto** nel working tree, non incluso nel commit.

### Dati comunicazione
Sessione condotta in stile intervista per schermate/flussi (Mario/Anna), linguaggio pratico non tecnico, con verifiche puntuali nel codice prima di affermare. Nessuna voce di vocabolario nuova; grilletto «senior» (Meta/mappatura) + «fai report finale» (commit+push) applicati come da `VOCABOLARIO.md`.

---

## Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) Richiesta sessione **senior** pre-intervista masterplan: verificare che lo skill system sia allineato al codice reale e ben organizzato (single source of truth, divisione per tipologia), poi **intervistare** Matteo per la prossima fase di mappatura — area **M3 Menu/magazzino**, con flusso utente e flusso dati. (2) «fai report finale» — chiusura con commit doc-only su `env/test`. (Verbatim completo della chat originale non trascritto nel corpo del report; ricostruito da §1 Obiettivo + Dati comunicazione.)

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Riaperto `git diff --cached` (6 file, +175/−29): `APP_CONTEXT_SKILL.md` — tabella §0 con `AdminBookingForm`/`PendingRequestsTab` al posto di `BookingForm`/`BookingsList`; §3 cartella `publicBooking/`; §4 elenco LOCK aggiornato. `ADMIN_MENU_MAGAZZINO_CONTEXT.md` — banner stato M3 + **§9** con limiti 7/12/6/6, snapshot, 4 pezzi da costruire, controtest §9.4. `ADMIN_SETTINGS_CONTEXT.md` — §4 puntatore unico a `RESTAURANT_SETTING_KEYS_V1`, famiglia «Limiti coperti» con `daily_guest_limit`. `MASTERPLAN_BLINDATURA.md` — M3 «intervistato + mappato», Calendario **41 (+2 No-show)** test. `MENU_ADMIN_CONTEXT.md` §2 — `category_images` marcato legacy vs per-QR. Nessun `src/` nel diff. Correzione rispetto a §4 report: `ADMIN_CLASSIC_SKILL.md` (LOCK nomi) risulta nel commit `dede7e7` (sessione calendario-tablet), non nel bundle staged M3 — contenuto LOCK comunque presente su branch. Snapshot verificato in codice: `SelectedMenuItem` in `src/types/menu.ts` L152–158 (`id`, `name`, `price`, `quantity`, `totalPrice`).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Allineati nel bundle M3: `ADMIN_MENU_MAGAZZINO_CONTEXT.md` §9 (fonte autorevole decisioni), `MASTERPLAN_BLINDATURA.md` §M3, `APP_CONTEXT_SKILL.md`, `ADMIN_SETTINGS_CONTEXT.md`, `MENU_ADMIN_CONTEXT.md`. Cross-rimandi verificati: §9 rimanda a `PRENOTA_DATA_FLOW_CONTEXT.md` per resolver (non duplicato). `ADMIN_CLASSIC_SKILL.md` LOCK — già su branch via commit separato. **Non aggiornati:** `SESSION_LOG.md` (manca riga M3 senior), `PLAN_BLINDATURA_ADMIN.md` Area 4 (citato in MASTERPLAN come «da aggiungere» — follow-up implementazione). Nessun test/tipo `src/` toccati (sessione doc-only).

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vo vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non implementato codice M3 (blocchi duri, cap testo, toggle disponibilità, migrazione DB, avviso ingredienti) — fuori scope mappatura. Non scritta suite test `@admin-blindatura: menu`. Non aggiornato `SESSION_LOG.md` per questa sessione. Non toccato `src/` (voluto). `PLAN_BLINDATURA_ADMIN.md` Area 4 ancora da creare (MASTERPLAN lo segnala esplicitamente). Nota: §6 report dice «commit fatto»; al momento della revisione hook il bundle M3 risultava ancora **in stage** (commit calendario-tablet `540c227`/`dede7e7` già su branch, bundle M3 separato).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: nomi LOCK morti sparsi in più file (`APP_CONTEXT`, `ADMIN_CLASSIC`, tabella §0) — un sub-agent li trova ma serve commit coordinato per non lasciare doppie-verità; proposta: checklist «grep BookingForm.tsx / BookingsList.tsx = zero match nei doc» nel template report audit skill.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto** per deep Meta/mappatura — APP_CONTEXT + MASTERPLAN + context area M3; sub-agent explore utili per audit pre-intervista. Hook fine-sessione (questo nudge) utile: segnalava §11 mancante prima del commit staged M3. Nessun hook pre-commit su solo-markdown fino al commit effettivo.

---

## Self-review del report

1. **Dati = diff reale** — verificato `git diff --cached` sui 6 file staged M3 + commit `dede7e7` per ADMIN_CLASSIC.
2. **File correlati** — SESSION_LOG e PLAN Area 4 ancora aperti (annotati in Q3/Q4).
3. **Q1–Q6** — compilate con sostanza post-verifica diff.
4. **Tono utente** — cappello e §3 per flussi Mario/Anna e tab Menu admin.

Report pronto (§11 completata).
