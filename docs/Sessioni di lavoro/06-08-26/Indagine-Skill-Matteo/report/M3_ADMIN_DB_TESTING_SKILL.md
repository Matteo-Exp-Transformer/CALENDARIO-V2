# M3 — Admin / Dashboard laterale / Servizio-Config / Database / Testing-Skill

**Ondata:** M3 · **Data:** 06-08-26 · **Profilo:** Verifica | Meta · **Regime:** scavo  
**Leggi prima:** [PIANO_INDAGINE.md](../PIANO_INDAGINE.md) §3  
**Peso probatorio di questo corpus:** **4 — terziaria** (sintesi skill già scritte). Sono **IPOTESI** da confermare con A*, H*, J1 — non prove definitive di ciò che è successo in chat.

> Obiettivo: estrarre decisioni, agency e segnali skill dalle skill d’area vive che descrivono Admin, Servizio, DB e testing. Focus: (1) regola scritta ↔ sessione A in cui probabilmente è nata (candidato L4); (2) taglio collaudo 62→16; (3) salvaguardie TEST/PROD e chi le ha proposte.

---

## Sezione 1 — Decisioni

### 1.A Owner / intervista / gate espliciti (prioritarie)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| M3-D01 | 06-06-26 | FLUSSO | Staff e admin stessi permessi | MATTEO | APPROVATA | `Admin-Skill/ADMIN_SKILL.md` §2; `contesto/ADMIN_SHELL_NAV_CONTEXT.md` §9 | «Decisione Matteo 06-06-26: mantenere un unico accesso» | admin-ruoli |
| M3-D02 | 06-06-26 | PRODOTTO | Classic senza sidebar; Pro+ con sidebar | MATTEO | APPROVATA | `ADMIN_SKILL.md` §6; NAV §9 | «Classic non ha sidebar; Pro/Enterprise hanno sidebar» | edition-shell |
| M3-D03 | 06-06-26 | FLUSSO | Logout bloccato dal guard dirty | MATTEO | APPROVATA | `ADMIN_SKILL.md` §6; NAV §2 | «Logout con modifiche non salvate deve bloccare con guard» | dirty-guard |
| M3-D04 | 06-06-26 | UI-UX | Fallback header neutro | MATTEO | APPROVATA | `ADMIN_SKILL.md` §5–§6 | «Sistema Gestionale Prenotazioni» | fallback-admin |
| M3-D05 | 06-06-26 | PRODOTTO | `features.home=false` nasconde Home | MATTEO | APPROVATA | `ADMIN_SKILL.md` §6 | «`features.home=false` nasconde Home anche se sidebar resta attiva» | feature-home |
| M3-D06 | 06-06-26 | FLUSSO | Refresh/back via sotto-route URL | MATTEO | APPROVATA | `ADMIN_SKILL.md` §6; NAV §9 | «Refresh/back… usano sotto-route leggere» | url-source |
| M3-D07 | 06-06-26 | TESTING | Area 1 PROD solo con E2E browser | MATTEO | APPROVATA | `contesto/ADMIN_TEST_SUITE_INDEX.md` §9 | «Area 1 ✅ PROD solo con E2E browser reali» | blindatura-gate |
| M3-D08 | 06-06-26 | FLUSSO | Capienza/orario passato = solo avviso | MATTEO | ORIGINATA | `contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` §5-bis.1 | «SOLO AVVISO, mai blocco. Il ristoratore decide sempre» | soft-limits |
| M3-D09 | 06-06-26 | PRODOTTO | Stati booking tutti voluti | MATTEO | ORIGINATA | PRENOTAZIONI §5-bis.2 | «Stati prenotazione tutti VOLUTI, non toccare» | stati-booking |
| M3-D10 | 06-06-26 | PRODOTTO | Archivio solo soft-delete forever | MATTEO | ORIGINATA | PRENOTAZIONI §5-bis.3 | «Nessun "elimina definitivo" lato app» | soft-delete |
| M3-D11 | 06-06-26 | UI-UX | Una sola lingua di conferma | MATTEO | ORIGINATA | PRENOTAZIONI §5-bis.4 | «una sola lingua di conferma in tutta l'area» | conferme-ui |
| M3-D12 | 06-06-26 | AI-METODO | Senso voluto: non migliorare d’ufficio | MATTEO | ORIGINATA | PRENOTAZIONI §5-bis header | «non vanno "migliorate" d'ufficio» | product-interview |
| M3-D13 | 07-06-26 | TESTING | Controtest = cercare cosa rompe | MATTEO | ORIGINATA | `PLAN_BLINDATURA_ADMIN.md` §2 Fase D | «deciso da Matteo 07-06-26… "cosa puo romperla"» | controtest |
| M3-D14 | 11-06-26 | UI-UX | Calendario = vista d’insieme + lista | MATTEO | ORIGINATA | PRENOTAZIONI §5-ter | «leggero come vista d'insieme» + «lista di lavoro» | calendario-m2 |
| M3-D15 | 11-06-26 | FLUSSO | Calendario: solo accettate | MATTEO | ORIGINATA | PRENOTAZIONI §5-ter.2 | «Mostra SOLO prenotazioni accettate» | calendario-scope |
| M3-D16 | 11-06-26 | PRODOTTO | Assegna tavolo solo Pro+ | MATTEO | ORIGINATA | PRENOTAZIONI §5-ter.4 | «Scorciatoia… = SOLO Pro+» | gate-servizio |
| M3-D17 | 11-06-26 | IMPOSTAZIONI | Due limiti coperti separati e morbidi | MATTEO | ORIGINATA | PRENOTAZIONI §5-ter.6 | «Due limiti coperti SEPARATI e MORBIDI» | soft-limits |
| M3-D18 | 11-06-26 | UI-UX | % riempimento reale oltre 100% | MATTEO | ORIGINATA | PRENOTAZIONI §5-ter.7 | «mostra il valore reale (101%, 108%…)» | badge-capienza |
| M3-D19 | 11-06-26 | IMPOSTAZIONI | Blocco per-fascia pubblico ritirato | MATTEO | CORRETTIVA | PRENOTAZIONI §5-ter.10 | «non serve, avevo deciso male» | soft-limits |
| M3-D20 | 11-06-26 | UI-UX | Pulsante nuova prenotazione sempre visibile | MATTEO | CORRETTIVA | PRENOTAZIONI §5-ter.12 | «Matteo lo vuole fisso, sempre visibile» | calendario-ux |
| M3-D21 | 11-06-26 | PRODOTTO | Limiti magazzino 7/12/6/6 duri | MATTEO | ORIGINATA | `contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` §9.1 | «blocchi duri valgono solo sui nuovi inserimenti» | menu-limits |
| M3-D22 | 11-06-26 | FLUSSO | Snapshot prenotazioni invariante | MATTEO | APPROVATA | MENU §9.2 | «non altera mai pending, accettate, archivio» | snapshot-menu |
| M3-D23 | 11-06-26 | FLUSSO | Spento in magazzino = nascosto ovunque | MATTEO | ORIGINATA | MENU §9.3 | «spento qui = nascosto ovunque» | availability |
| M3-D24 | 15-06-26 | IMPOSTAZIONI | Nome obbligatorio; no titolo inventato | MATTEO | ORIGINATA | `contesto/ADMIN_SETTINGS_CONTEXT.md` §8 | «senza titolo inventato» | anagrafica |
| M3-D25 | 15-06-26 | IMPOSTAZIONI | Cap anagrafica 45/65/30/120 | MATTEO | ORIGINATA | SETTINGS §8 | «nome 45, email 65, telefono 30, indirizzo 120» | cap-testo |
| M3-D26 | 15-06-26 | IMPOSTAZIONI | `booking_window_days` non implementare | MATTEO | ORIGINATA | SETTINGS §8 | «Non implementare senza nuova decisione esplicita di Matteo» | fuoriscope |
| M3-D27 | 15-06-26 | IMPOSTAZIONI | Sfondo Prenota striscia XOR full-page | MATTEO | ORIGINATA | SETTINGS §8 | «due modalità esclusive» | background |
| M3-D28 | 15-06-26 | UI-UX | `app_theme` solo admin | MATTEO | ORIGINATA | SETTINGS §8 | «solo back-office admin; non cambia Prenota né Menu QR» | tema-admin |
| M3-D29 | 15-06-26 | PRODOTTO | Campagne: gruppo destinatari fisso | MATTEO | ORIGINATA | `contesto/ADMIN_CRM_CONTEXT.md` §10 | «non si aggiorna coi nuovi clienti (decisione Matteo 15-06-26)» | campagne-email |
| M3-D30 | 15-06-26 | FLUSSO | Niente creazione cliente manuale CRM | MATTEO | CORRETTIVA | CRM §1 | «Nessuna creazione manuale… rimosso» | crm-rubrica |
| M3-D31 | 18-06-26 | IMPOSTAZIONI | Niente limite giornaliero; solo per-fascia | MATTEO | CORRETTIVA | SETTINGS §8 | «Niente limite giornaliero… daily_guest_limit RIMOSSO» | soft-limits |
| M3-D32 | 18-06-26 | IMPOSTAZIONI | Limiti bloccano solo pubblico | MATTEO | APPROVATA | SETTINGS §8 | «ogni vincolo blocca SOLO il pubblico… l'admin crea sempre» | soft-limits |
| M3-D33 | 18-06-26 | COMPLIANCE | Marketing consent obbligatorio campagne | CONGIUNTA | APPROVATA | CRM §7 | «Consenso marketing obbligatorio… (18-06-26)» | gdpr-email |
| M3-D34 | 20-06-26 | UI-UX | Redesign rubrica: 3 fix Matteo in PROD | MATTEO | ORIGINATA | CRM §12 | «I 3 fix richiesti da Matteo… verificati live in PROD» | crm-rubrica |
| M3-D35 | 22-06-26 | PROCESSO | Codice morto Servizio rimosso | MATTEO | APPROVATA | `contesto/ADMIN_SERVIZIO_CONTEXT.md` §8 | «Codice morto RIMOSSO (intervista Matteo 22-06-26)» | cleanup |
| M3-D36 | 02-08-26 | UI-UX | Sale occupano troppo spazio → strip | MATTEO | ORIGINATA | SERVIZIO §9.7 | «Richiesta diretta di Matteo: «le sale occupano spazio»» | servizio-ui |
| M3-D37 | 02-08-26 | FLUSSO | Pubblico: solo cap fascia (D38) | MATTEO | ORIGINATA | `Testing-Skill/COLLAUDO_S4_CHECKLIST.md` §4 | «Decisione Matteo 02-08-26: il percorso pubblico… solo il limite coperti della fascia» | soft-limits |
| M3-D38 | 02-08-26 | FLUSSO | Walk-in: sala+tavolo obbligatori | MATTEO | APPROVATA | COLLAUDO_S4 §5 | «Deciso il 02-08-26: chi entra… su un tavolo» | walk-in |
| M3-D39 | 03-08-26 | FLUSSO | Spostamento non consuma turno (D-B) | MATTEO | ORIGINATA | SERVIZIO §9.14 | «Decisioni D-A/D-B/D-C/D-D di Matteo» | dottrina-turni |
| M3-D40 | 03-08-26 | FLUSSO | Delete tavolo: DELETE assignment (D-A) | MATTEO | ORIGINATA | SERVIZIO §9.14 | «cancella FISICAMENTE… non deve consumare un turno» | dottrina-turni |
| M3-D41 | 03-08-26 | FLUSSO | «Ancora occupato» persistito (D-D) | MATTEO | ORIGINATA | SERVIZIO §9.14 | «l'avviso di fine turno sopravvive al reload» | release-notice |
| M3-D42 | 06-08-26 | TESTING | Taglio collaudo 62→16 prove umane | CONGIUNTA | DELEGATA | `Testing-Skill/COLLAUDO_MANUALE_OBBLIGATORIO.md` header | «gap-analysis voce per voce fra checklist ed E2E/Vitest» | test-strategy |
| M3-D43 | 06-08-26 | TESTING | 38 voci già auto: non rifare a mano | AGENTE | SCELTA | COLLAUDO_MANUALE header + §5 | «38… già dimostrate… 16 prove che nessun test copre» | test-strategy |
| M3-D44 | 06-08-26 | PROCESSO | E2E ≠ «Matteo l’ha visto» | CONGIUNTA | APPROVATA | `COLLAUDO_S4_CHECKLIST.md` header | «un E2E non va trasformato retroattivamente in “Matteo l'ha visto”» | accettazione-umana |
| M3-D45 | 06-08-26 | TESTING | Servizio blindato tecnico TEST 118/118 | CONGIUNTA | APPROVATA | COLLAUDO_S4 header; `ADMIN_SKILL.md` §8 | «blindato tecnicamente su TEST… 118/118» | blindatura-servizio |
| M3-D46 | 12-06-26 | SICUREZZA | Mig 048 TEST+PROD con conferma Matteo | MATTEO | APPROVATA | `Database-Skill/DB_MIGRATIONS_CONTEXT.md` Snapshot 048 | «con conferma esplicita Matteo» / «con conferma Matteo» | env-safety |
| M3-D47 | 24-06-26 | SICUREZZA | S4 migrazioni solo TEST fino a rollout | MATTEO | APPROVATA | DB_MIGRATIONS Snapshot S4 | «PROD invariata fino a rollout con Matteo» | env-safety |
| M3-D48 | ? | SICUREZZA | get_project_url → TEST; PROD FERMATI | INCERTO | INCERTO | `DB_SKILL.md` §1; `DB_MINI.md` §3 | «get_project_url deve essere TEST docnnernvp» | env-safety |
| M3-D49 | ? | PROCESSO | `db push --include-all` vietato per sempre | INCERTO | INCERTO | `DB_SKILL.md` §3 | «db push --include-all vietato per sempre» | migration-ops |
| M3-D50 | 12-06-26 | PROCESSO | Dashboard-laterale → tombstone Admin | INCERTO | INCERTO | `Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` | «TOMBSTONE — file spostato (WP-D2, 12-06-26)» | skill-migration |
| M3-D51 | 23-06-26 | IMPOSTAZIONI | Arrivi tardivi solo console | INCERTO | INCERTO | `Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md` BLOCCO 2 | «Solo console, non pannello ristoratore (deciso 23-06-26)» | settings-governance |
| M3-D52 | ? | PRODOTTO | Console solo Matteo, non ristoratore | MATTEO | INCERTO | `Servizio-Config/BENVENUTO_SVILUPPATORE_CONSOLE.md` §2 | «La Console è solo per Matteo» | product-ownership |
| M3-D53 | ? | VENDITA | Edition/feature mai in mano cliente | MATTEO | INCERTO | `Servizio-Config/INVENTARIO_…md` 🟦 | «È il prezzo/fatturato. Mai in mano al cliente.» | monetization |
| M3-D54 | 05-08-26 | TESTING | Workers E2E = 1 chiuso | CONGIUNTA | SCELTA | `Testing-Skill/TESTING_SKILL.md` §3 | «la batteria e2e gira a UN worker, e la scelta è chiusa» | e2e-ops |
| M3-D55 | — | AI-METODO | Verde copertura ≠ sezione blindata | AGENTE | ORIGINATA | `MANUALE_BLINDATURA.md` §0 | «il verde… non dimostra che la sezione è robusta» | blindatura-metodo |

