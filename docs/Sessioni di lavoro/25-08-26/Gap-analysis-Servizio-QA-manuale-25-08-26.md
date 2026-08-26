# Gap-analysis — checklist QA manuale Servizio (WP-1 istanza 2)

> **Data:** 25-08-2026 · **Branch:** `env/test` · **Mandato:** confronto voce-per-voce tra checklist
> storica, checklist filtrata 06-08, copertura WP-1 istanza 1 (257 Vitest + E2E 19 + createUpdate 5).
> **Etichette UI:** estratte da grep+read su `RoomConfigModal`, `TableFormModal`, `ServiceSlotsManager`,
> `WalkInModal`, `AssignmentMapPanel`, `QuickTableAssignModal`, `ServizioPage`, `ShiftBriefingModal`.

---

## Riepilogo numerico

| Fonte | Voci analizzate | → Checklist umana istanza 2 |
|---|---|---|
| `COLLAUDO_S4_CHECKLIST.md` | 62 (escl. §1 già collaudato e §10 decisioni) | 16 prove T + setup + validazione |
| `COLLAUDO_MANUALE_OBBLIGATORIO.md` (06-08) | 16 + §5 (38 esclusi) | **Aggiornato** con §0-bis, §1-bis, §5 WP1 |
| E2E `pro-service.spec.ts` | 6 test | Copertura modali responsive + smoke + validazione fasce |
| E2E `pro-service-tables-lifecycle.spec.ts` | 13 test | Lifecycle completo browser |
| Vitest Servizio (WP1 §10-bis) | 257 + 5 createUpdate | Logica/hook/component — non sostituisce occhi/PDF/anello pubblico |

**Gap espliciti rispetto al mandato Matteo 25-08-26:**

| Gap | Stato prima | Azione istanza 2 |
|---|---|---|
| Setup da zero (sala dedicata «QA-Manuale») | §0.3 assumeva dati pronti | **§0-bis** sequenza click completa |
| Validazione compilazione modali | Solo parziale in E2E fasce | **§1-bis** prove V1–V8 |
| `FU-SERV-TURNO-SALA-1` | Nota in T7 | **T7-bis** prova dedicata con esito atteso oggi |
| `FU-SERV-MANOPOLE-CONSOLE-1` | Assente | Nota in §0 (non prova click) |
| `FU-SERV-BADGE-CASCATA-1` | T13 generico | T13 ampliato + decisione aperta |

---

## Etichette UI verificate (campione codice)

| Schermata / modale | Testo reale in UI | File |
|---|---|---|
| Pagina Servizio | Tab **Lista** / **Mappa**; toggle **Servizio** / **Modifica**; CTA **Aggiungi sala** | `ServizioPage.tsx` |
| Linguetta sala | Pulsante **Modifica sala** → modale titolo **Configura sala** | `RoomTabs.tsx`, `RoomConfigModal.tsx` |
| Nuova sala | **Aggiungi sala** → **Crea sala** | `RoomConfigModal.tsx` |
| Tavolo | **Aggiungi tavolo** / **Modifica tavolo** → **Salva modifiche** | `TableFormModal.tsx` |
| Fasce | Card **Fasce orarie**; matita → **Modifica fascia oraria**; **Tipo di salvataggio** + menu **Sempre** / **Solo oggi** / … | `ServiceSlotsManager.tsx` |
| D38 | Casella **Mantieni anche il limite coperti della fascia** | `ServiceSlotsManager.tsx` |
| Walk-in Home | **Aggiungi walk-in** (pulsante Home + titolo modale) | `WalkInModal.tsx`, `AdminHomePage.tsx` |
| Assegnazione | **Assegna** → **Assegna tavolo** / **Assegna N tavoli**; conflitto → **Sposta e assegna**, **Archivia e assegna**, **Rimetti in attesa e assegna** | `AssignmentMapPanel.tsx` |
| Fine turno | **Tavolo a fine turno**; **Libero** / **Ancora occupato** / **Decido dopo** | `TableReleaseNoticeModal.tsx`, lifecycle E2E |
| Briefing | Home **Briefing turno** → modale **Briefing pre-turno**; **Scarica PDF**; tendina **Turno:** | `AdminHomePage.tsx`, `ShiftBriefingModal.tsx` |
| Mobile Modifica | *«Da mobile la modifica della sala è nascosta: passa alla vista Servizio per assegnare i tavoli.»* | `ServizioPage.tsx:401` |

