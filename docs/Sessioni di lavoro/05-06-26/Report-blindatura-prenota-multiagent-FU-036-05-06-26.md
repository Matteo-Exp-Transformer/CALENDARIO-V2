# Report — Blindatura Pagina Prenota: FU-036 + caccia bug multi-agent + suite test

**Data:** 05-06-26
**Branch:** env/test
**Area:** Pagina Prenota (pubblica + config admin)
**Stato:** FU-036 chiuso; 1 bug attivo trovato e fixato; suite di blindatura creata e indicizzata. **Committato** (026dd42 fix + 30dc5b9 suite/docs).

---

## 0. Cappello (in parole semplici)

- **Cosa è cambiato:** la pagina Prenota ora decide cosa mostrare al cliente in base a *com'è
  configurata*, non al nome della tipologia (chiusi gli ultimi 3 punti che ragionavano «per nome»).
  È stato trovato e sistemato un bug vero nel pannello admin (le frecce per riordinare le categorie
  si rompevano con categorie vecchie). E ora c'è una **rete di test** che protegge l'intera pagina.
- **Cosa resta:** niente di bloccante su Prenota. Le intolleranze restano visibili su ogni
  tipologia per tua scelta; le sistemi tu se vorrai. PROD resta indietro (FU-034, sessione senior).
- **Serve una tua azione:** decidere se committo (proposta in fondo).

---

## 1. Cosa è stato fatto, passo per passo

### A. FU-036 — i 3 residui «decidi per nome» (chiusi)
Il comportamento (mostra menù? mostra intolleranze?) non deve dipendere dal NOME della tipologia
(`tavolo`/`rinfresco_laurea`/`menu_prezzo_fisso`) ma dalla **capacità**. Migrati a
`modeUsesMenu`/`modeUsesDietary`/`defaultModeCapabilities`:
1. `BookingSummarySidebar.tsx` — i totali del riepilogo ora seguono `modeUsesMenu(activeMode)`.
2. `BookingRequestForm.tsx` — al cambio tipologia il reset intolleranze segue `modeUsesDietary(nextMode)`.
3. `presetMenus.ts` `shouldShowComposeMenuHeader` — il titolo «Crea il tuo menù» ora appare anche
   per *menù a prezzo fisso* (prima solo rinfresco): bug latente chiuso.

Comportamento storico per le tipologie esistenti: **identico** (è cambiata la fonte della decisione,
non l'esito). Controverificato sul diff reale + commenti + test rieseguiti.

### B. Caccia bug multi-agent (3 sub-agent paralleli, sola analisi + test)
Tre fronti: **flusso dati** (A), **flusso utente cliente** (B), **server+config+per-nome** (C).
Esito complessivo:
- **1 bug attivo reale** (Agent A) — riordino categorie con chiavi stale (vedi §2).
- **Nessun altro bug** nel flusso cliente (Agent B: pagina già solida).
- **Difesa server allineata** (Agent C): cap client ↔ edge `create-booking` coincidono al carattere.
- **Nessun nuovo residuo per-nome** nel pubblico; quelli in area admin (`AdminBookingForm`,
  `DetailsTab`) sono legittimi (operano su prenotazioni GIÀ SALVATE).

### C. Fix applicati da me (oltre ai 3 di FU-036)
- **Bug riordino categorie** (`BookingFormConfigPanel.tsx`): le frecce su/giù ora swappano
  sull'ordine **pulito** (orfane filtrate, duplicati rimossi) invece che sull'array grezzo salvato.
  Prima, con categorie vecchie nell'ordine salvato, la freccia spostava la categoria sbagliata o
  sembrava inerte. Lo scrivere l'ordine pulito ripara anche residui sporchi già salvati. + 2 test.
- **Numero magico** `110` → `BOOKING_PUBLIC_CLIENT_TEXT_LIMITS.numGuestsMax` in `BookingRequestForm`.
- **`isValidName`** allineato da 60 a **65** via costante (`clientName`), così sparisce
  l'incoerenza latente col limite reale del nome. Test aggiornato. (Decisione tua: «65 va bene».)

### D. Decisione `modeUsesDietary` (chiude punto 4 FU-036)
**Intolleranze mostrate su ogni tipologia = scelta deliberata.** `modeUsesDietary` resta un gancio
non collegato; lo scolleghi tu quando ti serve. Documentato in skill §3-bis come scelta, non come
debito.

### E. Suite di blindatura organizzata + indicizzata
Da 333 a **409 test**. Ogni nuovo test ha l'header marcatore `// @prenota-blindatura: <fronte>`.
Indice navigabile creato: **`Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md`** (collegato dalla
skill entry point §6). Dice quale test protegge quale flusso, come girarli per fronte, dove
aggiungerne. Vedi §4 per l'elenco.

---

## 2. Il bug attivo trovato (dettaglio)

**Dove:** `BookingFormConfigPanel.tsx`, riordino categorie ingredienti (pannello «Personalizza
form», card collegata a un menù preselezionato).
**Sintomo:** clicchi la freccia su/giù per riordinare una categoria e non succede niente, oppure si
muove la categoria sbagliata — ma solo quando l'ordine salvato contiene categorie non più nel menù
(es. una cancellata in tab Menu dopo essere stata ordinata).
**Causa:** la lista mostrata è già pulita (orfane filtrate), ma lo swap lavorava sull'array grezzo
salvato (con le orfane): l'indice della riga vista e l'array swappato erano disallineati.
**Fix:** lo swap ora opera sulle stesse chiavi mostrate. Una riga di codice + commento; nessuna LOCK
toccata (resta nel componente owner, scrive via `patchTab`).
**Origine:** era il finding storico della feature `category_order_keys` segnalato nelle sessioni
precedenti come «da verificare». Era ancora un bug. Ora chiuso e blindato.

---

## 3. Report dei sub-agent (sintesi consolidata)

> Richiesta esplicita: report anche dai sub-agent. Riporto la sostanza dei tre messaggi finali.

### Sub-agent A — flusso dati
- **Bug #1 (riordino con chiavi stale)** — MEDIA, lasciato come finding al parent (toccava zona LOCK
  riordino, fix non banale). → **Io l'ho fixato** dopo controverifica (vedi §2).