**Totale decisioni tabellate qui:** 55 (owner/gate ad alta densità).  
**Decisioni tecniche agente non elencate una per una** (architettura shell, anti-pattern, fix batch, layout Servizio FIX-1..7, marcatori test, GRANT Data API…): ordine di grandezza **~160+** nei soli context Admin — contate, non riassunte (peso 4, Chi tipico = AGENTE / SCELTA).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| M3-A01 | M→A | DIRETTA | Interviste Area 1–4 chiudono senso prima del codice | accettata | PLAN_BLINDATURA §2 Fase A; PRENOTAZIONI §5-bis/ter |
| M3-A02 | M→A | DIRETTA | «avevo deciso male» ritira blocco per-fascia pubblico | accettata | PRENOTAZIONI §5-ter.10 |
| M3-A03 | M↔M | DIRETTA | Limite giornaliero (11-06) → rimosso (18-06) modello per-fascia | accettata | SETTINGS §8; PRENOTAZIONI note 05-08 |
| M3-A04 | M→A | DIRETTA | Richieste UI dirette Servizio (sale/sagome) | accettata | SERVIZIO §9.7 / §9.9 |
| M3-A05 | M→A | DIRETTA | D-A/D-B/D-C/D-D Fase 0 Servizio (03-08) | accettata | SERVIZIO §9.14 |
| M3-A06 | M→A | DIRETTA | 3 fix CRM verificati live in PROD da Matteo | accettata | CRM §12 |
| M3-A07 | M→A | DIRETTA | Conferma esplicita prima di applicare mig 048 | accettata | DB_MIGRATIONS Snapshot 048 |
| M3-A08 | A→M | DEDOTTA | Gap-analysis 62→16 eseguita da agente su mandato «cose che DEVO testare io» | parziale | COLLAUDO_MANUALE header (Chi taglio non firmato nei 10 file Testing) |
| M3-A09 | A→M | DIRETTA | Piano 4 corsie S4: agenti collaudano al posto di Matteo | accettata (poi SUPERATO) | PIANO_E2E_AGENTI_S4 §1 |
| M3-A10 | A→M | DIRETTA | Finding «Ancora occupato» non persistito → D-D | accettata | SERVIZIO §9.13→§9.14 |
| M3-A11 | M→A | DIRETTA | Controtest «rompi» imposto a tutte le aree | accettata | PLAN_BLINDATURA Fase D (07-06) |
| M3-A12 | A→A | DIRETTA | Correzione doc: `daily_guest_limit` ancora citato post-18-06 | accettata | PRENOTAZIONI / DATA_FLOW note 05-08-26 |

