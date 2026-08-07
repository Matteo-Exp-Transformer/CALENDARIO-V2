# Stato — Blocco 1 dell'interrogazione (Fase 2)

**Data:** 07-08-26 · **Profilo:** Verifica | Meta · **Esito:** ✅ CHIUSO

> **Regime.** Trascrizione, risposte e scheda valutativa stanno **fuori da git**, in
> `docs/_lavoro/…/Verbali/`. Qui **solo numeri e nomi di riga tecnici**, come per `INT1.md`.

## Formato

Dal vivo, una domanda alla volta, banca `S6_BANCA_DOMANDE.md` **Gruppo A** (`A-01…A-13`),
regole di `INT_00_PROTOCOLLO.md`. **13 domande poste e chiuse su 13**, 23 turni di risposta
(media 1,8 passaggi per domanda).

## Copertura di chi conduce, contata

| Fonte | Perimetro | Letto |
|-------|-----------|-------|
| `00_HANDOFF_UNIFICATO.md` | 259 righe | 100% |
| `INT_00_PROTOCOLLO.md` | 204 righe | 100% |
| `INT_01_PROFILO_UNIFICATO_v0.md` | 334 righe | 100% |
| `S6_BANCA_DOMANDE.md` | 1.006 righe | **302** — §0 + Gruppo A. Gruppi B e C non aperti (per non fondere domande) |
| `INT_04` + `_MODELLO_VERBALE` | 193 righe | 100% |
| `12_Handoff_Interrogazione.md` | 61 righe | 100% |
| `11_Valutazioni_Didattiche.md` | ~180 righe | parziale (rubrica + scheda sessione 7 + coda) |
| `INT_02` · `INT_03` · `S1…S5` · dossier `S6a` · `02_Vocabolario` | — | **non aperti** |

## Conteggi

- **Risposte raccolte e taggate: 14** — `RICORDO` 12 · `NON SO` 2 · **`PROVA` 0** · `OPINIONE` 0.
- **Livelli alzati: 0.** Nessun `PROVA` ⇒ nessuna promozione possibile (regola `INT_00` §2.2).
- **Righe cadute: 0** — era 1, **rettificata dopo verifica** (vedi sotto).
- **Righe declassate: 2** (`controtest` L4→L3 · `lavoro ok / fai report finale` L4→L3), entrambe
  **confermate dalla verifica nel repo**.
- **Righe candidate a declassamento: 2** (`area-disambiguation`, `area-routing`) — verifica non eseguita.
- **Righe rafforzate dalla risposta: 3** (`product-capabilities` intolleranze universali — ottiene la
  seconda fonte che le mancava · `i tre profili` · `doc-vs-live`).
- **Righe candidate a riesame ↑: 1** (`limite-coperti`, oggi L2 per S4).
- **Domande annullate: 1** (`A-08`, mal posta — da ripetere riformulata).
- **Righe nuove aperte: 1** (sistema di test modelli su `Trade-Analyst-Agent`).
- **Conflitti chiusi: 0** — i 9 restano aperti, nessuno era nel perimetro del Gruppo A.
- **Righe in stato `ANNOTATO`: 153**, invariato.

## Verifiche nel repo — **6 eseguite su 13**

