# Analisi solidità e pulizia dell'app — 12-06-26

> Analisi 1 di 3. Eseguita da un sub-agent di revisione (lettura + comandi di verifica, zero modifiche),
> con i finding più gravi ri-verificati a mano sul codice. Nessun file di codice è stato toccato.

**Cosa è cambiato:** niente nel codice — questo è un check-up completo dello stato di salute.
**Cosa resta:** decidere quali delle 5 azioni urgenti affrontare e in che ordine.
**Serve una tua azione:** sì — leggere i finding ALTO e dare priorità.

---

## 1. Verifiche automatiche (risultati reali)

- **Lint**: pulito, 0 errori e 0 warning (con `--max-warnings 0`)
- **Typecheck**: pulito
- **Test**: **554 test passati su 554** (68 file, ~17s). Unico neo: warning React `act(...)` in `menuQrCategoryFieldCap.test.tsx` (rumore, test verdi)
- CI attiva su main (lint+typecheck+test); i 18 spec e2e girano solo a mano contro staging

## 2. Findings per gravità

### ALTO

**A1 — Le migrazioni nel repo NON corrispondono al database reale (drift di schema).**
Sul DB (verificato sia PROD che TEST via MCP) esiste la policy `anon_select_active_organizations` su `organizations`, ma non esiste in nessuna migrazione del repo. Dopo la migrazione `039_harden_organizations_public_view.sql` (vista `security_invoker`), la pagina pubblica funziona **solo grazie a quella policy fantasma**. Anche le policy di `restaurant_settings` sul DB hanno nomi diversi da quelle in `001_schema_completo.sql`.
*Effetto pratico:* se domani ricostruisci il DB dalle migrazioni (nuovo ambiente, disaster recovery), la pagina Prenota e il Menu QR di **tutti** i clienti smettono di trovare il ristorante. Oggi la "fonte di verità" delle migrazioni mente.

**A2 — Le impostazioni di TUTTI i ristoranti sono leggibili da chiunque, anonimo.** *(ri-verificato a mano)*
La policy `anon_select_restaurant_settings` è `USING (true)` ([001_schema_completo.sql:301](../../../supabase/migrations/001_schema_completo.sql)) e non è mai stata ristretta; la [026_security_hardening.sql:277](../../../supabase/migrations/026_security_hardening.sql) ha ri-grantato SELECT ad anon. Un visitatore qualsiasi può leggere le impostazioni di ogni tenant: limite coperti, promo, preset staff, configurazione form.
*Effetto pratico:* il ristorante A può spiare la configurazione del ristorante B (concorrente). Non è PII grave, ma in un SaaS multi-tenant è una falla di isolamento.

### MEDIO