**Sintesi agency in questo perimetro:** dominano **M→A** (intervista → regola) e **M↔M** sul modello limiti. Le **A→M** dirette sul merito sono poche; molte sono gate/ratifica o finding tecnico che Matteo decide dopo. Origine di `env-safety` (M3-D48) **non** attribuibile a Matteo da questi soli file.

---

## Sezione 3 — Skill signals

| Skill | Liv. provvisorio | Evidenza | Contro-evidenza cercata (obbligo L3/L4) |
|-------|------------------|----------|----------------------------------------|
| `soft-limits` / non legare le mani al ristoratore | **L4 cand.** | M3-D08, D17, D19, D31–D32, D37; ripetuto in skill vive | Trovata: cambio modello 11-06→18-06 + «avevo deciso male» — **non** cancella la skill, la raffina. Confermare in A9/A6 |
| `product-interview` (senso prima del codice; non migliorare d’ufficio) | **L4 cand.** | M3-D12, D13; ciclo PLAN_BLINDATURA A→D | Cercata: aree CRM/Analytics ancora ⬜ senza intervista chiusa → skill esercitata a tratti, non ovunque |
| `admin-ruoli` (admin=staff unico accesso) | **L3–L4** | M3-D01, D23, SETTINGS §8 | Cercata in perimetro: nessuna controprova di ruoli distinti introdotti poi |
| `blindatura-metodo` (A→D + controtest) | **L4 cand.** | MANUALE_BLINDATURA; PLAN §2; marker `@admin-blindatura` | Contro: «blindato tecnicamente» ≠ accettazione umana (M3-D44) — distinzione esplicita |
| `test-strategy` (filtro umano vs auto) | **L3** | M3-D42–D45; COLLAUDO_MANUALE | Contro: due doc divergono (16 prove vs «4 spunte su 62») stesso giorno |
| `env-safety` (TEST vs PROD) | **L1–L2 su Matteo** / **L4 di sistema** | M3-D46–D49; allineato a salvaguardie sempre attive | **Origine proposta: INCERTO** in M3. Matteo compare come **APPROVATA** su scritture (048, rollout). Handoff M1/H/A |
| `soft-delete` forever (no hard-delete UI) | **L3** | M3-D10 | Cercata: nessuna reintroduzione hard-delete UI in questi file |
| `edition-shell` Classic/Pro | **L3** | M3-D02, D05, D16 | — |
| `dottrina-turni` (append-only se servito) | **L3** | M3-D39–D41 | Contro aperta: divergenza delete sala vs tavolo (S-3) |
| `accettazione-umana` | **L3** | M3-D44; COLLAUDO_MANUALE «DEVE fare Matteo» | Contro: Skill §8 dice che l’agente esegue i passi di Verifica — tre modelli coesistono |
| `skill-migration` WP-D2 | **L0** | M3-D50 | Dashboard-laterale = cartello vuoto; zero decisioni di prodotto sopravvissute lì |
| `product-ownership` Console | **L1–L2** | M3-D52–D53 | Inventario vs Guida: arrivi tardivi Onboarding↔Console **non allineati** |

