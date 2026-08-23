# Audit MSS — stato reale dopo le dichiarazioni del 23-08-2026

> **Fotografia verificata:** branch `env/test`, HEAD e `origin/env/test` `46b8bca`, working tree
> pulito al momento del controllo. Questo documento è la fonte delle rettifiche in `PLAN_V0.md`;
> non sostituisce il masterplan come owner dello stato.

## Esito

Il motore esiste e ha parti utili: `npm run test:mss` è verde (**42 fixture + 38 gruppi**),
`npm run test:mss:tools` è verde (**23 test**), query/status/capsule sono eseguibili e la CI ha
un job MSS reale. Il sistema è però **giallo**, non chiudibile: il gate locale è più debole della
CI, il generatore può registrare prove false, e le viste che un agente freddo leggeva erano stale.

## Fatti riprodotti

- **D1 — parità pre-commit/CI:** **chiuso in P1** — `.cursor/hooks/fine-sessione-commit-check.mjs`
  passa `requireCapsule: true`; le fixture H-1 restano escluse (stesso perimetro CI su
  `Report-*`/`Verbale-*`).
- **D2/D3 — prove false in `mss:capsule`:** invariati — gate A/B Matteo.
- **D4/D5 — numeri stale:** **chiusi in P1** — `mss:query --fail` calcola il denominatore;
  `PLAN_V0.md` §4-bis/allineamento `mss:status` senza 32 gruppi / 9 tools congelati.
- **D6/D7/D8:** hook Claude cablato solo in `settings.local.json` gitignored e non testato;
  `guard-prod.mjs` non ha test né CI.
- **D14:** il generatore promesso per ROADMAP/HANDOFF/indice non esiste; le due viste erano
  divergenti dal masterplan. Questa rettifica le riallinea, ma non sostituisce il generatore.

## Stato SK-7 e confine di integrazione

L’esecutore del fix SK-7 ha dichiarato il lavoro terminato durante questo audit. Al controllo,
però, il suo diff non era presente né nel working tree né in `origin/env/test`; le riproduzioni
D2/D3 sopra sono quindi riferite precisamente a `46b8bca`.

**Post-P0 (stessa data):** l’esecutore P0 ha cercato commit, branch, stash, PR, worktree e
transcript e **non ha recuperato** il diff. Ha riprodotto di nuovo D2/D3 e si è fermato senza
reimplementare. Prove e limiti:
`docs/Sessioni di lavoro/23-08-26/Report-p0-sk7-assenza-fix-23-08-26.md`. Per procedere serve
il patch originale oppure una nuova autorità esplicita di Matteo.

## Priorità operativa

1. **P0 — CONCLUSO COME ASSENZA:** fix dichiarato non recuperabile; D2/D3 ancora vivi; niente
   reimplementazione silenziosa. Gate successivo = Matteo A (patch) o B (autorità).
2. **P1 — D1 + D4/D5 — CHIUSO 23-08-26:** parità pre-commit/CI su `requireCapsule`; denominatori
   calcolati in `mss:query --fail`; celle owner §4-bis rettificate (SK-8, SK-11, SK-6). Report:
   `docs/Sessioni di lavoro/23-08-26/Report-p1-d1-d4-d5-23-08-26.md`.
3. **P2 — discovery e portabilità:** **P2A in corso** — manuale operativo
   [`MANUALE_OPERATIVO_MSS_V0.md`](MANUALE_OPERATIVO_MSS_V0.md) + puntatori ingresso; **P2B** export/bootstrap
   riproducibile ancora da fare. Primo risparmio token per agente freddo **nella repo attuale**.
4. **P3 — viste generate (`D14`) e `mss:move`:** eliminano la manutenzione manuale e rendono il
   sistema realmente agile. Non iniziarli prima di A/B + P1.
5. **P4 — sicurezza/copertura:** test del guard PROD, hook Claude e superfici capsule restanti.

## Limiti dell’audit

Questo è un audit tecnico, non una nuova chiusura di pacchetti e non una decisione `M3`.
I numeri del corpus sono dinamici: per il valore corrente eseguire `npm run mss:query` invece di
copiarli qui. Le prove complete sono nei comandi e nel diff del commit esaminato.
