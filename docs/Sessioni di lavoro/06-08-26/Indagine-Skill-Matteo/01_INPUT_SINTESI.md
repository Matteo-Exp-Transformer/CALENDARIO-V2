# Materiale d'ingresso per le ondate di Sintesi (S1–S6)

> **Cos'è.** Le sei ondate S sono state scritte il 06-08-26 **prima** che i 39 report di mining
> esistessero. Questo file è il risultato della revisione senior fatta **dopo**, sui report veri: numeri
> misurati, trappole trovate, e gli scaffold che evitano a ogni ondata S di ripartire da zero.
>
> **Come si usa.** Ogni prompt S in [00_PROMPTS_SEQUENZA_TRACKING.md](00_PROMPTS_SEQUENZA_TRACKING.md)
> dice quale sezione di questo file leggere. Non sostituisce il metodo: la fonte di verità del metodo
> resta [PIANO_INDAGINE.md](PIANO_INDAGINE.md).
>
> **Che peso ha.** I numeri (§1, §2, §3) sono **conteggi meccanici ricontabili** sui file in `report/`:
> se il tuo conteggio diverge, vince il tuo — e segnalalo. Le liste qualitative (§4, §5, §6, §7, §8)
> sono **scaffold di partenza verificati riga per riga, ma non esaustivi**: sono un pavimento, non un
> soffitto. Non trattarle come "l'elenco completo".
>
> **Data revisione:** 06-08-26 · **Metodo:** parsing programmatico dei 39 report + verifica a campione
> aprendo i file citati.

---

## §1 — Stato reale del materiale (verificato)

| Cosa | Numero | Nota |
|------|--------|------|
| Ondate di mining eseguite | **39/39** (M1-M4, A1-A11, B1-B3, C1-C5, D1-D2, E1-E2, F1, G1-G3, H1-H5, I1-I2, J1) | + P0 e P0-EX |
| Ondate di sintesi eseguite | **0/6** | `report/S*.md` non esiste ancora |
| Righe decisione (Sezione 1) | **1.826** | somma dei `_stato/` = 1.826, **coincide** |
| Righe agency (Sezione 2) | **606** contate · **608** dichiarate | vedi §3, tre report non tornano |
| Righe skill signal (Sezione 3) | **568** | nessuna ha un ID proprio |
| Contro-evidenze (Sezione 4) | **≈352** + 8 (tabella divergenze H2) + 7 (J1 §5.b) | nessuna Sezione 4 vuota su 39 |
| Citazioni verbatim (`«…»`) | **2.802** | ripartizione in §7 |
| File `.md` aperti (linee A,B,C,D,E,F,G,I,M) | **≈1.866**, copertura dichiarata 100% | caveat obbligatori in §8 |
| Messaggi coperti (linea H) | **4.157** (1.449+871+970+634+233) | unità diversa, **mai sommare ai file** |
| Fatti (linea J) | 1.074 commit · 72 migrazioni · 32 release | J1 |
| Righe senza `Fonte` | **0 su 2.432** | verificato, non solo dichiarato |
| Collisioni di ID tra report | **0 su 2.432** | lo schema `<ID-ondata>-D01` ha retto |

**Attribuzione complessiva (Sezione 1, 1.826 righe):**

| Chi | N | | Autonomia | N |
|-----|---|---|-----------|---|
| MATTEO | 1.321 | | ORIGINATA | 797 |
| INCERTO | 204 | | SCELTA | 339 |
| CONGIUNTA | 154 | | APPROVATA | 324 |
| AGENTE | 147 | | CORRETTIVA | 221 |
| | | | DELEGATA | 112 |

**Per famiglia di linea** (serve a S1 punto 4 e a S2 punto 4):

| Famiglia | Decisioni | MATTEO | AGENTE | CONGIUNTA | INCERTO | ORIGINATA | Agency | M→A | A→M | M↔M |
|----------|-----------|--------|--------|-----------|---------|-----------|--------|-----|-----|-----|
| M (M1-M4) | 227 | 168 | 22 | 30 | 7 | 106 | 72 | 42 | 22 | 7 |
| A (A1-A11) | 683 | 576 | 28 | 32 | 47 | 278 | 235 | 155 | 56 | 23 |
| B–F | 434 | 198 | 83 | 44 | 109 | 163 | 138 | 76 | 48 | 12 |
| G (G1-G3) | 145 | 90 | 8 | 30 | 17 | 48 | 44 | 27 | 12 | 5 |
| H (H1-H5) | 259 | 259 | 0 | 0 | 0 | 183 | 88 | 66 | 13 | 9 |
| I (I1-I2) | 63 | 28 | 5 | 7 | 23 | 17 | 22 | 15 | 3 | 3 |
| J (J1) | 15 | 2 | 1 | 11 | 1 | 2 | 7 | 2 | 3 | 2 |