> **Regola dura §3.4:** i candidati L4 restano **provvisori**. Peso 4 = ipotesi. Triangolare con A6 (11-06 menu/interviste), A9 (18-06 limiti), A11 (06-08 collaudo), H*, J1.

### Link decisione → sessione A (candidati L4)

| Cluster decisioni | Sessione A citata nei file | Cosa verificare in A* |
|-------------------|----------------------------|------------------------|
| Shell D01–D07 | 06-06-26 (+ FU-042 → 10-06) | A5 / A6: chi ha posto le domande vs chi ha risposto |
| Prenotazioni D08–D12 | 06-06-26 | A5: Q1 verbatim |
| Controtest D13 | 07-06-26 | A5 |
| Calendario / Menu D14–D23 | 11-06-26 | A6 |
| Settings D24–D28 | 15-06-26 | A8 |
| Limiti D31–D32 | 18-06-26 | **A9** (cambio modello) |
| CRM D29–D30, D34 | 15-06 / 20-06 | A8 / A10 |
| Servizio D35–D41 | 22-06 → 02–06-08 | A10 + **A11** |
| Collaudo 62→16 D42–D45 | 06-08-26 | **A11** (mandato + firma) |
| Env 048 D46 | 12-06-26 | A7 |
| Tombstone Dashboard D50 | 12-06-26 | A7 (WP-D2) |

