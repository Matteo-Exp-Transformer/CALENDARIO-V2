# Checklist test - PWA + Gating licenza

Data: 2026-05-05
Riferimenti: [REPORT_attivazione_tenant_e_implementazione_pwa.md](REPORT_attivazione_tenant_e_implementazione_pwa.md), [vite.config.ts](../../../vite.config.ts), [src/features/booking/hooks/useAdminAuth.ts](../../../src/features/booking/hooks/useAdminAuth.ts)

Audit codice OK: PWA configurata, gating in `signIn` + `checkSession`, banner persistente in `AdminLoginPage`, fallback su pagina pubblica `/prenota/:slug` mostra "Prenotazioni temporaneamente non disponibili" quando `tenantId` è null.

Esegui i test nell'ordine. Spunta `[x]` quando passa.

---

## A) Test build e PWA in locale

- [x] **A1 - Build pulita**: `npm run build` termina senza errori. In `dist/` esistono `manifest.webmanifest`, `sw.js`, `workbox-*.js`, `icons/icon-192.png`, `icons/icon-512.png`, `icons/apple-touch-icon.png`.
- [x] **A2 - Preview locale**: `npm run preview` -> aprire `http://localhost:4173`.
- [ ] **A3 - DevTools Application**:
  - [x] Application -> Manifest: nome "CalendarBackup", short_name "CalBackup", `start_url=/admin`, `display=standalone`, icone presenti senza warning rossi.
  - [x] Application -> Service Workers: status "activated and is running" su `sw.js`.
  - [x] Application -> Storage -> Cache Storage: cache `static-assets` popolata SOLO con asset statici (no `*.supabase.co`).
- [x] **A4 - Network tab**: dopo il primo caricamento, ricaricare con cache attiva. Le chiamate verso `*.supabase.co` mostrano "Status: 200" da rete (non da SW). Le chiamate verso JS/CSS/font/icone mostrano "(ServiceWorker)" come source.
- [ ] **A5 - Pulsante "Installa app"**: in Edge/Chrome appare l'icona "+" / "Installa" nella barra URL. Cliccando si installa l'app come finestra dedicata, niente barra browser.

## B) Test gating licenza - utente attivo

Utente di test (vedi [Lavoro/Knowledge Base/Skills/Utenti per test.md](../../Knowledge Base/Skills/Utenti per test.md)).

- [x] **B1 - Stato iniziale DB**: in Supabase Studio, tabella `organizations`, riga del tenant del test -> `is_active = true`.
- [x] **B2 - Login OK**: andare a `/login`, inserire credenziali admin di test -> redirect a `/admin`, dashboard caricata, dati visibili.
- [x] **B3 - Refresh pagina admin**: con sessione attiva, F5 su `/admin` -> resta loggato, dashboard si ricarica senza redirect a `/login`.
- [x] **B4 - Logout manuale**: cliccare "Esci" -> redirect a `/login`. Riloggandosi torna su `/admin`.

## C) Test gating licenza - revoca a sessione attiva