**Due letture obbligatorie di questa tabella, da riportare in ogni sintesi che la usa:**

1. **H ha Chi=MATTEO al 100% per costruzione.** Il perimetro H sono *solo* messaggi suoi: non è un
   segnale di autonomia più alta, è un artefatto del perimetro. Non confrontarlo con le altre linee.
2. **B–F ha il 25% di INCERTO** (109/434). Coerente: in quel materiale Matteo non è quasi mai nominato,
   le decisioni sono attribuite a «Owner»/«utente». Non è sciatteria degli agenti, è disciplina.

**Il dato più forte del corpus:** su H (peso 1, parole sue) `ORIGINATA` è 183/259 = **71%**. È l'unica
conferma di peso 1 che l'immagine «origina più che approvare» regge anche sulla fonte più diretta.

---

## §2 — Normalizzazione obbligatoria prima di aggregare

63 righe su 2.432 usano valori fuori dal vocabolario §3.1. Sono poche, ma un `GROUP BY` letterale
produce categorie fantasma e nessuna tabella di sintesi torna. **Mappa da applicare, dichiarandola:**

| Colonna | Valore trovato | N | Cosa farne |
|---------|----------------|---|------------|
| `Tipo` | `ARCHITETTURA` (G3-D30, G3-D31) | 2 | bucket esplicito «fuori schema», **non** fondere d'ufficio in PRODOTTO |
| `Tipo` | `ARCHITETTURA→ALTRO` (M2-D08) | 1 | idem; la notazione «prima→dopo» non è prevista |
| `Autonomia` | `INCERTO` (soprattutto B3 9, M3 6, C2 5) | 25 | bucket «Autonomia non determinabile» — **non** contarlo come DELEGATA |
| `Autonomia` | `—` (E1-D26, E2-D10/D14/D15/D18) | 5 | idem |
| `Autonomia` | `ORIGINATA→CORRETTIVA` (A10-D06), `DELEGATA→APPROVATA` (A10-D63) | 2 | tieni il **primo** valore + nota «evoluta in» |
| `Autonomia` | `M↔M / SCELTA` (H2-D48) | 1 | refuso: è un valore di *Direzione* finito in Sezione 1 → leggi `SCELTA` |
| `Direzione` | `A→A` (C4-A11, I1-A13, M3-A12) | 3 | **non è agency di Matteo.** Escludere dai totali M→A/A→M/M↔M e dichiararlo |
| `Direzione` | `M↔A` (A10-A15) | 1 | refuso per `M↔M` |
| `Direzione` / `Tipo prova` / `Esito` | `—` (righe sentinella tipo «Nessuna M→A in perimetro») | 6 | non sono righe: escludile e conta a parte |
| `Esito` | `rifiutata → hook`, `rifiutata (per ora)`, `accettata (costo A)`… | 16 (15 in M1) | raggruppa sotto il valore base + colonna satellite «dettaglio» |

**Incoerenza già in circolo, da sanare esplicitamente:** `A→A` è gestito in modo **opposto** da due
report — I1 lo esclude dal proprio totale dichiarato, M3 lo include. Chi eredita i sotto-totali dei
`_stato/` senza ricontare importa l'incoerenza senza accorgersene.

---

## §3 — Trappole di lettura dei report (verificate)

1. **Tabelle satellite dentro le sezioni giuste.** 15 report hanno tabelle **extra** dentro i blocchi
   `## Sezione 1` / `## Sezione 2`, con header diversi da quello canonico. La più insidiosa: la tabella
   «Follow-up CORREGGONO vs ESTENDONO» (`Relazione | Tipo | Evidenza`) presente in **9 report A su 11**
   (A2–A10), dentro il blocco Sezione 2, con celle che citano ID veri e sembrano righe di agency.
   Altre: «Rifiuti di Matteo» (`# | Cosa | Data | Fonte`) in M1 (18 righe), B1 (12), A3 (10), B3 (4);
   «Chi ha collaudato» e «Fondamenta cercate» in A1; «Decisione / Stato oggi» in G2; confronto maggio-vs-agosto in A11.
   → **Regola:** conta **solo** le righe della tabella il cui header è letteralmente
   `ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill` (Sez. 1) o
   `ID | Direzione | Tipo prova | Cosa | Esito | Fonte` (Sez. 2). Il resto si legge, non si conta.
   Le tabelle «Rifiuti» sono materiale prezioso (i rifiuti pesano doppio) ma vanno trattate a parte.

