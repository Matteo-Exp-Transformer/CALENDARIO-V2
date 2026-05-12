Piano admin: responsive, navigazione, Home/Servizio/Analytics

Contesto skill





Prima di implementare: ADMIN_SHELL_SKILL.md → ADMIN_SHELL_CONTEXT.md + ADMIN_PAGES_CONTEXT.md dove serve.



UI/Tailwind v4: UI_EDIT_SKILL.md → contesto styling/components indicato dalla skill.



1. Responsive sotto ~645px (sidebar + main)

Problema: Con sidebar espansa w-56 (224px) su ~420px il main resta stretto; il rettangolo blu che vedi è l’overlay di ispezione Cursor, non l’app.

Direzione tecnica (da implementare in AdminShell.tsx):





Introdurre un breakpoint dedicato max-[645px] (oltre alla logica esistente useIsLg() a 1024px).



Sotto 645px, quando il menu è “espanso”, non affiancare aside a larghezza piena: usare drawer overlay (fixed + z-index sotto Modal/drawer CRM documentati in context, es. drawer CRM z-[9000] → sidebar overlay sotto quello ma sopra il main) con backdrop cliccabile per chiudere; il main occupa 100% larghezza quando il drawer è aperto.



Chiuso: mantenere rail stretto (w-16) o un solo FAB / header hamburger nel main che apre il drawer (preferibile se il rail ruba ancora troppo spazio sui 320px — da validare visivamente).



Focus/aria: aria-expanded, focus trap opzionale nel drawer, Escape per chiudere.



Second pass: controllare overflow su AdminDashboard.tsx (grid nav 2 colonne, hero titolo) e pagine CRM se necessario; niente classi Tailwind dinamiche.

Aggiornare dopo merge: paragrafo “Sidebar — comportamento responsive” in ADMIN_SHELL_CONTEXT.md.



2. Home al posto di “Prenotazioni” (sidebar) + contenuto

Obiettivo: Il pulsante in cima (oggi calendario + “Prenotazioni”) diventa Home; alla selezione si mostra la stessa esperienza di oggi: AdminDashboard.tsx (hero, tab, calendario, ecc.).

Modello stato consigliato:





Unificare la sezione shell che monta AdminDashboard in 'home' (o rinominare internamente ma un solo entrypoint).



Rimuovere il ramo che oggi fa section === 'prenotazioni' && <AdminDashboard /> e section === 'home' && <AdminHomePage /> in favore di: section === 'home' → <AdminDashboard />.



Default useState<AdminShellSection>('home').



Rimuovere 'prenotazioni' dal tipo AdminShellSection se non più usato, aggiornando commenti e doc che citano “NON aggiungere prenotazioni al NAV” (ADMIN_SHELL_CONTEXT.md).



AdminHomePage.tsx: non come shell principale per questo ingresso; tenerlo come placeholder per una fase 2 (dashboard riassuntiva) oppure integrarlo in seguito come tab interna o blocco in cima a AdminDashboard senza duplicare calendario completo (come già scritto in ADMIN_PAGES_CONTEXT).



3. Scambiare Servizio (sidebar) ↔ Impostazioni locale (nav dashboard)

Obiettivo: In sidebar, al posto di “Servizio”, azione verso Impostazioni locale (RestaurantSettingsTab); nella nav a griglia di AdminDashboard, al posto del bottone “Impostazioni locale”, aprire Servizio (ServizioPage via shell).

Implementazione senza refactor enorme:





AdminShell.tsx passa a AdminDashboard callback del tipo onOpenServizio: () => void e onOpenRestaurantSettings: () => void (nomi esemplificativi).





onOpenServizio → setSection('servizio').



onOpenRestaurantSettings → setSection('home') + segnalare tab iniziale settings-restaurant (pattern consigliato: prop initialTab / chiave sessionStorage monouso letta in useEffect in AdminDashboard, oppure React context minimo solo admin-shell ↔ dashboard — scegliere una sola strada e documentarla in ADMIN_SHELL_CONTEXT).



