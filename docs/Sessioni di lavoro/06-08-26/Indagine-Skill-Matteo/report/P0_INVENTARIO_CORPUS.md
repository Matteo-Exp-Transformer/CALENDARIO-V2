# P0 — Inventario e verifica conteggi A–J

**Ondata:** P0 (fondamenta) · **Data:** 06-08-26 · **Regime:** verifica + indicizzazione, sola lettura
**Leggi prima:** [PIANO_INDAGINE.md](../PIANO_INDAGINE.md) (tutto)

> Obiettivo di questa ondata: verificare che i perimetri del piano §4 corrispondano al disco, produrre
> la lista file di ogni ondata successiva, e segnalare ogni scostamento. Regola del piano: **quando
> disco e piano non coincidono, si corregge il piano, non il conteggio misurato.**

---

## 0. Le 3 scoperte principali (leggi prima di tutto)

1. **Manca un'intera linea di corpus dal piano.** Sotto `docs/` esistono **12 cartelle
   "\*-Skill" + 15 file sciolti in root** — il sistema di skill d'area **attuale e vivo** di
   CalendarBackup-v2 (Admin, Console, Database, Legal, Marketing, Menu-QR, Prenota, Servizio,
   Testing, UI-design…) — **147 file .md**, tracciati in git, mai menzionati nel piano. Il piano
   copre solo la vecchia meta-cartella (`Comunicazione-Skill`, 13 file) come se fosse tutto quello che
   esiste. Vedi §3.
2. **Dentro questa linea c'è un intero prodotto non censito**: `docs/Console-Skill/` (46 file), un
   pannello super-admin per gestire i tenant clienti, con tanto di branch dedicato
   `feature/console-super-admin` ancora attivo. Non è materiale vecchio: l'ultimo commit su questa
   cartella è recente quanto gli altri.
3. **`docs/Archives/` (958 md, linee B–F) non è mai stato su git.** `git ls-files` restituisce 0 file.
   Significa che per queste linee **non esiste una data di commit**: la timeline (§6) deve appoggiarsi
   a nomi di cartella e, dove non ci sono, a date del filesystem — che per buona parte di questo
   materiale sono **tutte identiche (05-02-26)**, cioè la data in cui qualcuno ha copiato in blocco le
   cartelle, non la data in cui Matteo ha lavorato. Vedi §6.

Il resto del documento è la verifica ondata per ondata.

---

## 1. Conteggi per linea — piano §2 vs disco (misurato 06-08-26)

