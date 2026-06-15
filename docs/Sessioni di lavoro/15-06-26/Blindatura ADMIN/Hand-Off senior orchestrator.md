Profilo: agente senior orchestrator per CalendarBackup-v2.

Branch di lavoro: `env/test`.
DB scrivibile solo TEST `docnnernvpyrbwuzzach`.
PROD `rwuxgvldzrkabglkasym` solo read-only salvo conferma esplicita Matteo.

Prima di fare qualunque cosa:
1. Leggi `AGENTS.md`.
2. Leggi `docs/Comunicazione-Skill/VOCABOLARIO.md`.
3. Leggi `docs/APP_CONTEXT_SKILL.md` §0.
4. Instradati alla skill d'area corretta.
5. Per revisione/testing carica `docs/Testing-Skill/TESTING_SKILL.md`.
6. Per Admin Impostazioni parti da:
   - `docs/Admin-Skill/ADMIN_SKILL.md`
   - `docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md`
   - `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` §3-quater.5-6
   - se tocchi Prenota pubblico: `docs/Prenota-Skill/PRENOTA_SKILL.md` + context layout/form/data flow pertinente.

## Stato ultimo capitolo stabile

Ultimo commit pushato noto prima della nuova blindatura:

- Branch: `env/test`
- Commit: `aa87801 fix(admin): blind settings form save`
- Capitolo chiuso: M4 Admin Impostazioni / Personalizza form Fase C + cleanup post-controverifica
- Validate allora verde: lint + typecheck + 648 test

Report M4 principali:

- `docs/Sessioni di lavoro/15-06-26/Report-fase-c-m4-admin-impostazioni-15-06-26.md`
- `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-intervista-m4-admin-impostazioni-15-06-26.md`
- Nota: il vecchio path `docs/Sessioni di lavoro/15-06-26/Report-intervista-m4-admin-impostazioni-15-06-26.md` risulta spostato/cancellato nel working tree corrente. Non ripristinare a mano senza capire il diff.

## Stato nuovo ciclo Blindatura ADMIN

Matteo ha chiesto priorità sulla blindatura completa della pagina Admin → Impostazioni locale:

- mappare ogni elemento visibile;
- definire vincoli, salvataggi, fallback e conflitti;
- fare test mirati;
- poi Fase D "rompi" + responsive 375 / 834 / 1280.

È stato aggiornato `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md`:

- Area 3 non è più considerata "Fase C = quasi blindata";
- ora è: **M4 Fase C chiusa + Fase D mappa completa da fare**;
- nuovo riferimento operativo: §3-quater.5 e §3-quater.6.

Agente senior 1 ha completato la mappa read-only e prodotto:

- `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-mappa-impostazioni-locale-15-06-26.md`

Esito mappa senior 1:

- Anagrafica, contatti, orari, salvataggio core: maturi dopo M4.
- La pagina Impostazioni **non è ancora blindata end-to-end**.
- Mancano test/fix su: fasce Classic, tema app, sfondo Prenota, Personalizza form, carosello, promo UI, Fase D rompi, QA responsive.
- Sono state chiuse due decisioni prodotto nuove con Matteo:
  - **D-M1:** eliminazione card/carosello deve chiedere conferma con modale in-app.
  - **D-M2:** gradienti/tile non devono più essere scelta sfondo tenant; modello finale = striscia laterale oppure full-page oppure crema tecnica.

## Prompt già lanciati da Matteo

Al momento Matteo ha lanciato i primi 2 prompt operativi suggeriti:

1. **Batch 1 — D-M1 + promo copy**
   - Modale conferma delete card/carosello in `BookingFormConfigPanel`.
   - Fix copy modale delete promo: non deve dire "prossimo salvataggio" perché usa `saveSilently`.
   - Test attesi: `settings-form-config`, `settings-promo`.

