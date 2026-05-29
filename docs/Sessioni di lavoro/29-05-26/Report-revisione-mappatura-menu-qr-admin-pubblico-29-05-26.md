# Report revisione — Mappatura Menu QR Admin ↔ Pubblico (29-05-26)

## Revisione indipendente — 2° passaggio

**Data:** 30-05-26  
**Revisore:** agente Verifica (controverifica autonoma — **non** validazione del 1° report esecutore)  
**Modalità:** deep · Profilo Verifica (TESTING_SKILL §7)  
**Ambiente:** TEST `docnnernvp` (MCP `get_project_url` → `docnnernvpyrbwuzzach.supabase.co`) · dev `npm run dev` → **http://localhost:5173** · tenant **test-pro** · QR **5f9n79b**

- **Cosa è cambiato:** controverifica end-to-end con SQL Q1–Q5, spot-check codice INC, QA browser M1–M6 su **375 / 834 / 1280**, `npm run validate` OK (222 test).
- **Cosa resta:** Fase 3 fix codice (INC-03/06/09 prioritari); QA admin modale + test INC-06/09 con QR `mixed` su TEST; seed categoria con piatti fuori `category_filter` per riprodurre INC-09 in browser.
- **Serve una tua azione:** avviare Fase 3 fix quando pronto; opzionale: login TEST per QA admin modale (`.env.local.test` assente in workspace revisore).

**Input mappa Fase 1:** [Report-mappatura-menu-qr-admin-pubblico-29-05-26.md](Report-mappatura-menu-qr-admin-pubblico-29-05-26.md)  
**Bozza 1° passaggio (non vincolante):** stesso file, versione precedente sostituita da questa sezione.

---

## Verdetto globale

### **Approva con riserve**

La mappa Fase 1 (38 coppie, flusso admin→DB→pubblico, modello per-QR 036/037, catalogo INC) è **confermata**. Conteggi OK/parziale/KO (24/11/3) e severità INC sono coerenti con codice e dati TEST. Si può aprire **Fase 3 fix** con priorità **INC-03 → INC-06 → INC-09**.

| Riserva | Dettaglio |
|---------|-----------|
| **Admin modale non verificato live** | Nessun `.env.local.test` / login TEST nel revisore → allineamento UI↔SQL solo inferito da Q2 + homepage pubblica. |
| **INC-03/06/09 senza riproduzione browser mixed** | Su TEST **zero** QR con `content_type` ≠ `a_la_carte` o `preset_ids` valorizzato; INC-09 non dimostrabile su test-pro (tutti i piatti stanno nelle 5 categorie filtrate). |
| **INC-01 ora osservabile su test-pro** | `restaurant_name` = «Trattoria da Matteo» vs header pubblico «Trattoria da Mugo» (`organizations_public.name`) — delta rispetto al 1° report che indicava `restaurant_name` null. |
| **Processo** | Il 1° «report revisione» generato dall’esecutore Fase 1 resta **non valido** come revisore; questo documento è la fonte revisione. |

---

## Gate automatico

| Check | Esito |
|-------|-------|
| `npm run validate` (lint + typecheck + 222 Vitest) | **OK** |
| MCP TEST project ref | **OK** — `docnnernvp` |

---

## Query SQL — ri-esecuzione (delta vs mappa Fase 1)

| Query | Scopo | Esito revisore | Delta vs Fase 1 / 1° revisione |
|-------|-------|----------------|----------------------------------|
| **Q1** | Tenant `test-pro` | **OK** — `2deb4d6e…`, «Trattoria da Mugo», edition `pro` | Identico |
| **Q2** | QR `5f9n79b` attivo | **OK** — `a_la_carte`, 5 cat, `mediterranean_teal`, 3 slide, 5 thumb, 2 hidden, nome admin `dssdsds` | Identico |
| **Q3** | `menu_qrcode_categories` | **OK** — 6 override; duplicato `primi` + `primi_piatti` | Identico |
| **Q4** | Preset staff | **OK** — 2 preset JSON | Identico |
| **Q5** | Schema + CHECK `theme_key` | **OK** — 4 temi (`mediterranean_teal`, `cream_sage`, `dark_gold`, `rustic_terracotta`) | Identico |
| **Extra** | Hidden UUID → nomi | **OK** — Tartare di fassona, Tagliere con verdure (antipasti) | Confermato (1° rev OK) |
| **Extra** | QR non-`a_la_carte` / preset_ids su DB | **OK (vuoto)** — 0 righe | Confermato |
| **Extra** | Antipasti visibili | **OK** — 3 totali, **1** visibile dopo hidden | Confermato browser |
| **Extra** | `restaurant_name` test-pro | **Valorizzato** — «Trattoria da Matteo» | **Delta:** 1° revisione «null»; INC-01 dimostrabile in UI |

---

