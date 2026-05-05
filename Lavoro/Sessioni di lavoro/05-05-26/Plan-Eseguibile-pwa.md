
Piano (aggiornato) — Trasformare CalendarBackup-v2 in app installabile (desktop + mobile) con gating licenza
Contesto
L'app è una SPA React + Vite con backend Supabase, già in produzione su Vercel. L'obiettivo dell'utente è venderla come SaaS a ristoranti (canone mensile), con due requisiti:

Esperienza "app" sia su desktop che su mobile — il cliente deve avere un'icona, una finestra dedicata, l'aspetto di un programma vero, non di un sito web.
Tutela in caso di mancato pagamento — poter revocare istantaneamente l'accesso a un cliente che smette di pagare, senza dover cancellare i suoi dati storici.
L'app ha già una base solida: login Supabase Auth, controllo su admin_users, route protette via ProtectedRoute, multi-tenant tramite organizations (incluso un campo is_active già presente in DB ma non ancora controllato al login), RLS che isola ogni tenant.

La "tutela" la dà Supabase, non l'eseguibile: chiunque può puntare il browser all'URL Vercel, ma senza credenziali valide e abbonamento attivo non entra. L'eseguibile è solo il wrapper user-friendly per il cliente.

Approccio scelto: PWA (Progressive Web App)
Perché PWA invece di Electron / Pake / Capacitor:

Criterio	PWA	Electron	Pake	Capacitor
Desktop (Win/Mac)	OK (installabile)	OK	OK	OK
Mobile (iOS/Android)	OK (installabile)	NO	NO	OK
Toolchain extra	Niente	Node	Rust	Android SDK + Xcode
Aggiornamenti	Automatici (deploy Vercel)	Da gestire	Da gestire	Store re-submit
App Store / Play Store	Non necessario	N/A	N/A	Submit obbligatorio
Costo distribuzione	Zero	Firma cert. (~$300/anno)	Idem	Apple Dev $99/anno
Tempo implementazione	~1 ora	1-2 giorni	mezzo giorno	2-3 giorni
PWA è l'unica opzione che copre desktop + mobile + zero distribution overhead con una sola codebase. Il cliente apre l'URL una volta dal browser → click "Installa app" → da quel momento ha l'icona sulla home/desktop e l'app si apre in finestra dedicata, senza barra del browser. Aggiornamenti istantanei a ogni git push su Vercel.

Modifiche da fare
1. Aggiungere supporto PWA con vite-plugin-pwa
File da modificare: vite.config.ts, package.json

