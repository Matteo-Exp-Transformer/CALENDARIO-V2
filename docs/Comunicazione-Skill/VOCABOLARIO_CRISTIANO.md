# VOCABOLARIO CRISTIANO — Parole/frasi per team console → comportamento agente

> **Per il team sviluppo console nel branch feature/console-super-admin.**
>
> **Base condivisa:** questo vocabolario riusa **tutte le voci di base** dal VOCABOLARIO.md (Matteo).
> **Qui aggiunge:** note di stile specifiche per Cristiano + il team console, e eventuali voci nuove (solo console).

---

## Come usare questo file

### Step 1: Leggi VOCABOLARIO.md (base comune)
Tutte le voci principali («implementa», «ragioniamo», etc.) sono già lì. Questo file **non le replica** — le assume come valide.

### Step 2: Leggi questo file (personalizzazione per console)
Qui trovi:
- **Note di stile** su come gli agenti devono comportarsi con Cristiano (ritmo, profondità, linguaggio)
- **Voci nuove specifiche console** (se Cristiano conia termini che non usano in PrenotaZen)
- **Override di Liv.** solo dove diverge da Matteo (raro)

### Step 3: Agenti in feature/console-super-admin caricano entrambi
```
Carica: VOCABOLARIO.md + VOCABOLARIO_CRISTIANO.md
Priorità: Se la voce compare in VOCABOLARIO_CRISTIANO → usa quello (più specifico)
Altrimenti: Fallback a VOCABOLARIO.md
```

---

## Profilo Cristiano (team console)

### Cosa caratterizza il team console
- **Debugging e integrazione**: tocca DB (RLS, schema), Edge function (validazione server), ruoli/permessi
- **Approccio**: strutturato, test-driven, documentazione completa
- **Ritmo**: più lento di Matteo (bene), più profondità (serve)
- **Comunicazione**: tecnico, meno «intuitivo», più «provato»

### Conseguenze nel vocabolario
- «ragioniamo» = **15 min**, pseudocode, alberi decisionali, trace RLS (non 3-4 min rapido)
- «implementa» = **test e doc obbligatori** prima di push (non facoltativo come in PrenotaZen)
- «revisiona» = **security + performance** (non solo functional)
- Debug = **log strutturato + SQL explain + RLS audit** (non console.log)

---

## Voci comuni (con note stile Cristiano)

### «implementa» · «sistema» · «fai» · «nuova feature» · «aggiungi» · «crea» — Liv. 1
**Base:** VOCABOLARIO.md (stessa voce, Matteo)

**Nota Cristiano (team console):**
- Comportamento agente = **entra in profilo Esecuzione** come Matteo, MA:
  - ✅ Carica la skill dell'area console (non PrenotaZen)
  - ✅ **Test obbligatorio** prima di push (integration test, non solo unit)
  - ✅ Se tocca DB/RLS: **audit RLS + documenta le regole** (riga nel codice + file context)
  - ✅ Se Edge function: **log strutturato** (type hints, batch non wild)
  - ✅ Dopo implementazione: **push NON diretto** — comunica a Matteo per validazione

**Approvata il:** 23-06-2026 (nota aggiunta, Cristiano + Matteo accordo)

---

### «ragioniamo» · «Ragioniamo» — Liv. 1
**Base:** VOCABOLARIO.md (stessa voce, Matteo — 3-4 min rapido)

**Nota Cristiano (team console):**
- Comportamento agente = **formato strutturato** (come Matteo), MA con **profondità diversa**:
  1. **Spiegazione dettagliata** — 5-10 min, pseudocode, non 1 min
  2. **Albero decisionale** — se la logica ha branch multipli (es. RLS, migrazioni)
  3. **Pseudocode/SQL** — per DB/Edge, non solo prosa
  4. **Trace di esecuzione** — "se accade X allora Y" con esempi dati reali
  5. **Checklist problemi potenziali** — non dimenticare edge case
  
- **Totale:** 10-15 min (è **console/debug**, non product design)

**Approvata il:** 23-06-2026 (divergenza di ritmo approvata, giustificata da scope)

---

### «revisiona» · «controlla» · «verifica» · «debugga» · «trova il bug» · «non funziona» — Liv. 1
**Base:** VOCABOLARIO.md (Liv. 1, Matteo)

**Nota Cristiano (team console):**
- Comportamento agente = entra in profilo Verifica come Matteo, MA:
  - ✅ Esegui `npm run validate` come criterio oggettivo
  - ✅ **Aggiungi check di sicurezza**: RLS non è violata, credenziali non loggano, query non N+1
  - ✅ **Performance review**: Edge function non timeout, loop su DB ben filtrati
  - ✅ **Test**: se manca test di integrazione per il flusso, segnala
  - ✅ Se trovi un difetto logico anche a verde → **fermati e segnala come blocker**

**Approvata il:** 23-06-2026 (allargato scope a security + performance, giustificato da console)

---

### «revisione completa» — Liv. 1
**Base:** VOCABOLARIO.md (Liv. 1, Matteo)

**Nota Cristiano (team console):**
- Comportamento agente = check critico e indipendente (come Matteo), MA:
  - ✅ Check funcionalità (al solito)
  - ✅ **Check RLS** — autorizzazione coerente con modello (admin vede tutti gli utenti? Tenants separati?)
  - ✅ **Check migrazioni** — schema conseguente, GRANT/RLS presenti, niente broken constraints
  - ✅ **Check Edge** — input validation, error codes corretti, niente info leak
  - ✅ **Mai approvare a test verdi se trovi un dubbio su RLS o sicurezza** — segnala