2. **Batch 2 — D-M2 sfondi Prenota**
   - Rimuovere path gradient/tile come scelta tenant.
   - Migrate-on-read valori legacy a neutro sicuro.
   - Pubblico: striscia oppure full-page oppure crema tecnica.
   - Aggiornare context Prenota/Admin.
   - Test attesi: `settings-background` + superficie pubblica.

Matteo sta aspettando l'esito di questi due agenti.

## Cosa deve fare il prossimo senior

Non partire direttamente con nuovi fix.

Prima fase: **controverifica dei 2 batch appena lanciati**.

Checklist controverifica:

1. Conferma `git status --short --branch`.
2. Identifica tutti i file modificati dai due agenti.
3. Leggi i report prodotti dai due agenti, se presenti, nella cartella:
   - `docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/`
4. Confronta diff reale vs report:
   - D-M1 davvero implementato?
   - delete card/carosello ha modale su riga collassata ed editor?
   - Annulla non rimuove?
   - Conferma rimuove solo stato locale e alza dirty?
   - delete promo ha copy coerente con `saveSilently`?
   - D-M2 elimina davvero gradient/tile dal modello pubblico/admin?
   - valori legacy `gradient-*` / `tile-*` sono safe?
   - striscia vince ancora su full-page?
   - full-page resta full-page?
   - crema tecnica resta fallback, non quarta opzione admin?
5. Controlla che non sia stato toccato `booking_window_days`.
6. Controlla che non siano state aggiunte migrazioni non richieste.
7. Controlla che non sia stata esposta in whitelist anon una key vietata (`timezone`, `daily_guest_limit`, `booking_window_days`) senza decisione esplicita.
8. Esegui test mirati dei batch.
9. Solo se i test mirati sono verdi, esegui `npm run validate`.
10. Se trovi difetti logici, segnala findings prima dei test verdi.

## Decisioni M4 ancora vincolanti

- Impostazioni accessibili senza distinzione admin/staff.
- `restaurant_name` obbligatorio al salvataggio.
- Pagina Prenota non deve inventare fallback da `organizationName`.
- Email, telefono, indirizzo opzionali; se vuoti non compaiono in Prenota.
- Cap anagrafica: nome 45, email 65, telefono 30, indirizzo 120.
- Orari opzionali; se tutti chiusi/non configurati, footer Orari non compare in Prenota.
- Orari non limitano le prenotazioni pubbliche; se malformati, admin non salva e pubblico non crasha.
- `daily_guest_limit`: 0/vuoto = nessun limite; blocca solo pubblico, admin può sforare con avviso.
- `timezone`: tecnico, default `Europe/Rome`, niente UI Classic.
- `app_theme`: solo back-office, non cambia Prenota/QR.
- Card scorrevole + carosello sono entrambi core.
- Salvataggio Impostazioni: un solo footer + una sola `PublicDataSaveConfirmModal` per Anagrafica + Personalizza form.
- `booking_window_days` / "finestra prenotazione" è FUORISCOPE: non implementare, non aggiungere migrazioni, non esporre in whitelist anon senza nuova decisione esplicita Matteo.

## Nuove decisioni da rispettare

### D-M1 — Delete card/carosello

Il cestino su card/carosello non deve eliminare subito.

Comportamento voluto:

- click cestino → modale in-app;
- Annulla → nessuna modifica;
- Elimina → rimozione dallo stato locale + dirty;
- il DB cambia solo al footer `Salva modifiche`;
- vale sia per riga collassata sia per editor aperto.

### D-M2 — Sfondi Prenota

Gradienti/tile non sono più una scelta tenant.

Comportamento voluto:

- Admin sceglie solo striscia laterale o full-page;
- se non c'è né striscia né full-page, pubblico usa crema tecnica;
- valori legacy `gradient-*` / `tile-*` non devono crashare e non devono riapparire come scelta;
- il fallback crema resta tecnico: striscia-mode, primo paint, asset non caricato, nessuna scelta decorativa.

## Prompt successivi consigliati

### Se batch 1 e 2 sono corretti

Usa un prompt di **Fase D rompi**, non un altro prompt di fix generico.

Obiettivo:

