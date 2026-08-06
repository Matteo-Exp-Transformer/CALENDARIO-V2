# M4 — Legal / Marketing / UI / Prenota / Menu-QR + root docs

> **Ondata:** M4 · **Data:** 06-08-26 · **Profilo:** Verifica | Meta · **Regime:** scavo  
> **Peso probatorio:** 4 (sintesi skill / masterplan — ipotesi da confermare con A*, H*, J1)  
> **Perimetro:** 60 file · **Aperti:** 60 (100%)  
> **Nota:** non tocca `src/`; non modifica Archives/`_lavoro`; nessun testo di contratto o segreto.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| M4-D01 | 12-06-26 | VENDITA | Mercato solo Italia per ora | MATTEO | APPROVATA | `Legal-Production-Skill/LEGAL_STATE_CONTEXT.md` §Vendita | «Mercato dichiarato: **solo Italia** per ora» | legal-vendita |
| M4-D02 | 12-06-26 | LEGALE | P.IVA ipotesi forfettario pre-incasso | MATTEO | ORIGINATA | idem BLOCCANTI | «**Ipotesi forfettario** … **da confermare con commercialista**» | legal-vendita |
| M4-D03 | 12-06-26 | LEGALE | Contratto B2B: bozza + avvocato | MATTEO | APPROVATA | idem BLOCCANTI | «revisione **avvocato** … Recesso: **mensile disdicibile sempre**» | legal-contratto |
| M4-D04 | 12-06-26 | LEGALE | Recesso mensile sempre; annuale 30gg | MATTEO | APPROVATA | `legal/ToS-B2B-abbonamento-template.md` header | «Decisione recesso approvata da Matteo (12-06-26)» | legal-contratto |
| M4-D05 | 12-06-26 | LEGALE | Fattura elettronica ADE gratis | MATTEO | APPROVATA | `LEGAL_STATE_CONTEXT.md` BLOCCANTI | «Strumento **gratuito ADE**» | legal-vendita |
| M4-D06 | 12-06-26 | COMPLIANCE | GDPR registro/runbook/sub-proc declassati | CONGIUNTA | CORRETTIVA | idem §DA FARE ENTRO | «**Declassati a «entro il primo mese»**» | legal-gdpr-priorità |
| M4-D07 | 12-06-26 | PRODOTTO | Marchio commerciale PrenotaZen | MATTEO | ORIGINATA | idem CONSIGLIATI | «uso commerciale con scritta **PrenotaZen**» | brand |
| M4-D08 | 12-06-26 | LEGALE | Deposito UIBM prima di stampa | MATTEO | APPROVATA | idem CONSIGLIATI | «**ricerca TMview** + deposito **UIBM**» | brand |
| M4-D09 | 12-06-26 | VENDITA | EAA come argomento vendita | CONGIUNTA | SCELTA | idem CONSIGLIATI | «**argomento vendita** (accessibilità come plus)» | legal-accessibilità |
| M4-D10 | 12-06-26 | PROCESSO | Email privacy@ rimandata | MATTEO | DELEGATA | idem CONSIGLIATI | «Email `privacy@<dominio>` — **rimandata**» | legal-contatti |
| M4-D11 | 12-06-26 | SICUREZZA | Region prod Supabase = Ireland | MATTEO | APPROVATA | idem §Region / tabella sub-proc | «confermato Matteo 12-06-26» | env-region |
| M4-D12 | 23-05-26 | COMPLIANCE | No Iubenda/OneTrust; docs in repo | MATTEO | ORIGINATA | idem Decisioni 2026-05-23 | «Matteo gestisce tutti i documenti come file in repo» | legal-metodo |
| M4-D13 | 23-05-26 | COMPLIANCE | Cookie banner = NO | MATTEO | APPROVATA | idem FASE 4; `COOKIE_CONTEXT.md` | «Banner cookie OBBLIGATORIO? ❌ NO.» | cookie |
| M4-D14 | 23-05-26 | UI-UX | Privacy Policy = pagina React `/privacy` | AGENTE | SCELTA | `LEGAL_STATE_CONTEXT.md` Decisioni | «Tenere la Privacy Policy come … PrivacyPolicyPage» | privacy-policy |
| M4-D15 | 23-05-26 | PROCESSO | DPA clienti = template locale gitignored | AGENTE | SCELTA | idem Decisioni | «template … cartella locale gitignored» | dpa-clienti |
| M4-D16 | 23-05-26 | LEGALE | DPA Supabase firmato e archiviato | MATTEO | APPROVATA | idem FASE 1 | «DPA compilato e firmato (2026-05-23)» | dpa-supabase |
| M4-D17 | 15-06-26 | PROCESSO | Bozze v0.1 in `docs/legal/` | AGENTE | DELEGATA | idem Storia 2026-06-15 | «**Bozze v0.1 create** (FU-LEGAL-1 + FU-LEGAL-2)» | legal-bozze |
| M4-D18 | 12-06-26 | VENDITA | Listino Classic 29 / Pro 69 / Ent 129 | MATTEO | APPROVATA | `Marketing-Skill/EDITION_PRICING_CONTEXT.md` | «prezzi **approvati** da Matteo il 12-06-26» | pricing |
| M4-D19 | 12-06-26 | VENDITA | Revisione Pro 79→69; fondatori 3→6 mesi | CONGIUNTA | CORRETTIVA | idem header | «Pro 79→**69€**, offerta fondatori da 3→**6 mesi**» | pricing |
| M4-D20 | 12-06-26 | VENDITA | Zero commissioni a coperto, canone fisso | MATTEO | ORIGINATA | idem §Regola | «**Zero commissioni a coperto, mai.**» | pricing-posizionamento |
| M4-D21 | 12-06-26 | VENDITA | Menu QR add-on Classic +16€/mese | MATTEO | APPROVATA | idem Add-on; `FEATURE_CATALOG` | «**+16€**» | pricing-addon |
| M4-D22 | 12-06-26 | VENDITA | Trial 30gg; setup fondatori; referral 1 mese | MATTEO | APPROVATA | idem §Trial | «**30 giorni**, senza carta» | pricing-servizi |
| M4-D23 | 30-05-26 | PRODOTTO | Fonte verità add-on = tenant_features | AGENTE | CORRETTIVA | `Marketing-Skill/MARKETING_SKILL.md` §3 | «Fonte di verità = `tenant_features`, NON … `qr_menu_enabled`» | marketing-flags |
| M4-D24 | ? | PRODOTTO | Bundle vs add-on prima di codificare | AGENTE | SCELTA | idem §2 | «Prima di codificare una nuova feature» | marketing-metodo |
| M4-D25 | ? | PRODOTTO | QR multipli per locale | MATTEO | ORIGINATA | `Menu-QR-Skill/MENU_QR_SKILL.md` §2-bis | «Perché QR MULTIPLI (decisione di Matteo)» | product-scoping |
| M4-D26 | ? | PRODOTTO | Evento = carosello + nome QR | MATTEO | SCELTA | idem §2-bis | «Il caso «evento» si copre con carosello + nome QR» | product-scoping |
| M4-D27 | 06-06-26 | PRODOTTO | Drop content_type/preset dal QR | CONGIUNTA | CORRETTIVA | idem §3-bis; `MENU_QR_REFERENCE` migr.043 | «NON reintrodurre `content_type`/`preset_ids`» | product-scoping |
| M4-D28 | ? | UI-UX | Nome QR interno, mai al cliente | MATTEO | APPROVATA | `MENU_QR_SKILL.md` §3 | «Scelte di Matteo… Il nome del QR è INTERNO» | ux-privacy-labels |
| M4-D29 | ? | FLUSSO | Carosello obbligatorio al Salva | MATTEO | APPROVATA | idem §3 | «È un requisito voluto, non un eccesso di rigidità» | form-validation |
| M4-D30 | 06-06-26 | UI-UX | Eyebrow vuota → niente fallback | MATTEO | APPROVATA | idem §3 | «NON «Specialità della casa»… Deciso 06-06-26» | ux-no-fake-copy |
| M4-D31 | 06-06-26 | UI-UX | Cap titolo/desc card QR 30/70 | MATTEO | SCELTA | `MENU_QR_TEXT_LIMITS_MAP.md` §B | «Valori decisi con Matteo: titolo 30… descrizione 70» | layout-text-caps |
| M4-D32 | ? | UI-UX | Cap testo cliente Prenota silenziosi | MATTEO | APPROVATA | `Prenota-Skill/PRENOTA_SKILL.md` §3 | «Sono scelte di Matteo… volutamente invisibili» | layout-text-caps |
| M4-D33 | ? | UI-UX | Striscia foto anche a 375px | MATTEO | APPROVATA | idem §3 | «È voluto, non un bug responsive» | public-layout |
| M4-D34 | ? | PRODOTTO | XOR card/carosello per modalità | MATTEO | APPROVATA | idem §3 | «O card O carosello, mai entrambi» | product-xor |
| M4-D35 | 02-06-26 | UI-UX | Sotto 1256px: un solo riepilogo | MATTEO | APPROVATA | idem §3 | «deciso 02-06-26… Non «manca il pulsante sticky»» | public-layout |
| M4-D36 | 05-06-26 | PRODOTTO | Intolleranze su ogni tipologia | MATTEO | ORIGINATA | idem §3-bis | «scelta deliberata di Matteo (05-06-26)» | product-capabilities |
| M4-D37 | 04-08-26 | FLUSSO | Card singola → auto-selezione | MATTEO | ORIGINATA | `PRENOTA_LAYOUT_CONTEXT.md` §5 | «Card singola (04-08-26, decisione Matteo)» | product-auto-select |
| M4-D38 | ? | PROCESSO | LOCK griglia: chiedere a Matteo | MATTEO | APPROVATA | `PRENOTA_SKILL.md` §5 | «Modifiche che li violano vanno discusse con Matteo» | lock-discipline |
| M4-D39 | ? | AI-METODO | Tre zone menu disambiguate | CONGIUNTA | APPROVATA | `PRENOTA_MINI` / `MENU_QR_MINI` | «Prenota ≠ Menu QR ≠ tab Menu (magazzino)» | area-routing |
| M4-D40 | 04-06-26 | AI-METODO | Stub path Prenota → Prenota-Skill | AGENTE | DELEGATA | `per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | «Obsoleto dal 04-06-26… rimando» | skill-hygiene |
| M4-D41 | 12-06-26 | AI-METODO | Stub Menu admin → Admin-Skill | AGENTE | DELEGATA | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | «DEPRECATO… Tombstone WP-D1 (12-06-26)» | skill-hygiene |
| M4-D42 | 10-06-26 | PROCESSO | Intervista per sezione prima di blindare | MATTEO | ORIGINATA | `MASTERPLAN_BLINDATURA.md` §flusso | «L'intervista avviene all'apertura di OGNI sezione» | blindatura |
| M4-D43 | 10-06-26 | PRODOTTO | main/PrenotaZen = Classic; Pro fuori | MATTEO | ORIGINATA | idem Confine production | «main / PrenotaZen pubblica = edition Classic» | edition-prod |
| M4-D44 | 10-06-26 | PROCESSO | Debiti FU non bloccano merge milestone | MATTEO | ORIGINATA | idem §5 | «debiti reali ma non cancelli di milestone» | blindatura |
| M4-D45 | 12-06-26 | AI-METODO | Un WP per sessione, niente fuori prompt | MATTEO | ORIGINATA | `MASTERPLAN_ALLINEAMENTO.md` regole | «Un WP per sessione. L'agente esegue solo il WP assegnato» | meta-wp |
| M4-D46 | 12-06-26 | PRODOTTO | B5: rimuovere check-slot fail-open | MATTEO | ORIGINATA | idem WP-B5 | «Decisione Matteo: rimuovere la chiamata client fail-open» | edge-safety |
| M4-D47 | 21-06-26 | AI-METODO | Masterplan Servizio governa, non implementa | CONGIUNTA | APPROVATA | `MASTERPLAN_SERVIZIO.md` header | «Questo file governa, non implementa.» | servizio-governance |
| M4-D48 | 21-06-26 | IMPOSTAZIONI | Config durata max 2 luoghi (D3) | MATTEO | ORIGINATA | idem vincoli | «Config in MASSIMO 2 luoghi (vincolo IA, non negoziabile)» | servizio-config |
| M4-D49 | 22-06-26 | PRODOTTO | Card vince su tipologia se più corta (D35) | MATTEO | CORRETTIVA | idem D35 | «respinta consapevolmente da Matteo — la card … deve comandare» | product-duration |
| M4-D50 | 24-06-26 | VENDITA | Vincolo GTM 10–15 clienti NON adottato | MATTEO | ORIGINATA | idem §9 | «non è un cancello: S4 può partire quando Matteo decide» | gtm-scope |
| M4-D51 | 31-05-26 | PRODOTTO | FU-021 tile Prenota annullato | MATTEO | CORRETTIVA | `FOLLOW_UP.md` FU-021 | «decisione Matteo 31-05-26: … sfondo full-page unico» | public-layout |
| M4-D52 | 06-08-26 | PRODOTTO | Elimina sala allinea a tavolo (no turno) | MATTEO | ORIGINATA | `FOLLOW_UP.md` FU-SERV-TURNO-SALA | «Decisione Matteo 06-08-26: vince il tavolo» | servizio-sale |
| M4-D53 | 06-08-26 | PRODOTTO | Badge capienza cascata uguale viste | MATTEO | ORIGINATA | `FOLLOW_UP.md` FU-SERV-BADGE | «Decisione Matteo 06-08-26 — cascata uguale» | servizio-badge |
| M4-D54 | 30-05-26 | AI-METODO | Comunicazione: sintetico, dettaglio on-demand | MATTEO | ORIGINATA | `COMUNICAZIONE_UTENTE_SKILL.md` | «perdo dettagli per troppi token … i dettagli li chiedo» | comunicazione |
| M4-D55 | 02-06-26 | AI-METODO | Output attesi nel prompt (anti scope creep) | MATTEO | ORIGINATA | `PREPARA_PROMPT_SKILL.md` | «niente output in più senza chiedere Sì/No prima» | prepara-prompt |
| M4-D56 | 31-05-26 | AI-METODO | Gate Prenota vs Menu QR su scroll/sfondo | MATTEO | CORRETTIVA | idem | «Confermi: è il link Prenota … o homepage Menu QR» | area-routing |
| M4-D57 | ? | SICUREZZA | PWA registerType prompt, mai autoUpdate | AGENTE | SCELTA | `PWA_CONTEXT.md` | «MAI tornare a autoUpdate» | pwa |
| M4-D58 | ? | FLUSSO | useFeatures unica fonte; no query edition | AGENTE | SCELTA | `DATA_FLOW_SKILL.md` | «Mai rifare query a organizations o tenant_features» | data-flow |
| M4-D59 | 12-06-26 | PROCESSO | Budget anno 1 ~1500–2500€ orientativo | CONGIUNTA | SCELTA | `LEGAL_STATE_CONTEXT.md` §Budget | «**~1.500–2.500€** il primo anno» | legal-budget |
| M4-D60 | 05-08-26 | COMPLIANCE | Brevo attivo; DPA/lista/PP da chiudere | AGENTE | CORRETTIVA | `LEGAL_STATE_CONTEXT.md` §Da decidere | «DPA Brevo da acquisire/verificare» | legal-brevo |

**IPOTESI↑A*/H* (peso 4):** M4-D06 motivazione normativa vs solo pushback senior; M4-D14/D15 Chi=AGENTE senza citazione «Matteo ha detto»; M4-D19 chi propose il taglio prezzo; M4-D27 drop 043 = Matteo vs cleanup agente; M4-D31 «decisi con Matteo» senza M-VOCE qui; M4-D40/D41 igiene path = agenti; M4-D57/D58 LOCK tecnici senza attribuzione Matteo nominata.

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| M4-A01 | M→A | DIRETTA | Intervista obbligatoria all'apertura di ogni sezione | accettata | `MASTERPLAN_BLINDATURA.md` §flusso |
| M4-A02 | M→A | DIRETTA | Classic in prod; Pro fuori da main | accettata | idem Confine 10-06 |
| M4-A03 | M→A | DIRETTA | Annulla tile Prenota (FU-021) → full-page | accettata | `FOLLOW_UP.md` FU-021 |
| M4-A04 | M→A | DIRETTA | Gate Prenota≠QR quando ambiguità scroll/sfondo | accettata | `PREPARA_PROMPT_SKILL.md` |
| M4-A05 | M→A | DIRETTA | Skill vietano «aggiustare» sticky/contatori/nome QR | accettata | `PRENOTA_SKILL` §3; `MENU_QR_SKILL` §3 |
| M4-A06 | M→A | DIRETTA | D35: rifiuta «tipologia non accorcia mai» | accettata | `MASTERPLAN_SERVIZIO.md` D35 |
| M4-A07 | M→A | DIRETTA | GTM 10–15 clienti non è cancello | accettata | idem §9 |
| M4-A08 | A→M | DEDOTTA | Senior declassa GDPR da bloccanti → Matteo ratifica percorso | accettata | `LEGAL_STATE` §DA FARE + «decisioni Matteo» |
| M4-A09 | A→M | DEDOTTA | Senior taglia Pro 79→69 e fondatori 6 mesi | accettata | `EDITION_PRICING` header |
| M4-A10 | A→M | DEDOTTA | Agente propone Privacy React / DPA template → documentato come Decisione | accettata | `LEGAL_STATE` Decisioni 23-05 |
| M4-A11 | M↔M | DIRETTA | Zero commissioni ↔ listino Classic/Pro/add-on QR | accettata | `EDITION_PRICING` + `MASTERPLAN_SERVIZIO` guerra TheFork |
| M4-A12 | M↔M | DEDOTTA | INC-03 preset QR «posticipato» → poi drop 043 | ignota | `MENU_QR_DATA_FLOW` vs §3-bis |
| M4-A13 | M→A | DIRETTA | Elimina sala non brucia turno (allinea a tavolo) | accettata | `FOLLOW_UP` FU-SERV-TURNO-SALA 06-08 |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza | Contro-evidenza (sez.4) | Nota |
|-------|---------------------|----------|-------------------------|------|
| legal-vendita / pricing-posizionamento | L4 | M4-D01, D18–D22, D20 | P.IVA/contratto ancora ⬜ | Intervista 12-06 → listino + priorità vendita |
| legal-metodo (docs in repo, no SaaS privacy) | L4 | M4-D12, D13 | Bozze legali ancora da avvocato | Codificato in LEGAL_STATE + COOKIE |
| product-scoping QR multipli / no content_type | L4 | M4-D25–D27 | Drop 043 può essere cleanup | Regola in skill + migr.043 |
| public-layout Prenota (cap, XOR, sticky, striscia) | L4 | M4-D32–D35, D51 | Attribuzione a blocco §3, non voce | PRENOTA_SKILL §3 = regola riusata |
| product-auto-select card singola | L4 | M4-D37 | — cercata in perimetro, non trovata | LAYOUT + DATA_FLOW LOCK |
| product-capabilities intolleranze universali | L4 | M4-D36 | Possibile CONGIUNTA con FU-036 | §3-bis «scelta deliberata» |
| blindatura (intervista + Classic prod) | L4 | M4-D42–D44 | M5 Pro ancora ⬜; FU aperti | MASTERPLAN_BLINDATURA |
| area-routing Prenota≠QR≠magazzino | L4 | M4-D39, D56 | Errore 31-05 che ha generato il gate | PREPARA + MINI |
| prepara-prompt / comunicazione | L4 | M4-D54–D56 | — | File root = regole operative |
| legal-gdpr-priorità | L3 | M4-D06, A08 | Ancora bozze non operative | Dopo pushback senior |
| env-region / brand PrenotaZen | L3 | M4-D07, D11 | Region stale in SUPABASE_PRODUCTION_CONFIG | Conferme in sessione |
| servizio-governance (D35, GTM, config 2 luoghi) | L3 | M4-D48–D50 | Header masterplan ancora ⬜ | Decisioni datate |
| cookie no-banner | L3 | M4-D13 | — | COOKIE_CONTEXT |
| marketing-flags / data-flow edition | L2 | M4-D23, D58 | — | Più agente che Matteo |
| legal-bozze / privacy React layout | L2 | M4-D14–D17 | — | Delega all’agente |
| legal-retention / Brevo chiusura | L0–L1 | M4-D60 | Incompletezza esplicita | Aperto con avvocato |

**Confronto Cursor skill `calendarbackup-legal-production`:** è un **puntatore** («Questa skill è solo un puntatore stabile»). Le decisioni GDPR/vendita/prezzi/banner/Ireland/PrenotaZen vivono nei docs e sono attribuite a Matteo (23-05 / 12-06) o a revisioni senior + ratifica. **Matteo ha originato/approvato il merito; l’agente ha originato struttura file/LOCK/workflow.** Stesso schema Marketing.

**per-ui-design-skill:** 3 stub (Prenota layout path, form config path, Menu admin) → rimandi. Regole vive UI_EDIT / RESPONSIVE / THEME / STYLING = processo **agente**, quasi senza «Matteo» nominato.

---

## Sezione 4 — Contro-evidenze

1. **P.IVA / contratto / fattura ancora ⬜** (M4-D02–D05): ha deciso priorità, non ha chiuso gli adempimenti — skill di scoping, non di esecuzione legale completa.
2. **Bozze `docs/legal/*` = v0.1** (M4-D17): ToS, registro, runbook, sub-processors restano «da professionista».
3. **Email privacy@ rimandata** (M4-D10): workaround Gmail personale.
4. **Brevo / retention aperti** (M4-D60): app già invia email; documenti e cleanup non chiusi. Sintesi `sub-processors`/`registro` (15-06) possono essere **stale** rispetto a LEGAL_STATE 05-08.
5. **Region stale:** `SUPABASE_PRODUCTION_CONFIG.md` ancora «DA VERIFICARE» vs Ireland confermata (M4-D11).
6. **MASTERPLAN_SERVIZIO header ⬜** vs corpo S0–S4 avanzati e SESSION_LOG agosto su chiusura capitolo — **stato dichiarato incoerente** (contro-evidenza su «masterplan sempre aggiornati»).
7. **MASTERPLAN_ALLINEAMENTO:** WP tutti ✅ ma **ri-audit ≥95% non documentato** come eseguito.
8. **MASTERPLAN_BLINDATURA:** M5 Pro ⬜, M6 🔶; note FU §5 più vecchie di `FOLLOW_UP.md`.
9. **STATO_BLINDATURA_CHECKLIST** fermo 17-06; **Plan-Completamento** fermo 15-06 — tracking meno affidabile di FOLLOW_UP/SESSION_LOG.
10. **Drop content_type (M4-D27):** §2-bis Matteo (QR multipli); §3-bis non dice «Matteo ha chiesto il DROP» — possibile CORRETTIVA agente su codice morto (confermare A5).
11. **«Scelte di Matteo» a blocco** in PRENOTA/MENU_QR §3: attribuzione di sezione, non citazione M-VOCE per ogni bullet — da falsificare in H*/A*.
12. **Cercata contro-evidenza su L4 card singola / zero commissioni / no cookie banner:** in questo perimetro **non trovata** inversione; restano aperti solo i limiti di peso 4 (manca transcript).

