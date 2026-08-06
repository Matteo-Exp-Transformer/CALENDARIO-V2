# H5 — Parallelo e luglio: Trade-Analyst, Trading-Platform, BHM

> **Ondata:** H5 · **Data:** 06-08-26 · **Regime:** scavo · **Peso fonti:** **1** (parole sue)
> **Perimetro:** `docs/_lavoro/Indagine-Corpus/` —
> `prompts_Trade-Analyst.jsonl` (95) · `prompts_Trading-Platform.jsonl` (69) ·
> `prompts_BHM-v2.jsonl` (51) · `prompts_BHM-Zen.jsonl` (18) → **233 msg**
> **Metodo:** identico a H1 (PIANO §2.1 REDACTED, §3.3 attribuzione). Citazioni da `text_umano`;
> fonte = `chat_uuid` + `seq` + `date`. Mai citare `has_secret=true`.
> **Focus (prompt):** gestione multi-progetto; export vs abbandono del metodo CB; perché torna a CB ad agosto.

---

## Numeri di ritmo (obbligatori H)

| Voce | Valore |
|------|--------|
| Messaggi nel perimetro | **233** (conteggio file = tracking) |
| **M-VOCE** | **205** (di cui 4 `has_secret` → non citabili; **201** leggibili) |
| **M-REGIA** | **12** (4 Trade-Analyst 06-06 · 8 Trading-Platform 03–04-07) |
| **M-PASTE** | **6** (solo Trading-Platform) |
| **M-OK** | **10** (`lavoro ok` / `procedi` / `fai report finale` / `confermo`) |
| Chat | **60** (16+21+17+6) |
| Media caratteri M-VOCE (no secret) | **892** (mediana **152**) — media gonfiata da paste lunghi e brief prodotto BHM |
| `date_src=msg` | **133/233 (57%)** — Trade-Analyst ~0% msg-date; luglio quasi tutto `msg` |
| Periodo | Trade-Analyst **20-05 → 06-06** · Trading-Platform **03-07 → 05-07** · BHM **05-07 → 09-07** |

**Per progetto (M-VOCE no secret):**

| Progetto | N | Media char | Mediana | Nota |
|----------|---|------------|---------|------|
| Trade-Analyst | 86 | 431 | 164 | parallelo a CB-v2 (mag–giu) |
| Trading-Platform | 48 | 191 | 102 | luglio “buco” CB |
| BHM-v2 | 49 | 1788 | 206 | coda lunga = paste errori / prompt agenti |
| BHM-Zen | 18 | 2524 | 238 | 1 brief onboarding 4241 char |

**Vocabolario di comando in M-VOCE/M-OK (substring, non sommare con REGIA):**

| Parola | N | Dove |
|--------|---|------|
| `lavoro ok` | 10 | Trade 06-06 + Trading 03–04-07 — **metodo CB già operativo fuori da CB** |
| `prepara` / prepara prompt | 18 | tutti e 4 i progetti |
| `controverifica` | 14 | Trade 06-06 + BHM-v2 fase 3 parallela |
| `fai report` | 8 | Trade + Trading + BHM-Zen |
| `ragioniamo` | 2 | **solo Trade 06-06** — qui lo **definisce** come Liv 1 |
| `spiegamelo` / `dammi follow` | **0** | |
| `annulla` | 3 | Trading logo + rumore |
| `ripristina` | 2 | BHM-v2 dual-repo |

**Verdetto focus (prima delle tabelle):**
1. **Parallelo mag–giu confermato:** Trade-Analyst gira mentre CB-v2 è al picco (overlap con H2/H3).
2. **Metodo CB esportato, non abbandonato:** skill-system-v0, `lavoro ok`, prepara, controverifica, ramo scolastico, hooks fine-sessione → Trade; bussola skill → Trading-Platform; controverifica multi-agente + catalogo → BHM.
3. **Luglio non è pausa:** Trading-Platform (demo/vendita/console) + BHM-v2/Zen (rilancio HACCP) riempiono 03–09-07.
4. **Perché torna a CB ad agosto:** **non detto** in questo corpus → lacuna §6 (A11 / H3 / J1).

---

## Sezione 1 — Decisioni

Decisioni ad alta densità. Paste di prompt strutturali classificati M-VOCE ma nati come regia → **non** usati come ORIGINATE di prodotto; le decisioni sotto sono da messaggi corti/medi suoi o da scelte esplicite dentro chat.

