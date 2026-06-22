# REQ-004 — Vista Ristoranti comoda (50+ aziende) + ritorno alla posizione

| Campo | Valore |
|-------|--------|
| **Stato** | DA-FARE |
| **Priorità** | media |
| **Aperta da** | Cristiano (UX della Console) |
| **Data apertura** | 2026-06-23 |
| **Area** | vista Ristoranti / navigazione · solo `console/` (UI) |
| **Collegata a** | REQ-002 (scheda azienda, dove vive la configurazione), FU-CONSOLE-15 |

---

## ① Richiesta (Cristiano)

**Cosa voglio:**

> Una **vista Ristoranti comoda e pratica** pensata per **tante aziende (50+)**. Oggi ogni azienda è
> una card enorme con dentro tutta la configurazione (versione + funzioni + impostazioni): con 50+
> aziende la pagina è lunghissima e lenta. Voglio invece **card piccole** con solo le informazioni
> essenziali e un pulsante per **entrare nella scheda**, dove resta tutta la configurazione completa.
>
> Inoltre: **dopo aver dato un comando** nella sezione Ristoranti (es. salvare nella scheda, o tornare
> dalla scheda alla lista) **la pagina deve restare/ritornare dove stavo lavorando**, non saltare a
> inizio pagina.

**Su quale schermata / dove lo vedo:**

> Tab **Ristoranti** della Console.

**Come capisco che è fatto:**

> - La lista Ristoranti mostra **card piccole**, una per azienda, in **griglia**.
> - Ogni card mostra: **nome azienda + nome utente associato + etichetta versione venduta + stato
>   attivo/sospeso** + pulsante **"Apri scheda"**. **Niente** pannelli versione/funzioni/impostazioni
>   dentro la card.
> - In cima alla lista c'è una **barra di ricerca**: scrivo un pezzo del nome (azienda o utente) e la
>   lista si filtra.
> - Tutta la configurazione (cambiare versione, accendere/spegnere funzioni, impostazioni) si fa
>   **dentro la scheda** ("Apri scheda"), come già oggi.
> - Quando salvo qualcosa nella scheda, la pagina **non salta in cima**: resto al punto in cui ero.
> - Quando torno dalla scheda alla lista ("← Torna"), la lista è **allo stesso punto di scorrimento**
>   in cui l'avevo lasciata (non riparte dall'inizio).

---

## ✅ Decisioni di design (prese con Cristiano il 2026-06-23)

> Risolte in intervista (AskUserQuestion). Il Team può procedere senza riaprirle.

**DEC-A — Contenuto card:** ogni card mostra **nome azienda + nome utente associato + etichetta
versione + stato attivo/sospeso** + pulsante "Apri scheda". (Scartato: solo nome / nome+versione.)

**DEC-F — Nome utente in card (2026-06-23):** sotto/accanto al nome azienda mostra il **nome
dell'utente admin** collegato. Realtà DB su TEST: quasi tutte le aziende hanno **1 utente**, i due
sandbox ne hanno **0**. Regole di visualizzazione:
- 0 utenti → testo neutro tenue, es. «nessun utente».
- 1 utente → il suo `name` (se `name` è vuoto, ripiega sull'`email`).
- più di 1 → primo nome + «+N» (caso oggi assente, ma il codice non deve rompersi).
Fonte: tabella `admin_users` (campi `name`, `email`, `tenant_id`), leggibile dal client pubblico grazie
alla policy `console_admin_select_admin_users` (PLAN-DB-005, già attiva su TEST). La **ricerca** in cima
filtra per **nome azienda _o_ nome utente** (entrambi, case-insensitive).

**DEC-B — Disposizione:** **griglia di card piccole** (come oggi, ma card compatte senza i pannelli).
La griglia responsive esistente (`repeat(auto-fill, minmax(...))`) va resa più densa (card più basse).

**DEC-C — Ricerca:** **barra di ricerca per nome** in cima alla lista, filtro lato client
case-insensitive (stesso pattern di `UserList`). Niente filtro per versione (rimandato se servirà).

**DEC-D — Dove vive la configurazione:** i tre pannelli (`EditionSelector`, `FeatureFlagsPanel`,
`RestaurantSettingsPanel`) **escono dalle card della lista** e restano **solo** in `TenantDetail`
(la scheda), dove sono **già montati** (F9/F13). Nessuna perdita di funzioni: si configura dalla scheda.

**DEC-E — Ritorno alla posizione (no salto a inizio pagina):**
1. Nella **scheda** (`TenantDetail`): dopo un salvataggio (cambio versione → refetch), **non** sostituire
   l'intera scheda con "Caricamento…" (oggi `fetchOrg` mette lo stato a `loading` e smonta il contenuto,
   causando il salto in cima). Tenere visibili i dati durante il refetch.
2. Tornando dalla **scheda alla lista** ("← Torna" / cambio tab): **ripristinare la posizione di
   scorrimento** della lista Ristoranti dov'era prima di aprire la scheda. La navigazione è a
   switch-di-stato in `AppShell` (no router): salvare `window.scrollY` all'apertura della scheda e
   ripristinarlo dopo che la lista è di nuovo caricata.
3. Anche dopo **"+ Nuova azienda"** (modale che chiude e fa refetch): la pagina non deve saltare in cima.

---

## Vincoli (regole del branch)