2. **Sei righe hanno un `|` non escapato dentro la Citazione** (A1-D79, C4-D09, E2-D08, I2-D20, I2-D21,
   M2-D25): uno split ingenuo produce 10-11 celle invece di 9 e disallinea `Citazione`/`Skill`. Le
   colonne 1–6 restano sempre integre.

3. **I «totale» dichiarati non sono sempre veri. Riconta sempre.**
   | Report | In tabella | Dichiarato in `_stato` | Causa |
   |--------|-----------|------------------------|-------|
   | **M1** | 38 agency | **42** (anche nel corpo del report, riga 161: «M→A 26») | **errore aritmetico reale**: M→A effettivo = 22. È il caso più grave: il report non torna sul proprio criterio di accettazione (piano §6) |
   | E2 | 6 | 5 | riga sentinella E2-A06 lasciata in tabella |
   | I1 | 13 | 12 | riga `A→A` esclusa dal totale ma non dalla tabella |

4. **Collisione di nomi.** `S4` è sia l'ondata di sintesi *Falsificazione* sia la milestone di prodotto
   *Servizio S4* (ricorre in A10, A11, M3, J1: `COLLAUDO_S4_CHECKLIST`). `M2` è sia l'ondata *Console-Skill*
   sia la milestone *Calendario M2* (A6 lo segnala da solo). `M3` è sia l'ondata *Admin/DB/Testing* sia
   la mappatura *M3 menu/magazzino*. → Scrivi sempre «S4-sintesi» / «Servizio-S4», «M2-mining» /
   «Calendario-M2». Mai un grep cieco su `S4` o `M2`.

5. **Due unità di copertura che non si sommano.** A/B/C/D/E/F/G/I/M dichiarano `N file / N aperti`;
   H1-H5 dichiarano `N M-VOCE letti`; J1 dichiara commit/migrazioni. Nella propria Sezione 5 ogni
   ondata S riporta **righe separate**, mai un totale unico.

6. **Le Sezioni 4/7 dei report non sono voce di Matteo.** Sono scritte dall'agente di mining, anche
   quando parlano «a Matteo» in seconda persona. → **Citabile come parola sua solo ciò che sta dentro
   `«…»`.** Tutto il resto è parafrasi.

7. **J1 va isolato nelle statistiche di attribuzione.** Lì `Chi=MATTEO` è convenzione da autore-commit,
   e J1 stesso avverte: «l'autore dei commit è sempre Matteo anche quando il codice l'ha scritto un
   agente». Sommarlo alla pari gonfia il conteggio delle decisioni originate.

8. **`J1 §5.b` è fuori dallo schema a 7 sezioni** (sta dopo la Sezione 5, si chiama «Divergenze report
   vs fatti»): chi legge solo lo schema canonico la salta. Contiene 7 righe di divergenza.

---

## §4 — Cluster di duplicazione già verificati (scaffold per S1)

Sedici cluster confermati aprendo il testo delle righe citate. **Sono un punto di partenza, non
l'elenco completo**: le linee B–F e B2/B3 sono state scansionate meno a fondo, è plausibile che
esistano altri 10-20 cluster minori.

