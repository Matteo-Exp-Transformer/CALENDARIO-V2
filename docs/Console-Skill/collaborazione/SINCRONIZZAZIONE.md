# Sincronizzazione — routine di avvio e chiusura sessione

> **A cosa serve.** Le due checklist da eseguire **all'inizio** e **alla fine** di ogni sessione di
> lavoro, così richieste e consegne restano allineate tra Matteo (`env/test`) e Team (`feature/console-super-admin`)
> senza che nessuno perda un push o lavori su roba vecchia. Protocollo completo: `README.md`.

> **Branch:** Team sviluppa e pusha su `feature/console-super-admin`. Matteo testa su `env/test`.

---

## 🟢 AVVIO sessione

### Team Console (sviluppatore)
1. `git fetch` + `git pull` su `feature/console-super-admin` (parti dall'ultimo).
2. Apri **`REGISTRO_RICHIESTE.md`** → guarda le REQ in **DA-FARE** (e le **RIMANDATA** da rivedere).
3. Leggi **`STATO_AMBIENTE_TEST.md`** → cosa è già attivo su TEST (baseline, non rifare cose fatte).
4. Carica la bussola `00_BUSSOLA_CONSOLE.md` + le 5 regole d'oro. Verifica `get_project_url` = `docnnernvp` se toccherai il DB.
5. Prendi una REQ, mettila **IN-SVILUPPO** nel registro.

### Matteo (proprietario)
1. `git fetch` + `git pull` su `env/test`.
2. Importa il lavoro del Team: `git merge origin/feature/console-super-admin` (oggi è fast-forward; in futuro merge normale).
3. Apri **`REGISTRO_RICHIESTE.md`** → guarda le REQ **CONSEGNATA** (pronte da testare).
4. Per ognuna: mettila **IN-TEST**, segui i passi della sezione «② Consegna» della REQ.

---

## 🔴 CHIUSURA sessione

### Team Console (sviluppatore)
1. `build` + `typecheck` + `lint` della Console verdi (riportali nella REQ).
2. Compila la sezione **«② Consegna»** della REQ: commit/SHA, modifiche, **cosa testare**, **azioni lato Matteo** (env/secret/plan/deploy).
3. Aggiorna i log: `SESSION_LOG.md` (sempre), `DECISION_LOG.md` / `PHASE_AUDIT.md` / `FOLLOW_UP.md` (se serve).
4. Se hai cambiato l'ambiente TEST, aggiorna **`STATO_AMBIENTE_TEST.md`**.
5. Metti la REQ **CONSEGNATA** nel registro.
6. **Commit + push** su `feature/console-super-admin`. Avvisa Matteo.

### Matteo (proprietario)
1. Compila la sezione **«③ Esito test»** della REQ.
2. Esito: **ACCETTATA** (chiusa) oppure **RIMANDATA** (scrivi cosa non va → torna al Team).
3. Aggiorna il registro.
4. Se hai aperto nuove richieste: crea i file `REQ-NNN` (da `_TEMPLATE_RICHIESTA.md`) e mettili **DA-FARE**.
5. **Commit + push** del tuo branch. Avvisa il Team che ci sono novità.

---

## Regola d'oro della sincronizzazione

```
Nessuno inizia a sviluppare/testare senza aver prima fatto il PULL e letto il REGISTRO.
Nessuno chiude senza aver aggiornato il REGISTRO + fatto PUSH.
Il REGISTRO_RICHIESTE.md è la verità: se non è lì, non è successo.
```
