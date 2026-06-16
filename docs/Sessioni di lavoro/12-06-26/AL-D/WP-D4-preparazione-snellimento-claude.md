# WP-D4 — Preparazione snellimento `.claude/CLAUDE.md`

**Data:** 12-06-26  
**Branch verificato:** `env/test` ✓  
**Stato:** bozza pronta — **in attesa ok Matteo file-per-file** (`.claude/CLAUDE.md` vivo intatto)  
**Deliverable bozza:** `docs/_lavoro/Per matteo/AL-D/CLAUDE-md-snellimento-bozza.md`

---

## Obiettivo WP-D4

Rendere `.claude/CLAUDE.md` un **gemello disciplinato** di `AGENTS.md`: stesse sezioni di routing e grilletti, dettaglio operativo condensato con **puntatori** alle fonti vive (`APP_CONTEXT_SKILL.md`, VOCABOLARIO, DB skill) invece di duplicazioni che marciano.

---

## Before / after (righe)

| Metrica | Before (vivo) | After (bozza proposta) | Δ |
|---------|---------------|------------------------|---|
| Righe totali `.claude/CLAUDE.md` | **169** | **~118** | **−51 (−30%)** |
| Sezione «Struttura cartelle src/» | 20 righe (tree duplicato) | 3 righe (puntatore §3) | −17 |
| Tabella «File critici» | 16 righe | 8 righe + puntatore §4 | −8 |
| «Ambienti DB» | 15 righe (tabella MCP duplicata) | 4 righe (puntatore §1b) | −11 |
| «Dev console» | 22 righe | 5 righe | −17 |
| Blocco comandi npm | 15 righe | 11 righe (+ puntatore TESTING_SKILL) | −4 netto |
| Convenzioni | 8 righe | 6 righe | −2 |

> Stima conservativa: **118–125 righe** a seconda di spaziature finali. Obiettivo masterplan «dimezzare» non raggiunto in un solo passo (−30%): ulteriore taglio possibile dopo ok su cosa tenere in «File critici» vs solo APP_CONTEXT §4.

**Contatori test:** il vivo ha già «`npm run test` deve essere verde» (post WP-A3) — nessun numero hardcoded da rimuovere in questo file.

---

## Cosa rimosso vs puntato

### Rimosso (duplicazione / dettaglio altrove)

| Contenuto rimosso | Motivo | Dove vive ora |
|-------------------|--------|---------------|
| Tree `src/` (§ «Struttura cartelle src/», righe 104–123) | Duplicato di APP_CONTEXT §3 (più aggiornato) | `docs/APP_CONTEXT_SKILL.md` §3 |
| Tabella MCP PROD/TEST completa + `.env.local` | Duplicato APP_CONTEXT §1b | `docs/APP_CONTEXT_SKILL.md` §1b |
| Righe file critici: vitest, playwright, tests/setup, husky, ci.yml, validate-invite | Config test/CI | `docs/Testing-Skill/TESTING_SKILL.md` §6 |
| Comandi `seed:*`, `supabase db push`, `migration list` | Workflow DB non universale | `docs/Database-Skill/DB_SKILL.md`, APP_CONTEXT §1b |
| Dev console: tabella canali + aggancio QueryCache dettagliato | Dettaglio implementativo | `src/lib/devConsole.ts` + commenti in codice |
| Voce «Language With User» nelle convenzioni | Non in AGENTS/comandi-base; stile coperto da COMUNICAZIONE_UTENTE_SKILL | Skill comunicazione (caricata on demand) |

### Mantenuto in CLAUDE (non solo puntatore)

| Contenuto | Perché resta |
|-----------|--------------|
| Routing §0 + pattern skill/contesto | Entry point Claude Code — gemello AGENTS |
| Grilletti + livelli + salvaguardie PROD | Comportamento agente; allineato ad AGENTS |
| Comandi npm essenziali | AGENTS rimanda qui; comando day-to-day |
| Convenzioni codice (alias, logger, due client, TanStack) | Invarianti rapidi pre-skill |
| File critici ridotta (router, TenantContext, supabase×2, useAdminAuth, migrations, create-booking) | Boot rapido senza aprire APP_CONTEXT intero |
| Zone delicate (TenantContext, 003_*, send-email, Button/Tailwind) | Trappole ricorrenti non sempre in §4 |
| Dev console one-liner | Segnala esistenza strumento dev |
| Variabili d'ambiente | `.env.example` non è skill |

### Aggiunto (puntatori, non duplicazione)

| Aggiunta | Scopo |
|----------|-------|
| Intestazione «gemello» esplicita (come AGENTS) | Allineamento triplo CLAUDE / AGENTS / comandi-base |
| Blocco «Puntatori estesi» sotto VOCABOLARIO | CHIUSURA_SESSIONE, PREPARA_PROMPT, zone Prenota↔QR senza riscrivere comandi-base |
| Sezione «Dettaglio operativo» | Specchio inverso di AGENTS § «Dettaglio operativo» |
| Puntatore TESTING_SKILL per config test | Sostituisce righe vitest/playwright in tabella file critici |
| Puntatore APP_CONTEXT §4 per invarianti | Sostituisce espansione tabella file critici |

