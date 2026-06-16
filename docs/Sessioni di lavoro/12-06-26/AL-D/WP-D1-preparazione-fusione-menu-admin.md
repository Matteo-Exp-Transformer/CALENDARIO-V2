# WP-D1 — Preparazione fusione context Menu admin

**Data:** 12-06-26  
**Branch verificato:** `env/test` ✅  
**Stato:** bozza pronta — **in attesa ok file-per-file** (nessun file sorgente modificato in questa sessione)

---

## Obiettivo

Fondere in un'unica fonte:

| Ruolo | Path attuale | Righe |
|---|---|---|
| Vecchio (UI/layout) | `docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | 126 |
| Destinazione vivo (M3/architettura) | `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | 179 |

**Bozza fusa proposta:** [`ADMIN_MENU_MAGAZZINO_CONTEXT-fusione-bozza.md`](./ADMIN_MENU_MAGAZZINO_CONTEXT-fusione-bozza.md)  
**Destinazione finale (dopo ok):** `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`

---

## Before / After (sintesi)

| Aspetto | Before | After (proposto) |
|---|---|---|
| Fonti parallele | 2 file, §0 APP_CONTEXT punta al vecchio | 1 file in `Admin-Skill/contesto/` |
| Routing agenti | `MENU_ADMIN_CONTEXT.md` (per-ui-design) | `ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| §9 M3 | Solo in ADMIN | **Invariato** (§9) — riferimenti esterni preservati |
| §4–§8 ADMIN | Confini, rename, vincoli, rischi, rimandi | **Numerazione invariata** (§4–§8) |
| UI tab Menu | Solo in MENU_ADMIN §1–3, §8 | Assorbita in **§3** (sottosezioni 3.1–3.7) |
| Vecchio path | File pieno | **Tombstone** (redirect, non cancellato) |
| Report sessioni | MENU_ADMIN §7 (3 link storici) | **Non trasferiti** (non vivi; restano in Sessioni di lavoro) |

---

## Confronto sezione per sezione

### Da `ADMIN_MENU_MAGAZZINO_CONTEXT.md` (destinazione)

| Sezione originale | Azione in bozza | Note |
|---|---|---|
| Header + stato M3 | **Mantenuto** | Banner blindatura invariato |
| §1 Scopo | **Arricchito** | Aggiunta voce «promo testuali» |
| §2 Componenti e hook | **Arricchito** | Aggiunti layout/helper da MENU_ADMIN (`menuPricesCatalogLayout`, `adminScroll`, `menuMagazzinoLimits`) |
| §3 Tabelle e storage | **Espanso → §3.1** | Tabella originale + righe promo + distinzione foto legacy |
| — | **NUOVO §3.2–3.7** | Contenuto UI da MENU_ADMIN (vedi sotto) |
| §4 Confini | **Invariato** | §4 in bozza |
| §5 Rename/delete | **Arricchito** | Flussi ADMIN + bullet UI modali da MENU_ADMIN §2 |
| §6 Vincoli | **Invariato** | §6 |
| §7 Rischi | **Invariato** | §7 |
| §8 Rimandi | **Aggiornato** | Rimosso rimando al vecchio file; aggiunti cap testo, promo UI, QR data-flow |
| §9 M3 | **Invariato** | §9.1–9.5 intatti (fonte autorevole limiti/cap/toggle/sync) |

### Da `MENU_ADMIN_CONTEXT.md` (vecchio)

| Sezione originale | Destinazione in bozza | Trasferito? |
|---|---|---|
| Intro + trigger routing | Header blockquote | ✅ |
| §1 Cos'è | §1 Scopo (concetto fonte di verità) | ✅ |
| §2 Categorie e foto | §3.1 (foto) + §3.2 (layout/overlay/card) | ✅ |
| §3 Form prodotto | §3.3 (form + cap + limiti + availability) | ✅ |
| §4 Promo testuali | §3.4 | ✅ |
| §5 Preset staff | §3.5 | ✅ |
| §6 Legacy booking_types | §3.6 | ✅ |
| §8 Modale QR icone | §3.7 | ✅ |
| §7 Report sessioni collegati | — | ❌ (storico, non operativo) |

### Contenuti VIVI verificati (nessuna perdita)

| Tema | Vecchio | Nuovo ADMIN | ADMIN §9 |
|---|---|---|---|
| Limiti 7/12/6/6 | §3 | §3.3 + §9.1 | ✅ |
| Cap 24/79 | §3 | §3.3 + §9.1 | ✅ |
| Toggle `is_available` | §3 | §3.3 + §9.3 Fase 2 | ✅ |
| Propagazione + snapshot | — | §9.2 | ✅ |
| Promo modello dati | §4 | §3.4 | — |
| Preset staff | §5 | §3.5 + §4/§6 | ✅ |
| Rename/delete UI + sync | §2 | §5 + §9.4 | ✅ |
| Foto 3 famiglie / legacy | §2 | §3.1 | ✅ |
| QR icone 20 picker | §8 | §3.7 | — |
| LOCK / blindatura M3 | — | header + §9.5 | ✅ |

**Nota LOCK:** nessuna sezione LOCK esplicita nel vecchio file; le invarianti M3 (snapshot, limiti retroattivi, superficie toggle) restano in **§9** senza tagli.

---

## Tombstone proposto per `MENU_ADMIN_CONTEXT.md`

> Da applicare **solo dopo ok** — sostituisce l'intero contenuto del vecchio file (file **non** cancellato).

```markdown
# DEPRECATO — Menu admin context (spostato)

