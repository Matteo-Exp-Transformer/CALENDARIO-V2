# CLAUDE.md — Guida per sessioni AI

Questo file orienta le sessioni Claude Code su questo progetto.

## Prima di toccare il codice — instradati all'area giusta

Il progetto è organizzato in **aree** (Pagina Prenota, Menu QR, Admin shell, Database…), ognuna con
una **skill d'area** che ne tiene il senso, i flussi, i divieti voluti e i valori. **Non navigare il
codice a tappeto:** apri prima il routing e fatti guidare al file d'area.

1. Apri `docs/APP_CONTEXT_SKILL.md` **§0** — è la tabella «il task riguarda X → carica skill Y».
   Trova la riga che combacia col task e carica quella skill d'area **prima** di aprire i file da modificare.
2. Aree già mappate col pattern senso/contesto (entry point + cartella `contesto/`):
   - **Pagina Prenota** (pubblica) → `docs/Prenota-Skill/PRENOTA_SKILL.md`
   - **Menu QR** (pubblico) → `docs/Menu-QR-Skill/MENU_QR_SKILL.md`
   - Altre aree (Tab Menu admin, Admin shell, Database, PWA): vedi la §0 sopra.
3. Leggi la skill d'area **intera**, poi apri **solo** il file di `contesto/` che ti serve (anch'esso intero).

> I valori (limiti, soglie) vivono nel **codice** = verità; i file `.md` li specchiano e spiegano il
> perché. Dopo un edit di codice aggiorni il file di contesto mappato, non copie sparse.

## File critici

| File | Perché è importante |
|------|-------------------|
| `src/router.tsx` | Tutte le route dell'app |
| `src/contexts/TenantContext.tsx` | Cuore del multi-tenancy: risolve `tenantId` da slug o email |
| `src/lib/supabase.ts` | Client autenticato (admin) — persistSession: true, PKCE |
| `src/lib/supabasePublic.ts` | Client anonimo (form pubblici) — persistSession: false |
| `src/features/booking/hooks/useAdminAuth.ts` | Login, session check, subscription check |
| `supabase/migrations/` | Schema DB — le migrazioni già applicate NON vanno toccate |
| `supabase/functions/create-booking/index.ts` | Edge Function per prenotazioni pubbliche |
| `supabase/functions/validate-invite/index.ts` | Edge Function per registrazione admin |
| `src/types/database.ts` | Tipi generati dal DB — rigenera con `npm run db:types:linked` |
| `src/lib/email.ts` | Chiama Edge Function `send-email` che non esiste ancora |
| `src/lib/devConsole.ts` | **Dev console** (solo dev): cervello che raccoglie salute + flusso dati e traduce gli errori in linguaggio semplice. Vedi sezione «Dev console» sotto |
| `vitest.config.ts` | Config Vitest (jsdom, globals, env Supabase fake, exclude e2e) |
| `playwright.config.ts` | Config Playwright (chromium, webServer, baseURL) |
| `tests/setup.ts` | MSW server + jest-dom + cleanup automatico |
| `.husky/pre-commit` | Esegue lint-staged sui file staged |
| `.github/workflows/ci.yml` | CI: lint + typecheck + test su push/PR a main |

## Comandi principali

```bash
npm run dev                  # dev server su :5173
npm run build                # TypeScript check + Vite build
npm run lint                 # ESLint, zero warning tollerati
npm run lint:fix             # Fix automatico ESLint
npm run typecheck            # tsc --noEmit
npm run test                 # 29 test Vitest (run mode)
npm run test:watch           # Vitest in watch mode
npm run test:e2e             # Playwright e2e (richiede staging Supabase)
npm run validate             # lint + typecheck + test (pre-PR)
npm run db:types:linked      # Rigenera src/types/database.ts dal DB remoto
npm run seed:booking-menu-full   # Popola DB con prenotazione con menu
npm run seed:booking-table       # Popola DB con prenotazione tavolo
supabase db push             # Applica nuove migrazioni al DB remoto
supabase migration list --linked # Verifica stato migrazioni
```

## Convenzioni
 - **Language With User** : in risposte a user , limita testo in output per risparmiare token, non usare tabelle se non sono strettamente necessarie o sezioni di codice. parla in linguaggio pratico e non tecnico con riferimenti pratici agli elementi o alle funzioni in questione  
- **Conventional Commits**: `feat(scope):`, `fix(scope):`, `update(scope):` ecc.
- **Import alias**: `@/` punta a `src/` (configurato in `vite.config.ts` e `tsconfig.json`)
- **Logger**: `src/lib/logger.ts` — usare `logger.debug/info/warn/error` invece di `console.log`
- **Due client Supabase**: usare `supabasePublic` per operazioni anonime, `supabase` (autenticato) per le operazioni admin
- **TanStack Query**: tutte le query server-state vanno nei hook in `src/features/booking/hooks/`
- **Nessun commento banale**: i commenti spiegano il PERCHÉ, non il COSA

## Zone delicate