| # | Tema | Righe coinvolte | Nota |
|---|------|-----------------|------|
| 1 | Limite coperti giornaliero: nasce 11-06, rimosso 18-06 | A6-D15/D16/D17 → A9-D15/D16 → M3-D31, M3-D37 | il report **non** lo chiama errore: lo chiama cambio di modello. Nessuna citazione in cui lui ammette di aver sbagliato |
| 2 | Split in 3 repository (10-06) | A5-D39 · G1-D38 (precursore 23-05) · A10-D55 · M1-D48 · J1-D02 | 5 linee diverse (A, G, M, J) |
| 3 | XOR card/carosello per modalità (26-05) | A1-D78/D81 · **H2-D25 (peso 1)** · M4-D34 | le tre fonti si confermano |
| 4 | Vocabolario, livelli di libertà 1/2/3 | M1-D02/D03/D04 (regola, senza data) · A2-D29/D30 (29-05, applicazione) | A2 aveva già segnalato il collegamento mancante |
| 5 | send-email / Brevo in produzione | A8-D04/D22/D26 · A9-D04 · M4-D60 · **H3-A19 (peso 1)** | |
| 6 | Masterplan allineamento: un WP per sessione (12-06) | A7-D01 · M4-D45 · G1-D39 · I1-D20 | cluster a 4 linee, il più trasversale |
| 7 | Nascita profilo «Verifica» / controverifica (04-06) | M1-D45 · A4-D42/D44/D45 | |
| 8 | Mandato «educare Matteo» (02-06 → 04-06) | A4-D32 (APPROVATA) · M1-D39 (ORIGINATA) | **stesso evento, autonomia diversa**: caso-tipo per la sezione «conflitti risolti» |
| 9 | M3 magazzino, limiti duri 7/12/6/6 (11-06) | A6-D01/D02/D03/D06 · M3-D21/D23 | |
| 10 | Console isolata dal repo pubblico, 3 branch | J1-D10 · A10-D55 · M2-D27/D28 | |
| 11 | Gate disambiguazione Prenota ↔ Menu QR (28-05→31-05) | A3-D09/D25/D27 · M1-D17/D27/D28 · M4-D39/D56 | 7 righe, tutte coerenti: errore ripetuto ≥3 volte → regola |
| 12 | Governance TEST/PROD («`get_project_url` → se PROD fermati») | M3-D48/D49 · G1-D27 · A2-D01 · **H2-D05 (peso 1, 22-05)** | la regola di sicurezza più ripetuta del corpus |
| 13 | Collaudo manuale 62→16 (06-08) | A11-D43 (SCELTA) · M3-D42 (CONGIUNTA/DELEGATA) | divergenza minore di autonomia: annotarla, non appiattirla |
| 14 | Modello commerciale ibrido edition + tenant_features (24-05) | A1-D34 · M1-D74 (IPOTESI) · M4-D23/D58 | |
| 15 | «Merge pubblico solo se tocca `src/`» | M1-D48 · A10-D53 · J1-D05 | è la *regola*, distinta dall'evento split (#2) |
| 16 | Blindatura: intervista obbligatoria per sezione (10-06) | M4-D42 + istanze A5-D14/D15/D22/D26, A6 (#9), M3-D35 | meta-decisione con più istanze figlie, non una riga sola |

**Metodo di dedup:** non esiste una chiave comune su cui fare join — la stessa decisione è scritta con
parole completamente diverse («Rimuovi limite coperti giornaliero» / «Niente limite giornaliero, solo
per-fascia» / «Due limiti separati e morbidi»). La deduplica è **semantica**, va fatta per tema, e ogni
riga fusa conserva **tutte** le fonti e il peso più alto.

---

## §5 — Conflitti e divergenze già verbalizzati (non riscoprirli)

Vivono **fuori** dalle Sezioni 1/2, quindi un'ondata che legge solo «le sezioni 1» o «le sezioni 2» li
perde tutti.

**a) H2, Sezione 4 — tabella «Divergenze esplicite vs A1/A2», 8 righe con verdetto già scritto:**

| Tema | A dice (peso 3) | H dice (peso 1) | Verdetto |
|------|-----------------|-----------------|----------|
| Promo vol-au-vent / DB pulito | A1: righe `INCERTO` | risposte A/B/C esplicite, «DB pulito test+prod» | **H vince** → alzare l'autonomia di A1-D09…D12 |
| Annulla layout modal 23-05 | A1-D22 | citazione più dura, stesso esito | allineati |
| Promo multi-select · Modal conflitto · Autosave footer | A2-D45/D46/D51 | quasi identiche | confermano A2 |
| Prezzo carosello D09 vs D10 | conflitto interno ad A2 | non trova la coppia | **aperto** → e resta aperto anche in H3 §6: mai chiuso da nessuno |
| Overlay card ingredienti «no→sì» | narrato come pivot 29-05 | l'overlay era già l'obiettivo dal mattino | possibile **sovra-narrazione** di A |
| Tono «l'agente ha sistemato» | A ammorbidisce | «FAI REPORT… DI MERDA», «sistemato ma NON lo è» | **H più severo** → materiale S5 |

**b) J1 §5.b — 7 divergenze report vs git.** Tre sono **conferme** (S0-S3 in PROD fermo a 062; S4 solo
su TEST; luglio 0 commit). Una è drift numerico minore (P0 diceva 1.073 commit, sono 1.074). Le due che
contano:
- «release» è usata nei report come parola generica: **0 tag su CB-v2**, le 32 release stanno solo sul
  repo PrenotaZen;
