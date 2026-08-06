# M2 — Console-Skill: pannello super-admin gestione tenant

> **Profilo:** Verifica | Meta · **Regime:** scavo · **Data report:** 06-08-26  
> **Perimetro disco (`env/test`):** `docs/Console-Skill/` — **46 file** (conteggio `Get-ChildItem`)  
> **Branch consultato (oltre al disco):** `feature/console-super-admin` — git log + `git show` su DECISION_LOG / REGISTRO / FOLLOW_UP / PLAN-DB-006 (4 file extra solo su quel branch: REQ-004 ×2, HANDOFF ×2)  
> **Peso tipico delle fonti:** 3–4 (documentazione di skill/audit scritta da agenti e Team; decisioni con attore `Matteo` nel DECISION_LOG = ipotesi forti da confermare con H*/A*)

**Perché esiste questa linea (P0 §3):** cartella mai censita nel piano iniziale; prodotto separato (pannello super-admin tenant) con branch dedicato ancora aperto; finestra git docs/codice Console concentrata in **22–23 giugno 2026**.

---

## Sezione 1 — Decisioni

| ID | Data | Tipo | Oggetto | Chi | Autonomia | Fonte | Citazione | Skill |
|----|------|------|---------|-----|-----------|-------|-----------|-------|
| M2-D01 | 22-06-26 | PRODOTTO | Add-on = `tenant_features`; `qr_menu_enabled` legacy | MATTEO | SCELTA | `sessioni/DECISION_LOG.md` DEC-008 | «Add-on (incl. Menu QR) = fonte di verità `tenant_features`» | product-feature-model |
| M2-D02 | 22-06-26 | PRODOTTO | «+QR» = classic + riga `qrMenu` | MATTEO | SCELTA | `DECISION_LOG.md` DEC-009 | ««+QR» = edition `classic` + riga `tenant_features` `qrMenu`» | product-packaging |
| M2-D03 | 22-06-26 | SICUREZZA | Scritture privilegiate via Edge Function su TEST | MATTEO | APPROVATA | `DECISION_LOG.md` DEC-010 | «OK Edge Function dedicata su TEST… service role fuori dal browser» | env-safety / privileged-writes |
| M2-D04 | 22-06-26 | SICUREZZA | Login Console = Auth + allowlist solo Matteo | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-011 | «Login Console = Supabase Auth con allowlist email (solo Matteo)» | access-control |
| M2-D05 | 22-06-26 | ALTRO | Deploy Vercel root `console/`, dominio TBD | MATTEO | APPROVATA | `DECISION_LOG.md` DEC-012 | «Deploy: OK proposta Vercel root `console/`» | deploy-scoping |
| M2-D06 | 22-06-26 | AI-METODO | Consenso pieno «per ora» + tracciabilità obbligatoria | CONGIUNTA | ORIGINATA | `DECISION_LOG.md` DEC-013; `TRACCIABILITA.md` | «Standing authorization… Vincolo: tracciabilità obbligatoria» | agent-governance |
| M2-D07 | 22-06-26 | SICUREZZA | Schema/DDL mai dall’agente → `plan-per-matteo/` | AGENTE | ORIGINATA | `plan-per-matteo/README.md`; `00_BUSSOLA_CONSOLE.md` RULE-3 | «L’agente non esegue modifiche di schema… le descrive… Matteo le esegue» | env-safety / schema-gate |
| M2-D08 | 22-06-26 | ARCHITETTURA→ALTRO | Codice Console in sottocartella isolata `console/` | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-001 | «Codice Console in sottocartella isolata `console/` (no repo separata)» | isolation-architecture |
| M2-D09 | 22-06-26 | SICUREZZA | RULE-1 solo TEST `docnnernvp`; PROD stop | CONGIUNTA | APPROVATA | `MASTERPLAN_CONSOLE.md` RULE-1; `00_BUSSOLA_CONSOLE.md` | «SOLO TEST docnnernvp… PROD rwuxgvld → STOP» | env-safety |
| M2-D10 | 22-06-26 | SICUREZZA | Deploy Edge lo esegue Matteo, non l’agente | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-021 | «F4: deploy della Edge Function a Matteo, non dall’agente» | privileged-deploy-gate |
| M2-D11 | 22-06-26 | UI-UX | Login Magic Link → email+password | MATTEO | CORRETTIVA | `DECISION_LOG.md` DEC-032 | «Login cambiato da Magic Link a email + password» | auth-ux |
| M2-D12 | 22-06-26 | SICUREZZA | Matteo esegue letture RLS PLAN-DB-002/004 su TEST | MATTEO | SCELTA | `DECISION_LOG.md` DEC-034; `STATO_AMBIENTE_TEST.md` | «Eseguita la parte LETTURA di PLAN-DB-002 + PLAN-DB-004 via SQL diretto» | hands-on-db |
| M2-D13 | 22-06-26 | SICUREZZA | Matteo deploya Edge + secret (PLAN-DB-003) | MATTEO | SCELTA | `DECISION_LOG.md` DEC-035 | «Eseguito PLAN-DB-003: deploy Edge `console-admin` su TEST» | hands-on-ops |
| M2-D14 | 22-06-26 | PROCESSO | Canale collaborazione REQ↔consegne Team↔Matteo | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-036; `collaborazione/README.md` | «Creato canale di collaborazione… richieste↔consegne» | collab-workflow |
| M2-D15 | 22-06-26 | SICUREZZA | Ambito scritture = tutte le aziende TEST; **revoca RULE-2** sandbox-only | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-037; REQ-001 §Decisioni | «Ambito scritture console = TUTTE le aziende… Revoca RULE-2» | multi-tenant-safety-tradeoff |
| M2-D16 | 22-06-26 | SICUREZZA | Eliminazione = hard-delete + riscrivere nome/email esatti | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-038 | «Eliminazione = cancellazione definitiva… riscrivere il nome esatto» | destructive-confirm |
| M2-D17 | 22-06-26 | PRODOTTO | «Utente» = admin ristorante (`admin_users`+Auth), non cliente | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-039 | «Utente = admin del ristorante» | domain-model |
| M2-D18 | 22-06-26 | PRODOTTO | Scheda azienda copre tutte le sezioni intervista | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-040; `onboarding/INTERVISTA_NUOVO_CLIENTE.md` | «Scheda azienda copre TUTTE le sezioni dell’intervista» | onboarding-to-console |
| M2-D19 | 22-06-26 | FLUSSO | Nuovo admin = email+password da Matteo; azienda+admin in un passo | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-041 | «Creazione azienda + admin in UN unico passaggio» | sales-ops-flow |
| M2-D20 | 22-06-26 | PROCESSO | Ordine: lettura REQ-001/002 prima, poi scritture/REQ-003 | MATTEO | ORIGINATA | `DECISION_LOG.md` DEC-042 | «prima REQ-001 (in lettura) + REQ-002… poi… scrittura» | delivery-sequencing |
| M2-D21 | 22-06-26 | AI-METODO | Master-plan F1–F7 (login/Edge separati) + automode | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-014/015; `MASTERPLAN_CONSOLE.md` | «Master-plan a 7 fasi… Automode pieno» | multi-agent-orchestration |
| M2-D22 | 22-06-26 | UI-UX | Scope F7: solo 5 chiavi impostazioni (freno creep) | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-030 | «F7 espone un subset di 5 chiavi… NON sono esposte» | scope-control |
| M2-D23 | 22-06-26 | SICUREZZA | Cascata delete: app+409; CASCADE schema = scelta Matteo (PLAN-DB-006) | AGENTE | DELEGATA | `DECISION_LOG.md` DEC-047; `PLAN-DB-006-*.md` | «CASCADE schema resta una scelta consapevole di Matteo» | destructive-schema |
| M2-D24 | 22-06-26 | UI-UX | Invariante: Console usabile da mobile (~375px) | MATTEO | ORIGINATA | `00_BUSSOLA_CONSOLE.md` §0; commit `19ec78b` | «DEVE funzionare perfettamente anche da MOBILE» | mobile-ops |
| M2-D25 | 22-06-26 | PRODOTTO | REQ-001/002/003 aperte da Matteo (CRUD utenti, scheda, crea/elimina aziende) | MATTEO | ORIGINATA | `collaborazione/richieste/REQ-001*.md` (campo «Aperta da») | «Aperta da \| Matteo» | product-backlog-owner |
| M2-D26 | 22-06-26 | PRODOTTO | Estendere Console ai parametri pagina Prenota (FU-CONSOLE-11) | MATTEO | ORIGINATA | `sessioni/FOLLOW_UP.md` FU-CONSOLE-11 | «Richiesto da Matteo 22-06-26 durante la validazione del Masterplan Servizio» | console-scope-expansion |
| M2-D27 | 22-06-26 | AI-METODO | Skill system branch separato (Bussola Console) vs skill Matteo | AGENTE | ORIGINATA | `README.md`; `Report-setup-…22-06-26.md` | «istanza v0 dedicata… sostituisce le regole operative di Matteo» | dual-skill-system |
| M2-D28 | 23-06-26 | PROCESSO | Workflow 3 branch: Team solo su feature; Matteo tira su env/test e main | CONGIUNTA | SCELTA | `collaborazione/WORKFLOW.md` §1 | «Team solo sviluppa e pusha… È Matteo che tira… valida… promuove» | release-governance |
| M2-D29 | 23-06-26 | SICUREZZA | PLAN-DB-006 CASCADE eseguito su TEST (autorizzato da Matteo) | MATTEO | APPROVATA | `git show feature/…/PLAN-DB-006` Stato; SESSION_LOG feature 23-06 | «ESEGUITO… autorizzato da Matteo» | hands-on-db |
| M2-D30 | 23-06-26 | TESTING | Esito test: REQ-001…004 ACCETTATE (residui su 001/002) | INCERTO | APPROVATA | `git show feature/…/REGISTRO_RICHIESTE.md` | «test eseguiti nei panni di Matteo… ACCETTATA» | acceptance-testing |
| M2-D31 | 22-06-26 | SICUREZZA | Doppio gate allowlist client≠server | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-024 | «Doppio gate allowlist… Client=UX, server=barriera vera» | defense-in-depth |
| M2-D32 | 22-06-26 | FLUSSO | Navigazione Console = switch stato, non react-router | AGENTE | ORIGINATA | `DECISION_LOG.md` DEC-045 | «Navigazione Console = switch di stato locale… invece di react-router» | ui-architecture |

