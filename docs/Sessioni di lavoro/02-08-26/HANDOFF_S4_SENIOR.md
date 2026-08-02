# Handoff S4 — per il prossimo agente senior (Opus)

> Scritto il 02-08-2026 a fine sessione. Branch `env/test`. Nessuna scrittura su PROD.
> Il tuo ruolo è **supervisione**: Matteo controverifica, non testa attivamente. Tu mandi avanti i
> giri di lavoro, leggi i report degli agenti e ti fidi solo di quello che è dimostrato.

---

## 0. La prima cosa che fai all'avvio

**Rimappa i prompt del giro 4 sul codice reale** con
[PREPARA_PROMPT_SKILL.md](../../PREPARA_PROMPT_SKILL.md), poi aggiorna
[PROMPT_AGENTI_E2E_S4.md](../../Testing-Skill/PROMPT_AGENTI_E2E_S4.md).

I quattro prompt FIX-4A…4D sono stati scritti **a partire da quello che Matteo ha chiesto a voce**,
non da una lettura riga per riga del codice. Sono una bozza buona ma non verificata: prima di
lanciarli apri `AssignmentMapPanel.tsx` e `ServicePlanMap.tsx`, controlla che i nomi, i punti di
aggancio e i vincoli citati corrispondano, e riscrivili dove serve. Non lanciare gli agenti sui
prompt così come sono.

---

## 1. Dove siamo

**S4 Servizio è completo e pushato su `env/test`. Mai andato in PROD.**

| Giro | Cosa | Stato |
|------|------|-------|
| 1 | Collaudo e2e a 4 corsie (Playwright MCP) | ✅ fatto — 52 voci: 32 OK, 7 KO, 9 bloccate |
| 2 | FIX-1 orologio · FIX-2 assegnazioni/archiviazione · FIX-3 indagine | ✅ fatto, revisionato |
| — | Revisione d'insieme + layout vista Servizio | ✅ fatto (questa sessione) |
| 3 | RIPROVA-B, RIPROVA-D | ⛔ **bloccato** dalla migrazione 066 |
| 4 | Quattro rifiniture della vista Servizio | ⏳ prompt in bozza, da rimappare |
| 5 | Consolidamento | ⏳ dopo il giro 3 e 4 |

Tutti i report stanno in [E2E-Report/](E2E-Report/); l'indice è il `README.md` di quella cartella.
La sintesi con gli ID dei difetti (S4-BUG-1 … S4-NOTE-11) è
[SINTESI.md](E2E-Report/SINTESI.md); la revisione del giro 2 è
[REVISIONE_FIX.md](E2E-Report/REVISIONE_FIX.md).

---

## 2. ⛔ Il blocco, prima di tutto il resto

La migrazione `066_booking_requests_served_at.sql` è **nel repo ma non applicata sul TEST**
(`docnnernvp`). Due sessioni di fila non hanno avuto il connettore MCP Supabase autorizzato.

Sintomo a video: liberando l'**ultimo** tavolo di una tavolata →
`PGRST204 Could not find the 'served_at' column of 'booking_requests' in the schema cache`.

```sql
ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS served_at timestamptz;
```

Prima di applicarla: `get_project_url` deve rispondere `docnnernvp`. Se risponde `rwuxgvld` è
PRODUZIONE → fermati. Se il connettore non è autorizzato neanche per te, **chiedi a Matteo di
incollarla nel pannello TEST**: senza, metà del giro 3 non vale.

Il codice nel frattempo degrada in modo pulito: il tavolo si libera comunque, le liste si aggiornano
e compare un avviso. Non è un motivo per rimandare la migrazione.

---

## 3. Decisioni di Matteo del 02-08 — chiuse, non riaprirle

| Questione | Decisione | Conseguenza |
|-----------|-----------|-------------|
| Capienza pubblica allineata ai tavoli / D38 (S4-BUG-5) | **Sì, ma dopo il collaudo** | Direzione confermata, cantiere separato. Non è un KO: oggi online comanda solo il cap fascia, ed è il comportamento atteso. Tocca RPC `get_available_arrival_times` + Edge `create-booking`: rischio PROD alto, va fatto con migrazione + deploy + client insieme. |
| Denominatore del badge % in Calendario (S4-BUG-6) | **Tutto il locale, com'è** | Nessun lavoro. La voce §4-5 della checklist va **riscritta**, non segnata KO. |
| Walk-in «solo coperti» (S4-BUG-4) | **No: sala e tavolo restano obbligatori** | Nessun lavoro. Va tolta la voce §5-1 dalla checklist e allineato il masterplan (D45 parlava di walk-in senza tavoli). |
| Badge Classic senza limite (S4-BUG-7) | **Va bene così** | Chiusa come non-difetto: FIX-3 ha dimostrato col confronto su `main` che non è una regressione S4. |