---

## Sezione 4 — Contro-evidenze

1. **Cambio modello limiti (forte, utile a S4):** il 11-06 nasce il «limite esterno giornaliero» (M3-D17); il 18-06 `daily_guest_limit` è **RIMOSSO** (M3-D31). Stesso filone: «non serve, avevo deciso male» sul blocco per-fascia (M3-D19). Skill `soft-limits` **regge** come principio, ma la forma concreta è stata ribaltata due volte.
2. **Due checklist di collaudo lo stesso 06-08:** `COLLAUDO_MANUALE` = 16 prove; `COLLAUDO_S4` header = «mantiene 4 spunte su 62». Non sono la stessa fotografia — rischio di leggere male «cosa resta umano».
3. **Tre modelli di «chi collauda» coesistono:** Manuale → Matteo sulle 16; `TESTING_SKILL` §8 → agente esegue Verifica; Piano S4 storico → 4 agenti, Matteo controverifica. Non ridurli a una sola narrazione.
4. **`env-safety` non è dimostrabile come ORIGINATA da Matteo in M3:** regola allineata alle salvaguardie sempre attive, ma Chi = INCERTO. Elevare a L4 «skill di Matteo» da questi soli file = **sovra-attribuzione**.
5. **Dashboard-laterale vuota:** 3 file tombstone. Qualunque decisione «da Dashboard laterale» va cercata in Admin-Skill / A7, non qui.
6. **Incoerenza Servizio-Config:** Inventario mette «Accetta arrivi tardivi» in Onboarding; Guida/Intervista dicono «solo console, deciso 23-06». Stesso pack, due verità.
7. **Blindato tecnico ≠ accettazione:** 118/118 e «blindato tecnicamente su TEST» **non** equivalgono a «Matteo l’ha visto» (esplicitato in COLLAUDO_S4).
8. **Debiti aperti citati:** CRM e Home/Analytics ancora ⬜; divergenza delete sala vs tavolo; domande aperte ritardo/buffer/durata walk-in; T13 badge Giorno vs Mese.
9. **Cercata, non trovata in questo perimetro:** episodio in cui Matteo sbaglia ambiente PROD/TEST e viene corretto; firma esplicita «approvo il taglio 62→16» nei 10 file Testing (solo gap-analysis + mandato implicito).

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **41** |
| File aperti | **41 (100%)** |
| Saltati / illeggibili | **0** |
| Regime | scavo |

