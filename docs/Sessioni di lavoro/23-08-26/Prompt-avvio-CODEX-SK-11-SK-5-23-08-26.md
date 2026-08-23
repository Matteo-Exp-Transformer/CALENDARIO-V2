# Prompt di avvio — CODEX `SK-11` → `SK-5`

```text
Profilo: Meta
Modalità: deep
Skill da leggere: docs/MetaSkillSystem/METASKILL_SYSTEM_SKILL.md; docs/Testing-Skill/TESTING_SKILL.md
Non caricare: skill UI, Admin, Prenota, Menu QR, Database o Supabase; questo cantiere non tocca app né DB
Output attesi: implementazione completa di SK-11; solo dopo il suo verde, implementazione e dimostrazione di SK-5; aggiornamento del piano condiviso, dell'handoff e del report unico del ciclo; nessun altro deliverable e niente output in più senza chiedere Sì/No prima

Lavora come coordinatore di un cantiere multi-agente Codex sul branch env/test.

Il piano è già stato discusso e approvato. Non produrre un nuovo piano concorrente e non chiedere
di nuovo le decisioni già chiuse. Leggi e usa come unico owner operativo:

docs/Sessioni di lavoro/23-08-26/PLAN-CODEX-SK-11-SK-5-23-08-26.md

Leggi inoltre l'handoff vivo prima di assegnare il primo lavoro:

docs/Sessioni di lavoro/23-08-26/HANDOFF-CODEX-SK-11-SK-5-23-08-26.md

OBIETTIVO

Implementa prima SK-11, che deve rendere realmente verificati gli attrezzi MSS mss:query e
mss:status: lint su tutti gli .mjs sotto scripts/, test offline e deterministici degli output e un
solo comando con exit code affidabile. Soltanto dopo il verde completo di SK-11 implementa SK-5:
CI attiva anche su env/test, controlli MSS sui report modificati e prova realmente rossa con una
capsula invalida.

DECISIONI DI MATTEO GIÀ CHIUSE — NON RIAPRIRLE

- G1 autorizzata: puoi modificare anche scripts/sync-to-prenotazen.mjs per correggere la violazione
  no-regex-spaces preesistente.
- G2 autorizzata: il nuovo comando dei test attrezzi entra anche in npm run validate, restando
  disponibile come comando autonomo.
- G3 autorizzata: aggiungi la riga SK-11 nella tabella §4-bis di PLAN_V0.md e aggiornane lo stato
  soltanto in base a prove reali.
- G4 autorizzata: puoi modificare anche scripts/_test-email-once.mjs per rimuovere i 16 console.*
  preesistenti, riusando il logger CLI già presente. Non disattivare no-console globalmente.
- La prova rossa di SK-5 va fatta localmente e in isolamento con lo stesso comando della CI.
  Nessun branch remoto e nessun push senza un nuovo sì esplicito di Matteo.

CONTESTO OBBLIGATORIO, IN QUESTO ORDINE

1. docs/MetaSkillSystem/PLAN_V0.md: §4-bis, §15, §16.
2. docs/MetaSkillSystem/CONTRATTO_CAPSULA_SESSIONE_V0.md: §5 e §6.
3. docs/MetaSkillSystem/tests/h1/run.mjs, fixture-factory.mjs, build-fixtures.mjs.
4. scripts/mss/query.mjs, soprattutto buildVistaEffettiva() e previewValore().
5. scripts/mss/core.mjs::applyAmendmentsView().
6. docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md: le tre voci del 23-08-26.
7. docs/FOLLOW_UP.md: FU-LOG-1, come governance già consolidata sugli script.

REGOLE ARCHITETTURALI

- La semantica degli amendment vive soltanto in core.mjs::applyAmendmentsView(). Query deve
  continuare a delegare: nessuna copia o variante locale.
- Riusa la factory H-1. Se manca un costruttore generale, esportalo o estendilo; non ricopiare
  baseRecord, amendment o validBundle.
- Rendi query.mjs e status.mjs importabili senza output, side effect o process.exit all'import.
  Mantieni invariato il comportamento delle rispettive CLI.
- Se root discovery o guard ESM servono a entrambi, crea una sola utility condivisa sotto
  scripts/mss/ e importala; niente terza duplicazione.
- Timestamp, UUIDv7, root repo, TTY e dati Git dei test devono essere fissi o iniettati.
- Zero rete, DB, Supabase, ora reale e dipendenza dalla larghezza del terminale.
- Non fare refactor estetici o riscritture estese di query.mjs.

ORGANIZZAZIONE MULTI-AGENTE

Usa agenti Codex con incarichi circoscritti e sequenziali. Il coordinatore mantiene piano e
handoff; un solo agente alla volta possiede un file modificabile.

1. Esecutore SK-11: importabilità, suite query/status, lint e package scripts.
2. Revisore SK-11: revisione completa indipendente, prova rossa della suite e verifica del
   ripristino. Non approvare per cortesia e non correggere file mentre l'esecutore li possiede.
3. Esecutore SK-5: parte soltanto dopo il gate SK-11; workflow e validazione dei report cambiati.
4. Revisore finale: ripete le prove, verifica perimetro, report e capsula.

La revisione con famiglia diversa resta consigliata ma non è un gate. Un secondo Codex non può
marcare autonomamente independently_verified soltanto perché ha riletto il lavoro.

FASE 0 — BASELINE

- Verifica env/test e git status --porcelain.
- Controlla che nessun altro mandato stia modificando gli stessi file. adapter.mjs è riservato a
  SK-4 e non va mai toccato.
- Registra nel report e nell'handoff le baseline vere di lint, lint .mjs, test:mss, mss:query
  --verifica e mss:status.
- Il lint .mjs già misurato, dopo l'ambiente Node, parte da 20 problemi: 16 no-console nel test
  email, 3 import inutilizzati in query/status, 1 no-regex-spaces nel sync. Se i numeri cambiano,
  elenca il nuovo residuo prima di correggerlo.
- Aggiungi la riga SK-11 al §4-bis con stato onesto di lavoro avviato, senza dichiararla chiusa.

PARTE A — SK-11

1. Crea seam importabili minimi per query e status, con wrapper CLI invariati.
2. Crea un'unica suite proposta come docs/MetaSkillSystem/tests/tools/run.mjs, riusando la factory
   H-1. Ogni scenario ha una fixture distinta e il runner stampa il numero di test.
3. Copri mss:query almeno con:
   - catena amendment applicata, con grezzo diverso dall'effettivo;
   - previous_value_or_hash non coincidente;
   - amendment orfano;
   - bersaglio non final;
   - relation supersedes senza payload applicabile;
   - stesso effective_at con tie-break record_id osservabile e stabile anche invertendo l'input;
   - due valori diversi con anteprima identica a 70 caratteri: output umano con marcatore di
     collisione e JSON con valori interi.
4. Copri mss:status con un caso nominale sintetico e un caso degenere con owner/Git assenti. Status
   non legge capsule: non inventare un test “report senza capsula” su una superficie che non lo
   consuma; quel caso resta H-1 e sarà usato per la CI.
5. Aggiungi npm run test:mss:tools. Exit 0 solo se tutto passa; output finale col numero di test.
6. Estendi npm run lint a tutti gli .mjs sotto scripts/ con ambiente Node e zero warning. Mantieni
   FU-LOG-1: usa il logger CLI esistente per _test-email-once.mjs, non un override globale che
   nasconda console.*.
7. Inserisci test:mss:tools dentro npm run validate come autorizzato da G2.

CONTROPROVA SK-11

Il revisore modifica temporaneamente una sola asserzione con apply_patch, esegue
npm run test:mss:tools e registra exit 1 più la riga rossa. Ripristina con patch inversa, rilancia
e registra exit 0. Vietati git checkout, reset o clean. Confronta il diff prima/dopo per provare che
la mutazione non è rimasta.

GATE PRIMA DI SK-5

- node --check su tutti gli .mjs toccati: exit 0;
- lint esteso: exit 0, zero warning;
- npm run test:mss: exit 0;
- npm run test:mss:tools: exit 0 con conteggio;
- prova rossa riuscita e ripristino verde;
- npm run validate: exit 0;
- nessun file fuori perimetro.

Se uno solo manca, SK-5 non parte.

PARTE B — SK-5

1. Estendi .github/workflows/ci.yml a main ed env/test, push e pull_request.
2. Garantisci storia Git sufficiente a confrontare base e head.
3. Valida soltanto i Report-*.md aggiunti/modificati dalla PR o push usando lo stesso core di
   validate:mss, con kind report e require-capsule. L'eventuale helper coordina la lista dei file e
   non duplica regole del validator.
4. “Nessun report toccato” è un successo esplicito.
5. Aggiungi passi CI distinti per report MSS cambiati, npm run test:mss e
   npm run test:mss:tools; conserva i gate esistenti.
6. Dimostra il rosso localmente in area temporanea: nuovo report standard con capsula invalida,
   stesso comando CI, exit non zero e codice MSS nel log. Rimuovi soltanto l'artefatto creato e
   rilancia verde. Non modificare record final storici.

PERIMETRO

Puoi scrivere soltanto in:

- scripts/mss/**, eccetto scripts/mss/adapter.mjs;
- scripts/sync-to-prenotazen.mjs, autorizzazione G1;
- scripts/_test-email-once.mjs, autorizzazione G4;
- docs/MetaSkillSystem/tests/**;
- .github/workflows/ci.yml;
- solo blocco scripts di package.json;
- configurazione ESLint;
- righe SK-11/SK-5 di docs/MetaSkillSystem/PLAN_V0.md;
- docs/Sessioni di lavoro/23-08-26/**.

Vietati: adapter.mjs, src/, database, Supabase, migrazioni, capsule storiche, move/rename, docs/_lavoro,
push e git distruttivo.

PROVE FINALI OBBLIGATORIE

Per ogni prova conserva comando, exit code e riga di output probante:

1. node --check per ogni .mjs toccato;
2. lint esteso, zero warning;
3. npm run test:mss;
4. npm run test:mss:tools con numero test;
5. test deliberatamente rosso e successivo verde;
6. npm run validate;
7. npm run validate:docs: baseline attesa 17 path rotti;
8. git status --porcelain e controllo path fuori perimetro;
9. comando CI rosso su capsula invalida e verde dopo rimozione;
10. npm run validate:mss sul report del ciclo: OK.

REPORT, STATO E HANDOFF

Usa un solo report multi-agente:
docs/Sessioni di lavoro/23-08-26/Report-ciclo-SK-11-SK-5-23-08-26.md

Ogni agente aggiorna soltanto la propria sezione. Il report include output veri, cosa non è stato
fatto, dati comunicazione, capsula JSONL con UUIDv7, segment_no 1 e verification.status onesto.
Le sei domande canoniche devono essere copiate verbatim dal piano condiviso.

Dopo ogni fase, il coordinatore aggiorna:

- il registro del piano condiviso;
- HANDOFF-CODEX-SK-11-SK-5-23-08-26.md con stato vero, file posseduti, prove e prossimo gate;
- PLAN_V0.md soltanto quando le prove giustificano lo stato.

Non dichiarare SK-11 o SK-5 chiusi al posto di Matteo. Non alzare WP-1, H-1.3 o SEP-G5.

Chiusura verso Matteo: consegna una checklist semplice delle prove riuscite/fallite e di ciò che
resta da decidere. Questo lavoro non cambia schermate dell'app e non genera una voce nella checklist
dei flussi UI da provare. Nessun push senza il suo sì esplicito.
```
