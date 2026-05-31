# Cose da fare per la produzione

Lista di azioni che Claude non può eseguire al posto tuo (richiedono accesso
manuale alla dashboard Supabase, account a pagamento, decisioni legali/commerciali).

Aggiornato: 2026-05-23 (v2)

---

## ✅ Già fatto

- [x] **Leaked password protection** → ON (Auth → Policies)
- [x] **Service role key ruotata** (2026-05-23) — aggiornata anche in `.env.local` locale. Vercel non toccato (frontend non usa service key). Edge Functions su Supabase usano automaticamente la nuova key.
- [x] **DPA Supabase firmato** (2026-05-23) — Ref `Q4RYF-5FVPD-4LXZY-8JABB`, salvato in `docs/_lavoro/Per matteo/Documenti Legali/`.

⚠️ **IMPORTANTE**: il modulo DPA Supabase che hai firmato NON è il modulo da girare ai clienti ristoranti. È il TUO contratto con Supabase (tu Customer, Supabase Processor). Ai ristoranti serve un altro DPA, quello dove TU sei Processor e LORO sono Controller. Lo trovi nella sezione 3 sotto (da generare).
- [x] **MFA** → enable sull'account owner Supabase. (Considera "verify enable" per forzarlo sempre.)

---

## 🟡 Da fare quando passi a piano Pro / hai i primi clienti paganti

### Backup e disaster recovery
- [ ] **Upgrade piano Supabase** da Free a Pro (necessario per i punti sotto)
- [ ] Attivare **PITR (Point-in-Time Recovery)** dalla dashboard → Database → Backups. Senza PITR, il massimo che recuperi è il backup giornaliero del piano Free → in caso di "DROP TABLE" per errore puoi perdere fino a 24h di dati.
- [ ] Verificare che la frequenza dei backup sia adeguata al volume di prenotazioni.

### Conferma email admin
- [ ] **Verificare "Confirm email" ON** in Auth → Providers → Email. Senza questo, un attaccante con un token di invito valido può registrare un admin con un'email che non gli appartiene. Già parzialmente protetto dal check `tokenData.email !== email` nella Edge Function `validate-invite`, ma "Confirm email" aggiunge una seconda barriera.

### SSL Enforcement
- [ ] **Project Settings → Database → SSL Enforcement** → ON.
  - Se non lo trovi nella dashboard (il pannello cambia spesso), usa il CLI Supabase:
    ```bash
    supabase ssl-enforcement get --project-ref rwuxgvldzrkabglkasym --experimental
    supabase ssl-enforcement update --enable-db-ssl-enforcement --project-ref rwuxgvldzrkabglkasym --experimental
    ```
  - **Attenzione**: i comandi che ti aveva passato l'agente di assistenza (`supabase ssl-enforcement --project-ref {ref} get`) erano sbagliati nella sintassi — il `--project-ref` va DOPO il sub-comando `get`/`update`, non prima.

---

### Repository pulita prima dell'apertura pubblica

- [ ] **Nuova repository pulita, senza `docs/` e file interni.** Prima di esporre il codice (repo pubblico o consegna), creare una repository nuova che NON contenga la cartella `docs/` né altri file interni (report di sessione, prezzi, DPA, guide, query di test, skill system). Oggi `docs/` è gitignored ma alcuni file sono tracciati con `git add -f` → restano nella history e sarebbero visibili.
  - **Perché serve:** `docs/` contiene materiale che non va esposto inutilmente — analisi commerciali, prezzi, documenti legali, logica interna dello skill system, dettagli di sicurezza. Esporli regala informazioni a chiunque guardi il repo.
  - **Come si fa:** vedi `GUIDA-repo-pulito-pubblico.md` (stessa cartella). In sintesi: repo nuova partendo da uno stato pulito (non da un semplice fork, che porterebbe la history), copiando solo `src/`, config, `supabase/migrations/`, `public/`, README — escludendo `docs/` e i file privati. Verificare con `git log` che la nuova repo non contenga commit con file interni.
  - **Se non lo fai:** materiale commerciale/legale/strategico resta pubblicamente leggibile nella history git anche dopo averlo cancellato dall'ultima versione.

---

## 🔴 OBBLIGATORIO prima di vendere a clienti UE (GDPR Compliance)

### Come leggere questa sezione

Il **GDPR non è un singolo documento**. È un insieme di obblighi che la legge UE ti impone perché tratti dati personali (nomi, email, telefoni) di persone reali. Supabase ti ha detto "il DPA fa parte della tua GDPR compliance" perché il DPA è UN tassello del puzzle — il resto lo devi mettere TU.

Sotto trovi tutti i tassellli, in ordine: prima quello che stai facendo ora (DPA), poi gli altri.

---

### 1. DPA con Supabase ← in corso

**Cos'è:** Contratto tra TE e SUPABASE in cui Supabase si impegna a trattare i dati nel rispetto del GDPR (sicurezza, notifiche breach, sub-processors, ecc.).

**Catena delle responsabilità:**
- Il **ristorante cliente** è "Titolare del Trattamento" (Controller) verso i suoi clienti finali (Mario, Luigi).
- **Tu** sei "Responsabile del Trattamento" (Processor) per conto del ristorante.
- **Supabase** è "Sub-Responsabile" (Sub-Processor) per conto tuo.

