# PROMPT PER AGENTE ESECUTORE — Uniformazione responsive + sidebar overlay

> Copia il blocco sotto e dallo a un agente esecutore. È autosufficiente.
> Scritto il 16-05-26 dopo creazione skill `ui-responsive` e mappatura responsive.

---

## PROMPT (da copiare all'agente)

Devi eseguire l'uniformazione del responsive design di CalendarBackup-v2 e poi
aggiornare il sistema di skill. Lavora in fasi, fermandoti ai checkpoint indicati.

### Passo 0 — Carica contesto (obbligatorio prima di toccare codice)

1. Leggi `docs/APP_CONTEXT_SKILL.md` (orientamento + invarianti globali).
2. Leggi `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` e
   `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` (regola fondante, pattern,
   checklist).
3. Leggi `docs/per-ui-design-skill/STYLING_AGENT_CONTEXT.md` (token, anti-pattern).
4. La FASE 1 tocca `AdminShell.tsx` → leggi anche
   `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md`.
5. La FASE 2 tocca pagine; se tocchi `AdminDashboard.tsx` o componenti booking
   → leggi `docs/ADMIN_CLASSIC_SKILL.md` e produci spiegazione preventiva (5 punti)
   PRIMA di modificare, attendendo conferma utente.

**Regola fondante da rispettare in ogni modifica:** la pagina è progettata a
viewport pieno. La sidebar quando aperta è overlay con backdrop scuro — non
spinge, non restringe mai il contenuto. Un solo layout responsive per Classic e
Pro. Riferimento gold standard = `src/pages/AdminDashboard.tsx`. Container
standard = `max-w-7xl`.

---

### FASE 1 — Sidebar overlay a tutte le larghezze (file: AdminShell.tsx)

**Stato attuale** (`src/components/layout/AdminShell.tsx`):
- Hook `useIsNarrow()` ~riga 43: true sotto 644px.
- `isNarrowDrawerOpen = isNarrow && expanded` ~riga 187.
- Backdrop scuro `bg-black/40 z-7999` renderizzato solo se `isNarrowDrawerOpen`
  (~riga 201-208).
- `<aside>` ~riga 210-218: classi condizionali —
  `isNarrowDrawerOpen` → `fixed inset-y-0 z-8000 w-56` (overlay corretto);
  `isNarrow && !drawer` → `relative w-16`;
  `!isNarrow && expanded` → `relative w-56` (PUSH — da cambiare);
  `!isNarrow && !expanded` → `relative w-16` (PUSH collapsed).
- `<main>` ~riga 369: `flex min-h-0 flex-1` — prende lo spazio che resta.

**Obiettivo:** quando la sidebar è ESPANSA (`expanded`), deve comportarsi da
overlay con backdrop a QUALSIASI larghezza, non solo sotto 644px. Quando è
collassata resta una barra stretta `w-16` in flusso (la striscia di icone non
disturba ed è il comportamento attuale già accettato).

**Comportamento target:**
| Stato | < 644px (oggi) | ≥ 644px (oggi) | ≥ 644px (target) |
|-------|----------------|----------------|------------------|
| Espansa | overlay + backdrop ✅ | push w-56 ❌ | **overlay + backdrop** |
| Collassata | barra w-16 in flusso | barra w-16 in flusso | invariato (w-16 in flusso) |

**Come (linea guida, non vincolo rigido):**
- Generalizzare la condizione drawer: l'overlay non deve dipendere da `isNarrow`
  ma solo da `expanded`. Es. `const isDrawerOpen = expanded` per il
  posizionamento `fixed`/backdrop, mantenendo `isNarrow` solo dove serve per
  l'autochiusura on-click già esistente.
- Backdrop (`bg-black/40 z-7999`) reso quando la sidebar è espansa a qualsiasi
  larghezza.
- `<aside>` espansa → sempre `fixed inset-y-0 left-0 z-8000 w-56 shadow-xl`.
- `<aside>` collassata → `relative w-16` come ora.
- Verificare che la transizione `transition-[width]` non causi glitch passando
  da fixed a relative; se serve usare `transition` su transform/opacity.
