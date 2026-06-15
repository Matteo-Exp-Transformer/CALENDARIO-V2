# Runbook — Violazione di dati personali (data breach) — BOZZA

> ⚠️ **BOZZA operativa da validare con consulente privacy** (FU-LEGAL-2). Serve a sapere **cosa fare
> nelle prime ore** di un sospetto incidente. **Non** sostituisce un parere legale.
>
> Versione: **v0.1 (bozza)** · Ultima modifica: **2026-06-15**
> Riferimento normativo: artt. 33-34 GDPR (notifica al Garante entro **72 ore**; comunicazione agli
> interessati se rischio elevato). URL e moduli del Garante vanno **verificati al momento** (cambiano).

---

## 0. Numeri e contatti rapidi

| Ruolo | Contatto |
|---|---|
| Referente privacy (Fornitore) | `matteo.sistemigestionali@gmail.com` (futuro `privacy@<dominio>`) |
| Supporto/sicurezza Supabase | dashboard Supabase → Support; **il DPA Supabase prevede notifica a noi entro 48h** |
| Hosting frontend | Vercel (dashboard) |
| Garante Privacy (notifica violazioni) | cercare «garanteprivacy.it notifica violazione dati» (URL può cambiare) |
| Avvocato/consulente | `<nome e contatto>` |

## 1. Cos'è un breach (per non sottovalutarlo)

Qualsiasi evento che comporti **distruzione, perdita, modifica, divulgazione o accesso non
autorizzato** a dati personali. Esempi concreti per questa app:
- credenziali admin compromesse / accesso non autorizzato a un account ristorante;
- esposizione dati prenotazione (nome/email/telefono/preferenze alimentari) a soggetti non autorizzati;
- errore RLS/permessi che rende visibili dati di un tenant a un altro;
- furto/perdita della service role key;
- esfiltrazione dati da Supabase o sub-processor (notificata da loro).

## 2. Prime azioni (CONTENIMENTO) — subito

1. **Confermare e circoscrivere:** capire cosa è successo, quali dati e quanti interessati, se è ancora
   in corso. Annotare ora e fatti (vedi registro §5).
2. **Fermare l'emorragia:**
   - se chiave compromessa → **ruotare** subito la service role key / le chiavi coinvolte;
   - se account admin compromesso → forzare logout/reset password, sospendere l'account;
   - se bug di permessi/RLS → mettere offline la funzione interessata o applicare hotfix;
   - se sospetto attacco al form pubblico → verificare rate limit / ban IP, eventualmente stringere.
3. **Preservare le prove:** salvare log rilevanti (Supabase `get_logs`, Vercel runtime log) prima che
   ruotino/scadano.

## 3. Valutazione del rischio (entro poche ore)

Valutare gravità per gli interessati:
- **categorie di dati** (le **preferenze alimentari** possono essere dati di salute → rischio più alto);
- **volume** (quanti interessati);
- **conseguenze** possibili (es. profilazione, contatto indesiderato, furto identità).

Esito → decide gli obblighi del §4.

## 4. Obblighi di notifica

| Scenario | Azione | Tempo |
|---|---|---|
| Breach con **rischio per i diritti** degli interessati | **Notifica al Garante** (art. 33) | **entro 72 ore** dalla conoscenza |
| Breach con **rischio elevato** | **Comunicazione agli interessati** (art. 34) | senza ingiustificato ritardo |
| Breach **improbabile** che comporti rischio | **Nessuna notifica**, ma **documentare** la valutazione | — |
| Il breach origina da un **sub-processor** (es. Supabase) | ricevuta la loro notifica, rivalutare e, se Titolare/Responsabile, adempiere ai propri obblighi | dal momento della conoscenza |

> Nel ruolo di **Responsabile** (dati dei clienti finali), l'obbligo primario è **informare senza
> ritardo il Titolare** (il ristorante Cliente), che valuterà la notifica al Garante. Chiarire con
> l'avvocato la ripartizione esatta degli adempimenti tra Fornitore e ristorante.

## 5. Registro dell'incidente (compilare SEMPRE, anche senza notifica)

```
- ID incidente / data-ora scoperta:
- Chi ha scoperto / come:
- Sistemi e dati coinvolti (tabelle, n. interessati stimati):
- Categorie di dati (incluse eventuali categorie particolari art. 9):
- Causa (tecnica/umana/attacco):
- Azioni di contenimento e orari:
- Valutazione del rischio (basso/medio/alto) + motivazione:
- Notifiche effettuate (Garante? interessati? Titolare/Cliente?) + orari:
- Misure correttive per il futuro:
- Chiusura (data, responsabile):
```

## 6. Dopo l'incidente

- Applicare le misure correttive (fix, hardening, processo).
- Aggiornare `LEGAL_STATE_CONTEXT.md` (storia) e, se è emersa una nuova superficie di rischio, le
  misure di sicurezza del registro art. 30.
- Conservare il registro dell'incidente per dimostrare l'accountability.

---

> **Da completare col professionista:** ripartizione precisa Titolare/Responsabile negli adempimenti;
> testo-tipo di comunicazione agli interessati; verifica URL/modulo Garante attuale.