- **autore git = Matteo non prova che il codice sia suo** (+25 commit di Cristiano). Gravità alta per
  l'attribuzione di skill di codice. Attenzione: qui la regola §1 **non** si applica come «J1 batte i
  report» — né git né i report bastano da soli, serve H.

**c) M2, Sezione 4 — smentita di un'ipotesi del piano stesso.** Il prompt M2 ipotizzava una Console
«nata e abbandonata in 2 giorni». Falso: sul branch `feature/console-super-admin` risultano F1→F13 e
REQ-001…004 **accettate**. È uno sprint chiuso in accettazione, poi silenzio — non uno scope lasciato a
metà. Da correggere ovunque quell'ipotesi venga ripresa.

**d) A3, Sezione 3 — contraddizione interna a una sola fonte:** «report PROD 041 applicata vs *non
applicata* nello stesso file». Non tutte le contraddizioni sono cross-linea.

---

## §6 — Tassonomia delle skill (scaffold per S3)

**Il problema misurato:** 1.313 etichette distinte su 1.826 decisioni; **72% compaiono una volta sola**.
La colonna `Skill` non è una tassonomia, è etichettatura libera. Senza uno scaffold, S3 non è
riproducibile.

**Dieci rami, ricavati dai dati** (gli 8 suggeriti dal prompt originale reggono; due si sdoppiano):

| # | Ramo | Etichette che vi confluiscono | Volume in Sez. 3 |
|---|------|-------------------------------|------------------|
| 1 | Direzione di agenti AI / orchestrazione | `multi-agent-orchestration`, `prepara-prompt`, `m-regia`, `agent-review`, `plan-steering`, `delega` | 27 |
| 2 | Product ownership & scope | `product-scoping` (**59**, la più frequente), `product-ownership`, `scope-control`, `feature-gating` | 20 |
| 3 | Flusso utente e dati di prodotto | `booking-*`, `calendar-*`, `capacity-rules`, `walk-in`, `xor-presentation` | 15 |
| 4 | Qualità, testing e collaudo | `test-strategy`, `visual-qa`, `manual-qa*`, `owner-qa*`, `blindatura-*`, `controverifica`, `controtest*` | **61 (il più denso)** |
| 5 | Sicurezza ambienti, dati e rilascio | `env-safety*`, `release-gate*`, `migration-hygiene`, `rls-*`, `secret-hygiene`, `prod-*` | 35 (+14 security/rls/auth) |
| 6 | UX e interfaccia prodotto | `modal-pattern`, `visual-iter`, `form-validation-ux`, `responsive-*` | 39 |
| 7 | Comunicazione e vocabolario di comando | `user-language`, `plain-language`, `vocab-governance`, `command-lexicon` | 38 |
| 8 | Compliance e legale | `legal-*`, `gdpr-*`, `dpa-*`, `cookie-*`, `privacy-*` | 36 |
| 9 | Vendita e posizionamento | `go-to-market`, `pricing-*`, `edition-gating`, `positioning` | 37 |
| 10 | Auto-formazione e metodo | `didactic-system`, `lesson-of-chat`, `jit-learning`, `self-assessment` | 6 — volume basso, ma è il ramo che il prompt iniziale di Matteo chiede esplicitamente; fonte concentrata in G1/G3 |

I rami **5** e **7** sono gli split proposti: «architettura dati e ambienti» → 5; «UX e linguaggio
d'interfaccia» → 6 (interfaccia per il ristoratore) **e** 7 (come parla **agli agenti**): sono due cose
diverse e i volumi lo mostrano.

**Fuori tassonomia, da non forzare:** `brand-theme`, `dual-supabase`, `state-split` (architetturali
puri, nessuna traccia di scelta sua), `model-ladder`/`openrouter-testbed` (dominio troppo stretto).

**Sinonimi da fondere — esempi verificati:** la famiglia sicurezza-ambienti ha almeno 27 varianti
(`env-safety`, `env-safety-prod`, `env-parity`, `env-wiring`, `env-isolation`, `prod-gate`,
`prod-hardening`, `dev-prod-split`, `db-ops`, `release-safety`…); la famiglia testing almeno 23
(`test-strategy`, `manual-qa`, `owner-qa-gate`, `qa-human-checklist`, `blindatura-controtest`,
`controtest-rompi`, `collaudo-triade`…).