Restano **operative**, non decisioni: rieseguire la corsia D su una fascia larga (la prima volta era
50 minuti in un buco di 59, quindi zero orari pubblici validi) e la spunta Privacy non cliccabile da
automazione, che resta un debito di collaudo Classic.

---

## 4. Cosa è stato corretto e va tenuto d'occhio nelle riprove

- **Stati dei tavoli e ora di punta**: confronto ora-a-muro contro ora-a-muro, senza costanti «+2».
  Novità da ricordare nel collaudo: **«In uscita» ora scatta a fine pasto + buffer di riassetto**,
  non a fine pasto. Se una fascia ha 10' di buffer, l'avviso arriva 10' più tardi di quanto scriveva
  la checklist originale.
- **Turni**: un turno concluso continua a consumare (semantica invariata); a cambiare è che l'avviso
  arriva **prima**, sul tavolo. L'**annullamento** ora cancella fisicamente la riga e non brucia un
  turno — verificato che il permesso di DELETE esista (`admin_delete_bta`, mig. 014 + GRANT 026).
- **Fascia chiusa** (`max_turns = 0`) ha un messaggio suo, non più «turni esauriti».
- **Archiviazione al checkout**: solo il checkout archivia; annullamento, «Libera e assegna» e
  release da Calendario no; la tavolata archivia solo all'ultimo tavolo. Non fa più fallire il
  checkout se la scrittura non riesce.
- **Layout vista Servizio**: prenotazioni in testata (striscia orizzontale), sale a due colonne da
  desktop, **una sola sala sotto 1024px** — quella scelta nelle linguette.

---

## 5. Ordine di lavoro consigliato

1. Migrazione 066 su TEST (blocco).
2. Rimappa i prompt del giro 4 con la skill prepara-prompt.
3. Giro 3: RIPROVA-B e RIPROVA-D **in parallelo** (corsie e dati diversi, non si pestano).
4. Giro 4: FIX-4A…4D **uno alla volta o tutti a un solo agente** — toccano gli stessi due file, in
   parallelo si sovrascrivono.
5. Consolidamento (da solo).
6. Riscrivi le voci di checklist toccate dalle decisioni della §3.

---

## 6. Dopo S4 — quello che resta in coda

- **Re-merge `main` → `env/test`** per recuperare `f617077`: da fare **prima** di qualsiasi rollout.
- **Rollout PROD**: migrazioni 063→066 + Edge `create-booking` + client **insieme**, con
  autorizzazione esplicita di Matteo chiesta ogni volta. Lezione del 23-05: migrazione che restringe
  permessi e fix client viaggiano insieme, mai separati.
- **Cantiere capienza pubblica / D38** (decisione §3, rimandata).
- Poi il **cantiere Fable** — mandato in [STATO_APP_E_MANDATO_FABLE.md](STATO_APP_E_MANDATO_FABLE.md).

---

## 7. Come lavorare con Matteo

- Non è tecnico: parla per **schermate e flussi concreti** («apri Servizio, clicchi il tavolo,
  compare…»), non per nomi di file isolati. Breve di default.
- **Grilletti**: «prepara» = solo il prompt, non eseguire; «lavoro ok» = report completo senza
  commit; «fai report finale» = commit + push; «ragioniamo» = fermarsi a ragionare;
  «spiegamelo semplice» = effetto concreto, breve. Fonte:
  [VOCABOLARIO.md](../../Comunicazione-Skill/VOCABOLARIO.md).
- Quando un agente riporta un risultato, **non prenderlo per buono**: il caso del badge Classic era
  un falso KO su un giorno vuoto, e il caso dei turni esauriti l'ha trovato Matteo a mano perché
  l'agente aveva (correttamente) scritto BLOCCATO invece di inventarsi un esito.
- **Mai** commit o push senza richiesta esplicita. **Mai** scritture su PROD senza conferma chiesta
  ogni singola volta. `supabase db push` vietato. Le migrazioni già applicate non si toccano.