- **Quirk #2 (dedup input in `orderCategoryKeys`)** — BASSA, non bug attivo (in produzione `keys`
  arriva da un Set). Pinnato come contratto in un test invece di «correggerlo» silenziosamente.
- **Osservazione:** `AdminBookingForm` mostra «Menù consigliato non disponibile» senza guardia
  loading (a differenza di `BookingRequestForm`). Rischio basso (catalogo già caricato all'interazione).
- **Invarianti verificate corrette:** resolver puro + fallback a preset cancellato; parser non
  applica il resolver; lettura pubblica ordine categorie filtra orfane; `BookingRequestForm`
  distingue loading da preset-mancante; `field_overrides` scritto solo dall'owner; capabilities
  legacy → fallback Livello C; sync rename/delete non tocca `field_overrides`.
- **Test aggiunti:** 4 file (`bookingFormResolver.flusso-dati`, `bookingPublicFormConfig.malformed`,
  `orderCategoryKeys.staleKeys`, `buildPresetMenuSelection.flusso-dati`).

### Sub-agent B — flusso utente cliente
- **Nessun bug reale.** Aree verificate a fondo: calcolo totali (somma/fisso/clamp ospiti/guard
  prezzo); cambio tipologia (reset corretto + intolleranze per capacità); cap testo silenziosi;
  submit invalido (niente POST, attenzione primo errore).
- **Scelte volute rispettate** (non toccate): cap silenziosi, intolleranze universali, niente barra
  sticky <1256px, XOR card/carosello, submit invariato.
- **Segnalazione importante (race di parallelismo):** ha riportato un test «rosso», ma era uno stato
  intermedio mentre Agent A stava ancora scrivendo lo stesso file → falso allarme. **Controverifica
  parent:** rieseguita la suite sullo stato finale = tutto verde. (Lezione §6.)
- **Test aggiunti:** 2 file (`bookingTotals.flussoUtente`, `BookingRequestForm.flussoUtente`).

### Sub-agent C — server + config + per-nome
- **Fronte A (limiti):** cap client === cap edge per tutti i campi (name 65, email 65, phone 30,
  dietary 550, special 550, ospiti 110). Findings: `isValidName` 60 vs 65 (→ **io fixato a 65**);
  `110` magico (→ **io agganciato alla costante**).
- **Fronte B (per-nome):** censiti tutti i confronti per nome. I 3 di FU-036 già a posto; nessun
  gemello scoperto; quelli admin (`AdminBookingForm:480`, `DetailsTab:205`) legittimi.
- **Fronte C (config):** nessun bug. Verificato: striscia foto `''` mai NULL; XOR card/carosello;
  card svuotata/carosello senza foto bloccati al commit + scartati alla normalizzazione.
- **Test aggiunti:** 2 file (`bookingClientEdgeLimitsSync`, `restaurantSettingRegistry.stripPhoto`).

---

## 4. La suite di blindatura (file nuovi)

Header marcatore `@prenota-blindatura` su tutti. Indice completo:
`Prenota-Skill/contesto/PRENOTA_TEST_SUITE_INDEX.md`.

**flusso-dati (4):** `services/__tests__/bookingFormResolver.flusso-dati.test.ts` ·
`constants/__tests__/bookingPublicFormConfig.malformed.flusso-dati.test.ts` ·
`utils/__tests__/buildPresetMenuSelection.flusso-dati.test.ts` ·
`utils/__tests__/orderCategoryKeys.staleKeys.flusso-dati.test.ts` (+ blocco reorder bug #1).

**flusso-utente (3):** `utils/__tests__/bookingTotals.flussoUtente.test.ts` ·
`components/__tests__/BookingRequestForm.flussoUtente.test.tsx` ·
`components/__tests__/BookingSummarySidebar.capability.test.tsx` (FU-036 #1).

**server-config (3):** `constants/__tests__/bookingClientEdgeLimitsSync.test.ts` ·
`lib/__tests__/restaurantSettingRegistry.stripPhoto.test.ts` ·
`constants/__tests__/presetMenuDisplay.test.ts` (aggiornato, FU-036 #3).

---

## 5. Verifiche eseguite (esiti reali, riverificati dal parent)
- **typecheck:** zero errori.
- **lint:** zero warning.
- **test:** **409 verdi** (46 file). Baseline inizio sessione: 333.
- Controverifica: ho riletto i diff reali dei sub-agent, eseguito io la suite completa sullo stato
  consolidato (non mi sono fidato dei singoli report — vedi §6), e verificato il bug #1 sul codice
  prima di fixarlo.

---

## 6. Lettura della sessione + lezione di metodo

- **Cosa ha funzionato:** lanciare 3 sub-agent su fronti distinti ha dato copertura ampia in un
  giro; il marcatore `@prenota-blindatura` ha reso i test auto-indicizzanti.
- **Attrito + lezione nuova (da promuovere):** i 3 sub-agent giravano **in parallelo sullo stesso
  working tree**. Uno ha fotografato un file mentre un altro lo stava ancora scrivendo → ha riportato
  un test «rosso» che in realtà era verde a fine corsa. **Falso conflitto risolto solo
  rieseguendo io la suite sullo stato finale.** Lezione: con sub-agent paralleli che scrivono file,
  i loro «esiti test» sono fotografie di stati intermedi; **la verità è una sola esecuzione del
  parent a valle**, dopo che tutti hanno finito. (Candidato per il PLAYBOOK.)
- **Metodo confermato:** non fidarsi del report del sub-agent; rileggere diff + commenti + rieseguire.
  Anche stavolta ha pagato (il bug #1 era lasciato come finding, l'ho promosso a fix dopo verifica).

---

## 7. File toccati

**Codice modificato:** `BookingRequestForm.tsx` (FU-036 #2 + numero magico) ·
`BookingSummarySidebar.tsx` (FU-036 #1) · `presetMenus.ts` (FU-036 #3) ·
`BookingFormConfigPanel.tsx` (bug riordino) · `validation.ts` (isValidName 65).
**Test modificati (preesistenti):** `presetMenuDisplay.test.ts` (FU-036 #3) · `validation.test.ts` (isValidName 65).
**Test nuovi:** 9 file (§4) — incluso `orderCategoryKeys.staleKeys.flusso-dati.test.ts` con il blocco reorder del bug #1.
**Docs:** `PRENOTA_SKILL.md` (§3-bis + mappa §6) · `PRENOTA_TEST_SUITE_INDEX.md` (nuovo) ·
`FOLLOW_UP.md` (FU-036 → Fatto).
**NON toccati (LOCK):** edge `create-booking` (FU-034), migrazioni DB, `useCreateBookingRequest`,
`bookingCapabilities.ts`.

---

## 7-bis. Pratiche senior (fine-sessione)
- **PLAYBOOK `EVOLUZIONE_SKILLS.md`:** aggiunte 2 voci (Log idee, 05-06-26): (1) metodo «sub-agent
  paralleli → verità = una esecuzione del parent a valle»; (2) pattern «test rintracciabili:
  marcatore in-header + indice di area».
- **Template v.0 `_skill-system-v0/`:** **NON toccato** in questa sessione. Il pattern «marcatore
  `@area-blindatura` + indice test» è un buon candidato, ma ha **un solo caso** (Prenota): attendo
  la 2ª occorrenza prima di generalizzarlo nel template (stessa prudenza del 04-06 per context-knowledge).

## 8. Cosa resta
- **FU-034** (allineamento PROD ↔ TEST + deploy edge): sessione senior dedicata, PROD non si tocca
  senza tuo via.
- **Residui per-nome admin** (`AdminBookingForm`, `DetailsTab`): legittimi oggi, migrabili a
  capability per coerenza piena — non urgente.
- **E2E Playwright** della pagina Prenota: fuori scope di questa suite (tutta Vitest).

---

## 9. Proposta di commit (in attesa del tuo via)
Due commit puliti, separati per natura:
1. `fix(prenota): comportamento per capacità non per nome (FU-036) + bug riordino categorie`
   → i 5 file di codice + test FU-036/bug + isValidName.
2. `test(prenota): suite di blindatura + indice rintracciabile`
   → 9 test nuovi + `PRENOTA_TEST_SUITE_INDEX.md` + aggiornamenti skill/FOLLOW_UP.

Dimmi se procedo o se preferisci un commit unico / altra suddivisione.

---

## 10. Domande di chiusura

❓ Q1 — Prompt ricevuti (verbatim sostanziali):
✅ R1:
- «proseguiamo lavoro di blindatura pagina prenota. […] non solo saniamo ultimi bug e FU rimasti, ma
  cerchiamone attivamente tanti altri […] con sub agent che testeranno i pattern di flusso dati e
  utente […]. mentre tu fai il plan […] lancia sub agent per sistemare ultimi bug in fu di pagina
  prenota, poi controverifica il suo lavoro»
- «procedi con i test di sub agent. e facciamo in modo che rimangano dei test riutilizzabili per
  testare intera pagina prenota in tutti i suoi flussi. […] dovrai alla fine organizzare bene i file
  di test e la documentazione per essere facilmente rintracciabile da agenti.»
- «is valid name 65 va bene, e mode uses dietary per ora attivo a ogni tipologia di prenotazione. in
  caso lo scollego io se mi serve. fai report finale e fai fare anche a sub agenti report.»

❓ Q2 — Dati = diff reale?
✅ R2: Sì, riverificato. `git status`/`git diff` confermano: 5 file codice modificati + 2 test
modificati + 9 test nuovi + 3 docs. I conteggi test (333→409) sono dell'esecuzione reale del parent
sullo stato finale, NON dei report dei sub-agent (che erano fotografie intermedie discordanti — §6).
Il bug #1 verificato sul codice (BookingFormConfigPanel righe 956-977) prima del fix.

❓ Q3 — File correlati allineati?
✅ R3: Skill `PRENOTA_SKILL.md` §3-bis aggiornata (3 residui → chiusi; modeUsesDietary → scelta
deliberata) + mappa §6 (link all'indice test). `PRENOTA_TEST_SUITE_INDEX.md` creato e collegato.
`FOLLOW_UP.md` FU-036 → Fatto. Tipi: nessuna modifica necessaria. Test: tutti allineati e verdi.

❓ Q4 — Cosa NON hai fatto?
✅ R4: Non toccato l'edge function (FU-034, PROD). Non migrato i residui per-nome admin (legittimi,
non in scope). Non collegato `modeUsesDietary` (tua scelta esplicita: resta universale). Non
committato (aspetto il tuo via). Non fatto E2E Playwright.

❓ Q5 — Attrito + miglioria:
✅ R5: Attrito: sub-agent paralleli sullo stesso working tree → esiti test discordanti (stati
intermedi). Miglioria: trattare gli «esiti test» dei sub-agent paralleli come indicativi, e fare UNA
verifica autorevole del parent a valle. Da promuovere nel PLAYBOOK. Secondo: un sub-agent ha lasciato
il bug #1 come finding invece di fixarlo — corretto, perché toccava una zona LOCK; il giudizio finale
sul fix spetta al parent dopo controverifica.

❓ Q6 — Contesto & hook:
✅ R6: Contesto **giusto**: `PRENOTA_SKILL` + `PRENOTA_DATA_FLOW_CONTEXT` contenevano tutte le LOCK
necessarie a indirizzare i sub-agent (ogni LOCK = un'invariante da testare). Il principio «pochi file
letti interi» ha funzionato anche per i sub-agent. Hook fine-sessione: utile come promemoria del
controllo a mente fredda.

---

## 11. Self-review
1. **Dati = diff reale:** ✅ riverificato, conteggi dal parent non dai sub-agent.
2. **File correlati:** ✅ skill + indice + FOLLOW_UP allineati.
3. **Q1-Q6 coerenti:** ✅.
4. **Tono utente:** ✅ cappello + §1/§2 in linguaggio pratico.
5. **Controverifica:** ✅ bug #1 verificato e fixato dopo che il sub-agent l'aveva lasciato come
   finding; falso conflitto test risolto rieseguendo la suite.
