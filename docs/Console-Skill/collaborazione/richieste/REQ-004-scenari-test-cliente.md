# Scenari di test "da cliente" — per provare la Console nei panni di Matteo

> **Come si usa:** ogni scenario è una **richiesta finta di un ristoratore** a Matteo. Tu ti metti nei
> panni di Matteo, apri la Console e fai quello che ti chiede il cliente. In fondo a ogni scenario c'è
> **cosa deve succedere** (se succede, il test è passato). Linguaggio semplice, niente sigle.
>
> ⚠️ Tutto su ambiente di prova. Per gli scenari che **eliminano** qualcosa, usa un'azienda creata
> apposta per il test (scenario 6 prima del 7), così non cancelli dati che ti servono.

---

## Scenario 1 — "Trova il mio ristorante" (prova la ricerca)

**Il cliente dice:** «Ciao Matteo, sono quello della Trattoria da Tommaso, mi serve una modifica.»

**Tu fai:** apri la Console → vai su **Ristoranti** → nella **casella di ricerca** in cima scrivi
"tommaso".

**Deve succedere:** la lista si restringe e mostra solo le aziende col nome che contiene "tommaso".
Cancelli la ricerca → tornano tutte.

---

## Scenario 2 — "Passami alla versione avanzata" (cambio versione)

**Il cliente dice:** «Voglio passare dalla versione base a quella avanzata, ho bisogno della gestione
sale e tavoli.»

**Tu fai:** cerca un ristorante in versione base → clicca **"Apri scheda"** → nella scheda trovi
**"Versione venduta"** → scegli quella avanzata e conferma.

**Deve succedere:** appare il messaggio di salvataggio, l'etichetta della versione cambia, e **la pagina
resta dov'eri** (non salta in cima). Se torni alla lista, la card mostra la nuova versione.

---

## Scenario 3 — "Accendimi il menù col codice QR" (accendi una funzione extra)

**Il cliente dice:** «Sono in versione base ma vorrei il menù digitale col QR sui tavoli.»

**Tu fai:** apri la scheda di quel ristorante → sezione **"Feature flags (funzioni accese)"** → trova la
funzione del menù QR → premi il pulsante per accenderla.

**Deve succedere:** la funzione passa ad accesa, compare la scritta verde che indica che è
un'**aggiunta a mano** sopra la versione base, e appare "Salvato". La pagina non salta in cima.

---

## Scenario 4 — "Spegnimi una funzione che non uso"

**Il cliente dice:** «Una funzione che mi avete dato non mi serve, toglietemela.»

**Tu fai:** apri la scheda → sezione funzioni → spegni una funzione che ora è accesa.

**Deve succedere:** la funzione passa a spenta, compare la scritta arancione che indica che l'hai
**tolta a mano** rispetto a quello che la versione darebbe di serie.

---

## Scenario 5 — "Cambiami i giorni di prenotazione" (impostazione)

**Il cliente dice:** «Vorrei che i clienti possano prenotare fino a 30 giorni prima, non di più.»

**Tu fai:** apri la scheda → sezione **"Impostazioni ristorante"** → trova il valore dei giorni di
prenotazione → mettilo a 30 e salva.

**Deve succedere:** il valore si salva e resta a 30 anche se ricarichi la pagina. La pagina non salta
in cima dopo il salvataggio.

---

## Scenario 6 — "Aprite un nuovo locale per me" (crea azienda + accesso)

**Il cliente dice:** «Ho aperto un secondo ristorante, createmi tutto da zero con il mio accesso.»

**Tu fai:** in **Ristoranti** premi **"+ Nuova azienda"** → metti un nome (es. "Locale di Prova"),
scegli la versione, e nei campi dell'accesso metti un'email e una password di almeno otto caratteri →
conferma.

**Deve succedere:** la nuova azienda compare nella lista ed è apribile. L'accesso è creato (lo
ritrovi anche nella tab **Utenti**). Se provi a usare un indirizzo già esistente, ti avvisa con un
messaggio chiaro.

---

## Scenario 7 — "Chiudo quel locale, eliminatelo" (elimina azienda)

**Il cliente dice:** «Quel locale di prova non mi serve più, cancellatelo del tutto.»

**Tu fai:** apri la scheda del **"Locale di Prova"** creato allo scenario 6 → premi **"Elimina
azienda"** → per sicurezza ti chiede di **riscrivere il nome esatto** dell'azienda → riscrivilo e
conferma.

**Deve succedere:** l'azienda sparisce dalla lista. ⚠️ Se provi a eliminare un'azienda che ha già
prenotazioni o clienti dentro, ti blocca con un messaggio chiaro (è una protezione: si sblocca con una
modifica al database che spetta a Matteo).

---

## Scenario 8 — "Aggiungete un cameriere con accesso" (crea utente da solo)

**Il cliente dice:** «Voglio dare l'accesso anche al mio responsabile di sala.»

**Tu fai:** vai su **Utenti** → **"+ Nuovo utente"** → email + password (almeno otto caratteri) →
scegli l'azienda a cui collegarlo → conferma.

**Deve succedere:** il nuovo utente compare nella lista, collegato all'azienda giusta. Lo puoi
modificare o eliminare (per eliminarlo ti farà riscrivere l'email esatta).

---

## Scenario 9 — "Prova del ritorno alla posizione" (lo scorrimento)

Questo è un test della comodità, non una richiesta del cliente.

**Tu fai:** nella lista **Ristoranti**, **scorri in basso** fino a un'azienda lontana dall'inizio →
apri la sua scheda → cambia qualcosa e salva → torna indietro con **"← Torna"**.

**Deve succedere:** torni alla lista **nello stesso punto** dove eri sceso, non in cima. E dentro la
scheda, dopo il salvataggio, la pagina **non** è saltata in cima.

---

## Riepilogo: cosa stiamo testando

| Scenario | Cosa mette alla prova |
|----------|------------------------|
| 1 | Barra di ricerca per nome (nuova) |
| 2 | Cambio versione dalla scheda + niente salto in cima |
| 3 | Accendere una funzione extra + scritta "aggiunta a mano" |
| 4 | Spegnere una funzione + scritta "tolta a mano" |
| 5 | Cambiare un'impostazione |
| 6 | Creare azienda + accesso |
| 7 | Eliminare azienda (con protezione di sicurezza) |
| 8 | Creare un utente |
| 9 | Ritorno alla posizione di scorrimento |