**Ripartizione:**

| Cartella | N | Aperti |
|----------|---|--------|
| `docs/Admin-Skill/` (root + `contesto/`) | 18 | 18 |
| `docs/Dashboard-laterale-skill/` | 3 | 3 |
| `docs/Servizio-Config/` | 5 | 5 |
| `docs/Database-Skill/` | 5 | 5 |
| `docs/Testing-Skill/` | 10 | 10 |

Conteggio verificato con `Get-ChildItem … -Filter *.md | Measure-Object` → **41**.

---

## Sezione 6 — Lacune e handoff

| Lacuna | Handoff |
|--------|---------|
| Verbatim Matteo sulle interviste 06/11/15/18-06 | **A5, A6, A8, A9** (Q1 report) + **H2/H3** |
| Firma / mandato sul taglio 62→16 | **A11** + eventuale report `Report-collaudo-filtrato-…-06-08-26.md` (fuori perimetro M3 ma citato in sessione) |
| Origine storica `get_project_url` / salvaguardie | **M1** (`APP_CONTEXT_SKILL` §1b) + **H*** + regole Cursor |
| D1–D42 Masterplan Servizio (Chi/Autonomia) | **M4** (`MASTERPLAN_SERVIZIO.md`) + **A10** + **I1** |
| Console vs Servizio-Config Benvenuto | **M2** (`Console-Skill/`) |
| Verifica oggettiva migrazioni solo-TEST / 048 | **J1** |
| WP-D2 chi ha deciso lo spostamento Dashboard | **A7** (12-06) |
| Risoluzione arrivi tardivi Onboarding↔Console | Masterplan + transcript **23-06** |

---

## Sezione 7 — Chiusura verso Matteo

In queste cartelle c’è soprattutto la versione **già scritta a regola** di come funziona l’admin (chi può fare cosa, cosa non si blocca mai, Classic vs Pro) e di come si decide se una zona è «pronta»: prima il senso con te, poi i test, poi i tuoi occhi su ciò che la macchina non vede.

Sul collaudo di agosto, i documenti dicono che su 62 prove ne restano **16 tue** (il resto lo fanno i test automatici); e che «test verde» non significa «l’hai visto tu».

Sulla regola TEST/PROD («non toccare la produzione senza ok»), è scritta ovunque e combacia con le salvaguardie di sempre — ma da questi soli fogli **non si vede chi l’ha inventata**; si vede che tu hai dovuto dare l’ok quando si scriveva sul serio.
)