| # | Esito |
|---|-------|
| `A-08` | ⚠️ **Domanda mal posta, verdetto annullato.** La regola esiste **in codice** (`src/features/booking/components/BookingRequestForm.tsx:834-844`, render a `:1302`) e **in doc** (`docs/Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md:208`, commit `e01e746` del 04-08-26). Riguarda **una modalità Prenota con una sola sottotab**, non «una categoria con un solo prodotto nel menu digitale». `docs/APP_CONTEXT_SKILL.md:57` instrada «menu digitale» → **area Menu QR**: la lettura data in seduta era quella prescritta dal routing del progetto. **Errore del conduttore, non della risposta.** Riga ripristinata; `L-S4-4` resta aperta (l'account corretto è arrivato dopo la rivelazione ⇒ contaminato) |
| `A-04` | ✅ **Declassamento confermato.** `docs/Testing-Skill/MANUALE_BLINDATURA.md` §1/§2 attacca il «rompi» **al controtest** (sub-agent con mandato *trova bug*), non alla blindatura, che è il cancello Fasi A→D. Definizione canonica in `EVOLUZIONE_SKILLS.md` §7 |
| `A-05` | ✅ **Declassamento confermato.** `docs/Comunicazione-Skill/VOCABOLARIO.md:207` e `:175` (ridefinite 01-06-26): «lavoro ok» = report completo, **nessun commit**; «fai report finale» = commit + push |
| `A-10` | ✅ Nel repo i profili scritti sono **tre** (`APP_CONTEXT_SKILL` §0.1, `VOCABOLARIO:94`, `PREPARA_PROMPT_SKILL:375/434`, `TESTING_MINI:22`). In seduta ne sono stati nominati **sei**: tassonomia viva più fine del sistema scritto |
| `A-12` | 🆕 Repo `Trade-Analyst-Agent`: skill `ai-model-testing` v1.3 (06-06-26) — pipeline a gate, regola di esclusione a **≥2 FAIL**, fixture versionate, soglia latenza `<8s`, scala `/5` su 3 dimensioni, baseline NotebookLM, tracking SSOT obbligatorio. **Mancano** ancoraggio della scala con esempi e denominatore. ⚠️ Testa **i modelli del prodotto**, non gli agenti di sviluppo. **Autore non determinabile** (conflitto `I-8`). **Nessun livello mosso:** materia di `X-04`, Blocco 4 |
| — | **Non eseguite (7):** `A-01` connettori MCP (fuori repo) · `A-02` due interruttori in codice · `A-03` confine BHM v1→v2 · `A-06` `APP_CONTEXT_SKILL` §0 cancello vs mappa · `A-07` prima occorrenza della regola di spiegazione · `A-09` checkbox consenso condizionata · `A-11` commit su `BHM-v.2` |

## Osservazione strutturale del blocco

**Il sistema scritto e la persona non si sovrappongono, e la differenza va in due direzioni.**
Il sistema tiene regole che in seduta non sono state riconosciute (commit a «lavoro ok»; card singola;
cancello d'area); la persona pratica distinzioni che il sistema non registra (tre livelli di verifica
invece di uno; sei profili invece di tre; una condizione in più sulla scrittura in PROD).
**Conseguenza per la Fase 3: un albero costruito solo sui file sbaglia in entrambe le direzioni.**

## Prodotto

| Output | Dove | Su git |
|--------|------|--------|
| `Verbale-Blocco-1-07-08-26.md` (trascrizione + verdetti + scheda) | `_lavoro/…/Interrogazioni Valutative/Verbali/` | ❌ |
| Scheda a 7 criteri, sessione 8 | `INT_04_VALUTAZIONE_SESSIONI.md` **e** `Io-Claude\Crescita professionale\11_Valutazioni_Didattiche.md` | ❌ |
| Riga di log sessione 8 | `Io-Claude\Crescita professionale\00_Profilo_Matteo.md` | ❌ (repo separata, senza remote) |
| `13_Roadmap_Complessiva.md` (7 cantieri · traguardo T1 · backlog) | `Io-Claude\Crescita professionale\` | ❌ (idem) |
| `Report-blocco1-interrogazione-07-08-26.md` | `Indagine-Skill-Matteo/` | ✅ |
| `_stato/BLOCCO1.md` | questo | ✅ |

## Lacune aperte

- `L-INT-1` `08_Candidature` letto al 38% · `L-INT-2` CV PDF mai aperto (invariate).
- 🆕 **`L-B1-1`** — **7 verifiche su 13 non eseguite.** Finché restano, 12 risposte `RICORDO` non
  possono muovere nulla verso l'alto.
- 🆕 **`L-B1-2`** — **`A-08` va ripetuta** con il perimetro corretto (modalità Prenota, non menu digitale).
- 🆕 **`L-B1-3`** — criterio 7 della rubrica **non valutabile**: `02_Vocabolario.md` non letto.
- 🆕 **`L-B1-4`** — la banca `S6b` ha tradotto male almeno una riga del corpus nel formulare la
  domanda (`product-auto-select` *card singola* → «categoria con un solo prodotto»). **Le domande dei
  blocchi successivi vanno lette contro il perimetro reale prima di essere poste.**

## Errore del conduttore, dichiarato

`A-08` posta con la formulazione della banca senza verificarne il perimetro; poi, nel riassunto di
chiusura, un **secondo** errore («nel menu QR c'è una regola…», area sbagliata). Contestato da Matteo
con un argomento fondato sul routing del progetto stesso, **verificato e accolto nella stessa sessione**.

## Prossimo passo

**Blocco 4 — L'incrocio** (`X-01…X-10`), da `INT_02_INTERROGAZIONE.md`. Ordine deciso il 07-08-26:
`1 → 4 → 2 → 3 → 5 → 6`. **Un blocco per sessione. L'albero non si tocca prima del blocco 6.**
Da portare al Blocco 4: la domanda su chi ha scritto il template di benchmark di `Trade-Analyst-Agent`
e perché la scala non è ancorata.
