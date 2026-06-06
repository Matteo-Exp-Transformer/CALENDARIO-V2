# Sessioni di lavoro — Indice globale

> Per agenti: ogni cartella `DD-MM-YY` ha un **README locale** con tutti i report di quel giorno.  
> Cronologia riga-per-riga: [SESSION_LOG.md](../SESSION_LOG.md) · Debiti aperti: [FOLLOW_UP.md](../FOLLOW_UP.md)

## Tabella giornate (23-05 → 06-06-26)

| Data | Tema sintetico | README | Report |
|------|----------------|--------|--------|
| [23-05-26](./23-05-26/README.md) | Sicurezza DB PROD, refactor promo, Calendario responsive | [→](./23-05-26/README.md) | 9 |
| [24-05-26](./24-05-26/README.md) | Menu QR Fase 1, `tenant_features`, skill Plan 2 | [→](./24-05-26/README.md) | 6 |
| [25-05-26](./25-05-26/README.md) | Nascita Prenota v2 + Personalizza form; modale Menu QR | [→](./25-05-26/README.md) | 10 |
| [26-05-26](./26-05-26/README.md) | Carosello, resolver, XOR card/carosello, onboarding analisi | [→](./26-05-26/README.md) | 9 |
| [27-05-26](./27-05-26/README.md) | Striscia foto Prenota, riepilogo prezzi, query PROD | [→](./27-05-26/README.md) | 6 |
| [28-05-26](./28-05-26/README.md) | Marathon sfondo Prenota, toggle carosello, PWA | [→](./28-05-26/README.md) | 13 |
| [29-05-26](./29-05-26/README.md) | Skill system, mappature, Menu QR F3, validazione UX, promo | [→](./29-05-26/README.md) | 25 |
| [30-05-26](./30-05-26/README.md) | Prepara-prompt fix Menu QR; temi sfondo 041 | [→](./30-05-26/README.md) | 8 |
| [31-05-26](./31-05-26/README.md) | Chiusura sfondo Prenota; viewport responsive; routing Prenota↔QR | [→](./31-05-26/README.md) | 13 |
| [01-06-26](./01-06-26/README.md) | Ciclo Menu QR → merge `main`; sync categorie; icone; hook Cursor | [→](./01-06-26/README.md) | 20 |
| [02-06-26](./02-06-26/README.md) | Ciclo annotazioni Prenota; freeze full-page; alleggerimento skill | [→](./02-06-26/README.md) | 11 |
| [03-06-26](./03-06-26/README.md) | Limiti testo Prenota; layout card ingredienti; hook stop v3 | [→](./03-06-26/README.md) | 7 |
| [04-06-26](./04-06-26/README.md) | Pilota Prenota-Skill; hook v4 + guard PROD; FU-031/032 | [→](./04-06-26/README.md) | 7 |
| [05-06-26](./05-06-26/README.md) | Capability-driven tipologie; card/carosello; merge main PROD; hook husky | [→](./05-06-26/README.md) | 10 |
| [06-06-26](./06-06-26/) | Blindatura Prenota prod-ready; mappatura skill Menu QR | — | 2 |

**Totale report indicizzati:** 156

## Percorsi rapidi agente

| Se lavori su… | Parti da |
|---------------|----------|
| **Pagina Prenota** — sfondo full-page / striscia / padding | [31-05-26](./31-05-26/README.md) → [28-05-26](./28-05-26/README.md) |
| **Pagina Prenota** — validazione submit, pulse, overlay | [29-05-26](./29-05-26/README.md) § Validazione UX |
| **Pagina Prenota** — limiti testo / edge `create-booking` | [03-06-26](./03-06-26/README.md) → [04-06-26](./04-06-26/README.md) |
| **Pagina Prenota** — tipologie / menù per capacità (non per nome) | [05-06-26](./05-06-26/README.md) |
| **Pagina Prenota** — blindatura hardcoded, default tenant, prod-ready | [06-06-26](./06-06-26/Report-revisione-blindatura-prenota-fix-prod-ready-06-06-26.md) |
| **Pagina Prenota** — centratura card scorrevoli / carosello | [05-06-26](./05-06-26/README.md) § card/carosello |
| **Personalizza form** — promo, salvataggio, card scorrevole | [29-05-26](./29-05-26/README.md) |
| **Menu QR** — ciclo completo admin↔pubblico | [29-05-26](./29-05-26/README.md) → [01-06-26](./01-06-26/README.md) |
| **Menu QR** — layout card / icone / ordine categorie | [01-06-26](./01-06-26/README.md) |
| **Menu QR** — skill area, codice morto preset, cap testo categoria | [06-06-26](./06-06-26/Report-mappatura-menu-qr-06-06-26.md) |
| **Admin calendario / BookingRequestCard** prezzo digest | [29-05-26](./29-05-26/README.md) § BookingRequestCard |
| **Skill system / hook / CHIUSURA_SESSIONE** | [29-05-26](./29-05-26/README.md) → [04-06-26](./04-06-26/README.md) |
| **Sicurezza DB / query tenant PROD** | [23-05-26](./23-05-26/README.md) · [27-05-26](./27-05-26/README.md) |

## Note per l'indicizzazione

- Le sessioni **23-05 → ~28-05** spesso **non hanno voci FOLLOW_UP** dedicate: il sistema follow-up strutturato parte circa **29-05-26**. Per debiti antichi usare il cappello del report + [SESSION_LOG.md](../SESSION_LOG.md).
- **Prenota** (`/prenota/:slug`) e **Menu QR** (`/menu/:slug`) hanno report separati; errori di routing documentati in [31-05-26](./31-05-26/Report-meta-analisi-routing-prenota-vs-menu-qr-31-05-26.md).
- Report in sottocartelle **asset** (immagini): solo README breve, senza indicizzazione report.
- Storico pre-23-05 in `docs/_lavoro/Sessioni/` (gitignored) — fuori da questo indice.

## Legenda stati (README locali)

| Simbolo | Significato |
|---------|-------------|
| ✅ | Eseguito / chiuso (lavoro ok, report finale, QA, commit) |
| 🔶 | In sospeso / parziale |
| 📋 | Solo analisi / prepare-prompt / reference |
| ↩️ | Superato / annullato / duplicato |