- NON modificare lo z-index di Modal/Toast (LOCK). z-7999/z-8000 sidebar sono
  sotto Modal — mantenerli.
- Il ritorno anticipato Classic (`if (!features.sidebar)`) NON cambia: Classic
  non ha sidebar, resta full-width.

**Checkpoint 1 — FERMATI:** prima di modificare `AdminShell.tsx`, scrivi
all'utente una spiegazione preventiva in 5 punti (cosa cambia, cosa si rompe se
sbaglio, comportamento expanded/collapsed/Classic, rischio transizione, file
toccati) e attendi conferma. È file di area shell.

Dopo conferma e modifica: `npm run typecheck && npm run lint` verdi.

---

### FASE 2 — Uniformazione pagine Pro al riferimento Classic

Solo dopo FASE 1 approvata e mergiata concettualmente (ora le pagine hanno il
viewport pieno, quindi ha senso allargarle).

File: `src/pages/AdminHomePage.tsx`, `CrmPage.tsx`, `ServizioPage.tsx`,
`AnalyticsPage.tsx`.

Allinea al pattern Classic (vedi `UI_RESPONSIVE_CONTEXT.md` §1 e §6):
1. Container `max-w-6xl` → `max-w-7xl`.
2. Padding verticale `py-6` fisso → `py-5 md:py-7`.
3. AdminHomePage stat grid `md:grid-cols-3` → valuta `md:grid-cols-4` come
   Classic SE i dati lo permettono visivamente; se no, lascia e annota in
   commento il perché.
4. Non fare refactor non richiesto: tocca solo questi punti, una pagina alla
   volta, verificando che il contenuto non rompa.

Dopo ogni pagina: `npm run typecheck && npm run lint`. A fine fase:
`npm run validate`.

---

### FASE 3 — Aggiorna il sistema skill a lavoro revisionato

1. `UI_RESPONSIVE_CONTEXT.md` §0: aggiorna la nota "stato attuale del codice" —
   ora l'overlay vale a tutte le larghezze (non più solo <645px). Rimuovi la
   dicitura "legacy/in transizione" per il push ≥645px.
2. `UI_RESPONSIVE_CONTEXT.md` §6: rimuovi dalle "incongruenze note" le voci
   effettivamente sanate (max-w, py); lascia solo quelle non risolte.
3. Se hai toccato `AdminShell.tsx`: aggiorna
   `docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md` (sezione layout/sidebar)
   come richiesto da APP_CONTEXT_SKILL.md §7.2.
4. Aggiorna la memoria: file
   `~/.claude/projects/.../memory/project_responsive_design.md` — cambia il
   "Why" per riflettere che l'overlay ≥645px è ora implementato, non più solo
   concettuale.

---

### FASE 4 — Report di fine sessione

Crea `docs/Sessioni di lavoro/GG-MM-AA/Report-responsive-uniformazione.md` con:
cosa fatto in ordine, file toccati e perché (linguaggio utente non tecnico —
"ora Mario su desktop vede la sidebar aprirsi sopra senza che la pagina si
stringa"), checkpoint e risposte utente, esito `npm run validate`, cosa resta.

---

### Vincoli trasversali (non negoziabili)

- Classi Tailwind letterali statiche — mai `grid-cols-${n}` o breakpoint dinamici.
- `cn()` da `@/lib/utils`, mai clsx/twMerge diretti.
- LOCK: Modal z-index, CollapsibleCard, DateInput/TimeInput, TenantContext,
  supabase.ts, supabase/migrations/ — non toccare.
- Mobile-first; 645px è solo della shell, mai nei componenti pagina.
- Commit: `feat(ui):` / `fix(ui):` / `update(ui):`. Non committare/push senza
  richiesta esplicita utente.
- Se un sotto-task entra in area admin classica → ADMIN_CLASSIC_SKILL.md +
  spiegazione preventiva, anche se non era previsto all'inizio.