> **Tombstone WP-D1 (12-06-26):** questo path non è più la fonte di verità.
>
> **Nuova fonte unica:** `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`
>
> Contenuto UI/layout, limiti magazzino, promo, preset e decisioni M3 sono stati fusi lì (§3 operativo, §9 decisioni intervista).
>
> **Non aggiornare questo file.** Per task su tab Menu / MenuPricesTab / magazzino → carica il file in `Admin-Skill/contesto/`.
>
> Bozza fusione: `docs/_lavoro/Per matteo/AL-D/ADMIN_MENU_MAGAZZINO_CONTEXT-fusione-bozza.md`
```

---

## Grep rimandi (`rg` escluso `Sessioni di lavoro/**`)

Comando: `rg "MENU_ADMIN_CONTEXT|ADMIN_MENU_MAGAZZINO_CONTEXT" docs --glob "!Sessioni di lavoro/**"`

### File VIVI — rimandi da aggiornare (12 occorrenze in 8 file)

| # | File | Riga | Testo attuale | Azione proposta |
|---|---|---|---|---|
| 1 | `docs/APP_CONTEXT_SKILL.md` | 59 | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | → `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 2 | `docs/APP_CONTEXT_SKILL.md` | 298 | RULE Menu Prenota → `MENU_ADMIN_CONTEXT.md` | → `ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 3 | `docs/APP_CONTEXT_SKILL.md` | 491 | tabella file → `MENU_ADMIN_CONTEXT.md` | → `ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 4 | `docs/APP_CONTEXT_SKILL.md` | 503 | tabella file → `MENU_ADMIN_CONTEXT.md` | → `ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 5 | `docs/APP_CONTEXT_SKILL.md` | 504 | `+ MENU_ADMIN_CONTEXT.md` | → `+ ADMIN_MENU_MAGAZZINO_CONTEXT.md` (o solo PRENOTA_LAYOUT se ridondante) |
| 6 | `docs/Comunicazione-Skill/VOCABOLARIO.md` | 318 | carica `MENU_ADMIN_CONTEXT.md` | → `ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 7 | `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` | 118 | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md` | → `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` + stato ✅ |
| 8 | `docs/Menu-QR-Skill/MENU_QR_SKILL.md` | 221 | rimando magazzino → vecchio path | → `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 9 | `docs/Menu-QR-Skill/contesto/MENU_QR_TEXT_LIMITS_MAP.md` | 58 | cap scritti in `MENU_ADMIN_CONTEXT` | → `ADMIN_MENU_MAGAZZINO_CONTEXT` §3.3 |
| 10 | `docs/Prenota-Skill/PRENOTA_SKILL.md` | 206 | tabella → vecchio path | → `../Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 11 | `.cursor/skills/calendarbackup-app-context/SKILL.md` | 34 | Tab Menu → vecchio path | → `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` |
| 12 | `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | 176 | «Vecchio context tecnico» → MENU_ADMIN | **Rimuovere** riga (post-fusione) |

### File VIVI — solo citazione storica (aggiornamento opzionale)

| File | Nota |
|---|---|
| `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` L87 | Tabella errore FU-030 — nome file senza path; opzionale rename in nota |
| `docs/SESSION_LOG.md` L165, L171 | Log storico 29-05-26 — **non toccare** |
| `docs/MASTERPLAN_ALLINEAMENTO.md` L75, L82, L355-356 | Citato nel masterplan WP-D1 — **non aggiornato** (vincolo task) |
| `docs/MASTERPLAN_BLINDATURA.md` L152, L166 | Già punta a `ADMIN_MENU_MAGAZZINO_CONTEXT` §9 — **ok** |
| `docs/Admin-Skill/ADMIN_SKILL.md` | Già punta a `ADMIN_MENU_MAGAZZINO_CONTEXT` — **ok** |
| `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` L41 | Già ok |

### File fuori scope grep (`.md` ma non in `docs/`)

| File | Occorrenze |
|---|---|
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | 1 (in tabella sopra) |

**Conteggio rimandi operativi da aggiornare: 12** (in 8 file + tombstone sul 9° file vecchio path).

---

## Bozza cambio `APP_CONTEXT_SKILL.md` §0 (NON applicata)

Solo la riga tab Menu admin (L59 circa):

**Before:**
```markdown
| **Tab Menu admin / MenuPricesTab / form ingrediente / categorie menu / promo testuali / menù preselezionati (preset staff) / booking_menu_promos / booking_custom_staff_presets** | **`docs/per-ui-design-skill/MENU_ADMIN_CONTEXT.md`** (+ `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se tocca il flusso dati, `DB_SKILL.md` se tocca lo schema) |
```

**After (proposto):**
```markdown
| **Tab Menu admin / MenuPricesTab / form ingrediente / categorie menu / promo testuali / menù preselezionati (preset staff) / booking_menu_promos / booking_custom_staff_presets / limiti magazzino / toggle disponibilità / QR manager** | **`docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`** (+ `docs/Prenota-Skill/contesto/PRENOTA_DATA_FLOW_CONTEXT.md` se tocca il flusso dati resolver, `DB_SKILL.md` se tocca lo schema) |
```

**Altre righe APP_CONTEXT da allineare nello stesso commit (dopo ok):** L298 RULE, L491, L503, L504 — vedi tabella rimandi.

---

## Sequenza applicazione consigliata (dopo ok Matteo)

1. **Ok bozza** → sostituire contenuto `ADMIN_MENU_MAGAZZINO_CONTEXT.md` con testo da `fusione-bozza.md`
2. **Ok tombstone** → sostituire `MENU_ADMIN_CONTEXT.md` con tombstone
3. **Ok rimandi** file-per-file (tabella §12 sopra)
4. **Ok §0** → applicare bozza APP_CONTEXT + RULE/tabelle correlate
5. Aggiornare `PROSEGUIMENTO_MAPPATURA_SKILL.md` (Tab Menu → ✅)
6. **Non** toccare `MASTERPLAN_ALLINEAMENTO.md` in questo WP (vincolo)

---

## File toccati in questa sessione (solo bozza)

| File | Azione |
|---|---|
| `docs/_lavoro/Per matteo/AL-D/ADMIN_MENU_MAGAZZINO_CONTEXT-fusione-bozza.md` | Creato |
| `docs/_lavoro/Per matteo/AL-D/WP-D1-preparazione-fusione-menu-admin.md` | Creato |
| File sorgente (`MENU_ADMIN_CONTEXT`, `ADMIN_MENU_MAGAZZINO_CONTEXT`, `APP_CONTEXT`, …) | **Intatti** |

---

## Checklist ok Matteo

- [ ] Bozza fusa (`fusione-bozza.md`) approvata
- [ ] Tombstone su vecchio path approvato
- [ ] Rimandi (12) — ok batch o file-per-file
- [ ] Bozza §0 APP_CONTEXT approvata
