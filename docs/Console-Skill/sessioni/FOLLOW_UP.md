# Follow-up — branch Console (debiti differiti)

> Cose da fare più avanti, con codice `FU-CONSOLE-NNN`. Non bloccano il lavoro corrente.

| ID | Cosa | Note |
|----|------|------|
| FU-CONSOLE-1 | Correggere `tenants` → `organizations` nei doc `docs/Servizio-Config/` (BENVENUTO, INVENTARIO) | Disallineamento col DB reale; vince il DB |
| FU-CONSOLE-2 | Allineare i twin `AGENTS.md` / `.cursor/rules/comandi-base.mdc` alle regole del branch (se servono su questo branch) | Non in scope nel setup iniziale |
| FU-CONSOLE-3 | Scaffolding dell'app `console/` (Vite+React+TS+Supabase isolata) + esclusione dalla pipeline root | Sessione successiva |
| FU-CONSOLE-4 | Decidere meccanismo Edge per scritture privilegiate della Console | Risolto in F4 (DEC-010): Edge Function dedicata |
| FU-CONSOLE-5 | ~~Tenant **sospesi** (`is_active=false`) non visibili al client anon~~ | ✅ **RISOLTO** (DEC-034): la policy `console_admin_select_organizations` per l'utente Console mostra TUTTI i tenant, attivi e sospesi |
| FU-CONSOLE-6 | ~~3 warning ESLint `console.log` nell'Edge Function Deno~~ | ✅ **RISOLTO in F7** (DEC-031): ESLint Console ignora `supabase/` |
| FU-CONSOLE-7 | ~~Pannello feature flag mostra solo il **bundle**, non gli **override** reali di `tenant_features`~~ | ✅ **RISOLTO** (DEC-034): policy `console_admin_select_tenant_features` eseguita su TEST → gli override reali sono leggibili |
| FU-CONSOLE-8 | `prevValueRef` in `IntEditor` (`RestaurantSettingsPanel.tsx`) usa `useState` con nome da `useRef` — fuorviante | Solo leggibilità; funziona. Cleanup con `/simplify` in sessione futura |
| FU-CONSOLE-9 | **Editor dedicati per le sezioni intervista non ancora esposte** nella scheda azienda (F9): Sez.1 contatti (`contact_email/phone/address`, `timezone`), Sez.3 orari/fasce (`business_hours`, `service_slots`, `slot_guest_capacities`), Sez.5 sala/tavoli Pro (`rooms`/`tables`/`booking_placement_areas`), Sez.6 menu/QR (`menu_categories`/`menu_items`/`menu_qr_codes`/promo), Sez.7 aspetto (`public_booking_page_background`, `app_theme`, `booking_public_form_config`). Inoltre: rendere **dinamici** gli stati ✅/⬜ della mappa di copertura per Sez.2/Sez.4 (oggi hardcoded ✅) | Aperto in **F9** (DEC-046/REQ-002 tappa 1). Richiedono editor dedicati e/o ricreare valori enum dell'app; alcune toccano nuove tabelle (sala/tavoli/menu). Pianificare come sotto-tappe dopo il write-block |
| FU-CONSOLE-12 | **Allineare il gate UI dei pannelli scrittura a DEC-037**: `EditionSelector`/`FeatureFlagsPanel`/`RestaurantSettingsPanel` gattano ancora la scrittura su `isSandboxTenant` (solo sandbox), mentre l'Edge (F10) ora consente la scrittura su tutte le aziende. Quindi nella scheda azienda (F9) edition/feature/impostazioni restano in sola lettura per i tenant reali | Le azioni utenti/aziende (F11/F12) già valgono su tutte le aziende; manca l'estensione coerente ai 3 pannelli di configurazione. Richiede di sostituire il gate `isSandboxTenant` con il modello allowlist+Edge anche lato UI |
| FU-CONSOLE-11 | `auth.admin.listUsers()` senza paginazione nell'Edge `console-admin` (usato in `update_admin_user`/`delete_admin_user`/`delete_tenant`): default ~50 utenti, potrebbe non trovare il target se Auth supera 50 utenti | Segnalato dal revisore F10. Su TEST (pochi utenti) non è un problema pratico; prima di uso reale, paginare o usare lookup mirato per email |
| FU-CONSOLE-10 | **Formalizzare in migrazioni versionate** TUTTE le modifiche di schema fatte su TEST fuori dal repo: (a) SQL diretto — tabella `console_allowed_emails`, funzione `is_console_user()`, 3 policy SELECT; (b) policy `console_admin_select_admin_users` (PLAN-DB-005, via MCP); (c) le 21 FK `ON DELETE CASCADE` verso `organizations` (PLAN-DB-006, via MCP `plan_db_006_cascade_delete_organizations`, 2026-06-23). | DEC-034. Le modifiche via MCP `apply_migration` finiscono nello storico migrazioni del DB **remoto TEST** ma **non** nei file `supabase/migrations/` del repo: vanno portate nei file prima di qualsiasi uso fuori da TEST. **Owner: team Console** (le abbiamo sviluppate e applicate noi — concordato con Matteo 2026-06-23). ⚠️ La cartella `supabase/migrations/` è zona LOCK di Matteo: aprire i file in coordinamento con lui (review + decisione su cosa portare in PROD, specie il CASCADE su dati storici). Vedi `collaborazione/STATO_AMBIENTE_TEST.md` |
| FU-CONSOLE-11 | **Console: comandi per modificare anche i parametri della pagina Prenota** (Personalizza Form: tipologie/durate, campi, testi, card…) oltre a quelli di Servizio | Richiesto da Matteo 22-06-26 durante la validazione del Masterplan Servizio. Si lega a `FU-SERV-ADMIN-PANEL-1` (classificazione manopole onboarding/preset/console) e alla sotto-area **S6** del Masterplan Servizio. Obiettivo: che dalla console privata si possano cambiare i parametri-chiave di Prenota senza entrare nell'admin del tenant. Da progettare con la sessione manopole. |