**Approvata il:** 23-06-2026 (stessi principi Matteo, scope specifico console)

---

### «debug profondo» — Liv. 1 (SOLO Cristiano)
**Nuova voce (non in VOCABOLARIO.md Matteo)**

- **Intende:** non fare, analizzare a fondo quando una cosa è strana/bloccata
- **Comportamento agente:**
  1. **Log strutturato** — non `console.log`, usa `logger.debug` con context
  2. **SQL explain** — se query lenta, `EXPLAIN ANALYZE`
  3. **RLS audit** — chi accede, che ruolo, che policy scoppia?
  4. **Trace client-server** — browser dev tools → network → request/response full
  5. **Pseudocode esecuzione** — "passo 1 X accade, passo 2 Y non capisco, perché?"
  6. **Riproducibilità** — fornire exact steps + dati test
  
- **Livello:** 1 (automatico — Cristiano sa quando lo vuole)
- **Casi identici già ok:** —
- **Approvata il:** 23-06-2026 (voce nuova, team console specifica)

---

### «implementa test» — Liv. 1 (SOLO Cristiano)
**Nuova voce (non in VOCABOLARIO.md Matteo)**

- **Intende:** scrivi test (non solo fix codice)
- **Comportamento agente:**
  1. **Test d'integrazione** — almeno 1 test che verifica il flusso end-to-end
  2. **Test RLS** — se tocchi schema, test che RLS blocca l'accesso non autorizzato
  3. **Test Edge** — se scrivi Edge function, test su Supabase (non locale)
  4. **Coverage minimo** — 80% per nuovi file (rara eccezione: helper puri)
  5. **Doc nel test** — commento che spiega l'edge case che testa

- **Livello:** 1 (automatico — il team console testa sempre)
- **Approvata il:** 23-06-2026 (obbligatorio per team console, Matteo approva)

---

### «comunicazione team console» — Liv. 1 (SOLO Cristiano)
**Nuova voce (non in VOCABOLARIO.md Matteo)**

- **Intende:** aggiorna il team console su status, blocchi, decisioni
- **Comportamento agente:** scrivere un breve report in formato Cristiano:
  ```
  ✅ Fatto: X
  ⏳ In corso: Y
  🔴 Blocco: Z (motivo: …, richiede: …)
  ❓ Domanda per Matteo: …
  ```
  Carica in cartella `docs/Console-Skill/sessioni/` con timestamp.

- **Livello:** 1 (automatico — team deve sapere lo status)
- **Approvata il:** 23-06-2026 (voce nuova, trasparenza team)

---

### «aggiorna skill console» — Liv. 1 (SOLO Cristiano)
**Nuova voce (non in VOCABOLARIO.md Matteo)**

- **Intende:** il team console scopre un pattern nuovo, lo documenta nella propria skill system
- **Comportamento agente:**
  1. Non aggiungere a VOCABOLARIO.md (è Matteo)
  2. **Aggiorna CONSOLE_SKILL_SYSTEM.md** (entry point locale)
  3. Aggiorna **CONSOLE_DB_CONTEXT.md** (se pattern è DB/RLS)
  4. Aggiorna **skill d'area console** (se pattern è specifico, es. USER_MANAGEMENT_SKILL.md)
  5. Documenta con **decision rationale** (perché scegli questa strada, cosa evita)

- **Livello:** 1 (automatico — il team deve evolvere il sistema)
- **Approvata il:** 23-06-2026 (voce nuova, skill system evolve in parallelo)

---

## Stile di comunicazione (Cristiano vs Matteo)

| Aspetto | Matteo | Cristiano |
|---------|--------|-----------|
| Ritmo «ragioniamo» | 3-4 min | 10-15 min |
| Pseudocode | No (prosa) | Sì (pseudocode per DB/Edge) |
| Test | Facoltativo | **Obbligatorio** |
| Debug | Rapido | Profondo (log strutturato) |
| Security | Standard | **Esplicito** (RLS audit) |
| Doc | Minima | **Completa** (decision, trace) |

---

## Regola di fallback (identica a VOCABOLARIO.md)

Quando Cristiano usa una parola **non mappata**:

1. **C'è una voce Liv. 1 qui** → usala direttamente
2. **Non c'è, ma c'è una Liv. 1 in VOCABOLARIO.md** → usala (fallback)
3. **Resta solo una Liv. 2/3** → segui il comportamento Liv. 2/3
4. **Non sai** → fai domanda a Cristiano per approvare + aggiorna il vocabolario subito

---

## Checklist agenti in feature/console-super-admin

- ✅ Carico VOCABOLARIO.md (base)
- ✅ Carico VOCABOLARIO_CRISTIANO.md (override)
- ✅ Quando Cristiano parla, controlla qui primo (priorità)
- ✅ Se Cristiano usa parola non mappata, chiedo (e aggiorno il vocabolario)
- ✅ Stile: profondità > velocità (console ≠ product feature)
- ✅ Test obbligatorio prima di push
- ✅ Comunico status a Matteo regolarmente

---

## Differenza con VOCABOLARIO.md (quick reference)

| File | Per chi | Scope | Ritmo |
|------|---------|-------|-------|
| **VOCABOLARIO.md** | Matteo (PrenotaZen) | App principale | Veloce |
| **VOCABOLARIO_CRISTIANO.md** | Cristiano (console) | Console super-admin | Profondo |
| **Entrambi usano** | Tutti | Termini comuni | — |

---

**Versione:** 23-06-2026  
**Autore:** Matteo  
**Validato da:** Cristiano (team console)