**Mismatch corretti in checklist:** T7 citava solo «Modifica sala» — la modale si intitola **Configura sala** (il click parte da **Modifica sala** sulla linguetta).

---

## Classificazione voce-per-voce — `COLLAUDO_S4_CHECKLIST.md`

Legenda: **COPERTA** = escludi da checklist umana · **PARZIALE** = includi (aspetto umano) · **SCOPERTA** = includi · **OBSOLETA** = butta

### §2.1 Due viste mappa (6 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Toggle Servizio \| Modifica, apertura su Servizio | COPERTA | `ServizioPage.dueViste.test.tsx` + E2E smoke | §5 |
| Tavolo mostra nome, occupante, coperti; legenda 5 colori | PARZIALE | E2E stati copre logica; leggibilità umana | T12 |
| Click Modifica → editor griglia, una sola mappa | COPERTA | `ServizioPage.dueViste.test.tsx:87-117` | §5 |
| Torna Servizio → posizioni aggiornate | COPERTA | E2E lifecycle implicito | §5 |
| Click tavolo occupato → riquadro + Libera tavolo | COPERTA | `pro-service-tables-lifecycle.spec.ts:1000-1033` | §5 |
| 375px piantina scorrevole, pagina no overflow | PARZIALE | E2E parziale fine turno 375; giudizio scroll pagina | T10 |

### §2.2 Avviso fine turno (6 voci, 2 già [x])

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Finestra si apre da sola con dati | COPERTA | E2E `:616-852` | §5 |
| Ora fine turno corretta | COPERTA | Stessa spec + unit | §5 |
| Ancora occupato persiste dopo reload | COPERTA | Chiuso 03-08, E2E | §5 |
| Libero → checkout append-only | COPERTA | E2E `:691` | §5 |
| Decido dopo + secondo tavolo | COPERTA | E2E `:750` | §5 |
| Cambio fascia azzera avvisi gestiti | COPERTA | E2E `:854` + unit | §5 |

### §2.3 Tavolata multi-tavolo (8 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Assegna 10 coperti, multi-select, contatore | COPERTA | E2E `:963-1138` | §5 |
| Assegna 2 tavoli, una riga Assegnate | COPERTA | Idem | §5 |
| Mancano N posti | COPERTA | Idem + T8 parziale umano | T8 (refresh) |
| Aggiungi tavolo, Già in tavolata | PARZIALE | E2E 3 tavoli; apertura da riga assegnata solo umano | T8 |
| Piantina tutti occupati stesso cliente | COPERTA | E2E | §5 |
| Annulla libera tutti | COPERTA | E2E `:1042` | §5 |
| Briefing nomi tavoli virgola | COPERTA | `useShiftBriefing.test.tsx:143-354` | §5 (PDF umano T6) |

### §3 Stati tavoli e turni (7 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| In arrivo → Occupato → ritardo → uscita automatici | COPERTA | E2E `:1152-1212` + clock | §5 |
| Colore piantina = colore elenco | OBSOLETA | Vista Lista non mostra colori (`lifecycle :1214`) | §6 |
| Turni esauriti + Motivo + Assegna comunque | COPERTA | E2E `:487-609` | §5 |
| Tavolo occupato «Libera e assegna» | OBSOLETA | UI sostituita da 3 scelte (S4-FIX-5) | T9 |

### §4 Capienza e D38 (5 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Super capienza tavolo: avviso non blocco | PARZIALE | Unit multi-tavolo; singolo tavolo solo umano | T4 |
| D38 OFF admin usa posti tavoli | PARZIALE | Unit `useCapacityCheck`; pulsante D38 solo umano | T5 |
| D38 ON usa min(tavoli, fascia) | PARZIALE | Idem | T5 |
| Rimetti D38 OFF | — | Istruzione setup | T5 |
| Badge % posti locale | PARZIALE | Vista Giorno vs Mese divergono (`FU-SERV-BADGE-CASCATA-1`) | T13 |