| FU-CONSOLE-13 | **Cleanup post-F13**: commenti obsoleti che citano ancora `isSandboxTenant`/RULE-2 come guard di scrittura (`useEditionChange.ts`, `useFeatureToggle.ts`, `useSettingSave.ts`, JSDoc di `EditionSelector.tsx`, JSDoc di `isSandboxTenant()` in `sandbox.ts`) + **stili orfani** non più referenziati (`readOnlyBadge` in RestaurantList, `readOnlyHint` in FeatureFlagsPanel/RestaurantSettingsPanel, `readOnlyHintInline` in TenantDetail) | Segnalato dal revisore F13 (non bloccante). Dead code/commenti fuorvianti dopo DEC-052. Pulibile con `/simplify` (accorpabile a FU-CONSOLE-8) |

| FU-CONSOLE-14 | ~~**`console/.env.example` manca di `VITE_CONSOLE_ADMIN_FUNCTION_URL`**~~ | ✅ **RISOLTO** (2026-06-22): aggiunta la variabile con commento in `console/.env.example` **e** in `console/.env.local` (URL Edge TEST `https://docnnernvpyrbwuzzach.supabase.co/functions/v1/console-admin`). Verificato via DB che l'Edge `console-admin` è deployata (v2, con tutte le azioni F10) e che PLAN-DB-005 è applicata → era l'unico pezzo mancante per i salvataggi in dev |

| FU-CONSOLE-15 | **Pulsante "togli eccezione / torna alla versione"** nel pannello Feature flags: oggi quando si accende/spegne una funzione si crea un override (`+override`/`-override`) in `tenant_features` che resta salvato; non esiste un'azione per **rimuovere la riga override** e tornare al comportamento di serie dell'edition (`bundle`). Aggiungere un'azione che cancella la riga `tenant_features` per quella feature (nuova action Edge `delete_tenant_feature` o riuso parametrico) | Emerso dalla domanda di Cristiano (2026-06-23) su cosa significa la scritta "override". Concordato di rimandarlo. Solo codice in `console/` lato UI; lato Edge serve una action di delete (no schema) |

## Test residui da rifare (Cristiano, 2026-06-23)

> Scenari di `collaborazione/richieste/REQ-004-scenari-test-cliente.md` non ancora provati. Non bloccano:
> le REQ sono ACCETTATE. Da spuntare in una sessione successiva.

| ID | Cosa | Note |
|----|------|------|
| TEST-RES-1 | **Accendere una funzione extra** (es. menù QR) dalla scheda azienda → sezione "Feature flags": la funzione passa ad accesa con la scritta verde "aggiunta a mano" + "Salvato", niente salto in cima | Scenario 3 (REQ-002). Si lega a FU-CONSOLE-15 (manca il pulsante "togli eccezione/torna alla versione") |
| TEST-RES-2 | **Creare un utente collegato a un'azienda** da Utenti → "+ Nuovo utente" (email + password ≥ 8 + azienda): compare in lista collegato all'azienda giusta | Scenario 8 (REQ-001). Verificare anche in Supabase Auth TEST |
| TEST-RES-3 | **Sezioni 🔒 «Copertura intervista nuovo cliente»** — capito il perché (editor non ancora esposti, è voluto): quando arriveranno gli editor (FU-CONSOLE-9), riprovare lo sblocco di Sez.1/3/5/6/7 | Domanda di Cristiano 2026-06-23. Risposta in REQ-002 §Esito test. Dipende da **FU-CONSOLE-9** |

## Domande a Matteo — ✅ TUTTE RISOLTE (2026-06-22, consenso pieno)

Vedi `DECISION_LOG.md`:
1. Deploy → Vercel root `console/`, `console.<dominio>` (dominio TBD) — DEC-012.
2. Add-on via `tenant_features`; `qr_menu_enabled` legacy — DEC-008.
3. «+QR» = classic + `tenant_features` `qrMenu` — DEC-009.
4. Edge Function scritture privilegiate su TEST → OK — DEC-010.
5. Login = Supabase Auth allowlist email — DEC-011.

> **Standing authorization** attiva (DEC-013): si procede senza chiedere conferma, ma **tracciando
> tutto** (`TRACCIABILITA.md`).
