# Phase Audit — esecuzione del master-plan (audit trail per fase)

> **Obbligatorio.** Per ogni fase `Fi` del `MASTERPLAN_CONSOLE.md`, l'Orchestrator compila un blocco
> qui sotto, così l'intero lavoro è **ricostruibile e revisionabile** dopo, anche con Matteo che ha
> dato consenso pieno (DEC-013). Niente fase "silenziosa".
>
> **Regola:** non si committa una fase il cui blocco di audit non è compilato (almeno fino a "Verdetto").

## Indice fasi

| Fase | Obiettivo | Esecutore | Revisore | Verdetto | Commit | DEC collegate |
|------|-----------|-----------|----------|----------|--------|---------------|
| F1 | Scaffolding `console/` isolata | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `c981fc0` | DEC-001, DEC-014, DEC-016 |
| F2 | Elenco ristoranti (sola lettura) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | `49c0230` | DEC-017 |
| F3 | Login reale (Supabase Auth + allowlist) | Sonnet (general-purpose) | Sonnet (general-purpose) | 🟢 VERDE | _(vedi git log)_ | DEC-018, DEC-019, DEC-020; PLAN-DB-002 |

---

### Fase F1 — Scaffolding `console/` isolata
- **Obiettivo / effetto:** app Console vuota ma funzionante e **isolata** dalla pipeline di Matteo, collegata al DB TEST con sola chiave pubblica. Effetto: cantiere separato che non può rompere l'app di Matteo.
- **Modalità:** deep
- **Dipendenze:** nessuna

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F1 (prompt esecutore)
- Sintesi: creato sotto-progetto `console/` (Vite+React+TS+`@supabase/supabase-js`), client Supabase con sola anon key da `import.meta.env`, placeholder login (rimanda a F3), app shell vuota. Isolamento root via exclude.
- File toccati: nuovi sotto `console/` (package.json, vite.config.ts, tsconfig.json, tsconfig.node.json, .eslintrc.cjs, .gitignore, .env.example, postcss.config.js, index.html, src/App.tsx, src/main.tsx, src/vite-env.d.ts, src/lib/supabaseClient.ts, src/components/LoginPlaceholder.tsx, src/components/AppShell.tsx, src/styles/global.css). Root (solo esclusioni minime): `tsconfig.json`, `.eslintrc.cjs`, `vitest.config.ts`.
- Decisioni autonome prese: DEC-016 (porta 5174, alias `@console/`, postcss locale vuoto, `isAuthenticated=false` transitorio, `robots noindex`).
- Scritture DB: nessuna.
- Plan per Matteo generati: nessuno.

**Revisore (controverifica)**
- Done-criteria verificati: DC-1 isolamento ✓ · DC-2 esclusione pipeline root (tsconfig/ESLint/Vitest) ✓ · DC-3 nessun import da `../src` (grep) ✓ · DC-4 nessuna service role/secret nel browser, chiavi solo pubbliche da env, `.env.local` gitignored ✓ · DC-5 placeholder login ✓ · DC-6 build reale `npm run build` 33 moduli, 0 errori ✓
- Regole d'oro rispettate: ✓ (modifiche root = solo esclusioni di `console/`; nessuna scrittura DB; nessun import da `../src`)
- Test/lint/typecheck: build `console/` verde (tsc 0 errori). Pipeline root non installata in ambiente (preesistente), ma non vede `console/`.
- Regressioni controllate: file root toccati = solo righe di esclusione (diff verificato).
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `c981fc0` — feat(console): scaffolding isolato console/ (F1, DEC-016)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: scelta UI library/Tailwind (F2), deploy Vercel (DEC-012, futuro)

---

### Fase F2 — Elenco ristoranti (sola lettura)
- **Obiettivo / effetto:** prima schermata reale: la Console legge `organizations` e mostra l'elenco dei ristoranti. Effetto: si vedono i tenant veri dal browser, in sola lettura.
- **Modalità:** standard
- **Dipendenze:** F1

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F2 (prompt esecutore)
- Sintesi: creata `RestaurantList.tsx` (legge `organizations`, stati loading/error/empty), helper `editionUtils.ts` locale (normalize/label/colori edition), integrata in `AppShell`. Creato `console/.env.local` (gitignored) con URL+anon key TEST recuperati via MCP CONSOLE.
- File toccati: `console/src/components/RestaurantList.tsx` (nuovo), `console/src/lib/editionUtils.ts` (nuovo), `console/src/components/AppShell.tsx` (mod), `console/src/App.tsx` (mod), `console/.env.local` (non tracciato).
- Decisioni autonome prese: DEC-017 (anon key legacy JWT; `isAuthenticated=true` transitorio per mostrare la shell in attesa di F3; griglia responsive senza media query).
- Scritture DB: nessuna. `get_project_url` verificato = docnnernvp (TEST). Lettura via client pubblico (policy `anon_select_active_organizations`): 7 tenant attivi.
- Plan per Matteo generati: nessuno.