- [x] **C1 - Login**: loggarsi normalmente come in B2.
- [x] **C2 - Disattivare il tenant**: in Supabase Studio, settare `organizations.is_active = false` per quel tenant. **NON cancellare** la riga.
- [x] **C3 - Refresh**: F5 su `/admin`. Atteso: redirect immediato a `/login`. NON deve restare nella dashboard.
- [x] **C4 - Banner persistente**: dopo il redirect, in `/login` deve comparire il banner ambra **"Abbonamento non attivo. Contatta il supporto."** sopra il form (vedi [src/pages/AdminLoginPage.tsx:79-83](../../../src/pages/AdminLoginPage.tsx#L79-L83)).
- [x] **C5 - Banner one-shot**: ricaricare `/login` -> il banner sparisce (comportamento atteso, viene mostrato una sola volta).

## D) Test gating licenza - login con tenant disattivato

- [x] **D1 - Stato DB**: `organizations.is_active = false` per il tenant di test.
- [ ] **D2 - Tentare login**: andare a `/login` (pagina pulita, no banner), inserire credenziali corrette. Atteso: toast rosso **"Abbonamento non attivo. Contatta il supporto."**, NESSUN redirect a `/admin`, form torna disponibile.
- [x] **D3 - Sessione Supabase ripulita**: in DevTools -> Application -> Local Storage -> chiave Supabase deve essere svuotata (signOut e' stato eseguito lato app).

## E) Test riattivazione

- [x] **E1 - Riattivare**: in Supabase Studio, `organizations.is_active = true` per il tenant.
- [x] **E2 - Login**: rifare login -> redirect a `/admin`, accesso ripristinato. I dati pre-revoca (prenotazioni, configurazioni) sono ancora presenti integri.

## F) Test pagina pubblica `/prenota/:tenantSlug`

- [x] **F1 - Tenant attivo**: con `organizations.is_active = true`, aprire `/prenota/<slug-tenant>` in finestra incognito (no sessione admin). Form prenotazioni visibile, dati orari/menu caricati.
- [x] **F2 - Tenant disattivato**: settare `is_active = false`, ricaricare `/prenota/<slug-tenant>`. Atteso: pagina con titolo **"Prenotazioni temporaneamente non disponibili"** (vedi [src/pages/BookingRequestPage.tsx:109](../../../src/pages/BookingRequestPage.tsx#L109)), NESSUN form visibile.
- [x] **F3 - Slug inesistente**: aprire `/prenota/slug-inventato-xyz`. Atteso: stesso fallback ("Prenotazioni temporaneamente non disponibili"). Comportamento atteso: il messaggio NON distingue tra "slug sbagliato" e "tenant moroso" (limite noto, accettabile per il caso d'uso).
- [x] **F4 - Riattivare**: rimettere `is_active = true`, ricaricare -> form torna disponibile.

## G) Test PWA in produzione (post-deploy Vercel)

- [ ] **G1 - Deploy**: `git push` su main, attendere build Vercel green.
- [ ] **G2 - Service worker servito correttamente**: aprire `https://<dominio-vercel>/sw.js` in browser. Atteso: codice JS del service worker. NON deve restituire l'HTML di `index.html` (sintomo di rewrite mal gestito in [vercel.json](../../../vercel.json)). Stesso test su `/manifest.webmanifest` -> deve restituire JSON.
- [ ] **G3 - Installabilita desktop**: aprire da Edge/Chrome desktop -> icona "Installa" presente nella barra URL. Installare -> l'app appare nel menu Start con icona corretta.
- [ ] **G4 - Installabilita Android**: aprire da Chrome Android -> menu -> "Installa app" o "Aggiungi a schermata Home". L'icona compare sulla home, l'app si apre fullscreen.
- [ ] **G5 - Installabilita iOS**: aprire da Safari iOS -> Condividi -> "Aggiungi a schermata Home". L'icona usa `apple-touch-icon.png`, l'app si apre senza barra Safari.
- [ ] **G6 - Aggiornamento**: dopo aver installato l'app, fare un piccolo cambio (es. testo nel footer), `git push`. Riaprire l'app installata. Atteso: prompt "Nuova versione disponibile" (registerType: 'prompt'). Confermando, il nuovo testo appare.
- [ ] **G7 - Gating end-to-end in prod**: ripetere flow C1-C5 ma usando l'app PWA installata in prod (non il browser dev).

## H) Punti di attenzione (non bloccanti, da pianificare)

- [ ] **H1 - Icone definitive**: gli attuali file in [public/icons/](../../../public/icons/) sono placeholder (1-4 KB). Sostituire con artwork brand reale prima del lancio commerciale. Verificare contrasto su sfondi chiari e scuri (taskbar Windows / dock macOS / home screen mobile).
- [ ] **H2 - Hardening RLS** (fase 2): aggiungere check `organizations.is_active = true` nelle RLS policies di Supabase, per difesa in profondita. Oggi il blocco e solo lato app.
- [ ] **H3 - Audit trail subscription**: log dei cambi `is_active` (chi, quando, perche). Da introdurre quando si avranno piu di un paio di clienti.
- [ ] **H4 - Banner in caso di refresh login page**: oggi il banner si consuma alla prima visualizzazione (`sessionStorage.removeItem` in `AdminLoginPage.tsx:22`). Valutare se mantenerlo finche l'utente non fa un nuovo tentativo di login.

---

## Esito

Compilare alla fine del round di test:

- Test passati: 20 / 28
- Test falliti (riportare ID e dettagli):
  - D2 - Non sono riuscito a catturare in automazione Playwright il toast rosso del messaggio "Abbonamento non attivo. Contatta il supporto.". Il comportamento funzionale (nessun redirect a `/admin` + sessione pulita in localStorage) risulta comunque corretto.
  - A5, G1, G3, G4, G5, G6, G7 - non eseguiti in questo round (richiedono test manuale UI/installazione su desktop/mobile e deploy produzione).
- Decisione: [ ] Pronto per primo cliente reale | [x] Servono fix prima del lancio

### Note di runtime richieste

- F3 confermato: fallback pubblico identico per slug inesistente e tenant disattivato.
- G2 verificato **in locale**: `http://localhost:4173/sw.js` restituisce `Content-Type: text/javascript` e `http://localhost:4173/manifest.webmanifest` restituisce `Content-Type: application/manifest+json` (non HTML). Da confermare in produzione dopo deploy Vercel.