### Trade-Analyst — mag–giu (parallelo a CB)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H5-D01 | 20-05-26 | PROCESSO | Push cartella su GitHub Trade-analyst-agent | MATTEO | ORIGINATA | `31c626ef` seq=1 | «facciamo il push… Trade-analyst-agent» | multi-repo-bootstrap |
| H5-D02 | 20-05-26 | SICUREZZA | MCP `supabase-TradeAgent` in mcp.json | MATTEO | ORIGINATA | stesso seq=3 | «puntare anche a supabase-TradeAgent» | env-wiring |
| H5-D03 | 21-05-26 | AI-METODO | Esegui plan theme sotto SKILL-0 | MATTEO | APPROVATA | `a38c89ad` seq=1 | «vincolati a skill system… esegui plan» | skill-binding |
| H5-D04 | 21-05-26 | SICUREZZA | Migration RLS `auth.uid()` → `(select auth.uid())` | MATTEO | ORIGINATA | `db2ebf81` seq=1 | «fixare tutti i warning auth_rls_initplan» | rls-hardening |
| H5-D05 | 22-05-26 | TESTING | 1 modello per volta / meno chiamate inutili | MATTEO | ORIGINATA | `dd8dfbf9` seq=10 | «preferisco testare 1 modello alla volta» | cost-aware-testing |
| H5-D06 | 22-05-26 | AI-METODO | Procedura agente: scopri→testa→aggiorna risultati-modelli | MATTEO | ORIGINATA | stesso seq=11 | «agente sappia… cercare modelli… aggiornare risultati-modelli» | ai-model-testing |
| H5-D07 | 22-05-26 | COMPLIANCE | Vincoli OpenRouter: injection + PII block/redact | MATTEO | SCELTA | stesso seq=4 | «Social security… Block… IP… Redact» | provider-guardrails |
| H5-D08 | 06-06-26 | AI-METODO | Integrare ciclo sessione da template `_skill-system-v0` | MATTEO | ORIGINATA | `ecf16dc6` seq=1 | «integrare il ciclo sessione da… _skill-system-v0» | method-export |
| H5-D09 | 06-06-26 | AI-METODO | Skill operative in `/.cursor` e `/.claude` | MATTEO | ORIGINATA | stesso seq=2 | «skill dovrebbero essere in /.cursor e in /.claude» | dual-ide-skills |
| H5-D10 | 06-06-26 | AI-METODO | All’avvio: Skill-0 + comunicazione sempre | MATTEO | ORIGINATA | stesso seq=3 | «ad ogni avvio… skill - 0… e skill comunicazione» | always-on-skills |
| H5-D11 | 06-06-26 | AI-METODO | «Ragioniamo» = Liv 1 (tabellina+checklist) | MATTEO | ORIGINATA | `c1eee221` seq=2 | «Ragioniamo = attiva quel patten… Liv 1» | vocab-command |
| H5-D12 | 06-06-26 | FORMAZIONE | Tenere ramo scolastico nel plan (non tagliare) | MATTEO | CORRETTIVA | `6ca0bc85` seq=3 | «manteniamo ramos colastico… non rimuoviamolo» | didattica-owner |
| H5-D13 | 06-06-26 | TESTING | Blindata solo dopo controtest sub-agent | MATTEO | CORRETTIVA | `0f0185db` seq=2 | «sara blindataquando… controtestata con sub agent» | blindatura-gate |
| H5-D14 | 06-06-26 | AI-METODO | Controverifica login con sub-agent | MATTEO | ORIGINATA | stesso seq=4 | «controverifica con sistema di sub agent… login» | controverifica |
| H5-D15 | 06-06-26 | AI-METODO | Manca «prepara prompt» → se assente lo passa lui | MATTEO | ORIGINATA | `c1eee221` seq=4 | «manca prepara prompt… ti passo la skill» | prepara-port |
| H5-D16 | 06-06-26 | TESTING | Priorità assoluta modelli FREE OpenRouter | MATTEO | ORIGINATA | `6e56eb71` seq=4 · `710e1dab` seq=3 | «priorità a agenti gratis» · «dobbimo trovarne 1 compatibile» | free-first-models |
| H5-D17 | 06-06-26 | AI-METODO | Docs esperti: cancella risolti, non «fixato X» | MATTEO | ORIGINATA | `7596f06c` seq=1 | «se un problema non c'è piu semplicemente cancellalo» | docs-hygiene |
| H5-D18 | 06-06-26 | AI-METODO | Snellire skill → v.0 riadattabile ad altro sistema | MATTEO | ORIGINATA | stesso seq=3 | «v.0 da poter riadattare a un sistema… diverso» | method-portable |
| H5-D19 | 06-06-26 | AI-METODO | Rimuovere template `_skill-system-v0` post-import | MATTEO | SCELTA | `ccb6f710` seq=1 | «posso rimuoverla ora dal progetto?» | template-lifecycle |