**Revisore (controverifica)**
- Done-criteria verificati: name/slug/edition/is_active ✓ · sola lettura (grep insert/update/upsert/delete/rpc = 0) ✓ · responsive + stati loading/error/empty ✓ · helper edition ricreato, nessun import da `../src`/`@/` ✓ · nessuna service role nel browser, `.env.local` non tracciato ✓ · build reale 77 moduli + tsc 0 errori ✓
- Regole d'oro rispettate: ✓ (nessuna modifica fuori da `console/`; `src/`/`supabase/` intatti; RLS non aggirata)
- Test/lint/typecheck: `npm run typecheck` exit 0; `npm run build` ok.
- Regressioni controllate: diff confinato a `console/src/`.
- **Verdetto:** 🟢 VERDE
- Ri-lavorazioni: nessuna (verde al round 1).

**Chiusura fase**
- **Commit:** `49c0230` — feat(console): elenco ristoranti (F2, DEC-017)
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: FU-CONSOLE-5 (tenant sospesi non visibili al client anon — rivalutare in F3/F5 con auth super-admin)

---

### Fase F3 — Login reale (Supabase Auth + allowlist email)
- **Obiettivo / effetto:** sostituito il gate transitorio con un login vero (Magic Link) che fa entrare solo le email in allowlist (DEC-011). Effetto: la Console è privata davvero.
- **Modalità:** deep
- **Dipendenze:** F1

**Esecutore**
- Prompt usato: `MASTERPLAN_CONSOLE.md` §F3 (prompt esecutore)
- Sintesi: implementato login Magic Link (`signInWithOtp`, `shouldCreateUser:false`); hook `useAuth` (getSession + onAuthStateChange) con stati `loading|unauthenticated|denied|authenticated`; allowlist email pura/testabile via env `VITE_CONSOLE_ALLOWED_EMAILS` (case-insensitive, fail-safe vuota=nessuno); `LoginScreen` reale; logout in `AppShell`; rimosso `isAuthenticated=true` di F2.
- File toccati: `console/src/lib/authAllowlist.ts` (nuovo), `console/src/hooks/useAuth.ts` (nuovo), `console/src/components/LoginScreen.tsx` (nuovo), `console/src/App.tsx` (mod), `console/src/components/AppShell.tsx` (mod), `console/.env.example` (mod). `LoginPlaceholder.tsx` orfano.
- Decisioni autonome prese: DEC-018 (`shouldCreateUser:false`), DEC-019 (allowlist come Set singleton env-time), DEC-020 (`AuthState` union discriminata).
- Scritture DB: nessuna.
- Plan per Matteo generati: **PLAN-DB-002** (allowlist lato DB: tabella `console_allowed_emails` + `is_console_user()` SECURITY DEFINER + template RLS) — da eseguire da Matteo.

**Revisore (controverifica)**
- Done-criteria verificati: login Magic Link + getSession/onAuthStateChange ✓ · allowlist case-insensitive + fail-safe + signOut su denied ✓ · viste protette + gate F2 rimosso ✓ · logout ✓ · nessuna service role nel browser (grep) ✓ · build+typecheck+lint 0 errori/0 warning ✓
- Regole d'oro rispettate: ✓ (`src/`/`supabase/` intatti; nessun DDL — allowlist DB solo come PLAN-DB-002; `.env.local` non tracciato)
- Test/lint/typecheck: `npm run build`, `typecheck`, `lint` tutti verdi.
- Regressioni controllate: diff confinato a `console/` + plan-per-matteo.
- **Verdetto:** 🟢 VERDE (1 nota minore: commento citava PLAN-DB-001 → **corretto** dall'Orchestrator a PLAN-DB-002)
- Ri-lavorazioni: nessun round esecutore; correzione commento applicata dall'Orchestrator.

**Chiusura fase**
- **Commit:** _(vedi git log — feat(console): login Supabase Auth + allowlist (F3, DEC-018/019/020))_
- Riga aggiunta a SESSION_LOG.md: sì
- Follow-up aperti: PLAN-DB-002 da eseguire (Matteo); redirect URL magic link `localhost:5174` da configurare in Supabase Dashboard; email reale di Matteo da inserire in `.env.local`; `LoginPlaceholder.tsx` orfano da rimuovere; test E2E magic link = manuale di Matteo

---

## Template blocco di fase (copia per ogni Fi)

```markdown
### Fase F<i> — <titolo>
- **Obiettivo / effetto:** <1–2 righe>
- **Modalità:** light / standard / deep
- **Dipendenze:** <fase precedente / risposta Matteo / DEC-NNN>

**Esecutore**
- Prompt usato: <link al MASTERPLAN_CONSOLE.md §F<i> o estratto>
- Sintesi di cosa ha fatto: <…>
- File toccati: <path…>
- Decisioni autonome prese: <DEC-NNN, DEC-MMM …> (registrate nel DECISION_LOG)
- Scritture DB: <nessuna | sandbox console-* via MCP CONSOLE, get_project_url=docnnernvp confermato>
- Plan per Matteo generati: <PLAN-DB-NNN | nessuno>

**Revisore (controverifica)**
- Done-criteria verificati: <elenco ✓/✗>
- Regole d'oro rispettate: <✓/✗ con note>
- Test/lint/typecheck: <esito>
- Regressioni controllate: <aree>
- **Verdetto:** 🟢 VERDE / 🔴 ROSSO → <findings se rosso>
- Ri-lavorazioni: <round 2…, se servono>

**Chiusura fase**
- **Commit:** <hash> — <messaggio>
- Riga aggiunta a SESSION_LOG.md: <sì>
- Follow-up aperti: <FU-CONSOLE-NNN | nessuno>
```
