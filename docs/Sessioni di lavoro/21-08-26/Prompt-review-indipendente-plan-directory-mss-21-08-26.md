# Prompt — Review indipendente del plan directory / export / sandbox MSS

> **Uso:** nuova chat · profilo **Verifica** · modalità **deep** · **revisore ≠ writer**.
> **Configurazione richiesta:** modello di famiglia **diversa** da quella che ha scritto il piano
> (il piano è di un AGC Anthropic; le review precedenti erano Cursor/Grok e Codex). È la prima
> occasione di indipendenza **non soft** del pacchetto: non sprecarla usando la stessa famiglia.
> **NON è** esecuzione: nessun move, nessun `mkdir`, nessun `paths.mjs`, nessun tag, nessuna sandbox.
> **Soggetto:** `docs/Sessioni di lavoro/21-08-26/Report-plan-directory-export-sandbox-mss-21-08-26.md`
> **Owner pack:** `MASTERPLAN_V0.md` §6 · **SYS-1:** `PLAN_V0.md`.
> **G5 non PASS. WP-1 NO-GO. H-1.3 = PASS_CON_RISERVE (H13-POST-L01).**
> Commit solo con «lavoro ok» / «fai report finale». Push solo con Sì.

Copia da «Profilo:» in giù nella chat nuova.

---

