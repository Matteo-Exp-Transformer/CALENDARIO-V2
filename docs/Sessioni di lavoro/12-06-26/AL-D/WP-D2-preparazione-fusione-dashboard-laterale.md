# WP-D2 — Preparazione fusione `Dashboard-laterale-skill/` → `Admin-Skill/`

**Data:** 12-06-26  
**Branch verificato:** `env/test` ✅  
**Agente:** sub-agent WP-D2 (sola docs, nessun codice / DB / commit)  
**Stato:** **in attesa ok Matteo** — file sorgente **INTATTI**

---

## 1. Obiettivo

Eliminare il doppio sistema skill Admin shell (`docs/Dashboard-laterale-skill/` vs `docs/Admin-Skill/`) fondendo i 3 file legacy nell'area Admin unificata, senza perdere il dettaglio tecnico (query key, Servizio, E2E M1).

---

## 2. Mappa vivo vs storia

### Vivo — da mantenere / fonte autorevole dopo fusione

| File | Ruolo | Note |
|------|-------|------|
| `docs/Admin-Skill/ADMIN_SKILL.md` | Entry point area Admin (senso, confini, §7 mappa) | Già esiste; va aggiornato §7 con riga `ADMIN_SHELL_SKILL` |
| `docs/Admin-Skill/contesto/ADMIN_SHELL_NAV_CONTEXT.md` | Route, URL fonte di verità, auth, guard dirty, decisioni Area 1, E2E FU-042 | **Più recente** (06–10-06-26) del vecchio `ADMIN_SHELL_CONTEXT` su routing |
| `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` | Flussi utente CRM | Prodotto; più leggero del vecchio PAGES § CRM |
| `docs/Admin-Skill/contesto/ADMIN_SERVIZIO_CONTEXT.md` | Flussi utente Servizio | Prodotto; non copre override/DnD in profondità |
| `docs/Admin-Skill/contesto/ADMIN_ANALYTICS_HOME_CONTEXT.md` | Home + Analytics prodotto | Complementare a PAGES |
| `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` | Piano blindatura | Invariato |
| `docs/APP_CONTEXT_SKILL.md` §4 invarianti CRM/tema/edition | Regole globali | Restano; solo path §0/§7.2 da aggiornare |

### Storia — superato dopo ok (tombstone, non cancellare cartella)

| File legacy | Parole ~ | Problema | Destinazione bozza |
|-------------|----------|----------|-------------------|
| `Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` | ~90 | Path proprio, duplica entry Admin | `Admin-Skill/ADMIN_SHELL_SKILL.md` |
| `Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md` | ~225 | Routing **stale** (stato locale); duplica NAV su sidebar/tema | `contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` (solo parte tecnica) |
| `Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | ~340 | Dettaglio tecnico **ancora valido** (soprattutto Servizio) | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` |

### Sovrapposizioni deliberate (non merge distruttivo)

| Tema | NAV (vivo) | ARCHITECTURE (da legacy) | PAGES / dominio |
|------|------------|--------------------------|-----------------|
| Route `/admin/*` | ✅ autorevole | rimando | — |
| Albero componenti + lazy | sommario NAV | ✅ dettaglio ASCII | — |
| Sidebar 3 stati | decisioni + sintesi | ✅ z-index, chevron, narrow | — |
| CRM flussi | — | — | CRM_CONTEXT + PAGES § CRM tecnico |
| Servizio fasce/DnD | — | — | SERVIZIO_CONTEXT + **PAGES § Servizio** (RULE APP_CONTEXT) |
| E2E shell M1 | NAV §10 + SKILL §4 | — | TEST_SUITE_INDEX |

**Principio:** un agente carica `ADMIN_SHELL_SKILL` → NAV (routing) → ARCHITECTURE (layout) → dominio + PAGES se serve profondità tecnica.

---

## 3. Before / after — struttura cartelle

### BEFORE

