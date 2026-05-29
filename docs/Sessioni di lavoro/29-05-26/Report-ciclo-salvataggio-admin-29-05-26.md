# Report ciclo — Salvataggio admin Impostazioni locale (29-05-26)

Ciclo multi-agente: prepara-prompt → esecuzione → revisione.

| Fase | Stato | Agente |
|------|-------|--------|
| Prepara prompt | ✅ Completata | prepara-prompt |
| Esecuzione | ✅ Completata | Esecuzione |
| Revisione | ✅ Chiusura per conferma Matteo («tutto fatto») | QA formale 375/834/1280 non in tabella separata |
| Raccolta comunicazione | ✅ Completata | prepara-prompt (non Meta senior) |

---

## Obiettivo

Semplificare salvataggio in **Impostazioni locale** (tab **Anagrafica Azienda** e **Personalizza form**): footer compatto a destra, guard modale, autosave debug su campi semplici, pattern documentato nello skill system.

**Decisioni Matteo (29-05-26):**
- Footer ~50% larghezza, allineato margine destro — **anche su mobile** (375px).
- Sfondo footer su mobile: **leggermente trasparente** (non opaco pieno).
- Autosave campi semplici: **solo fase debug**; in prod commerciale → footer manuale (FU-004).
- Conferma al Salva su dati pubblici Pagina Prenota: **follow-up FU-005** (non in questa sessione).
- Mockup HTML multi-stato per scelte UX: pattern PREPARA_PROMPT §1.B (`mockup-salvataggio.html`).

**Follow-up collegati:** FU-002 (fase 1), FU-004, FU-005, FU-006.

---

## Prompt — Prepara prompt (Appendice A, v2)

```
Profilo: Esecuzione.

## Obiettivo

Semplificare il salvataggio in **Impostazioni locale** (Admin → sezione impostazioni ristorante):
tab **Anagrafica Azienda** (`RestaurantSettingsTab`) e tab **Personalizza form**
(`BookingFormConfigPanel`), riducendo click e ingombro visivo, mantenendo protezione
modifiche non salvate. Introdurre un **pattern riusabile** documentato nello skill system.

Comportamento atteso per il ristoratore (fase debug attuale):
- Campi semplici (nome, contatti, titolo/descrizione pagina Prenota) si salvano da soli
  dopo una pausa nella digitazione, con indicatore discreto sotto il campo.
- Per il resto (orari, fasce, tema, sfondo, modalità, promo, sottotab strutturali) compare
  un **footer compatto** in basso a destra (~50% larghezza viewport/contenuto, **anche mobile**):
  testo «Modifiche non salvate» + pulsanti più piccoli «Annulla tutte» e «Salva modifiche».
  Su mobile: sfondo footer **leggermente trasparente** (es. `bg-…/90` + blur leggero se coerente col tema).
- Niente barre Salva/Annulla sopra ogni card (rimuovi `SectionActionBar` dalle sezioni standard).
  Eccezioni: `commitSubTabEditor`; flusso editor interno promo accettabile se integrato nel footer all-page.
- Navigazione con dirty: **modale in-app** (`Modal`) — Resta / Salva e continua / Annulla e continua.
- «Annulla tutte» nel footer: conferma modale prima di scartare (FU-003).

## Roadmap prod (NON implementare in questa sessione — preparare solo l’architettura)

Documentare in skill e codice un **toggle disattivabile** per autosave (es. env
`VITE_SETTINGS_AUTOSAVE=true` default in dev, `false` in prod commerciale — FU-004):
- **Prod:** niente autosave; tutti i campi (anche testo semplice) passano dal footer manuale,
  così l’admin corregge errori di compilazione prima che i dati finiscano in Pagina Prenota e si riducono le chiamate DB.
- **FU-005 (follow-up):** modale conferma al Salva footer su campi «pubblici» (nome, contatti,
  titolo/descrizione Prenota, promo visibili) — avviso che saranno esposti ai clienti.

L’hook autosave va implementato **disattivabile** senza refactor quando FU-004/FU-005 arrivano.

## Contesto tecnico

- `SettingsSaveUi.tsx`, `UnsavedChangesContext.tsx`, `RestaurantSettingsTab.tsx`,
  `BookingFormConfigPanel.tsx`, `useRestaurantSetting.ts`
- Doc: `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`
- Mockup riferimento UX: `mockup-salvataggio.html` (root repo)

## Decisioni prodotto fissate

1. Footer sticky compatto, **~50% larghezza anche su mobile 375px**, allineato **destra**.
2. Mobile footer: sfondo **leggermente trasparente**.
3. Guard modale (no solo toast).
4. Autosave whitelist (fase debug): `restaurant_name`, `contact_*`, `page_title`, `page_description`
   — NON `header_styles` in questa sessione.
5. Autosave: debounce 1500–2000 ms, flush on blur, batch upsert, cap 1/2s, silent, skip se = baseline.
6. Rimuovere `SectionActionBar` dalle card standard.

## Autosave — regole anti-spam

- `useUpsertRestaurantSetting({ silent: true })`: no toast; invalidazione mirata per chiavi upsertate.
- Toggle `VITE_SETTINGS_AUTOSAVE` (o equivalente): se false, autosave disabilitato — footer gestisce tutto.
- Indicatore campo: Salvataggio… / Salvato (solo se autosave attivo).

## Fix compliance

- Registrare promo dirty nel guard (unificare sorgenti Personalizza form).
- Reset draft/timer/dirty su cambio `tenantId`.

## Scalabilità multi-tenant (sezione obbligatoria report — FU-006)

Verdetto ok/attenzione/conflitto + motivazione semplice per Matteo.

## Superfici (375 / 834 / 1280)

Footer 50% destra mobile; modale guard; Classic + Pro; autosave indicatori.

## Fuori scope

- FU-005 modale «dati pubblici» al Salva
- Autosave promo/sottotab/fasce/tema/sfondo
- Migrazioni DB

## Skill §7.2

`BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, `APP_CONTEXT_SKILL.md` §4 RULE salvataggio admin,
opz. `SALVATAGGIO_ADMIN_SKILL.md`, FOLLOW_UP FU-002 nota fase 1.

