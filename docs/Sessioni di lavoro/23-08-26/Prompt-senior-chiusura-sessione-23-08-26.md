# Mandato — chiusura sessione senior MSS (23-08-26)

```text
Profilo: Meta
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md · docs/MetaSkillSystem/PLAN_V0.md (§4-bis, §15, §16) · docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md (§10-bis, §11) · docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md (voci 23-08-26)
Non caricare: APP_CONTEXT_SKILL.md intero · docs/_lavoro/ · src/ (fuori cantiere)
Output attesi: Report-senior-chiusura-sessione-23-08-26.md con conferma punto-per-punto Stop-hook #2; aggiornamento HANDOFF_SENIOR_V0.md § handoff operativo; aggiornamento ROADMAP_V0.md riga SK-6 (CHIUSO D16); verifica/propagazione template _skill-system-v0/; eventuale fix testo hook fine-sessione-senior.mjs se il falso «gitignored» è confermato; nessun codice SK-4; nessun commit/push senza sì Matteo; niente output in più senza chiedere Sì/No prima
```

> **Data:** 23-08-26 · **Branch:** `env/test` · **HEAD atteso:** `eee6cf7` o successivo  
> **Ripresa** della sessione senior interrotta per token. **Non** eseguire SK-4: i mandati esecutori
> sono già pronti e lanciati in parallelo (`PLAN-CURSOR-SK-4-23-08-26.md`).

---

## 1. Prima di agire

```bash
npm run mss:status
git log -3 --oneline
git status --porcelain
```

Se `HEAD` o branch divergono da quanto atteso, **fermati** e segnala a Matteo.

Leggi il compact della sessione precedente (contesto in chat) e verifica lo **stato reale** del repo,
non la memoria del compact:

| Fatto da verificare | Dove |
|---|---|
| `SK-6` chiuso (D16) | `PLAN_V0.md` §4-bis + §15 |
| Vista effettiva in `mss:query` | `npm run mss:query -- --verifica` |
| Playbook 23-08 (3 voci) | `EVOLUZIONE_SKILLS.md` + commit `eee6cf7` |
| Piani paralleli pronti | `PLAN-CURSOR-SK-4`, `PLAN-CODEX-SK-11-SK-5` |
| G1–G6 SK-4 autorizzate | `PLAN-CURSOR-SK-4` §3 |

---

## 2. Chi sei e cosa NON è questo mandato

Sei l'**agente senior / meta** che **chiude il ciclo di pianificazione** del 23-08-26.

**Non sei** E1/E2/E3/E4 SK-4. **Non sei** esecutore Codex SK-11. **Non** implementi bypass,
adapter, core, contratto applicativo oltre quanto serve al punto 5 (solo messaggio hook se confermato).

---

## 3. Obiettivo — consegnare a Matteo la conferma che lo Stop-hook #2 chiedeva

Il hook `fine-sessione-senior.mjs` (CASO B) chiede conferma **punto per punto**. Il tuo report deve
contenere una sezione esplicita **«Conferma Stop-hook #2»** con queste voci, ciascuna con prova:

| # | Punto hook | Cosa verificare |
|---|---|---|
| 1 | **Dati = diff reale** | Riapri diff dei commit `449cd70`, `eee6cf7` e file sessione 23-08-26; numeri citati = misurati |
| 2 | **File correlati allineati** | `PLAN_V0`, `ROADMAP_V0`, `HANDOFF_SENIOR_V0`, `core.mjs` export, report vista effettiva |
| 3 | **Q1–Q6 coerenti** | Report `Report-vista-effettiva-mss-query-23-08-26.md` — grep sezione §11 |
| 4 | **`_skill-system-v0/` propagato** | Confronta 3 voci playbook 23-08 con template; elenca cosa va copiato o «nulla da propagare» |
| 5 | **PLAYBOOK aggiornato** | Le 3 voci del 23-08 in `EVOLUZIONE_SKILLS.md` presenti e coerenti con D18 |

Formato atteso per Matteo (copia nel report):

```text
✅ 1. Dati = diff: …
✅ 2. File correlati: …
✅ 3. Q1–Q6: …
✅ 4. _skill-system-v0: …
✅ 5. PLAYBOOK: …
```