- **Solo `console/`** (UI). Nessuna modifica a `src/` o `supabase/` dell'app di Matteo. Nessuna modifica
  di schema, nessun *plan per matteo*: è solo front-end.
- **Nessuna scrittura DB in sviluppo.** La vista legge `organizations` col client pubblico (come già fa).
- **Niente nuove dipendenze** (no react-router solo per questo): si resta su switch-di-stato + scroll
  manuale. Se in futuro servirà il deep-link, valutare il router (fuori scope qui).
- Stile inline coerente con i componenti esistenti (palette `RestaurantList`/`UserList`/`AppShell`).
- `npm run build` / `lint` / `typecheck` verdi (cartella `console/`).

---

## File previsti (riferimento per il Team)

- `console/src/components/RestaurantList.tsx` — card compatte (rimuovere i 3 pannelli dalla `OrgCard`,
  lasciare nome+versione+stato+"Apri scheda") + **barra di ricerca per nome**.
- `console/src/components/TenantDetail.tsx` — refetch senza collasso a "loading" (DEC-E.1).
- `console/src/components/AppShell.tsx` — salva/ripristina la posizione di scorrimento della lista
  all'apertura/chiusura della scheda (DEC-E.2).

---

## ② Consegna (Team Console)

**Consegnato da:** Esecutore-REQ-004 · **Data:** 2026-06-23 · **Sessione:** standard

### File modificati

| File | Cosa è cambiato |
|------|-----------------|
| `console/src/components/RestaurantList.tsx` | Riscritta interamente. Rimosse import e JSX di EditionSelector, FeatureFlagsPanel, RestaurantSettingsPanel; rimossi handler/stili orfani (handleEditionSuccess, onEditionSuccess, readOnlyBadge). Aggiunta select annidata `admin_users(name, email)` (DEC-053). Aggiunta barra di ricerca (stesso pattern UserList). Filtro lato client su nome azienda + nome/email utente. Griglia più densa (minmax 220px, gap 0.6rem). Card compatta (padding 0.65rem, gap 0.35rem, 3 righe: header/utente/pulsante). `fetchOrgs` non azzera a loading sui re-fetch (DEC-054). Prop `onDataReady` + ref `dataReadyFired` per notifica al primo render ok (DEC-055). |
| `console/src/components/TenantDetail.tsx` | Una riga: `fetchOrg` usa `setState(prev => prev.status === 'ok' ? prev : { status: 'loading' })` invece di `setState({ status: 'loading' })` fisso. Così sui re-fetch (cambio edition) i dati restano visibili e la pagina non salta in cima (DEC-054). |
| `console/src/components/AppShell.tsx` | Aggiunto `useRef` all'import. Aggiunti ref `savedScrollY` e `pendingScrollRestore`. `openTenantDetail` salva `window.scrollY` quando si apre dalla lista ristoranti. Aggiunta funzione `handleRestaurantListReady` che ripristina lo scroll. Passato `onDataReady={handleRestaurantListReady}` a RestaurantList (DEC-055). |

### Decisioni di implementazione

- **DEC-053** — Nested select `admin_users(name, email)`: la relazione PostgREST è già verificata in UserList (FK inversa); nessun fallback a seconda query necessario.
- **DEC-054** — Mantenimento dati durante re-fetch: pattern `setState(prev => prev.status === 'ok' ? prev : { status: 'loading' })` applicato sia in TenantDetail (scheda) che in RestaurantList (lista dopo "+ Nuova azienda").
- **DEC-055** — Scroll restore via ref + `onDataReady`: nessuna nuova dipendenza; la lista si rimonta al rientro (condizione `activeView === 'restaurants'`), quindi il callback è sicuramente chiamato dopo che i dati sono nel DOM.

### Cose fuori scope (rinviate)

- FU-CONSOLE-15 (pulsante "togli override / torna alla versione"): **non fatto**, come da istruzione.
- Filtro per versione nella barra di ricerca: DEC-C lo rimanda a se e quando servirà.

### Come verificare (per il Revisore)

1. `npm run build` / `npm run lint` / `npm run typecheck` nella cartella `console/` → verdi.
2. Dev server `console/`: lista Ristoranti mostra card piccole (nome + utente + versione + stato + "Apri scheda"), nessun pannello inline.
3. Barra di ricerca: digitando un pezzo del nome azienda filtra; digitando un pezzo del nome utente filtra; la lista mostra "Nessun ristorante corrisponde alla ricerca" se nessun match.
4. Aprendo la scheda e cambiando versione: il contenuto della scheda non sparisce (no flash bianco) e la pagina non salta in cima.
5. Tornando alla lista ("← Torna" o clic sul tab "Ristoranti"): si ritorna alla posizione in cui si era prima di aprire la scheda.
6. Creando una nuova azienda (modale): alla chiusura del modale la lista si aggiorna senza saltare in cima.
7. Aprendo la scheda dalla sezione Utenti e tornando: la lista Ristoranti, quando la si riapre, non ripristina una posizione di scorrimento vecchia (savedScrollY si attiva solo quando si apre da Ristoranti).

Vedi scenari dettagliati in `REQ-004-scenari-test-cliente.md`.

## ③ Esito test (Cristiano, nei panni di Matteo)

_(da compilare dopo il test — vedi scenari in `richieste/REQ-004-scenari-test-cliente.md`)_
