# Collaborazione Console — canale richieste ↔ consegne (Matteo ↔ Team Console)

> **Scopo.** Un canale **bidirezionale e tracciabile** tra **Matteo** (proprietario, testa su `env/test`)
> e il **Team Console / Cristiano** (sviluppa su `feature/console-super-admin`). Matteo scrive richieste,
> il Team sviluppa + pusha + aggiorna la tracciabilità, Matteo testa e accetta.
>
> Questo canale **non sostituisce** il sistema di tracciabilità del branch (`sessioni/DECISION_LOG.md`,
> `PHASE_AUDIT.md`, `FOLLOW_UP.md`, `SESSION_LOG.md`): lo **usa**. Qui vive solo il *flusso richiesta→consegna*.

---

## 1. Ruoli

| Ruolo | Chi | Dove lavora | Fa |
|-------|-----|-------------|----|
| **Proprietario** | Matteo | `env/test` (test) | Scrive le richieste, prova il lavoro consegnato, accetta o rimanda |
| **Team Console** | Cristiano / agenti del branch | `feature/console-super-admin` (sviluppo) | Sviluppa, pusha, compila la consegna, aggiorna i log di tracciabilità |

---

## 2. Le tre regole d'oro del canale (oltre alle 5 del branch)

```
C-1  UNA RICHIESTA = UN FILE.  Ogni richiesta è un file REQ-NNN-*.md in richieste/.
     Nasce da _TEMPLATE_RICHIESTA.md. Il suo intero ciclo di vita vive in quel file.
C-2  IL REGISTRO È LA VERITÀ.  REGISTRO_RICHIESTE.md è la lavagna di stato: ogni cambio di
     stato di una REQ si riflette lì. Si guarda quello per sapere "a che punto siamo".
C-3  NIENTE CONSEGNA SENZA TRACCIABILITÀ.  Una REQ passa a CONSEGNATA solo se la sezione
     «Consegna» è compilata (commit citati + cosa testare + cosa serve lato Matteo) E i log
     del branch sono aggiornati (DEC se decisione, PHASE_AUDIT se fase, FOLLOW_UP se debito).
```

> Restano sempre attive le **5 regole d'oro del branch** (`00_BUSSOLA_CONSOLE.md` §1): solo TEST,
> scritture solo sui sandbox `console-classic`/`console-pro`, schema solo via *plan per matteo*,
> codice solo in `console/`, tracciabilità priorità #1.

---

## 3. Ciclo di vita di una richiesta

```
BOZZA ─▶ DA-FARE ─▶ IN-SVILUPPO ─▶ CONSEGNATA ─▶ IN-TEST ─▶ ACCETTATA
  │         (Matteo)    (Team)         (Team)       (Matteo)   (Matteo)
  │                                                    │
  └ Matteo sta ancora scrivendo                        └─ RIMANDATA ─▶ (torna IN-SVILUPPO)
```

| Stato | Chi lo imposta | Significato |
|-------|----------------|-------------|
| **BOZZA** | Matteo | Sta ancora scrivendo la richiesta, non guardarla ancora |
| **DA-FARE** | Matteo | Richiesta pronta e prioritizzata: il Team può prenderla |
| **IN-SVILUPPO** | Team | Il Team ci sta lavorando (annota branch/commit man mano) |
| **CONSEGNATA** | Team | Pushato + sezione «Consegna» compilata + log aggiornati. Tocca a Matteo |
| **IN-TEST** | Matteo | Matteo ha importato il lavoro in `env/test` e lo sta provando |
| **ACCETTATA** | Matteo | Funziona come voleva. REQ chiusa |
| **RIMANDATA** | Matteo | Qualcosa non va: scrive cosa nella sezione «Esito test» → torna IN-SVILUPPO |

---

## 4. Come si fa — Matteo (apri una richiesta)

1. Copia `_TEMPLATE_RICHIESTA.md` in `richieste/REQ-NNN-titolo-breve.md` (NNN = prossimo numero libero dal registro).
2. Compila **solo la sezione «① Richiesta»** (cosa vuoi, su quale schermata, come capisci che è fatto). Non serve linguaggio tecnico: descrivi il flusso concreto.
3. Aggiungi la riga in `REGISTRO_RICHIESTE.md` con stato **DA-FARE**.
4. `git add` + commit + **push** del tuo branch. Avvisa il Team che c'è una nuova REQ.

## 5. Come si fa — Team Console (sviluppa e consegna)

1. Prendi una REQ in **DA-FARE**, mettila **IN-SVILUPPO** nel registro.
2. Sviluppa su `feature/console-super-admin` rispettando le 5 regole d'oro (codice solo in `console/`,
   schema → *plan per matteo*, scritture solo sui sandbox).