## Report

Aggiornare questo file sezione Esecuzione. `npm run validate` verde.
```

---

## Esecuzione

### Cosa è stato fatto (ordine)

1. **Toggle autosave** — `src/config/settingsAutosave.ts`: `VITE_SETTINGS_AUTOSAVE` (dev ON, prod OFF salvo `true`); whitelist campi documentata.
2. **Upsert silent** — `useUpsertRestaurantSetting`: `{ silent: true }`, invalidazione TanStack Query **solo per le chiavi upsertate** (non più tutto `restaurant_settings`).
3. **Hook autosave** — `useDebouncedSettingsAutosave`: debounce 1750 ms, flush on blur, cap 1 save/2 s, batch, skip se = baseline DB.
4. **Footer compatto** — `SettingsSaveFooter`: ~50% larghezza destra, sticky, mobile `bg-white/90` + blur; pulsanti sm; modale conferma «Annulla tutte» (FU-003).
5. **Indicatore campo** — `FieldAutosaveIndicator` sotto nome/contatti (Anagrafica) e titolo/descrizione Prenota.
6. **Guard modale** — `UnsavedChangesContext` + `UnsavedNavigationGuardModal`: Resta qui | Salva e continua | Annulla e continua; `confirmNavigation()` in `AdminDashboard`, `AdminShell`, switch tab Impostazioni.
7. **Rimozione barre sezione** — niente `SectionActionBar` su card standard; eccezione **Salva** in `commitSubTabEditor`.
8. **Promo nel guard** — dirty promo + sfondo unificati in sorgente `booking-form-config` (Personalizza form).
9. **Reset tenant** — cambio `tenantId`: cancel timer autosave, reset dirty/draft, clear guard sources.
10. **Skill §7.2** — `APP_CONTEXT_SKILL.md` RULE, `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md`, `.cursor/skills/calendarbackup-app-context/SKILL.md`.
11. **`npm run validate`** — **verde** (217 test).

### Cosa vede Mario (effetto prodotto)

| Schermata | Prima | Dopo |
|-----------|-------|------|
| **Impostazioni → Anagrafica** | Barre Salva/Annulla sopra ogni card | Nome/email/telefono/indirizzo si salvano da soli (in dev) con «Salvataggio…» / «Salvato» sotto il campo; orari/fasce/tema → footer in basso a destra |
| **Impostazioni → Personalizza form** | Barre su Intestazione, Modalità, Promo, Sfondo | Titolo/descrizione pagina Prenota autosave (dev); resto → un solo footer destra; promo inclusa nel guard |
| **Cambio tab / sezione admin con modifiche aperte** | Toast | Modale con tre scelte |
| **Annulla tutte** | Scartava subito | Modale «Annullare tutte le modifiche?» |

### Storage (dati)

| Dove | Cosa |
|------|------|
| `restaurant_settings` (chiavi whitelist) | Autosave silent su anagrafica + `booking_public_form_config.page_title` / `page_description` |
| `restaurant_settings` (altre chiavi) | Solo tramite **Salva modifiche** footer (orari, tema, modalità, promo, sfondo, …) |
| Env build | `VITE_SETTINGS_AUTOSAVE` — prod commerciale: OFF → tutto manuale (FU-004) |

### File toccati (codice)

| File | Perché |
|------|--------|
| `src/config/settingsAutosave.ts` | Toggle + whitelist |
| `src/features/booking/hooks/useDebouncedSettingsAutosave.ts` | Hook autosave riusabile |
| `src/features/booking/hooks/useRestaurantSetting.ts` | Silent + invalidazione mirata |
| `src/features/booking/components/settings/SettingsSaveUi.tsx` | Footer, indicatori, modali |
| `src/contexts/UnsavedChangesContext.tsx` | Guard modale + handlers |
| `src/features/booking/components/RestaurantSettingsTab.tsx` | Wire autosave + footer |
| `src/features/booking/components/settings/BookingFormConfigPanel.tsx` | Wire autosave header testo + footer unificato |
| `src/features/booking/components/settings/BookingFormPromoSection.tsx` | Rimossa barra sezione |
| `src/pages/AdminDashboard.tsx` / `AdminShell.tsx` | `confirmNavigation` |
| `src/vite-env.d.ts` | Tipo env |

### File di skill aggiornati

| File | Modifica | Perché |
|------|----------|--------|
| `docs/APP_CONTEXT_SKILL.md` | RULE salvataggio admin 29-05-26 | Pattern footer/autosave/guard |
| `docs/per-ui-design-skill/BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | § Salvataggio admin | Allineamento agenti Personalizza form |
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | Puntatore report ciclo | Sessione 29-05-26 |

