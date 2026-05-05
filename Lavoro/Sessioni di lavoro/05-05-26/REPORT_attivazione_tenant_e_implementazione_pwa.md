# Report operativo - Attivazione tenant e implementazione PWA/licensing gate

Data: 2026-05-05  
Progetto: `CalendarBackup-v2`  
Ambiente DB: Supabase remoto via MCP (`user-supabase`)

## 1) Obiettivo richiesto

1. Impostare come attivi (`is_active = true`) i tenant gia presenti nel database.
2. Produrre un report dettagliato del lavoro svolto nella cartella sessione.

## 2) Attivita eseguite su Supabase (MCP)

### 2.1 Verifica stato tenant prima dell'update

Query eseguita:

```sql
select id, name, slug, is_active
from public.organizations
order by created_at;
```

Esito:
- Tenant `Al Ritrovo` (`slug: al-ritrovo`) -> `is_active = true`
- Tenant `Tenant B QA` (`slug: tenant-b-qa`) -> `is_active = true`

### 2.2 Update idempotente per garantire attivazione

Query eseguita:

```sql
update public.organizations
set is_active = true, updated_at = now()
where is_active is distinct from true;

select id, name, slug, is_active, updated_at
from public.organizations
order by created_at;
```

Esito:
- Tutti i tenant risultano `is_active = true`.
- Nessun tenant inattivo residuo.
- Operazione sicura/idempotente (riapplicabile senza effetti collaterali).

## 3) Riepilogo implementazione tecnica completata in sessione

Oltre alla richiesta sui tenant, nella sessione e stata completata l'implementazione del piano PWA + gating licenza:

- PWA configurata con `vite-plugin-pwa` in `vite.config.ts`.
- Manifest generato con:
  - `start_url: /admin`
  - `display: standalone`
  - icone dedicate.
- Strategia update SW con prompt utente (non auto-refresh forzato).
- Caching runtime limitato ad asset statici.
- Esclusione richieste Supabase dal caching runtime per evitare dati/sessioni stantie.
- Meta tag Apple/PWA aggiunti in `index.html`.
- Icone placeholder create in `public/icons/`:
  - `icon-192.png`
  - `icon-512.png`
  - `apple-touch-icon.png`
- Gating licenza su `organizations.is_active` aggiunto in:
  - check sessione persistita
  - login esplicito
- In caso tenant inattivo:
  - logout forzato
  - blocco accesso
  - reason salvata in `sessionStorage`
  - banner persistente in login page.
- Pagina pubblica `/prenota/:tenantSlug` allineata:
  - risoluzione tenant solo se `is_active = true`
  - fallback con messaggio "Prenotazioni temporaneamente non disponibili".

## 4) Verifiche tecniche eseguite

- Build produzione eseguita con successo (`npm run build`).
- Output PWA verificato:
  - `dist/manifest.webmanifest`
  - `dist/sw.js`
  - asset icone in `dist/icons/`.
- Nessun errore lint sui file modificati.
- Verifica schema DB via MCP: colonna `organizations.is_active` presente.

## 5) Test runtime eseguiti (checklist PWA + gating)

Eseguito round di test runtime su checklist:
- `Lavoro/Sessioni di lavoro/05-05-26/CHECKLIST_test_pwa_e_gating.md`

Report dettagliato del round:
- `Lavoro/Sessioni di lavoro/05-05-26/REPORT_esecuzione_CHECKLIST_test_pwa_e_gating.md`

Esito sintetico:
- Test passati: **20 / 28**
- Test non passati/non conclusi: **8 / 28**
  - `D2` non conclusivo in automazione (toast errore non catturato, ma comportamento funzionale di blocco e signOut verificato).
  - `A5`, `G1`, `G3`, `G4`, `G5`, `G6`, `G7` non eseguiti nel round automatizzato (richiedono deploy prod e/o dispositivi reali).

Evidenze runtime rilevanti:
- Gating attivo verificato:
  - tenant attivo -> login/refresh/logout OK.
  - tenant disattivato -> redirect a `/login` + banner "Abbonamento non attivo".
  - login su tenant disattivato -> nessun accesso a `/admin`, sessione locale pulita.
- Pagina pubblica `/prenota/:tenantSlug`:
  - tenant attivo -> form visibile.
  - tenant disattivato -> fallback "Prenotazioni temporaneamente non disponibili".
  - slug inesistente -> stesso fallback.
- PWA runtime locale:
  - service worker attivo.
  - manifest corretto.
  - cache senza URL `*.supabase.co`.

## 6) Stato finale

- Tenant presenti in DB: **attivi** (`is_active = true`).
- Piano implementativo PWA/licensing gate: **applicato** e verificato a build.
- Stato post-test runtime: tenant ripristinati a `is_active = true` (`al-ritrovo`, `tenant-b-qa`).
- Report archiviato in:
  - `Lavoro/Sessioni di lavoro/05-05-26/REPORT_attivazione_tenant_e_implementazione_pwa.md`
  - `Lavoro/Sessioni di lavoro/05-05-26/REPORT_esecuzione_CHECKLIST_test_pwa_e_gating.md`

## 7) Punti richiesti da monitorare (confermati)

1. **F3**: confermato runtime che il fallback pubblico non distingue tra slug inesistente e tenant disattivato. Limite noto accettabile per il caso d'uso attuale.
2. **G2**: verificato in locale che:
   - `/sw.js` risponde JavaScript (`Content-Type: text/javascript`)
   - `/manifest.webmanifest` risponde JSON (`Content-Type: application/manifest+json`)
   Resta da confermare su dominio Vercel in produzione dopo deploy.

## 8) Prossimi passi consigliati (operativi)

1. Completare i test checklist mancanti:
   - `A5`, `G1`, `G3`, `G4`, `G5`, `G6`, `G7`.
2. Eseguire test installazione PWA su:
   - desktop (Chrome/Edge)
   - iOS Safari
   - Android Chrome.
3. Verificare manualmente `D2` (toast errore login tenant inattivo) in browser reale.
4. Valutare fase 2:
   - hardening RLS lato DB su `is_active`
   - audit trail per cambi stato abbonamento.
