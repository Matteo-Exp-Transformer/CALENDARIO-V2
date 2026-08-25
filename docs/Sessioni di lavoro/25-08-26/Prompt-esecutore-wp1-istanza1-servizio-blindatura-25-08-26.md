# Prompt esecutore — prima istanza WP-1 ombra: Admin Servizio (blindatura)

> **Uso:** incolla in una **nuova** chat su `env/test`.  
> **Istanza:** 1 di N di `WP-1` — **non** chiudere WP-1 a fine chat.  
> **Owner MSS:** `docs/MetaSkillSystem/PLAN_V0.md` (§4 WP-1 = `IN PILOTA` ombra; §15 T14).  
> **Autorizzazione:** `D27` riaperta 25-08-26 verbatim.

---

## Intestazione agente

```
Profilo: Verifica (+ fix mirati) — prima istanza WP-1 ombra
Modalità: deep
Protocollo pilota: MSS-PILOT-001 · capsula mss.session/0.1.1 / freeze-2
Skill da leggere (in ordine):
  - docs/APP_CONTEXT_SKILL.md §0 (routing già applicato sotto)
  - docs/Admin-Skill/ADMIN_SKILL.md
  - docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md
  - docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md § Servizio
  - docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md (sezioni Servizio / M5)
  - docs/Testing-Skill/TESTING_SKILL.md
  - docs/Testing-Skill/TESTING_CONTEXT.md (indice test Servizio)
  - docs/Sessioni di lavoro/06-08-26/CHIUSURA_CAPITOLO_SERVIZIO_RETROSPETTIVA.md
  - docs/Sessioni di lavoro/06-08-26/Report-finale-chiusura-capitolo-servizio-06-08-26.md
  - docs/FOLLOW_UP.md (righe FU-SERV-* aperte)
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
  - docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md (chiusura istanza)
Non caricare: Senior-Eval intero · corpus MSS storico non puntato · cutover WP-6
```

---

## Contesto MSS (ombra)

- Vecchio skill system = **confronto operativo** (resta attivo).
- Cutover **vietato**. `SEP-G5` non PASS. Non inventare metriche Persona.
- Raccolta minima: correzioni prompt, retry, tempo/costo attribuito, `controls[]` reali,
  errori/regressioni, decisioni Matteo verbatim, follow-up. `non_osservato` valido.
- Chiudi l’**istanza** con report + capsula (`mss:capsule`) + `validate:mss --require-capsule`.
  **Non** dichiarare WP-1 «finito».

---

## Obiettivo prodotto (prima istanza)

**Schermata:** Admin → **Servizio** (`/admin/servizio`) — sale, tavoli, fasce, assegnazioni, mappa/lista.

**Lavoro:** riprendere il sospeso post-chiusura tecnica 06-08: **testare** la pagina Servizio,
**fix** i regressi trovati, **creare/estendere test** che proteggono le funzioni introdotte da
quando sono iniziati i lavori Servizio (S0–S4 + round agosto). Blindare = regressioni automatiche
verdi + gap critici coperti; non riaprire il masterplan S4 come piano incompleto.

**Punto di partenza operativo:**

1. `npm run mss:status` (atteso: WP-1 IN PILOTA ombra; T14; cutover no).
2. Fotografia test esistenti: tag `@admin-blindatura` / file `*servizio*` / e2e `pro-service*` /
   lifecycle — vedi indici in Testing + `ADMIN_TEST_SUITE_INDEX.md`.
3. Esegui batteria Servizio pertinente (Vitest mirato; E2E staging solo se ambiente ok — no PROD).
4. Per ogni rosso o buco: fix minimo + test che lo blocca.
5. FU aperti Servizio (`FU-SERV-MANOPOLE-CONSOLE-1`, `FU-SERV-TURNO-SALA-1`,
   `FU-SERV-BADGE-CASCATA-1`, …): **non** espandere scope senza sì Matteo; se emergono durante
   i test, registrali e chiedi priorità.

---

## Perimetro scrittura

| Consentito | Vietato |
|---|---|
| `src/pages/ServizioPage.tsx` e `src/features/booking/components/servizio/**` | Cutover / spegnere skill system vecchio |
| Hook/util Servizio collegati (`useServizioTables`, assignments, slot filter, …) | `src/` fuori Servizio/Calendario-digest solo se il test Servizio lo richiede esplicitamente — altrimenti STOP e chiedi |
| Test Vitest/Playwright Servizio + doc skill Admin/Testing se cambia comportamento | Migrazioni / scritture PROD / allentare validator MSS |
| Report istanza + capsula in `docs/Sessioni di lavoro/25-08-26/` | Dichiarare WP-1 CHIUSO |

Branch: `env/test`. Commit/push solo con sì Matteo.

---

## Criterio chiusura **istanza** (non di WP-1)

- Batteria Servizio dichiarata nel report: comandi + exit + cosa copre.
- Fix + test nuovi/estesi elencati; skill Admin/Testing allineate se layout/comportamento descritto cambia.
- Capsula con `controls[]` reali; Persona senza promozioni inventate.
- Handoff: cosa resta (gap test, FU, revisione fredda).

**Dopo questa chat:** revisione fredda (altra chat) riceve solo capsula + owner — non la narrativa completa.

---

## STOP

- Tree sporco non tuo / branch ≠ `env/test`
- Scope che diventa «tutto Admin» o rollout PROD
- Inventare fatti o metriche Persona
- «WP-1 chiuso» / cutover