---

## Sezione 5 — Copertura dichiarata

| Voce | Valore |
|------|--------|
| File nel perimetro | **60** |
| File aperti | **60** |
| % | **100%** |
| File illeggibili/saltati | **0** |

### Conteggi per cartella (find)

| Cartella / gruppo | Attesi | Aperti |
|-------------------|--------|--------|
| `docs/Legal-Production-Skill/` | 11 | 11 |
| `docs/legal/` | 4 | 4 |
| `docs/Marketing-Skill/` | 5 | 5 |
| `docs/per-ui-design-skill/` | 12 | 12 |
| `docs/Prenota-Skill/` | 7 | 7 |
| `docs/Menu-QR-Skill/` | 7 | 7 |
| Root docs (14 file elencati, esclude `APP_CONTEXT_SKILL.md`) | 14 | 14 |
| **Totale** | **60** | **60** |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Chi ha proposto Pro 69€ e fondatori 6 mesi (senior vs Matteo) | A7 (12-06 report legale-vendita) + H3 |
| Drop migr.043: mandato Matteo o cleanup agente? | A5 (06-06 blindatura QR) |
| Citazioni M-VOCE dietro ogni bullet «Scelte di Matteo» §3 Prenota/QR | H2/H3 |
| Card singola 04-08: transcript vs solo skill | A11 + H3 |
| Masterplan Servizio: quanto del corpo ✅ è reale in git/PROD | J1 + A10/A11 |
| Brevo: quando è diventato «attivo» vs bozze 15-06 che dicono altrimenti | A8 + LEGAL_STATE storia 05-08 |
| Confrontare listino con decisioni in Console/Admin (M2/M3) | M2, M3 |
| `calendarbackup-legal-production` vs G1 Documenti Legali privati | G1 (senza copiare contratti) |

---

## Sezione 7 — Chiusura verso Matteo

In questa fetta di documenti emergono soprattutto due cose tue: **come vuoi vendere** (Italia, zero commissioni, Classic in produzione e Pro fuori, prezzi del 12 giugno) e **cosa è voluto sulle pagine pubbliche** (Prenota e Menu QR), così gli agenti non «sistemano» sticky, contatori o nomi QR.

I tre masterplan in root sono piani di governo scritti con te: Blindatura e Allineamento dichiarano Classic chiuso; Servizio è ancora a metà e l’intestazione del file non è aggiornata come il lavoro di agosto.

Sul legale hai deciso metodo e priorità (niente banner, documenti in repo, GDPR dopo il primo mese), ma P.IVA, contratto firmato e pezzi Brevo restano aperti — scoping fatto, chiusura professionista ancora da fare.
