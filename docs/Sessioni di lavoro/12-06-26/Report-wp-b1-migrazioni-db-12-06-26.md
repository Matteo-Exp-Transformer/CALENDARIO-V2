# Report WP-B1 — Riallineare migrazioni ↔ DB reale (12-06-26)

Profilo: Esecuzione (sub-agent) + Revisione senior · Modalità: deep · Branch: `env/test`

---

## 1. Cappello

- **Cosa è cambiato:** il permesso che fa vedere il ristorante ai clienti sulla pagina pubblica `/prenota/<nome>` ora è scritto in una migrazione versionata, prima esisteva solo "a mano" sul database. Da oggi il database è ricostruibile da zero senza quel buco.
- **Cosa resta:** la lettura "larga" delle impostazioni ristorante tra clienti diversi resta aperta di proposito — è il prossimo lavoro WP-B2, non questo.
- **Serve una tua azione:** sì — dare l'ok al commit finale (push), se vuoi chiudere anche lato git. Il lavoro sul database è già fatto su TEST e PROD.

---

## 2. Cosa è stato fatto

1. Confronto in sola lettura tra le migrazioni scritte nel progetto e le regole di accesso (RLS) realmente presenti sui due database, TEST e PROD, per le tabelle `organizations` e `restaurant_settings`.
2. Scoperto un solo disallineamento vero: sul database esiste un permesso di lettura pubblico su `organizations` (`anon_select_active_organizations`) che non era scritto in nessuna migrazione. Senza quel permesso la pagina pubblica del ristorante darebbe errore; era stato aggiunto a mano e mai versionato.
3. Smontato un falso allarme del primo passaggio: le regole admin di `restaurant_settings` (incluso il permesso di cancellazione) sembravano mancanti ma sono già scritte nella migrazione `002`. Nessun disallineamento lì.
4. Creata la migrazione `046_codify_policy_drift.sql` che mette nero su bianco quel solo permesso mancante, identico a com'è già sul database (nessuna restrizione aggiunta).
5. Applicata su TEST (verificato ambiente `docnnernvp`), smoke pubblico ok. Poi, con ok esplicito di Matteo, applicata anche su PROD (verificato ambiente `rwuxgvld`), smoke pubblico ok.
6. Aggiornati i documenti del database per riflettere lo stato reale.

---

## 3. File toccati e perché

| File | Perché |
|------|--------|
| `supabase/migrations/046_codify_policy_drift.sql` | NUOVO — codifica la policy `anon_select_active_organizations` mancante dalle migrazioni |
| `docs/DATABASE.md` | Aggiornato ultimo file repo a 046, prossimo 047, aggiunta riga 046 |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | Aggiornato ultimo file/prossimo prefisso, aggiunta riga 046 all'indice |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | Corretta riga `organizations` che diceva erroneamente "RLS: nessuna policy" |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | Stato WP-B1 → ✅ + link a questo report |

## 4. Test eseguiti e risultato

`npm run validate` → **verde**: lint 0 warning, typecheck 0 errori, test 68 file / 557 test passati. Nessun codice TS o tipo generato è stato toccato, quindi nessuna rigenerazione tipi necessaria.

Smoke DB sola lettura post-apply: policy `anon_select_active_organizations` presente e corretta (anon, SELECT, `is_active = true`) su TEST e PROD; vista `organizations_public` restituisce righe (TEST 6, PROD 3 ristoranti attivi).

## 5. File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/DATABASE.md` | numero migrazioni + riga 046 | la migrazione 046 entra nello storico DB |
| `docs/Database-Skill/DB_MIGRATIONS_CONTEXT.md` | numero/prefisso + indice 040–046 | stesso allineamento sul context migrazioni |
| `docs/Database-Skill/DB_SCHEMA_CONTEXT.md` | corretta nota RLS di `organizations` | la nota "nessuna policy" era falsa: ora ci sono 2 policy SELECT |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | stato WP-B1 ✅ + report | tracciamento masterplan |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | Playbook senior punto 9 | metodo nuovo imparato in revisione (drift migrazioni: traccia policy per nome su tutta la catena) |

## 6. Dati comunicazione

- Matteo ha aperto la sessione con il profilo Esecuzione deep già scritto e strutturato (passi 1:1 col masterplan), poi ha dato un solo via libera operativo: «allineiamo i DB sia test che prod. procedi.».
- Ha esplicitamente esteso l'autorizzazione a PROD nello stesso messaggio: questo è il consenso esplicito richiesto dalla regola PROD.
- Formato che ha funzionato: spiegazione del "drift vero vs falso allarme" in linguaggio pratico (pagina che dà errore), prima di chiedere l'ok.

## 7. Analisi flusso prompt, efficienza e statistiche

- Prompt sostanziali di Matteo: 2 (il lancio strutturato + il via libera PROD). Correzioni dopo la prima risposta: 0. Follow-up generati: 0 nuovi FU.
- Cosa ha reso il flusso efficace: il prompt di lancio conteneva già vincoli, divieti e cancello, quindi nessuna ambiguità. Il punto di decisione (TEST vs anche PROD) è stato risolto con una sola domanda Sì/No.

## 8. La mia lettura della sessione (revisore senior)

