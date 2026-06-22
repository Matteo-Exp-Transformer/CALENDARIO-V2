# HAND-OFF — Senior Orchestrator · stato post REQ-001/002/003 (F8→F13)

> **Data:** 2026-06-22 · **Da:** Orchestrator (sessione F8→F13) · **A:** prossimo Senior Orchestrator del branch.
> **Branch:** `feature/console-super-admin` (pushato su origin fino a `0be41bf`).
>
> Questo file raccoglie lo **stato reale**, gli **errori trovati (NON fixati, per tua scelta del committente)**
> e la **checklist di test in dev**. Leggi prima `00_BUSSOLA_CONSOLE.md` + `collaborazione/README.md`.

---

## 1. Cosa è stato consegnato (F8→F13, tutto su origin)

| Fase | Cosa | Commit | Verdetto |
|------|------|--------|----------|
| F8 | Vista "Tutti gli utenti" + navigazione (REQ-001 lettura) | `50555f9` | 🟢 |
| F9 | Scheda azienda drill-down + mappa copertura (REQ-002 t1) | `6f5f4b0` | 🟢 |
| F10 | Edge `console-admin` esteso: CRUD utenti/aziende, guard sandbox→allowlist (REQ-001/003) | `f94b075` | 🟢 |
| F11 | CRUD utente dalla UI (REQ-001 scrittura) | `9b2fd7f`+`ad2e619` | 🟢 |
| F12 | Crea/elimina azienda dalla UI (REQ-003) | `abd0f74` | 🟢 |
| F13 | Pannelli edition/feature/impostazioni scrivibili su **tutte** le aziende (FU-CONSOLE-12, DEC-052) | `0be41bf` | 🟢 |

REQ-001/002/003 = **CONSEGNATA** nel registro (pushate + mergiate in `env/test` da Matteo, `f4a6e4b`). Attendono l'**Esito test** di Matteo.

Decisioni: DEC-043…052 in `DECISION_LOG.md`. Audit: `PHASE_AUDIT.md` blocchi F8…F13. Plan DB: PLAN-DB-005 (SELECT admin_users), PLAN-DB-006 (CASCADE delete_tenant) — **a carico di Matteo**.

---

## 2. ⚠️ ERRORE TROVATO — NON fixato (per istruzione del committente)

**Sintomo (riscontrato da Cristiano in dev):** ogni salvataggio/modifica mostra
`Errore: VITE_CONSOLE_ADMIN_FUNCTION_URL non impostata. Aggiungi la variabile in console/.env.local.`

**Diagnosi (confermata):**
- `console/.env.local` contiene solo `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CONSOLE_ALLOWED_EMAILS`.
- **Manca `VITE_CONSOLE_ADMIN_FUNCTION_URL`** → `callConsoleAdmin` (console/src/lib/consoleAdminClient.ts) ritorna l'errore prima di chiamare l'Edge. È il **degrado previsto** dal codice, non un bug: è una mancanza di **configurazione**.
- **Causa radice (gap da F4):** `console/.env.example` **non elenca** `VITE_CONSOLE_ADMIN_FUNCTION_URL`. Chi crea `.env.local` dall'esempio non sa di doverla aggiungere.

**Risoluzione (per il prossimo agente / per Cristiano — NON eseguita in questa sessione):**
1. Aggiungere a `console/.env.local` (file gitignored, lato Cristiano):
   ```
   VITE_CONSOLE_ADMIN_FUNCTION_URL=https://docnnernvpyrbwuzzach.supabase.co/functions/v1/console-admin
   ```
   (URL da `collaborazione/STATO_AMBIENTE_TEST.md` §2.)
2. **Code-fix consigliato (FU):** aggiornare `console/.env.example` aggiungendo la variabile con commento, così non si ripete. → vedi **FU-CONSOLE-14** (sotto).

> ⚠️ Anche impostando la URL, le **azioni nuove di F10** (`create_admin_user`, `update_admin_user`,
> `delete_admin_user`, `create_tenant`, `delete_tenant`) funzionano **solo dopo il RE-DEPLOY** dell'Edge
> `console-admin` (il deploy originale PLAN-DB-003 aveva solo `update_edition`/`upsert_*`). Senza re-deploy
> l'Edge risponde "action non riconosciuta". E la **lista Utenti** resta vuota finché non si esegue **PLAN-DB-005**.

---

## 3. Altri debiti / incidenti di sessione

- **Bump root annullato (mia responsabilità):** il working tree aveva un bump non committato di
  `package.json`/`package-lock.json` root (vite 5→8, vitest 2→4). Il prompt esecutore F13 diceva
  "ripristina i file root con `git checkout HEAD --` se npm li tocca": l'esecutore l'ha applicato e ha
  **azzerato anche quel bump preesistente**. Era uncommitted/non recuperabile da qui. Cristiano: «lascia
  com'è, tanto Matteo allineerà il branch a `main`» → l'allineamento da `main` lo reintrodurrà. **Lezione
  per il prossimo:** nei prompt esecutore di' "lascia i file root come sono", non "ripristina a HEAD".
