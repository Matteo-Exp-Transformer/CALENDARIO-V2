# Report — Fix bug QR + Cicli 4/5/6 (15-06-26)

> **Sessione:** fix bug Ciclo 3 (salvataggio modal QR) + esecuzione Cicli 4, 5, 6 del `Plan-Completamento.md`.
> **Branch:** `env/test` · **validate finale:** lint ✅ · typecheck ✅ · **580 test ✅**
> **Scope concordato con Matteo in chat:** dopo il fix, eseguire solo i Cicli 4, 5, 6 (7-9 a chat dedicate).

---

## 0. Il bug segnalato (Ciclo 3) — RISOLTO

**Sintomo:** «errore nel salvataggio modal modifiche QR code menu».

**Causa reale (verificata, non ipotesi):** il DB di **TEST** non aveva la colonna `item_sort_overrides`
su `menu_qr_codes`. Il codice del Ciclo 3 (FU-MQR-2, ordine piatti per-QR) include sempre quella colonna
in insert/update del QR → Postgres rifiutava con **errore 42703 `column ... does not exist`** → toast
«Errore nel salvataggio del Menù QR». Non è un baco di codice: è la **migrazione 049 mai applicata** su
TEST (il report Ciclo 3 lo segnalava come azione lasciata a Matteo).

**Fix:** applicata `049_menu_qr_item_sort_overrides.sql` sul DB di TEST (`docnnernvp`), con password DB
fornita da Matteo, via connessione diretta al pooler. Verificato in lettura che la colonna esiste e che
PostgREST la serve (HTTP 200, valore `null`). Salvataggio QR funzionante.

> ⚠️ **PROD:** la colonna `item_sort_overrides` **NON è ancora su PROD** (`rwuxgvld`). Va applicata
> **insieme al rilascio production** (vedi §5), altrimenti il salvataggio QR si rompe in produzione per i
> tenant con feature `qrMenu` attiva.

---

## 1. Ciclo 4 — Prenotazioni admin (FU-046 D6/D7/L4/L10-L12 + FU-001)

File LOCK toccati (letta la skill `ADMIN_CLASSIC_SKILL.md` prima): `useBookingMutations.ts`,
`BookingDetailsModal.tsx`, `DetailsTab.tsx`, `AdminBookingForm.tsx`.

- **D6 — guard di stato pre-mutation.** `useUpdateBooking`/`useCancelBooking` (`.neq('status','deleted')`),
  `useRestoreBooking` (`.eq('status','deleted')`), `useMarkNoShow` (`.eq('status','accepted')`). 0 righe →
  `BOOKING_ALREADY_HANDLED` (ora messaggio leggibile «non più disponibile…») + invalidate, come il pattern
  accept/reject (FU-044). Effetto utente: se la prenotazione è cambiata in un'altra scheda, niente azione
  cieca → avviso + refresh.
- **D7 — orario mancante.** `handleSave` (BookingDetailsModal): se manca inizio o fine → toast esplicito,
  niente salvataggio silenzioso.
- **L4/L10-L12 — cap ospiti a video.** Clamp a `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS.numGuestsMax` (110) negli
  input di `AdminBookingForm` e `DetailsTab`; messaggio modale usa la costante (no hardcoded). Decisione
  Matteo 13-06: solo cap a video, nessuna validazione server.
- **FU-001 — promo come chip.** In `DetailsTab` (vista non-edit) le promo viste dal cliente sono chip
  distinti (pill `primary-50/700` + icona Tag) invece della stringa `join(', ')`. **✅ accettazione
  visiva Matteo (15-06).**

Test: aggiornati i mock `useBookingMutations*.test.tsx` al nuovo pattern (`.select()` array + `.neq`),
aggiunte race-guard D6.

## 2. Ciclo 5 — Guard + delete (FU-023 + FU-003)

- **FU-023:** unico residuo non guardato era l'**editor preset** (menù preselezionati) in `MenuPricesTab`.
  Aggiunto baseline draft + `isPresetEditorDirty` → `DiscardChangesConfirmModal` su «Annulla» editor e
  sulla X di sezione. `BookingFormConfigPanel` (Personalizza form) era già guardato via
  `UnsavedChangesContext`. Servizio/CRM/QR/Categorie già coperti (sessioni M6).
- **FU-003 → Fatto:** audit di tutte le delete Pro/CRM/Servizio non-Classic. Ognuna ha conferma prima
  della mutation (Modal o conferma 2-step inline). Zero `window.confirm`, zero delete immediate.

## 3. Ciclo 6 — Fallback auth (FU-AUTH-3)

- `TenantContext.setTenantFromAdmin` ora ritorna `boolean` (`false` se RPC `check_admin_email` in errore,
  0 righe, o `tenant_id` assente).
- `AdminAuthContext` su **entrambi** i percorsi (`checkSession` restore + `login`): se il tenant non si
  risolve → `signOut()` + `clearTenant()` + `setUser(null)` (login ritorna errore). Mai un admin loggato
  con tenant nullo.
- Test: `TenantContext.test.tsx` (ritorni true/false/errore) + 2 nuovi in `useAdminAuth.test.tsx`
  (restore e login con tenant non risolto).

---

## 4. Controverifica

- D6: i guard scelti sono coerenti con i flussi UI (modifica/elimina su pending/accepted; reinserisci solo
  da deleted; no-show solo su accepted) — nessuna azione legittima bloccata.