- **Impressioni:** il pattern "sub-agent esegue fase 1 read-only + bozza, senior rivede" ha funzionato ed è servito davvero: il sub-agent ha prodotto un'analisi corretta sull'unico drift reale (organizations) ma ha sbagliato sul `restaurant_settings`, dichiarandolo drift perché si era fermato alla migrazione 001 senza vedere la 002 che la supera. La revisione senior ha intercettato e corretto l'errore prima di qualsiasi scrittura.
- **Difficoltà + soluzione:** la bozza iniziale del sub-agent era sovra-dimensionata (ri-dichiarava policy già presenti in 002). Risolto leggendo direttamente 001+002 e riducendo la migrazione al solo permesso genuinamente mancante.
- **Migliorie suggerite (come dato, non modifica):** un sub-agent che analizza il "drift migrazioni" dovrebbe sempre cercare la policy per NOME su TUTTE le migrazioni (DROP+CREATE successivi), non confrontare solo con la prima migrazione che la nomina. Varrebbe la pena aggiungere questo accorgimento al passo di confronto nella DB skill.

## 9. Derivazione errori

- **errore agente (sub-agent):** ha classificato le policy admin di `restaurant_settings` come drift mancante. Derivava dall'aver confrontato solo con la migrazione 001 (che le crea come `tenant_*`) senza considerare la 002 (che le droppa e ricrea come `admin_*` con `current_admin_tenant_id()`, DELETE inclusa). Evitabile cercando ogni policy per nome su tutte le migrazioni. Intercettato in revisione, nessun impatto sul DB.
- Nessun bug preesistente di codice. Il "drift" su organizations non è un bug ma un debito di versionamento (policy applicata a mano in epoca 039 e mai scritta in file).

## 10. Cosa resta per la prossima sessione

- **WP-B2** (già pianificato nel masterplan): chiudere la lettura cross-tenant di `restaurant_settings` (`anon USING (true)`). Non è un nuovo FU, è il WP successivo.
- Nessun nuovo FU creato. Nessun debito aperto da questo WP.

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «sei agente senior. @docs/MASTERPLAN_ALLINEAMENTO.md leggi questo plan e preparati per prima sessione di lavoro senior.» seguito dal prompt strutturato Profilo Esecuzione / Modalità deep / WP-B1, con passi 1:1 col masterplan e chiusura «dimmi se ti è tutto chiaro … lancia sub agent per eseguire il lavoro. tu sarai revisore del lavoro.» (2) «allineiamo i DB sia test che prod. procedi.»

❓ Q2 — Dati = diff reale?
✅ R2: Ri-verificato aprendo i file: `046_codify_policy_drift.sql` (contenuto ridotto alla sola policy organizations); confermato con grep che `anon_select_active_organizations` NON esiste in nessuna migrazione tranne la 046; letto `002_rls_admin_users.sql` righe 76-91 che creano admin_select/insert/update/delete_restaurant_settings con `current_admin_tenant_id()`; letto `039` (security_invoker + grant anon, senza policy di riga); confronto pg_policies su TEST e PROD identici. Esiti `npm run validate` letti dal file completo: 68 file / 557 test.

❓ Q3 — File correlati allineati?
✅ R3: DATABASE.md, DB_MIGRATIONS_CONTEXT.md, DB_SCHEMA_CONTEXT.md aggiornati in questa chiusura (numerazione + riga 046 + correzione nota RLS organizations). MASTERPLAN_ALLINEAMENTO stato WP-B1 → ✅. Nessun tipo TS da rigenerare (la migrazione non aggiunge colonne). Nessun test da aggiungere (cambio di policy infrastrutturale già coperto a livello di smoke DB).

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non ho fatto uno smoke "da browser" sulle pagine pubbliche Prenota/Menu QR: ho verificato a livello DB (policy presente + vista che ritorna righe). È sufficiente perché la 046 è un no-op sul comportamento vivo (la policy esisteva già identica su entrambi i DB); l'applicazione serve solo a versionare. Non ho toccato `restaurant_settings` (confine WP-B2). Non ho committato/pushato: attendo il tuo «fai report finale».

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito minimo. L'unico punto: il sub-agent ha confrontato il drift solo con la prima migrazione che nomina la policy. Miglioria: nella DB skill, al passo "confronto migrazioni↔DB", esplicitare di tracciare ogni policy per nome lungo TUTTA la catena DROP/CREATE, non solo la prima occorrenza.

❓ Q6 — Contesto & hook?
✅ R6: Contesto giusto. Il prompt di lancio conteneva già vincoli e cancello, e la DB skill ha indirizzato subito ai file di context corretti. I reminder TodoWrite ricevuti erano rumore per un task lineare a pochi passi; non ho usato la todo list perché non aggiungeva valore.

## 12. Self-review

1. Dati = diff reale: ✅ riaperti migrazioni 001/002/039/046 e pg_policies TEST+PROD.
2. File correlati allineati: ✅ tre doc DB + masterplan aggiornati in questa chiusura.
3. Q1-Q6 sostanziali e coerenti: ✅.
4. Tono utente: ✅ cappello e "cosa fatto" parlano per pagina pubblica/errore, non nomi-file.