### §5 Walk-in (5 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Sala e tavolo obbligatori | SCOPERTA→PARZIALE | Nessun E2E su messaggi «Seleziona sala/tavolo» | T3 + V4 |
| Walk-in tavolo libero → occupato | COPERTA | E2E walk-in `:349` | §5 |
| Walk-in tavolo occupato doppia conferma | COPERTA | E2E `:349-481` | §5 |
| Cambio sala/tavolo reset conferma | COPERTA | E2E | §5 |
| Limite walk-in morbido | PARZIALE | Unit `walkIn.b2`; messaggio a schermo umano | V5 + nota §1-bis |

### §6 Briefing (5 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Filtro fascia fasce reali + mezzanotte | COPERTA | Unit briefing | §5 (T6 verifica PDF) |
| Orari a video corretti | PARZIALE | Unit sì; fuso storico = occhi | T6 |
| Colonna Tavolo mono/multi sala | PARZIALE | Unit join; copy umano | T7 |
| PDF orari | PARZIALE | Non automatizzabile | T6 |
| PDF senza colonna Tavolo | — | Nota voluta | T6 C |

### §7 Classic (4 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Servizio assente | PARZIALE | E2E edition; regressione occhi | T14 |
| Calendario come prima | PARZIALE | E2E parziale | T14 |
| Form pubblico buono/oltre cap | PARZIALE | E2E Classic; rate limit umano | T15 |
| Console pulita | PARZIALE | E2E non guarda tutta navigazione | T14 |

### §8 Coerenza Prenota ↔ admin (4 voci)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Cambio orari fascia → form pubblico | SCOPERTA→PARZIALE | Nessun E2E admin→reload pubblico end-to-end | T2 |
| Intervallo arrivo 15/60 | PARZIALE | E2E pro-service primo test viewport; effetto pubblico umano | T16 |
| Chiudi fascia → cliente non vede | COPERTA | E2E `:283-343` | §5 |
| Prenotazione pubblica → Calendario + Servizio | SCOPERTA | Anello completo mai E2E | T1 |

### §9 Responsive (7 voci aggregate)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Servizio vista Servizio 375/834/1280 | PARZIALE | E2E modali; overflow pagina umano | T10 |
| Vista Modifica nascosta mobile | PARZIALE | Unit/layout; messaggio umano | T11 |
| Modali sala/tavolo/walk-in/briefing/assegna | COPERTA | `pro-service.spec.ts:241-352` | §5 |
| Finestra fine turno pulsanti in schermo | COPERTA | E2E `:1272-1334` | §5 |

### §10 Decisioni aperte (3 voci test)

| Voce S4 | Classe | Motivo | Destino |
|---|---|---|---|
| Soglia ritardo 15 min | — | `FU-SERV-MANOPOLE-CONSOLE-1` — nota §0, non prova | Nota |
| Buffer riassetto 10 min | OBSOLETA | Default DB **0** (mig. 057), non 10 | §6 |
| Durata walk-in / manopola console | — | `FU-SERV-MANOPOLE-CONSOLE-1` | Nota §0 |

---

## Gap vs `COLLAUDO_MANUALE_OBBLIGATORIO.md` (06-08)

| Area | 06-08 | Dopo WP1 istanza 1 | Istanza 2 |
|---|---|---|---|
| §0.3 setup dati | «assicurati di avere…» senza click | Invariato | **§0-bis** sala QA-Manuale |
| Validazione modali | Assente | E2E validazione fasce only | **§1-bis V1–V8** |
| §5 «non rifare» | 38 voci, riferimenti 06-08 | 257 Vitest + 19 E2E non riflessi | **§5 allineato WP1** |
| FU-SERV-TURNO-SALA-1 | Nota in T7 C | Debito confermato WP1 | **T7-bis** |
| Etichette UI | Parziali | — | Refresh da codice |

---

## Tabelle decisione

### INCLUSO (checklist umana aggiornata)