## QA browser pubblico (TESTING_SKILL §7)

**URL:** `http://localhost:5173/menu/test-pro/qr/5f9n79b` · categoria: `/c/antipasti` · invalid: `/qr/ZZZZINVALID`

| ID | Caso | 375 mobile | 834 tablet | 1280 desktop |
|----|------|------------|------------|--------------|
| **M1** | Homepage QR (nome locale, carosello, tab, griglia) | **OK** — h1 «Trattoria da Mugo», img carosello, tab link `/c/`, 5 card | **OK** | **OK** |
| **M2** | Griglia card 1–2 colonne | **OK** — 5 card, **1 colonna** (`min-[400px]` → 375 = 1 col) | **OK** — **2 colonne** | **OK** — **2 colonne** |
| **M3** | Antipasti — hidden (1/3) | **OK** — solo «Poke con riso legumi»; assenti Tartare/Tagliere | **OK** | **OK** |
| **M4** | Pallini carosello cliccabili | **OK** — click dot 2 | **OK** | **OK** |
| **M5** | short_code errato → «Menù QR non trovato» | **OK** | **OK** | **OK** |
| **M6** | Footer data/ora IT | **OK** — es. «sabato 30 maggio» + `01:53` | **OK** | **OK** |

**Nota INC-09 (browser):** `/c/primi` (chiave **non** in `category_filter`, solo `primi_piatti`) → pagina carica, titolo «primi», **0 piatti** (nessun item in DB per quella chiave). Non prova bypass con piatti visibili; su test-pro **tutti** gli ingredienti sono nelle 5 categorie filtrate → INC-09 resta **Confermato da codice** (`PublicMenuCategoryPage` non legge `category_filter`).

---

## QA admin modale

| Controllo | Esito |
|-----------|-------|
| Login TEST + modale «Impostazione Menù QR» per `5f9n79b` | **Non eseguito** — credenziali `MANUAL_*` non disponibili (`.env.local.test` assente) |
| Controverifica admin↔pubblico (salva slide/card → ricarica pubblico) | **Non eseguito** |
| Allineamento inferito | Q2 + homepage QA: tema teal, 5 categorie, override «sfiziosità e leggerezza» su Antipasti coerenti |

**Nota:** senza admin live il verdetto **non** è «Approva» pieno su coppie modale-only; resta **Approva con riserve** come da tabella riserve.

---

## Spot-check codice (indipendente)

| Area | File | Esito vs mappa |
|------|------|----------------|
| INC-09 | `PublicMenuCategoryPage.tsx` — nessun check `category_filter` | **KO confermato** |
| INC-08 | `usePublicCategoryLabel` → solo `menu_categories.label` | **parziale confermato** |
| INC-03 | `MenuQrModal.tsx` L184–186 `content_type` / `preset_ids` preservati, default `a_la_carte` | **Confermato** |
| INC-06 | `PublicMenuPage.tsx` L454 `usePresets = presets.length > 0` | **Confermato** |
| INC-04 | `PublicMenuCategoryPage` `bg-stone-50` / header stone | **KO confermato** |
| INC-15 | `PublicMenuPresetPage` — no `hidden_menu_item_ids`, no `<img>` | **Confermato** |
| INC-16 | `PublicMenuPresetPage` — `useTenantBySlug` senza `tenantReady` | **Confermato** |
| INC-01 | `PublicMenuPage` L702 `organizationName` da `TenantContext` | **Confermato** — diverge da `restaurant_name` su test-pro |
| 3 righe KO tabella | Tema figlie, URL bypass filtro, hidden preset | **Severità/esito corretti** |

---

## Giudizio INC (tutti ID catalogati in mappa)

| ID | Esito revisore | Evidenza | Delta vs Fase 1 / 1° revisione |
|----|----------------|----------|--------------------------------|
| **INC-01** | **Confermato** | SQL: `restaurant_name` «Trattoria da Matteo»; browser h1 «Trattoria da Mugo»; `TenantContext` → `organizations_public.name` | **Rafforzato** — non più «neutro» su test-pro |
| **INC-02** | **Confermato** | Browser: nome QR `dssdsds` assente in header | Identico |
| **INC-03** | **Confermato** | Codice `MenuQrModal`; SQL: 0 QR non-`a_la_carte` | Identico |
| **INC-04** | **Confermato** | Codice + browser cat page (stone, no tema teal) | Identico |
| **INC-05** | **Confermato** | Codice `PublicMenuPresetPage` lista testo | Identico |
| **INC-06** | **Confermato** | Codice `MenuNavTabs`; browser N/A (no preset in tab con `a_la_carte`) | Identico |
| **INC-07** | **Confermato** | Q2: `category_filter` array esplicito su campione | Identico |
| **INC-08** | **Confermato** | Codice; browser antipasti titolo = label (override uguale testo) | Identico |
| **INC-09** | **Confermato** | Codice; browser `/c/primi` senza piatti (campione non ideale) | Identico — non smentito |
| **INC-10** | **Confermato** (by design) | Browser thumb foto reali in griglia | Identico |
| **INC-11** | **Confermato** | `PUBLIC_MENU_LAYOUT_CONTEXT.md` §7 riga 179 cita `menu_homepage_config` | Identico |
| **INC-12** | **Confermato** | SQL Q3 duplicato `primi` / `primi_piatti` | Identico |
| **INC-13** | **N/A** | Non catalogato in mappa Fase 1 | — |
| **INC-14** | **N/A** | Non catalogato in mappa Fase 1 | — |
| **INC-15** | **Parziale** | Hidden **OK** su categoria (browser); preset page non testata (no link preset) | Identico |
| **INC-16** | **Confermato** | Codice preset page senza `tenantReady` | Identico |

