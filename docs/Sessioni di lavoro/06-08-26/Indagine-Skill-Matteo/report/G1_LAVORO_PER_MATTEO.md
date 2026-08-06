# G1 — `_lavoro/Per matteo/` (materiale privato)

> **Ondata:** G1 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** 3 (report/guide scritte con/per Matteo); eccezione **PROFILO_SCOLASTICO** = auto-dichiarazione → peso **1** per «cosa dice di sé», peso **4** per «cosa sa fare» (piano §2 linea G). Non confondere le due colonne.
> **Perimetro:** `docs/_lavoro/Per matteo/` = **51 file** .md (conteggio Shell 06-08-26; coincide con P0).
> **Tracciamento git:** 10/51 file tracciati (`git ls-files`); `Scuola/` 0/6 — davvero privata. Vedi P0 §7.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| G1-D01 | 04-06-26 | FORMAZIONE | Scuola continua via chat senior | MATTEO | ORIGINATA | `Scuola/PIANO_SISTEMA_DIDATTICO.md` L8 | «Origine: idea di Matteo, sessione senior 04-06-26» | didactic-system |
| G1-D02 | 04-06-26 | FORMAZIONE | Focus primario = metodo lavoro con AI | MATTEO | ORIGINATA | `Scuola/PROFILO_SCOLASTICO.md` L14-15 | «Focus primario richiesto: metodo di lavoro con AI» | ai-method-learning |
| G1-D03 | 04-06-26 | FORMAZIONE | Apprendimento just-in-time dal problema chat | MATTEO | ORIGINATA | `PROFILO_SCOLASTICO.md` L15-17 | «just-in-time — la lezione nasce dal problema reale» | jit-learning |
| G1-D04 | 04-06-26 | FORMAZIONE | Tre sessioni: progetta ≠ raccogli ≠ costruisci | MATTEO | ORIGINATA | `PIANO_SISTEMA_DIDATTICO.md` L20-22 | «Tre lavori separati, tre sessioni» | separation-of-concerns |
| G1-D05 | 04-06-26 | FORMAZIONE | Parti micro, cresci sui dati (anti over-eng) | CONGIUNTA | APPROVATA | `PIANO` L14-16; `PROFILO` L22-23 | «Parti micro, cresci sui dati» | anti-overengineering |
| G1-D06 | 04-06-26 | FORMAZIONE | Materiale didattico reale, non inventato | MATTEO | ORIGINATA | `PIANO` L17-19; prompt gemello | «Materiale didattico REALE» | source-integrity |
| G1-D07 | 04-06-26 | FORMAZIONE | Sezione «Lezione della chat» a 5 punti | MATTEO | ORIGINATA | `PIANO` L139-143 | «Richiesta esplicita di Matteo (04-06-26)» | lesson-of-chat |
| G1-D08 | 04-06-26 | FORMAZIONE | Distingui risposte guidate (a) vs idee autonome (b) | MATTEO | ORIGINATA | `PIANO` L151-157 | «Distingui sempre due tipi (Matteo, 04-06-26)» | generate-vs-apply |
| G1-D09 | 04-06-26 | FORMAZIONE | Salto-lezione tracciato se rifiuta | MATTEO | ORIGINATA | `PROFILO` L60-61 | «meccanismo del salto-lezione tracciato… nato da lui» | lesson-tracking |
| G1-D10 | 04-06-26 | FORMAZIONE | File Scuola self-contained; passa a mano | MATTEO | ORIGINATA | `PIANO` L185-189 | «Matteo ha scelto (04-06-26) di passare… a mano» | privacy-docs · self-contained |
| G1-D11 | 04-06-26 | AI-METODO | Intro termini in grassetto = soft, non hook | CONGIUNTA | SCELTA | `PIANO` L89-92 | «governance soft, non hook» | soft-vs-enforcement |
| G1-D12 | 04-06-26 | FORMAZIONE | Scala livelli: Sento→So spiegare→Lo uso→Lo insegno | CONGIUNTA | APPROVATA | `PROFILO` L7; `PIANO` L96-97 | «Sento → So spiegare → Lo uso → Lo insegno» | skill-level-scale |
| G1-D13 | 04-06-26 | FORMAZIONE | Tre file vivi: Profilo / Glossario / Roadmap | CONGIUNTA | APPROVATA | `PIANO` L50-54 | «PROFILO_SCOLASTICO… GLOSSARIO_VIVO… ROADMAP_SKILL» | didactic-architecture |
| G1-D14 | 04-06-26 | FORMAZIONE | Auto-dichiarazione: principiante, no tech formale | MATTEO | ORIGINATA | `PROFILO` L13 | «principiante, nessuna competenza tecnica formale» | self-assessment · PESO1 |
| G1-D15 | 04-06-26 | FORMAZIONE | Prompt agente esterno per fonti canoniche | MATTEO | ORIGINATA | `PROMPT_RACCOLTA_MATERIALE_DIDATTICO.md` | «materiale didattico reale e professionale, non inventato» | didactic-sourcing |
| G1-D16 | 19-06-26 | TESTING | Checklist flussi da testare a mano (file vivo) | MATTEO | ORIGINATA | `Test e2e/_INDICE.md` L3-4 | «Sistema deciso il 19-06-26» | qa-human-checklist |
| G1-D17 | 19-06-26 | TESTING | Archivia solo se conferma esplicita di Matteo | MATTEO | ORIGINATA | `_INDICE.md` L34-36 | «Entra in archivio solo se… conferma esplicita di Matteo» | acceptance-ownership |
| G1-D18 | 19-06-26 | TESTING | Escluso QA Playwright agenti senza sua conferma | MATTEO | ORIGINATA | `_INDICE.md` L36 | «Escluso: QA Playwright degli agenti… senza tua conferma» | acceptance-ownership |
| G1-D19 | 20-06-26 | TESTING | Controtest visivo PRN-04 e ADM-FORM-01 | MATTEO | APPROVATA | `_INDICE.md` L5; AREA_A/B | «controtestati visivamente da Matteo e archiviati» | hands-on-qa |
| G1-D20 | 19-06-26 | TESTING | Viewport obbligatori 375 / 834 / 1280 | CONGIUNTA | APPROVATA | `CHECKLIST_FLUSSI` L5; legenda | «Viewport: 📱 375 · 💻 834 · 🖥️ 1280» | multi-viewport-qa |
| G1-D21 | ? | TESTING | Blindatura Prenota = LIVE in produzione (M0) | CONGIUNTA | APPROVATA | `Verifica Blindatura - Pagina Prenota/00-PANORAMICA.md` L5 | «blindata e LIVE in produzione (milestone M0)» | blindatura-prodotto |
| G1-D22 | 06-06-26 | TESTING | Blindatura Menu QR di prodotto | CONGIUNTA | APPROVATA | `Verifica Blindatura - Menu QR/00-PANORAMICA.md` L5 | «blindato di prodotto (06-06-26)» | blindatura-prodotto |
| G1-D23 | 16-06-26 | TESTING | Admin Classic 5 sezioni blindate; Pro fuori | CONGIUNTA | APPROVATA | `Verifica Blindatura - Admin/00-PANORAMICA.md` | «5 sezioni Admin blindate (Classic…)» | release-scope |
| G1-D24 | ? | TESTING | Manuale residuo: swipe/asset/estetico | CONGIUNTA | APPROVATA | Prenota `00-PANORAMICA` «NON sono coperti» | «li guardi tu»: gesto carosello, resa estetica | qa-residual-manual |
| G1-D25 | ? | TESTING | Criterio pass = «cosa fai → vedi questo» | MATTEO | ORIGINATA | `VERIFICA-IN-DEV.md` (tutte e 3) | «cosa fai → cosa DEVE succedere (= pass)» | acceptance-criteria |
| G1-D26 | ? | PROCESSO | Comandi E2E/Vitest/seed per operare senza agente | MATTEO | ORIGINATA | `Comandi/E2E Comandi Matteo.md` L3 | «Serve a lanciare i test browser… e capire se sono passati» | ops-autonomy |
| G1-D27 | ? | SICUREZZA | Seed/SQL/Brevo solo su TEST, mai PROD | MATTEO | APPROVATA | `Comandi Gestione Utenti DB.md` L11-14; Brevo L3 | «solo sul progetto TEST… se… PROD, fermati» | env-safety |
| G1-D28 | 16-06-26 | SICUREZZA | SQL utenti/edition testati sul DB TEST | CONGIUNTA | APPROVATA | `Comandi Gestione Utenti DB.md` L9 | «testati davvero sul DB TEST il 16-06-26» | db-ops |
| G1-D29 | 12-06-26 | VENDITA | Mercato solo Italia per ora | MATTEO | ORIGINATA | `Analisi Fable/Report-analisi-legale-vendita` L4 | «mercato solo Italia per ora» | go-to-market |
| G1-D30 | 12-06-26 | VENDITA | Vendita mista: diretta poi self-service | MATTEO | ORIGINATA | stesso report L4 | «vendita mista (diretta… self-service poi)» | go-to-market |
| G1-D31 | 12-06-26 | VENDITA | Nessuna attività aperta (pre-lancio) | MATTEO | ORIGINATA | stesso report L4 | «nessuna attività aperta» | commercial-stage |
| G1-D32 | 12-06-26 | VENDITA | Proposta prezzi Classic/Pro/add-on (da approvare) | AGENTE | DELEGATA | stesso report §Parte 2; Masterplan AL-F | «se approvi»; WP-F1 gated su Matteo | pricing · IPOTESI |
| G1-D33 | 12-06-26 | VENDITA | Zero commissioni a coperto come posizionamento | AGENTE | APPROVATA | Mini-campagna L9-16 | «Le prenotazioni… senza commissioni» | positioning · IPOTESI |
| G1-D34 | 12-06-26 | LEGALE | Bloccanti: P.IVA, ToS B2B, fattura elettronica | AGENTE | APPROVATA | Report legale-vendita §1 | «non puoi vendere senza i primi 3» | legal-readiness · IPOTESI |
| G1-D35 | 23-05-26 | LEGALE | DPA Supabase firmato (copia in Legali) | MATTEO | APPROVATA | `Cose-da-fare-per-produzione.md` L14 | «DPA Supabase firmato (2026-05-23)» | compliance-execution |
| G1-D36 | 23-05-26 | LEGALE | Distinzione DPA Supabase ≠ DPA verso ristoranti | CONGIUNTA | APPROVATA | `Cose-da-fare` L16 | «NON è il modulo da girare ai clienti ristoranti» | processor-chain |
| G1-D37 | 23-05-26 | SICUREZZA | MFA + leaked password + key ruotata | MATTEO | APPROVATA | `Cose-da-fare` L12-17 | checklist «Già fatto» | prod-hardening |
| G1-D38 | 23-05-26 | PROCESSO | Repo pubblica nuova senza `docs/` interni | MATTEO | APPROVATA | `Cose-da-fare` L44; `GUIDA-repo-pulito` | «Nuova repository pulita, senza docs/» | release-hygiene |
| G1-D39 | 12-06-26 | AI-METODO | Masterplan allineamento: 1 WP/sessione, 6 campi | MATTEO | ORIGINATA | `Analisi Fable/Masterplan-allineamento…` L18-22 | «Un WP per sessione, mai due» | mediocre-proof-wp |
| G1-D40 | 12-06-26 | AI-METODO | AL-F prezzi/legale solo dopo decisione Matteo | MATTEO | ORIGINATA | Masterplan L37 | «gated su decisioni Matteo» | decision-gates |
| G1-D41 | 12-06-26 | TESTING | Priorità fix: drift migrazioni + lettura cross-tenant | AGENTE | APPROVATA | `Report-analisi-solidita` §5 | «5 azioni più urgenti» | security-prioritization · IPOTESI |
| G1-D42 | 12-06-26 | AI-METODO | Piano pulizia skill A/B/C da autorizzare | AGENTE | DELEGATA | `Report-analisi-skill-system` L8-9 | «decidere quali fasi… autorizzare» | skill-slim · IPOTESI |
| G1-D43 | mag-26 | PRODOTTO | Roadmap competitive Fase 1–4 (email, CRM, WA…) | INCERTO | APPROVATA | `Upgrade-da-Fare/Potenziamento_APP.md` | «Roadmap per eguagliare… la concorrenza» | product-roadmap · IPOTESI |
| G1-D44 | ? | PRODOTTO | Super-admin edition: bassa priorità finché pochi tenant | MATTEO | ORIGINATA | `Upgrade-da-Fare/UI-super-admin-edition.md` L3-4 | «Priorità: bassa finché gestisci 5-20 tenant» | console-deferral |
| G1-D45 | ? | UI-UX | Brief coppia sfondo Prenota landscape+portrait | MATTEO | ORIGINATA | `PROMPT-sfondo-pagina-prenota-full-page.md` | «COPPIA di sfondi… NON stesso file ridimensionato» | asset-briefing |
| G1-D46 | 06-08-26 | PROCESSO | Ripresa: Servizio + indagine skill (questo cantiere) | MATTEO | ORIGINATA | `Da dove riprendere.md` | «test che DEVO fare io… albero skills» | work-prioritization |
| G1-D47 | ? | TESTING | Query SQL Studio per controverifica dati | MATTEO | APPROVATA | `GUIDA_USO_QUERIES_CONTROVERIFICA.md` L1 | «Query SQL per debug e controverifica» | data-controverifica |
| G1-D48 | ? | COMPLIANCE | Esiste template DPA verso ristoranti (path only) | CONGIUNTA | APPROVATA | `Documenti Legali/DPA-template-clienti-ristoranti.md` | *(sintesi: template DPA clienti presente; testo non citato)* | dpa-clients |
| G1-D49 | ? | COMPLIANCE | Esiste copia DPA User Supabase (path only) | MATTEO | APPROVATA | `Documenti Legali/Supabase User DPA…md` | *(sintesi: DPA firmato archiviato; testo non citato)* | dpa-supabase |
| G1-D50 | ? | VENDITA | Analisi costi/IVA: prezzo basso poco sostenibile | AGENTE | APPROVATA | `Valutazione prezzo vendita/Analisi costi IVA.md` | «un prezzo troppo basso può diventare poco sostenibile» | pricing-sustainability · IPOTESI |
| G1-D51 | 31-05-26 | TESTING | Revoca OK falso su footer QR (era Prenota) | MATTEO | CORRETTIVA | `AREA_F_menu_qr.md` coda | «segnato OK per errore; problema era su Pagina Prenota» | acceptance-correction |
| G1-D52 | 29-05-26 | TESTING | Non archiviare promo multi-tipologia (mai confermato) | MATTEO | ORIGINATA | `AREA_B` nota finale | «mai confermato da Matteo» | acceptance-ownership |
| G1-D53 | 19-06-26 | TESTING | Fix 9 disiscrizione marketing = pending decisione | MATTEO | SCELTA | `CHECKLIST_FLUSSI` L17 | «Pending decisione: fix 9 disiscrizione marketing» | decision-deferral |