- provare a rompere Impostazioni locale;
- verificare 375 / 834 / 1280;
- verificare Prenota pubblico dopo le modifiche;
- produrre findings ordinati per gravità;
- decidere con Matteo quali fix fare.

Prompt consigliato:

```text
Profilo: Verifica deep — Fase D rompi Admin Impostazioni.
Branch: env/test. DB solo TEST. PROD vietato.

Parti dai report:
- docs/Sessioni di lavoro/15-06-26/Blindatura ADMIN/Report-mappa-impostazioni-locale-15-06-26.md
- report batch D-M1/promo
- report batch D-M2 sfondi

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Testing-Skill/TESTING_SKILL.md §7
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.6
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md

Missione:
non implementare nuove feature. Prova a rompere Impostazioni locale.

Casi obbligatori:
- doppio click Salva;
- cambio pill Anagrafica/Form durante dirty;
- cambio sezione/logout durante save pending;
- annulla/riapri modali;
- delete card/carosello annulla/conferma;
- promo delete/toggle/apply;
- sfondo striscia/full-page/neutro;
- testi lunghi;
- campi vuoti;
- dati legacy/null;
- viewport 375 / 834 / 1280;
- smoke Prenota pubblico per nome, contatti, orari, sfondo, form.

Output:
findings prima, severità, passaggi riproduzione, fix consigliato o "voluto".
Solo se trovi fix piccoli e locali chiedi un prompt Esecuzione dedicato.
Non dichiarare Area 3 blindata se FU-009 o QA responsive restano aperti.
```

### Se batch 1 o 2 hanno difetti

Non passare a Fase D. Prepara un prompt fix mirato sul difetto reale trovato.

Formato prompt fix:

```text
Profilo: Esecuzione deep.
Branch: env/test. DB solo TEST. PROD vietato.

Contesto:
controverifica batch [D-M1/D-M2] ha trovato questo difetto: [finding preciso].

Leggi:
- AGENTS.md
- docs/APP_CONTEXT_SKILL.md §0
- docs/Admin-Skill/ADMIN_SKILL.md
- docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md §3-quater.5-6
- docs/Admin-Skill/contesto/ADMIN_SETTINGS_CONTEXT.md
- [context Prenota pertinente se tocca pubblico]
- docs/Testing-Skill/TESTING_SKILL.md

Implementa SOLO:
[fix puntuale]

NON toccare:
- booking_window_days
- migrazioni
- PROD
- parti non citate

Test:
[test mirati]

Poi esegui:
- test mirati
- npm run validate se i test mirati passano

Aggiorna report/context/test index solo se il comportamento stabile cambia.
Niente commit/push.
```

## Residui ancora aperti dopo i due batch

Anche se D-M1 e D-M2 passano, restano:

- `settings-time-slots`: fasce Classic, add/delete, overlap, overnight, capienze, mutation fail.
- `settings-theme`: tema admin-only, preview, annulla/salva, immagini mancanti.
- `settings-carousel-crud`: FU-009 CRUD slide carosello admin.
- `settings-save-guard`: doppio click, save pending, cambio pill/sezione/logout.
- QA responsive Impostazioni + Prenota pubblico 375 / 834 / 1280.
- FU-051: audit date mock future responsive nei test.
- Divergenza TEST 053/054: cronologia remota TEST contiene migrazioni su `booking_window_days`, repo no. Non promuovere su PROD. Eventuale riallineamento solo sessione DB dedicata.

## Regole operative

- Non navigare a tappeto: mappa per schermata/flusso, poi apri solo file pertinenti.
- Se Matteo dice "prepara prompt", non scrivere codice: consegna solo prompt.
- Se Matteo dice "revisiona/controlla/verifica", fai review critica: findings prima, test verdi non bastano se trovi difetti logici.
- Se il fix è piccolo e validate passa, puoi implementare e aggiornare report/context, ma commit/push solo se Matteo lo chiede esplicitamente.
- Working tree può essere sporco per agenti paralleli: non revertire modifiche altrui.
