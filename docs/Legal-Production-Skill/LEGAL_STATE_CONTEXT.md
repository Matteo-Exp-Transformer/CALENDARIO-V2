# Stato compliance — CalendarBackup-v2

> Aggiornato: **2026-06-12** (WP-F2 — intervista vendita Italia)
> Single source of truth per "cosa è fatto / cosa manca" lato legale.
> Aggiornare SEMPRE dopo ogni sessione di questa skill.

⚠️ **Disclaimer:** questo file è **analisi orientativa** da sviluppatore senior. **Non sostituisce** commercialista né avvocato. Prima del primo contratto firmato e del primo incasso, validare ogni voce bloccante con i professionisti.

Fonte analisi vendita: `docs/Sessioni di lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md`.

---

## Vendita in Italia — sintesi priorità (decisioni Matteo 12-06-26)

### BLOCCANTI (prima del 1° cliente pagante / 1° incasso)

| Voce | Stato | Percorso approvato |
|------|-------|-------------------|
| **Partita IVA** | ⬜ Da aprire | **Ipotesi forfettario** (report 12-06-26) — **da confermare con commercialista** prima del 1° incasso |
| **Contratto B2B** (Termini di Servizio / abbonamento) | ⬜ Da creare | **Bozza template in repo** → revisione **avvocato** (~500–1.000€ una tantum). Recesso: **mensile disdicibile sempre**; annuale con **30 gg preavviso** |
| **Fatturazione elettronica** | ⬜ Da attivare | Strumento **gratuito ADE** (Agenzia delle Entrate) |

### DA FARE ENTRO IL PRIMO MESE DI ATTIVITÀ (non bloccano la 1ª vendita)

> Revisione 12-06-26 (post-analisi senior): questi tre adempimenti GDPR erano stati segnati «bloccanti». **Declassati a «entro il primo mese»**: il GDPR li richiede in tempi ragionevoli, non come precondizione al primo contratto. I veri blocchi pre-vendita restano i tre sopra (P.IVA, contratto, fattura elettronica). Evita di rimandare la prima vendita per carte che la norma non pretende prima dell'incasso.

| Voce | Stato | Percorso approvato |
|------|-------|-------------------|
| **Registro trattamenti art. 30 GDPR** | ⬜ Da creare | Sessione **agente senior** (bozza) → passaggio **commercialista** |
| **Runbook data breach** | ⬜ Da creare | Stesso percorso (senior → commercialista) |
| **Lista sub-processor pubblica** (`docs/legal/sub-processors.md`) | ⬜ Da pubblicare | Stesso percorso (senior → commercialista) |

### CONSIGLIATI (non bloccano il 1° contratto se sopra è chiuso)

| Voce | Stato | Nota |
|------|-------|------|
| **Marchio «PrenotaZen»** | ⬜ Da depositare | Logo GPT già in app (login admin + header — asset `icons/Icona-per-adminPage-no-bg.png`); uso commerciale con scritta **PrenotaZen**. Prima di materiale stampato: **ricerca TMview** + deposito **UIBM** ~200€ fai-da-te |
| **RC professionale + cyber** | ⬜ Da valutare | ~300–600€/anno — consigliata prima di scalare clienti |
| **European Accessibility Act (EAA)** | ℹ️ Informativo | Microimpresa esente obbligo legale; pagine **Prenota** e **Menu QR** usate dai consumatori → **argomento vendita** (accessibilità come plus) |
| **Email `privacy@<dominio>`** | ⏸️ Rimandata | Contatto privacy temporaneo: **matteo.sistemigestionali@gmail.com** |

### Budget indicativo anno 1 (orientativo)

**~1.500–2.500€** il primo anno: commercialista (P.IVA + consulenza) + avvocato contratto una tantum + fatturazione elettronica (ADE gratis; eventuale commercialista) + eventuale deposito marchio UIBM.

