# Tipo di seduta — fantasticazione / immaginazione (v0)

> **Stato:** dichiarazione viva per prepara-prompt e conduttori · **non** apre `WP-1` · **non** è prova.
> **Owner:** questo file (intento del tipo). Metodi dettagliati e spunti restano nel registro metodi di
> elicitation (cartella privata `_lavoro`, file REGISTRO_METODI_ELICITATION_IDIOgrafica) e negli spunti
> privati.
> **Aggiornato:** 10-08-26 — prompt riusabile leggero · mandato verbatim-fonte · evals E1–E5 (S-E).

## A cosa serve

Sedute in cui l’agente propone **input immaginari** e Matteo descrive **come si comporterebbe**.
Obiettivo dichiarato: stimolarlo a scrivere tanto e raccogliere dati su **cosa lo stimola**, senza
diagnosi e senza imbrigliare il conduttore in schemi pesanti.

Collega Persona (self_report) e Sistema (lezioni su cosa apre/chiude la scrittura). Non promuove
livelli. Non sostituisce C8 / interrogazioni / mining.

## Cosa intende Matteo quando chiede di «preparare un prompt» di questo tipo

In una frase: **un prompt riusabile, leggero e fantasioso**, dove l’agente stimola e Matteo produce
testo; pochi schemi; tanta scrittura; a fine seduta si conserva cosa ha funzionato come stimolo.

Checklist di intento (per il prepara-prompt):

1. **Riusabile** — stesso protocollo per più chat future, non solo “la prossima”.
2. **Poco imbrigliato** — niente checklist lunghe, niente interrogatorio formale obbligatorio.
3. **Fantasia + leggerezza** — situazioni ideate; anche fuori comfort; non solo lavoro.
4. **Input misto** — a volte scenario completo; a volte solo un innesco (oggetto, frase, immagine).
5. **Produzione di Matteo** — account libero e lungo; l’agente fa poco testo tra un giro e l’altro.
6. **Dato sullo stimolo** — cosa ha aperto la scrittura, cosa l’ha bloccata, cosa ha chiesto di
   cambiare; va nello spunto/registro, non inventato a posteriori.
7. **Config soft-flessibile** — eredita le lezioni utili di CFG-01 (anti-trama S-A, Challenge solo se
   serve e solo su incoerenze *sue*), ma **non** obbliga Challenge, 5P né catena «reazione».
8. **Privacy** — dettaglio ricco in `_lavoro`; report git-tracked sintetico; `external_release:
   forbidden`.
9. **MetaSkillSystem in ombra** — a chiusura: capsula tre assi + `validate:mss`; `WP-1` non si apre
   da soli; nessuna promozione Persona.
10. **Misura prima dello stimolo** — non partire a caso: dichiarare costrutto + criteri osservabili
    (evals E1–E5 o equivalenti replicabili; base PEACE piano d’intervista + free recall CI) *prima*
    di proporre scenario/innesco.
11. **Verbatim = fonte primaria** — **mandato Matteo 10-08-26:** conservare in `_lavoro` **tutti** gli
    account verbatim di queste sedute (non solo i pezzi «che definiscono»). Altri agenti li trattano
    come materiale diretto di Matteo. Sintesi/ipotesi agente restano separate. Indice di lettura: analisi
    «fantasticazione-fonte-verbatim» (privata, cartella `_lavoro`).
12. **Additività cross-seduta MSS** — queste sedute **aggiungono** segnali utili a capire decisioni di
    Matteo, origine delle idee (conceived_by / decided_by) e competenze di **processo in chat**,
    riusabili da altre sedute MetaSkillSystem. ⛔ Non sottraggono e non sostituiscono verbali di
    blocco, INT_04, capsule H-1/produttive o altri owner. A chiusura: sezione report **§6-ter Ponte
    crescita / attribuzione (ADDITIVO)** nello stesso report deep — **non** un secondo owner
    parallelo (scelta S-E 10-08-26).
13. **Challenge = conflitto puro** — **lezione S-G 10-08-26:** Challenge solo se due pezzi detti da
    Matteo sono **incompatibili nello stesso momento** (A e B non possono stare insieme *ora*).
    Una **sequenza** (prima X, poi Y: es. finta disinteresse → poi parla col barista) **non** è
    Challenge. Filtro pre-Challenge: «è conflitto puro? se no → deepen o ometti, non Challenge».
    Resta: solo dopo account; solo incoerenze *sue*; linguaggio concreto; mai Reid.

## Cosa NON è

- terapia / diagnosi DSM / Big Five inventati / Reid
- roleplay il cui obiettivo primario è “l’agente parla come Matteo” (quello era CFG-00)
- apertura ufficiale di `WP-1`
- fusione automatica in idiografica / INT_03 / dossier

## Dove vive il materiale

| Cosa | Dove |
|---|---|
| Intent di questo tipo (questo file) | `docs/MetaSkillSystem/` |
| Prompt operativo da incollare (owner Matteo) | `_lavoro/Per matteo/Metaskillsystem-Owner-Matteo/Tipo di sedute/Prompt-Seduta-Immaginazione.md` |
| Config metodi CFG-* | registro privato `_lavoro/.../REGISTRO_METODI_...` |
| Racconti / macro / verbatim (**tutti** gli account) | spunti privati `_lavoro/.../Analisi/SPUNTO_*` |
| Analisi di riferimento per agenti futuri | `_lavoro/.../Analisi/ANALISI_Riferimento-fantasticazione-fonte-verbatim-*.md` |
| Studio delle risposte + log metodi (bozza) | intent `STUDIO_RISPOSTE_FANTASTICAZIONE_V0.md` · pacchetto `_lavoro/.../Tipo di sedute/Studio-Risposte-v0/` |
| Sintesi operativa + capsula | `docs/Sessioni di lavoro/GG-MM-AA/` |

## Assi (come catturare, senza appesantire la chat)

- **Persona:** self_report su scenari; `sonda_trasparente`; nessuna promozione.
- **Sistema:** cosa stimolava / contaminava (frame troppo stretto, Challenge astratta, ecc.) come
  dato G/O/E in ombra (`E=0` finché non c’è enforcement dedicato).
- **Output:** spunto/registro = tipicamente `not_eligible` finché non c’è uso/verifica successiva.
