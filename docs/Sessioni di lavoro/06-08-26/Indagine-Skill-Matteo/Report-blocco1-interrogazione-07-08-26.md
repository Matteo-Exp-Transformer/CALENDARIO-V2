# Report — Blocco 1 dell'interrogazione senior (Fase 2)

**Data:** 07-08-26 · **Sessione:** Claude Code (Opus 5) su `CalendarBackup-v2`, branch `env/test`
**Profilo:** Verifica | Meta · **Esito:** ✅ blocco chiuso, 13 domande su 13

> ⚠️ **Regime.** Le risposte, la trascrizione e la scheda valutativa **non sono in questo file e non
> sono su git**: stanno in `docs/_lavoro/…/Interrogazioni Valutative/Verbali/`, che è ignorata
> (`.gitignore:42`, verificato). Qui ci sono **solo numeri, nomi di riga tecnici ed esiti di verifica
> sul codice** — stesso confine del `Report-fase1-interrogazione-07-08-26.md`.
> Stato sintetico: [`_stato/BLOCCO1.md`](_stato/BLOCCO1.md).

---

## 1. Cosa è stato fatto

Prima seduta della **Fase 2**. Condotto il **Blocco 1 — Fatti e memoria** (`A-01…A-13`) dalla banca
`S6_BANCA_DOMANDE.md`, con le regole vincolanti di `INT_00_PROTOCOLLO.md`: dal vivo, **una domanda
alla volta**, nessuna risposta attesa letta ad alta voce, ogni risposta con **un solo tag**
(`PROVA` · `RICORDO` · `OPINIONE` · `NON SO`).

**13 domande poste e chiuse su 13**, 23 turni di risposta.

In apertura, su richiesta, è stata creata anche la **roadmap complessiva** dei cantieri
(`Io-Claude\Crescita professionale\13_Roadmap_Complessiva.md`): 7 cantieri con stato e condizione di
chiusura, un solo traguardo visibile per volta (**T1** = albero a doppio asse chiuso), e un backlog
tracciato con `MIN-1` (eventuali mining mirati aggiuntivi, **da aprire solo se una risposta indica un
punto preciso che il corpus può chiudere**, mai «per completezza»).

---

## 2. Esito sull'albero

| | |
|---|---|
| Risposte taggate | **14** — `RICORDO` 12 · `NON SO` 2 · **`PROVA` 0** |
| **Livelli alzati** | **0** — senza `PROVA` non si alza niente (`INT_00` §2.2) |
| Righe cadute | **0** (era 1, rettificata dopo verifica) |
| Righe declassate | **2**, entrambe confermate dalla verifica nel repo |
| Righe candidate a declassamento | **2** (verifica non eseguita) |
| Righe rafforzate dalla risposta | **3** |
| Righe candidate a riesame ↑ | **1** |
| Domande annullate | **1** (`A-08`) |
| Righe nuove aperte | **1** |
| Conflitti chiusi | **0 su 9** — nessuno era nel perimetro del Gruppo A |
| Righe in stato `ANNOTATO` | **153**, invariato |

**Declassate e confermate:**

