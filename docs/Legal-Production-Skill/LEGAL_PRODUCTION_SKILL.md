---
name: legal-production
description: >-
  Skill di assistenza per tutti i documenti, configurazioni e adempimenti
  legali/operativi necessari per portare CalendarBackup-v2 in produzione
  commerciale con clienti UE. Coprire GDPR (Privacy Policy, DPA, Registro
  trattamenti, cookie, breach), configurazioni Supabase (backup, SSL, MFA,
  email), checklist deploy. Usare quando l'utente chiede aiuto su privacy,
  GDPR, contratti clienti, conformità, "cose da fare per produzione",
  riscrittura Privacy Policy, generazione DPA, registro trattamenti,
  data breach, cookie banner, o qualunque attività che riguardi la messa
  in produzione "commerciale" dell'app (non puro deploy tecnico).
---

# Legal & Production — Skill agente

> Scopo: assistere Matteo nella preparazione e manutenzione di tutto ciò che
> serve a vendere legalmente CalendarBackup-v2 a ristoranti italiani/UE.
> NON è una skill tecnica di deploy — è la skill "burocratica" della messa
> in produzione (GDPR, contratti, configurazioni Supabase di compliance).

---

## 0. PRIMA DI OGNI SESSIONE — obbligatorio

### 0.1 Cerca aggiornamenti online

Le norme cambiano e le interfacce dei fornitori (Supabase, Vercel) si aggiornano spesso. **Prima di rispondere a una domanda di compliance o aggiornare un documento**, usa `WebSearch` / `WebFetch` per verificare:

| Quando l'utente chiede di… | Cerca online |
|---|---|
| Riscrivere/aggiornare Privacy Policy | Linee guida Garante Privacy IT più recenti + modello Privacy Policy SaaS 2026 |
| DPA con Supabase | "supabase dpa 2026" + verifica URL `https://supabase.com/legal/dpa` ancora attivo |
| DPA verso clienti | Schema DPA art. 28 GDPR aggiornato (Garante o Commissione UE) |
| Cookie banner | Linee guida cookie Garante (ultima versione) — la disciplina è cambiata 2023 e 2024 |
| Data breach | Modulo notifica Garante (URL può cambiare): cerca "garanteprivacy.it notifica violazione dati" |
| Configurazioni Supabase (SSL, PITR, MFA) | Dashboard Supabase 2026 — i menu cambiano spesso, cerca docs ufficiale |
| Trasferimento dati extra-UE | Status Privacy Shield / Data Privacy Framework USA-UE attuale |
| Conservazione dati prenotazioni | Linee guida settore HoReCa (associazioni di categoria o Garante) |

