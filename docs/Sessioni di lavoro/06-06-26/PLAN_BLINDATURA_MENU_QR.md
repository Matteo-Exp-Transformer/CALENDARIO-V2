# PLAN — Blindatura completa Menu QR

> **Cos'è questo file.** Il piano operativo per portare l'area **Menu QR** dallo stato «mappata +
> documentata» (✅ doc) allo stato «**blindata di prodotto**»: pagina pulita, solo elementi funzionali
> e da produzione, admin↔UI perfettamente allineati, zero mock/hardcoded/codice morto, controtestata
> da sub-agent su flusso dati e flusso utente. Lo esegue un **agente orchestratore Opus** che
> supervisiona sub-agent e intervista Matteo. Preparato 06-06-26 dal senior, su inventario verificato
> nel codice.

> **⚠️ Definizione nuova di «blindata» (vale da ora per TUTTE le aree).** Fino al 06-06-26 «blindata»
> significava solo: un sub-agent terzo si orienta tra i file guidato dalla skill. **Da ora non basta.**
> Blindata = (1) **doc** che guida + (2) **pagina di produzione pulita e funzionante**: ogni componente
> renderizzato ha senso, è allineato tra admin e UI cliente, niente elementi configurati-ma-non-mostrati
> né mostrati-ma-non-configurabili, niente dati mock/hardcoded/placeholder che fingono dati veri, niente
> codice morto; + (3) **controtest sub-agent** che esercita flusso dati e flusso utente cercando bug
> (responsive rotto, errori, dato mock residuo, disallineamenti). Vedi `EVOLUZIONE_SKILLS.md` Playbook.

---

## 0. Prima di iniziare (orchestratore)

1. Leggi INTERO: `docs/Menu-QR-Skill/MENU_QR_SKILL.md` + tutti i `contesto/*` + questo plan.
2. Leggi l'inventario di partenza (sotto, §1): è **verificato nel codice** il 06-06-26, ma il codice è
   la verità — riverifica ogni riga che tocchi prima di agire (i numeri di riga possono spostarsi).