> **Nota attribuzione:** le righe con `Chi = MATTEO` vengono dal campo `Attore` del DECISION_LOG o dalla sezione «① Richiesta (Matteo)» / «Decisioni prese — Risolte con Matteo». Peso 3 finché H* non conferma le parole verbatim. Le decisioni tecniche di Esecutore/Orchestrator restano `AGENTE` anche se Matteo ha dato consenso pieno (DEC-013).

---

## Sezione 2 — Agency e correzioni

| ID | Direzione | Tipo prova | Cosa | Esito | Fonte |
|----|-----------|------------|------|-------|-------|
| M2-A01 | M→A | DIRETTA | Cambia login da Magic Link a email+password (supera DEC-018) | accettata | `DECISION_LOG.md` DEC-032 |
| M2-A02 | M→A | DIRETTA | Revoca RULE-2 sandbox-only: Console gestisce tutti i tenant TEST | accettata | `DECISION_LOG.md` DEC-037; REQ-001 |
| M2-A03 | M→A | DIRETTA | Fissa hard-delete + conferma «riscrivi nome/email» | accettata | `DECISION_LOG.md` DEC-038 |
| M2-A04 | M→A | DIRETTA | Ordina read-block prima del write-block (DEC-042) | accettata | `DECISION_LOG.md` DEC-042 |
| M2-A05 | M↔M | DIRETTA | Da domande aperte (deploy/login/Edge) a consenso pieno + audit | accettata | DEC-008…013; `FOLLOW_UP.md` «TUTTE RISOLTE» |
| M2-A06 | A→M | DEDOTTA | Revisore F4 trova nomi colonna sbagliati → fix prima del deploy Matteo | accettata | `PHASE_AUDIT.md` F4 round 1 🔴→🟢; DEC-026 |
| M2-A07 | A→M | DEDOTTA | Revisore F10: bug update email Auth non allineata; password min 8 in F11 | accettata | `PHASE_AUDIT.md` F10/F11 |
| M2-A08 | M→A | DIRETTA | Chiede estensione manopole Prenota dalla Console (FU-CONSOLE-11) | parziale | `FOLLOW_UP.md` FU-CONSOLE-11 (aperto) |
| M2-A09 | M↔M | DIRETTA | Autorizza CASCADE delete su TEST dopo aver lasciato PLAN-DB-006 opzionale | accettata | feature SESSION_LOG 23-06; PLAN-DB-006 Stato ESEGUITO |

