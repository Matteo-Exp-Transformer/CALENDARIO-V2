# Stato compliance — CalendarBackup-v2

> Aggiornato: 2026-05-23
> Single source of truth per "cosa è fatto / cosa manca" lato legale.
> Aggiornare SEMPRE dopo ogni sessione di questa skill.

---

## Stato per fase

### FASE 0 — Sicurezza tecnica DB
- [x] Audit sicurezza prod (2026-05-23) — migrazione `026_security_hardening`
- [x] FORCE RLS su tabelle PII
- [x] Service role key ruotata (2026-05-23)
- [x] Leaked password protection ON
- [x] MFA owner Supabase
- [x] Rate limit pubblico stretto (2026-05-23) — max 3 richieste/min, ban 24h dopo 2 sforamenti (migrazione `027_ip_blacklist`)

### FASE 1 — DPA Supabase
- [x] DPA richiesto a Supabase (2026-05-23)
- [ ] DPA compilato e firmato — IN CORSO (Matteo)
- [ ] Copia firmata salvata in `docs/_lavoro/Per matteo/`

### FASE 2 — Documenti per pre-vendita
- [ ] Privacy Policy riscritta e aggiornata
- [ ] Lista sub-processor pubblica
- [ ] Template DPA per ristoranti clienti
- [ ] Registro trattamenti art. 30 GDPR
- [ ] Runbook data breach
- [ ] Email `privacy@<dominio>` creata

### FASE 3 — Operativi e config
- [ ] Upgrade Supabase Pro (per PITR)
- [ ] PITR attivato
- [ ] SSL Enforcement DB ON
- [ ] Email "Confirm email" Supabase verificata ON
- [ ] Backup mensile PDF Privacy Policy (per provare cosa diceva a data X)

### FASE 4 — Solo se servono in futuro
- [ ] Cookie banner (oggi NO — vedi `COOKIE_CONTEXT.md`)
- [ ] Cookie policy separata
- [ ] DPIA (Data Protection Impact Assessment) — se aggiungiamo dati sensibili (es. dati salute, biometrici)
- [ ] Nomina DPO formale — solo se >250 dipendenti o trattamento sistematico larga scala

---

## Sub-processor attuali

| Servizio | Cosa fa | Dove (region) | DPA con loro |
|---|---|---|---|
| Supabase Inc. | Hosting DB + Auth + Edge Functions | EU (Frankfurt) — verifica region dashboard | In corso (richiesto 2026-05-23) |
| Vercel Inc. | Hosting frontend statico | Edge globale (USA-first) | Standard incluso nei ToS |
| (Email provider) | Invio email transazionali | NON CONFIGURATO ANCORA | N/A — vedi `EDGE_FUNCTIONS.md` |

⚠️ **L'email provider `send-email` Edge Function non esiste ancora.** Quando verrà aggiunto (Resend? SendGrid? Postmark?), AGGIORNARE questa tabella + Privacy Policy + DPA verso clienti.

---

## Region Supabase del progetto prod

Project ref: `rwuxgvldzrkabglkasym`
Region: **da verificare in dashboard Supabase → Settings → General**

Se la region è USA, dichiararlo esplicitamente in Privacy Policy + giustificare con SCC (Standard Contractual Clauses) o DPF (Data Privacy Framework).
Se è EU, è più semplice — dichiarare comunque per trasparenza.

---

## Decisioni prese e perché

### 2026-05-23 — No Iubenda / OneTrust / Cookiebot
**Decisione**: Matteo gestisce tutti i documenti come file in repo, scritti dall'agente legal-production.
**Motivo**: L'app è B2B di nicchia (prenotazioni ristoranti), non fa marketing/profilazione, non usa cookie di tracking. La complessità non giustifica un servizio esterno da 30-50€/anno. File in repo = controllo totale + zero costi.

### 2026-05-23 — Privacy Policy pagina React invece di markdown statico
**Decisione**: Tenere la Privacy Policy come `src/pages/PrivacyPolicyPage.tsx` (route `/privacy`).
**Motivo**: Permette di iniettare dinamicamente il nome del ristorante (TenantContext), così ogni cliente vede "Privacy Policy di <Nome Ristorante>" senza duplicare file.

### 2026-05-23 — DPA verso clienti come template markdown
**Decisione**: Tenere `docs/legal/DPA-template-clienti.md` da personalizzare manualmente all'onboarding.
**Motivo**: I DPA sono firmati offline (PDF), non serve dinamicità in app. Template versionato + bump versione quando cambia.

---

## Storia modifiche documenti

| Data | Documento | Cambiamento | Skill session |
|---|---|---|---|
| 2026-05-23 | (creazione skill) | Skill `legal-production` inizializzata | — |
| 2026-05-23 | `PrivacyPolicyPage.tsx` | Riscrittura completa post-audit | sessione iniziale |
| 2026-05-23 | `DATA_INVENTORY_CONTEXT.md` | Aggiunta tabella `ip_blacklist` (PII: IP) per ban automatico | rate limit hardening |

Aggiornare quando vengono modificati i documenti.
