# Roadmap lavori con gli agenti — area Servizio + configurazione

> **A cosa serve.** Aiuta **te** (che dirigi gli agenti) a capire *in che ordine* far costruire le cose e
> *quale agente / quale parola-grilletto* usare, senza perderti. Non è un piano tecnico nuovo: mette in
> fila i pezzi già decisi e ti dice «adesso tocca a questo».
>
> **Compagni di questo file:**
> - `GUIDA_CONFIGURAZIONE_CLIENTE.md` — lo script che usi col cliente.
> - `INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md` — chi configura cosa.
> - `docs/MASTERPLAN_SERVIZIO.md` — il piano tecnico vero (sotto-aree S0–S6, decisioni D1–D42).
> - `.claude/CLAUDE.md` + `docs/Comunicazione-Skill/VOCABOLARIO.md` — le parole-grilletto del tuo skill system.

---

## Come parli agli agenti (ripasso veloce)

- **«prepara …»** → l'agente NON tocca il codice, ti consegna solo il prompt da dare a un altro agente.
- **«implementa / fai / crea / aggiungi …»** → profilo Esecuzione: carica la skill d'area e lavora.
- **«revisiona / verifica / debugga / non funziona …»** → profilo Verifica (Testing + skill area).
- **«lavoro ok»** → scrive/aggiorna il report (senza commit). **«fai report finale»** → commit + push.

> Ogni sotto-area passa dal **Manuale di blindatura** (`docs/Testing-Skill/MANUALE_BLINDATURA.md`):
> intervista → mappa → test → blindatura. Non far partire il codice di un'area finché il suo rischio
> bloccante non è chiuso.

---

## Ordine consigliato dei lavori (i «cancelli»)

Ogni passo = un lavoro che si chiude prima di aprire il successivo.

| # | Lavoro | Sotto-area | Versione | Apri quando |
|---|---|---|---|---|
| 1 | **Fondamenta + fix bug** | S0 | Pro + 1 fix Classic | Subito. Sblocca tutto. |
| 2 | Durata: dove si configura | S1 | Classic | Dopo S0. |
| 3 | Durata: il calcolo (motore) | S2 | Classic | Insieme/dopo S1. |
| 4 | Orari di arrivo a intervalli | S3 | Classic | Dopo S2. |
| 5 | Motore tavoli/turni automatici | S4 | Pro | Dopo S3. |
| 6 | Console di sala dal vivo (solo staff) | S4-LIVE | Pro | Dopo S4. |
| 7 | Cliente ordina da QR | S6 | Pro | Solo dopo S4-LIVE blindata. |
| 8 | **Console privata + snellimento UI** | FU-SERV-ADMIN-PANEL-1 | tutte | Quando vuoi togliere roba dalla UI del cliente. |

> **Nota importante sull'ordine.** I due documenti compagni (Guida cliente + Inventario) sono già pronti
> e ti servono **da subito**, prima ancora di costruire la console: descrivono il «come si configura oggi»
> (a mano, lo fai tu). La **console vera** (passo 8) si costruisce dopo; finché non c'è, l'Inventario è la
> tua console su carta.

---

## Per ogni passo, cosa chiedere all'agente

Schema fisso. Sostituisci `S?` con la sotto-area.

1. **Prepara il lavoro:**
   «*prepara prompt per la sotto-area S? del masterplan Servizio: intervista + mappa, compila funziona/
   riscrivere/può-rompersi, e dimmi quale rischio devo chiudere prima.*»
2. **Esegui (dopo che hai approvato):**
   «*implementa S? seguendo il suo plan; rispetta i 2 luoghi di configurazione (Impostazioni / Servizio),
   non aprire un terzo pannello (D3).*»
3. **Verifica:**
   «*verifica S?: gira i test dell'area, controtest "rompi", e le suite di regressione delle aree blindate
   toccate (settings / menu / Prenota).*»
4. **Chiudi:** «*lavoro ok*» → poi, quando sei sicuro, «*fai report finale*».

---

## Cosa NON dimenticare a ogni passo

- **Due luoghi soli per le configurazioni** (D3): Impostazioni (Personalizza Form / Anagrafica) e Servizio
  (Fasce / Tavoli). Mai un terzo posto.
- **Aree già blindate** che un lavoro può riaprire: Prenota (M0), Menu/QR (M3), Impostazioni (M4),
  Calendario (M2). Se le tocchi → controtest di regressione obbligatori.
- **Sicurezza produzione:** prima di scrivere su database/Edge, verifica l'ambiente
  (`rwuxgvld` = PRODUZIONE → fermati e conferma; `docnnernvp` = TEST → procedi). Dettaglio in
  `docs/APP_CONTEXT_SKILL.md` §1b.
- **Onboarding vs Console:** prima di esporre una manopola, controlla l'Inventario. Se è «Console / lo fai
  tu», l'agente NON deve metterla nella UI del ristoratore.
- **Niente versioni in disaccordo:** se un lavoro cambia dove vive una manopola, aggiorna nello stesso
  colpo i tre file di `docs/Servizio-Config/` + il file di contesto dell'area.

---

## Il primo passo concreto (da fare adesso)

1. **S0 — fix bug Edge `override_date`.** È un bug già in produzione: gli «sconti a tempo» sui coperti non
   scattano mai. Va chiuso isolato, prima di tutto (decisione D8). Chiedi:
   «*prepara prompt per il fix isolato del bug Edge override_date → date_from/date_to (S0, D8), con
   riproduzione su TEST prima e dopo.*»
2. In parallelo: **leggi con un cliente vero** la `GUIDA_CONFIGURAZIONE_CLIENTE.md` e segna dove ti
   inceppi → quelle note diventano i ritocchi futuri della guida e del wizard.

---

## Glossario minimo (per non confondersi)

- **Onboarding** = la prima configurazione fatta dal ristoratore.
- **Console privata** = il tuo pannello da super-admin (passo 8), oggi sostituito dall'Inventario su carta.
- **Card / esperienza** = quello che il cliente sceglie quando prenota (es. «Prenota un Tavolo», «Degustazione», «Evento»).
- **Tipologia** = la categoria con la durata, dietro le card (la vedi tu, non il cliente).
- **Fascia** = il turno di servizio (Pranzo / Cena).
- **Livello (1–4)** = quanto è «acceso» il motore disponibilità per quel cliente (vedi Guida cliente).