Installare vite-plugin-pwa come devDependency.
Configurare il plugin con aggiornamento con prompt (nuova versione disponibile, ricarica manuale scelta dall'utente).
Generare manifest.webmanifest con:
name: "CalendarBackup" (o nome che l'utente preferisce)
short_name: nome breve per l'icona
display: "standalone" (apre senza barra browser, sembra app nativa)
theme_color e background_color coerenti con la palette dell'app
start_url: "/admin" (se loggato va alla dashboard; se non loggato ProtectedRoute reindirizza a /login)
scope: "/"
Strategia caching service worker: CacheFirst solo per asset statici (JS/CSS/font/immagini/icone) ed esclusione totale delle richieste Supabase (*.supabase.co) dal runtime caching, per evitare dati stantii/sessioni incoerenti.
2. Creare le icone PWA
Cartella nuova: public/icons/

Servono almeno:

icon-192.png (192×192) — uso generico Android/desktop
icon-512.png (512×512) — splash screen Android, store
apple-touch-icon.png (180×180) — iOS
favicon.svg o favicon.ico — già presente, riutilizzare
Partire con placeholder generato (nome app + colore brand, sfondo non trasparente per leggibilità dock chiari/scuri) finché non c'è artwork definitivo. Sostituzione successiva: drop-in con stessi nomi file.

3. Aggiungere meta tags iOS in index.html (manifest gestito dal plugin)
File: index.html

<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"> (iOS non legge il manifest per l'icona)
<meta name="theme-color" content="...">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
4. Gating licenza: check organizations.is_active al login
File da modificare: src/features/booking/hooks/useAdminAuth.ts

Attualmente, in useAdminAuth.ts (intorno alle righe 103-116 della fase di sign-in e 50-54 della checkSession), dopo aver verificato che l'admin esista in admin_users, non si controlla che la sua organization sia attiva.

Modifica: dopo il fetch dell'admin user, aggiungere una select su organizations.is_active filtrata per id = adminUser.tenant_id. Se is_active === false:

Effettuare immediatamente supabase.auth.signOut().
Restituire un errore user-friendly: "Abbonamento non attivo. Contatta il supporto."
In checkSession (al refresh): fare signOut + impostare user = null + scrivere in sessionStorage un flag (es. auth_revoked_reason="subscription_inactive") per evitare logout silenzioso.
Lo stesso check va fatto sia in signIn che in checkSession, per chiudere entrambe le porte (login fresco e sessione persistita).
AdminLoginPage legge il flag al mount e mostra un banner persistente dedicato ("Abbonamento non attivo. Contatta il supporto.").

Nota implementativa: prima di applicare il gating, verificare che useAdminAuth.ts sia l'unico entry point auth admin (cercare signInWithPassword, auth.getSession, onAuthStateChange). Se emergono entry point aggiuntivi, estrarre una funzione comune (es. assertActiveSubscription(tenantId)) e riusarla ovunque.

5. Bloccare prenotazioni pubbliche per tenant inattivo
File da modificare: componente/hook che risolve il tenant per /prenota/:tenantSlug

La pagina pubblica resta senza login, ma se il tenant è inattivo non deve accettare nuove prenotazioni.
Nel fetch del tenant via slug, aggiungere filtro is_active = true.
Se non trovato (slug inesistente o tenant inattivo), mostrare messaggio: "Prenotazioni temporaneamente non disponibili".

6. Documentazione cliente (opzionale ma consigliato)
File nuovo (da creare solo se l'utente lo chiede): istruzioni di installazione brevi (1 pagina) da inviare al cliente con screenshot di:

"Come installare l'app su Windows" (icona "+" nella barra Edge/Chrome → Installa)
"Come installare l'app su iPhone" (Safari → Condividi → Aggiungi a schermata Home)
"Come installare l'app su Android" (Chrome → menu → Installa app)
Questo file resta fuori dalla codebase, è materiale commerciale.

File critici (riepilogo dei percorsi)
File	Cosa cambia
package.json	+ vite-plugin-pwa in devDependencies
vite.config.ts	+ import e config del plugin PWA
index.html	+ meta tags Apple (manifest non inserito manualmente)
public/icons/	+ icone 192, 512, apple-touch
src/features/booking/hooks/useAdminAuth.ts	+ check organizations.is_active in signIn e checkSession
route pubblica /prenota/:tenantSlug	+ blocco tenant inattivo (is_active=true nel resolver tenant)
Nessuna modifica a schema DB (il campo is_active esiste già in supabase/migrations/001_schema_completo.sql).

Procedura per revocare un cliente (post-implementazione)
Andare su Supabase → tabella organizations → riga del cliente → impostare is_active = false.
Al prossimo refresh / riapertura app (o nuova azione protetta), il cliente viene buttato fuori e vede il banner persistente "Abbonamento non attivo".
I dati del ristorante restano in DB (storico prenotazioni, configurazioni). Per riattivarlo basta rimettere is_active = true.
Per cancellazione definitiva: rimuovere riga in admin_users e poi (se serve) cancellare l'utente in Supabase Auth → Users.
Note importanti
L'URL Vercel resterà sempre raggiungibile da qualsiasi browser. Non si può "obbligare" il cliente a usare solo l'app installata. Ma è irrilevante: il login Supabase è il vero gate. Anche se il cliente apre il sito da un Internet point in Mongolia, senza credenziali valide non entra.
La pagina pubblica di prenotazione /prenota/:tenantSlug resta senza login, ma viene bloccata quando organizations.is_active=false.
iOS Safari ha qualche limitazione PWA (es. push notification più recenti, alcune API hardware). Per l'uso "calendario + form" non è un problema.
Aggiornamenti: ogni volta che fai git push su main, Vercel ricompila, il service worker rileva la nuova versione e mostra prompt di aggiornamento all'utente. Zero re-distribuzione.
Verifica end-to-end
Dopo l'implementazione:

Build locale: npm run build → controllare che in dist/ ci siano manifest.webmanifest, sw.js, le icone.
Preview locale: npm run preview → aprire http://localhost:4173, in DevTools → Application → Manifest → verificare che il manifest sia rilevato senza errori, e Service Worker → "activated and running".
Test installabilità desktop: in Edge/Chrome dovrebbe apparire un'icona "Installa" nella barra URL. Cliccare → app si apre in finestra dedicata.
Test gating licenza (con DB di produzione, su un utente di test):
Login → entra correttamente.
In Supabase, settare organizations.is_active = false per quell'utente.
Refresh dell'app → deve essere buttato fuori a /login con messaggio "Abbonamento non attivo".
Re-login → deve ricevere lo stesso errore senza poter entrare.
Rimettere is_active = true → re-login funziona di nuovo.
Deploy su Vercel e ripetere test 3-4 dal dominio di produzione (necessario perché alcune feature PWA — installabilità da iOS, in particolare — richiedono HTTPS reale).
Test mobile: aprire da Safari iOS / Chrome Android → "Aggiungi a schermata Home" → verificare che si apra in modalità standalone (no barra browser) e che il login funzioni.

Checklist operativa customer support (v1)
1) Sospensione cliente: Supabase Studio → organizations → impostare is_active=false.
2) Verifica: chiedere al cliente refresh/reopen app; deve tornare a /login con banner "Abbonamento non attivo".
3) Riattivazione cliente: reimpostare is_active=true.
4) Verifica riattivazione: cliente effettua login e torna operativo.
5) Cancellazione definitiva (solo quando confermato): rimuovere mapping in admin_users, poi eventualmente cancellare utente da Supabase Auth.

Fase 2 (non inclusa in questo piano)
- Difesa in profondità lato DB: estendere policy RLS per negare accesso anche quando organization inattiva.
- Audit trail operativo: aggiungere tabella eventi (es. subscription_events) per tracciare chi cambia is_active e quando.
- White-label per tenant: solo se richiesto da clienti specifici (manifest dinamico + branding per slug).