> Nessuna correzione A→M **DIRETTA** verso Matteo in questo perimetro (il testo agente nei transcript non c’è qui). Le A→M sopra sono correzioni **agente→agente** (revisore→esecutore) che hanno protetto Matteo da errori di schema/Auth — utili a S2 come qualità di processo, non come «Matteo era fuori strada».

---

## Sezione 3 — Skill signals

| Skill | Livello provvisorio | Evidenza (ID) | Contro-evidenza cercata |
|-------|---------------------|---------------|-------------------------|
| `env-safety` (TEST≠PROD, `get_project_url`) | **L4** (regola codificata in Bussola/Masterplan = stesso pattern delle salvaguardie progetto) | M2-D09, M2-D07, RULE-1 | Cercata: sì — vedi §4 (SQL diretto fuori da `supabase/migrations/`, FU-CONSOLE-10) |
| `multi-tenant-safety-tradeoff` | **L3** (revoca sandbox + rete allowlist/Edge/conferme) | M2-D15, M2-A02, M2-D16, M2-D31 | Cercata: sì — §4 (STATO_AMBIENTE ancora «solo sandbox»; gap UI pre-F13) |
| `product-owner-console` | **L3** | M2-D01…D05, D17–D20, D25 | Cercata: sì — copertura intervista incompleta (FU-CONSOLE-9) |
| `hands-on-db-ops` | **L2** (esegue plan/deploy, non progetta da zero lo SQL) | M2-D12, D13, D29 | Cercata: sì — plan header spesso restano «da eseguire» mentre DEC dice eseguito |
| `agent-governance` / standing auth | **L2→L3** | M2-D06, D21, RULE-5 | Cercata: sì — consenso pieno riduce checkpoint umani (§4) |
| `collab-workflow` (3 branch, REQ cycle) | **L2** | M2-D14, D28 | Cercata: sì — drift `env/test` vs feature (§4) |
| `onboarding-to-console` | **L2** (obiettivo L4 dichiarato, tappa 1 sola) | M2-D18, FU-CONSOLE-9 | Cercata: sì — sezioni 🔒 ancora aperte |
| `mobile-ops` | **L1–L2** | M2-D24 | Cercata: sì — invariante documentata; collaudo mobile non dimostrato in questo corpus |

