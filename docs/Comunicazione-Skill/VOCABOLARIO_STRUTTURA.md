# Struttura Vocabolario — Due profili (Matteo + Cristiano)

> **Per orchestratori e agenti:** come capire quale vocabolario usare e come i due profili divergono (pur usando gli stessi termini).

---

## Due vocabolario, stessa base

### VOCABOLARIO.md (Matteo)
**Uso:** main, env/test  
**Chi lo carica:** agenti nel ramo PrenotaZen (Matteo, Opus)  
**Stile:** rapido, decisionale, diretta al business

### VOCABOLARIO_CRISTIANO.md (Team console)
**Uso:** feature/console-super-admin  
**Chi lo carica:** agenti nel ramo Console (Cristiano, team)  
**Stile:** strutturato, analitico, focus tecnico

---

## Cosa significa "stesso vocabolario, stili diversi"

### Esempio: «ragioniamo»

**Matteo dice: «ragioniamo sulla RLS»**

VOCABOLARIO.md (Liv. 1):
```
### «ragioniamo» — Liv. 1
- **Intende:** fermati e analizza il problema (non implementare subito)
- **Comportamento agente:** (1) spiegazione rapida 1-2 min, (2) diagramma ASCII semplice, (3) tabellina pro/contro, (4) proposta azione — totale 3-4 min
- **Livello:** 1 (automatico — Matteo sa il ritmo)
```

**Cristiano dice: «ragioniamo sulla RLS»**

VOCABOLARIO_CRISTIANO.md (Liv. 1, stessa voce, note diverse):
```
### «ragioniamo» — Liv. 1 (Cristiano)
- **Intende:** fermati e analizza il problema a fondo
- **Comportamento agente:** (1) spiegazione dettagliata 5-10 min con pseudocode, (2) albero decisionale, (3) schema RLS dettagliato, (4) test cases → totale 10-15 min
- **Livello:** 1 (automatico — Cristiano preferisce profondità)
- **Nota Cristiano:** stile debug. Team console = debugging complesso, non basta "suggerimento rapido"
```

**Risultato:** stesso comando, ritmi diversi, entrambi funzionano.

---

## Termini comuni (usano entrambi)

Questi termini vanno in **VOCABOLARIO.md** (Matteo):

| Termine | Liv. | Profilo | Entrambi |
|---------|------|---------|---------|
| **implementa / fai** | 1 | Esecuzione | ✅ |
| **ragioniamo** | 1 | Riflessione | ✅ |
| **revisiona / verifica** | 1 | Testing | ✅ |
| **lavoro ok** | 1 | Chiusura | ✅ |
| **dammi follow up** | 1 | Finale | ✅ |
| **prepara prompt** | 1 | Filtro | ✅ |

Quando Cristiano usa «ragioniamo», agente carica VOCABOLARIO_CRISTIANO.md e applica **il comportamento diverso**.

---

## Termini specifici Cristiano (aggiuntivi)

Se durante il development console Cristiano conia nuovi termini, vanno in **VOCABOLARIO_CRISTIANO.md** (non nel main):

Esempio (ipotetico):
```
### «debug profondo» — Liv. 1 (Cristiano - Console only)
- **Intende:** entra in modalità investigativa pesante (non fare, analizzare)
- **Comportamento agente:** log completi, trace RLS, SQL explain, 20+ min se serve
- **Livello:** 1 (Cristiano sa quando lo vuole)
```

**Matteo non userà mai «debug profondo»** — ha altri comandi («investigua», etc.).

---

## Come gli agenti scelgono il vocabolario giusto

### Agente in main / env/test
```
Leggi .claude/CLAUDE.md
  ↓
"Carica docs/Comunicazione-Skill/VOCABOLARIO.md"
  ↓
Quando Matteo parla: usa Liv., comportamenti in VOCABOLARIO.md
```

### Agente in feature/console-super-admin
```
Leggi .claude/CLAUDE.md (personalizzato per console)
  ↓
"Carica docs/Comunicazione-Skill/VOCABOLARIO.md + VOCABOLARIO_CRISTIANO.md"
  ↓
Quando Cristiano parla: 
  - Se il termine è in VOCABOLARIO_CRISTIANO → usa quello
  - Altrimenti → fallback a VOCABOLARIO.md
```

---

## Struttura file

```
docs/Comunicazione-Skill/
├── VOCABOLARIO.md                  ← Matteo (main)
├── VOCABOLARIO_CRISTIANO.md        ← Cristiano (console) 
├── VOCABOLARIO_STRUTTURA.md        ← Questo file
├── CHIUSURA_SESSIONE.md            ← Uguale per entrambi
└── (altri file)
```

---

## Regola di priorità (per agenti)

Se la stessa parola compare in due file:

1. **VOCABOLARIO_CRISTIANO.md ha priorità** (più specifico per il contesto)
2. **Altrimenti:** VOCABOLARIO.md (fallback di base)

Esempio:
- «ragioniamo» in VOCABOLARIO.md → comportamento Matteo (rapido)
- «ragioniamo» in VOCABOLARIO_CRISTIANO.md → comportamento Cristiano (dettagliato)
- Agente in console legge CRISTIANO prima → usa il comportamento Cristiano

---

## Aggiornamento nel tempo

### Matteo aggiorna VOCABOLARIO.md
Quando introduce nuova voce o cambia live del Matteo.

### Cristiano aggiorna VOCABOLARIO_CRISTIANO.md
Quando introduce voce nuova per team console o cambia live del team.

**Sincronizzazione:** periodicamente (fine milestone), Matteo legge VOCABOLARIO_CRISTIANO e decide se portare nuove voci nella main (se riutilizzabili).

Esempio:
```
«debug profondo» (solo Cristiano) → Matteo lo valuta, 
se lo vuole per PrenotaZen → lo importa in VOCABOLARIO.md
```

---

## Checklist: Quando il branch console nasce

- ✅ Cristiano legge VOCABOLARIO.md (base comune)
- ✅ Team prepara VOCABOLARIO_CRISTIANO.md (una copia base iniziale, vuoto di specifiche)
- ✅ Nel branch feature/console-super-admin, .claude/CLAUDE.md dice: "Carica VOCABOLARIO.md + VOCABOLARIO_CRISTIANO.md"
- ✅ Quando Cristiano introduce prima voce nuova → aggiorna VOCABOLARIO_CRISTIANO.md

---

**Versione:** 23-06-2026  
**Autore:** Matteo
