# Report fine sessione — Modalità light/standard/deep + EVOLUZIONE skill system

**Data:** 29-05-26
**Profilo agente:** Meta (skill system)
**Modalità:** deep (tocca regole strutturali: protocollo §7, PREPARA_PROMPT, template v0, nuovo file evoluzione)
**Codice app:** nessuna modifica a `src/`
**Test:** N/A (sessione solo skill system / docs)
**Storage DB:** nessuna modifica

---

## In 3 righe (milestone M2)

- **Cosa è cambiato:** lo skill system ora ha 3 cose nuove — la modalità light/standard/deep (i fix piccoli non pagano più il report pesante), un file roadmap `EVOLUZIONE_SKILLS.md` con due livelli Meta (junior annota / senior sviluppa), e il cappello a 3 righe in cima ai report (questo).
- **Cosa resta:** M1/M3/M4 in attesa di dati raccolti; M5 statistiche da impostare; nessun FU di codice.
- **Serve una tua azione:** sì — confermi il commit dei file `docs/`?

---

## Sintesi per Matteo

In questa sessione:
1. **Valutato il lavoro dell'agente** sullo skill system (analisi + template + snellimento §4):
   verificato sul campo che le sue affermazioni reggono e che lo skill system **è migliorato**.
   Chiarito l'equivoco «6/10 prontezza»: l'agente vedeva lo scheletro vuoto (v0), non il tuo sistema
   compilato — distinzione gestita correttamente da lui.