### Test eseguiti

- `npm run validate` — lint 0, typecheck OK, **217/217** test Vitest.

### Derivazione errori

| Tipo | Dettaglio |
|------|-----------|
| **errore agente** | Prima sostituzione parziale in `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` ha lasciato righe duplicate — ripulite in sessione. |
| **errore agente** | `useRestaurantSetting.onSuccess` corrotto in un edit intermedio — ripristinato prima del validate. |

### Fuori scope (come da prompt)

- FU-005 modale «dati pubblici» al Salva footer — non implementata.
- Autosave su promo, sottotab strutturali, fasce, tema, sfondo, `header_styles`.

---

## Revisione

### Verdetto

| Aspetto | Esito |
|---------|--------|
| Codice + validate | **Approva** — `npm run validate` 217/217 (chiusura 29-05-26) |
| Allineamento decisioni Matteo | **Approva** — footer 50% destra mobile, trasparenza, guard modale, autosave debug, toggle prod |
| QA browser tabellato (Appendice B) | **Non documentato** — Matteo ha confermato «tutto fatto» senza report Verifica separato |
| Skill §7.2 area salvataggio | **Approva** — APP_CONTEXT RULE + BOOKING_FORM context |

**Riserve minori (non bloccanti):** smoke manuale K-style su Classic+Pro e Pagina Prenota post-autosave (R1 nel prompt revisione) — rimandabile a smoke spot di Matteo.