| Linea | Piano §2 | Disco (misurato) | Esito |
|-------|----------|-------------------|-------|
| **A** | 461 md | **458 md** nelle 11 ondate dichiarate (+ 1 `README.md` non assegnato in root `Sessioni di lavoro/`, + 6 md del cantiere `Indagine-Skill-Matteo/` che non sono materiale d'indagine) | Scostamento **-3**: il piano stesso ha un'incongruenza interna — la somma delle sue 11 righe A1–A11 (§4) fa già 458, non 461. Ogni singola ondata A1–A11 invece **coincide esattamente** col disco (vedi §2). Correggere §2 da 461 a 458. |
| **M** | ~16 md | **36 md** nel solo perimetro originale (13 Comunicazione-Skill + 1 CONTESTO_PRODOTTO + 21 `_skill-system-v0/` + 1 APP_CONTEXT_SKILL) — **+147 md non contati altrove** (vedi scoperta #1) | Scostamento grave: il piano non aveva mai contato `_skill-system-v0/` (21 file) né le 12 cartelle skill attuali. Perimetro reale della "linea M" ≈ **183 md**, non 16. |
| **B** | 228 md (42+42+3+138+3) | **228 md** — esatto | Nessuno scostamento |
| **C** | 385 md | **386 md** (67+89+85+105+40) | Scostamento +1: dipende da `docs/Archives/2025-10-21`, che **non è una cartella ma un file** senza estensione (10 KB, contenuto markdown) — il piano lo trattava implicitamente come cartella vuota o lo escludeva. Va incluso nel perimetro di C5 (vedi §2). |
| **D** | 132 md (86+26+20) | **132 md** — esatto | Nessuno scostamento |
| **E** | 128 md (97+30+1) | **128 md** — esatto | Nessuno scostamento |
| **F** | 85 md (84+1) | **85 md** — esatto | Nessuno scostamento |
| **G** | 119 md (56+51+8+3+2) | **120 md** (56+51+8+3+2) | Il piano somma male i suoi stessi numeri (56+51+8+3+2 = **120**, non 119): refuso di addizione, non uno scostamento reale. Ogni singola ondata G1/G2/G3 coincide col disco. C'è anche una cartella in più, `docs/_lavoro/Indagine-Corpus/` (11 file, il corpus generato da P0-EX): **non fa parte del perimetro G**, è materiale di lavoro di questo stesso cantiere. |
| **H** | corretto da P0-EX: 576 chat, 4.157 messaggi (vedi piano §2.2) | **Confermato**: tutti i 10 file `.jsonl` attesi da H1–H5 esistono in `docs/_lavoro/Indagine-Corpus/` | Nessuno scostamento residuo — il piano ha già la cifra giusta (P0-EX l'ha corretta il 06-08-26 stesso). |
| **I** | 146 file (144 `.cursor/plans` + 2 `.claude/plans`) | **146 file** — esatto nel totale, ma la spartizione I1(~90)/I2(~56) del piano **non regge** al contenuto reale: vedi §5 | Totale corretto, split da correggere |
| **J** | — (nessun conteggio file, sono fatti git) | Vedi §7 | — |

---

## 2. Linea A — verifica per ondata e lista file

Perimetro di ogni ondata = tutti i `.md` nelle cartelle data indicate (nessun file aperto, solo
conteggio: la lettura spetta alle ondate A1–A11 stesse). Tutte le 11 ondate **coincidono esattamente**
col numero dichiarato nel piano:

| Ondata | Cartelle | Dichiarato | Misurato | Esito |
|--------|----------|------------|----------|-------|
| A1 | 23-05, 24-05, 25-05, 26-05 | 42 | 10+8+12+12=42 | ✅ |
| A2 | 27-05, 28-05, 29-05 | 51 | 9+14+28=51 | ✅ |
| A3 | 30-05, 31-05, 01-06 | 46 | 10+15+21=46 | ✅ |
| A4 | 02-06, 03-06, 04-06, 05-06 | 40 | 12+8+9+11=40 | ✅ |
| A5 | 06-06, 07-06, 10-06 | 38 | 11+11+16=38 | ✅ |
| A6 | 11-06, 13-06 | 29 | 25+4=29 | ✅ |
| A7 | 12-06 | 63 | 63 | ✅ |
| A8 | 15-06, 16-06 | 41 | 29+12=41 | ✅ |
| A9 | 17-06, 18-06, 19-06 | 32 | 9+10+13=32 | ✅ |
| A10 | 20-06, 21-06, 22-06, 23-06, 24-06 | 36 | 8+10+3+11+4=36 | ✅ |
| A11 | 02-08, 03-08, 04-08, 05-08, 06-08 (solo i 5 md diretti, **esclusa** `Indagine-Skill-Matteo/`) | 40 | 20+7+2+6+5=40 | ✅ |

Nota per chi eseguirà A11: la cartella `06-08-26/` contiene anche `Indagine-Skill-Matteo/` (questo
cantiere, 6 md + 1 script) — **non va letta**, il piano lo dice già esplicitamente.

C'è anche un `README.md` **direttamente in `docs/Sessioni di lavoro/`** (fuori da ogni cartella data):
è un indice, non un report di sessione — non assegnato a nessuna ondata, corretto così.

**Verifica schema Q1** (sezione "Domande di chiusura" nei report): misurate **220 su 459** file `.md`
di linea A (esclusa `Indagine-Skill-Matteo/`) contengono la stringa "Domande di chiusura". Il piano
dichiarava 223/461: scostamento minimo (-3), compatibile con la piccola differenza di conteggio già
segnalata sopra. Il segnale resta valido: quasi la metà dei report ha la sezione Q1.

---

## 3. Linea M — perimetro reale (da correggere nel piano)

### 3.1 — Perimetro originale del piano, verificato

| Cartella/file | Dichiarato | Misurato |
|---|---|---|
| `docs/Comunicazione-Skill/` | 13 | **13** ✅ (ARCHIVIO_DECISIONI, ARCHIVIO_OSSERVAZIONI, CHIUSURA_SESSIONE, COMANDI_AVVIO, CONTROVERIFICA, ERRORI_PROCESSO, EVOLUZIONE_SKILLS, OSSERVAZIONI, PROPOSTE, PROSEGUIMENTO_MAPPATURA_SKILL, REVISIONE, VOCABOLARIO, ANALISI_REVISIONE_SENIOR_PRENOTA_POST_BLINDATURA) |
| `docs/Archivio/CONTESTO_PRODOTTO.md` | 1 | **1** ✅ |
| `docs/APP_CONTEXT_SKILL.md` (solo §0) | 1 | **1** ✅ (file esiste, è in root `docs/`, non in `Archivio/`) |
| `_skill-system-v0/` | **non contato** | **21** — cartella predecessore del sistema attuale, mai censita dal piano |

**Perimetro M1 corretto: 36 file**, non ~16.

### 3.2 — La parte mancante: le skill d'area attuali (scoperta #1)

Sotto `docs/` esistono, allo stesso livello di `Comunicazione-Skill/`, altre **12 cartelle** che sono
gli **skill-system per area di prodotto** attualmente in uso (gli stessi che instradano gli agenti oggi
— coincidono con le skill elencate nel catalogo di sistema di questa sessione: Admin, Prenota, Menu QR,
Database, Testing, Marketing, Legal…). Nessuna è nel piano:

| Cartella | File .md | Contenuto (a colpo d'occhio dai nomi file) |
|---|---|---|
| `docs/Console-Skill/` | **46** | Pannello super-admin gestione tenant: masterplan, RLS, allowlist, sandbox DB, decision log, richieste F1-F7 |
| `docs/Admin-Skill/` | 18 | Area amministrativa (AdminShell, sidebar, dashboard) |
| `docs/Prenota-Skill/` | 7 | Pagina pubblica prenotazione |
| `docs/Menu-QR-Skill/` | 7 | Menu QR pubblico |
| `docs/Database-Skill/` | 5 | Schema, migrazioni, RLS |
| `docs/Testing-Skill/` | 10 | Strategia test, e2e, blindatura |
| `docs/Legal-Production-Skill/` | 11 | GDPR, DPA, produzione commerciale |
| `docs/legal/` | 4 | Documenti legali |
| `docs/Marketing-Skill/` | 5 | Edition, pricing, add-on |
| `docs/Dashboard-laterale-skill/` | 3 | Sidebar/dashboard laterale |
| `docs/Servizio-Config/` | 5 | Capitolo "Servizio" (configurazione operativa) |
| `docs/per-ui-design-skill/` | 12 | Linee guida UI/UX |
| **File sciolti in root `docs/`** | 15 | `ADMIN_CLASSIC_SKILL.md`, `APP_CONTEXT_SKILL.md` (già contato), `COMUNICAZIONE_UTENTE_SKILL.md`, `DATA_FLOW_SKILL.md`, `DATABASE.md`, `FOLLOW_UP.md`, `GUIDA_USO_QUERIES_CONTROVERIFICA.md`, `MASTERPLAN_ALLINEAMENTO.md`, `MASTERPLAN_BLINDATURA.md`, `MASTERPLAN_SERVIZIO.md`, `Plan-Completamento.md`, `PREPARA_PROMPT_SKILL.md`, `PWA_CONTEXT.md`, `SESSION_LOG.md`, `STATO_BLINDATURA_CHECKLIST.md` |

**Totale non censito: 147 file** (18+46+3+5+4+11+5+7+12+7+5+10+15, `docs/Archivio/` già contato altrove).

**Perché conta più di quanto sembri**: per la scala L0–L4 del piano (§3.4), un file di skill d'area **è
esattamente la prova di livello L4** ("la sua decisione è diventata regola riusata"). Questo materiale
non è un dettaglio: è probabilmente la **fonte più diretta di decisioni codificate** in tutto il corpus,
più delle sessioni stesse — perché è la versione già distillata e mantenuta nel tempo.

**Git**: tutte tracciate (verificato `git log` su ognuna); `Console-Skill` esiste anche sul branch
dedicato `feature/console-super-admin`, ancora attivo.

### 3.3 — Proposta di correzione al piano (da confermare con Matteo prima di eseguire)

Non ho aggiunto ondate al file dei prompt (00_PROMPTS) né toccato il piano: serve una decisione di
Matteo, dato che cambia il conteggio totale delle ondate. Propongo, se si vuole procedere:

- **M1** (invariata nel nome, corretta nel perimetro): `Comunicazione-Skill` (13) + `CONTESTO_PRODOTTO`
  (1) + `_skill-system-v0/` (21) + `APP_CONTEXT_SKILL.md` (1) = **36 file**.
- **M2 — nuova**: `Console-Skill/` da sola = **46 file** (un prodotto intero, coerente come ondata a sé).
- **M3 — nuova**: `Admin-Skill` + `Dashboard-laterale-skill` + `Servizio-Config` + `Database-Skill` +
  `Testing-Skill` = 18+3+5+5+10 = **41 file**.
- **M4 — nuova**: `Legal-Production-Skill` + `legal` + `Marketing-Skill` + `per-ui-design-skill` +
  `Prenota-Skill` + `Menu-QR-Skill` + 14 file sciolti in root `docs/` (esclude APP_CONTEXT_SKILL.md già
  in M1) = 11+4+5+12+7+7+14 = **60 file**.

Totale nuove ondate: 3 (M2, M3, M4), +147 file, dimensione paragonabile alle ondate A (30-60 file).

---

## 4. Linea B — verifica e split B2/B3

Perimetro confermato esatto (228 = 42 meta + 42 skill-system + 3 guide + 138 app-definition + 3 root).

**Split B2/B3** (`app-definition/`, 138 file): il piano chiede "prima/seconda metà alfabetica" ma i
nomi file si ripetono fra sottocartelle diverse (es. più `README.md`), quindi l'ordinamento va fatto
sul **percorso relativo completo**, non sul nome nudo. Struttura reale della cartella:

| Sottocartella | File |
|---|---|
| `01_AUTH/` | 5 |
| `03_CONSERVATION/` | 106 (il grosso del volume) |
| `04_CALENDAR/` | 21 |
| `07_COMPONENTS/` | 1 |
| root di `app-definition/` | 5 |

Ordinando tutti i 138 percorsi relativi alfabeticamente, il taglio esatto 69/69 cade dentro
`03_CONSERVATION/Lavoro/Gennaio-2026/15-01-2026/`:

- **B2** = i primi 69 percorsi in ordine alfabetico, **fino e incluso**
  `03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\REVISIONE_LAVORO_AGENTI.md`
- **B3** = i restanti 69, **a partire da**
  `03_CONSERVATION\Lavoro\Gennaio-2026\15-01-2026\SOLUZIONE_ERRORE_EXPORT.md`

Usando questo punto di taglio, B2+B3 = 138 senza sovrapposizioni né buchi (verificato).

---

## 5. Linea C — verifica e correzione perimetro C5

| Ondata | Perimetro | Dichiarato | Misurato | Esito |
|---|---|---|---|---|
| C1 | `Sessions_Old/` | 67 | 67 | ✅ |
| C2 | `2026-01-cleanup/` | 89 | 89 | ✅ |
| C3 | `knowledge-legacy/` (60) + `Knowledge/` (25) | 85 | 85 | ✅ |
| C4 | `Tests/` (58) + `Info_Complete/` (47) | 105 | 105 | ✅ |
| C5 | `cursor-rules-cleanup-2026-01/` (24) + `References/` (5) + `2025-10-20/` (5) + `2025-10-21` (?) + `Reports/` (3) + `Archive/` (1) + `LEZIONI_APPRESE_AGENTE_1.md` (1) | ~40 | **40** | ✅ ma con una correzione: |

**Correzione necessaria per C5**: `docs/Archives/2025-10-21` **non è una cartella**, è un **file senza
estensione** (10 KB) che inizia con `# TRACKING MODIFICHE POST-TEST` — è comunque un documento di testo
leggibile, va incluso nel perimetro C5 come file singolo, non aperto come cartella. Con questa
correzione C5 = 24+5+5+**1**+3+1+1 = **40**, il numero del piano torna esatto.

---

## 6. Linee D, E, F — verifica

Tutte e tre coincidono esattamente col piano, nessuna correzione:

- **D**: `Calendarbackup-oldversion/{docs (86), Lavoro (26), Sessioni di lavoro (20)}` = **132** ✅
- **E**: `trading agent analyst-v.0/{docs (97), reports (30), root (1: SKILL-0.md)}` = **128** ✅
- **F**: `Trading agent analysy/` = **85** (84 in `docs/` + 1 `CLAUDE.md` in root) ✅

---

## 7. Linea G — verifica, refuso di somma, e `git ls-files`

| Ondata | Perimetro | Dichiarato | Misurato | Esito |
|---|---|---|---|---|
| G1 | `Per matteo/` | 51 | 51 | ✅ — lista completa verificata (Scuola 6, Test e2e 8, Comandi 5, Analisi Fable 5, Documenti Legali 3, Valutazione prezzo 2, Upgrade-da-Fare 2, Verifica Blindatura ×3 = 12, guide sciolte in root 8) |
| G2 | `Sessioni/` | 56 | 56 | ✅ — confermato il refuso di cartella: esiste sia `19-05-25/` sia `19-05-26/` (probabile anno sbagliato nel nome, da dichiarare non correggere) |
| G3 | `Storico/` (8) + `Supporto/` (3) + `e2e-s4/` (2 md, 107 file totali) | 13 | 13 | ✅ |

**Totale G**: 51+56+8+3+2 = **120**, non 119 come scritto nel piano (§2): è un refuso di addizione nel
piano stesso (i 5 numeri elencati sommano correttamente a 120), non uno scostamento reale col disco.

**`git ls-files docs/_lavoro`**: **77 file tracciati**, esattamente come dichiarato dal piano.
Composizione verificata:
- `Sessioni/` → **56/56 tracciati** (tutta la cartella)
- `Storico/` → **8/8 tracciati** (tutta la cartella)
- `Supporto/` → **3/3 tracciati** (tutta la cartella)
- `Per matteo/` → **10/51 tracciati**: `Cose-da-fare-per-produzione.md`, 2 file in `Documenti Legali/`,
  `GUIDA-TEST-SISTEMA.md`, `GUIDA-repo-pulito-pubblico.md`, `GUIDA_USO_QUERIES_CONTROVERIFICA.md`,
  `PROMPT-sfondo-pagina-prenota-full-page.md`, 2 file in `Upgrade-da-Fare/`, 1 file in `Valutazione
  prezzo vendita/`
- `Per matteo/Scuola/` → **0/6 tracciati** — confermato: è davvero privata, non su GitHub
- `e2e-s4/`, `Indagine-Corpus/` → **0 tracciati** (artefatti generati, correttamente fuori git)

Nota non richiesta ma utile per S6 §9 (privato vs pubblico): **56+8+3 = 67 file su 77** vengono da
`Sessioni/` + `Storico/` + `Supporto/` — cioè quasi tutto ciò che finisce su GitHub da `_lavoro` sono
i log di sessione tecnici, non le riflessioni personali. `Per matteo/` è per l'88% privata (41/51).

---

## 8. Linea H — verifica contro P0-EX

Confermato che tutti i 10 corpus `.jsonl` attesi dalle ondate H1–H5 esistono in
`docs/_lavoro/Indagine-Corpus/`: `CB-v2` (5,8 MB), `CB-old` + `CB-old-wt`, `MathBoy2`, `Game`,
`Qwen-Test`, `Trade-Analyst`, `Trading-Platform`, `BHM-v2`, `BHM-Zen`. Nessuno scostamento: la cifra
del piano (già corretta da P0-EX il 06-08-26) regge.

---

## 9. Linea I — assegnazione progetto e proposta di split reale

Ho aperto le prime ~40 righe di ognuno dei 144 file in `.cursor/plans` (frontmatter + inizio del
contenuto, dove il piano di Cursor mette nome e overview) e classificato per parole chiave di dominio.
I 2 file di `.claude/plans` sono entrambi CB (`fix-sostituzione-tavolo-occupato`,
`prepara-plan-di-allineamento-scalable-parnas`) e vanno con I1.

**Risultato: lo split I1(~90)/I2(~56) del piano non regge.** La distribuzione reale è molto più
sbilanciata verso prenotazioni/HACCP:

| Categoria | File | Nota |
|---|---|---|
| CalendarBackup (prenotazioni/admin/calendario) | 52 + 2 (`.claude`) | |
| HACCP/BHM (conservazione, temperature, onboarding) | 39 | |
| Ambigui, toccano entrambi i domini | 19 | plan che modificano componenti condivisi tra le due app |
| **Totale "prenotazioni/HACCP"** | **112** | vs ~90 previsti dal piano |
| Giochi (MathBoy2/Game: wave, boss, survivor, card) | 26 | |
| Trading (Trade-Analyst, tutor/vision benchmark) | 3 | incluso 1 puro + 2 riclassificati da un tag ambiguo |
| Non classificabile per dominio | 4 | vedi sotto |
| **Totale "giochi/trading/altro"** | **33** | vs ~56 previsti dal piano |

I 4 file non classificabili per dominio, aperti singolarmente e assegnati a mano:

- `aggiungere_nome_utente_ai_log_attività_5c79984b.plan.md` → **HACCP-BHM** (audit log, stile BHM)
- `fix_calendar_settings_table_missing_bafd08ef.plan.md` → **CB** (tabella Supabase calendario)
- `console_demo_2_branch_0878c905.plan.md` → **CB** (demo vendita della Console admin, non trading)
- `prompt_tutor_benchmark_7d153a96.plan.md` → **Trading** (tutor OpenRouter per prodotto di trading/educazione)
- `redesign-prechat-tutor-vision-split.plan.md` → **Trading** (esplicitamente "Aware Trader" nel testo)
- `prd_condividimi_7cae5986.plan.md` → **ALTRO** — mini-progetto isolato, PRD di una feature di
  condivisione mai vista altrove nel corpus, senza follow-up rintracciabile
- `sessione_test_modelli_71726696.plan.md` → **ALTRO** — valutazione di modelli AI locali/OpenRouter,
  probabilmente lo stesso filone di `Qwen-Test` (H4/H5)

**Proposta**: dato lo sbilanciamento (112 vs 33), tenere **I1 unico** con le sole "prenotazioni/HACCP"
(112, regime rastrello — dimensione comparabile a C4 che ne ha 105) e **I2** con "giochi/trading/altro"
(33, più leggero del previsto). In alternativa, per bilanciare meglio: **I1a = CB** (54, incl. i 2
ambigui riassegnati) e **I1b = HACCP-BHM + i 19 ambigui rimasti** (58). Lascio la scelta a chi esegue
I1/I2, la lista è comunque pronta in entrambi i casi (disponibile per ondata su richiesta, non allegata
qui per non appesantire il report con 144 righe già mostrate sopra in forma aggregata).

---

## 10. Linea J — fatti oggettivi (anticipo per J1)

Non è compito di P0 analizzare J1 nel merito, ma verificare che i dati esistano e siano raggiungibili.
Confermato, con numeri di base già pronti per chi eseguirà J1:

- **Commit totali**: 1.073, dal **27-04-26** (primo commit, combacia esattamente con "nasce
  CalendarBackup-v2" del piano §2.2) al **06-08-26** (oggi).
- **Nessun commit in luglio 2026** in questo repository: 04-2026(1) · 05-2026(560) · 06-2026(437) ·
  07-2026(**0**) · 08-2026(59). Conferma diretta e oggettiva, non dedotta, del "buco" 22-06→02-08 già
  scoperto da P0-EX: a luglio semplicemente non si è toccato questo repo.
- **Migrazioni**: 72 file in `supabase/migrations/`, da `001_schema_completo.sql` a
  `071_arrival_times_wall_clock_occupancy.sql` (72 file ma numerazione fino a 071 — un solo scarto,
  normale per rinumerazioni).
- **Branch**: `main`, `env/test`, `feature/console-super-admin` (attivo, coerente con la scoperta
  Console-Skill), `test/modelli-locali`. 41 merge in `main`.
- **Rapporto docs/codice per messaggio di commit** (prefisso convenzionale, 958/1.073 commit tipizzati):
  `docs` 348 · `fix` 266 · `feat` 249 · `style` 31 · `chore` 29 · `test` 26 · `refactor` 9. **`docs` è
  il tipo di commit più frequente di tutti**, davanti a `feat`: misura oggettiva diretta di quanto
  questo progetto sia stato un lavoro di metodo oltre che di prodotto — J1 dovrebbe citare proprio
  questo numero.
- **`docs/Archives/` non è mai stato tracciato da git** (0 file in `git ls-files`): le linee B–F non
  hanno storia di commit. J1 non potrà usare git per datarle, solo il filesystem (vedi §6 sotto) o le
  date interne ai documenti.

---

## 11. File high-signal (per keyword: senior · owner · decisioni · controverifica · dossier · lezioni ·
OSSERVAZIONI · PDR · masterplan · PROFILO_SCOLASTICO)

Cercato per nome file in tutto `docs/` (84 risultati). I più rilevanti, raggruppati:

**Decisioni owner esplicite:**
- `docs/Archives/docs/meta/MAPPATURA_AREE/DECISIONI_OWNER_BETA.md` (B1)
- `docs/Comunicazione-Skill/ARCHIVIO_DECISIONI.md` (M1)
- `docs/Archives/trading agent analyst-v.0/docs/.../Decisioni prese.md` e
  `Decisioni-Prese-roadmap-2026-05-21.md` (E1)
- `docs/Console-Skill/sessioni/DECISION_LOG.md` (M2, nuova)
- `docs/_lavoro/Sessioni/13-05-26/.../01-Report-decisioni-13-05-26.md` e `05-Report-decisioni-F4.md` (G2)

**Dossier/revisioni senior** (24 file con "senior" nel nome, concentrati 02-06→04-06 e 10-06→11-06,
più `HANDOFF_S4_SENIOR.md` del 02-08): segnalano i momenti in cui il lavoro è stato sottoposto a
verifica di un "agente senior" — punti di massimo interesse per S3/S4.

**OSSERVAZIONI/ERRORI (agenti che scrivono di Matteo)**: `docs/Comunicazione-Skill/OSSERVAZIONI.md` +
`ARCHIVIO_OSSERVAZIONI.md` (M1), più i due gemelli in `Archives/docs/skill-system/` (B1) e
`Archives/Trading agent analysy/.../skill-system-trading-platform/` (F1) — stesso schema replicato
su 3 progetti: buon materiale per le "frecce di trasferimento" di S3.

**PDR (trading)**: `pdr-v0.1-2026-05-20.md` e `PDR v1.0.md` (E1) — la decisione di compliance "niente
segnali buy/sell" indicata dal piano come focus di E1.

**Masterplan**: 15 file, sparsi su 4 progetti diversi (CB-v2, BHM, Trading, Console) — ricorrenti nel
metodo di lavoro attraverso domini diversi, utile per S3/S5.

**PROFILO_SCOLASTICO — trovato in 2 punti**, non 1: `docs/_lavoro/Per matteo/Scuola/PROFILO_SCOLASTICO.md`
(privato, G1) e `docs/Archives/trading agent analyst-v.0/docs/.../Didattica-agenti/PROFILO_SCOLASTICO.md`
(nell'archivio trading). Sono probabilmente due versioni/momenti diversi della stessa
auto-dichiarazione: G1 ed E1 dovrebbero confrontarle esplicitamente, non leggerle in isolamento.

**"Decisioni di Matteo" (frase esatta nel testo, non nel nome file)**: solo 7 occorrenze in tutto
`docs/`, quasi tutte nei file di tracking di questo stesso cantiere — segnale che è un'etichetta rara,
usata con parsimonia, non un tormentone nei report.

---

## 12. Timeline grezza min/max per linea (e buchi)

| Linea | Min | Max | Fonte della data | Affidabilità |
|---|---|---|---|---|
| A | 23-05-26 | 06-08-26 | nome cartella | alta (nome esplicito) |
| M (skill attuali) | 13-05-26 (`Database-Skill`) | 06-08-26 (`Testing-Skill`, `Admin-Skill`) | primo/ultimo commit git | alta |
| M2 Console-Skill | 22-06-26 | 23-06-26 | primo/ultimo commit git | alta — finestra strettissima, nata e sviluppata in 2 giorni poi ripresa altrove (branch dedicato) |
| B (BHM-Zen) | 05-02-26 (bulk) / **06-07-26** (prima data reale nei nomi cartella `sessioni/`) | 10-07-26 | mtime + nomi cartella | **bassa per mtime, alta per i nomi cartella `sessioni/06-07-26` ecc.** |
| C1/C2/C4 (HACCP legacy: Sessions_Old, cleanup, Tests) | 05-02-26 | 05-02-26 | mtime | **inutilizzabile**: stessa data per migliaia di file, è la copia in blocco, non il lavoro reale |
| C3 knowledge-legacy | 26-10-25 | 02-11-25 | mtime | media — unica linea C con mtime non appiattito, probabile la più antica di tutto il corpus |
| C5 | 05-02-26 (bulk) | 05-02-26 | mtime | inutilizzabile, stesso problema |
| D (CalendarBackup vecchia) | 27-10-25 | 07-05-26 | mtime | media — spread ampio, plausibile |
| E (Trading v0) | 20-05-26 (da nome file PDR) | 07-06-26 | nomi file + mtime | media-alta |
| F (FREEDOM Trading) | 03-07-26 | 05-07-26 | mtime | media |
| G | 12-05-26 | 22-05-26 (Sessioni) | nome cartella | alta |
| H | 21-02-26 | 06-08-26 | P0-EX (timestamp messaggi/chat) | dichiarata dal corpus stesso |
| I (piani) | gen-26 (da piano §2) | giu-26 | non riverificata in P0 | — |
| J (git) | 27-04-26 | 06-08-26 | commit reali | massima |

**Buchi confermati:**
- **22-06 → 02-08 su CB-v2** (già noto da P0-EX/piano §2.2): confermato ora anche da J1 con zero commit
  in luglio.
- **C1/C2/C4/C5 (HACCP legacy) non hanno una timeline utilizzabile dal filesystem**: chi eseguirà quelle
  ondate deve cercare le date **dentro** i documenti (molti hanno intestazioni con data) o dichiarare
  esplicitamente "data sconosciuta" — non usare il mtime, è fuorviante.
- **`docs/Console-Skill` ha una finestra di sviluppo di soli 2 giorni** (22-23 giugno) nella storia
  principale, poi prosegue solo sul branch `feature/console-super-admin`: chi legge questa linea deve
  controllare anche quel branch, non solo `main`/`env/test`, se vuole la storia completa.

---

## 13. Copertura dichiarata di questa ondata

- Linee ricontate con conteggio file da disco: **A, B, C, D, E, F, G, I, M** (9 su 10 linee con file).
- Linea H: non riconteggiata da zero (già fatta da P0-EX il 06-08-26 stesso), solo verificata
  l'esistenza dei file sorgente.
- Linea J: non analizzata nel merito (è compito di J1), solo verificata la raggiungibilità dei dati e
  anticipati 5 numeri di base.
- File aperti da questa ondata: **0 file di contenuto letti per intero** — è un'ondata di
  inventario/conteggio, non di lettura. Le uniche letture di contenuto sono state: campioni di 15-40
  righe per classificare i 144 piani (linea I) e i 4 file ambigui, più un peek di 5 righe sul file
  anomalo `2025-10-21`.
- **Nessun segreto, `.env`, dato cliente o testo di contratto citato.**

---

## 14. Lacune e handoff

- **Decisione da prendere da Matteo prima di proseguire**: se aggiungere le ondate M2/M3/M4 proposte
  al §3.3 (147 file di skill d'area attuale, tra cui il prodotto Console mai censito). Senza questa
  decisione, l'indagine procederebbe ignorando quella che è probabilmente la fonte più diretta di
  decisioni codificate (L4) di tutto il corpus.
- **I1/I2**: la lista completa dei 144 file con etichetta di progetto è pronta ma non allegata per
  intero in questo report (solo aggregata al §9) — disponibile a chi esegue I1/I2, va rigenerata con lo
  stesso criterio (parole chiave di dominio nel testo completo del piano) o richiesta esplicitamente.
- **C1/C2/C4/C5**: avvisare chi esegue queste ondate che il mtime non è utilizzabile per la timeline.
- **B2/B3**: usare il punto di taglio esatto indicato al §4, non "metà alfabetica" generica (i nomi
  file duplicati tra sottocartelle rendono l'ordinamento ambiguo se fatto sul nome nudo).
- **J1**: i 5 numeri anticipati al §10 sono un punto di partenza, non sostituiscono l'analisi completa
  richiesta a quell'ondata (rapporto docs/codice più fine, divergenze report-vs-git, ecc.).

---

## 15. Chiusura verso Matteo

- Ho contato tutto quello che il piano diceva di contare: quasi tutti i numeri tornano, con piccoli
  errori di somma nel piano stesso (facilmente sistemabili) e un file travestito da cartella
  (`2025-10-21`) che avrebbe fatto perdere un documento.
- La cosa più importante che ho trovato **non era nel piano**: sotto `docs/` esiste tutto il sistema di
  schede che oggi guida gli agenti area per area (Prenota, Menu QR, Console admin, Database, Legale,
  Testing…) — 147 file, e dentro c'è un intero pannello di gestione clienti (`Console-Skill`, con un
  branch ancora aperto) che l'indagine avrebbe saltato del tutto. Ti chiedo una decisione: vuoi che
  aggiunga 3 ondate per coprirlo (proposta pronta al §3.3), o preferisci lasciarlo fuori dal perimetro?
- Per i piani in `.cursor/plans`: sono l'80% prenotazioni/HACCP e il 20% giochi/trading (non metà e
  metà come si pensava) — ho già la lista di quale piano appartiene a quale progetto, pronta per le
  ondate I1/I2.