> **Nota no-compra/vendi:** nei messaggi del 06-06 compare in **prompt incollati** (guardrail PDR §8.3). Non c’è in H5 una frase corta sua che *origina* il divieto; resta handoff a E1/doc prodotto per ownership primaria. Qui: **usa** il vincolo nei test (D16), non lo inventa in voce breve.

### Trading-Platform — luglio (dentro il “buco” CB)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H5-D20 | 03-07-26 | VENDITA | Identità demo v.0 + legale + costi infra/manutenzione | MATTEO | ORIGINATA | `e0162167` seq=1 | «definire… identità prodotto demo… e identità legale» | go-to-market |
| H5-D21 | 03-07-26 | VENDITA | Prezzo floor >39€; curva costo/utente + AI | MATTEO | ORIGINATA | stesso seq=3 | «prezzo superiore a 39 €» · «canone minimo utente» | pricing-floor |
| H5-D22 | 03-07-26 | PRODOTTO | Pin Home: max N per categoria + alert su swap | MATTEO | ORIGINATA | `7d55f6d6` seq=4 | «potrò pinnare SOLO 1… se 3… ne posso pinnare 3» | content-pinning |
| H5-D23 | 03-07-26 | AI-METODO | Usa bussola skill + prepara prompt | MATTEO | APPROVATA | stesso seq=1 | «usa skill prepara prompt» | method-reuse |
| H5-D24 | 03-07-26 | PROCESSO | A volte: report sì, skill system no | MATTEO | SCELTA | `6696d423` seq=2 | «fai report… non aggiornare skill system» | skill-hygiene |
| H5-D25 | 03-07-26 | PROCESSO | Altre volte: aggiorna skill + commit/push | MATTEO | SCELTA | `c4016fc9` seq=3 | «aggiorna skill system… commit e push» | skill-hygiene |
| H5-D26 | 04-07-26 | PRODOTTO | Branch console MINI (3 sezioni) per demo | MATTEO | ORIGINATA | `4840dbee` seq=1 | «versione MINI… Panoramica - Utenti - Engagment» | demo-scoping |
| H5-D27 | 04-07-26 | PROCESSO | Due branch: completo + parziale | MATTEO | ORIGINATA | stesso seq=2 | «2 branch : questo completo e l'altro… parziale» | release-branching |
| H5-D28 | 04-07-26 | VENDITA | Piano B: skill+contesto a modello esterno se demo locale fallisce | MATTEO | ORIGINATA | `0604396d` seq=1 | «piano b… presentazione… non funzioni» | demo-fallback |
| H5-D29 | 04-07-26 | PROCESSO | Diagnosi deploy Vercel analisi fallita | MATTEO | ORIGINATA | `8954dea3` seq=1 | «deploy su vercel… Analisi non riuscita» | deploy-debug |

