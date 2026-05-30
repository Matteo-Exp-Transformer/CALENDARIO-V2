---
name: contesto-prodotto
description: >-
  Fonte di verità riassuntiva per agenti — visione prodotto, modello commerciale (senza prezzi),
  target, decisioni strutturali e roadmap di CalendarBackup-v2. NON contiene dati sensibili.
  Caricare per approfondire il PERCHÉ di una scelta, oltre al COME (che sta nelle skill).
---

# Contesto prodotto — fonte di verità riassuntiva

> **Scopo:** dare agli agenti il contesto strategico per capire *perché* l'app è fatta così,
> non solo *come* è fatta (quello sta nelle skill di area). Materiale di approfondimento, non
> obbligatorio per ogni task.
>
> **Privacy:** questo file NON contiene dati sensibili (prezzi reali, dati clienti, documenti
> legali, credenziali). Quelli restano in `docs/_lavoro/` (locale, gitignored). In produzione
> Matteo potrà scollegare questa fonte così non è consultabile da agenti post-produzione.

---

## 1. Cos'è CalendarBackup-v2

Piattaforma SaaS multi-azienda di gestione prenotazioni per ristoranti. Un ristoratore (in tutta
la doc lo chiamiamo **Mario**) gestisce calendario, prenotazioni, tavoli/turni, menu e una pagina
pubblica dove i suoi clienti prenotano.

Due mondi (vedi `APP_CONTEXT_SKILL.md` §1):
- **Pubblico**: il cliente del ristorante prenota (form pubblico, menu QR, pagina Prenota).
- **Admin**: Mario gestisce tutto dalla dashboard.

---

## 2. Modello commerciale (struttura, senza prezzi)

Una sola codebase, venduta in **edition** + **add-on** (dettaglio in `Marketing-Skill/`):

| Livello | Cosa include (sintesi) |
|---------|------------------------|
| **Classic** | Prenotazioni base, calendario, impostazioni, form pubblico |
| **Pro** | Classic + sidebar, CRM esteso, Servizio/turni, Analytics, QR Menu |
| **Enterprise** | Pro + feature enterprise future |
| **Add-on** | Feature singola attivabile per tenant via `tenant_features`, su qualsiasi edition |

**Perché conta per gli agenti:** ogni feature nuova va decisa "bundle o add-on" *prima* di
codificarla, perché cambia dove si dichiara (`buildFeatures`). Le feature sono sempre dietro flag
(`useFeatures()`), mai hardcoded. I prezzi reali e la valutazione di vendita NON stanno qui:
sono in `docs/_lavoro/Per matteo/` (privato).

---

## 3. Decisioni strutturali consolidate (il "perché")

| Decisione | Perché |
|-----------|--------|
| Due client Supabase separati (`supabase` / `supabasePublic`) | Sicurezza: l'admin è autenticato con sessione; il pubblico è anonimo senza sessione. Mai mischiarli. |
| Multi-tenancy via `TenantContext` + RLS | Una codebase serve tutti i ristoranti; i dati sono isolati da RLS, non dal codice. |
| `tenant_features` + `edition` | Vendere feature singole senza cambiare pacchetto e senza fork del codice. |
| Tab Menu (magazzino) ≠ Personalizza form (vetrina) | I testi/prezzi mostrati sul pubblico sono indipendenti dai dati interni del menu (resolver `field_overrides`). |
| Sviluppo sempre su Supabase TEST | Non rischiare dati di produzione; prod resta sola lettura salvo richiesta esplicita. |
| PWA: aggiornamento all'apertura, mai in sessione | Non interrompere Mario mentre lavora dopo un deploy. |

---

## 4. Roadmap / temi aperti (aggiornare quando cambiano)

> Snapshot al 2026-05-28. Stato vivo nei report di sessione + `SESSION_LOG.md`.

- UI super-admin per attivare add-on (oggi manuale via SQL/MCP) — prevista quando crescono i clienti paganti.
- Prezzi commerciali reali da definire (placeholder in `Marketing-Skill/EDITION_PRICING_CONTEXT.md`).
- Verifica PWA end-to-end post-deploy (vedi report PWA 28-05-26).
- Conformità produzione (privacy, DPA, config Supabase) — tracciata in `Legal-Production-Skill/`.
- **Skill system tier avanzato (lontano):** valutare entry point multipli per agenti più competenti (Codex, Cursor thinking, ecc.) e pack contesto su misura — `docs/FOLLOW_UP.md` **FU-024**, `APP_CONTEXT_SKILL.md` §4d.

---

## 5. Dove trovo cosa (mappa rapida)

| Mi serve… | Vai a… |
|-----------|--------|
| Routing skill, invarianti, RULE globali | `docs/APP_CONTEXT_SKILL.md` (Skill 0) |
| Modello commerciale dettagliato | `docs/Marketing-Skill/` |
| Flusso identità/feature flag | `docs/DATA_FLOW_SKILL.md` |
| Come parlare a Matteo + skill comunicazione | `docs/COMUNICAZIONE_UTENTE_SKILL.md` + `docs/Comunicazione-Skill/` |
| Storia tecnica (architettura, changelog, setup) | `docs/Archivio/Storico/` (se presente) o `docs/_lavoro/` (privato) |
| Cronologia sessioni | `docs/SESSION_LOG.md` → `docs/Sessioni di lavoro/` |
| Dati sensibili (prezzi, DPA, cose-da-fare) | `docs/_lavoro/Per matteo/` (locale, gitignored — NON per agenti post-produzione) |
