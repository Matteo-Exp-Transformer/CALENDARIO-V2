---
name: bussola-console
description: >-
  Skill 0 del branch feature/console-super-admin. Orienta qualsiasi agente che lavora alla
  Console super-admin di Matteo. Caricala a inizio sessione, quando non sai quale file leggere,
  o quando il task attraversa più aree. Definisce profili, regole operative del branch e routing.
---

# Bussola Console — Skill 0 / orientamento agente

> **Branch:** `feature/console-super-admin`. **Master:** `.claude/CLAUDE.md` (riscritto per noi).
> **Contesto prodotto:** `docs/Servizio-Config/`. **Template di origine:** `_skill-system-v0/`.
>
> Questa bussola **smista, non spiega**. I dettagli stanno in `context/`. Tienila < ~250 righe.

---

## 0. Cosa stiamo costruendo

La **Console super-admin** (FU-SERV-ADMIN-PANEL-1): un'app web **separata e mobile-first**, solo per
Matteo, che legge/scrive lo **stesso DB Supabase TEST** (`docnnernvp`) per configurare i ristoranti
(tenant): edition, feature flag, durate/numeri tecnici, card/menu, preset. Il codice vive nella
sottocartella isolata **`console/`**; l'app di Matteo (`src/`, `supabase/`) **non si tocca**.

> **Invariante UI — DEVE funzionare perfettamente anche da MOBILE.** Matteo usa la Console anche dal
> telefono (in vendita, sul campo): ogni schermata, tabella, modale e form va progettata e testata
> responsive (target reale ~375px). Non è un "nice to have": una REQ non è consegnabile se la sua UI
> non è usabile da telefono. Verifica mobile **obbligatoria** prima di ogni consegna.

---

## 1. Le 4 regole d'oro del branch (battono tutto — anche un fix «piccolo»)

```
RULE-1  SOLO TEST. Prima di OGNI scrittura DB: get_project_url deve dare docnnernvp.
        Se rwuxgvld (PROD) → STOP, non scrivere.
RULE-2  SCRIVO SOLO NEI SANDBOX. Scritture di DATI consentite solo sui tenant
        console-classic e console-pro. Ogni altro tenant (test-classic, da-tommaso, …) = SOLA LETTURA.
RULE-3  SCHEMA → PLAN PER MATTEO. DDL/RLS/migrazioni/colonne nuove: mai eseguiti dall'agente.
        Si genera un file in plan-per-matteo/ e lo esegue Matteo.
RULE-4  CODICE SOLO IN console/. Non toccare src/ o supabase/. La Console NON importa da ../src.
        Service role key MAI nel browser → scritture potenti via Edge/serverless.
```

> Queste sono **regole sempre attive**, non parole-grilletto. L'unica parola nuova è «plan per
> matteo» (vedi VOCABOLARIO).

### 1b. Regola d'oro 5 — TRACCIABILITÀ (priorità n.1)

```
RULE-5  Niente accade in silenzio. Ogni decisione non banale → DEC-NNN in sessioni/DECISION_LOG.md;
        ogni fase → blocco in sessioni/PHASE_AUDIT.md prima del commit; ogni scrittura DB → tracciata;
        ogni commit cita fase + DEC. Esecutore ≠ Revisore (no auto-approvazione).
```

> Matteo ha dato **consenso pieno** «per ora» (DEC-013): si procede senza chiedere conferma, **ma si
> logga tutto** per renderlo revisionabile. Protocollo completo: **`TRACCIABILITA.md`**.

---

## 2. Scegli il profilo e instrada

### 2.1 Profilo di ingresso

| Profilo | Tipo di task | Parole-trigger | Carica | Salta |
|---------|--------------|----------------|--------|-------|
| **Esecuzione** | feature/fix/UI della Console | `implementa`, `fai`, `crea`, `aggiungi` | il `context/` pertinente | meta |
| **Verifica** | debug, test, revisione | `revisiona`, `verifica`, `debugga`, `non funziona` | `docs/Testing-Skill/` + context della zona | meta |
| **Prepara** | solo prompt, nessun codice | `prepara`, `prepara prompt` | nulla: consegna il prompt | tutto il resto |

### 2.2 Tabella di routing

