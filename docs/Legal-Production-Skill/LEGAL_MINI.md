# LEGALE / PRODUZIONE — Mini-pack d'area (ingresso rapido)

> **Cos'è.** Ingresso ~1 schermata per i **documenti e adempimenti legali/compliance** (GDPR, ToS,
> DPA, registro, breach, config Supabase). **Non duplica** il workflow: per il testo pieno apri
> `LEGAL_PRODUCTION_SKILL.md` + context.
> Design: `Sessioni di lavoro/12-06-26/Design-wp-e1-mini-pack-area-12-06-26.md`.

## 1. Trigger
«Privacy Policy» · «GDPR» · «DPA» · «cookie» · «registro trattamenti» · «data breach» · «ToS /
contratto B2B» · «sub-processors» · «cose da fare per produzione» · «config compliance Supabase
(PITR/SSL/MFA)».

## 2. Carica subito
- **`LEGAL_STATE_CONTEXT.md`** (SEMPRE per primo) — stato, cosa manca, deadline.
- Poi il context del task (Privacy/DPA/Registro/Cookie/Breach/Config) — tabella `LEGAL_SKILL` §0.2.
- **`WebSearch`/`WebFetch` PRIMA** di compliance/aggiornamenti (norme + UI fornitori cambiano).

## 3. Divieti top-3
1. **Auto-detection dal codice OBBLIGATORIA** prima di scrivere/aggiornare un doc legale: cosa
   raccogliamo (PII), dove va (edge/API/email), quanto teniamo (cleanup?), cookie/localStorage.
   Documento ≠ realtà codice → segnala discrepanze (`LEGAL_SKILL` §3).
2. **Mai retention «X mesi» senza job cleanup reale**; mai nomi tenant hardcoded («Al Ritrovo»);
   lista sub-processor sempre sincronizzata coi servizi esterni veri.
3. **File `docs/_lavoro/Per matteo/` MAI committati** (gitignored). `PrivacyPolicyPage.tsx` lo modifica
   **solo** questa skill. Utente non tecnico/legale → spiega il PERCHÉ con esempi concreti.

## 4. Mappa file
| Se il task tocca… | Apri |
|---|---|
| Stato/checklist «cosa manca per live» | `LEGAL_STATE_CONTEXT.md` |
| Privacy Policy | `PRIVACY_POLICY_CONTEXT.md` + `DATA_INVENTORY_CONTEXT.md` |
| DPA Supabase / DPA clienti | `DPA_SUPABASE_CONTEXT.md` / `DPA_CLIENTI_CONTEXT.md` |
| Registro art. 30 | `REGISTRO_TRATTAMENTI_CONTEXT.md` + `DATA_INVENTORY_CONTEXT.md` |
| Cookie / Data breach | `COOKIE_CONTEXT.md` / `DATA_BREACH_CONTEXT.md` |
| Config Supabase produzione (SSL/PITR/MFA) | `SUPABASE_PRODUCTION_CONFIG.md` |
| File prodotti (repo vs locali) + commit convention | `LEGAL_SKILL` §5 + §8 |

## 5. LOCK (solo link)
- **`src/pages/PrivacyPolicyPage.tsx`** — solo questa skill → `LEGAL_SKILL` §6.
- **`docs/_lavoro/Per matteo/` gitignored** — mai committare → `LEGAL_SKILL` §6.
- **Documenti versionati** in `docs/legal/` (DPA, registro, runbook breach, sub-processors) → §5.
- Ogni doc: «Ultima modifica: YYYY-MM-DD» + bump versione su modifica importante → §6.