### BHM-v2 / BHM-Zen — luglio (cambio progetto, non pausa)

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| H5-D30 | 05-07-26 | PROCESSO | Catalogare TUTTO il materiale divulgativo (fase 1) | MATTEO | ORIGINATA | `6cfb9a6c` seq=10 · `ed72208f` | «CATALOGARE TUTTO… ricostruire stato del progetto» | doc-inventory |
| H5-D31 | 05-07-26 | TESTING | Bug temperatura reale → handoff plan parallelo sola lettura | MATTEO | ORIGINATA | `7e97f76d` seq=2 | «bug è reale… piu agenti… sola lettura» | parallel-audit |
| H5-D32 | 05-07-26 | TESTING | Controverifica parallela 8 agenti A0–A7 | MATTEO | APPROVATA | plan + `185e0c6f`… | «Sei agente A5 procedi» (×N) | parallel-audit |
| H5-D33 | 05-07-26 | AI-METODO | File introduttivo per senior: doc vs codice reale | MATTEO | ORIGINATA | `f5e18ef1` seq=1 | «cosa dice app di se e… cosa è reale nel codice» | senior-brief |
| H5-D34 | 06-07-26 | PROCESSO | Nuova repo BHM-Zen + stesso DB; CLI per Fable | MATTEO | ORIGINATA | `70c4dcc9` seq=2 | «nuova repo… stesso identico DB» | repo-split |
| H5-D35 | 06-07-26 | AI-METODO | Fable libero: co-owner, decide senza OK continuo | MATTEO | ORIGINATA | `ac8dbaa0` seq=3 | «si sentisse il proprietario… senza chiedermi autorizzazioni» | agent-autonomy-mandate |
| H5-D36 | 06-07-26 | AI-METODO | Verifica porte d’ingresso skill system Zen | MATTEO | ORIGINATA | `18babc92` seq=1 | «orientarti… skill system… completo o da completare» | skill-audit |
| H5-D37 | 06-07-26 | PRODOTTO | Lessico: PDC, cascata, timbro, regtemp, prova haccp… | MATTEO | ORIGINATA | stesso seq=3 | «prova haccp = tutti i dati… per controlli haccp» | domain-lexicon |
| H5-D38 | 06-07-26 | UI-UX | Niente HTML di default; solo su richiesta | MATTEO | CORRETTIVA | stesso seq=4 | «lasciamo da parte HTML… sarò io a chiedere» | mockup-discipline |
| H5-D39 | 06-07-26 | AI-METODO | Dopo Fable: senior blindatura doc+codice prima di divergere | MATTEO | ORIGINATA | stesso seq=5 | «BLINDARE… prima di andare a disallinearci» | freeze-baseline |
| H5-D40 | 07-07-26 | PROCESSO | BHM-v2 = docs/legacy UI; Zen = rebuild | MATTEO | ORIGINATA | `ac201b7b` seq=1 | «solo creare documentazione… rifare… BHM Zen» | dual-track |
| H5-D41 | 09-07-26 | PROCESSO | Porte separate 3000/3010 per due repo aperte | MATTEO | ORIGINATA | stesso seq=10 | «imposta questa repo con porta 3010» | multi-repo-ops |
| H5-D42 | 09-07-26 | PRODOTTO | Onboarding Regia: telefono, ruoli vs categorie, PDC… | MATTEO | ORIGINATA | `d813a018` seq=1 | «Ruolo = preset… Categoria = assegnazione… SOLO 1 ruolo… N categorie» | haccp-onboarding |

**Totale decisioni catalogate: 42.**

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| H5-A01 | M→A | DIRETTA | «no no» — solo prompt rules+ragioniamo, non altro | accettata | Trade `7596f06c` seq=13 |
| H5-A02 | M→A | DIRETTA | Annulla allungamento logo + riduci/alza | accettata | Trading `dd9ef1b2` seq=8 |
| H5-A03 | M→A | DIRETTA | Serie micro-fix logo (scala/posizione/colore) | parziale | stesso seq=3–7 |
| H5-A04 | M→A | DIRETTA | Ripristina UI vecchia in BHM-v2 senza perdere docs | accettata | BHM-v2 `ac201b7b` seq=1 |
| H5-A05 | M→A | DIRETTA | Controtest: app parte senza login → aggiungi al report | accettata | Trade `0f0185db` seq=2 |
| H5-A06 | M→A | DIRETTA | Docs: non scrivere «fixato», cancella risolti | accettata | Trade `7596f06c` seq=1 |
| H5-A07 | A→M | DEDOTTA | Accetta layout skill .cursor/.claude proposto | accettata | Trade `ecf16dc6` seq=2→3 |
| H5-A08 | A→M | DEDOTTA | «hai ragione» su env.local cambiato | accettata | BHM-v2 `ac201b7b` seq=1→2 |
| H5-A09 | A→M | DEDOTTA | Chiede prepara-prompt dopo gap in chiusura §11 | accettata | Trade `c1eee221` seq=3→4 |
| H5-A10 | M↔M | DIRETTA | A volte aggiorna skill, a volte vieta aggiornarla | ignota | Trading D24 vs D25 |
| H5-A11 | M→A | DIRETTA | Fermarsi dopo 5 free model che non rispondono | accettata | Trade `710e1dab` seq=3 |

**Sintesi agency:** fuori da CB continua lo stesso schema — **M→A forte** su UI e su metodo; **A→M solo DEDOTTE** (REDACTED). Pochi «annulla» rispetto a H1 (qui più orchestration e vendita).

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Prova in H5 | Contro-evidenza cercata |
|-------|---------------------|-------------|-------------------------|
| `method-export` / `method-portable` | **L3** | D08–D11, D15, D18, D23 — porta skill-system / prepara / ragioniamo / controverifica su Trade e Trading | Contro: in BHM-Zen delega ampia a Fable (D35) = metodo diverso, non abbandono totale |
| `vocab-command` (`ragioniamo` Liv 1) | **L4?** | D11 + richiesta di portare la voce nel template | **Decade a L3 qui**: file di regola finale è su altro repo; conferma in M1 se voce CB = stessa |
| `multi-project-ops` | **L3** | D01, D34, D40–D41; parallelo temporale mag–giu | Contro: confusione porte/env tra due repo (A08, D41) |
| `parallel-audit` / `controverifica` | **L3** | D14, D31–D32 | Contro: molti handoff «lavoro a metà» (Trading `4310503a`) |
| `cost-aware-testing` / `free-first-models` | **L2** | D05–D06, D16 | Contro: chat analisi fallisce senza modello abbinato (`1965c3c8` seq=9) |
| `go-to-market` / `pricing-floor` | **L2** | D20–D21, D28 | Contro: calcolatore HTML «guadagno scende» (D21) — bug lasciato a senior |
| `demo-scoping` | **L2** | D26–D27 | — |
| `agent-autonomy-mandate` | **L2** | D35 Fable libero | Contro: subito dopo chiede senior blindatura (D39) — autonomia sì, ma con freeze |
| `haccp-onboarding` / `domain-lexicon` | **L2** | D37, D42 | — |
| `pixel-control` (logo) | L1–L2 | A02–A03 | Stesso loop H1 su altro prodotto |
| `no-operational-signals` (no buy/sell) | **L1** in H5 | Solo in prompt incollati | Cercata ORIGINATA M-VOCE breve: **non trovata** → E1 |

