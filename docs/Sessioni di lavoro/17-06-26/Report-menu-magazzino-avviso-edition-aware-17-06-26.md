# Report — Tab Menu: avviso salvataggio edition-aware

**Data:** 17-06-26  
**Branch:** `env/test`  
**Profilo:** Esecuzione standard

---

## 1. Obiettivo

Rendere edition-aware il banner di propagazione nel form Nuovo/Modifica Prodotto (`MenuMagazzinoPropagationNotice`): Classic senza add-on QR Menu non deve citare Menu QR; con `features.qrMenu` attivo può citarlo. Fonte feature: `useFeatures` → `tenant_features`, non `organizations.qr_menu_enabled`.

---

## 2. Modifiche src/

| File | Modifica |
|------|----------|
| `menuMagazzinoLimits.ts` | Sostituita costante fissa con `getMenuMagazzinoSavePropagationMessage(qrMenuEnabled)` |
| `MenuMagazzinoPropagationNotice.tsx` | Legge `useFeatures().qrMenu` e mostra copy dinamica |
| `menuMagazzinoLimits.adminBlindatura.test.ts` | +2 test copy Classic vs QR |
| `menuMagazzinoPropagationNotice.adminBlindatura.test.tsx` | Nuovo file, 2 test componente |

Nessun cambio al flusso dati magazzino né agli snapshot prenotazioni.

---

## 3. validate

```
97 file | 790 test — tutti verdi (17-06-26)
```

(+4 test rispetto a 786 precedente)

---

## 4. Allineamento skill §7.2

| File | Aggiornamento |
|------|---------------|
| `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` | §3.3 avviso propagazione edition-aware; §9.3 Fase 1 punto 3 |

---

## 5. La tua lettura della sessione

