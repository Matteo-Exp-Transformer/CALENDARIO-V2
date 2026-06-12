# Analisi skill system — 12-06-26

> Analisi 2 di 3. Eseguita da un sub-agent in sola lettura (catena di instradamento completa, 12 skill/contesti,
> ~50 affermazioni verificate contro il codice, suite test eseguita per il conteggio reale). I finding più pesanti
> ri-verificati a mano da me prima di pubblicare. Nessun file toccato.

**Cosa è cambiato:** niente — fotografia dello stato dello skill system.
**Cosa resta:** approvare il piano di pulizia in fondo (fase A meccanica, fase B fusioni, fase C strutturale).
**Serve una tua azione:** sì — decidere quali fasi del piano autorizzare.

---

## Risposta secca alle tue domande

| Domanda | Risposta |
|---|---|
| Quanto è allineato al codice? | **76%** (38 affermazioni vere su 50 verificate) — ma con varianza enorme: le aree mappate di recente (Prenota, Menu QR, Admin-Skill, TEXT_LIMITS_MAP) ≈ 100%, i file vecchi (CLAUDE.md, ADMIN_CLASSIC §4, Database-Skill) ≈ 50% |
| È ben fatto o pesante? | **Ben architettato, troppo pesante.** L'idea (router §0 → senso+divieti → contesto coi numeri) è buona e rara; la catena di caricamento però costa 17-26k token ad area |
| Un agente trova le info giuste navigandolo? | **Dipende dall'area**: Menu QR sì in 3 salti; «cambia limite coperti Prenota» FALLISCE (la §0 non ha la riga, e Prenota-Skill non parla mai di coperti) |
| Può essere snellito? | Sì, del 40-50%: zavorra = storia/changelog dentro le skill, protocolli duplicati, terze copie di valori |
| Ci sono falle interne? | Sì: riferimenti a file rinominati mai bonificati (5 file vivi puntano ai vecchi `PUBLIC_MENU_*`), rimandi FU-023/FU-024 che portano al debito SBAGLIATO, contatori test in contraddizione tripla (29 vs 137 vs 554) |

**Voto: 6,5/10** — sale a 7,5 con mezza giornata di bonifica meccanica, a 8+ con fusioni e mini-pack.

---

## 1. Navigabilità (simulazione agente mediocre)

- **«Cambia il limite coperti della pagina Prenota» → FALLISCE.** CLAUDE.md → APP_CONTEXT §0 → Prenota-Skill: vicolo cieco — in tutta la cartella non compare mai «coperti» né `daily_guest_limit`. Il valore vero vive in `restaurantSettingRegistry.ts` + `create-booking`, documentato solo in `ADMIN_SETTINGS_CONTEXT.md` (area Admin), che il wording del task non fa scegliere. L'agente finisce a grep nel codice: esattamente ciò che il sistema vuole evitare.
- **«Aggiungi una categoria al menu QR» → FUNZIONA** (4 file prima del codice, ambiguità magazzino/vista gestita bene anche da comandi-base «Zone che si confondono»).
- **«Cambia il cap del carosello QR» → ECCELLENTE**: 3 salti, atterraggio esatto sulle costanti.
- **Ambiguità strutturali**: Tab Menu admin ha DUE context paralleli (`per-ui-design-skill/MENU_ADMIN_CONTEXT.md` ↔ `Admin-Skill/contesto/ADMIN_MENU_MAGAZZINO_CONTEXT.md`, e la §0 instrada ancora al vecchio); Admin shell ha DUE sistemi skill (`Dashboard-laterale-skill/` ↔ `Admin-Skill/`); il routing admin è descritto 3 volte. `MASTERPLAN_BLINDATURA.md` è orfano: mai citato da APP_CONTEXT.

## 2. Allineamento col codice — le 12 affermazioni false/obsolete

| # | Dove | Problema | Verità |
|---|---|---|---|
| 1 | `.claude/CLAUDE.md` | «29 test Vitest» | 554 test / 68 file |
| 2 | `APP_CONTEXT_SKILL.md:369` | «137/137» | 554 *(ri-verificato a mano)* |
| 3 | `APP_CONTEXT_SKILL.md` §3 | elenca `PublicMenuPresetPage` | rimossa il 06-06 |
| 4 | `APP_CONTEXT_SKILL.md` §3 | albero src/ senza `features/booking/services/` | esiste (bookingFormResolver + sync) |
| 5 | `APP_CONTEXT_SKILL.md` §4 | «LOCK CollapsibleCard — 57 test» | nessun test CollapsibleCard esiste più |
| 6 | `ADMIN_CLASSIC_SKILL.md` §1 | «SettingsTab.tsx + EmailLogsModal… dead code» | file non esistono più |
| 7 | `ADMIN_CLASSIC_SKILL.md` §1 | rimanda a «APP_CONTEXT §3a» | la §3a non esiste |
| 8 | `ADMIN_CLASSIC_SKILL.md` §4 | `useCanonicalTimeSlots()` citata 4 volte | sparita da src/ |
| 9 | `ADMIN_CLASSIC_SKILL.md` §4 | «branch Sviluppo-Dashboard-laterale vs main» | modello è env/test→main dal 30-05 |
| 10 | `docs/DATABASE.md:43` | «prossima migrazione = 045_» | la 045 esiste già |
| 11 | `DB_MIGRATIONS_CONTEXT.md` | fermo alla 039 | mancano 040-045 |
| 12 | `DB_SCHEMA_CONTEXT.md` | manca `is_available` e colonne 040+ | colonne live dalla 045 |