- **Follow-up aperti** (`FOLLOW_UP.md`): FU-CONSOLE-8 (leggibilità `prevValueRef`), **FU-CONSOLE-9**
  (editor sezioni intervista mancanti nella scheda azienda — REQ-002 copertura piena), FU-CONSOLE-10
  (formalizzare SQL diretto in migrazioni), FU-CONSOLE-11 (paginazione `listUsers` nell'Edge),
  FU-CONSOLE-13 (cleanup commenti/stili orfani post-F13), **FU-CONSOLE-14** (vedi sotto), + il follow-up
  Matteo su parametri pagina Prenota da console.

**FU-CONSOLE-14 (nuovo):** `console/.env.example` manca di `VITE_CONSOLE_ADMIN_FUNCTION_URL` (e va verificato che elenchi tutte le env runtime della Console). Aggiungerla con commento. Solo codice in `console/`.

---

## 4. ✅ Checklist di test in DEV (per Cristiano)

> **Prerequisiti dev** (senza questi i salvataggi falliscono — vedi §2):
> - [ ] `console/.env.local` ha tutte e 4 le variabili, **inclusa** `VITE_CONSOLE_ADMIN_FUNCTION_URL`.
> - [ ] Edge `console-admin` **ri-deployata** su TEST con le azioni F10 (lato Matteo).
> - [ ] **PLAN-DB-005** eseguito su TEST (lista Utenti) — lato Matteo.
> - [ ] (Opz.) **PLAN-DB-006** eseguito (CASCADE) per eliminare aziende con dati operativi.
> - [ ] `cd console && npm install && npm run dev` → login con l'email in allowlist.

**A) Navigazione & lettura (F8/F9) — non richiede l'Edge**
- [ ] Tab **Ristoranti** / **Utenti** funzionano; header + logout ok.
- [ ] **Utenti**: la lista mostra gli admin (email, nome, azienda, edition, stato). *Se vuota → manca PLAN-DB-005.*
- [ ] Ricerca per email filtra correttamente.
- [ ] Da una riga Utenti → **"Apri scheda"** apre la scheda azienda; da una card Ristoranti → idem; "← Torna" rientra.
- [ ] **Scheda azienda**: campi base org + pannelli edition/feature/impostazioni + **mappa copertura** (Sez.0/2/4 valorizzate, le altre 🔒 "in arrivo").

**B) Scrittura configurazione (F13) — richiede Edge + URL**
- [ ] Su un'azienda **reale** (non sandbox): cambiare **edition** → salva e si riflette (niente più "sola lettura").
- [ ] **Feature flag**: accendere/spegnere un add-on → persiste.
- [ ] **Impostazioni**: cambiare un valore (es. `booking_window_days`) → persiste e validazione ok.
- [ ] Sui sandbox (`console-classic`/`console-pro`) tutto continua a funzionare.

**C) CRUD utente (F11) — richiede Edge ri-deployata**
- [ ] **+ Nuovo utente**: email + password (≥8) + azienda → l'utente compare in lista e in Supabase Auth.
- [ ] **Modifica** utente (nome/azienda/email) → persiste.
- [ ] **Elimina** utente: il pulsante si abilita solo riscrivendo l'**email esatta** → sparisce da lista e Auth.

**D) Crea/elimina azienda (F12) — richiede Edge ri-deployata**
- [ ] **+ Nuova azienda**: nome + slug (auto) + edition + (opz.) admin email/password → compare in lista, apribile.
- [ ] Slug duplicato → errore chiaro (409).
- [ ] **Elimina azienda** dalla scheda: si abilita solo riscrivendo il **nome esatto** → sparisce. Azienda con dati operativi → messaggio 409 (serve PLAN-DB-006).

**E) Degrado**
- [ ] Senza `VITE_CONSOLE_ADMIN_FUNCTION_URL`: ogni save mostra il messaggio inline, **nessun crash** (comportamento atteso).

---

## 5. Stato decisioni / prossimi passi

- **Niente REQ nuova in DA-FARE.** Le 3 REQ sono in mano a Matteo per il test.
- Se Matteo apre **RIMANDATA** → riapri il ciclo esecutore→revisore sulla REQ.
- Follow-up disponibili da pianificare (ordine suggerito): **FU-CONSOLE-14** (env.example, rapido) →
  **FU-CONSOLE-9** (copertura piena scheda, grande) → cleanup FU-CONSOLE-8/13.
- Regola git del branch: **push fatto** fino a `0be41bf` con ok di Cristiano. Per i prossimi push: chiedere ok.