```
docs/
├── Dashboard-laterale-skill/          ← secondo sistema (da tombstone)
│   ├── ADMIN_SHELL_SKILL.md
│   ├── ADMIN_SHELL_CONTEXT.md
│   └── ADMIN_PAGES_CONTEXT.md
└── Admin-Skill/
    ├── ADMIN_SKILL.md
    ├── PLAN_BLINDATURA_ADMIN.md
    └── contesto/
        ├── ADMIN_SHELL_NAV_CONTEXT.md   ← già vivo, overlap parziale
        ├── ADMIN_CRM_CONTEXT.md
        ├── ADMIN_SERVIZIO_CONTEXT.md
        └── ADMIN_ANALYTICS_HOME_CONTEXT.md
```

### AFTER (proposto post-ok)

```
docs/
├── Dashboard-laterale-skill/          ← tombstone per file (cartella resta)
│   └── (3 file → contenuto TOMBSTONE)
└── Admin-Skill/
    ├── ADMIN_SKILL.md                 ← +1 riga §7
    ├── ADMIN_SHELL_SKILL.md           ← NUOVO (da legacy SKILL)
    ├── PLAN_BLINDATURA_ADMIN.md
    └── contesto/
        ├── ADMIN_SHELL_NAV_CONTEXT.md       ← invariato (vivo)
        ├── ADMIN_SHELL_ARCHITECTURE_CONTEXT.md  ← NUOVO (da legacy CONTEXT)
        ├── ADMIN_SHELL_PAGES_CONTEXT.md       ← NUOVO (da legacy PAGES)
        ├── ADMIN_CRM_CONTEXT.md
        ├── ADMIN_SERVIZIO_CONTEXT.md
        └── ADMIN_ANALYTICS_HOME_CONTEXT.md
```

---

## 4. Deliverable bozza (questa cartella)

| File | Contenuto |
|------|-----------|
| [`ADMIN_SHELL_SKILL-fusione-bozza.md`](./ADMIN_SHELL_SKILL-fusione-bozza.md) | Skill shell con path Admin-Skill + routing a NAV/ARCHITECTURE/PAGES/domini |
| [`ADMIN_SHELL_CONTEXT-fusione-bozza.md`](./ADMIN_SHELL_CONTEXT-fusione-bozza.md) | Proposta `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` (senza duplicare NAV) |
| [`ADMIN_PAGES_CONTEXT-fusione-bozza.md`](./ADMIN_PAGES_CONTEXT-fusione-bozza.md) | Proposta `ADMIN_SHELL_PAGES_CONTEXT.md` (corpo tecnico invariato + cross-ref) |
| [`TOMBSTONE-bozze-Dashboard-laterale-skill.md`](./TOMBSTONE-bozze-Dashboard-laterale-skill.md) | Testo tombstone per i 3 file legacy |
| [`APP_CONTEXT_SKILL-bozza-sezione0-WP-D2.md`](./APP_CONTEXT_SKILL-bozza-sezione0-WP-D2.md) | Diff §0, §2, §4 RULE Servizio, §7.2 |

---

## 5. Grep rimandi (escluso `Sessioni di lavoro/**`)

Comando: `rg "Dashboard-laterale-skill|ADMIN_SHELL_SKILL|ADMIN_SHELL_CONTEXT|ADMIN_PAGES_CONTEXT" docs --glob "!Sessioni di lavoro/**"` + `.cursor/` + `AGENTS.md` + `.claude/`

### Conteggio match per file (da aggiornare post-ok)

| File | Match | Azione post-ok |
|------|------:|----------------|
| `docs/APP_CONTEXT_SKILL.md` | **8** | Applicare bozza §0 + §2 + §4 + §7.2 |
| `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` | 5 | Tombstone (interni) |
| `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md` | 2 | Tombstone (interni) |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | 2 | Tombstone (interni) |
| `docs/MASTERPLAN_ALLINEAMENTO.md` | 4 | **NON modificare** (vincolo WP-D2) |
| `docs/SESSION_LOG.md` | 1 | Storico — opzionale |
| `docs/Comunicazione-Skill/VOCABOLARIO.md` | 1 | Path `ADMIN_SHELL_SKILL` |
| `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` | 1 | Path shell |
| `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` | 1 | Path shell |
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | 1 | Mappa aree |
| `AGENTS.md` | 0 | — |
| `.claude/` | 0 | — |