**Regola**: se hai dubbi sul fatto che una info nei context file sia ancora valida (>3 mesi dall'ultima modifica), verifica online.

### 0.2 Leggi i file di contesto

Carica nell'ordine:

1. **`docs/Legal-Production-Skill/LEGAL_STATE_CONTEXT.md`** — stato attuale di cosa è fatto, cosa manca, deadline. SEMPRE per primo.
2. Poi UNO O PIÙ dei seguenti in base al task:

| Il task riguarda… | Carica anche |
|---|---|
| Privacy Policy (riscrivere, aggiornare, verificare) | `PRIVACY_POLICY_CONTEXT.md` + `DATA_INVENTORY_CONTEXT.md` |
| DPA con Supabase | `DPA_SUPABASE_CONTEXT.md` |
| DPA verso clienti ristoranti | `DPA_CLIENTI_CONTEXT.md` |
| Registro trattamenti art. 30 | `REGISTRO_TRATTAMENTI_CONTEXT.md` + `DATA_INVENTORY_CONTEXT.md` |
| Cookie banner | `COOKIE_CONTEXT.md` |
| Data breach (incidente o procedura preventiva) | `DATA_BREACH_CONTEXT.md` |
| Configurazioni Supabase per produzione (SSL, PITR, MFA, ecc.) | `SUPABASE_PRODUCTION_CONFIG.md` |
| Checklist generale "cosa manca per andare live" | `LEGAL_STATE_CONTEXT.md` (basta quello) |

---

## 1. Workflow tipico per ogni richiesta

```
1. WebSearch su info aggiornate (se task lo richiede — vedi tabella §0.1)
2. Leggi LEGAL_STATE_CONTEXT.md
3. Leggi i context specifici (tabella §0.2)
4. Verifica nel CODICE attuale cosa fa davvero l'app
   (vedi §3 "Auto-detection dati dal codice")
5. Confronta dichiarato (documenti) vs realtà (codice). Segnala discrepanze.
6. Produci/aggiorna documenti
7. Aggiorna LEGAL_STATE_CONTEXT.md con la nuova data + cosa è cambiato
8. Aggiorna docs/_lavoro/Per matteo/Cose-da-fare-per-produzione.md
   (file locale, non versionato — è il "todo" personale dell'utente)
```

---

## 2. Comunicazione con l'utente

L'utente NON è tecnico né legale. Regole:

- **Spiega sempre il PERCHÉ** prima del COSA. Esempio: "Ti serve un DPA perché la legge ti obbliga a..." e non "Genera il DPA secondo art. 28."
- **Usa esempi concreti**: invece di "trattamenti di dati", dì "quando Mario prenota un tavolo, il suo numero di telefono finisce nel database".
- **Mai termini legali senza traduzione**. "Titolare del trattamento (= chi decide cosa fare con i dati, in questo caso il ristorante)".
- **Riassumi a fine messaggio** in 2-3 righe massime cosa hai fatto e cosa deve fare lui.
- **Non proporre Iubenda/OneTrust/Cookiebot di default**: l'utente preferisce file in repo gestiti da te. Suggeriscili solo se chiede esplicitamente o se la complessità lo giustifica davvero (es. cookie banner dinamico in più lingue).
- **Costi sempre dichiarati**: se proponi un servizio esterno, scrivi quanto costa.

---

## 3. Auto-detection dati dal codice (CRITICO)

La Privacy Policy e il Registro trattamenti devono riflettere quello che il
codice fa DAVVERO, non quello che pensavamo facesse 6 mesi fa.

**Prima di scrivere/aggiornare un documento legale, fai SEMPRE questi check:**

### 3.1 Quali dati raccogliamo?

Esegui:
```bash
# Tabelle che contengono PII
grep -rn "tenant_id\|client_email\|client_phone\|client_name\|email" \
  supabase/migrations/ src/types/database.ts | head -50
```

E controlla nel DB live con MCP Supabase:
```sql
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema='public'
  AND column_name ~* '(email|phone|name|ip|address|cookie|note|telefono)';
```

### 3.2 Dove li mandiamo?

- **Edge Functions**: `supabase/functions/*/index.ts` → cercare `fetch()` esterne
- **External API calls** dal frontend: `grep -rn "fetch\|axios" src/`
- **Email sender**: `src/lib/email.ts` — quale servizio usa?
- **Analytics**: cercare `gtag`, `posthog`, `mixpanel`, `analytics` in `src/` e `index.html`

### 3.3 Quanto li teniamo?

- Cercare job di cleanup: `grep -rn "DELETE\|cleanup\|retention" supabase/`
- Se NESSUN cleanup esiste → policy "infinito" — va dichiarato.

### 3.4 Cookie

- `grep -rn "document.cookie\|localStorage\|sessionStorage" src/`
- `src/lib/supabase.ts` → `persistSession` — se true, scrive in localStorage

**Documenta tutto in `DATA_INVENTORY_CONTEXT.md`** che è il "single source of truth" per Privacy Policy e Registro.

---

## 4. Aggiornamenti automatici dopo modifiche al codice

Quando l'utente (in altre sessioni) modifica il codice, alcuni cambiamenti
**impattano i documenti legali** e vanno riflessi.

**Cambiamenti che richiedono aggiornamento documenti:**

| Cambiamento codice | Documenti da aggiornare |
|---|---|
| Nuova colonna PII (email, phone, nome, ecc.) | Privacy Policy §2 + Registro Trattamenti + Data Inventory |
| Nuova tabella con dati personali | Tutti sopra + Data Inventory |
| Nuovo external API call con dati utente | Privacy Policy §3 + Registro Trattamenti + DPA verso clienti (sub-processor) |
| Cambio retention policy (cleanup_*) | Privacy Policy §5 + Registro Trattamenti |
| Nuovo cookie / localStorage write | Privacy Policy §7 + valutare se serve banner |
| Aggiunta Google Analytics / pixel | Privacy Policy + Cookie banner OBBLIGATORIO |
| Cambio hosting / region Supabase | Privacy Policy (trasferimento extra-UE) + DPA |
| Aggiunta nuovo email provider (SendGrid, Resend, ecc.) | Lista sub-processors in DPA |

**Quando l'utente apre una sessione di questa skill, il PRIMO check è:**
```
git log --since="last update Privacy Policy" --name-only -- supabase/migrations/ src/lib/ supabase/functions/
```
Per vedere se c'è stato un cambiamento che richiede update documenti.

---

## 5. File prodotti da questa skill

### Versionati in repo (commit + push)
| File | Quando creare/aggiornare |
|---|---|
| `src/pages/PrivacyPolicyPage.tsx` | Riscrittura completa |
| `docs/legal/DPA-template-clienti.md` | Template DPA da far firmare ai ristoranti |
| `docs/legal/registro-trattamenti.md` | Registro art. 30 GDPR |
| `docs/legal/runbook-data-breach.md` | Procedura operativa breach |
| `docs/legal/sub-processors.md` | Lista aggiornata sub-processor (Supabase, Vercel, email provider) |
| `docs/legal/cookie-policy.md` | Se serve banner (oggi NO, ma teniamo file pronto) |

### Solo locali (gitignored, in `docs/_lavoro/Per matteo/`)
| File | Contenuto |
|---|---|
| `Cose-da-fare-per-produzione.md` | Checklist personale Matteo: azioni manuali Supabase + GDPR |
| `DPA-Supabase-firmato.pdf` | Copia DPA ricevuto e firmato (NON committare) |
| `DPA-firmati-clienti/<nome-ristorante>.pdf` | Copie DPA firmati dai clienti |

---

## 6. Invarianti — non negoziabili

```
LOCK  src/pages/PrivacyPolicyPage.tsx — SOLO questa skill può modificarlo
RULE  Mai usare nomi tenant hardcoded ("Al Ritrovo") — sempre dinamici da org
RULE  Ogni documento ha una sezione "Ultima modifica: YYYY-MM-DD" alla fine
RULE  Ogni modifica importante a documenti legali → bump del numero versione
RULE  Lista sub-processor SEMPRE sincronizzata con servizi esterni reali
RULE  Mai dichiarare retention "X mesi" se non esiste un job cleanup
RULE  Mai pubblicare Privacy Policy senza prima fare check §3 sul codice
RULE  File in docs/_lavoro/Per matteo/ NON vanno mai committati (gitignored)
```

---

## 7. Quando NON usare questa skill

- Deploy tecnico (Vercel, Supabase migrations) → usa skill DB / generale
- Setup ambienti / variabili env → CLAUDE.md
- Bug di sicurezza nel codice → skill DB §RLS
- Hardening tecnico DB (RLS policy, GRANT) → skill DB

Questa skill è SOLO per i documenti, le configurazioni di compliance e
la comunicazione legale con utenti/clienti.

---

## 8. Commit convention

```
docs(legal): aggiorna privacy policy con nuovo trattamento X
docs(legal): nuovo template DPA per clienti
feat(legal): nuova pagina cookie policy
fix(legal): correzione lista sub-processor (aggiunto Resend)
```

Mai prefissi `chore:` per cambi legali — è importante che siano tracciati.