---

## Dati comunicazione (per Matteo)

| Dove nell’app | Effetto ristoratore / cliente | Componente | Storage |
|---------------|------------------------------|------------|---------|
| **Admin → Menu → QR Code → modale** | Configura nome interno QR, tema, carosello, card categorie, piatti nascosti (occhio) — **non verificato live** revisore | `MenuQrModal` + `MenuHomepageConfigPanel` | `menu_qr_codes`, `menu_qrcode_categories`, bucket `menu-photos` |
| **Telefono — homepage QR** | Cliente vede nome **organizzazione** (non nome QR né anagrafica `restaurant_name` se diversa), 3 specialità, 5 categorie con foto/descrizioni custom, data/ora in fondo | `PublicMenuPage` | QR row + `organizations_public.name` + override |
| **Telefono — categoria Antipasti** | 1 piatto su 3 (Tartare e Tagliere nascosti per questo QR) | `PublicMenuCategoryPage` | `menu_items` − `hidden_menu_item_ids` |
| **Anagrafica vs QR** | Su test-pro: in Impostazioni «Trattoria da Matteo», sul QR «Trattoria da Mugo» — **incoerenza visibile** (INC-01) | header pubblico vs `restaurant_settings.restaurant_name` | due fonti diverse |

---

## Debiti residui

| ID | Nota |
|----|------|
| FU-017/018/019 | Invariati — restano aperti |
| **FU-020** (nuovo) | Seed su TEST: almeno 1 QR `content_type=mixed` + `preset_ids` per QA browser INC-06; categoria con piatti **fuori** `category_filter` per QA INC-09 |
| Giro 2 QA | Admin modale + salva→ricarica 375px quando login TEST disponibile |

---

## Handoff Fase 3 (fix — solo `src/`, fuori scope revisore)

| Priorità | ID | Intervento | File hub |
|----------|-----|------------|----------|
| **P0** | INC-03 | UI `content_type` / `preset_ids` **oppure** policy «solo a_la_carte» + dead code preset | `MenuQrModal.tsx` |
| **P0** | INC-06 | `MenuNavTabs`: in `mixed` mostrare tab categorie **e** preset (non `presets.length > 0` alone) | `PublicMenuPage.tsx` L454–461 |
| **P1** | INC-09 | Guard `category_filter` su route `/c/:key` (404 / redirect / messaggio) | `PublicMenuCategoryPage.tsx` |
| **P2** | INC-04/08 | Propagare `theme_key` + titolo override `menu_qrcode_categories` su pagina categoria | cat page + hook label |
| **P2** | INC-15 | Applicare `hidden_menu_item_ids` (e opz. foto) su `PublicMenuPresetPage` | preset page |
| **P3** | INC-01 | Valutare `restaurant_name` o `useRestaurantName()` in header pubblico | `PublicMenuPage.tsx`, `TenantContext` |
| **Doc** | INC-11 | §7 `PUBLIC_MENU_LAYOUT_CONTEXT.md` → rimuovere `menu_homepage_config` | doc only |

**Test post-fix:** `npm run validate` + ripetere tabella M1–M6 (375 obbligatorio) + seed FU-020 per INC-06/09.

---

## Metodo revisore (tracciabilità)

1. Letti APP_CONTEXT §1b/§4/§7.1, mappa Fase 1, `PUBLIC_MENU_DATA_FLOW_CONTEXT.md`, `PUBLIC_MENU_SKILL.md`, TESTING_SKILL §7.
2. `get_project_url` + Q1–Q5 + extra SQL su MCP `user-supabase-test`.
3. `npm run validate` OK.
4. Spot-check codice file citati per INC e 3 KO.
5. Playwright MCP: M1–M6 @ 375/834/1280 su `localhost:5173`.
6. Admin: dichiarato non disponibile.
7. Nessuna modifica `src/`.

**Verdetto finale:** **Approva con riserve** — procedere Fase 3 con tabella priorità sopra.
