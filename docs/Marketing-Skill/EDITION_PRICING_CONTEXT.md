---
name: edition-pricing
description: >-
  Pricing delle edition e degli add-on di CalendarBackup-v2.
  Prezzi approvati da Matteo (intervista WP-F1, 12-06-26).
---

# Edition Pricing

> **Stato:** prezzi **approvati** da Matteo il 12-06-26 (WP-F1, `MASTERPLAN_ALLINEAMENTO.md`).
> **Revisione 12-06-26 (post-analisi senior):** Pro 79→**69€**, offerta fondatori da 3→**6 mesi**. Resto invariato.
> Fonte analisi: `docs/Sessioni di lavoro/12-06-26/Report-analisi-legale-vendita-12-06-26.md`.
> Non modifica il codice edition — solo listino e condizioni commerciali per vendita/demo.

## Regola di posizionamento

**Zero commissioni a coperto, mai.** Canone fisso; i dati e le prenotazioni restano del ristorante.

---

## Edition — listino standard

| Edition | Mensile | Annuale (2 mesi gratis) | Incluso |
|---------|---------|-------------------------|---------|
| **Classic** | **29€** | **290€/anno** | Prenotazioni, calendario, form pubblico, impostazioni |
| **Pro** | **69€** | **690€/anno** | Tutto Classic + sidebar, Home KPI, CRM, Servizio/tavoli, walk-in, no-show, Analytics, **Menu QR incluso** |
| **Enterprise** | **129€/sede** | **1.290€/anno per sede** | Tutto Pro + multi-sede / features enterprise future — **solo su preventivo**, non self-service |

*Annuale = paga 10 mesi, 2 gratis (stessa regola su tutti i piani).*

---

## Add-on (su Classic)

| Feature | Prezzo mensile | Prezzo annuale |
|---------|---------------|----------------|
| **Menu QR** (menu digitale) | **+16€** | **+160€/anno** |

Attivazione tecnica: riga in `tenant_features` con `feature_key = 'qrMenu'` (vedi `MARKETING_SKILL.md` §3).
Su **Pro** e **Enterprise** il Menu QR è già incluso nel canone.

---

## Offerta fondatori (fase vendita diretta)

Sconto **−50% sui primi 6 mesi** di abbonamento. A scadenza il ristoratore può **cambiare piano** o **rinnovare allo stesso piano** al listino standard.

| Piano | Prezzo fondatori (mesi 1–6) | Poi (listino standard) |
|-------|----------------------------|-------------------------|
| Classic | 14,50€/mese | 29€/mese |
| Classic + Menu QR | 22,50€/mese (14,50 + 8) | 45€/mese (29 + 16) |
| Pro | 34,50€/mese | 69€/mese |
| Enterprise | 64,50€/sede/mese | 129€/sede/mese |

In cambio dello sconto: feedback, testimonianza/recensione quando possibile, disponibilità come referenza.

---

## Trial, onboarding e servizi una tantum

| Voce | Condizione |
|------|------------|
| **Prova gratuita** | **30 giorni**, senza carta — coerente con attivazione su invito manuale oggi |
| **Setup** (menu, orari, fasce) | **Incluso** solo per clienti **fondatori**; poi **100€** una tantum |
| **Fotografo piatti** | **200€** (fino a **25 foto**); oltre 25 foto **supplemento da definire** |
| **Referral** | **1 mese gratis** a chi porta un altro ristorante che si abbona |

---

## Ipotesi non approvate (restano nel report, non in listino)

- Prezzi concorrenza e fascia di mercato: solo orientamento in `Report-analisi-legale-vendita-12-06-26.md`.
- Self-service con pagamento carta (Stripe): non esiste ancora nel prodotto.
- Supplemento foto oltre 25: **da definire** con Matteo al primo ordine reale.

---

## Coerenza con il codice

| Decisione commerciale | Dove nel prodotto |
|----------------------|-------------------|
| Classic vs Pro vs Enterprise | `organizations.edition` + `buildFeatures()` in `src/config/features.ts` |
| Menu QR su Classic | add-on via `tenant_features` (`qrMenu`) |
| Menu QR su Pro+ | bundle Pro, nessun add-on separato |