### Totale rimandi esterni da aggiornare (esclusi legacy interni e MASTERPLAN)

**13** file/righe operative:

1–8. `APP_CONTEXT_SKILL.md` (8 occorrenze)  
9. `VOCABOLARIO.md`  
10. `UI_RESPONSIVE_SKILL.md`  
11. `UI_RESPONSIVE_CONTEXT.md`  
12. `.cursor/skills/calendarbackup-app-context/SKILL.md`  
13. `ADMIN_SKILL.md` §7 (riga nuova — non matchava grep perché non citava ancora shell skill)

(+ opzionale `SESSION_LOG` storico)

**Match in `Sessioni di lavoro/`:** ~25+ (storico, non toccare)

---

## 6. Tombstones

Testo pronto in [`TOMBSTONE-bozze-Dashboard-laterale-skill.md`](./TOMBSTONE-bozze-Dashboard-laterale-skill.md).

**Procedura post-ok file-per-file:**

1. Matteo approva bozza N  
2. Copia bozza N → path destinazione in `Admin-Skill/`  
3. Sostituisci file legacy N con tombstone corrispondente  
4. Aggiorna rimandi grep per quel file  
5. Ripeti; al termine verificare link con `npm run validate` se disponibile per docs

**NON cancellare** la cartella `Dashboard-laterale-skill/` in questo WP.

---

## 7. Modifiche proposte a `ADMIN_SKILL.md` §7 (post-ok)

Aggiungere riga:

```markdown
| Shell workflow agente (invarianti, step 0 context, E2E post-modifica) | `ADMIN_SHELL_SKILL.md` |
```

Riga esistente «Route `/admin`, sidebar…» resta su `ADMIN_SHELL_NAV_CONTEXT.md`.

---

## 8. Cosa NON è stato fatto (vincoli rispettati)

- ❌ Nessuna modifica a file in `docs/Dashboard-laterale-skill/` (originali intatti)  
- ❌ Nessun commit  
- ❌ Nessun aggiornamento `MASTERPLAN_ALLINEAMENTO.md`  
- ❌ Nessuna modifica regole edition / `features.ts`  
- ❌ Nessun tocco `src/`, `supabase/`, MCP  

---

## 9. Checklist ok Matteo

- [ ] Approvare `ADMIN_SHELL_SKILL-fusione-bozza.md` → copia in `Admin-Skill/ADMIN_SHELL_SKILL.md`  
- [ ] Approvare `ADMIN_SHELL_CONTEXT-fusione-bozza.md` → `contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md`  
- [ ] Approvare `ADMIN_PAGES_CONTEXT-fusione-bozza.md` → `contesto/ADMIN_SHELL_PAGES_CONTEXT.md`  
- [ ] Applicare tombstones ai 3 file legacy  
- [ ] Applicare `APP_CONTEXT_SKILL-bozza-sezione0-WP-D2.md` + altri 4 rimandi esterni  
- [ ] Aggiornare `ADMIN_SKILL.md` §7  
- [ ] (Opzionale fase successiva) Rimuovere cartella tombstone dopo periodo di grazia  

---

## 10. La tua lettura (agente)

Il vecchio `ADMIN_SHELL_CONTEXT` descriveva ancora routing a stato locale — **obsoleto** rispetto a NAV (fix flash 06-06-26). La fusione **non** deve sovrascrivere NAV: estrae solo architettura/tema/z-index/pattern.

`ADMIN_PAGES_CONTEXT` resta il deposito tecnico più ricco (soprattutto Servizio e `serviceSlotBookingFilter`); i context dominio Admin-Skill restano utili per blindatura/intervista ma non lo sostituiscono.

Il risultato è **un'area = una cartella** con due entry chiare: `ADMIN_SKILL` (ristoratore/staff) e `ADMIN_SHELL_SKILL` (agente che tocca shell/layout).