**Formato Sezione 3, com'è davvero:** tabella in 39/39 report, **nessuna con colonna ID propria**;
4 colonne in 37 report, 5 in M1 e M4; l'intestazione della colonna 1 è `Skill` in 30 report,
`Etichetta` in 5, `Skill + Livello` in 4; la colonna evidenza si chiama in 6 modi diversi. Tutte
citano comunque ID `D`/`A` come prova. → normalizzare a `{skill, livello, evidenza_ID, contro_evidenza}`
prima di unire.

---

## §7 — Livelli, contro-evidenze, citazioni

**Livelli già assegnati:** tutti e 39 i report hanno livelli provvisori in Sezione 3 — **175 menzioni di
L3, 81 di L4** su 568 righe. Molte sono ibride (`L2–L3`, `L3→L4`, `L4 cand.`, `L4?`): **vanno trattate
come non-L4-piene** finché il cross-check non è stato davvero eseguito.

**Sei report legacy dichiarano zero L3/L4 attribuibili a Matteo** (C1, C2, C3, C4, C5, B2). Non è una
lacuna: è disciplina corretta dove l'attribuzione è debole.

**Righe L3/L4 senza contro-evidenza (violano la regola dura §3.4) — input diretto per S4-sintesi:**

| Report | Etichetta | Livello |
|--------|-----------|---------|
| H1 | `agent-review` / `prompt-orchestration` | L3 |
| H2 | `form-validation-ux` | L3 |
| H3 | `edition-gating` | L3 |
| M1 | copy verbatim / delta minimo | L3 |
| M1 | privacy `docs/_lavoro` | L4 |
| M3 | `edition-shell` Classic/Pro | L3 |
| M4 | prepara-prompt / comunicazione | L4 |
| M4 | cookie no-banner | L3 |
| (B1) | `human-verify`, `anti-bureaucracy` | L3 — **ma** B1 ha una dichiarazione collettiva *dopo* la tabella: verificare se basta |

→ Attenzione: prima di dichiarare una riga «senza contro-evidenza», leggi anche il testo **subito dopo**
la tabella (B1 insegna).

**Bias strutturale da dichiarare, non da nascondere:** M1 e M4 producono **23 delle ~50 L4 «piene»** del
corpus. Causa: leggono documentazione di skill già scritta, quindi la prova di «è diventata regola» **è**
il file stesso — circolarità. M3 lo fa già bene, distinguendo «L1–L2 su Matteo / L4 di sistema». S3 e S4
devono separare **L4 di sistema** da **L4 di persona**.

**Tripla colonna DICHIARATA | ESERCITATA | PARLATA:** esiste solo in **9 report su 39** (A2–A10), e in
tutte e 9 la colonna PARLATA è un **placeholder mai risolto** («da verificare in H2/H3»). Motivo
verificabile dai timestamp: le ondate A sono state scritte fra le 18:54 e le 19:12, le H fra le 21:09 e
le 22:35 dello stesso giorno — quando A2-A10 scrivevano, H non esisteva. **Oggi H esiste: la colonna va
compilata da zero, non ricopiata.**