### Confronti richiesti dal prompt

**PROFILO_SCOLASTICO (G1) vs copia Archives/trading (E1):** non sono lo stesso file. Hash diversi (G1 3359 B / E1 1979 B). G1 = CalendarBackup, scala `Sento→Lo insegno`, lezione 04-06 già registrata, focus metodo AI. E1 = scaffold Trade Analyst 06-06-26, «nessuna lezione ancora», scale diverse. Stesso *pattern* (pagella didattica), progetti e contenuti distinti → handoff a E1/S3.

**Blindatura di Matteo vs criteri agenti (M1 CONTROVERIFICA):** le checklist G1 sono **accettazione umana prodotto** («cosa vedi a schermo», viewport, «solo se l’ho testato io»). CONTROVERIFICA M1 è **qualità del lavoro agenti** (allineamento ai prompt, scope creep, chi-fa≠chi-verifica). I suoi criteri sono **più severi sull’evidenza umana**: Playwright verde senza sua conferma **non** entra in archivio (G1-D17/D18). Dove sono più severi i suoi: ownership dell’accettazione, residuo estetico/gesto, revoche di OK falsi (G1-D51).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| G1-A01 | M→A | DIRETTA | Impone distinzione (a) applica vs (b) genera nella lezione | accettata | `PIANO` §6-bis |
| G1-A02 | M→A | DIRETTA | Inventa salto-lezione tracciato (non proposto dall’agente) | accettata | `PROFILO` L60-61 |
| G1-A03 | M→A | DIRETTA | Criterio archivio: solo sue conferme, no QA agente | accettata | `_INDICE` L34-36 |
| G1-A04 | M→A | DIRETTA | Revoca accettazione footer Menu QR (area sbagliata) | accettata | `AREA_F` nota |
| G1-A05 | M→A | DIRETTA | Masterplan: 1 WP/sessione; non adattare a intuito | accettata | Masterplan L18-24 |
| G1-A06 | M→A | DIRETTA | AL-F prezzi/legale gated su sua decisione | accettata | Masterplan L37 |
| G1-A07 | A→M | DIRETTA | Corregge sintassi CLI SSL che un agente aveva dato sbagliata | accettata | `Cose-da-fare` L38 |
| G1-A08 | A→M | DIRETTA | Spiega DPA Supabase ≠ DPA da dare ai ristoranti | accettata | `Cose-da-fare` L16 |
| G1-A09 | A→M | DIRETTA | Segnala scope creep come da sorvegliare | parziale | `PROFILO` L26; `PIANO` esempio |
| G1-A10 | A→M | DIRETTA | Ribattezza «resolver» → Data Mapper (nome canonico) | accettata | `FONTI_DATABASE…` §4; `GLOSSARIO` |
| G1-A11 | A→M | DIRETTA | Finding ALTI solidità (drift migrazioni, settings anon) | ignota | Report solidità — priorità proposta, esito decisione non in G1 |
| G1-A12 | M↔M | DIRETTA | Auto-sorveglianza scope creep (sa di allargare a metà) | parziale | `PROFILO` L26 |
| G1-A13 | M↔M | DEDOTTA | Dichiarato «principiante» ma esercita QA/ops estese | ignota | tensione D14 vs archivi Test/Comandi — da S3/S4 |
| G1-A14 | A→M | DIRETTA | Skill system 76% allineato; routing coperti fallisce | ignota | Report skill — piano A/B/C in attesa ok |

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in G1 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| didactic-system / lesson-of-chat | **L3** (ha corretto/guidato il metodo valutativo) | G1-D07–D09, G1-A01–A02 | Cercata: coda richiami vuota; Profilo non aggiornato dopo 04-06 → sistema progettato più che agito (↓ verso L2 se S3 conferma) |
| generate-vs-apply | **L3** | G1-D08, G1-A01 | Cercata in perimetro: solo una sessione lezione registrata |
| hands-on-qa / acceptance-ownership | **L3** | G1-D16–D20, archivi AREA_A–F, G1-A03–A04 | Contro: voci ancora ☐ in checklist viva; promo multi-tipologia mai confermata |
| blindatura-prodotto | **L2** | G1-D21–D25 + VERIFICA-IN-DEV | Contro: Pro (Servizio/CRM/Analytics) esplicitamente non blindati; email E2E non coperta |
| ops-autonomy (E2E/seed/SQL/porte) | **L2** | cartella Comandi intera | Contro: guide scritte *per* lui (spesso da agenti); prova di esecuzione diretta → H*/J1 |
| env-safety | **L2** | G1-D27, Brevo, Utenti DB | Contro: checklist SSL/PITR ancora aperti in produzione |
| go-to-market / positioning | **L1–L2** | G1-D29–D33 | Contro: prezzi non approvati (AL-F); «nessuna attività aperta» |
| legal-compliance awareness | **L1** (esecuzione parziale L2 su DPA firmato) | G1-D34–D37, Documenti Legali path | Contro: ToS/P.IVA/fattura ancora bloccanti secondo analisi |
| product-roadmap | **L1** | Potenziamento_APP, Upgrade super-admin | Contro: priorità bassa / molte feature ancora da fare; chi ha originato il piano = INCERTO |
| pricing-sustainability | **L0–L1** | Analisi costi IVA + report Fable | Contro: cifra prodotti proposte da agente, non ratificate |
| self-assessment (dichiarato) | **PESO1 solo** | G1-D14 | **Non** usare come prova di competenza (peso 4 vietato) |
| mediocre-proof-wp | **L2** | G1-D39 | Contro: masterplan è plan Cursor; esecuzione WP non in questo perimetro |