Pattern: **i file nuovi non marciscono, i vecchi sì.** Il formato migliore del sistema è `*_TEXT_LIMITS_MAP` (nome costante + file + valore): 852 parole, 100% allineato.

## 3. Peso

| Catena tipica | Parole | ~Token |
|---|---|---|
| Prenota completa (6 file) | 19.768 | ~25.700 |
| Menu QR completa (6 file) | 18.214 | ~23.700 |
| Admin magazzino M3 (6 file) | 13.109 | ~17.000 |
| Corpus skill totale | ~98.000 | ~127.000 |

**Verdetto per modelli 32k (i tuoi agenti locali): NON sostenibile** — la sola catena documentale consuma il 55-80% del contesto prima di aprire un file di codice, e le RULE impongono di leggere i file di codice interi. Sostenibile da ~100k in su. Zavorra stimata 40-50%: protocollo report in APP_CONTEXT §7 (già delegato a CHIUSURA_SESSIONE ma ancora lungo), narrative di storia dentro le skill (MENU_QR §3-bis, ADMIN_CLASSIC §4 = 90 righe di changelog), attori Mario/Anna ripetuti ovunque.

## 4. Duplicazioni trovate

1. **Grilletti/vocabolario in 5 copie**: CLAUDE.md · AGENTS.md · comandi-base.mdc · VOCABOLARIO.md (fonte dichiarata) · COMANDI_AVVIO.md. AGENTS.md è il gemello disciplinato (quasi solo puntatori); CLAUDE.md è la copia già marcita.
2. **Regola PROD/TEST DB in 5 posti.**
3. **Menu admin: 2 context per la stessa area** (limiti 7/12/6/6 e cap 24/24/79 in entrambi, più la terza copia in PRENOTA_TEXT_LIMITS_MAP §E).
4. **Admin shell: 2 sistemi skill paralleli** (Dashboard-laterale-skill 4.140 parole vs Admin-Skill).
5. **Invarianti ripetuti**: Modal z-[10050], Tailwind letterali, struttura src/ (in CLAUDE.md E APP_CONTEXT §3, stantia in punti diversi), comandi npm in 3 file con conteggi test diversi tra loro.

## 5. Falle (ri-verificate a mano le prime due)

- **Riferimenti a file rinominati mai bonificati**: i vecchi `PUBLIC_MENU_SKILL/DATA_FLOW/LAYOUT` sono citati come rimandi attivi in 5 file VIVI: `MENU_ADMIN_CONTEXT.md`, `VOCABOLARIO.md` (il vocabolario instrada a una skill inesistente!), `PRENOTA_DATA_FLOW_CONTEXT.md`, `MENU_QR_LAYOUT_CONTEXT.md`, `MENU_QR_DATA_FLOW_CONTEXT.md`.
- **Rimandi FU sbagliati nel router**: APP_CONTEXT (§0 riga 78-79, §4c, §4d) dice FU-023=audit fallback e FU-024=milestone skill tier; nel registro `FOLLOW_UP.md` FU-023=guard chiusura modale e FU-024=fascia responsive (CHIUSA). Un agente che segue il rimando atterra sul debito sbagliato.
- Contraddizione tra gemelli: CLAUDE.md elenca `supabase db push`, APP_CONTEXT §1b dice di usare MCP.
- Storia ferma in area viva: `Menu-QR-Skill/PLAN_BLINDATURA_*` + `REPORT_BLINDATURA_*` (area già blindata).

---

## Piano di pulizia proposto (da approvare)

