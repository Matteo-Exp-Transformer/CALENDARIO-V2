# Prompt — chat dedicata D27 / prima istanza WP-1 (ombra)

> **Uso:** incolla in una **nuova** chat su branch `env/test` con worktree **pulito**.
> **Owner stato:** `docs/MetaSkillSystem/PLAN_V0.md` (gate **`T14`**).
> **Bozza contratto:** [`Report-verifica-post-t12-d27-prep-wp1-25-08-26.md`](Report-verifica-post-t12-d27-prep-wp1-25-08-26.md) §5–§6.
> **Non** aprire WP-1 senza la frase verbatim di Matteo sotto.

---

## Intestazione agente (obbligatoria)

```
Profilo: Meta (orchestratore / prep pilota MSS)
Modalità: deep
Skill da leggere:
  - docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md
  - docs/MetaSkillSystem/MANUALE_OPERATIVO_MSS_V0.md
  - docs/MetaSkillSystem/PLAN_V0.md §4 · §4-bis · §15 (header + T13/T14)
  - docs/Sessioni di lavoro/25-08-26/Report-verifica-post-t12-d27-prep-wp1-25-08-26.md §5–§6
  - docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
Non caricare: corpus storico non puntato · Senior-Eval intero · migrazioni · Supabase scritture
```

---

## Passo 0 — fotografia (sola lettura)

1. `git branch --show-current` deve essere `env/test`; altrimenti STOP e avvisa Matteo.
2. `git status -sb` deve essere **pulito**; altrimenti STOP — niente D27 su tree sporco.
3. `npm run mss:status` — atteso: `T13` CHIUSO; prossimo `T14`; `WP-1` **NO-GO**; viste anti-stale allineate; HEAD = origin.
4. Conferma in una riga: atti T13 pubblicati (`c361f2c` o successivo su origin). Se manca, STOP.

Poi parla a Matteo in italiano diretto (max 1–3 domande). Niente griglie A/B/C lunghe. Niente sigle senza traduzione.

---

## Decisioni di Matteo (in quest’ordine; una per messaggio se serve)

**D1 — Riapertura (bloccante)**  
Frase verbatim richiesta per proseguire:

> Riapro D27 e autorizzo WP-1 in modalità ombra

- Se **No** / altra formula → chiudi seduta senza toccare PLAN; WP-1 resta NO-GO.
- Se **sì con quella frase** → sola allora aggiorna owner (sotto).

**D2 — Lavoro reale dell’app (obbligatorio se D1 = sì)**  
Quale schermata/flusso concreto usare come **prima istanza** (es. una modifica su Prenota, Menu QR, Admin…)?  
Deve essere lavoro **vero** sull’app Calendario, non calibrazione finta.

**D3 — Utile vs fallimento (default proposti; conferma o correggi)**  
- **Utile:** revisore freddo ricostruisce da capsula/owner senza inventare; raccolta minima completa o esplicitamente `non_osservato`; vecchio skill system ancora usabile come confronto; costo di cattura registrato.  
- **Fallimento:** inventare fatti; perdere vitali; dichiarare WP-1 «finito» dopo una sola istanza; cutover implicito; promuovere Persona da una seduta assistita.

**D4 — Vecchio skill system**  
Resta il confronto operativo per tutto WP-1? **Default: sì.**

Finché D1–D2 non sono chiuse, **non** consegnare il prompt dell’esecutore pilota e **non** aggiornare PLAN.

---

## Se D1 = sì (verbatim) — atti owner

Aggiorna solo ciò che serve, con prove:

1. `PLAN_V0.md` §4 riga `WP-1`: da `NO-GO` a stato autorizzato per pilota ombra (es. `APERTO` / `IN PILOTA` secondo vocabolario PLAN), citando riapertura `D27` + data + verbatim.
2. `PLAN_V0.md` §15: ciclo `T14` — decisione D27 registrata; prima istanza = lavoro scelto in D2; cutover **vietato**.
3. `npm run generate:mss:views` (e se usi HTML: `npm run mss:views-html`).
4. Report breve della seduta decisione + capsula con `mss:capsule` (giudizi espliciti).
5. Commit/push **solo** se Matteo dice sì esplicito.

**Vietato:** cutover (`WP-6`); dichiarare `SEP-G5` PASS; chiudere WP-1 dopo una sola istanza; inventare metriche Persona; allentare validator.

---

## Contratto prima istanza (da bozza prep — non inventare altro)

| Voce | Contenuto |
|---|---|
| Protocollo | `MSS-PILOT-001` · capsula `mss.session/0.1.1` / `freeze-2` |
| Modalità | **ombra** — vecchio skill system attivo come confronto |
| Cutover | **vietato** |
| Chiusura WP-1 | **non** dopo una sola istanza (servono anche light · standard/deep · interrotta/compact · annotazione ritardata — PLAN §7) |

Raccolta minima: correzioni prompt, retry, tempo/costo attribuito, `controls[]` reali, errori/regressioni, decisioni Matteo verbatim, follow-up. `non_osservato` è valido.

**Verifica fredda (dopo la prima istanza):** revisore riceve solo capsula + owner necessari; ricostruisce senza narrativa completa né verdetto atteso.

---

## Output obbligatori di questa chat

1. Verdetto D1 (sì/no) in una riga.  
2. Se sì: PLAN/viste aggiornati + report/capsula.  
3. **Prompt esecutore** della prima istanza (copia-incolla), con: profilo area app scelta, file skill d’area da `APP_CONTEXT_SKILL.md` §0, perimetro MSS ombra, divieti, criterio di chiusura istanza (non di WP-1 intero).  
4. Handoff: prossimo passo atomico (istanza → revisione fredda).

---

## STOP

- Worktree sporco o branch ≠ `env/test`
- Frase D27 assente o diversa
- Tentativo di cutover o di «WP-1 chiuso» dopo una chat
- Lavoro `src/` fuori dal task D2 scelto da Matteo
