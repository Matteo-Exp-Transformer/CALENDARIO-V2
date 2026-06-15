Plan per agente Sonnet — task mancanti (in ordine)
Regole per ogni ciclo: carica prima docs/APP_CONTEXT_SKILL.md §0 + skill d'area; npm run validate verde a fine ciclo; report in Sessioni di lavoro/; mai scrivere su PROD (rwuxgvld); commit solo a «fai report finale». Un ciclo = una chat.

────────────────────────────────────────────────────────────────────
STATO AVANZAMENTO (aggiornato 13-06-26)
- Ciclo 1 — ✅ FATTO (commit 13b1e50, salvataggio admin fase 2).
- Ciclo 2 — ✅ FATTO: email Brevo su TEST verificata (FU-EMAIL-1 chiuso 15-06-26). FU-EMAIL-2 (UI log) in coda.
- Ciclo 3 — ✅ FATTO (Menu QR pack: import preset, FU-019, FU-MQR-2 ordine piatti, FU-017/020). BUG salvataggio modal QR risolto 13-06: migrazione 049 (`item_sort_overrides`) applicata su TEST (mancava la colonna → errore 42703).
- Ciclo 4 — ✅ FATTO. D6 guard stato pre-mutation (update/restore/no-show/cancel); D7 feedback orario mancante; L4/L10-L12 cap ospiti a video (110, costante esistente); FU-001 promo come chip in BookingDetailsModal (✅ accettazione visiva Matteo 13-06). validate 577.
- Ciclo 5 — ✅ FATTO. FU-023: guard chiusura editor preset (menù preselezionati) in MenuPricesTab; Personalizza form già guardato. FU-003 chiuso: audit delete Pro/CRM/Servizio tutte con conferma, zero window.confirm. validate 577.
- Ciclo 6 — ✅ FATTO. Fallback check_admin_email (FU-AUTH-3): setTenantFromAdmin → boolean, AdminAuthContext fa signOut se tenant non risolto (no admin loggato con tenant nullo). validate 580.
- Ciclo 7 — ✅ FATTO (15-06-26). Mini-pack: 8 `*_MINI.md` + §0.0b in APP_CONTEXT + 6 puntatori Cursor nuovi (FU-ALL-TIER chiuso). Anti-storia: §8 APP_CONTEXT + potatura Menu QR a guardrail S1b + §7 snellito (§7.3 Terminali → CHIUSURA §6) (FU-ALL-ANTISTORIA chiuso). PLAN_BLINDATURA_ADMIN allineato (mini-pack + nota anti-storia); FU-009 declassato a «quasi chiuso» (elementi ora mappati in PRENOTA_LAYOUT_CONTEXT). `validate:docs` verde.
- Ciclo 8 — ✅ FATTO (15-06-26). ✅ FU-040, FU-014, FU-LOG-1-H (sessione precedente). ✅ FU-010, FU-M3-QA-CT, **FU-026** (categorie + ingredienti + promo). validate 591 (pre-estensione FU-026); estensione ingredienti/promo senza nuovi test.
- Ciclo 9 — ✅ FATTO (15-06-26). Bozze v0.1 in `docs/legal/`: ToS B2B (FU-LEGAL-1), registro art. 30 + runbook breach + sub-processors (FU-LEGAL-2). Testo only; revisione avvocato/commercialista resta a Matteo. `LEGAL_STATE_CONTEXT` aggiornato.

Nota PROD: migrazione 049 (`item_sort_overrides`) applicata su TEST **e su PROD** (15-06-26, conferma Matteo). Cicli 1-6 rilasciati in produzione: merge `env/test → main` (ff `ee2dca7..46779d7`) + release PrenotaZen (push `a6833f0..da0be7c`, deploy Vercel).
────────────────────────────────────────────────────────────────────