In AdminDashboard.tsx: sostituire le due NavItem corrispondenti (icone/label coerenti con Servizio vs Store) e aggiornare il footer quick-nav (stesse 6 azioni, stesso ordine logico) per non perdere accessibilità mobile.

Invariante: non reintrodurre cleanup su data-admin-theme (ADMIN_SHELL_CONTEXT.md).



4. Spostare CRM Clienti (sidebar) ↔ Visualizza Form Pubblico (nav dashboard)

Obiettivo:





Sidebar: al posto di “CRM Clienti”, shortcut Visualizza Form Pubblico (stessa logica di openPublicBookingForm / tenantSlug).



Nav dashboard (e coerenza footer): al posto del bottone “Visualizza Form Pubblico”, voce CRM Clienti che chiama setSection('crm') tramite callback da shell (onOpenCrm).

Aggiornare ADMIN_PAGES_CONTEXT.md se cambia il percorso UX verso il CRM.



5. Dati da mostrare in Home (domande + confronto mercato)

Nota: con il punto 2, l’ingresso “Home” mostra subito AdminDashboard; la Home riassuntiva resta prodotto da definire (tab o pagina dedicata).

Domande per te (da rispondere in design):





Ruolo: la Home è “apri lavoro” (pending, oggi) o “quadro comando” (KPI + alert)?



Frequenza: cosa deve vedere chi apre l’app 20 volte al giorno in 10 secondi?



Allerta: pending, conflitti capienza, richieste anomale (ospiti alti, note speciali)?



Concorrenza (TheFork Manager / Resy / OpenTable / gestionali locali): riepilogo coperti oggi/settimana, tasso conferma, no-show, fonti (se in futuro tracciate), prossimi slot critici — selezionare 3–5 widget per MVP.

Output pianificato: elenco widget MVP + hook/query in src/features/booking/hooks/ con queryKey tipo ['admin-home', tenantId] quando si implementa la vera Home.



6. Pagina Servizio (tavoli, sale, turni)

Allineamento: ADMIN_PAGES_CONTEXT.md (sezione Servizio); nuova migrazione 007_* solo quando lo schema è definito — non toccare migrazioni già applicate.

Domande:





Tavoli: solo lista nominata + capienza, oppure anche mappa sala (drag su canvas)?



Turni: allineati alle fasce orarie già usate dal calendario / booking_requests?



Assegnazione: collegare prenotazione → tavolo in MVP o solo configurazione statica?



Multi-sala: riuso delle “aree” già presenti in impostazioni (restaurantSettingRegistry)?

Fasi suggerite: (F1) CRUD tavoli/sale; (F2) definizione turni e capacità per turno; (F3) collegamento operativo alle prenotazioni.



7. Pagina Analytics

Scelta confermata: in prima battuta Analytics = metriche e trend su prenotazioni (come in ADMIN_PAGES_CONTEXT: trend, coperti, menu richiesti, clienti abituali) — senza duplicare la UI operativa di Servizio.

Aggiornamento da tua ultima precisazione: in fasi successive Analytics integrerà anche dati provenienti da Servizio (es. occupancy per turno, utilizzo tavoli, confronto capienza configurata vs prenotato). Implicazioni di pianificazione:





Modellare Servizio con identificatori stabili (tenant_id, table_id, service_window, timestamp) e, dove serve, eventi o snapshot leggibili in sola lettura da Analytics per evitare query UI pesanti.



Evitare logica duplicata: preferire viste/RPC Supabase o hook dedicati che leggono la stessa “fonte di verità” che Servizio scrive.

Domande: orizzonte report (oggi / 7g / 30g / custom), export CSV, confronto periodo precedente, metriche obbligatorie per il primo rilascio.



Verifica

Dopo implementazione codice: npm run typecheck && npm run lint && npm run test; smoke manuale su viewport 390px e 768px; aggiornare doc shell/pages se il comportamento responsive o la mappa sezioni cambiano.