Mercato dichiarato: **solo Italia** per ora (vendita mista: diretta all'inizio, self-service in seguito).

---

## Stato per fase (tecnico / GDPR)

### FASE 0 — Sicurezza tecnica DB ✅
- [x] Audit sicurezza prod (2026-05-23) — migrazione `026_security_hardening`
- [x] FORCE RLS su tabelle PII
- [x] Service role key ruotata (2026-05-23)
- [x] Leaked password protection ON
- [x] MFA owner Supabase
- [x] Rate limit pubblico stretto (2026-05-23) — max 3 richieste/min, ban 24h dopo 2 sforamenti (migrazione `027_ip_blacklist`)

### FASE 1 — DPA Supabase ✅
- [x] DPA richiesto a Supabase (2026-05-23)
- [x] DPA compilato e firmato (2026-05-23) — Doc Ref: `Q4RYF-5FVPD-4LXZY-8JABB`
- [x] Copia salvata in `docs/_lavoro/Per matteo/Documenti Legali/Supabase User DPA (March 12, 2026) (1).md`
- [x] Versione testo: August 5, 2025
- [x] Sub-processor accettati: Supabase Pte. Ltd, Postmark (ActiveCampaign), AWS, e altri elencati in Schedule 3
- [x] Trasferimento extra-UE coperto da SCC (Module Two/Three) + UK Addendum + Swiss Addendum
- [x] Notifica breach Supabase → Matteo entro 48h
- [x] Retention dati: durata Agreement; cancellazione cliente-attivabile

### FASE 2 — Documenti per pre-vendita
- [x] Privacy Policy riscritta e aggiornata (2026-05-23, v2.0 — `src/pages/PrivacyPolicyPage.tsx`)
- [~] **Lista sub-processor pubblica** — **bozza v0.1 creata 2026-06-15** (`docs/legal/sub-processors.md`, FU-LEGAL-2) → resta passaggio professionista + decisione pubblicazione
- [x] **Template DPA per ristoranti clienti creato** (2026-05-23) — `docs/_lavoro/Per matteo/Documenti Legali/DPA-template-clienti-ristoranti.md` (cartella locale, gitignored). v1.0, italiano, conforme art. 28 GDPR. Da personalizzare per ogni nuovo cliente.
- [~] **Contratto B2B / ToS abbonamento** — **bozza v0.1 creata 2026-06-15** (`docs/legal/ToS-B2B-abbonamento-template.md`, FU-LEGAL-1; recesso mensile sempre / annuale 30gg) → **revisione avvocato** prima del 1° cliente
- [~] **Registro trattamenti art. 30 GDPR** — **bozza v0.1 creata 2026-06-15** (`docs/legal/registro-trattamenti.md`, FU-LEGAL-2) → passaggio professionista; aperta decisione retention T1/T2
- [~] **Runbook data breach** — **bozza v0.1 creata 2026-06-15** (`docs/legal/runbook-data-breach.md`, FU-LEGAL-2) → validare ripartizione Titolare/Responsabile col professionista
- [ ] Email `privacy@<dominio>` — **rimandata**; temporaneo: matteo.sistemigestionali@gmail.com

### FASE 3 — Operativi e config
- [ ] Upgrade Supabase Pro (per PITR)
- [ ] PITR attivato
- [ ] SSL Enforcement DB ON
- [ ] Email "Confirm email" Supabase verificata ON
- [ ] Backup mensile PDF Privacy Policy (per provare cosa diceva a data X)

### FASE 4 — Solo se servono in futuro
- [x] Cookie banner — **NO** (decisione 2026-05-23 — vedi `COOKIE_CONTEXT.md`)
- [ ] Cookie policy separata
- [ ] DPIA — se aggiungiamo dati sensibili
- [ ] Nomina DPO formale — solo se >250 dipendenti o trattamento sistematico larga scala

---

## Sub-processor attuali

| Servizio | Cosa fa | Dove (region) | DPA con loro |
|---|---|---|---|
| Supabase Inc. | Hosting DB + Auth + Edge Functions | **EU — West EU (Ireland)** — confermato Matteo 12-06-26 | ✅ Firmato 2026-05-23 — Ref `Q4RYF-5FVPD-4LXZY-8JABB` |
| Supabase Pte. Ltd | Sub-processor Supabase (support services) | Singapore | Coperto da DPA Supabase Schedule 3 |
| Active Campaign / Postmark | Sub-processor Supabase (email a Authorized Users) | USA | Coperto da DPA Supabase Schedule 3 |
| Amazon Web Services Inc. | Sub-processor Supabase (hosting infrastructure) | Multi-region | Coperto da DPA Supabase Schedule 3 |
| Vercel Inc. | Hosting frontend statico (sito Matteo) | Edge globale (USA-first) | Standard incluso nei ToS |
| **Brevo (Sendinblue)** | Invio email transazionali e marketing ai clienti finali, via Edge `send-email` | **ATTIVO IN PROD dal 15-06-26** (Edge `send-email` v6 su `rwuxgvld`, secret `BREVO_API_KEY`/`BREVO_SENDER_EMAIL`) | ⚠️ **DA VERIFICARE**: DPA Brevo e riga nel file sub-processor pubblico |

⚠️ **Correzione 05-08-26 — questa riga diceva «l'email provider `send-email` Edge Function non esiste
ancora».** È falso da metà giugno: `send-email` è **deployata e attiva in produzione** (accetta,
rifiuta e campagne marketing), e dal 19-06 c'è anche l'Edge pubblica `unsubscribe` v1 con la tabella
`unsubscribe_tokens` (mig. `055`). **Conseguenza legale da chiudere, non un dettaglio di
documentazione:** un sub-processor che tratta dati di clienti finali sta girando in produzione
mentre questo registro lo dava per inesistente. Da fare: DPA con Brevo, riga nel file sub-processor
pubblico, e allineamento della Privacy Policy.

---

## Region Supabase del progetto prod

Project ref: `rwuxgvldzrkabglkasym`
Region: **West EU (Ireland)** — confermato Matteo 12-06-26 (dashboard Supabase → Settings → General)

Hosting primario in **UE** → dichiarare in Privacy Policy per trasparenza; nessun obbligo di narrativa USA/DPF per il DB principale. Restano rilevanti i sub-processor extra-UE coperti dal DPA Supabase (SCC).

*Nota storica:* fino al 12-06-26 il file indicava «Frankfurt / da verificare» — sostituito con Ireland.

---

## Decisioni prese e perché

### 2026-06-12 — Vendita Italia: blocchi e consigli (WP-F2)
**Decisione:** tabella priorità in cima a questo file; P.IVA forfettario da confermare con commercialista; contratto B2B da bozza repo + avvocato; fattura elettronica ADE gratis; registro/runbook/sub-processor = **entro il primo mese** (declassati da bloccanti in revisione senior 12-06-26); marchio **PrenotaZen** con logo esistente + UIBM prima di stampa; RC cyber consigliata; EAA come argomento vendita; budget ~1.500–2.500€ anno 1.
**Motivo:** allineare skill legale alle decisioni operative del report legale-vendita 12-06-26 senza scrivere contratti al posto dei professionisti. Revisione senior 12-06-26: i veri blocchi pre-vendita sono solo P.IVA + contratto + fattura; i 3 adempimenti GDPR operativi non devono ritardare il primo incasso.

### 2026-05-23 — No Iubenda / OneTrust / Cookiebot
**Decisione**: Matteo gestisce tutti i documenti come file in repo, scritti dall'agente legal-production.
**Motivo**: L'app è B2B di nicchia (prenotazioni ristoranti), non fa marketing/profilazione, non usa cookie di tracking. La complessità non giustifica un servizio esterno da 30-50€/anno. File in repo = controllo totale + zero costi.

### 2026-05-23 — Privacy Policy pagina React invece di markdown statico
**Decisione**: Tenere la Privacy Policy come `src/pages/PrivacyPolicyPage.tsx` (route `/privacy`).
**Motivo**: Permette di iniettare dinamicamente il nome del ristorante (TenantContext), così ogni cliente vede "Privacy Policy di <Nome Ristorante>" senza duplicare file.

### 2026-05-23 — DPA verso clienti come template markdown
**Decisione**: Tenere template DPA clienti in cartella locale gitignored da personalizzare all'onboarding.
**Motivo**: I DPA sono firmati offline (PDF), non serve dinamicità in app. Template versionato + bump versione quando cambia.

---

## Storia modifiche documenti

| Data | Documento | Cambiamento | Skill session |
|---|---|---|---|
| 2026-06-15 | `docs/legal/ToS-B2B-abbonamento-template.md`, `registro-trattamenti.md`, `runbook-data-breach.md`, `sub-processors.md` | **Bozze v0.1 create** (FU-LEGAL-1 + FU-LEGAL-2) — testo only, da revisione avvocato/commercialista | Ciclo 9 Plan-Completamento |
| 2026-06-12 | `LEGAL_STATE_CONTEXT.md` | WP-F2: vendita Italia, blocchi/consigli, region Ireland, PrenotaZen/marchio, budget | intervista Matteo |
| 2026-05-23 | (creazione skill) | Skill `legal-production` inizializzata | — |
| 2026-05-23 | `PrivacyPolicyPage.tsx` | Riscrittura completa post-audit | sessione iniziale |
| 2026-05-23 | `DATA_INVENTORY_CONTEXT.md` | Aggiunta tabella `ip_blacklist` (PII: IP) per ban automatico | rate limit hardening |
| 2026-05-23 | Template DPA clienti (locale) | Generato v1.0 italiano, conforme art. 28 GDPR | post-firma DPA Supabase |

Aggiornare quando vengono modificati i documenti.