Ciclo 1 — P1 · Salvataggio admin fase 2 (FU-002/004/005)
Prompt: «implementa FU-002 fase 2 + FU-004 + FU-005». Skill: Admin Classic + ADMIN_SETTINGS. Estendere footer unico+guard al resto app (promo save-on-apply, no doppio Salva); autosave disattivabile per prod via VITE_SETTINGS_AUTOSAVE/edition (non rimuovere l'hook); modale conferma al Salva su campi visibili in Pagina Prenota (whitelist da PRENOTA_DATA_FLOW + chiavi pubbliche 047). Decisioni Matteo 29-05 già registrate.

Ciclo 2 — P1 · Email Brevo (FU-EMAIL-1, poi FU-EMAIL-2)
Prompt: «implementa FU-EMAIL-1 con Brevo». Partire valutando il branch esistente feature/brevo-send-email. Edge send-email, collegare useBookingMutations + sendBookingCancelledEmail, tabella email_logs. Vincoli: deploy solo TEST; VITE_ENABLE_SEND_EMAIL resta SPENTO in prod; bozza copy IT dei template → approvazione Matteo prima di attivare. FU-EMAIL-2 (UI admin log email) in coda allo stesso ciclo o chat successiva.

Ciclo 3 — P2 · Menu QR pack (decisioni 13-06)
Prompt: «implementa import preset nel modal QR + fix e residui Menu QR». Skill: MENU_QR_SKILL.

NUOVO — «importa preset» in MenuQrModal (crea e modifica): selettore dei preset esistenti → precompila il modal con categorie ingredienti + ingredienti del preset scelto, carosello escluso; è una copia-in-bozza, il preset resta read-only (proprietà tab Menu), nessuna nuova colonna DB se non serve.
Fix tab preset che nasconde le categorie: era effetto del codice morto rimosso con la 043 — verificare se il sintomo esiste ancora e in caso eliminarlo.
FU-019: applicare theme_key/hidden_menu_item_ids/foto su PublicMenuCategoryPage (la preset page non esiste più post-043 — riscopare gli INC sul codice attuale).
FU-MQR-2: ordinamento piatti per-QR con frecce su/giù.
FU-017: query Q1–Q5 in GUIDA_USO_QUERIES_CONTROVERIFICA.md · FU-020: seed TEST per QA import preset.
Ciclo 4 — P2 · Admin prenotazioni residui (FU-046 + FU-001)
Prompt: «implementa FU-046 D6/D7/L4/L10-L12 + FU-001». Skill: ADMIN_PRENOTAZIONI. L4/L10–L12 solo cap a video con le costanti cap ospiti esistenti (deciso 13-06, niente server); D6 guard stato pre-mutation; D7 feedback orario mancante; FU-001 polish promo in BookingDetailsModal (accettazione visiva Matteo a fine ciclo).

Ciclo 5 — P2 · Guard e delete app-wide (FU-023 + chiusura FU-003)
Prompt: «implementa FU-023 residui e chiudi FU-003». Guard dirty su Personalizza form (BookingFormConfigPanel), modali preset e modali Pro minori (pattern DiscardChangesConfirmModal già in uso); audit finale delete Pro/CRM/Servizio → marca FU-003 Fatto.

Ciclo 6 — P2 · Fallback auth (debito MASTERPLAN §5)
Prompt: «implementa il fallback check_admin_email». Se la RPC fallisce: signOut o stato errore esplicito, mai utente loggato con tenant nullo (TenantContext + AdminAuthContext). Registrarlo in FOLLOW_UP come FU-AUTH-3 (FU-AUTH-2 è già occupato da un fix chiuso).

Ciclo 7 — P2/P3 · Skill system docs (design già approvati)
Prompt: «implementa FU-ALL-TIER Imp-1» poi Imp-2, Imp-3; a seguire «implementa FU-ALL-ANTISTORIA» (ordine E3-3 → E3-1 → E3-2, vietato toccare VOCABOLARIO). Poi aggiornare PLAN_BLINDATURA_ADMIN da masterplan e FU-009 (mappatura doc giro 3). Seguire i due file Design WP-E1/WP-E3 del 12-06 alla lettera.

Ciclo 8 — P3 · Polish e test opzionali
FU-026 (icone card in basso a destra, poi audit app-wide), FU-010 (hook validazione condiviso), FU-014 (enum PublicBookingSurface), FU-040 (Vitest hook centratura), FU-LOG-1-H (test Deno log.ts + redact valori), FU-M3-QA-CT (E2E toggle). Spezzabili in più chat, nessuna decisione aperta.

Ciclo 9 — P1 · Bozze legali (solo testo, no firma)
Prompt: «prepara bozza FU-LEGAL-1» poi FU-LEGAL-2: template ToS B2B (recesso mensile/annuale 30gg), registro art. 30, runbook breach, docs/legal/sub-processors.md → passaggio avvocato/commercialista resta a te.

Fuori scope Sonnet (restano a te): interviste M4 Impostazioni e M5 Pro (regola intervista-per-sezione), smoke live 5 min sull'app pubblica, P.IVA/fattura/professionisti, FU-033 (intervista profilo), region Supabase PROD (1 click in dashboard → Settings → General).