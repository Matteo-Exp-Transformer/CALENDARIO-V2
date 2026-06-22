# Collaborazione — Team Console ⟷ Matteo

> Indice della cartella. Qui vivono **il processo di lavoro** e **la lavagna delle richieste** tra il
> Team console (sviluppo su `feature/console-super-admin`) e Matteo (test su `env/test`, rilascio su `main`).

---

## Processo (leggi questi)

| File | A cosa serve | Chi lo legge |
|------|--------------|--------------|
| **WORKFLOW.md** | **Fonte di verità del processo:** i 3 branch, i comandi git giusti, il ciclo per-richiesta (avvio/chiusura), conflitti, convenzioni commit. | Team + Matteo |
| **REGISTRO_RICHIESTE.md** | La **lavagna**: una riga per richiesta con stato. Per sapere "a che punto siamo" si guarda qui. | Team + Matteo |
| **STATO_AMBIENTE_TEST.md** | Cosa è già attivo su TEST (baseline): non rifare cose fatte. | Team |
| **_TEMPLATE_RICHIESTA.md** | Modello da copiare per aprire una nuova `richieste/REQ-NNN-*.md`. | Matteo |
| **richieste/REQ-NNN-*.md** | Il **dettaglio** di ogni richiesta + le 3 sezioni del ciclo (① Istruzioni · ② Consegna · ③ Esito test). | Team + Matteo |

## Setup skill system del branch (riferimento, non quotidiano)

| File | A cosa serve |
|------|--------------|
| **SKILL_SYSTEM_CONSOLE.md** | Come il branch console ha uno skill system separato da quello di PrenotaZen, e come Matteo lo integrerà. |
| **CLAUDE_MD_CONSOLE.md** | Template `.claude/CLAUDE.md` da usare nel branch console (entry point skill, vocabolario, sicurezza PROD). |

---

## Flusso in 5 righe

1. **Team** parte: `git fetch && git merge origin/main`, prende una REQ **DA-FARE** dal registro → **IN-SVILUPPO**.
2. **Team** sviluppa su `feature/console-super-admin` (`get_project_url` = `docnnernvp` TEST, mai PROD).
3. **Team** chiude: `npm run validate` verde, compila «② Consegna» nella REQ, push → REQ **CONSEGNATA**, avvisa Matteo.
4. **Matteo** tira su `env/test`, valida, compila «③ Esito test» → **ACCETTATA** o **RIMANDATA**.
5. **Matteo** promuove il solido in `main`; il **Team** si riallinea con `git merge origin/main`.

> I comandi git completi (e perché **merge e non rebase+force**) sono in **WORKFLOW.md §2**.

---

**Versione:** 23-06-2026 · **Owner:** Matteo
