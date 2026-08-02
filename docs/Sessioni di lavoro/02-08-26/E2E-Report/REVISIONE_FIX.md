# Revisione del giro 2 — il lavoro dei tre agenti di fix, nel suo insieme

> 02-08-26 · branch `env/test` · revisione fatta a valle di [FIX_1_OROLOGIO.md](FIX_1_OROLOGIO.md),
> [FIX_2_ASSEGNAZIONI.md](FIX_2_ASSEGNAZIONI.md), [INDAGINE_APERTE.md](INDAGINE_APERTE.md).
> Nessuna scrittura su PROD. Nessuna migrazione applicata da questa sessione (MCP Supabase non
> autorizzato).

---

## 1. Verdetto in una riga

Il codice dei tre agenti è **buono e coerente con la diagnosi**; il collaudo però è **fermo** perché
la migrazione `066` non è mai arrivata sul database di TEST.

---

## 2. Il blocco: `PGRST204 … 'served_at' … schema cache`

**Cosa ha visto Matteo.** Prenotazione da 12 coperti su 3 tavoli. Libera il primo: ok. Il secondo:
ok. Il terzo: errore.

**Perché proprio l'ultimo.** È la firma esatta della regola scritta da FIX-2: l'archiviazione parte
**solo quando si libera l'ultimo tavolo** della tavolata. Sui primi due la funzione esce subito e
non tocca il database. Sul terzo prova a scrivere `served_at` — colonna che sul TEST non esiste,
perché il file `066_booking_requests_served_at.sql` è nel repo ma non è mai stato applicato
(l'agente FIX-2 lo aveva dichiarato: token MCP scaduto).

Quindi **non è un difetto della logica**: è la parte SQL del lavoro rimasta a metà.

**Cosa ho corretto comunque.** Il fallimento non era innocuo: `checked_out_at` era già scritto, il
tavolo era **davvero libero nel database**, ma l'errore interrompeva la mutation prima
dell'aggiornamento delle liste → la mappa continuava a mostrarlo occupato. Ora l'archiviazione non
fa più fallire il checkout: il tavolo si libera, le liste si aggiornano e compare un avviso
esplicito («Tavolo liberato, ma la prenotazione non è stata archiviata…»). Regressione coperta da
test con l'errore reale `PGRST204`.

**Cosa resta da fare (non fattibile da qui).** Applicare su TEST `docnnernvp`:

```sql
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;
```

Finché non è applicata, la voce «liberare archivia» **non è collaudabile**.

---

## 3. FIX-1 — orologio (S4-BUG-1 + S4-BUG-12)

**Confermato corretto.** Il confronto ora avviene fra cifre a muro e calendario locale, senza
costanti `+2`: regge ora legale e solare, e la fine occupazione arriva dalle cifre di
`confirmed_end`, quindi anche le fasce che scavallano la mezzanotte. Lo snapshot di occupazione è
stato lasciato intatto, come doveva essere.

**Una scelta dell'agente che va oltre il mandato, e che approvo:** «In uscita» ora scatta a *fine
pasto + buffer di riassetto*, non a fine pasto. È coerente col testo dell'avviso, che dice allo
staff che i posti sono di nuovo disponibili: durante il riassetto non lo sono ancora.

---

## 4. FIX-2 — turni, archiviazione, forzatura

**Confermato corretto**, con tre note.

- Il conteggio dei turni resta su tutte le righe (un turno concluso ha consumato); a cambiare è che
  l'avviso arriva **prima**, sul tavolo, invece di comparire come errore. Questa era la decisione.
- **L'annullamento ora cancella davvero la riga** invece di chiuderla. Ho verificato che il permesso
  di cancellazione esista sul database (`admin_delete_bta`, mig. 014 + GRANT mig. 026), altrimenti
  l'annullamento sarebbe fallito in silenzio.
- I quattro casi da non rompere (checkout archivia / annulla no / «Libera e assegna» no / tavolata
  archivia solo all'ultimo tavolo) sono tutti coperti da test.

---

## 5. FIX-3 — indagine (nessun codice toccato)

Le cinque risposte sono documentate e verificate contro il codice. La più importante:

- **Il badge Classic mancante NON è una regressione S4.** L'agente ha confrontato con `main` invece
  di andare a intuito: il ramo Classic è identico prima e dopo. Lo screenshot della corsia D era su
  un **giorno senza prenotazioni**, quindi non c'era proprio nessuna card fascia da giudicare.
  Questa era l'unica domanda che poteva toccare clienti paganti: è chiusa.
- Le altre quattro restano **decisioni di prodotto tue**, non difetti da correggere in autonomia:
  capienza pubblica e D38, denominatore del badge Calendario, walk-in «solo coperti», e la
  riesecuzione della corsia D su una fascia abbastanza larga.

---

## 6. Layout della vista Servizio (richiesta diretta 02-08)

- Le prenotazioni da assegnare passano dalla **colonna di sinistra alla testata**, in striscia
  orizzontale. Prima rubavano un terzo di larghezza alla piantina e la colonna cresceva fino a
  ~2000px di altezza con quattro prenotazioni.
- Le sale stanno in **due colonne** da desktop.
- Da **telefono e tablet** si vede **una sola sala**: quella scelta nelle linguette. Se la sala
  scelta non ha tavoli si ripiega sulla prima che ne ha, così il pannello non resta mai vuoto.

---

## 7. Stato dei controlli

| Controllo | Esito |
|-----------|-------|
| `npm run validate` (lint + typecheck + test) | ✅ verde — 148 file / 1235 test |
| `npm run validate:docs` | 14 percorsi rotti, **tutti preesistenti** (Console-Skill), nessuno nuovo |
| Migrazione 066 su TEST | ❌ **non applicata** — blocca la riprova dell'archiviazione |
| PROD | non toccata |

---

## 8. Cosa serve da Matteo, in ordine

1. **Applicare la migrazione 066 sul TEST** (una riga di SQL). Senza, la riprova non parte.
2. Rilanciare **RIPROVA-B** e **RIPROVA-D**, poi il consolidamento.
3. Rispondere alle quattro decisioni di prodotto della sezione 5.