Profilo: Verifica — revisione indipendente avversariale (read-only; zero esecuzione)
Modalità: deep (alzabile; mai abbassare)
Soggetto della review: docs/Sessioni di lavoro/21-08-26/Report-plan-directory-export-sandbox-mss-21-08-26.md
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/SENIOR_EVAL_SKILL.md; docs/MetaSkillSystem/Senior-Eval-Pack/MASTERPLAN_V0.md (stato/gate — vince su ogni altra fonte); docs/MetaSkillSystem/Senior-Eval-Pack/CONTRATTO_EVAL_SENIOR_V0.md (forma della verifica); docs/MetaSkillSystem/PLAN_V0.md (owner SYS-1, read-only); docs/MetaSkillSystem/archive/README.md (livelli L1–L6, freeze, policy stub D5); docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B1-sintesi-piano-migrazione.md (il piano precedente, §4–§6); docs/Sessioni di lavoro/10-08-26/SEP-10-archiviazione/Report-B2-review-piano-migrazione.md (metodo di review da imitare, non da copiare); docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md
Non caricare: docs/_lavoro/** (contenuti); src/; il verdetto atteso; qualsiasi chat del writer; WP-1; SEP-5
Prove obbligatorie: foto Git tua (branch, HEAD, staging, working tree); ri-esecuzione di `npm run test:mss`; ispezione diretta dei file citati come prova dal piano (non fidarti delle citazioni: aprili); `git status` a fine review identico a quello di inizio sul dominio MSS
Mandato Matteo: attaccare il piano, non approvarlo. Cercare controesempi. Produrre un verdetto attribuito e riproducibile, e i finding che restano dopo la controprova.
Output atteso: docs/Sessioni di lavoro/21-08-26/Report-review-indipendente-plan-directory-mss-21-08-26.md
L'esecutore può solo ALZARE la modalità, mai abbassarla.

════════════════════════════════════════
OBIETTIVO
════════════════════════════════════════

Stabilire se il piano directory/export/sandbox è **usabile da Matteo per decidere** — e a quali
condizioni. Non stabilire se è «bello». Non eseguirne nemmeno la prima fase.

Un verdetto positivo **non** apre `SEP-G5`, **non** sana H-1.3 e **non** autorizza alcun move.

════════════════════════════════════════
QUADRO (non perdere)
════════════════════════════════════════

- Branch `env/test`. Baseline tecnica dichiarata dal piano: `ee0ab39`, sincronizzata con `origin/env/test`.
- Il piano afferma che la chiusura documentale `037` è **non committata** e vive nel working tree.
  Verificalo: è un'affermazione che contraddice il prompt `036`.
- `SEP-11` = `IN_CORSO`. F1–F4-doc fatti. F5 **non** fatto. `SEP-G5` **non** PASS.
- L5 (fixtures, tests/h1, COVERAGE_MATRIX, scripts/mss, 2 hook) è **freeze** finché non c'è una fase
  di rewrite dedicata con suite verde.
- L6 (`docs/_lavoro/`) è intangibile: solo puntatori, mai contenuti, mai copie.
- Due owner distinti: pack → `MASTERPLAN_V0`; SYS-1 → `PLAN_V0`. Il piano non deve creare un terzo.
- Precedenti da conoscere: `B2-F01` (link incompleti prima di un move), `B2-F02` (autocertificazione
  di pezzi di gate), `B2-F04` (rollback disegnato ma non provato), `B2-F05` (indipendenza soft),
  `B2-F06` (viste che fingono stato).

════════════════════════════════════════
CONTROPROVE MINIME (obbligatorie — una riga di esito ciascuna)
════════════════════════════════════════

**C1 — Foto Git.** Il piano afferma: HEAD = `origin/env/test` = `ee0ab39`; L5 tracked; 6 file
modificati + 2 untracked della chiusura `037`; nessun tag `mss*`; un solo worktree; `stash@{0}`
intatto. Ri-fotografa **tu**. Ogni scostamento è un finding.

**C2 — La suite è davvero verde?** Esegui `npm run test:mss`. Il piano dichiara 41 fixture + 32
gruppi. Se il numero o l'esito differisce, il piano poggia su una prova falsa.

**C3 — `PLAN-F01` regge o è allarmismo?** Il finding HIGH sostiene che l'accoppiamento non è solo la
stringa di path ma la **profondità di directory**. Apri `docs/MetaSkillSystem/tests/h1/run.mjs` (riga
~30 e ~42) e `.cursor/hooks/fine-sessione-nudge.mjs` / `fine-sessione-commit-check.mjs` (righe ~13–17).
Verifica se `repoRoot` e le import relative si romperebbero davvero a un cambio di profondità, e se un
`paths.mjs` da solo li salverebbe. Esito: **tiene / debole / falso**. Se è falso, cade l'argomento
centrale dell'ordine delle fasi.

**C4 — L'export è davvero possibile?** Il piano afferma che la prova E3 («il kernel gira nella
cartella esportata») **oggi fallirebbe**, e che quindi l'export dipende da F5a. Controprova: prendi
l'allowlist di §6.2 e verifica se un albero composto da soli quei path riuscirebbe a risolvere
`repoRoot`. Se il piano ha ragione, l'ordine è obbligato; se ha torto, F6 può precedere F5a.

**C5 — L'allowlist di export perde qualcosa o include troppo?** Cerca almeno un path che il piano
mette IN e che contenga materiale su Matteo, e almeno un path che mette OUT e che sia invece
necessario a far funzionare il kernel. Il piano dichiara di aver verificato `0` occorrenze di
`matteo` nelle fixture: **ri-eseguilo tu** e allarga la ricerca (email, nomi di progetto Supabase,
nomi di locali, path `_lavoro`).

**C6 — Sandbox: la bocciatura dell'opzione (B) è tecnica o estetica?** Il piano scarta il mirror
gitignored sostenendo che `test:mss` non funzionerebbe lì. Verifica il meccanismo. Verifica anche
l'affermazione sull'opzione (A): che `docs/_lavoro/` **non** entri in un git worktree perché
gitignored. Se una delle due è sbagliata, la raccomandazione D8 cambia.

**C7 — Rollback: disegnato o dimostrato?** Per ognuna delle fasi F5a–F10, il piano dichiara un
rollback. Quanti sono verificabili a secco senza eseguire la fase? Ricorda `B2-F04`: un rollback
scritto non è un rollback provato. Segnala quelli che sono affermazioni.

**C8 — Autocertificazione di gate.** `B2-F02` puniva B1 per aver spuntato caselle di `SEP-G5` prima
della review. Cerca nel piano ogni frase che, letta di corsa, possa sembrare uno stato o un gate
raggiunto. Verifica anche l'affermazione di §9 («questo piano non dichiara»).

**C9 — Owner e doppio stato.** Il piano propone cartelle nuove (`prove/`, `export/`) e dichiara che
«le cartelle non diventano owner». Cerca il punto in cui il piano, di fatto, introduce un secondo
posto dove leggere lo stato. Controlla anche se il piano ha aggiornato owner o viste: dichiara di
non averlo fatto — verificalo con `git status`.

**C10 — Il piano è decidibile da Matteo?** D6–D10: ogni domanda ha opzioni realmente distinte, un
effetto comprensibile senza leggere `src/`, e nessuna opzione già implicitamente scelta altrove nel
testo? Una raccomandazione è legittima; una scelta mascherata da domanda no.

**C11 — Continuità con B1.** Il piano afferma che `B1-F04` (untracked) è chiuso e che `M08` passa da
opzionale a prerequisito. Verifica entrambe. Verifica anche che le righe nuove M12–M17 non
contraddicano M01–M11 e che non rinominino silenziosamente una decisione già presa (D1–D5).

**C12 — Cosa il piano non ha guardato.** Trova almeno un rischio reale che il piano non nomina.
Candidati da controllare, senza limitarti a questi: `.husky/pre-commit`; `package.json` script
`test:mss`/`generate:mss-fixtures`; il file `.cursor/hooks/.fine-sessione-commit-state.json`;
il comportamento di `git-adapter.mjs` sui path fixture; la migrazione della `COVERAGE_MATRIX_H1.json`;
il fatto che Claude Code e Codex **non** eseguono gli hook `.cursor/hooks/`.

════════════════════════════════════════
METODO
════════════════════════════════════════

1. Dichiara ruolo, configurazione, superficie e cosa **non** hai letto (e perché).
2. Foto Git tua, prima di aprire il piano.
3. Leggi il piano una volta per intero; poi C1–C12, ognuna con prova aperta di persona.
4. Classifica ogni claim: **tiene · debole · falso · non verificabile**.
5. Eleva a finding solo ciò che ha path + riga + comando riproducibile. Severità HIGH/MEDIUM/LOW.
6. Verdetto in una riga: `ADEGUATO` · `ADEGUATO_CON_RISERVE` · `NON_ADEGUATO`.
7. Elenca le **condizioni mancanti** perché Matteo possa rispondere a D6–D10 in sicurezza.
8. Se trovi un HIGH, dillo e fermati lì per le raccomandazioni: non riscrivere il piano al posto del writer.
9. Report + capsula `mss.session/0.1.1`; `npm run validate:mss` sul tuo report; `git diff --check`.
10. **Non** aggiornare `MASTERPLAN`, `ROADMAP`, `HANDOFF`, `FOLLOW_UP`, `SESSION_LOG`: l'allineo degli
    owner spetta alla sessione che chiuderà il ciclo dopo le decisioni di Matteo.

Criterio di fatto
- Ogni finding ha una prova che Matteo può ri-eseguire da solo.
- Nessun fix applicato al piano.
- Nessun file del dominio MSS modificato: `git status` finale == iniziale su `docs/MetaSkillSystem/**` e `scripts/mss/**`.
- Il verdetto non è dedotto dal tono del piano ma dalle controprove.

════════════════════════════════════════
STOP
════════════════════════════════════════

Esecuzione di qualsiasi fase (F5a/F5b/F6/F7/F8/F9/F10); `git mv` / move / copy; creazione di
`paths.mjs`, `export/`, `prove/`, tag o worktree; touch di contenuti L6; riscrittura di fixture
frozen; `stash pop`/`drop`; aggiornamento di owner o viste; claim `SEP-G5` PASS; claim H-1.3 PASS
pulito; apertura di `WP-1` o `SEP-5`; scelta delle decisioni D6–D10 al posto di Matteo.

════════════════════════════════════════
CHIUSURA VERSO MATTEO (max 5)
════════════════════════════════════════

Verdetto in una frase · il finding che pesa di più · cosa cambierebbe nelle sue scelte D6–D10 ·
cosa **non** deve fare nessuno prima che lui risponda · prossimo atomo.