---

## Checklist obblighi — AGENTS.md vs comandi-base.mdc

Legenda: ✅ presente nella bozza · ⚠️ solo puntatore (comportamento in fonte) · ❌ assente — da decidere

### Da AGENTS.md (gemello)

| Obbligo | Bozza |
|---------|-------|
| Triade gemelli CLAUDE / AGENTS / comandi-base | ✅ |
| APP_CONTEXT §0 routing | ✅ |
| VOCABOLARIO fonte grilletti | ✅ |
| Livelli libertà 1/2/3 | ✅ |
| Grilletti principali (lista compatta) | ✅ |
| Salvaguardie PROD get_project_url | ✅ |
| Comando non riconosciuto → chiedi | ✅ |
| AGENTS deferisce dettaglio operativo a CLAUDE | ✅ (sezione «Dettaglio operativo») |

### Da comandi-base.mdc (Cursor — Claude non carica il file automaticamente)

| Obbligo | Vivo attuale | Bozza | Nota |
|---------|--------------|-------|------|
| «prepara» → PREPARA_PROMPT_SKILL.md | ❌ | ⚠️ puntatore | Comportamento invariato nel grilletto; path skill aggiunto come puntatore |
| «lavoro ok» → CHIUSURA_SESSIONE.md completo | ❌ | ⚠️ puntatore | Idem |
| Allineamento skill implicito a «lavoro ok» | ❌ | ⚠️ via CHIUSURA | Non duplicato per non cambiare VOCABOLARIO |
| Hook `stop` + pre-commit «mente fredda» | ❌ | ❌ | Solo Cursor; opzionale aggiungere una riga puntatore a comandi-base § «Nota hook» |
| «evolvi» senza «senior» → chiedi | ❌ | ❌ | In comandi-base, non in AGENTS/CLAUDE vivo |
| Zone Prenota ↔ Menu QR / tre zone menu | ❌ | ⚠️ puntatore | comandi-base + VOCABOLARIO |
| «fai report finale» = verifica diff poi commit | parziale | parziale | Grilletto identico ad AGENTS; dettaglio in comandi-base |
| Migrazioni in salvaguardia PROD | parziale (INSERT/UPDATE/DELETE) | ✅ allineato ad AGENTS (include migrazioni) | Miglioramento minimo vs vivo |

**Raccomandazione post-ok:** se Matteo vuole parità Cursor↔Claude su hook e «evolvi senza senior», aggiungere **una riga ciascuna** sotto «Puntatori estesi» (non riscrivere il blocco grilletti).

---

## Confronto struttura: vivo → bozza

```
VIVO (169 righe)                    BOZZA (~118 righe)
─────────────────                   ───────────────────
Intro                               Intro + gemello esplicito
§ Routing area                      § Routing area (allineato AGENTS)
§ Comandi/vocabolario               § Comandi/vocabolario + puntatori estesi
§ File critici (16 righe)           § Dettaglio operativo
§ Comandi npm                           ├─ Comandi npm
§ Convenzioni                           ├─ Convenzioni
§ Zone delicate                         ├─ Struttura → APP_CONTEXT §3
§ Struttura src/ (TREE)                 ├─ File critici (8 righe)
§ Variabili env                         ├─ Zone delicate
§ Ambienti DB (tabella MCP)             ├─ Ambienti DB → §1b
§ Dev console (lungo)                   ├─ Variabili env
                                        └─ Dev console (breve)
```

---

## File toccati in questa preparazione

| File | Azione |
|------|--------|
| `.claude/CLAUDE.md` | **NON modificato** (vivo intatto) |
| `docs/_lavoro/Per matteo/AL-D/CLAUDE-md-snellimento-bozza.md` | Creato — testo completo proposto |
| `docs/_lavoro/Per matteo/AL-D/WP-D4-preparazione-snellimento-claude.md` | Creato — questo report |
| `AGENTS.md`, `comandi-base.mdc`, `MASTERPLAN` | Solo lettura |

---

## Prossimo passo (cancello WP-D4)

1. Matteo approva bozza **file-per-file** (eventuali ritocchi: hook Cursor, «evolvi senza senior», tabella file critici).
2. Solo dopo ok: sostituire `.claude/CLAUDE.md` con il testo approvato.
3. Verificare grep: nessun contatore test, nessun tree `src/` duplicato.
4. Opzionale stesso ciclo: aggiornare `.cursor/skills/calendarbackup-app-context/SKILL.md` riga che cita «struttura src/» in CLAUDE (fuori scope WP-D4 se non richiesto).

---

## Riferimenti letti

- `.claude/CLAUDE.md` (169 righe, intero)
- `AGENTS.md` (49 righe, intero)
- `.cursor/rules/comandi-base.mdc` (73 righe, intero)
- `docs/MASTERPLAN_ALLINEAMENTO.md` WP-D4 + WP-A3 (contatori test)
- `docs/APP_CONTEXT_SKILL.md` §1b, §3, §4 (campioni per puntatori)
