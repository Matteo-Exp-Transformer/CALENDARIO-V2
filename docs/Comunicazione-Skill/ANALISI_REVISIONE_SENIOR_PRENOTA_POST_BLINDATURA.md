# Analisi per Meta senior — Prenota post-blindatura (04-06-26)

> **Per chi legge:** agente **Meta senior** (grilletto «evolvi skill system senior»). Obiettivo: decidere
> cosa fare con file obsoleti, debiti doc, e coda fix prodotto senza ridiscutere le regole già decise in
> `PROSEGUIMENTO_MAPPATURA_SKILL.md`.

**Punto di ripresa globale:** [`PROSEGUIMENTO_MAPPATURA_SKILL.md`](PROSEGUIMENTO_MAPPATURA_SKILL.md)

---

## 1. Verdetto sulla blindatura Pagina Prenota

| Criterio playbook | Esito | Evidenza |
|-------------------|-------|----------|
| Senso + attori | ✅ | `docs/Prenota-Skill/PRENOTA_SKILL.md` §1–2 |
| Flusso user journey + data flow | ✅ | `PRENOTA_SKILL.md` §2-bis |
| Limiti voluti blindati | ✅ | `PRENOTA_SKILL.md` §3 (no contatore cliente, XOR, no fallback hardcoded, ecc.) |
| Dettaglio in `contesto/` | ✅ | 4 file: layout, form-config, data-flow, text-limits |
| Routing Skill 0 | ✅ | `APP_CONTEXT_SKILL.md` §0 + RULE §4 → `Prenota-Skill/` |
| Verifica sub-agent | ✅ documentata | `PROSEGUIMENTO_MAPPATURA_SKILL.md` tabella — PASSA 04-06-26 |
| Codice allineato ai limiti cliente | 🔶 | `bookingPrenotaTextLimits.ts` + `create-booking` + test; **FU-031** QA manuale ancora aperto |
| Propagazione rimandi | 🔶 | Stub obsoleti aggiunti 04-06-26; restano note in `.cursor/skills/calendarbackup-app-context/SKILL.md` |

**Conclusione:** l’area è **blindata come documentazione e orientamento agente**. Non va «rimappata».
Il senior deve **consolidare** (rimandi, duplicati, follow-up) e **pianificare esecuzione** dei fix
prodotto già decisi, non riaprire il censimento senso/perché.

---

## 2. File obsoleti vs canonici

### 2.1 Canonici (unica verità)

```
docs/Prenota-Skill/
├── PRENOTA_SKILL.md
└── contesto/
    ├── PRENOTA_LAYOUT_CONTEXT.md
    ├── PRENOTA_FORM_CONFIG_CONTEXT.md
    ├── PRENOTA_DATA_FLOW_CONTEXT.md
    └── PRENOTA_TEXT_LIMITS_MAP.md
```

### 2.2 Obsoleti / rimossi

