# Prompt B — Menu QR homepage · scroll footer sfondo (#8 / FU-021)

> **Tipo sessione:** SCRITTURA CODICE (esecutore).  
> **Prepara-prompt:** copia il blocco sotto in chat Esecuzione. Non includere la sezione «A valle prepara-prompt».  
> **Smoke:** `/menu/test-pro/qr/x7zuud5` · tenant TEST · branch `main` o `env/test` (allineare prima del commit).

---

## PROMPT B — esecutore (copia in chat Esecuzione)

Modalità: **deep**. L'esecutore può solo alzare la modalità, mai abbassarla.

### Obiettivo

**Checklist ciclo #8 / FU-021 (1)** — Homepage **menu QR cliente**: scroll fino al **footer** (card data/ora) e risalita **senza salto/lampeggio** dello sfondo tema.

### Contesto

- QA Matteo: #8 **KO**; fix `repeat-y` Prompt 2 (30-05-26) insufficiente.
- **FU-025 chiuso** — wrapper `max-w-[1024px]` + sfondo su div esterno `min-h-svh`; **non rompere** desktop centrato.
- File: `src/pages/PublicMenuPage.tsx` — `useMenuPageBackgroundStyle`, `MenuContent`, `MenuFooterCard`.
- Report ciclo: `docs/Sessioni di lavoro/30-05-26/Report-prepara-prompt-ciclo-menu-qr-fix-30-05-26.md`

### Comportamento atteso

| Dove | Cosa fai | OK se… |
|------|----------|--------|
| Link menu QR | DevTools ~375px: scorri fino footer, risali 2–3 volte | Sfondo **stabile**, no flash |
| Stesso | 834px e 1280px | Idem |
| Regressione FU-025 | Desktop largo | Contenuto ancora centrato max 1024px |

### Diagnosi probabile

- Sfondo su container che **scrolla** con il contenuto (`repeat-y` su `min-h-svh`) vs layer **fisso** full viewport.
- Confine footer bianco (`MenuFooterCard`) + altezza contenuto vs viewport.
- Evitare switch JS post-load; preferire layer CSS fisso / pseudo-elemento.

### Implementazione sfondo (obbligatorio)

1. **Prima scelta:** layer dedicato (pseudo-elemento `::before` o div `fixed`/`absolute` inset-0, `z-index` sotto il contenuto) con `background-image` / `background-size` sul **viewport**, non sul wrapper che scrolla.
2. **`background-attachment: fixed`:** puoi provarlo su desktop; su **mobile (375px) e Safari iOS** verifica che non reintroduca salto o area «vuota» allo scroll. Se non è affidabile, **non** usarlo come unica soluzione — passa al layer fisso (punto 1).
3. **Report (sezione obbligatoria «Compatibilità mobile sfondo»):** cosa hai implementato; se hai provato `background-attachment: fixed`, esito su 375px e nota iOS (test DevTools mobile emulation +, se possibile, Safari reale o documenta limite).

### Vincoli

- Solo homepage QR (`PublicMenuPage` + helper sfondo).
- NON: griglia card, FU-026, admin, Prenota LOCK, pagine figlia FU-019.
- `npm run validate` verde.

### Chiusura esecutore (APP_CONTEXT §7)

Report: `docs/Sessioni di lavoro/31-05-26/Report-fix-menu-qr-footer-scroll-31-05-26.md`

- Dati comunicazione (schermata + effetto).
- Sezione **Compatibilità mobile sfondo** (vedi sopra).
- Aggiorna § QA Matteo handoff (#8 OK/KO).
- FU-021 nota punto (1) se chiuso.
- `SESSION_LOG.md`. **Non committare** salvo richiesta Matteo.

---

## A valle — solo prepara-prompt (non copiare nell'esecutore)

1. Chiedere QA Matteo su #8 — tabella: Link menu QR → scorri fino footer data/ora, risali → sfondo non salta (DevTools 375px prod o telefono).
2. Se #8 OK: chiudere nota 8; proporre Prompt C (FU-026); chiedere commit ora o dopo C.
3. Se #8 KO: prompt correttivo mirato solo sfondo; non rifare viewport/FU-025.
4. Revisione agente non obbligatoria; revisione rapida prepara-prompt se validate verde + diff solo `PublicMenuPage`.
5. Commit solo se Matteo chiede; body `Review:` + path report; docs con `git add -f`.
6. Non aprire: FU-023, FU-019, migrazioni salvo richiesta.
