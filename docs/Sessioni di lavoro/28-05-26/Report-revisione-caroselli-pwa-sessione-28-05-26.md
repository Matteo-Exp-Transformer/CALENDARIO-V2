# Report revisione caroselli e strategia PWA - 28-05-26

## Cosa e stato fatto

1. Aggiornate le skill DB/app con la nota Supabase 2026: nuove tabelle `public` devono avere GRANT espliciti oltre a RLS e policy.
2. Verificato il fix produzione dei limiti carosello Prenota: codice e DB produzione risultano allineati a 19 / 18 / 38.
3. Analizzato perche in deploy potevano comparire ancora vecchi limiti: `main` non conteneva il commit dei nuovi limiti, mentre `env/prod` si; possibile cache PWA o branch deploy errato.
4. Chiarito il requisito prodotto: caroselli Menù QR e Pagina Prenota devono restare separati, con dati e path Storage indipendenti.
5. Creato il piano PWA: all'apertura dell'app admin Mario deve entrare gia sulla versione aggiornata; niente reload forzato mentre sta compilando.
6. Revisionato il lavoro dell'agente sui caroselli separati.

## Revisione lavoro agente

L'agente ha fatto un intervento coerente con il requisito:

- Mario nel Menù QR continua a salvare carosello e foto dentro il singolo QR.
- Mario in Personalizza form continua a salvare il carosello Prenota dentro la configurazione della Pagina Prenota.
- I nuovi upload Prenota non usano piu il prefisso `qr/draft/...`, ma un path dedicato `booking-form/...`.
- La logica upload condivisa e stata spostata fuori dal pannello QR, riducendo il rischio che futuri agenti pensino che il carosello Prenota appartenga al Menù QR.
- Il vecchio hook `useMenuHomepageConfig` e stato rimosso dal codice sorgente attivo; non risultano import rotti.

## Problemi trovati nella revisione

Nessun problema funzionale bloccante trovato nel codice dell'agente.

Rischio residuo: alcune documentazioni legacy continuano a citare `menu_homepage_config` come se fosse ancora il flusso QR attivo. Il comportamento app attuale usa `menu_qr_codes` per QR e `booking_public_form_config` per Prenota, quindi questa e soprattutto una fonte di confusione per futuri agenti.

## File toccati nella sessione

| Area | Effetto per Mario |
|------|-------------------|
| Skill DB/app | Gli agenti futuri sanno che nuove tabelle Supabase richiedono GRANT espliciti e verifica ambiente test prima della produzione. |
| Skill Personalizza form / Menù QR | Gli agenti futuri vedono che Prenota e QR hanno caroselli separati, limiti separati e path Storage separati. |
| Piano PWA | La decisione e: app admin aggiornata all'apertura, senza reload automatico mentre Mario lavora. |
| Revisione agente | Confermata separazione dati caroselli; segnalata solo documentazione legacy residua. |

## Test eseguiti

- `npm run typecheck` - OK
- `npm run lint` - OK
- `git diff --check` - OK

## File di skill aggiornati

| Skill | Cosa e cambiato |
|-------|-----------------|
| `APP_CONTEXT_SKILL.md` | Aggiunta nota Supabase GRANT 2026 e regola separazione caroselli Prenota/QR. |
| `DB_SKILL.md` | Workflow migrazioni spostato su verifica MCP test + GRANT espliciti. |
| `DB_MIGRATIONS_CONTEXT.md` | Template migrazione aggiornato con GRANT. |
| `DB_SCHEMA_CONTEXT.md` | Pattern RLS aggiornato con GRANT espliciti. |
| `BOOKING_FORM_CONFIG_PANEL_CURSOR_CONTEXT.md` | Documentato path Storage dedicato Prenota e hook upload neutro. |
| `PUBLIC_MENU_SKILL.md` | Documentato path QR separato da Prenota e limiti caratteri distinti. |

## Cosa resta

- Allineare o archiviare le parti documentali legacy che parlano ancora di `menu_homepage_config` come flusso attivo.
- Implementare il piano PWA solo dopo verifica del branch deploy produzione.
- Valutare build version/commit visibile o loggabile in produzione.

## Deviazioni dal plan

Nessuna deviazione critica. La revisione ha confermato il fix agente, ma ha lasciato come rischio residuo la documentazione legacy non ancora ripulita completamente.