- **`TenantContext`**: il `tenantId` viene risolto o dallo slug URL (pagina pubblica) o dall'email dell'admin loggato. Qualsiasi hook che accede ai dati del tenant dipende da questo context.
- **Due client Supabase**: `supabase` mantiene la sessione in localStorage (admin), `supabasePublic` non la mantiene mai (form pubblici). Non mischiare gli usi.
- **Migrazioni 003_\***: esistono due migrazioni con prefisso `003_` (entrambe già applicate al remoto). Non rinominarle — documentato in `docs/DATABASE.md`.
- **send-email mancante**: `src/lib/email.ts` chiama `${SUPABASE_URL}/functions/v1/send-email` che non esiste. I flussi email falliscono silenziosamente in produzione.
- **Button — NON aggiungere CSS in index.css**: i variant disponibili (`primary`, `secondary`, `danger`, `success`, `ghost`, `outline`) coprono tutti i casi. Per modificare un bottone cambia il `variant` o `size` nel file chiamante. Tailwind JIT richiede stringhe letterali statiche — costruire classi dinamicamente (es. `` `bg-${color}-600` ``) non genera CSS. Se un bottone non si vede correttamente la causa è quasi sempre un `variant` sbagliato nel componente chiamante, non un problema di Tailwind.

## Struttura cartelle src/

```
src/
├── components/         # Componenti UI condivisi
│   └── ui/            # Button, Input, Modal, ecc.
├── contexts/          # TenantContext
├── features/
│   └── booking/
│       ├── components/ # Componenti specifici della dashboard
│       ├── constants/  # Valori fissi (capacity, preset menu)
│       ├── hooks/      # useAdminAuth, useBookingMutations, ecc.
│       ├── lib/        # restaurantSettingRegistry
│       └── utils/      # Helper puri (date, prezzi, trasformazioni)
├── hooks/             # Hook globali (useBusinessHours, useRateLimit)
├── lib/               # Utility (supabase, email, logger, ecc.)
├── pages/             # Una pagina per route
├── router.tsx         # Definizione routing
└── types/             # TypeScript types (database.ts generato, booking.ts, menu.ts)
```

## Variabili d'ambiente

Vedi `.env.example`. Le variabili con prefisso `VITE_` sono esposte al browser.
Le variabili senza prefisso (es. `SUPABASE_SERVICE_ROLE_KEY`) sono solo per script Node locali.


## Ambienti DB — mappa e regole agente

| MCP | DB | Scopo | .env locale |
|---|---|---|---|
| `Supabase` | `rwuxgvldzrkabglkasym` (PROD) | dati reali | `.env.local` |
| `Supabase_test` | `docnnernvpyrbwuzzach` (TEST) | staging/dev | `.env.local.test` |

**I MCP non leggono `.env.local`** — il branch git o il file env NON determinano su quale DB scrive l'agente.

### Regola: prima di ogni INSERT/UPDATE/DELETE via MCP

1. Chiama `get_project_url` per verificare su quale DB stai operando
2. `rwuxgvld` = PROD → chiedi conferma esplicita all'utente prima di scrivere
3. `docnnernvp` = TEST → scrittura ok

## Dev console (strumento di sviluppo — solo `npm run dev`)

Aiuta Matteo a capire **a colpo d'occhio** lo stato di salute e il flusso dati dell'app
durante lo sviluppo. **Tutto dietro `import.meta.env.DEV`**: in produzione è inerte, nessun
peso per i clienti. Due canali con ritmi diversi, per non intasare la console:

| Canale | Dove | Cosa mostra | File |
|--------|------|-------------|------|
| **Salute** (fotografia) | console F12 | riquadro all'avvio: ristorante, admin sì/no, edition, conteggi | `printDevHealth`/`setDevHealth` in `src/lib/devConsole.ts` |
| **Flusso** (film) | pannello in pagina (basso dx, richiudibile) | letture/scritture DB che scorrono + errori tradotti; pallina verde/giallo/rosso | `src/components/dev/DevFlowPanel.tsx` |

**Aggancio automatico:** `App.tsx` collega `QueryCache`+`MutationCache` del QueryClient →
ogni query/mutation TanStack compare nel flusso **senza toccare i singoli hook**. Per dare
un nome leggibile alle query, mappa la `queryKey` in `src/lib/devQueryNames.ts` (aggiungi lì
le nuove risorse). La salute si alimenta da `TenantContext` (tenant/admin/edition).

**Tono (allineato a `COMUNICAZIONE_UTENTE_SKILL.md`):** i messaggi parlano **semplice**, mai
gergo crudo. Gli errori passano da `humanizeError()` che traduce (`PGRST301` → «permesso negato
— controlla il tenant»); il codice tecnico resta in `detail`, on-demand. Quando aggiungi un
nuovo tipo di errore ricorrente, aggiungi la traduzione lì.

**Per loggare a mano un punto di flusso:** `devFlow('ok'|'info'|'warn'|'error', 'frase umana')`
o `devFlowError('contesto', error)`. No-op in produzione, non serve guardia.