Se un punto **non** passa, scrivi ❌ e il motivo — non inventare ✅.

---

## 4. Allineamento viste senior (debito noto)

### 4.1 `ROADMAP_V0.md`

La tabella SK-* alla fine dice ancora SK-6 «chiusura non decisa: decide Matteo». **D16 ha chiuso
SK-6.** Aggiorna la riga a **CHIUSO 23-08-26 (D16)** con puntatore a report vista effettiva.
Aggiungi nota: piani SK-4 e SK-11+SK-5 pronti in `Sessioni di lavoro/23-08-26/` (non duplicare
stato — punta al PLAN).

### 4.2 `HANDOFF_SENIOR_V0.md`

Aggiorna sezione handoff operativo (`CHIUSURA_SESSIONE.md` §10-bis):

- cosa è vero **adesso** (SK-6 chiuso, SK-4 in esecuzione parallela, SK-11 Codex parallelo)
- prossimo task atomico per Matteo: attendere Wave 1 SK-4 + revisione; Codex SK-11 indipendente
- decisioni chiuse: D16–D19, G1–G6 SK-4 — **non riaprire**
- gate invariati: no WP-1, no SEP-G5 PASS, no push senza sì

---

## 5. Bug hook — `_skill-system-v0/` «gitignored» (solo se confermato)

Il messaggio in `.claude/hooks/fine-sessione-senior.mjs` riga ~226 dice che `_skill-system-v0/` è
**gitignored**. Verifica:

```bash
git check-ignore -v _skill-system-v0/README.md
git ls-files _skill-system-v0 | wc -l
```

Se **non** è gitignored (31 file tracciati — caso atteso):

- Correggi **solo** la stringa del messaggio hook (repo + copia in `_skill-system-v0/hooks/` se
  esiste duplicato) — testo corretto: «template portabile in `_skill-system-v0/` (**tracciato**:
  elenca nel report cosa hai toccato, non assumere gitignore)»
- ⛔ Non aprire pacchetto SK-4 per questo; è fix documentale/hook minimo
- Se Matteo preferisce lasciare il bug documentato → backlog nel report, **senza** fix

---

## 6. Perimetro scrittura

| Consentito | Vietato |
|---|---|
| `HANDOFF_SENIOR_V0.md` | `adapter.mjs`, `core.mjs`, `query.mjs` (SK-4) |
| `ROADMAP_V0.md` (solo riga SK-6 + nota piani) | Capsule storiche |
| `fine-sessione-senior.mjs` (solo messaggio riga 226, se fix) | `src/`, DB |
| `_skill-system-v0/**` (propagazione playbook, se serve) | commit / push |
| `docs/Sessioni di lavoro/23-08-26/Report-senior-*.md` | Dichiarare SK-4 chiuso |

---

## 7. Report e capsula

`docs/Sessioni di lavoro/23-08-26/Report-senior-chiusura-sessione-23-08-26.md`

Sezioni minime:

1. Contesto ripresa sessione senior  
2. **Conferma Stop-hook #2** (tabella §3)  
3. Allineamenti ROADMAP / HANDOFF  
4. `_skill-system-v0` e hook  
5. Stato mandati paralleli (SK-4 Wave 1, Codex SK-11) — puntatore, non esecuzione  
6. Handoff §10-bis al prossimo agente  
7. Capsula JSONL + **Q1–Q6 verbatim** (`CHIUSURA_SESSIONE.md` §11)

Schema/revision da `rules.mjs` righe 3–6 · UUIDv7 · `segment_no: 1` · `self_report`.

---

## 8. Prove di chiusura

1. `grep SK-6` su ROADMAP → non più «decide Matteo» per chiusura  
2. HANDOFF §3/ handoff operativo riflette D16 e piani 23-08  
3. Sezione «Conferma Stop-hook #2» completa nel report  
4. `git diff --stat` solo file ammessi §6  

---

## 9. Chiusura verso Matteo (linguaggio semplice)

Due righe: cosa hai verificato per lui e cosa può fare adesso (lanciare / attendere esecutori SK-4).
