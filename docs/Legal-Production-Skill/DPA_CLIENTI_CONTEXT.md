# DPA verso clienti ristoranti — context skill

## Logica

- Il **ristorante cliente** è Titolare verso i suoi avventori (Mario, Luigi)
- **Matteo / azienda** è Responsabile per conto del ristorante
- Quindi: ad ogni nuovo cliente serve un DPA tra TE e LUI, in cui dichiari come tratti i dati per conto suo.

Speculare al DPA Supabase, ma dall'altro lato del rapporto.

---

## File template

`docs/_lavoro/Per matteo/Documenti Legali/DPA-template-clienti-ristoranti.md` — versione master
locale da personalizzare a ogni onboarding; non va committata.

Quando genera il template, l'agente deve includere:

1. Identità parti (placeholder `[NOME_RISTORANTE]`, `[INDIRIZZO]`, `[P.IVA]`)
2. Oggetto: trattamento dati clienti finali per finalità di prenotazione tavoli/eventi
3. Durata: pari al contratto SaaS
4. Categorie dati: come elencato in `DATA_INVENTORY_CONTEXT.md`
5. Categorie interessati: clienti finali del ristorante
6. Sub-responsabili: lista in `docs/legal/sub-processors.md` (link), inclusa Brevo quando invia
   email per il ristorante
7. Obblighi Matteo:
   - Misure tecniche (RLS, FORCE RLS, encryption transit/rest)
   - Notifica breach al ristorante entro 24h
   - Audit rights ragionevoli
   - Restituzione/cancellazione dati a fine contratto
8. Trasferimenti extra-UE: solo quelli verificati nei contratti dei fornitori (incluso Brevo), con
   relative garanzie
9. Riservatezza
10. Limitazione responsabilità (collegata al contratto SaaS principale)

---

## Workflow onboarding nuovo cliente

1. Personalizzare template con dati ristorante
2. Inviare PDF al cliente per firma
3. Ricevere copia firmata
4. Salvare in `docs/_lavoro/Per matteo/DPA-firmati-clienti/<slug-ristorante>.pdf`
5. Solo DOPO la firma → attivare tenant in produzione

---

## Quando aggiornare il template

- Cambia infrastruttura (es. cambio cloud provider)
- Aggiunto sub-processor nuovo
- Nuova categoria di dati raccolti
- Cambio normativa rilevante (es. nuovo regolamento UE)

Quando aggiorni template:
1. Bump versione (v1.0 → v1.1)
2. Inviare nuovo template a clienti esistenti per controfirma (NON è automatico — è un atto contrattuale)
3. Aggiornare `LEGAL_STATE_CONTEXT.md`

## Verifica aperta: Brevo

L'app usa già Brevo per email sulle prenotazioni e campagne marketing. Prima di usare o aggiornare
il template, l'avvocato deve verificare il DPA Brevo, il ruolo di Brevo come sub-responsabile, i dati
trasmessi e gli eventuali trasferimenti fuori UE/SEE. Non presentare il template come completo
finché questa verifica non è chiusa.