- `useUpdateBooking` passato da `.single()` a `.select()` + `data[0]`: `onSuccess` (`setQueriesData`/toast)
  invariato nel comportamento.
- Email (FU-EMAIL-1): **resta incompleta** (chiave Brevo non valida) — fuori da questo diff, già committata
  nel Ciclo 2. Nota nota a Matteo: non bloccante per questi cicli.

## 5. Allineamento PRODUCTION — ✅ COMPLETATO (15-06-26)

Con conferma esplicita Matteo («Sì, procedi con tutto»), verificato ambiente con `get_project_url`:
- **Migrazione 049 su PROD** (`rwuxgvld`): applicata via MCP `apply_migration` (additiva `ADD COLUMN IF NOT
  EXISTS item_sort_overrides`, nessun dato toccato). Verificato pre-apply che mancava (migrazioni PROD
  ferme a 048/044). Salvataggio QR ora funziona anche in produzione.
- **Merge `env/test` → `main`**: fast-forward `ee2dca7..46779d7`, push `origin/main`.
- **Release PrenotaZen**: `npm run release:prenotazen` (git archive di main, niente segreti) → build verde
  → commit + push `PrenotaZen` (`a6833f0..da0be7c`) → deploy Vercel automatico.
- **FU-GUARD-AUDIT** registrato: estendere l'audit guard modali + guard concorrenza multi-scheda (pattern
  D6 Ciclo 4) alle altre aree dell'app dove manca.

---

## 6. Cosa NON è stato fatto

- Cicli 7, 8, 9 (scelta Matteo: chat dedicate).
- Completamento invio email (FU-EMAIL-1, blocco chiave Brevo) — noto e fuori scope.
- QA browser reale dei flussi Ciclo 4 (validate copre logica, non rendering); FU-001 verificato a occhio da
  Matteo.

---

## §11 — Domande di chiusura

❓ Q1 — Prompt ricevuti (verbatim).
✅ R1: (1) «leggi @docs/Plan-Completamento.md e sistema bug ciclo 3 : errore nel salvataggio modal modifiche
QR code menu. dopo fix procedi fino a completamento cicli del plan.»; (2) risposta a domanda apply-049: «db
password : wpAvOfM1TFZXoNCt»; (3) scelta prosecuzione: «Solo Cicli 5 e 6 ora»; (4) «riprendi/completa il
lavoro»; (5) «confermo fu 001 test visivo fatto. aggiorna Plan-Completamento.md … controverifica … se è
tutto ok fai commit e push. poi allinea prenotazen in produzione (lascia scritto come FU di controllare
presenza guard su modali e multi schede aperte … anche nelle altre aree). poi fai report finale.»

❓ Q2 — Dati = diff reale?
✅ R2: Ri-verificato con `git status` + `git diff HEAD --stat`: 24 file modificati + 4 nuovi (049, GUIDA,
report Ciclo 3, report questa sessione), ~583 inserzioni. I file citati per Ciclo 4 (`useBookingMutations`,
`BookingDetailsModal`, `DetailsTab`, `AdminBookingForm`), Ciclo 5 (`MenuPricesTab`), Ciclo 6
(`TenantContext`, `AdminAuthContext` + i tre test) corrispondono al diff. Migrazione 049 applicata su TEST
verificata via REST (200, colonna presente).

❓ Q3 — File correlati allineati?
✅ R3: `FOLLOW_UP.md` (FU-001 attesa→QA fatto, FU-046 D6/D7/L*, FU-003 Fatto, FU-023 preset, FU-AUTH-3,
nuovo FU-GUARD-AUDIT); `ADMIN_PRENOTAZIONI_CONTEXT.md` (righe D6/D7/L4); `Plan-Completamento.md` (stato
cicli). Test di blindatura aggiornati col nuovo pattern mutation. Skill Menu QR già allineate dal Ciclo 3.

❓ Q4 — Cosa NON hai fatto?
✅ R4: (1) Cicli 7-9 (scelta Matteo: chat dedicate). (2) FU-EMAIL-1 invio email (blocco chiave Brevo, fuori
scope). (3) QA browser reale dei flussi Ciclo 4 (solo validate; FU-001 verificato a occhio da Matteo).
NB: migrazione 049 su PROD + merge main + release PrenotaZen sono stati **fatti** (§5), non restano aperti.

❓ Q5 — Attrito + miglioria.
✅ R5: Attrito: il bug Ciclo 3 era una **migrazione non applicata** scambiabile per baco di codice — diagnosi
richiede di controllare lo stato DB, non solo il codice. Miglioria: dopo una migrazione che aggiunge colonne
usate in scrittura, un check «colonna presente su TEST» nel CI/validate eviterebbe di scoprire il 42703 a
runtime. Secondo attrito: i mock supabase nei test di blindatura assumono la forma esatta della catena
(`.single()` vs `.select()`) → un helper mock condiviso con `.neq` ridurrebbe la manutenzione.

❓ Q6 — Contesto & hook.
✅ R6: Contesto giusto: routing `APP_CONTEXT §0` → `ADMIN_CLASSIC_SKILL` (LOCK) per Ciclo 4 ha imposto la
lettura integrale dei file prima dell'edit, utile su mutation transazionali. Hook pre-commit fine-sessione:
utile — ha imposto report + §11 prima del commit, coerente con la regola «report finale».