| Path | Stato 04-06-26 | Azione consigliata senior |
|------|----------------|---------------------------|
| `per-ui-design-skill/BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT.md` | **Stub rimando** → Prenota-Skill | Dopo 1–2 sessioni senza link morti: `git rm` o lasciare stub permanente |
| `per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | **Stub rimando** | Idem |
| `per-ui-design-skill/BOOKING_DATA_FLOW_SKILL.md` | **Eliminato** (già assente) | Nessuna azione; verificare che nessun report nuovo lo citi |
| `per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` | **Ancora valido** | **Non** confondere: è area **admin Richieste in attesa**, fuori migrazione Prenota pubblica |

### 2.3 Puntatori ancora stale (da aggiornare in sessione doc breve)

- `.cursor/skills/calendarbackup-app-context/SKILL.md` — cronologia 26–29/05 con vecchi nomi file
- `.cursor/rules/comandi-base.mdc` — esempio «lavoro ok» con `BOOKING_REQUEST_PAGE_LAYOUT_CONTEXT`
- `APP_CONTEXT_SKILL.md` §4c — testo «BOOKING_DATA_FLOW» → rinominare `PRENOTA_DATA_FLOW_CONTEXT`

**Regola playbook:** report in `Sessioni di lavoro/` **non si riscrivono**; gli stub coprono grep e agenti che seguono link vecchi.

### 2.4 Opzioni decisionali per il senior

| Opzione | Pro | Contro |
|---------|-----|--------|
| **A — Stub permanenti** (stato attuale) | Zero rottura link storici; costo minimo | Due file «fantasma» in `per-ui-design-skill/` |
| **B — Delete + grep globale** | Cartella più pulita | Report/sessioni con path morti (accettabile se solo storico) |
| **C — Redirect + aggiornare solo puntatori vivi** | Bilanciato | Richiede passata su `.cursor/` e `APP_CONTEXT` |

**Raccomandazione:** **C ora** (puntatori vivi) + **A per 1–2 mesi**, poi **B** se nessun agente apre più gli stub.

---

## 3. Fix prodotto da consolidare (non confondere con mappatura)

Già decisi in skill / FOLLOW_UP; pronti per prompt **Esecuzione** `light`/`standard`.

| ID | Cosa | File principali | Complessità | Dipendenze |
|----|------|-----------------|-------------|------------|
| **Fix 1** | ✅ **Fatto** 04-06-26 — `courses_label` su card pubblica | [Report](Sessioni%20di%20lavoro/04-06-26/Report-courses-label-card-sottotab-prenota-04-06-26.md) | — | `BookingSubTabCards.tsx` + skill §4/§C/§5/§8.1 |
| **Fix 2** | ✅ **Fatto** 04-06-26 — **FU-032** nome locale **45** | [Report](Sessioni%20di%20lavoro/04-06-26/Report-fu-032-restaurant-name-45-04-06-26.md) | — | Anagrafica + registry + `useRestaurantName` + §A |
| **Fix 3** | 🔶 **Verifica** 04-06-26 — **FU-031** ancora **Aperto** (gap edge deploy + UX messaggio campi lunghi) | [Report](Sessioni%20di%20lavoro/04-06-26/Report-fu-031-limiti-cliente-prenota-04-06-26.md) | — | Cap UI OK; edge TEST ≠ repo; prompt Esecuzione in report |

**Dopo i 3 semplici (coda media/lunga):**

| ID | Complessità | Note |
|----|-------------|------|
| **FU-030** cap menù ingredienti | Medio 3–5 h | Tab Menu + costanti + mappa §E |
| **FU-014** palette multi-layout | Complesso | Refactor `PublicBookingSurface` |
| **FU-010** hook validazione condiviso | Medio-alto | Trasversale admin |
| **FU-009** mappatura giro 3 | Medio-basso | Checklist QA/doc |
| **FU-023** fallback globali | Lungo | Audit app intera |

**Working tree (se presente a revisione):** diff su `bookingPrenotaTextLimits.ts`, `create-booking`, test — verificare se chiude FU-031 o è lavoro parallelo; non duplicare commit.

---

## 4. Allineamento skill post-fix (§7.2)

Per ogni fix esecuzione che tocca comportamento/layout:

| Fix | Skill da aggiornare a «lavoro ok» |
|-----|-----------------------------------|
| courses_label | `PRENOTA_SKILL.md` §4 (rimuovere voce aperta), `PRENOTA_TEXT_LIMITS_MAP.md` §C, `PRENOTA_LAYOUT_CONTEXT.md` §5/8.1 se serve |
| FU-032 | `PRENOTA_TEXT_LIMITS_MAP.md` §A, eventuale nota Anagrafica in `PRENOTA_FORM_CONFIG` |
| FU-031 | Chiudere riga **FU-031** in `FOLLOW_UP.md`; report Verifica con tabella viewport |

---

## 5. Prossimo passo skill system (fuori Prenota)

`PROSEGUIMENTO_MAPPATURA_SKILL.md`: **Menu QR pubblico** ⬜ — candidato naturale per validare il pattern su seconda area. Prenota non va riaperta salvo regressioni sub-agent.

**Milestone template v.0:** propagazione struttura cartella-area resta sospesa fino a ≥2–3 aree blindate (Prenota blindata + 3 prompt 04-06-26 eseguiti).

**Controverifica 04-06-26 (pre-commit):** `npm run validate` **291** test; working tree include anche fallback Prenota (`BookingRequestPage`, `presetMenus`, `bookingPublicFormConfig`, …) oltre ai 3 prompt; stub obsoleti in `per-ui-design-skill/` (gitignored, su disco).

---

## 6. Prompt già preparati per Matteo

Tre prompt **Esecuzione** (fix semplici) — consegnati in chat sessione prepara-prompt 04-06-26; incollare uno per sessione:

1. `courses_label` in `BookingSubTabCards`
2. FU-032 `restaurant_name`
3. FU-031 QA limiti cliente (Verifica)

Non duplicare qui il testo intero: restano nel messaggio/chat di consegna o si rigenerano da questa tabella + `PRENOTA_SKILL.md`.

---

## 7. Checklist decisionale senior (una sessione)

- [ ] Confermare blindatura ✅ senza re-intervista senso
- [ ] Scegliere A/B/C su file obsoleti (§2.4)
- [ ] Aggiornare puntatori `.cursor/` + `comandi-base` + §4c APP_CONTEXT
- [ ] Ordinare coda fix: 1 → 2 → 3, poi FU-030
- [ ] Verificare working tree vs FU-031 prima di nuovo codice
- [ ] Schedulare sessione Menu QR mappatura (prossima area)