---

## Sezione 4 — Contro-evidenze

1. **Ipotesi P0 «nata e abbandonata in 2 giorni» — parzialmente smentita.** Su `feature/console-super-admin` in 22–23 giugno risultano F1→F13, REQ-001…004 **ACCETTATE**, PLAN-DB-006 eseguito, test «nei panni di Matteo». Non è uno scope lasciato a metà al giorno 1: è uno **sprint chiuso in accettazione**, poi **silenzio di feature Console** (ultimo commit su `console/` e su `docs/Console-Skill`: **23-06-26**). Dopo, il branch riceve solo merge di lavoro Servizio. Utile a S4 come «scope che parte, arriva a MVP accettato, poi non viene portato a `main` / non riprende».

2. **Branch ancora aperto e non antenato di `main`.** `git merge-base --is-ancestor feature/console-super-admin main` → false. Codice `console/` esiste anche su `env/test`/`main` (tree presente), ma la storia completa decisioni DEC-052…055 e REQ-004 vive soprattutto sul feature branch.

3. **Drift documentale `env/test` (disco M2) vs feature.** Disco: 46 file, **51** DEC, REGISTRO ancora IN-SVILUPPO/attesa push, PLAN-DB-006 «da eseguire», SESSION_LOG senza F13/REQ-004. Feature: **55** DEC, 50 file Console-Skill, REQ ACCETTATE, PLAN-DB-006 ESEGUITO. Rischio: un agente che legge solo `env/test` sottostima lo stato reale.