Il GDPR ti obbliga ad avere un DPA scritto con ogni Sub-Processor.

**Stato:** Richiesto a Supabase il 2026-05-23. Devi compilare e firmare il documento ricevuto. Salvane la copia firmata in questa cartella.

**Sul messaggio "inseriscilo in un GDPR" di Supabase:** non intendono un documento specifico — vogliono dire "il DPA è una componente del tuo programma di GDPR compliance complessivo". I punti 2-7 sotto sono il resto di quel programma.

---

### 2. Privacy Policy sul tuo sito

**Cos'è:** Pagina pubblica del tuo sito che spiega agli utenti finali (admin ristoranti + loro clienti) quali dati raccogli, perché, per quanto li tieni, con chi li condividi, come si esercitano i diritti GDPR (accesso, cancellazione, portabilità, ecc.).

**Quando serve:** prima della messa online pubblica.

**Cosa fare:**
- Usa un generatore tipo Iubenda (~30€/anno) o iubenda free
- O fattela scrivere da un consulente privacy (~300-500€ una tantum)
- Deve essere linkata in footer di OGNI pagina e ACCETTATA esplicitamente in fase di signup

**Se non lo fai:** primo motivo di multa nelle ispezioni del Garante.

---

### 3. DPA TRA TE E I RISTORANTI CLIENTI

**Cos'è:** Stesso documento del punto 1, ma a un livello sopra. Tu sei Sub-Processor verso Supabase; sei Processor verso i tuoi clienti. Quindi ogni ristorante che usa la tua app deve firmare un DPA CON TE.

**Quando serve:** all'onboarding di ogni nuovo cliente, allegato al contratto di servizio / ToS.

**Cosa fare:** template DPA italiano scaricabile gratis da privacylab.it, garanteprivacy.it, o iubenda. Lo personalizzi una volta, lo fai firmare a tutti i clienti.

**Se non lo fai:** il ristorante è esposto a multa, e ti farà causa per inadempienza contrattuale.

---

### 4. Registro dei trattamenti (art. 30 GDPR)

**Cos'è:** Documento INTERNO (non pubblicato) in cui elenchi: quali dati personali tratti, per quali finalità, dove sono conservati, per quanto, chi vi accede, misure di sicurezza.

**Quando serve:** sempre, dal primo dato trattato. Va esibito al Garante se ti fa controllo.

**Cosa fare:** template Excel del Garante (scaricabile gratis su garanteprivacy.it). Compili una riga per ogni "trattamento" (es. "prenotazioni clienti finali", "account admin ristoranti", "log applicativi").

**Se non lo fai:** sanzione amministrativa in caso di ispezione.

---

### 5. Cookie banner (se applicabile)

**Cos'è:** Banner che chiede il consenso ai cookie non strettamente tecnici.

**Quando serve:** SE usi Google Analytics, Hotjar, pixel Facebook, ecc. NON serve per cookie di sessione tecnici (login Supabase). Verifica con DevTools quali cookie scrivi al primo accesso.

**Cosa fare:** se non usi tracking → niente da fare. Se usi → cookiebot.com o iubenda Cookie Solution.

---

### 6. Procedura Data Breach

**Cos'è:** Documento interno + procedura operativa: cosa fai se ti bucano il DB.

**Obblighi di legge:**
- Notifica al Garante entro **72 ore** dalla scoperta
- Notifica agli utenti coinvolti se "alto rischio"

**Cosa fare:** scriviti un mini-runbook (1 pagina) con: chi contattare per primo, come isolare il danno, template email per utenti, link al form di notifica del Garante (garanteprivacy.it/jetspeed/portal/media-type/html/user/anon/page/breach.psml).

**Se non lo fai:** quando succede sei nel panico e fai danni. Le multe per mancata notifica sono pesanti (fino a 10M€ o 2% del fatturato).

---

### 7. Gestione richieste utenti (diritti GDPR)

**Cos'è:** Endpoint/procedura per quando un utente ti chiede "cancellami tutti i dati", "dammi un export dei miei dati", "rettifica questa info".

**Quando serve:** dalla prima richiesta. Hai **30 giorni** per rispondere per legge.

**Cosa fare ora (MVP):** email dedicata (privacy@tuodominio.it) + checklist scritta di cosa cancellare quando arriva una richiesta (booking_requests, customers, admin_users, auth.users, email_logs).

**Cosa fare in futuro:** pulsante "Cancella account" in dashboard admin che fa partire un job di cancellazione cascade.

---

### TL;DR sulla priorità GDPR

| Quando | Cosa |
|---|---|
| Adesso (MVP, amici) | DPA Supabase (in corso) |
| Prima del primo cliente pagante | Privacy Policy + DPA verso clienti + Registro trattamenti |
| Prima dell'apertura pubblica | Cookie banner (se applicabile) + procedura breach + email privacy@ |
| Continuativo | Aggiornare il registro ogni volta che aggiungi un trattamento nuovo |

---

## 📝 Note generali

- Quando attivi qualcosa qui sopra, spostalo nella sezione "Già fatto" con la data.
- Se aggiungi nuovi item, separali per priorità (verde/giallo/rosso).
- Per ogni item: cosa, perché serve, come si fa, cosa succede se non lo fai.
