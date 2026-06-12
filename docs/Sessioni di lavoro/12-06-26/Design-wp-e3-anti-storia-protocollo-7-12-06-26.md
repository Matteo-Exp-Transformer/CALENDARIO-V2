# Design — Anti-storia + protocollo §7 (WP-E3)

> **Stato:** approvato Matteo 12-06-26 (intervista Meta AL-E).
> **Implementazione:** fasi **Imp-E3-3 → Imp-E3-1 → Imp-E3-2** — `FU-ALL-ANTISTORIA`.
> Nessuna potatura skill in questo WP (solo design).

---

## 1. Regola anti-storia (S1b)

### Principio

| Dove | Cosa contiene |
|------|----------------|
| **`docs/Sessioni di lavoro/`** (report) | Cronologia, decisioni datate, perché di un refactor, QA di sessione |
| **Skill/context vivi** | **Stato attuale** + **divieti** + **link** al report |

### Formato ammesso in skill viva (eccezione S1b)

Max **3 righe** di **guardrail** senza date lunghe:

```markdown
> **Divieto:** NON reintrodurre `content_type=evento` nel QR.
> Dettaglio storico: [Report blindatura Menu QR 06-06-26](Sessioni%20di%20lavoro/06-06-26/...).
```

**Vietato in skill viva:**
- Paragrafi «Fino al GG-MM-AA…»
- «Nella sessione del…» / «blindatura del…» come narrativa
- Changelog per sessione (già rimosso in parte da WP-D3 su ADMIN_CLASSIC)

### Migrazione contenuti esistenti

| Strategia | Perimetro |
|-----------|-----------|
| **S2a — potatura attiva** | **Menu QR** — `MENU_QR_SKILL.md`, `MENU_QR_DATA_FLOW_CONTEXT.md`, `MENU_QR_TEXT_LIMITS_MAP.md` (blocchi «Storia» / «Fino al…») |
| **S2b — on-touch** | Tutte le altre skill: al prossimo WP che tocca il file, convertire al formato S1b |

### §7.2 tabella allineamento (K1a)

La tabella **«Se hai modificato… → Aggiorna…»** resta in `APP_CONTEXT_SKILL.md` §7.2 — è operativa, non cronologia.

---

## 2. Spezzatura protocollo §7 (H7b)

### Divisione responsabilità (già parzialmente in vigore — si completa in Imp-E3-2)

| File | Contenuto |
|------|-----------|
| **`APP_CONTEXT_SKILL.md` §7** | **QUANDO** chiudere + ruoli sintetici + allineamento skill |
| **`CHIUSURA_SESSIONE.md`** | **COME** compilare report, hook §11, procedure commit/push/terminali |

### Cosa resta in APP_CONTEXT §7 (dopo Imp-E3-2)

| Sottosezione | Contenuto |
|--------------|-----------|
| **§7.0** | **Sintetico (~5 righe):** agente di lavoro vs revisore; link `COMUNICAZIONE_UTENTE_SKILL` + `REVISIONE.md` |
| **§7.1** | Modalità light/standard/deep, trigger deep, cappello 3 righe, report unificato — **politiche QUANDO** |
| **§7.2** | Tabella allineamento file → skill (invariata) |
| **Rimando** | «Sezioni report, tono, terminali, commit → `CHIUSURA_SESSIONE.md`» |

### Cosa esce da APP_CONTEXT (solo CHIUSURA)

| Prima in §7 | Dopo Imp-E3-2 |
|-------------|----------------|
| **§7.3 Terminali Cursor** | Solo `CHIUSURA_SESSIONE.md` Parte B (o sezione terminali già ivi) |
| Dettaglio elenco sezioni report | Già solo in CHIUSURA Parte A — verificare nessun duplicato residuo in §7.1 |

### Grilletti Cursor (`comandi-base.mdc`) — Z2a

**Nessuna modifica** a lavoro ok / report finale / vocabolario. Gli hook continuano a puntare `CHIUSURA_SESSIONE.md` per il COME.

---

## 3. Nuovo §8 — Regole documentazione skill (R3a)

Aggiungere in `APP_CONTEXT_SKILL.md` (Imp-E3-3, **prima** della potatura Menu QR):

```markdown
## 8. Regole documentazione skill (anti-storia)

- **Storia** → solo `docs/Sessioni di lavoro/` (report), non nelle skill vive.
- **Skill/context vivi** → stato attuale + divieti + link al report (max 3 righe guardrail, senza date lunghe).
- **Nuovi blocchi «fino al…» / changelog sessione** → vietati nelle skill vive.
- **Migrazione:** Menu QR potatura dedicata (FU-ALL-ANTISTORIA Imp-E3-1); altre aree on-touch al prossimo WP.

Design: `Design-wp-e3-anti-storia-protocollo-7-12-06-26.md`.
```

---

## 4. WP implementativi (ordine O3b)

| Ordine | ID | Azione | File principali |
|--------|-----|--------|-------------------|
| **1** | **Imp-E3-3** | Scrivere **§8** anti-storia | `APP_CONTEXT_SKILL.md` |
| **2** | **Imp-E3-1** | Potatura narrativa Menu QR → guardrail S1b | `MENU_QR_SKILL.md`, `contesto/MENU_QR_*` |
| **3** | **Imp-E3-2** | Snellire §7 (H7b): §7.0 corto, rimuovere §7.3, verificare rimandi CHIUSURA | `APP_CONTEXT_SKILL.md`, `CHIUSURA_SESSIONE.md` (solo se serve accogliere §7.3) |
| **4** | **Imp-E3-4** | Processo on-touch — checklist report già allineata a E1 M3b | Nessun file obbligatorio |

**Profilo:** Esecuzione. **Vietato:** modificare `VOCABOLARIO.md`, Liv.1/2/3, grilletti `comandi-base.mdc`.

**Verifica Imp-E3-1:** grep skill Menu QR vivi — niente «Fino al» / «Storia, perché» lunghi; guardrail ≤3 righe con link report.

**Verifica Imp-E3-2:** hook `fine-sessione-nudge.mjs` e `fine-sessione-commit-check.mjs` ancora risolvono CHIUSURA; §7 APP_CONTEXT < ~60 righe per §7.0–7.2.

---

## 5. Riferimenti

- `docs/MASTERPLAN_ALLINEAMENTO.md` — WP-E3
- `docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md` — fonte COME
- Report: `Report-wp-e3-anti-storia-protocollo-7-12-06-26.md`