---

## Sezione 4 — Contro-evidenze

1. **Loop pixel sul logo Trading** (A02–A03): stesso pattern H1, su prodotto diverso — la skill di method-export **non** elimina la micro-gestione UI.
2. **Dual-repo confusione** (BHM-v2 vs Zen): chiede ripristino, poi «hai ragione» sull’env, poi porte 3000/3010 — multi-progetto reale ma **operativamente costoso**.
3. **False M-VOCE:** ~27 messaggi paste-ish (prompt strutturali, «Implement the plan», nudge Cursor, «Sei agente A…») gonfiano media caratteri; non usati come decisioni ORIGINATE.
4. **Handoff frequenti per chat interrotte** (Trading senior, console): orchestrazione forte, chiusura debole.
5. **D24 vs D25:** a volte vieta aggiornare lo skill system, a volte lo impone — ritmo non ancora regola stabile.
6. **Perché torna a CB ad agosto:** cercata attivamente (grep calendarbackup/ristorante/servizio/torno) — **nessuna dichiarazione** in H5. Non inventare motivazione.
7. **Cercata A→M DIRETTA:** impossibile (REDACTED); solo DEDOTTE. Cercata ORIGINATA M-VOCE del no-buy/sell: **non in questo perimetro**.

---

## Sezione 5 — Copertura dichiarata

| Voce | Numero |
|------|--------|
| File corpus nel perimetro | **4** |
| Messaggi totali | **233** (95+69+51+18) |
| M-VOCE aperti/letti | **205 (100%)** — dump + short/medium + spy/vocab |
| M-VOCE `has_secret` (letti, non citati) | 4 |
| M-REGIA | **12** tutti aperti (campione citato; non contati come voce) |
| M-PASTE / M-OK | 6 campionati / **10** tutti |
| File illeggibili | 0 |
| Tmp di scavo | `_stato/_tmp_H5_*` |

---

## Sezione 6 — Lacune e handoff

- **A11 / H3 / J1:** perché riprende CalendarBackup ad agosto (Servizio) — assente qui.
- **E1:** ownership primaria «no compra/vendi» / PDR; H5 conferma solo **uso** nei test free.
- **E2 / F1:** artefatti smoke vs queste parole — confronto per S4.
- **B1 / B\*:** report BHM «owner» vs queste M-VOCE (D35–D42) — validazione attribuzione.
- **M1:** se `ragioniamo` Liv 1 di Trade (D11) = stessa voce in VOCABOLARIO CB → rivalutare L4.
- **I2:** piani vendita/console Trading e fase_3 BHM — scoping vs completamento.
- **S3/S5:** freccia di trasferimento metodo CB → Trade → Trading → BHM è il risultato centrale di H5.
- **Limite date:** Trade-Analyst quasi tutto `date_src=file` — mese ok, giorno no.

---

## Sezione 7 — Chiusura verso Matteo

A maggio–giugno non stavi “solo” su CalendarBackup: tenevi aperto anche Trade Analyst (push, test modelli gratis, skill system), mentre a luglio il “buco” di CalendarBackup era pieno di Trading Platform (demo, prezzi, console) e di BHM (catalogo, controverifica parallela, Zen con Fable).
Il metodo che avevi costruito su CalendarBackup **non lo hai lasciato**: lo hai portato (prepara, lavoro ok, controverifica, ragioniamo, template skill) e lo hai adattato progetto per progetto.
Perché a inizio agosto sei tornato su CalendarBackup: in queste chat **non lo dici** — va cercato nelle sessioni di ripresa Servizio, non inventato qui.