4. **`STATO_AMBIENTE_TEST.md` (disco) dichiara ancora guard sandbox sulle scritture Edge**, mentre DEC-037/F10/F13 le hanno allargate a tutte le aziende — doc operativa **non allineata** alla decisione owner.

5. **FU-CONSOLE-10:** policy/CASCADE applicate via MCP/SQL diretto su TEST **senza** file in `supabase/migrations/` del repo — tensione diretta con la disciplina migrazioni del progetto e con RULE-3 «formalizza».

6. **DEC-013 consenso pieno:** velocità alta (F1–F7 in un giorno) ma meno gate umani; la qualità dipende dal revisore automatico (F4/F10/F11 rossi recuperati). Contro-evidenza a «Matteo controlla ogni passo».

7. **Obiettivo DEC-040 (scheda = tutta l’intervista) non raggiunto:** tappa 1 + FU-CONSOLE-9 ancora aperti — decisione owner **ORIGINATA** ma **non codificata fino in fondo** (L4 incompleto).

8. **Header PLAN-DB-002/003/004** restano «da eseguire» sul disco anche dove DEC-034/035 dichiarano esecuzione parziale — tracciabilità **dichiarata** vs **stato file** non sincronizzati.

---

## Sezione 5 — Copertura dichiarata

| Metrica | Valore |
|---------|--------|
| File nel perimetro (disco `docs/Console-Skill/`) | **46** |
| File aperti (scavo) | **46 (100%)** |
| File illeggibili / saltati | **0** |
| Extra consultati fuori perimetro disco | **git** `feature/console-super-admin` (log `console/` + `docs/Console-Skill/`; show DECISION_LOG DEC-052…055; REGISTRO; FOLLOW_UP; PLAN-DB-006; SESSION_LOG coda). **4 file** solo su feature non presenti sul disco M2 (REQ-004×2, HANDOFF×2) — dichiarati, non contati nel 46. |
| Branch di lavoro della chat | `env/test` (documentazione Console **indietro** rispetto al feature) |

Duplicati archiviati in `sessioni/2026-06-22-masterplan-console-F1-F7/` trattati come snapshot F1–F7 (stesso contenuto vivo, taglio temporale più vecchio).

---

## Sezione 6 — Lacune e handoff

| Lacuna | Serve a |
|--------|---------|
| Parole verbatim di Matteo su DEC-008…042, consenso, revoca RULE-2 | **H2/H3** (giugno) — peso 1 |
| Report pubblici sessioni 22–24 giugno sul pezzo Console | **A10** |
| Conferma se/quando Console è stata usata in vendita reale post-23-06 | **H5 / S5** (buco luglio) + **J1** (merge/main) |
| Allineamento migrazioni Console in repo vs solo remoto TEST | **J1** + **M3** (Database-Skill) |
| REQ-004 e handoff Fase C solo su feature | eventuale nota in **AGG** / rilettura feature se S1 vuole DEC-053…055 |
| Confronto RULE-1 Console ↔ salvaguardie PROD in Comunicazione-Skill | **M1** (già parallelo concettuale) |
| Esito «ACCETTATA» firmato da Cristiano «nei panni di Matteo» ≠ test di Matteo | **S4** attribuzione acceptance |

---

## Sezione 7 — Chiusura verso Matteo

In due giorni di giugno hai fatto nascere un pannello privato per gestire i ristoranti su ambiente di prova (lista, accessi, scheda cliente, crea/elimina), con regole forti: solo prova, mai produzione, e le modifiche pericolose dietro conferma «riscrivi il nome».

Hai allargato tu lo scope da «solo due ristoranti di prova» a «tutte le aziende di prova», e hai messo le mani sul database e sul deploy quando serviva.

Poi il lavoro si è fermato lì: il pezzo è accettato sul branch dedicato, ma non risulta portato avanti come prodotto quotidiano né chiuso del tutto sul ramo principale — e una parte della documentazione sul ramo di test è rimasta indietro rispetto a quel branch.