**M1 — Race condition tenant pubblico vs sessione admin.**
`AdminAuthContext` lancia `checkSession()` su ogni route, comprese `/prenota/:slug` e `/menu/:slug`. Se nel browser c'è una sessione admin, `setTenantFromAdmin` può sovrascrivere il tenant appena risolto dallo slug — chi vince dipende da quale fetch finisce per ultimo.
*Effetto pratico:* il titolare loggato che apre la pagina Prenota di un altro ristorante (o la propria, per provarla) può vedere menu/orari/foto del ristorante sbagliato. La prenotazione finisce comunque sul tenant giusto (lo slug viaggia fino all'edge function): danno di visualizzazione, ma conflitto non gestito.

**M2 — Il pre-check disponibilità chiama una funzione che non esiste.**
`useCheckSlotAvailability` chiama `check-slot-availability`, ma su PROD sono deployate solo `create-booking` (v13) e `validate-invite` (v7). Il check è "fail-open" (su errore risponde "disponibile"), quindi niente overbooking — il guard vero è dentro create-booking. Però: una chiamata a vuoto per ogni prenotazione, e il cliente scopre che la data è piena solo **dopo** aver compilato tutto il form.

**M3 — Email: mitigato ma il flusso resta monco.**
`send-email` non esiste sul deploy (confermato). Il flag `VITE_ENABLE_SEND_EMAIL` (default false) evita i fallimenti silenziosi, ma il punto resta: **i clienti non ricevono mai email di conferma o rifiuto**, e `sendBookingCancelledEmail` non è chiamato da nessuno (codice morto). È anche il bisogno n.3 del cliente target — incrocia l'analisi vendita.

**M4 — Rate limiting aggirabile a raffica e mai ripulito.**
In `create-booking` l'IP viene registrato solo **dopo** un insert riuscito: N richieste parallele passano tutte il check, e i tentativi respinti dalla validazione non vengono mai contati. Inoltre `cleanup_rate_limits` esiste ma pg_cron NON è installato su PROD: le tabelle `rate_limits` e `ip_blacklist` crescono per sempre.

**M5 — Un ristorante disattivato può ancora ricevere prenotazioni.**
`create-booking` risolve il tenant senza filtrare `is_active`, e accetta chiamate senza login. La UI non mostra un tenant spento, ma una POST diretta all'endpoint inserisce comunque la prenotazione.
*Effetto pratico:* arrivano dati a clienti con abbonamento sospeso.

**M6 — 104 cast `as any` nel codice applicativo (test esclusi).**
Compresi i punti più critici (TenantContext, AdminAuthContext, query booking). I tipi generati dal DB vengono scavalcati: una colonna rinominata sul DB non verrebbe vista dal typecheck. Il typecheck "verde" vale meno di quanto sembri.

### BASSO

- **Codice morto**: `AcceptBookingModal.tsx`, `BookingCrossShineSubmitButton.tsx`, `PublicMenuPageHeader.tsx` mai importati; gli hook `useBookingRequests` e `useUpdateBookingStatus` mai usati e **duplicano** `useBookingMutations` senza guard anti-doppia-gestione né email — trappola se qualcuno li riusa.
- **Logger ignorato in ~25+ punti**: `console.error/warn` diretti contro la convenzione `src/lib/logger.ts`; in produzione restano visibili.
- **validate-invite**: il token è marcato usato *dopo* la creazione utente, in modo non-fatale — se l'update fallisce il token resta riutilizzabile; due POST parallele su un token senza email vincolata possono creare due admin. Rischio basso (inviti generati da voi).
- **Doc drift**: CLAUDE.md dice "29 test Vitest", sono 554.
- **package.json**: `@types/qrcode` sta in dependencies (andrebbe in devDependencies); `@vercel/node` sembra inutilizzato. Le dipendenze pesanti (fullcalendar, recharts, jspdf, dnd-kit) sono tutte realmente usate.

## 3. Cose fatte bene (vanno dette)

- La **026_security_hardening** è un lavoro serio: FORCE RLS, revoca GRANT superflui, RPC con check tenant interno, search_path fisso. Le policy admin filtrano tutte per `current_admin_tenant_id()`, INSERT compreso.
- **create-booking** è difensiva: limiti testo sincronizzati col client *con un test che ne verifica la sincronia*, doppio limite coperti, blacklist 24h, service_role mai esposto.
- Disciplina **`enabled: !!tenantId`** rispettata su tutti gli hook query: nessuna query parte senza tenant risolto.
- I **due client Supabase non vengono mai mischiati** (15 file controllati).
- Copertura test ampia e mirata (554 test + 18 e2e). Manca solo il test diretto della logica delle edge function (coperta indirettamente).
- Zero segreti committati, husky + CI attivi.

## 4. Giudizio complessivo

**Voto: 7/10.** Per un SaaS giovane è sopra la media: gate di qualità veri, RLS pensata, hardening fatto sul serio, edge function pubblica ben difesa. A togliere punti: le **migrazioni che non rispecchiano il DB reale** (un restore "pulito" romperebbe la pagina pubblica di tutti), la **lettura cross-tenant aperta** su restaurant_settings, e i **104 `as any`** che svuotano parte del valore del typecheck.

## 5. Le 5 azioni più urgenti

1. **Riallineare migrazioni ↔ DB**: `supabase db pull` o migrazione che codifica `anon_select_active_organizations` e le policy reali di `restaurant_settings`. È la condizione perché tutto il resto sia ricostruibile.
2. **Chiudere la lettura cross-tenant di `restaurant_settings`**: policy anon ristretta (whitelist di chiavi o vista pubblica filtrata, come già fatto per organizations).
3. **Guard sul checkSession**: sulle route `/prenota` e `/menu` non sovrascrivere il tenant pubblico con quello admin.
4. **create-booking**: filtrare `is_active = true` e registrare l'IP anche sui tentativi respinti.
5. **Pulizia mirata**: eliminare gli hook/componenti morti (i duplicati sono i più pericolosi), decidere il destino di `check-slot-availability` (deployarla o togliere la chiamata), schedulare o deprecare `cleanup_rate_limits`.

---

## 11. Domande di chiusura

❓ Q1 — Prompt ricevuti: riporta VERBATIM i prompt sostanziali che Matteo ti ha dato in questa chat.
✅ R1: Per questa analisi: «1. valutazione di solidà e pulizia dell'app: lancia sub agent per debuggare e analizzare strutta del codice, seguendo le tue indicazioni, e cogliere secondo la tua strategia, punti deboli, difetti o probematiche del codice, conflitti non considerati.» (dal prompt unico iniziale; il verbatim completo è nella R1 del report legale-vendita della stessa sessione).

❓ Q2 — Dati = diff reale? I numeri/valori/file citati nel report corrispondono al diff vero? Elenca cosa hai ri-verificato aprendo i file.
✅ R2: Nessun diff di codice (analisi read-only, confermato da `git status`: solo file report nuovi). I dati vengono dai comandi reali del sub-agent (lint/typecheck/554 test, MCP per le funzioni deployate e le policy sul DB). Ho ri-verificato personalmente i finding chiave: `001_schema_completo.sql:301` (policy anon `USING (true)` su restaurant_settings — confermata), `026_security_hardening.sql:275-278` (re-grant SELECT ad anon — confermato), `supabase/functions/` contiene solo check-slot-availability, create-booking, validate-invite (quindi `send-email` manca e `check-slot-availability` esiste nel repo ma il deploy PROD ne ha solo 2 — dato MCP del sub-agent), `src/lib/email.ts:37` chiama la funzione mancante.

❓ Q3 — File correlati allineati? Quali file erano collegati alla modifica (skill area, context, test, tipi) e hai verificato che siano aggiornati? Elencali (o «nessuno + perché»).
✅ R3: Nessuna modifica → nessun obbligo di allineamento. Però l'analisi HA TROVATO file di skill system disallineati dal codice: `.claude/CLAUDE.md` («29 test Vitest» vs 554 reali). La correzione è rimandata di proposito alla fase finale della sessione (aggiornamento docs/ guidato dalle 3 analisi insieme), non dimenticata.

❓ Q4 — Cosa NON hai fatto? Cosa volevi/dovevi fare e hai lasciato a metà o saltato? (vietato «tutto ok» a vuoto: se davvero nulla, scrivilo e di' perché ne sei certo.)
✅ R4: Nessun fix applicato — voluto: il task era analizzare, non correggere. Il sub-agent non ha testato direttamente la logica interna delle edge function (nessun test unitario esiste per quelle: coperte solo indirettamente da e2e e test di sincronia limiti). Le policy DB sono state verificate su PROD e TEST via MCP ma non ho fatto un confronto colonna-per-colonna dell'intero schema: il drift segnalato in A1 potrebbe non essere l'unico.

❓ Q5 — Attrito + miglioria: che difficoltà hai avuto nel workflow con lo skill system, e come lo miglioreresti? (critica + proposta nella stessa riga; se non hai avuto attriti, immagina quello più probabile.)
✅ R5: Attrito: CLAUDE.md contiene valori che invecchiano (29 test → 554) perché duplica dati misurabili dal codice; proposta: nelle skill scrivere «lancia `npm run test` per il conteggio» invece del numero fisso — i numeri vivi non vanno specchiati nei .md (è lo stesso principio «i valori vivono nel codice» già dichiarato dal sistema, applicato anche alle statistiche).

❓ Q6 — Contesto & hook: il contesto caricato dallo skill system era troppo / giusto / troppo poco? E gli hook che hai ricevuto ti sono stati utili o rumore?
✅ R6: Giusto: CLAUDE.md ha dato al sub-agent la mappa dei file critici (TenantContext, due client, edge functions, zone delicate) che si è rivelata accurata e ha accorciato l'analisi. Utile in particolare la sezione «Zone delicate»: 3 delle 4 segnalazioni si sono confermate vere nel codice. Nessun hook ricevuto durante questa analisi (quello di chiusura è scattato sul report precedente, ed è stato utile, non rumore).
