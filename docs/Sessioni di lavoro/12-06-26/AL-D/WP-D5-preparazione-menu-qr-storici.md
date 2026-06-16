# WP-D5 — Preparazione spostamento storici Menu QR

> Sub-agent WP-D5 · branch `env/test` · 12-06-26 · **eseguito** (spostamento + tombstone + rimandi).

---

## Before / after paths

| File | Prima | Dopo (contenuto integrale) |
|------|-------|----------------------------|
| Plan blindatura | `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md` | `docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md` |
| Report blindatura | `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md` | `docs/Sessioni di lavoro/06-06-26/REPORT_BLINDATURA_06-06-26.md` |

Al vecchio path restano **tombstone** (contenuto sostituito, non cancellati).

---

## Rimandi aggiornati (file vivi)

| File | Cosa è cambiato |
|------|-----------------|
| `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` | Riga «primo esemplare» plan: path skill → `docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md`. Riga tabella Menu QR: plan e report puntano alla cartella sessione 06-06-26. |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | Voce 06-06-26 [raffinamento]: primo esemplare plan → path sessione. Voce 06-06-26 [tecnica] parallelismo: riferimento esecuzione plan → path sessione. |

**Non aggiornati (voluto):**

- `docs/MASTERPLAN_ALLINEAMENTO.md` — regola WP: non toccare il masterplan.
- `docs/Sessioni di lavoro/**` — regola WP: solo aggiunta dei due file spostati; report storici non modificati.
- `docs/Menu-QR-Skill/MENU_QR_SKILL.md` — nessun rimando esistente; puntatore breve non necessario (skill viva non referenziava plan/report).

---

## Testo tombstone proposto (applicato)

**`docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md`**

```markdown
# ⚠️ Documento spostato — non usare questo path

> **Archiviato 12-06-26 (WP-D5).** Il contenuto integrale vive in
> [`docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md`](../Sessioni%20di%20lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md).
> Questo file resta solo come rimando per link vecchi.
```

**`docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md`**

```markdown
# ⚠️ Documento spostato — non usare questo path

> **Archiviato 12-06-26 (WP-D5).** Il contenuto integrale vive in
> [`docs/Sessioni di lavoro/06-06-26/REPORT_BLINDATURA_06-06-26.md`](../Sessioni%20di%20lavoro/06-06-26/REPORT_BLINDATURA_06-06-26.md).
> Questo file resta solo come rimando per link vecchi.
```

---

## Risultato grep finale

Comando: `rg "PLAN_BLINDATURA_MENU_QR|REPORT_BLINDATURA_06-06-26" docs --glob "!Sessioni di lavoro/**"`

| Hit | Tipo | OK |
|-----|------|-----|
| `docs/MASTERPLAN_ALLINEAMENTO.md` (2 righe) | Definizione WP con path sorgente originali | ✅ voluto non aggiornato |
| `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md` | Tombstone → sessione | ✅ |
| `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md` | Tombstone → sessione | ✅ |
| `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` (2) | Puntatori corretti sessione | ✅ |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` (2) | Puntatori corretti sessione | ✅ |

Nessun link vivo rotto al vecchio path come fonte operativa.

---

## In attesa di ok file-per-file

WP-D5 nel masterplan indica **ok già dato** da Matteo per lo spostamento. Restano comunque da confermare a chiusura:

1. **Tombstone** `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md` — testo breve + link relativo alla sessione.
2. **Tombstone** `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md` — idem.

Se Matteo preferisce rimuovere i tombstone invece di tenerli, va deciso in sessione di chiusura (masterplan: «rimuoverlo solo se Matteo approva»).

---

## Cosa è stato fatto concretamente

| Azione | File |
|--------|------|
| **Creato** (copia contenuto integrale) | `docs/Sessioni di lavoro/06-06-26/PLAN_BLINDATURA_MENU_QR.md` |
| **Creato** (copia contenuto integrale) | `docs/Sessioni di lavoro/06-06-26/REPORT_BLINDATURA_06-06-26.md` |
| **Sostituito con tombstone** | `docs/Menu-QR-Skill/PLAN_BLINDATURA_MENU_QR.md` |
| **Sostituito con tombstone** | `docs/Menu-QR-Skill/REPORT_BLINDATURA_06-06-26.md` |
| **Modificato** (rimandi) | `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` |
| **Modificato** (rimandi) | `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` |
| **Creato** (questo report) | `docs/_lavoro/Per matteo/AL-D/WP-D5-preparazione-menu-qr-storici.md` |

**Non fatto:** commit, modifica `MASTERPLAN_ALLINEAMENTO.md`, tocco `src/` / DB / MCP.
