# Cruscotto MSS di Matteo

<!-- mss:generated cruscotto-matteo inizio -->
> Generato da `npm run generate:mss:views` leggendo il solo owner [`PLAN_V0.md`](PLAN_V0.md).
> Questa vista non possiede stato: se il controllo anti-stale e rosso, rigenerala; non correggerla a mano.

## Ultimo aggiornamento
`R1` è **CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2**: prova eseguibile, test nominato e controverifica Cursor/Composer sono registrati.

## L'ultimo ciclo chiuso

**Tredicesimo ciclo del 25-08-2026** — `T6` eseguito e **CHIUSO**.

Revisione indipendente Cursor [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md): `PASS_CON_RISERVE` sul ciclo intero. Firma verbatim Matteo: «Firmo SK-4 e SK-8 come CHIUSO dopo revisione Cursor del 25-08-26.» Commit unico del working tree T6 su `env/test` (no push finché Matteo non autorizza). Batch `--verify` post-commit in [`Report-batch-verify-t6-post-commit-25-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md).

**Atti:**
- [`Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-revisione-indipendente-ciclo-t6-codex-24-08-26.md)
- [`Report-batch-verify-t6-post-commit-25-08-26.md`](../Sessioni%20di%20lavoro/24-08-26/Report-batch-verify-t6-post-commit-25-08-26.md)

## Cosa devi fare tu
R1 è **CHIUSO CON RISERVE — M12 soddisfatto; riserva busta ridotta in T2**. Il prossimo gate è `T8` (pubblicazione commit T7+T9 con sì Matteo; preferibile fix Codex M12 T7 mirati prima del commit; riapertura `D27`/`WP-1` solo in chat dedicata dopo atti pubblicati).

## Lavagna

*Fatte 16 · Con riserva 1 · Da fare 6 · Non classificate 2*

| Fatte | Con riserva | Da fare |
|---|---|---|
| `WP-0` Parametri macro e prima capsula del sistema | `H-1.3` Amendment, staged e parità tra superfici | `WP-1` Piloti reali in modalità ombra |
| `MP-0` Report osservazioni e masterplan unico | — | `WP-2` Mining storico normalizzato |
| `WP-0.1` Hardening prima del primo pilota | — | `WP-3` Kernel, manifest e pacchetti |
| `H-1.1` Integrità append-only e semantica eventi | — | `WP-4` Preflight, registro Output e viste |
| `SK-0` Sbloccare i cancelli globali (lint, test, validate) | — | `WP-5` Nuova suite di validazione |
| `SK-1` Punto di ripristino con tag annotato | — | `WP-6` Decisione di cutover |
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

- `H-1.3` (Amendment, staged e parità tra superfici): ⚠️ restano i **bypass E2 intenzionali** (`--no-verify`, unstaged, Cloud/Codex/Claude senza hook, …): **`PASS` pulito non è dichiarato** bypass E2 residui; **non** apre WP-1; G5 non PASS
- `SK-2` (Comando «dove siamo» in sola lettura): ⚠️ ROADMAP/HANDOFF restano viste manuali fino a estensione dedicata
- `SK-6` (Interrogazione capsule in sola lettura): ⚠️ copertura test del lettore parziale (suite tools, non H-1 intero) · rettificato 22-08-26: capsula `SK-6` corretta con `amendment`; criterio revisori su `recorded_by.role` · ✅ **23-08-26 vista effettiva:** `query.mjs` delega `core.mjs::applyAmendmentsView()` · ✅ **23-08-26 P1:** `--fail` usa denominatori calcolati, non literal storici · revisioni/controlli: numero mobile → `npm run mss:query -- --verifica` · **Matteo ha dichiarato `SK-6` CHIUSO (`D16`)**

## Prossimo passo

Completare `T8`. Non riaprire `WP-1` e non dichiarare `H-1.3` PASS pulito.
<!-- mss:generated cruscotto-matteo fine -->