3. **Intervista Matteo** (`AskUserQuestion`) sul senso che ha solo lui PRIMA di toccare codice:
   - Per ogni elemento «mostrato ma non configurabile» (footer data/ora, ordine piatti): **è voluto
     così o è un buco?**
   - Per il fallback nome locale «Menu» e l'eyebrow «Specialità della casa»: **che fallback vuole?**
     (testo neutro? nascondere l'elemento? un default suo?)
   - Limiti caratteri FU-MQR-1 (titolo/descrizione categoria): **quale tetto?** (proporre, non imporre).
   - Conferma rimozione codice morto preset (già deciso 06-06-26: **sì, rimuovere**).
4. **Ambiente:** controtest scrittura/flusso su **TEST** (`docnnernvp`); ispezione **PROD read-only**
   (`rwuxgvld`) SOLO per cercare mock/hardcoded reali nei dati clienti. Mai scrivere su PROD.
   Verifica l'ambiente con `get_project_url` prima di ogni operazione MCP (regola CLAUDE.md).
5. **Branch:** lavora su `env/test`. Working tree può contenere lavoro di Matteo non committato
   (controlla `git status`): **stage selettivo**, non committare mai file altrui.

---

## 1. Inventario di partenza (verificato nel codice 06-06-26)

### Lato admin — modale «Impostazione Menù QR»
Componenti: `MenuQrModal.tsx`, `MenuQrManager.tsx`, `MenuHomepageConfigPanel.tsx`, `useMenuQrCodes.ts`,
`useSaveMenuQrSettings`, sezioni `MenuQrCarouselSection`, `MenuQrCategoryCardsSection`,
`MenuQrThemeSection`, `MenuQrHiddenItemsPicker`, `MenuCategoryIconPicker`.
Scrive su `menu_qr_codes` (name, category_filter, theme_key, carousel_items, category_images,
hidden_menu_item_ids) + `menu_qrcode_categories` (title, description, icon).

### Lato UI cliente — pagine pubbliche `/menu/:slug/qr/:shortCode`
`PublicMenuPage.tsx` (hero nome locale, `MenuCarousel`, `MenuNavTabs`, griglia `CategoryCard` con/senza
foto, `MenuFooterCard`), `PublicMenuCategoryPage.tsx` (header tema + lista piatti foto-first + filtro
ingredienti nascosti), `PublicMenuPresetPage.tsx` (**codice morto**), helper `menuQrAppearance.tsx`,
`menuThemes.ts`.

### Le 3 incoerenze REALI da chiudere (confermate nel codice)
| # | Cosa | Dove | Tipo |
|---|------|------|------|
| **I-1** | Fallback eyebrow «Specialità della casa» **documentato ma NON implementato** (codice mostra eyebrow solo `if (eyebrow)`) | `PublicMenuPage.tsx:199-202` vs `MENU_QR_DATA_FLOW_CONTEXT.md §6` | doc↔codice divergono → decidere con Matteo se implementare il fallback o correggere la doc |
| **I-2** | Titolo/descrizione categoria per-QR **senza cap** (FU-MQR-1) | `MenuHomepageConfigPanel.tsx:567-589` | input nudi → cappare con `AdminFieldWithCharCount` |
| **I-3** | **Codice morto preset** irraggiungibile dall'UI | vedi §3 mappa completa | rimuovere |

> **Nota positiva:** la ricognizione **non ha trovato** dati hardcoded di aziende specifiche (nessun
> «Ristorante Da Mario», telefoni, indirizzi letterali). I soli letterali sono fallback UI generici
> («Menu», «Caricamento…», «Menu in preparazione») — da valutare con Matteo (§2.A), non mock da clienti.

---

## 2. Fasi di esecuzione (in ordine)

### FASE A — Intervista + senso (orchestratore ↔ Matteo)
Output: per ogni elemento ambiguo, una decisione registrata (voluto / da fixare / da rimuovere).
Non si tocca codice finché A non è chiusa. Le decisioni alimentano le fasi B–D.

### FASE B — Pulizia: codice morto preset (I-3)
Rimuovere ciò che è mappato in §3. Regola: **prima provare che è irraggiungibile**, poi rimuovere.
Dopo ogni rimozione: `npm run typecheck` + `npm run build` verdi. Sub-agent può eseguire la rimozione
SOLO con prompt che elenca esattamente cosa togliere e cosa NON toccare (le parti funzionanti).
La colonna DB (`content_type`, `preset_ids`) si rimuove con **migrazione nuova** solo se Matteo conferma
e dopo aver verificato su PROD read-only che nessun cliente abbia righe con `content_type != 'a_la_carte'`.

### FASE C — Allineamento admin↔UI + mock/fallback (I-1, I-2 + decisioni Fase A)
- Implementare/correggere i fallback decisi in Fase A (eyebrow, nome locale).
- Cappare titolo/descrizione categoria (I-2): costanti `QR_CATEGORY_TITLE_MAX`/`_DESCRIPTION_MAX`
  vicino alle costanti carosello + `AdminFieldWithCharCount` + test.
- Per ogni elemento «configurato ma non mostrato» o «mostrato ma non configurabile» rimasto: applicare
  la decisione di Fase A (renderizzare, rendere configurabile, o rimuovere).
- **Criterio di uscita C:** ogni campo admin ha una controparte visibile lato cliente e viceversa, o è
  esplicitamente segnato «voluto interno» (come il nome QR) nella doc.

### FASE D — Controtest sub-agent (flusso dati + flusso utente)
**Almeno 2 sub-agent in parallelo, con compiti distinti** (ricorda: gli esiti dei sub-agent paralleli
sullo stesso albero sono fotografie intermedie — la verità è UNA esecuzione del parent a valle):
- **Sub-agent FLUSSO DATI:** su TEST, crea/modifica un QR coprendo ogni campo admin; verifica che ogni
  valore salvato compaia correttamente lato cliente; prova i casi limite (campi vuoti → fallback giusto,
  non mock; categoria senza foto; carosello con 1 sola slide; ingredienti nascosti).
- **Sub-agent FLUSSO UTENTE + RESPONSIVE:** apre le pagine pubbliche come farebbe un cliente, su
  **375 / 834 / 1280**; cerca layout che si rompe (titoli/descrizioni lunghi dopo il cap, carosello,
  card categoria, header categoria), link rotti, errori console, stati vuoti che mostrano placeholder
  sbagliati.
Ogni sub-agent **RIPORTA** i bug (non fixa). L'**orchestratore decide**: fixa lui o delega a un
sub-agent con prompt che protegge senso + parti funzionanti (vedi §4 regola anti-rottura).

### FASE E — Verifica finale + chiusura
- Parent riesegue la suite test completa sullo stato consolidato (verde).
- `npm run validate` verde.
- Aggiorna `MENU_QR_SKILL.md` + `contesto/*` per riflettere lo stato reale post-pulizia (la doc deve
  specchiare il codice: niente più riferimenti al preset rimosso, fallback aggiornati).
- Aggiorna `PROSEGUIMENTO_MAPPATURA_SKILL.md` (Menu QR resta ✅ ma con nota «blindatura di prodotto
  completata»), chiudi FU-MQR-1 e il debito codice morto preset.
- Report di sessione con tabella esiti controtest per viewport.

---

## 3. Codice morto preset — mappa di rimozione (verificata 06-06-26)

| Componente | File:riga | Azione |
|------------|-----------|--------|
| Pagina preset intera | `src/pages/PublicMenuPresetPage.tsx` | DELETE file |
| Route preset | `src/router.tsx` (route `/menu/:slug/qr/:shortCode/preset/:presetId`) | rimuovere route |
| Ramo `showPresets` in MenuContent | `PublicMenuPage.tsx:656-681` | rimuovere JSX |
| `usePublicPresets` hook (homepage) | `PublicMenuPage.tsx:61-82` | rimuovere |
| Logica `showPresets`/calc | `PublicMenuPage.tsx:565-566` | resta solo `showCart` |
| Branch preset in `MenuNavTabs` | `PublicMenuPage.tsx:289-302` | resta solo branch categorie |
| `content_type` (buildPayload sempre a_la_carte) | `MenuQrModal.tsx:374` | rimuovere campo se si droppa colonna |
| `preset_ids` (preservato) | `MenuQrModal.tsx:376` | idem |
| Tipo `MenuQrCode.content_type`/`preset_ids` | `src/types/menu.ts` | aggiornare dopo migrazione |
| Colonne DB `content_type`/`preset_ids` + CHECK | migrazioni 030/034/037 → **nuova migrazione DROP** | solo se PROD read-only conferma 0 righe non-a_la_carte |

**INC latenti da NON fixare separatamente** (spariscono con la rimozione): INC-05, INC-06, INC-15, INC-16.

---

## 4. Regole per i sub-agent (l'orchestratore le mette nei prompt)

1. **Read-only di default.** Un sub-agent scrive/modifica codice SOLO se l'orchestratore glielo chiede
   con un prompt che elenca: cosa toccare, cosa NON toccare, e qual è il senso da preservare.
2. **Prompt anti-rottura (quando si delega un fix):** «Stai modificando X per [motivo]. NON cambiare
   [parti funzionanti elencate]. Il senso dell'elemento è [dalla doc/intervista]. Dopo: typecheck +
   build verdi. Se per fixare devi toccare una parte funzionante o una LOCK, FERMATI e riporta come
   finding.» (Il giudizio sul fix che tocca zone sensibili spetta all'orchestratore dopo controverifica.)
3. **Esiti paralleli = fotografie intermedie.** Con N sub-agent sullo stesso albero, i loro «X verdi/
   rossi» sono indicativi; la verità è UNA esecuzione del parent a valle.
4. **Mai PROD in scrittura.** Ispezione PROD solo read-only (SELECT), con `get_project_url` prima.

---

## 5. Criterio «BLINDATA di prodotto» — checklist di uscita

- [ ] Ogni componente admin ha controparte visibile lato cliente (o è marcato «voluto interno» in doc).
- [ ] Ogni elemento mostrato al cliente è configurabile dall'admin (o è marcato «voluto/di sistema»).
- [ ] Nessun fallback mostra dati mock/placeholder che fingono dati veri; i fallback vuoti sono neutri
      e decisi con Matteo.
- [ ] Nessun dato hardcoded di azienda specifica (verificato anche su PROD read-only).
- [ ] Codice morto preset rimosso; build/typecheck verdi; router pulito.
- [ ] FU-MQR-1 chiuso (cap titolo/descrizione categoria + test).
- [ ] Controtest sub-agent flusso dati: ogni campo salvato → mostrato correttamente; casi limite ok.
- [ ] Controtest sub-agent flusso utente: 375/834/1280 senza rotture, link/console puliti.
- [ ] Parent riesegue suite completa → verde; `npm run validate` → verde.
- [ ] Doc allineata allo stato reale; PROSEGUIMENTO + memory aggiornati; report sessione con tabella
      esiti per viewport.