> **Regola L3/L4:** per didactic-system e hands-on-qa la contro-evidenza è dichiarata sopra (sistema poco esercitato dopo il design; checklist ancora aperta). Nessuna skill L4 in questo perimetro: le regole «blindatura / accettazione umana» vivono qui come guide private, non ancora dimostrate come VOCABOLARIO codificato (quello è M1).

---

## Sezione 4 — Contro-evidenze

1. **Dichiarato vs esercitato:** `PROFILO` dice «principiante, nessuna competenza tecnica formale» (peso 1), mentre Test e2e + Blindatura + Comandi mostrano collaudi multi-viewport, seed DB, SQL edition, E2E headed/debug — tensione centrale per S3/S5 (non risolvere qui inventando un livello).
2. **Sistema didattico progettato, poco agito:** coda spaced-repetition vuota; Glossario tutto `🌱 in apprendimento`; storico richiami vuoto; una sola «Lezione della chat» (04-06).
3. **Scope creep:** annotato come tratto da sorvegliare (PROFILO + esempio PIANO) — non negato.
4. **Accettazioni incomplete:** checklist viva con 6 voci ☐; editor promo multi-tipologia «mai confermato»; fix marketing disiscrizione in pending.
5. **OK revocato:** footer Menu QR accettato per errore (era Prenota) — prova che anche lui può certificare male.
6. **Go-to-market incompleto:** prezzi e AL-F esplicitamente in attesa; analisi legale elenca bloccanti non chiusi; «nessuna attività aperta».
7. **Produzione:** SSL enforcement, PITR, upgrade piano Supabase ancora checklist aperti (dopo DPA/MFA fatti).
8. **Analisi solidità 12-06:** finding ALTI su drift migrazioni e lettura anon cross-tenant — proposta agente, esito di priorità di Matteo non documentato in G1.
9. **Duplicato campagna:** `Mini-campagna-vendita-12-06-26.md` sia in Analisi Fable sia in Valutazione prezzo — rischio di due fonti.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro | **51** (Shell `Get-ChildItem -Recurse -File` su `docs\_lavoro\Per matteo`, 06-08-26) |
| File aperti | **51 (100%)** |
| Regime | scavo su tutti; Documenti Legali + Analisi costi IVA letti in **sola consapevolezza** (path + sintesi, nessun testo contrattuale/cifre cliente nel report) |
| File illeggibili / saltati | **0** |
| Scomposizione | Scuola 6 · Test e2e 8 · Comandi 5 · Analisi Fable 5 · Documenti Legali 3 · Valutazione prezzo 2 · Upgrade 2 · Verifica Blindatura ×3 = 12 · root guide 8 |

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Parole sue su Scuola / «principiante» / prezzi approvati o no | **H2–H3** (giugno) |
| Se i fix solidità ALTI sono stati fatti davvero | **J1** + **A7/A8** (sessioni post 12-06) |
| Confronto completo PROFILO trading vs CB | **E1** (già notato: file diversi) |
| Sessioni maggio precoce prima del log pubblico | **G2** |
| Supporto: come vuole essere spiegato | **G3** |
| Se le checklist Blindatura sono più severe di Testing-Skill ufficiale | **M3** (Testing-Skill) + **S5** |
| Cluster ritratto: auto-dichiarazione vs QA esercitata | **S3, S5** |
| Falsificare L3 didactic / hands-on-qa | **S4** |

---

## Sezione 7 — Chiusura verso Matteo

In questa cartella privata hai costruito due cose diverse: una **scuola** (come vuoi imparare e come l’agente deve valutarti) e un **banco di collaudo** (checklist a video, comandi terminali, blindature Prenota/Admin/Menu QR).  
La pagella scolastica ti descrive ancora come principiante sul metodo AI, ma gli archivi di test a video dicono che sulla pagina prenotazioni e sull’admin hai già spuntato tu, a occhio, decine di flussi — le due storie vanno tenute separate.  
Su vendita e legale hai fatto fare analisi e hai firmato il pezzo Supabase; prezzi e partita IVA restano decisioni tue ancora aperte, non chiuse da un agente.
)