### Prompt — Revisione Verifica (Appendice B)

Consegnato in chat 29-05-26; non eseguito come sessione Verifica autonoma con tabella QA compilata.

---

## Dati comunicazione

### Contesto sessione

- **Ciclo:** prepara-prompt (decisioni + mockup HTML) → esecuzione → chiusura Matteo «tutto fatto» + raccolta comunicazione.
- **Profili:** Esecuzione (implementazione); prepara-prompt (filtro + chiusura doc); **nessuna sessione Meta senior** (`REVISIONE.md` promozioni vocabolario).

### Cronologia / prompt di Matteo (annotati)

| # | Messaggio (sintesi) | Intento | Esito |
|---|---------------------|---------|-------|
| 1 | Sistemare salvataggio Impostazioni (Anagrafica + Personalizza form), compliance navigazione | Feature UX + guard | Prompt esecutore v1 |
| 2 | Mockup visivo per capire flussi | Decisione UX prima del codice | `mockup-salvataggio.html` — «comodissimo», «quasi sempre» |
| 3 | Footer dimezzato a destra; guard modale; autosave campi semplici; dubbio intaso DB | Affinamento prodotto | Risposta: debounce + silent + cap; prod senza autosave |
| 4 | Mobile 50%; footer trasparente; autosave solo debug, prod footer manuale; FU alert dati pubblici | Decisioni finali | FU-004, FU-005; prompt v2 |
| 5 | Prompt revisione QA 375/834/1280 | Verifica visiva | Appendice B consegnata |
| 6 | «Tutto fatto» — analizza comunicazione, primo update skill comunicazione (non senior), commit, report finale | Chiusura ciclo | Questo aggiornamento OSSERVAZIONI/PROPOSTE |

### Frasi ricorrenti (conteggio)

| Frase/intento | Volte | Comportamento desiderato |
|---------------|-------|--------------------------|
| mockup / vedere visivamente flusso UI | 2 | PREPARA_PROMPT §1.B — HTML multi-stato |
| scalabilità multi-azienda / multi-tenant | 1 | Sezione report obbligatoria; FU-006 |
| autosave debug vs prod footer | 2 | FU-004 esplicito |
| dati pubblici Pagina Prenota al Salva | 1 | FU-005 differito |
| agente non senior solo raccolta dati | 1 | OSSERVAZIONI + PROPOSTE, no VOCABOLARIO |

### Spiegazioni che hanno funzionato

- **Schermata + prima/dopo** nella tabella esecutore («Cosa vede Mario») — allineata a COMUNICAZIONE breve per default.
- **Mockup HTML** con tab Oggi/Proposta/Modale — riduce reinterpretazione rispetto a sole parole.
- **Verdetto scalabilità** in tabella semplice (tenant, refetch, timer) — risposta esplicita alla richiesta Matteo.

### Procedure ripetute

- Ciclo multi-agente con **report unificato** (`Report-ciclo-salvataggio-admin-29-05-26.md`).
- Chiusura: validate + aggiornamento skill area (§7.2) + raccolta comunicazione + commit (Matteo esplicito).

### Cosa si può automatizzare vs manuale

| Con certezza (agente) | Meglio manuale (Matteo / Meta) |
|----------------------|--------------------------------|
| Mockup HTML quando task = scelta flusso UX (PREPARA_PROMPT) | Copy esatto modali e footer |
| Sezione Scalabilità multi-tenant nel report se tocca persistenza | Promozione voci VOCABOLARIO |
| OSSERVAZIONI + PROPOSTE a fine ciclo «tutto fatto» | QA browser tabellato se non fatto |
| Toggle `VITE_SETTINGS_AUTOSAVE` documentato | Accensione autosave in prod commerciale |