| ID | Titolo | Perché umano |
|---|---|---|
| §0-bis | Setup sala QA-Manuale | Nessun script seed; CRUD sala coperto da unit ma non percorso click guidato |
| V1–V8 | Validazione modali | Messaggi errore a schermo + dirty guard — E2E parziale |
| T1 | Anello pubblico → Servizio | Nessun E2E end-to-end |
| T2 | Admin modifica fascia → form pubblico | Nessun E2E reload pubblico |
| T3 | Walk-in senza sala/tavolo | Messaggi UI non in E2E |
| T4 | Capienza singolo tavolo | Solo multi in E2E |
| T5 | Interruttore D38 click reale | Unit only |
| T6 | PDF briefing | Non automatizzabile |
| T7 | Colonna Tavolo briefing | Copy umano |
| T7-bis | Elimina sala vs tavolo (turni) | `FU-SERV-TURNO-SALA-1` — verifica comportamento oggi |
| T8 | Aggiungi tavolo da riga assegnata | Apertura modale da stato già assegnato |
| T9 | Tre scelte sostituzione | Atomicità non coperta; UI critica |
| T10–T12 | Responsive / legenda | Giudizio visivo |
| T13 | Badge Calendario | `FU-SERV-BADGE-CASCATA-1` — decisione prodotto |
| T14–T16 | Classic + intervallo arrivo | Regressione + rate limit umano |

### ESCLUSO (§5 — coperto da test automatici WP1)

- Toggle Servizio/Modifica, editor mappa, Libera tavolo da piantina
- Ciclo 5 stati con clock E2E
- Fine turno completo (Libero, Ancora occupato, Decido dopo, cambio fascia)
- Tavolata multi, Annulla, turni esauriti, walk-in occupato
- Fascia chiusa → pubblico
- Delete tavolo occupato
- Modali responsive 375/834/1280 (sala, tavolo, walk-in, briefing, assegna)
- Briefing unit (fasce, join tavoli)
- D38 logica unit
- Limite walk-in unit
- Calendario Classic cache tavoli
- Form Classic E2E invio buono/oltre cap (rifare solo se T15 KO)
- **257 Vitest Servizio** + **5 createUpdate** + **19 E2E** (6+13) — dettaglio in §5 file aggiornato

### DA BUTTARE (§6)

| Voce storica | Motivo | Sostituto |
|---|---|---|
| «Libera e assegna» / conferma sostituzione singola | UI rimossa | T9 tre scelte |
| Colore piantina = colore elenco | Lista senza colori stato | — |
| Badge % sempre posti locale | Giorno vs Mese divergono | T13 decisione |
| Buffer riassetto default 10 min | DB default 0 | Nota §0.4 |
| Walk-in solo coperti senza tavolo | Ritirato 02-08 | T3 inverso |
| Ordine campi form admin/pubblico | Risolto 02-08 come allineamento logico | — |

---

## Schema blocchi (Fase 2 — input report)

| Blocco | Contenuto | Dipende da | Stima |
|---|---|---|---|
| **0** | Preparazione (`npm run dev`, account Pro, trappole §0.5) | — | 15 min |
| **0-bis** | Setup sala «QA-Manuale», 4 tavoli, 2 fasce, limite walk-in | 0 | ~20 min |
| **1** | Validazione modali V1–V8 | 0-bis | ~25 min |
| **2** | Prove T1–T9 | 0-bis + dati | ~90 min |
| **3** | Prove visive T10–T12 | 2 | ~30 min |
| **4** | T13 + T7-bis (FU turno sala) + T6–T7 briefing | 2 | ~40 min |
| **5** | Classic T14–T16 | — (account `testc@c.com`) | ~20 min |

**Totale:** ~2 h 30 base + ~45 min setup/validazione (blocchi 0-bis + 1) ≈ **3 h 15**.

---

## Controverifica campione (3 etichette)

| Checklist | Codice | Esito |
|---|---|---|
| «Modifica sala» | Pulsante `RoomTabs` → modale **Configura sala** | OK se sequenza indica entrambi |
| «Tipo di salvataggio» | Label in `ServiceSlotsManager` + menu **Sempre** | OK |
| «Briefing turno» / «Briefing pre-turno» | Home label vs modale title | OK (nota già in T6) |
