# Vocabolario — branch Console (Cristiano)

> Le **parole** di Cristiano → comportamento dell'agente. Fonte di verità dei comandi su questo
> branch. **Livelli:** Liv. 1 = applica subito · Liv. 2 = applica, ma se ambiguo una domanda breve
> prima · Liv. 3 = chiedi sempre conferma.
>
> Le parole riusate dal sistema di Matteo mantengono lo stesso significato; ne abbiamo aggiunta
> **una sola** nuova: «plan per matteo».

---

## Parole-comando

| Parola | Comportamento | Liv. |
|--------|---------------|------|
| **prepara** / **prepara prompt** | NON eseguire codice; consegna solo il prompt pronto per un altro agente. | 1 |
| **implementa** / **fai** / **crea** / **aggiungi** | Profilo Esecuzione: carica la bussola Console + il `context/` giusto e scrivi codice **in `console/`**. | 1 |
| **revisiona** / **verifica** / **debugga** / **non funziona** | Profilo Verifica: gira i test + controlla. | 1 |
| **spiegamelo semplice** | Risposta breve, effetto concreto, niente gergo. | 1 |
| **ragioniamo** | Fermati: spiegazione + effetto per te + tabellina + checklist, prima di agire. | 1 |
| **lavoro ok** | Scrivi/aggiorna il report in `sessioni/` + `SESSION_LOG.md`, **senza commit**. | 1 |
| **fai report finale** | Report completo **+ commit** sul branch (mai push/merge senza ok). | 2 |
| **dammi follow up** | Solo il prompt per la prossima chat. | 1 |
| **🆕 plan per matteo** | Genera un file `plan-per-matteo/PLAN-DB-…` con la modifica DB/schema proposta. **NON** esegue scritture di schema. | 1 |
| **🆕 allinea console** | Passa in rassegna `docs/Console-Skill/`: rendi i puntatori coerenti con la **struttura reale** (file che esistono davvero), elimina doppioni/file-fantasma, tieni la doc snella. Se l'ambito è ampio, una domanda breve prima. | 2 |

---

## Profilo e stile Cristiano (come si applicano i comandi)

Stesso vocabolario di Matteo, **profondità maggiore** perché il lavoro tocca DB/RLS/Edge/permessi:

- **«ragioniamo»** → analisi profonda (pseudocode, albero decisionale, trace RLS), non sintesi rapida.
- **«implementa»** → **test + doc obbligatori** prima del push (non facoltativi).
- **«revisiona»** → **security + performance**, non solo funzionale.
- **Debug** → log strutturato + SQL explain + audit RLS (mai `console.log`).

---

## Regole sempre attive (non sono parole-grilletto)

Valgono sempre, anche senza che Cristiano le nomini:

1. **Solo TEST** `docnnernvp`; `get_project_url` prima di ogni scrittura DB.
2. **Scrivo solo** sui sandbox `console-classic`/`console-pro`.
3. **Schema → plan per matteo** (mai DDL dall'agente).
4. **Codice solo in `console/`**; `src/`/`supabase/` sola lettura.
5. **Stile didattico**: breve + «cosa cambia per te».
6. **Comando non riconosciuto → non dedurre, chiedi prima.** Mai inventare voci di vocabolario.

---

## Come cresce questo vocabolario

Se Cristiano usa spesso una parola non mappata, l'agente la **propone** (non la applica da solo):
la segnala a fine sessione come candidata, con livello prudente (Liv. 3) finché non si dimostra
affidabile. Mai promuovere una voce senza conferma.