### Token risparmiabili

- Mockup una volta → meno giri su footer/guard/autosave in chat.
- Decisioni prod (FU-004/005) nel prompt esecutore → esecutore non re-implementa autosave in prod.

### Cosa non è successo in chat

- Nessuna sessione **Meta senior** (`REVISIONE.md` valutazione Liv.2 → Liv.1).
- Nessuna tabella QA 375/834/1280 compilata da agente Verifica dedicato.
- FU-005 modale «dati pubblici» non implementata (voluto).
- Commit non eseguito fino a questa chiusura (Matteo lo chiede ora).

### Proposte fatte / esito

| Proposta | Esito |
|----------|-------|
| Mockup HTML PREPARA_PROMPT | ✅ Codificata §1.B; archivio PROPOSTE |
| Scalabilità multi-tenant in report | ✅ In report; FU-006 aperto per regola permanente |
| «tutto fatto» chiusura ciclo | In attesa in PROPOSTE (Liv.2 candidato) |

---

## Scalabilità multi-tenant

**Verdetto: attenzione** (ok per uso attuale multi-tenant, con accorgimenti già applicati)

| Fattore | Comportamento | Per Matteo |
|---------|---------------|------------|
| **N ristoranti** | Ogni admin vede solo il proprio `tenantId` (RLS + `TenantContext`). Autosave e footer scrivono sempre `restaurant_settings` filtrate per tenant. | Un Mario non tocca i dati di un altro locale. |
| **Refetch query** | Invalidazione **per chiave** dopo upsert → meno rumore tra tenant/tab rispetto al invalidate globale precedente. | Cambiando impostazione non si ricarica tutto il pannello admin. |
| **Timer autosave** | `useDebouncedSettingsAutosave` fa `cancelPending()` su cambio `tenantId` + reset dirty/draft in `RestaurantSettingsTab` / `BookingFormConfigPanel`. | Se l’admin cambia ristorante (multi-account futuro), i timer del locale precedente non salvano sul locale nuovo. |
| **State admin** | Dirty e handler guard sono in React context per sessione browser — non condivisi tra tenant. | Due tab browser su due tenant restano isolate (come prima). |
| **Rischio residuo** | Autosave ON in dev aumenta write DB durante digitazione; in prod FU-004 spegne autosave → solo footer. | In produzione commerciale meno chiamate Supabase e Mario controlla prima di pubblicare. |

**Conflitto:** nessuno rilevato con l’architettura tenant attuale. Monitorare se in futuro più admin modificano lo stesso tenant in parallelo (ultimo write vince — già vero per `restaurant_settings`).

---

## File di skill aggiornati (chiusura comunicazione)

| File | Modifica | Perché |
|------|----------|--------|
| `docs/Comunicazione-Skill/OSSERVAZIONI.md` | Log chiusura ciclo + righe tabella | Raccolta dati agente non senior |
| `docs/Comunicazione-Skill/PROPOSTE.md` | Mockup → archivio; candidato «tutto fatto» | Pattern maturi / in attesa Meta |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | Log idea M1 mockup | Meta junior |
| `docs/FOLLOW_UP.md` | FU-002 nota fase 1 ✅ | Debito fase 2+ |
| `docs/PREPARA_PROMPT_SKILL.md` | §1.B mockup (sessione prepara) | Già in sessione prepara |
| `docs/SESSION_LOG.md` | Riga ciclo | Indice |

**Non toccati in chiusura comunicazione:** `VOCABOLARIO.md`, `COMUNICAZIONE_UTENTE_SKILL.md` (corretto per ruolo non senior).

---

## Stato finale

✅ **Ciclo chiuso** — implementazione in app, validate verde, skill area salvataggio allineate, dati comunicazione raccolti.

**Resta aperto (follow-up):** FU-002 fase 2+, FU-004 (prod senza autosave), FU-005 (conferma dati pubblici), FU-006 (regola report multi-tenant in skill comunicazione), smoke QA browser opzionale.
