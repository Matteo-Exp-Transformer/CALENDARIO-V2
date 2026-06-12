# Design — Mini-pack per area (WP-E1)

> **Stato:** approvato Matteo 12-06-26 (intervista Meta AL-E).
> **Implementazione:** fasi **Imp-1 → Imp-3** sotto — tracciate in `FU-ALL-TIER`.
> Nessun file mini-pack creato in questo WP (solo design).

---

## Obiettivo

Ingressi **~1 schermata** per area: trigger, cosa caricare subito, divieti frequenti, mappa file, link ai LOCK — **senza duplicare** testo LOCK/RULE di `APP_CONTEXT_SKILL.md` §4.

I profili **Esecuzione / Verifica / Meta** restano in **§0.0** (R1a).

---

## Dove vivono (L1c + N2a)

| Livello | Ruolo |
|---------|--------|
| **`docs/<Area>-Skill/*_MINI.md`** | Contenuto del mini-pack (versionato, tutti gli agenti) |
| **`.cursor/skills/calendarbackup-<area>/SKILL.md`** | Solo puntatore Cursor (15–25 righe → leggi `*_MINI.md` + skill piena) |
| **`docs/APP_CONTEXT_SKILL.md` §0.0b** | Indice area → mini-pack → skill piena (H2b) |

**Vietato:** copiare paragrafi LOCK in due file. Nel mini-pack: **nome + link** (`ADMIN_CLASSIC_SKILL.md` §4b, `PRENOTA_DATA_FLOW_CONTEXT.md`, ecc.).

---

## Template mini-pack (F1a)

Ogni `*_MINI.md` usa queste 5 sezioni:

1. **Trigger** — 5–10 parole/frasi Matteo che significano quest’area
2. **Carica subito** — 1 skill ingresso + max 2 context se LOCK/obbligatori
3. **Divieti top-3** — errori ricorrenti (es. Prenota ≠ Menu QR)
4. **Mappa** — tabella file → quando aprirlo
5. **LOCK** — solo elenco puntato con link alla sezione nella skill/context piena

Target lunghezza: **≤ 80 righe** per mini-pack.

---

## Indice §0.0b (da aggiungere in implementazione)

Bozza struttura per `APP_CONTEXT_SKILL.md`:

```markdown
### 0.0b Mini-pack — ingresso rapido per area

Se conosci già l’area, leggi il mini-pack **prima** della skill piena (meno token, stessi LOCK via link).

| Area | Mini-pack | Skill piena |
|------|-----------|-------------|
| Pagina Prenota | `docs/Prenota-Skill/PRENOTA_MINI.md` | `PRENOTA_SKILL.md` |
| Menu QR | `docs/Menu-QR-Skill/MENU_QR_MINI.md` | `MENU_QR_SKILL.md` |
| Admin (shell + classica) | `docs/Admin-Skill/ADMIN_MINI.md` | `ADMIN_SKILL.md` + `ADMIN_SHELL_SKILL.md` / `ADMIN_CLASSIC_SKILL.md` |
| … | (Imp-3) | … |
```

La tabella §0 esistente **non si duplica** — §0.0b è solo scorciatoia.

---

## Rollout (ordine Matteo)

| Fase | ID | File da creare | Cursor skill (puntatore) |
|------|-----|----------------|--------------------------|
| **Imp-1** | P1 | `PRENOTA_MINI.md`, `MENU_QR_MINI.md` | `calendarbackup-prenota`, `calendarbackup-menu-qr` |
| **Imp-2** | A3 | `ADMIN_MINI.md` (unico: shell + classica + link calendario LOCK) | `calendarbackup-admin` |
| **Imp-3** | sequenza | `ADMIN_MENU_MAGAZZINO_MINI.md` (A4), `DB_MINI.md` (A5), `MARKETING_MINI.md` + `LEGAL_MINI.md` o unificati (A6), `TESTING_MINI.md` (A7) | puntatori omonimi |

Imp-3 nell’ordine **A4 → A5 → A6 → A7** — un WP implementativo per fase o un WP unico a scelta dell’agente.

---

## Manutenzione (M3a + M3b leggero)

| Evento | Azione |
|--------|--------|
| Cambia LOCK / regola in skill piena | Aggiorna **solo** skill/context piena; mini-pack ok se link ancora validi |
| Cambia routing §0 | Aggiorna `APP_CONTEXT` + riga §0.0b se nuova area |
| Nuovo divieto ricorrente | Aggiorna sezione **Divieti top-3** del mini-pack area |
| Report chiusura tocca un’area con mini-pack | Checklist report: «mini-pack `*_MINI.md` ancora coerente? sì/no» |

---

## WP implementativo — checklist per agente

1. Leggere skill piena dell’area + LOCK citati in APP_CONTEXT §0.
2. Scrivere `*_MINI.md` con template F1a (no copy-paste LOCK).
3. Aggiungere `.cursor/skills/calendarbackup-<area>/SKILL.md` (puntatore).
4. Aggiornare §0.0b (solo righe delle aree create in quella fase).
5. Opzionale: una riga in skill piena «Ingresso rapido: `*_MINI.md`».
6. Report con checklist M3b.

**Profilo:** Esecuzione (docs only). **Vietato:** modificare vocabolario Liv.1/2/3 o §7 comunicazione.

---

## Relazione con FU-ALL-TIER

`FU-ALL-TIER` passa da «solo design» a **implementazione a fasi** (Imp-1/2/3). Il tier «modello agente» (Auto vs thinking) resta fuori scope — i mini-pack servono **tutti** i tier con meno contesto iniziale.

---

## Riferimenti

- `docs/APP_CONTEXT_SKILL.md` §4d (problema originale)
- `docs/MASTERPLAN_ALLINEAMENTO.md` — WP-E1
- Report: `Report-wp-e1-mini-pack-area-12-06-26.md`