Fix mirato e a basso rischio: il componente già vive nel tab Menu e `MenuPricesTab` usa già `features.qrMenu` per mostrare/nascondere la sezione QR — stessa fonte, stesso pattern. I toggle disponibilità (occhio «in Prenota e Menu QR») restano fuori scope: citano ancora entrambe le superfici anche su Classic; eventuale allineamento = task separato.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: (1) «PROMPT 1 — Tab Menu: avviso salvataggio edition-aware / Profilo: Esecuzione / Modalità: standard / Skill da leggere: docs/Admin-Skill/ADMIN_MENU_MAGAZZINO_MINI.md + docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md + docs/Marketing-Skill/MARKETING_MINI.md + docs/DATA_FLOW_SKILL.md se serve capire feature/edition. / Non caricare: codice fuori dalla tab Menu/feature flag, salvo grep mirato. / Output attesi: fix copy avviso Menu magazzino + test/validate pertinenti + report §7.1 + allineamento skill §7.2 se cambia una regola documentata. Niente output in più senza chiedere Sì/No prima. / Branch: env/test. / Obiettivo: Admin → tab Menu / magazzino. Il banner di propagazione salvataggio oggi dice sempre che il salvataggio aggiorna Pagina Prenota e Menu QR. Va reso compatibile con l'edition/feature attiva: se il tenant è Classic senza add-on QR Menu, NON citare Menu QR. Se QR Menu è disponibile, il messaggio può citarlo. / Vincoli: Non cambiare il flusso dati del magazzino. Non toccare snapshot prenotazioni esistenti. Non usare organizations.qr_menu_enabled come fonte add-on: la fonte corretta è feature/tenant_features tramite flusso feature esistente. Se scopri che serve una modifica più ampia a feature flags, alza a deep e segnala. / Criterio di fatto: Su tenant Classic senza QR il banner cita solo Pagina Prenota; su tenant con QR attivo cita anche Menu QR. npm run validate verde o motivare eventuale subset. / quando hai finito dammi checklist del lavoro svolto per rapida verifica in ui dev mode». (2) «⚠️ FINE-SESSIONE — la sezione «Domande di chiusura» (CHIUSURA_SESSIONE §11) non è completa: docs/Sessioni di lavoro/17-06-26/Report-menu-magazzino-avviso-edition-aware-17-06-26.md manca l'INTERA sezione 11 «Domande di chiusura» (le 6 domande ❓Q + ✅R). Aggiungila e rispondi. / Le domande sono in docs/Comunicazione-Skill/CHIUSURA_SESSIONE.md §11 — formato ❓ Q… / ✅ R…. / Per Q2 (dati=diff) e Q3 (file correlati) DEVI rileggere il diff e i file prima di rispondere: è il punto. / Compila TUTTE le risposte mancanti, poi conferma in 1 riga che le hai scritte.»

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Ri-verificato con `git diff` e lettura file (17-06-26). **File di questa sessione (task avviso edition-aware):** `menuMagazzinoLimits.ts` — rimossa costante `MENU_MAGAZZINO_SAVE_PROPAGATION_MESSAGE`, aggiunti `MENU_MAGAZZINO_SAVE_PROPAGATION_SNAPSHOT_SUFFIX` + `getMenuMagazzinoSavePropagationMessage(qrMenuEnabled)` con ramo `false` → solo «la Pagina Prenota», `true` → «la Pagina Prenota e il Menu QR»; `MenuMagazzinoPropagationNotice.tsx` — import `useFeatures`, passa `qrMenu` alla helper; `menuMagazzinoLimits.adminBlindatura.test.ts` — +17 righe, describe «avviso propagazione save (edition-aware)» con 2 `it`; `menuMagazzinoPropagationNotice.adminBlindatura.test.tsx` — untracked, 58 righe, 2 test con mock `useFeatures`. **Skill:** `ADMIN_MENU_MAGAZZINO_CONTEXT.md` — §3.3 e §9.3 punto 3 aggiornati come in §4 report. **Validate:** `npm run validate` in sessione → 97 file, 790 test passed (+4 vs 786 citato nel report precedente FIX 9). **Nota working tree:** il diff globale include anche modifiche **non di questo task** (`.claude/CLAUDE.md`, `.env.example`, `package.json`, `scripts/bookingSeedShared.mjs`, seed scripts) — non le attribuisco a questo report. Il report §2 elenca correttamente solo i 4 file src/ del fix.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: **Aggiornati:** `docs/Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md` (regola avviso edition-aware + fonte `useFeatures`). **Verificati, aggiornamento non necessario:** `ADMIN_MENU_MAGAZZINO_MINI.md` (non documenta il copy del banner); `src/hooks/useFeatures.ts` + `src/config/features.ts` (già espongono `qrMenu` da `tenant_features` — riusati senza modifica); `MenuPricesTab.tsx` (importa già `MenuMagazzinoPropagationNotice` senza props — nessun cambio); test esistenti che mockano `useFeatures` (es. `menuPricesEditClose.adminBlindatura.test.tsx`) — compatibili. **Non aggiornati (debito minore):** `docs/Admin-Skill/contesto/ADMIN_TEST_SUITE_INDEX.md` — ancora «9 test menu-magazzino-limits» e nessuna riga per `menu-magazzino-propagation-notice` (ora 11+2 test); `STATO_BLINDATURA_CHECKLIST.md` / `MASTERPLAN_BLINDATURA.md` — menzione generica avviso propagazione, non regola edition-aware. Scelta: sessione standard, skill d'area §7.2 coperta; aggiornare l'indice test = follow-up opzionale se Matteo vuole contatori allineati.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: (a) **Toggle disponibilità** (pulsanti occhio «in Prenota e Menu QR» nella panoramica categorie/ingredienti) — fuori scope esplicito del prompt; copy ancora dual-superficie anche su Classic senza QR. (b) **E2E Playwright** sul banner edition-aware — non richiesto (solo Vitest + validate); verifica UI lasciata a checklist manuale dev mode. (c) **ADMIN_TEST_SUITE_INDEX** contatori — vedi R3. (d) **Commit/push** — non richiesti. Nessun altro obbligo del brief saltato: flusso dati, snapshot, `organizations.qr_menu_enabled` intatti per vincolo.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito basso — il pattern `features.qrMenu` era già usato nello stesso tab Menu, quindi zero esplorazione feature flags. Miglioria probabile: nel mini-pack `ADMIN_MENU_MAGAZZINO_MINI.md` una riga «copy UI edition-aware → `getMenuMagazzinoSavePropagationMessage` + `useFeatures`» eviterebbe di dover aprire il context §9 per capire se altri testi magazzino (toggle occhio, modali delete) vanno allineati o restano fuori scope.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Contesto **giusto** — mini-pack Admin Menu + MARKETING_MINI (divieto `qr_menu_enabled`) bastavano; grep mirato su `MenuMagazzinoPropagationNotice` ha chiuso il perimetro senza leggere tutto `MenuPricesTab`. Hook fine-sessione su §11 **utile**: il report standard era incompleto senza Q1–Q6; il nudge è corretto e non rumore.