- **`controtest`** L4 → L3. `docs/Testing-Skill/MANUALE_BLINDATURA.md` §1/§2 lega il «rompi»
  **al controtest** («*sub-agent con mandato trova bug*»; «*un controtest che non ha provato a rompere
  nulla non chiude l'area*»); la **blindatura** è il cancello Fasi A→D di cui il controtest è la Fase C.
  In seduta le due cose sono state descritte invertite. Definizione canonica: `EVOLUZIONE_SKILLS.md` §7.
- **`Separazione «lavoro ok» / «fai report finale»`** L4 → L3.
  `docs/Comunicazione-Skill/VOCABOLARIO.md:207` e `:175`, ridefinite il 01-06-26: «lavoro ok» = report
  completo, **nessun commit**; «fai report finale» = **commit + push**.

**Rafforzate:** `product-capabilities` intolleranze universali (era il secondo caso più fragile
dell'albero: **ottiene la seconda fonte che le mancava**) · `i tre profili` · `doc-vs-live` (unica L4
del ramo R11, retta piena).

---

## 3. La rettifica di `A-08` — e l'errore del conduttore

**Il verdetto principale della seduta è stato annullato dopo verifica nel codice.**

La domanda chiedeva la regola «*nel **menu digitale**, quando una **categoria** ha un solo
**prodotto***». La regola vera è un'altra cosa:

- **Codice:** `src/features/booking/components/BookingRequestForm.tsx:834-844` — modalità
  `sub_tabs_presentation === 'cards'` con **esattamente una sottotab** → selezione automatica +
  applicazione del preset collegato. Render condizionato a `:1302`
  (`activeModeSubTabs.length > 1`): con una sola card la strisciolina non compare.
- **Doc:** `docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md:208` — «*Card singola (04-08-26,
  decisione Matteo)*», commit `e01e746` del **04-08-26**.
- **Routing:** `docs/APP_CONTEXT_SKILL.md:57` instrada **«menu digitale» → area Menu QR**.

Quindi la lettura data in seduta era **quella prescritta dal routing del progetto**, e sul Menu QR la
risposta data era corretta: lì quella regola non esiste.

**L'errore è del conduttore, due volte:** formulazione della banca usata senza verificarne il
perimetro, e un secondo errore nel riassunto di chiusura («*nel menu QR c'è una regola…*»).
**Riga ripristinata, domanda da ripetere riformulata.**

⚠️ **Cosa non cambia:** il racconto corretto della regola è arrivato **dopo** che il contenuto era
stato rivelato ⇒ contaminato, non vale come seconda fonte indipendente, **`L-S4-4` resta aperta,
nessun livello sale**. Quello che invece cambia oggettivamente: quella riga ha ora **doc + codice +
data + commit**, e non è più «un solo file che dice di sé che è una regola».

**Lacuna di metodo che ne deriva (`L-B1-4`):** la banca `S6b` ha tradotto male almeno una riga del
corpus nel formularne la domanda. **Le domande dei blocchi successivi vanno lette contro il perimetro
reale prima di essere poste.**

---

## 4. Riga nuova: `Trade-Analyst-Agent`

Verificata la skill **`ai-model-testing` v1.3** (aggiornata 06-06-26) nella repo
`Trade-Analyst-Agent`: pipeline a gate in ordine obbligatorio, **regola di esclusione a ≥2 FAIL**
(mai su un esito singolo), fixture versionate, **soglia numerica sulla latenza** (`<8s`), scala `/5`
su tre dimensioni, **baseline di confronto**, tracking SSOT con aggiornamento obbligatorio.

**Rilevante** perché `INT_01` §3.3 restringe il buco evals a *caso probabilistico* + *misura numerica*,
ed entrambi qui compaiono almeno in parte. **Nessuna delle due indagini l'aveva visto.**

⚠️ **Tre limiti, e senza questi sarebbe una promozione a chiacchiera (vietata da `INT_00` §7):**
la scala **non è ancorata** con esempi · **testa i modelli del prodotto**, non gli agenti di sviluppo
(la descrizione data in seduta è imprecisa su questo) · **l'autore non è determinabile**, e l'autore
git non decide (conflitto aperto `I-8`).

**Nessun livello mosso.** È materia di `X-04`, **Blocco 4**.

---

## 5. Copertura, dichiarata con i numeri

**Lettura di chi conduce:** 6 fonti al 100%, `S6_BANCA_DOMANDE` al 30% **per scelta** (302 righe su
1.006: aperti §0 e Gruppo A, chiusi i gruppi B e C per non fondere domande di blocchi diversi),
`11_Valutazioni_Didattiche` parziale. **Non aperti:** `INT_02`, `INT_03`, `S1…S5`, dossier `S6a`,
`02_Vocabolario`.

**Verifiche nel repo: 6 eseguite su 13.** Le 7 non eseguite sono elencate in
[`_stato/BLOCCO1.md`](_stato/BLOCCO1.md) e sono la lacuna `L-B1-1`: finché restano aperte, **12
risposte `RICORDO` non possono muovere nulla verso l'alto**.

---

## 6. Igiene verificata in questa sessione

- Il verbale e la scheda sono **fuori da git**: `git check-ignore` risponde `.gitignore:42`.
- Le scritture nella cartella di tutoraggio sono andate **sull'originale** in
  `Documents\Io-Claude\Crescita professionale\`, **mai sulla copia** in `docs/Archives/`
  (regola del progetto: disco = fonte di verità, non far divergere le due cose).
- Nessun file di `src/` modificato in questa sessione.

---

## 7. Prossimo passo

**Blocco 4 — L'incrocio** (`X-01…X-10`), da `INT_02_INTERROGAZIONE.md`.
Ordine deciso il 07-08-26: `1 → 4 → 2 → 3 → 5 → 6`. **Un blocco per sessione.**
**L'albero non si tocca prima del blocco 6.**

Chi conduce parte da `00_HANDOFF_UNIFICATO.md`, poi `INT_00_PROTOCOLLO.md` **per intero**, poi il
verbale del Blocco 1 (per sapere cosa verificare), poi le domande del blocco.