3. Aggiorna i log del branch: `DECISION_LOG.md` (DEC-NNN se decisione non banale), `PHASE_AUDIT.md`
   (se è una fase con esecutore≠revisore), `FOLLOW_UP.md` (debiti), `SESSION_LOG.md` (una riga).
4. Compila la **sezione «② Consegna»** della REQ: **commit/SHA**, cosa è cambiato, **cosa deve testare
   Matteo** (passi concreti), e **cosa serve lato Matteo** (vedi §7: env, secret, *plan per matteo*, deploy).
5. Push. Metti la REQ **CONSEGNATA** nel registro.

## 6. Come si fa — Matteo (testa e chiude)

1. Importa il lavoro in `env/test` (vedi §8) e metti la REQ **IN-TEST**.
2. Segui i passi di test della sezione «② Consegna». Compila la **sezione «③ Esito test»**.
3. Se ok → **ACCETTATA**. Se no → scrivi cosa non va → **RIMANDATA** (il Team la rivede).

---

## 7. Cosa il Team NON può fare per Matteo (azioni «lato Matteo»)

Il Team sviluppa il codice, ma alcune cose **toccano l'ambiente di Matteo** e le elenca nella consegna
perché le faccia lui (o le faccia un assistente nella sua sessione, con verifica ambiente):

- **Modifiche di schema/RLS/migrazioni** → mai eseguite dal Team: si consegna un file in `plan-per-matteo/`.
- **Deploy di Edge Function** → istruzioni nel *plan per matteo* (es. PLAN-DB-003).
- **Secret della function** (`CONSOLE_ALLOWED_EMAILS`, …) → impostati lato Matteo via CLI.
- **Variabili `console/.env.local`** → non sono committate (gitignored): ogni nuova variabile va elencata
  nella consegna così Matteo aggiorna il suo file.

> **Stato reale corrente dell'ambiente TEST** (cosa è già attivo, baseline da cui partite):
> vedi **`STATO_AMBIENTE_TEST.md`**. Aggiornatelo quando cambia.

---

## 8. Git / branch — come viaggia il lavoro

- **Team**: sviluppa e **pusha** su `feature/console-super-admin`.
- **Matteo**: per testare, importa in `env/test`. Oggi i due coincidono fino al lavoro F1→F7, quindi
  l'import è un `git merge --ff-only origin/feature/console-super-admin`. Quando le due storie
  divergeranno (Matteo committa sul suo lato), diventerà un merge normale: in caso di conflitti su
  file condivisi, vince la regola «codice `console/` = Team, ambiente/test = Matteo».
- I file di questo canale (`collaborazione/`) e i log (`sessioni/`) sono **committati nel repo**: si
  sincronizzano con i normali push/merge. Niente strumenti esterni.

---

## 9. Definition of Done di una consegna (checklist del Team)

Una REQ è **CONSEGNATA** solo se:

- [ ] Codice pushato su `feature/console-super-admin` (commit citati nella REQ).
- [ ] Rispettate le 5 regole d'oro (codice solo in `console/`; nessun tocco a `src/`/`supabase/`; scritture solo sandbox; schema→plan).
- [ ] `build` + `typecheck` + `lint` della Console verdi (riportato nella REQ).
- [ ] Sezione «② Consegna» compilata: commit, modifiche, **passi di test per Matteo**, **azioni lato Matteo** (§7).
- [ ] Log aggiornati: `SESSION_LOG` (sempre), `DECISION_LOG`/`PHASE_AUDIT`/`FOLLOW_UP` (se applicabile).
- [ ] `REGISTRO_RICHIESTE.md` aggiornato a **CONSEGNATA**.

---

## 10. Struttura della cartella

```
docs/Console-Skill/collaborazione/
├── README.md                  ← questo file (il protocollo)
├── SINCRONIZZAZIONE.md        ← routine di AVVIO e CHIUSURA sessione (allineamento)
├── REGISTRO_RICHIESTE.md      ← lavagna di stato di tutte le REQ
├── _TEMPLATE_RICHIESTA.md     ← da copiare per ogni nuova richiesta
├── STATO_AMBIENTE_TEST.md     ← cosa è già attivo su TEST (baseline reale)
└── richieste/
    └── REQ-NNN-*.md           ← una richiesta = un file (ciclo di vita completo)
```

> **Inizio/fine di ogni sessione:** esegui le checklist di **`SINCRONIZZAZIONE.md`** (pull + leggi
> registro all'avvio; aggiorna registro + push alla chiusura). Vale per Matteo e per il Team.
>
> **Documento di intervista cliente:** `../onboarding/INTERVISTA_NUOVO_CLIENTE.md` — tutti i dati
> configurabili per ogni versione; base della scheda azienda (REQ-002).
