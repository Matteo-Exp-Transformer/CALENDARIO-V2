# Nota per Meta senior — smoke esecutore vs Agente Matteo (03-09-26)

> **Cosa è.** Scheda da aprire in una chat **Meta senior** (`REVISIONE.md`). Non è un report di esecuzione e **non promuove regole**. Annotazione chiesta da Matteo in chat prepara-prompt.

## Cosa è successo

Dopo il **Prompt 1** (fix Menu QR pubblico + import modale QR + form magazzino + tetti 7/12), l’agente **esecutore** ha fatto **smoke test** in browser.

Matteo, 03-09-26 (verbatim):

> sia che lo ha fatto fuori scope, sia che glie lo hai detto tu, non è il comportamento che voglio. smoke lo fa agente matteo. esecutore fa solo il fix e controlla che i test passino.

## Chi ha detto cosa (onestà)

- **Sì, glielo ha detto il prepara-prompt.** Nel Prompt 1 c’erano: URL smoke `/menu/da-tommaso/qr/sbmm42t`, criterio di fatto a video (home senza pill, categoria con barra in basso, niente footer data/ora, import occhio aperto, form aperto dopo salva), e verifica su 375 / 834 / 1280.
- **Sì, lo skill glielo fa dire.** `PREPARA_PROMPT_SKILL.md` §1.B: sui task UI il prompt esecutore deve chiedere che il comportamento sia «verificato sulle 3 view».
- Lo stesso giorno il prepara-prompt ha scritto anche un **prompt di revisione** che chiede QA manuale TESTING §8 al profilo **Verifica**. Matteo ha corretto l’esecutore; il Verifica **non** è stato nominato — da chiedere in senior.

## Comportamento voluto (da ratificare, oggi non è regola)

| Ruolo | Deve | Non deve |
|-------|------|----------|
| **Esecutore** | Fix + test automatici verdi (`npm run validate` / Vitest del pezzo) | Smoke browser, QA viewport, «provare come un utente» |
| **Agente Matteo** | Smoke / collaudo a video | — |
| **Prepara-prompt** | URL smoke nel mandato come *bersaglio da non confondere* (gate Prenota↔QR) e passi in checklist flussi | Ordine all’esecutore di aprire il browser |

Canale già esistente per lo smoke umano: `docs/_lavoro/Per matteo/Test e2e/CHECKLIST_FLUSSI_DA_TESTARE.md` (esecutore scrive i passi, Matteo mette la X) — EVOLUZIONE_SKILLS 19-06-26.

## Conflitto da sciogliere (tre owner sullo stesso smoke)

1. **PREPARA §1.B** — 3 view nel mandato **esecutore**.
2. **TESTING §8** — QA browser obbligatorio sul profilo **Verifica**.
3. **Checklist flussi + questa correzione** — smoke = **Agente Matteo**.

Finché 1 resta, il prossimo prepara-prompt *ripeterà* l’ordine di smoke all’esecutore. Markdown nuova senza superamento di §1.B non basta (Playbook: regola già presente e in conflitto).

## Cosa chiedere a Matteo in senior (max 2)

1. Confermi: esecutore = solo fix + test automatici, per **tutti** i task UI (non solo questo ciclo)?
2. Il profilo **Verifica** tiene il QA browser §8, o anche quello passa ad Agente Matteo?

## File già annotati (questa chat, nessuna riforma)

- `docs/Comunicazione-Skill/ERRORI_PROCESSO.md` — log 03-09-26
- `docs/Comunicazione-Skill/OSSERVAZIONI.md` — sessione 03-09-26
- `docs/Comunicazione-Skill/EVOLUZIONE_SKILLS.md` — Log idee
- `docs/FOLLOW_UP.md` — `FU-METODO-SMOKE-ESECUTORE-1` (aperto, da decidere; non è cantiere codice)

## Blocco da incollare in chat Meta senior

```
Profilo: Meta
Mandato: ratifica di processo, non codice app.

Matteo ha corretto (03-09-26): dopo un Prompt 1 di fix Menu QR, l’esecutore ha fatto smoke. Non lo vuole. Smoke = Agente Matteo. Esecutore = fix + test automatici verdi.

Il prepara-prompt glielo aveva chiesto (criterio di fatto + 3 view). PREPARA_PROMPT §1.B lo impone. TESTING §8 mette il QA browser sul Verifica. La checklist flussi è già il canale umano.

Leggi: docs/Sessioni di lavoro/03-09-26/Nota-senior-smoke-esecutore-03-09-26.md
+ ERRORI_PROCESSO 03-09-26 + OSSERVAZIONI 03-09-26 + FU-METODO-SMOKE-ESECUTORE-1.

Decidi con Matteo se superare PREPARA §1.B e cosa resta al Verifica. Non promuovere da questa chat senza il suo ok. Max 2 domande.
```