2. **Aggiunta la modalità light / standard / deep**: ogni task ora ha un peso, così i fix piccoli
   smettono di pagare il protocollo completo (era il rischio #1: «sistema troppo procedurale»).
3. **Creato `EVOLUZIONE_SKILLS.md`**: roadmap del sistema con milestone M1-M5 e due livelli Meta
   (junior Cursor annota idee / senior Opus analizza e sviluppa). Applicato subito M2-minimo (cappello
   3 righe nei report). M1/M3/M4 lasciati in attesa di dati — scelta deliberata, non pigrizia.
3. **Allineato il template vuoto** `_skill-system-v0/` e reso la modalità una **pratica per gli
   agenti Meta** (chi mantiene lo skill system la cura nel tempo).

---

## Cosa è stato fatto (cronologico)

1. Lettura dell'ultimo report non ancora visto (template v0 + snellimento APP_CONTEXT §4).
2. **Verifica sul campo** (non solo lettura): §4 senza Nota residue, 3 file di contesto esistenti
   (212/73/41 righe), dettagli tecnici usciti da APP_CONTEXT e non duplicati, template gitignored,
   link 7/7 OK. Tutto confermato.
3. Decise con Matteo (a opzioni) le 3 regole della modalità: chi decide, trigger deep, parola sì/no.
4. Scritta la regola in `PREPARA_PROMPT_SKILL.md` § 1.A (classificazione) e in `APP_CONTEXT_SKILL.md`
   § 7.1 (effetto sul protocollo di chiusura) — collegate, sennò l'etichetta «light» non avrebbe effetto.
5. Allineato il template `_skill-system-v0/`: nuova §6 Bussola, compito Meta #6, header report.

## File toccati e perché (linguaggio utente)

- **`PREPARA_PROMPT_SKILL.md`** — l'agente di consulto iniziale ora, oltre a preparare il prompt,
  assegna il «peso» del task (light/standard/deep) e lo scrive nel prompt. È una classifica interna:
  Matteo non deve dire nulla.
- **`APP_CONTEXT_SKILL.md` §7.1** — a fine task il report ora si modula: un fix piccolo chiude con 1
  riga nel log invece di un file report da 180 righe; il protocollo pieno resta solo per i task deep.
- **`_skill-system-v0/` (BUSSOLA §6, REVISIONE compito #6, header report)** — i progetti futuri
  partono già con questa pratica; gli agenti Meta sanno che devono tenerla tarata.
- **`PROPOSTE.md`** — registrata la decisione in Archivio.

## Decisioni prese (con Matteo, a opzioni)

| Tema | Decisione |
|------|-----------|
| Chi decide la modalità | Prepara-prompt classifica; l'esecutore può solo **alzarla**, mai abbassarla |
| Trigger deep automatici | DB/migrazioni/prod/RLS · file LOCK · >1 view o nuovo componente · auth/login/pagamenti |
| Parola-trigger di Matteo | No — classificazione interna, nessuna parola nuova da ricordare |
| Dove vive | PREPARA_PROMPT (classifica) + APP_CONTEXT §7 (effetto) + template v0 (pratica Meta) |
| Evoluzione sistema | File unico `EVOLUZIONE_SKILLS.md`; junior annota / senior sviluppa; raccolta spontanea, analisi on-demand quando Matteo la lancia |
| Milestone iniziali | M1-M5 attive + future (catene comandi, issue/PR, metriche); M2 applicata subito, M1/M3/M4 in attesa dati |

## Valutazione skill system (richiesta di Matteo)

- **Le affermazioni dell'agente reggono** (verificate sul campo, non solo dal report).
- **Lo skill system è migliorato**: la §4 era un muro di 100+ righe; ora un agente carica solo il
  file di contesto della sua zona. Risparmio reale di contesto per sessione.
- **Equivoco «template/6-10»**: l'agente vedeva la v0 vuota, non il sistema compilato. Ha risolto da
  sé separando le due cose (sistema reale snellito + kit vuoto riusabile). Mossa corretta.
- **Restava scoperto** il punto debole #5 (task piccolo vs sessione lunga) → chiuso da questa sessione
  con la modalità.

## Test eseguiti

Nessun `npm run validate` (solo docs/skill, nessun `src/`). Verifiche fatte: esistenza file di
contesto, assenza Nota residue in §4, assenza duplicazione dettagli (`100cqw`/portal: 0 in
APP_CONTEXT, 3 nel context file), template gitignored, righe APP_CONTEXT (403, §4 snella).

## File di skill aggiornati (§7.2)

| File | Modifica (breve) | Perché |
|------|------------------|--------|
| `docs/PREPARA_PROMPT_SKILL.md` | +§1.A «Peso sessione light/standard/deep» con trigger deep + regola alza-non-abbassa | Classificazione a monte |
| `docs/APP_CONTEXT_SKILL.md` | §7.1 modula il protocollo per modalità; +cappello report 3 righe (M2) | Effetto modalità + report a colpo d'occhio |
| `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` | **Nuovo** — roadmap M1-M5 + log idee + due livelli Meta | Richiesta Matteo: dividere raccolta (junior) da sviluppo (senior) |
| `docs/Comunicazione-Skill/REVISIONE.md` | +sezione evoluzione sistema (junior annota / senior sviluppa) | Collegare il ruolo Meta al file evoluzione |
| `docs/Comunicazione-Skill/PROPOSTE.md` | +voce Archivio modalità accettata | Tracciare decisione |
| `_skill-system-v0/00_BUSSOLA_SKILL.md` | +§6 modalità + nota agenti Meta | Allineare template |
| `_skill-system-v0/comunicazione/REVISIONE.md` | +compito Meta #6 (modalità) + #7 (evoluzione junior/senior) | Pratica per meta agenti |
| `_skill-system-v0/comunicazione/EVOLUZIONE_SKILLS.md` | **Nuovo** — stesso file con segnaposto | Allineare template |
| `_skill-system-v0/sessioni/_TEMPLATE_REPORT.md` | +riga Modalità + cappello M2 3 righe | Allineare template |
| `_skill-system-v0/README.md` + `MANUALE_AVVIO.md` | +EVOLUZIONE nell'albero file e nel passo manutenzione Meta | Rendere scopribile il nuovo file |
| `docs/Sessioni di lavoro/29-05-26/Report-modalita-…` | Questo report | §7.1 |
| `docs/SESSION_LOG.md` | +riga sessione | Cronologia |

> Il template `_skill-system-v0/` è gitignored: NON entra nei commit (kit personale).

## Dati comunicazione

### Frasi / richieste ricorrenti (con conteggio)

| Frase / intento | × | Comportamento desiderato |
|-----------------|---|--------------------------|
| «valuta il lavoro dell'agente, è migliorato o no?» | 1 | Verifica indipendente sul campo, non fiducia al report |
| «considera che ho appena fatto modifiche, l'agente vedeva la v0» | 1 | Distinguere stato attuale da ciò che l'agente analizzava |
| «aggiungiamo light/standard/deep nel prepara prompt» | 1 | Collocazione nell'agente di consulto iniziale |
| «aggiungila come pratica per meta agenti» | 1 | La regola va anche nel ruolo Meta, non solo nell'esecuzione |
| «cosa ne pensi?» | 2 | Vuole il mio parere critico, non solo esecuzione |
| «fai report finale» | 1 | Trigger protocollo §7 |

### Spiegazioni / formato che ha funzionato

- **Verifica «non mi fido del report, controllo»** con comandi reali (grep/wc) → ha dato peso alla
  valutazione. Matteo apprezza il controllo indipendente sui claim di altri agenti.
- **«La modalità deve vivere in 2 punti»** spiegato con causa-effetto («sennò l'etichetta light non
  ha effetto, l'esecutore fa comunque il report pesante») → ha chiarito perché non bastava PREPARA.
- Conferma pattern noto: Matteo decide dopo aver capito il **meccanismo** + il **rischio**.

### Procedure ripetute

- Domande a opzioni con raccomandazione + impatto.
- Verifica sul campo dei claim di un altro agente prima di valutarlo.

### Pattern nuovi (candidati)

- «valuta il lavoro di [agente X]» → profilo Verifica applicato allo skill system, non al codice:
  controllo indipendente dei claim + verdetto migliorato/no. Possibile voce futura se ricorre.

### Token risparmiabili

- La modalità stessa è il più grande risparmio strutturale: i fix light non generano più un file
  report. Stima: la maggioranza dei task quotidiani è light/standard.

### Cosa non è successo in chat

| Tipo | Dettaglio |
|------|-----------|
| Test non eseguiti | Solo docs, nessun validate |
| Commit non ancora fatto | Proposto sotto |
| Codice src toccato | Nessuno |
| Voci vocabolario nuove | Nessuna (modalità = regola, non parola) |

## Derivazione errori

| Causa | Cosa è successo | Da cosa derivava | Come si è evitato |
|-------|-----------------|------------------|-------------------|
| nessuna | Sessione lineare, decisioni a opzioni chiare | — | — |

Nessun bug, prompt ambiguo, errore agente o vincolo strutturale in questa sessione.

## Cosa resta per la prossima sessione

- **Osservare la modalità all'uso**: il rischio è che gli agenti mettano «deep per sicurezza»
  vanificando il risparmio. Se succede, una sessione Meta stringe i criteri (compito #6 REVISIONE).
- Nessun nuovo FU di codice. FU esistenti (FU-001/002/003) invariati.

## Commit proposti (su conferma)

```text
docs(skill-system): aggiunge modalità sessione light/standard/deep

Review:
- docs/Sessioni di lavoro/29-05-26/Report-modalita-light-standard-deep-29-05-26.md
- docs/PREPARA_PROMPT_SKILL.md (§1.A classificazione)
- docs/APP_CONTEXT_SKILL.md (§7.1 effetto chiusura)
- docs/Comunicazione-Skill/PROPOSTE.md (Archivio)
- docs/SESSION_LOG.md
```

> File `docs/` richiedono `git add -f`. Il template `_skill-system-v0/` è gitignored — non entra nel commit.

---

*Report redatto a conferma «fai report finale» di Matteo. Modalità: deep.*
