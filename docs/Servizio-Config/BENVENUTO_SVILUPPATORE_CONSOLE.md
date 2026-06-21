# Benvenuto — sviluppatore della Console privata

> **Ciao!** Questo è il tuo punto di partenza. Stai per costruire la **Console privata super-admin**
> (nel piano si chiama **FU-SERV-ADMIN-PANEL-1**): un pannello riservato al titolare del prodotto
> (Matteo) per configurare e aggiornare i singoli ristoranti (tenant), così che la schermata del
> ristoratore resti semplicissima.
>
> Sei su un **branch dedicato**: lavoraci sopra liberamente. Parti da questa cartella `docs/Servizio-Config/`.

---

## 1. In 60 secondi: cos'è questo prodotto

App SaaS di **prenotazioni per ristoranti**, multi-ristorante (multi-tenant), venduta in tre versioni:
**Classic** (base), **+QR** (menu digitale), **Pro** (sale, tavoli, servizio dal vivo). Oggi è Matteo a
configurare a mano ogni ristorante. La **Console** serve a dargli un posto unico e sicuro per farlo, e a
togliere quella roba dalla schermata del ristoratore.

Leggi nell'ordine:
1. `INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md` → **la lista di cosa va nella Console** (colonna 🟦).
2. `GUIDA_CONFIGURAZIONE_CLIENTE.md` → come Matteo configura oggi a mano (quello che la Console deve sostituire).
3. `ROADMAP_LAVORI_AGENTI_SERVIZIO.md` → l'ordine generale dei lavori dell'area.

> ⚠️ **Fonte di verità.** I valori e le manopole reali stanno **nel codice**
> (`src/features/booking/lib/restaurantSettingRegistry.ts` per le impostazioni del ristorante;
> `src/config/features.ts` + il campo `tenants.edition` per le versioni). Se un documento e il codice
> non concordano, **vince il codice**.

---

## 2. Cosa deve fare la Console (sintesi del lavoro)

Tutte le righe 🟦 dell'Inventario. In pratica, un pannello dove Matteo può, per ogni ristorante:

- impostare la **versione venduta** (Classic / +QR / Pro) e accendere/spegnere singole funzioni
  (il meccanismo esiste già: `tenants.edition` + override in `tenant_features`, vedi
  `buildFeatures()` in `src/config/features.ts`);
- impostare i **numeri tecnici** che oggi tara a voce: durata di base (90/120/150/180), minimo durata
  fascia, tempo minimo per ordinare, intervalli di arrivo, cut-off, buffer;
- creare le **card/menu** (es. *Prenota un Tavolo* / *Degustazione* / *Evento*);
- applicare un **preset** a un ristorante (riempire tante impostazioni in un colpo).

**Confini da rispettare (importanti):**
- La Console è **solo per Matteo**: non deve mai diventare visibile al ristoratore.
- Le configurazioni del prodotto vivono in **due soli posti** lato ristoratore (Impostazioni e Servizio):
  la Console NON apre un terzo pannello *dentro* l'app del ristoratore, è un'area separata super-admin.
- **Sicurezza produzione:** ogni scrittura sul database tocca dati di clienti veri. Verifica sempre
  l'ambiente prima di scrivere (`rwuxgvld` = PRODUZIONE → fermati; `docnnernvp` = TEST → procedi).
  Dettaglio in `docs/APP_CONTEXT_SKILL.md` §1b. **Sviluppa e prova sempre su TEST.**
- Quando aprirai la Console a **più operatori** (non solo Matteo), guarda **FU-SERV-PERMESSI-1**: servono
  ruoli (titolare / responsabile sala / cameriere) — non MVP, ma tienilo a mente nel disegno.

---

## 3. Come si lavora qui con Claude Code (in VS Code)

Questo repository ha un **"skill system"**: una serie di istruzioni in `docs/` che indirizzano l'agente
AI all'area giusta del codice. **Non devi navigare il codice a tappeto**: l'agente lo fa per te se gli
parli bene.

**Avvio:**
1. Apri la cartella del repo in **VS Code**.
2. Apri **Claude Code** (estensione o pannello). All'avvio legge da solo `.claude/CLAUDE.md`, che è la
   guida del progetto: gli dice come instradarsi alle skill d'area.
3. Per i lavori sulla Console, **incolla all'agente** i riferimenti a questa cartella
   (`docs/Servizio-Config/`) così parte con il contesto giusto.

**⚠️ Attenzione al vocabolario.** Lo skill system ha delle **parole-grilletto** pensate per Matteo
(`docs/Comunicazione-Skill/COMANDI_AVVIO.md`). Le più utili anche per te:

| Se scrivi… | L'agente… |
|---|---|
| **«implementa …»** / «crea …» / «aggiungi …» | scrive/modifica codice nell'area giusta |
| **«revisiona …»** / «verifica …» / «debugga …» / «non funziona» | controlla, diagnostica, testa |
| **«prepara …»** | NON tocca il codice: ti consegna solo un prompt pronto per un altro agente |
| **«spiegamelo semplice»** | risposta breve, senza gergo |

> Se non usi una di queste parole, l'agente capisce dal contesto e, in dubbio, **ti chiede**. Va benissimo
> parlargli in italiano normale: «implementa nella Console la schermata per cambiare la versione del
> ristorante» è un ottimo avvio.

**Verifica prima di consegnare** (comandi del progetto):
```bash
npm install         # la prima volta
npm run dev         # avvia in locale su http://localhost:5173
npm run validate    # lint + typecheck + test — deve essere VERDE prima di un commit
```
Setup completo dei test: `docs/Testing-Skill/TESTING_SKILL.md`.

---

## 4. Punto di partenza suggerito per te

1. Leggi i 3 documenti (sopra) + dai un'occhiata a `src/config/features.ts` e
   `src/features/booking/lib/restaurantSettingRegistry.ts`: lì vedi *concretamente* le manopole.
2. Primo mattone consigliato: **la schermata Console che mostra un ristorante e ne cambia la versione**
   (edition + feature flag). È il pezzo più isolato e già supportato dal codice esistente.
3. Apri Claude Code e prova:
   «*implementa una prima schermata di console super-admin che elenca i ristoranti (tenant) e permette di
   cambiarne la edition; usa il sistema esistente `tenants.edition` + `tenant_features`. Solo TEST.*»

---

## 5. Cose ancora da chiarire con Matteo (non bloccano l'inizio)

- **Dove vive la Console:** è una rotta dentro questa stessa app (es. `/super-admin`, protetta) o un
  progetto separato? (Influenza la struttura, ma puoi iniziare dalle schermate.)
- **Il piano tecnico completo dell'area** (decisioni D1–D42) oggi è un piano di lavoro in
  `.claude/plans/` e sarà pubblicato come `docs/MASTERPLAN_SERVIZIO.md`. Finché non c'è, i tre documenti
  di questa cartella ti bastano per la parte Console.
- **Login/permessi della Console:** per ora solo Matteo; ruoli più avanti (FU-SERV-PERMESSI-1).

Buon lavoro 🙌