**FASE A — Bonifica meccanica (mezza giornata, rischio zero, voto → 7,5)**
1. Search&replace dei rimandi `PUBLIC_MENU_*` → percorsi `Menu-QR-Skill/` nei 5 file vivi.
2. Fix rimandi FU: in APP_CONTEXT dare ID nuovi non riciclati al debito fallback e alla milestone skill (o riallineare al registro).
3. Togliere i contatori di test dai .md (29/137): scrivere «`npm run test` deve essere verde», senza numero.
4. Fix «§3a» inesistente, `DATABASE.md` «prossima=045», allineare `DB_MIGRATIONS_CONTEXT` (sostituire l'elenco fermo a 039 con «fonte = supabase/migrations/» + sole note anomalie) e `DB_SCHEMA_CONTEXT` (colonne 040-045).
5. Correggere APP_CONTEXT §3 (albero src/) e §4 (LOCK CollapsibleCard senza i «57 test»).

**FASE B — Eliminazioni e fusioni (1 sessione, richiede conferma file per file)**
6. `per-ui-design-skill/MENU_ADMIN_CONTEXT.md` → fondere in `ADMIN_MENU_MAGAZZINO_CONTEXT.md` + tombstone; aggiornare §0.
7. `Dashboard-laterale-skill/` (3 file) → fondere in `Admin-Skill/` (un'area = una cartella).
8. `ADMIN_CLASSIC_SKILL.md` §4: potare il changelog 15-05/23-05 (90 righe quasi tutte obsolete); tenere §0-§3 + §4b.
9. `.claude/CLAUDE.md`: dimezzare — via comandi npm col numero test, via struttura src/ duplicata, grilletti come puntatori (modello AGENTS.md).
10. `Menu-QR-Skill/PLAN_BLINDATURA_*` e `REPORT_BLINDATURA_*` → spostare in `Sessioni di lavoro/`.

**FASE C — Strutturale (sessione Meta dedicata, voto → 8+)**
11. **Mini-pack 32k**: per ogni area un estratto ≤2k token (trigger + divieti + mappa + LOCK) generato dalle skill esistenti — per gli agenti locali.
12. **Check automatico in CI/pre-commit**: script che estrae i path citati nei .md (escluse Sessioni) e fallisce se il file non esiste — avrebbe intercettato 8 falle su 12.
13. **Regola anti-storia**: la narrativa va nei report, nelle skill resta il divieto risultante (1 riga + link).
14. Riga nuova in §0: «limite coperti / capienza → ADMIN_SETTINGS_CONTEXT + create-booking» + riga MASTERPLAN; nota in PRENOTA_SKILL §6 «limiti capienza → area Admin».
15. Spostare il protocollo report (§7) fuori da APP_CONTEXT (letto da ogni agente, serve solo a fine sessione).

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Per questa analisi: «2. analisi di skill system: capisci come funziona e quanto è efficace per instradare agenti mediocri a modificare correttamente il codice. oltre alle tue domande per valutare skill system considera anche queste: quanto è allineato al codice realmente? è ben fatto o pesante? agente trova info corrette navigandolo? può essere snellito o migliorato? ci sono falle o sistemi che non funzionano al suo interno?» più «quindi in base all'analisi di skill sytem capiamo se ci sono file che dicono cose duplicate (eliminiamoli) e capisci dove migliorare i file». (Verbatim completo del prompt unico nella R1 del report legale-vendita.)

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Nessun diff di codice (sola lettura). Dati dal sub-agent (50 verifiche con grep/lettura + vitest run per il 554). Ho ri-verificato personalmente prima di pubblicare: `APP_CONTEXT_SKILL.md:369` contiene davvero «137/137»; grep `PUBLIC_MENU_*` su docs/ → presenti nei 5 file vivi citati (più ~38 report storici in Sessioni, che vanno bene così); APP_CONTEXT righe 78-79/318/331 dicono FU-023=fallback e FU-024=skill-tier mentre `FOLLOW_UP.md` registra FU-023=guard modale e FU-024=responsive chiuso — mismatch confermato; «29 test» in CLAUDE.md confermato (l'ho in contesto). Il conteggio 554 coincide col run indipendente dell'altro sub-agent (analisi solidità).

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna modifica fatta → nessun allineamento dovuto. L'analisi però È l'elenco dei file da allineare: i 12 disallineamenti in §2 e le 5 falle in §5 sono la coda di lavoro, raccolta nel Piano di pulizia (fasi A/B/C) in attesa dell'approvazione di Matteo — non applicata da sola per rispetto della regola «non modificare le skill da solo» e perché l'eliminazione di file è distruttiva.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Non ho applicato nessuna voce del piano (serve l'ok di Matteo). Il campione di verifica è 50 affermazioni, non un censimento totale: nei file non campionati possono esserci altri disallineamenti. Le simulazioni di navigazione sono 3 task tipo, non tutte le righe della §0. Non ho misurato il peso delle catene per TUTTE le aree (solo le 3 principali).

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: per giudicare il sistema ho dovuto incrociare 5 copie degli stessi grilletti (CLAUDE/AGENTS/comandi-base/VOCABOLARIO/COMANDI_AVVIO) per capire quale fosse la fonte; proposta: un solo file fonte + gemelli che contengono SOLO puntatori (il modello è già AGENTS.md, va esteso a CLAUDE.md) — è la voce 9 del piano.

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Per questo task il contesto andava bene per me (finestra grande), ma la misura fatta dice che per il target dichiarato (modelli locali 32k) è troppo: 17-26k token di catena prima del codice. L'hook di fine-sessione ricevuto finora è stato utile due volte (sezione §11 mancante, poi checklist a mente fredda) e mai rumore; nota: ora i report nascono già col §11 compilato, segno che l'hook sta educando l'agente — funziona.