**Rami dove una colonna resterà vuota (dichiararlo, non riempirlo a forza):** compliance/legale →
PARLATA quasi assente; vendita → DICHIARATA debole; sicurezza ambienti → DICHIARATA quasi assente (non
c'è una riga in cui dice «voglio imparare questo»), ma ESERCITATA e PARLATA fortissime.

**Citazioni disponibili (`«…»`), 2.802 totali:**

| Gruppo | Peso | N | Cosa danno |
|--------|------|---|-----------|
| H1–H5 | **1** | 408 | densità e distribuzione: quante volte, quanto lunghe, quando |
| A1–A11 | 3 | 929 | contesto e climax: la frase scelta perché il momento contava |
| B/C/D/E/F/I/J | 2–3 | 906 | |
| M1–M4 | 3–4 | 358 | |
| G1–G3 | 3 (G1/PROFILO: 1 e 4) | 201 | |

Nota di peso: **G3 è scritto in prima persona ma resta peso 3.** Solo `PROFILO_SCOLASTICO` (G1) ha la
deroga del piano §2. Chi scrive S5 non deve sovra-pesare l'asse «come vuole che gli si parli» solo
perché il testo dice «Io, Matteo…».

---

## §8 — Timeline, frecce di trasferimento, copertura, privato/pubblico

**Sequenza corretta** (il prompt S3 originale conteneva quella già smentita dal piano §2.2):
giochi + CB-old (feb-mar) → **CB-v2 dal 27-04** → trading **in parallelo** (mag-giu) → BHM e
Trading-Platform (lug) → ritorno a CB-v2 (ago). Il buco 22-06 → 02-08 **non è una pausa: è un cambio di
progetto.**

| Data | Evento | Fonte |
|------|--------|-------|
| 21-02-26 | pratiche di metodo già presenti su CB-old (cross-check tra agenti, opzioni A/B/C, branch test≠main) | H4 |
| 24-02-26 | **`controverifica` nasce già come parola-comando + regola scritta**: L4 a febbraio | H4 («aggiungi al file di skills di controverificare con screen») |
| 27-04-26 | nasce CB-v2 (primo commit `0a0758b`) | J1-D01, H1 |
| 29-05-26 | nasce `lavoro ok` | H2 + P0-EX (allineati) |
| 01-06-26 | `lavoro ok`/`prepara`/`fai report`/`controverifica` diventano ritmo di chiusura dominante | H3 |
| 04-06-26 | nascono `senior` e `blindatura`; parte la scuola/didattica | H3 + G1-D01 |
| 10-06-26 | split 3 repo, prima release pubblica PrenotaZen | J1-D02, A5 |
| 20-05 → 06-06 | Trade-Analyst **in parallelo** al picco CB-v2 | H5 |
| 22/23-06-26 | ultimo merge `env/test`→`main`, ultima release | J1-D05/D06 |
| 03-07 → 09-07-26 | «buco» CB-v2 = 0 commit, ma Trading-Platform e BHM attivi | J1 + H5 |
| 02-08-26 | ripresa CB-v2 (capitolo Servizio) | J1 + A11 |

⚠️ Le date delle linee B/C (HACCP legacy) **non sono affidabili dal filesystem**: gran parte di
`docs/Archives/` ha mtime identico (05-02-26, copia in blocco). Valgono solo le date scritte nei testi.

**Frecce di trasferimento — dove stanno davvero** (non dove il piano le supponeva):

| Fonte | Forma | Freccia |
|-------|-------|---------|
| **B1** (riga ~147) | sezione dedicata | CB-v2 → `_skill-system-v0` → BHM-Zen (lug): «lo skill-system non nasce, viene installato» |
| **F1** (riga ~118) | sezione dedicata | CB → FREEDOM Trading (30-06/05-07): scaffold copiato, vocabolario alleggerito, compliance appesantita |
| **M1** (riga ~255) | sezione dedicata | `_skill-system-v0` → skill system attuale, file per file (interna) |
| **H5** (righe ~197/205) | prosa, non tabella | CB-v2 → Trade-Analyst / Trading-Platform / BHM. **Unica fonte sul buco 22-06→02-08** |
| E1/E2 | colonna in tabella | Trade-Analyst ≈ CB (`cb-method-transfer`) |
| C3, C5 | **solo note sparse, nessuna sezione dedicata** | non cercare un'intestazione che non c'è |

**Copertura reale — la frase onesta da usare in S6.** Non «100% del corpus letto riga per riga», ma:
«100% dei file `.md` del perimetro **aperti**; profondità variabile per regime (scavo/rastrello);
alcuni documenti enormi letti per sezione mirata; alcuni file mai aperti per scelta esplicita». I casi
concreti da citare:
- **G3**: 3 path con nome `creds`/`.env` **non aperti per sensibilità** (unico caso dichiarato di salto
  per sicurezza) + 105 file non-md in `e2e-s4/` non aperti (output macchina);
- **C2 (246), C4 (258), F1 (187)** file non-md contati ma non estratti — fuori perimetro per costruzione;
- **B1, B2**: documenti da 1+ MB letti per sezioni mirate, non integralmente (dichiarato);
- **C1, D1**: alcuni file vuoti/placeholder, aperti e dichiarati.

**Discrepanza aperta sul dato di peso 1 — da riportare, non da nascondere:** P0-EX conta **3.412**
M-VOCE; la somma dei M-VOCE dichiarati letti nelle Sezioni 5 di H1-H5 è **3.321**
(1.032+723+768+593+205). Differenza **91**. Parte è spiegabile (H2 dichiara 732 di perimetro e 723
leggibili; H3 780 e 768), il resto no. Nessun report la segnala. Va riconciliata o dichiarata.

**Privato vs pubblico — `git ls-files docs/_lavoro` = 77 file** (verificato oggi, coincide con P0):

| Cartella | Tracciati / totale |
|----------|--------------------|
| `Sessioni/` · `Storico/` · `Supporto/` | 56/56 · 8/8 · 3/3 — **interamente su git** |
| `Per matteo/` | **10/51** — l'88% resta privato |
| `Per matteo/Scuola/` | **0/6** — davvero privata |
| `e2e-s4/`, `Indagine-Corpus/` | 0 — fuori git per costruzione |

Lettura per S6: dei 77 file pubblici, **67 (87%) sono log tecnici di sessione**, non materiale
personale. Il dossier che finisce su GitHub non contiene la parte più intima (Scuola, prezzo, gran
parte dei documenti legali).

---

## §9 — Handoff già scritti dalle ondate di mining (raccolti dalle Sezioni 6)

Se una di queste richieste non finisce nell'ondata S di destinazione, il lavoro già fatto va perso.

**→ S1:** dedup decisioni SESSION/FORM già in C2 (da C4) · parametri Owner login C5↔C1 (D19-D21) ·
decisioni prodotto maggio citate in G3 §5 ma non ri-estratte (XOR, tenant_features, striscia).

**→ S2:** peer-review densa di C1 (falsi positivi, scope creep, deploy bugiardo) · confronto
peer-review anti-falso-positivo (C1, A2→A5) contro la «cerimonia LOCKED» di C4 · da J1: perché `main`
non ha mai ricevuto il capitolo Servizio-S4 (scelta esplicita o mai chiesto?).

**→ S3:** disambiguare Calendario-M2 vs M2-mining (A6) · confronto Matteo maggio vs Matteo
rilascio/compliance (A9) · incrociare frecce skill-system CB↔BHM (B1) · «punto zero»: il metodo nasce
come 7 agenti + gate, non come skill system (C1) · «critical verification» gennaio → CONTROVERIFICA
attuale? (C2) · confronto numerico 62→16 con le checklist vecchie (C4) · sopravvivenza di
«ragioniamo»/ERRORI_PROCESSO (C5) · evoluzione 6 skills → Agente_* → 4 core → skill d'area (C5) ·
decisioni maggio sopravvissute vs skill attuali (G2) · quando `Metodo_spiegazioni` è confluito nel
vocabolario (G3) · tabella «albero skill + frecce v0» già pronta in M1 · freccia CB→Trade→Trading→BHM
(H5, risultato centrale di quell'ondata).

**→ S4-sintesi (la più alimentata):** falsificare L3 `didactic`/`hands-on-qa` (G1) · preferenza B
(storage) vs esito A adottato (G2) · cambio tema indaco→crema, quando e perché (G3) · **l'intera
tabella divergenze di H2** · Qwen-Test quasi vuoto: non usarlo per rivendicare model-eval (H4, I2) ·
catalogo piani abbandonati veri vs todo stale (I1 §4.1: solo **23 completed su 113**, ≥45 con ≥3 todo
pending) · catalogo piani GAME (I2: **28 su 33** senza tracking; CTRL+Z con perdita reale di lavoro) ·
«Condividimi» esiste fuori dal corpus? (I2) · data «28 Dicembre 2024» sul PRD: reale o placeholder? ·
divergenze e drift numerico di J1 · tabella «contro-evidenze L3/L4» già pronta in M1 · acceptance
firmata da Cristiano «nei panni di Matteo» ≠ test suo (M2).

**→ S5:** le checklist Blindatura private sono più severe della Testing-Skill ufficiale? (G1) · cluster
auto-dichiarazione vs QA esercitata (G1) · G1 privato vs G2 log, stessi temi mesi diversi ·
`Metodo_spiegazioni` (G3-D01…D09) è **la fonte più forte del corpus** su «come vuole che gli si parli»,
da citare per esteso · overlap Scuola/Metodo (G3) · MathBoy2 «Tommaso»: collaborazione con un pari
umano, non solo con AI (H4) · freccia di trasferimento del metodo (H5).

**→ S6:** nessun handoff diretto dai 39 report (atteso: S6 sintetizza le S, non i mining). L'unico
riferimento è in P0 §7, la nota privato/pubblico ripresa in §8 qui sopra.

**Non esiste, in nessuno dei 39 report, una domanda pre-formulata per l'interrogazione senior**
(verificato con grep mirato). La banca domande di S6 va costruita **da zero**.
