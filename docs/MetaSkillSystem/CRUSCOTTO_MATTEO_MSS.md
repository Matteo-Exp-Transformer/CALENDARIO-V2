# Cruscotto MSS di Matteo

<!-- mss:generated cruscotto-matteo inizio -->
> Generato da `npm run generate:mss:views` leggendo il solo owner [`PLAN_V0.md`](PLAN_V0.md).
> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.

## Ultimo aggiornamento
`R1` è **CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2**: prova eseguibile, test nominato e controverifica Cursor/Composer sono registrati.

## L'ultimo ciclo chiuso

**Diciassettesimo ciclo del 25-08-2026** — `T10` eseguito e **CHIUSO**.

Mandato: M-H13-PASS Opzione B post M-E2-A..D @ HEAD `80e46f1`. Fonte: [`PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md) §P1.5 · [`Prompt-orchestratore-chiusura-rimanenze-mss-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Prompt-orchestratore-chiusura-rimanenze-mss-25-08-26.md).

**Atti:**
- [`PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/PLAN-CHIUSURA-RIMANENZE-MSS-25-08-26.md)
- [`Prompt-orchestratore-chiusura-rimanenze-mss-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Prompt-orchestratore-chiusura-rimanenze-mss-25-08-26.md)
- [`Report-e2-a-no-verify-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-e2-a-no-verify-25-08-26.md)
- [`Report-e2-b-unstaged-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-e2-b-unstaged-25-08-26.md)
- [`Report-e2-c-cloud-fallback-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-e2-c-cloud-fallback-25-08-26.md)
- [`Report-e2-d-light-enforcement-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-e2-d-light-enforcement-25-08-26.md)
- [`Report-h13-pass-e2-opzione-b-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-h13-pass-e2-opzione-b-25-08-26.md)
- [`Report-orchestratore-e2-opzione-b-25-08-26.md`](../Sessioni%20di%20lavoro/25-08-26/Report-orchestratore-e2-opzione-b-25-08-26.md)

## Cosa devi fare tu
R1 è **CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2**. Il prossimo gate è `T11` (P2 backlog: D14 ROADMAP/HANDOFF generate, R-T7-06 verify Output assertions; WP-1 resta NO-GO).

## Lavagna

*Fatte 18 · Con riserva 0 · Da fare 5 · Non classificate 2*

| Fatte | Con riserva | Da fare |
|---|---|---|
| `WP-0` Parametri macro e prima capsula del sistema | — | `WP-2` Mining storico normalizzato |
| `MP-0` Report osservazioni e masterplan unico | — | `WP-3` Kernel, manifest e pacchetti |
| `WP-0.1` Hardening prima del primo pilota | — | `WP-4` Preflight, registro Output e viste |
| `H-1.1` Integrità append-only e semantica eventi | — | `WP-5` Nuova suite di validazione |
| `H-1.3` Amendment, staged e parità tra superfici | — | `WP-6` Decisione di cutover |
| `WP-1` Piloti reali in modalità ombra | — | — |
| `SK-0` Sbloccare i cancelli globali (lint, test, validate) | — | — |
| `SK-1` Punto di ripristino con tag annotato | — | — |
| `SK-2` Comando «dove siamo» in sola lettura | — | — |
| `SK-3` Revisione seduta in sola lettura | — | — |
| `SK-4` Chiusura bypass e contratto capsula | — | — |
| `SK-5` Controlli MSS in CI su env/test | — | — |
| `SK-6` Interrogazione capsule in sola lettura | — | — |
| `SK-7` Generazione capsule da checklist | — | — |
| `SK-8` Suite test eseguibile da cwd esterna | — | — |
| `SK-9` Spostamento file con aggiornamento riferimenti | — | — |
| `SK-10` Manuale operativo e bootstrap | — | — |
| `SK-11` Test automatici degli attrezzi MSS | — | — |

**Non classificate (M):**
- `H-1` Validator e hook rapidi (prima tranche) — _chiusura invalidata dalla revisione H-1.1_
- `E-2` Enforcement superiore (ancora da decidere) — _buco intenzionale_

## Riserve aperte

- `SK-2` (Comando «dove siamo» in sola lettura): ⚠️ ROADMAP/HANDOFF restano viste manuali fino a estensione dedicata
- `SK-6` (Interrogazione capsule in sola lettura): ⚠️ copertura test del lettore parziale (suite tools, non H-1 intero) · rettificato 22-08-26: capsula `SK-6` corretta con `amendment`; criterio revisori su `recorded_by.role` · ✅ **23-08-26 vista effettiva:** `query.mjs` delega `core.mjs::applyAmendmentsView()` · ✅ **23-08-26 P1:** `--fail` usa denominatori calcolati, non literal storici · revisioni/controlli: numero mobile → `npm run mss:query -- --verifica` · **Matteo ha dichiarato `SK-6` CHIUSO (`D16`)**

## Prossimo passo

Completare `T11`. Non riaprire `WP-1` (`H-1.3` PASS ≠ via libera pilota).
<!-- mss:generated cruscotto-matteo fine -->
