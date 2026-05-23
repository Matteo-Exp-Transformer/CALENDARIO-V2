# Privacy Policy — context skill

> Scopo: regole per scrivere/aggiornare `src/pages/PrivacyPolicyPage.tsx`.

---

## Struttura obbligatoria (sezioni minime art. 13-14 GDPR)

1. Titolare del trattamento (ristorante) + come contattarlo
2. **Responsabile del trattamento** (Matteo / l'azienda di Matteo)
3. Tipi di dati raccolti (TUTTI quelli in `DATA_INVENTORY_CONTEXT.md`)
4. Finalità di ciascun trattamento
5. Base giuridica per ciascun trattamento (consenso, contratto, legittimo interesse, obbligo di legge)
6. Sub-processor (Supabase, Vercel, email provider) + region
7. **Trasferimenti extra-UE** + base legale (SCC / DPF)
8. Periodo di conservazione (per ogni categoria di dati)
9. Diritti dell'interessato (accesso, rettifica, cancellazione, portabilità, opposizione, reclamo Garante)
10. Modalità di esercizio dei diritti (email contatto)
11. **Dati sensibili** (se raccolti — es. dietary_restrictions) — sezione dedicata art. 9
12. Cookie e storage browser
13. Data ultima modifica + versione

---

## Regole di stile

- **Lingua semplice** — leggibile da un cliente di ristorante, non da un avvocato
- **Nessun copia-incolla da template generici** — deve riflettere ciò che FA l'app
- **Nome ristorante dinamico** da `useTenantContext()` — mai hardcoded
- **Email contatto** dinamica per tenant (campo `organizations.contact_email` o fallback)
- **Versione + data** in fondo, formato `v1.0 — 2026-05-23`

---

## Errori da evitare

- ❌ Dire "non condividiamo dati con terzi" — è FALSO, li condividi con Supabase
- ❌ Dire "conserviamo per 24 mesi" se non hai un job di cleanup → o aggiungi il job o dichiari "per durata contratto"
- ❌ Omettere i dati sensibili (dietary_restrictions = dato salute)
- ❌ Omettere indirizzo IP (lo raccogli in rate_limits)
- ❌ Omettere localStorage Supabase Auth
- ❌ Dichiarare cookie banner "non necessario" se hai aggiunto Google Analytics

---

## Workflow aggiornamento

1. Carica `DATA_INVENTORY_CONTEXT.md` — verifica realtà attuale
2. Confronta con sezioni 3, 5, 6 della Policy esistente
3. Se discrepanze → aggiorna Policy
4. Bump versione + data nella sezione 13
5. Aggiorna `LEGAL_STATE_CONTEXT.md` storia modifiche
6. Commit `docs(legal): aggiorna privacy policy v<N>`

---

## Quando serve consulente legale vero (non basta agente)

- Aggiunta dati biometrici / sanitari (oltre dietary_restrictions)
- Espansione fuori UE (USA, UK, Svizzera)
- Trattamento minori <14 anni come target principale
- Profilazione automatica con decisioni significative
- Causa / ispezione Garante

In questi casi: STOP, parlare con un avvocato privacy. L'agente può solo orientare.