| Il task riguarda… | File da caricare |
|-------------------|------------------|
| Edition / feature flag / versione venduta di un tenant | `context/CONSOLE_DATA_MODEL_CONTEXT.md` |
| Impostazioni ristorante (durate, numeri tecnici, registry) | `context/CONSOLE_DATA_MODEL_CONTEXT.md` |
| Architettura della Console, setup `console/`, sicurezza, deploy | `context/CONSOLE_APP_CONTEXT.md` |
| Cosa va nella Console vs onboarding del ristoratore | `docs/Servizio-Config/INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md` |
| Come si configura oggi un cliente (script) | `docs/Servizio-Config/GUIDA_CONFIGURAZIONE_CLIENTE.md` |
| Capire come funziona l'app esistente (Prenota/Menu/Admin/DB) | skill di Matteo in `docs/…` — **sola lettura** |
| Come rispondere / stile / report | `comunicazione/COMUNICAZIONE_SKILL.md` |
| Una modifica di **schema** DB | genera un *plan per matteo* (vedi `plan-per-matteo/README.md`) |
| **Non è chiaro di quale area si tratti** | **Fermati e chiedi — NON indovinare** |

> **Regola sub-task:** a ogni scomposizione del lavoro, **ripeti** la scelta profilo + routing.
> «L'ho già letto all'inizio» non basta se il sotto-task cambia zona.

---

## 3. Invarianti / LOCK (oltre le 4 regole d'oro)

```
LOCK  src/  e  supabase/   — app di Matteo: sola lettura, non modificare.
LOCK  docs/ (skill di Matteo, escluso docs/Console-Skill/) — riferimento, non modificare.
LOCK  organizations.qr_menu_enabled — LEGACY: non usarla per attivare add-on. Usa tenant_features.
RULE  Leggi INTERO il file (e i collegati) prima di editarlo. Mai editare da un frammento di ricerca.
RULE  Anti-duplicazione: prima di scrivere un helper, cerca se esiste già.
RULE  Fonte di verità = codice/DB. Se un doc Servizio-Config diverge, vince il DB; segnalalo.
```

---

## 4. Struttura del nostro skill system

```
docs/Console-Skill/
├── README.md                         ← indice + 4 regole d'oro
├── 00_BUSSOLA_CONSOLE.md             ← questo file (Skill 0)
├── context/
│   ├── CONSOLE_DATA_MODEL_CONTEXT.md ← organizations, edition, tenant_features, restaurant_settings
│   └── CONSOLE_APP_CONTEXT.md        ← architettura console/, sicurezza, deploy, sandbox
├── comunicazione/
│   ├── VOCABOLARIO.md                ← parole-comando (riuso Matteo + «plan per matteo»)
│   └── COMUNICAZIONE_SKILL.md        ← stile didattico (spiega + «cosa cambia per te»)
├── plan-per-matteo/
│   └── README.md                     ← convenzione + template PLAN-DB
└── sessioni/
    ├── SESSION_LOG.md                ← indice cronologico one-liner
    └── FOLLOW_UP.md                  ← debiti differiti (FU-CONSOLE-NNN)
```

---

## 5. Inizio e fine sessione

- **A inizio sessione:** carica questa bussola + `comunicazione/COMUNICAZIONE_SKILL.md`. Se il task
  tocca il DB, verifica subito `get_project_url`.
- **A fine sessione (se Cristiano conferma successo):** «lavoro ok» → aggiorna il report e
  `sessioni/SESSION_LOG.md` (+ `FOLLOW_UP.md` se restano debiti), **senza** commit. «fai report
  finale» → report + commit (sul branch).

---

## 6. Peso della sessione: light / standard / deep

| Modalità | Quando | Chiusura |
|----------|--------|----------|
| **light** | fix piccolo, 1 file, basso rischio | 1 riga in `SESSION_LOG.md` |
| **standard** | feature/fix normale, una zona | report + log |
| **deep** | trigger sotto | report esaustivo + follow-up + allineamento context |

**Trigger DEEP (basta uno):** tocca il DB / genera un *plan per matteo*; tocca i LOCK (`src/`,
`supabase/`); login/auth della Console; più di una schermata o un nuovo comportamento; sicurezza
(service role, Edge). L'agente può solo **alzare** la modalità in corsa, mai abbassarla.
