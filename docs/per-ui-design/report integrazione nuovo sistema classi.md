Report analisi UI / librerie CSS — CalendarBackup-v2
1. Stato attuale dell’app

L’app è già una base moderna: React 18 + Vite + TypeScript + Tailwind CSS v4, con Supabase, TanStack Query, React Router e PWA.

Il punto importante è che lo styling non è centralizzato in un unico sistema. Oggi convivono:

classi Tailwind direttamente nei componenti;
CSS globale in src/index.css;
inline style React;
blocchi <style> dentro alcuni componenti.

Quindi la UI è modificabile, ma fragile: prima di importare librerie nuove conviene decidere un design system unico.

2. Obiettivo consigliato

Non fare:
“installa una libreria e sostituisci tutto”.

Fare invece:
“riscriviamo Card, Button, Input, Modal, Badge, Alert e componenti base in modo coerente, poi usiamo eventualmente una libreria solo come supporto”.

La strategia migliore è:

definire token visivi;
creare componenti base puliti;
sostituire progressivamente le vecchie card;
solo dopo valutare librerie esterne.
3. Problemi attuali da risolvere prima
A. Troppi vocabolari colore

Nel codice convivono almeno:

primary-*;
warm-*;
al-ritrovo-*;
slate-*.

Il report segnala che questo è uno dei principali rischi di conflitto.

Decisione consigliata

Usare un solo sistema:

primary
surface
border
text
muted
success
warning
danger
info

E lasciare warm / al-ritrovo solo se servono davvero come tema ristorante.

B. Componenti base non abbastanza centrali

Esistono già componenti come:

Button;
Input;
Textarea;
Label;
Modal;
Select;
CollapsibleCard.

Il problema è che molte sezioni usano ancora classi custom direttamente nei file feature.

Decisione consigliata

Creare o riscrivere:

src/components/ui/Button.tsx
src/components/ui/Card.tsx
src/components/ui/Badge.tsx
src/components/ui/Alert.tsx
src/components/ui/Input.tsx
src/components/ui/Modal.tsx
src/components/ui/SectionHeader.tsx
src/components/ui/EmptyState.tsx

Poi gli agenti Cursor devono usare questi ovunque.

C. Rischio overlay / z-index

L’app ha già Modal con z-[10050] e Toast con zIndex: 100000.

Quindi librerie con dropdown, modal, popover o dialog possono causare:

modali dietro altri elementi;
dropdown non cliccabili;
tooltip nascosti;
overlay sopra il toast;
problemi mobile.
Decisione consigliata

Non importare subito modal/dialog esterni.

4. Opzioni consigliate, dalla più semplice alla più complessa
Opzione 1 — Solo Tailwind + componenti custom

Consigliata come prima fase.

Difficoltà

Bassa / media.

Vantaggi
zero dipendenze nuove;
massimo controllo;
meno rischio regressioni;
perfetta per Cursor;
coerente con lo stack attuale;
sfrutta già cn() con clsx e tailwind-merge.
Svantaggi
richiede scrivere bene i componenti;
meno “plug and play”;
serve un piano UI preciso.
Cosa fare

Riscrivere direttamente:

Button
Card
Input
Textarea
Badge
Alert
Modal
Tabs
SectionHeader
EmptyState

Questa è la scelta più sicura se vuoi decidere tutto in un plan.

Opzione 2 — Tailwind custom + daisyUI

Consigliata solo se vuoi velocizzare.

Difficoltà

Bassa.

Vantaggi
molto semplice;
classi leggibili tipo btn, card, alert;
Cursor la conosce bene;
gratuita;
ottima per MVP.
Potenziali conflitti
classi troppo generiche;
stile riconoscibile “da libreria”;
rischio di mischiare btn btn-primary con i tuoi Button;
possibile confusione tra token Daisy e token app.
Come usarla bene

Non usarla ovunque. Usarla solo come ispirazione o per componenti secondari.

Esempio:

<button className="btn btn-primary">Salva</button>

Ma nel tuo progetto preferirei:

<Button variant="primary">Salva</Button>

Quindi daisyUI può aiutare, ma non deve diventare il cuore del design system.

Opzione 3 — Tailwind custom + Flowbite React

Utile per dashboard admin, ma con attenzione.

Difficoltà

Media.

Vantaggi
tanti componenti pronti;
buona documentazione;
molto conosciuta;
utile per dashboard;
gratuita nelle parti base.
Buoni casi d’uso
Tabs;
Dropdown;
Badge;
Tooltip;
Table;
Accordion.
Componenti da evitare all’inizio
Modal;
Datepicker;
Select;
Calendar.

Perché la tua app ha già Modal, Select, FullCalendar e override specifici in CSS globale.

Potenziali conflitti
z-index;
stile diverso dal resto;
dipendenza da CSS esterno;
duplicazione di componenti già presenti;
conflitti con index.css.
Opzione 4 — shadcn/ui

La più professionale, ma va pianificata bene.

Difficoltà

Media / alta.

Vantaggi
look molto moderno;
perfetta per SaaS;
componenti copiati nel progetto, quindi modificabili;
ottima con React + TypeScript;
usa pattern professionali;
adatta a Button, Card, Dialog, Dropdown, Form, Badge.
Svantaggi
richiede ordine;
può sovrapporsi ai componenti già esistenti;
introduce più Radix;
può creare confusione se importata senza piano.
Potenziali conflitti
il progetto ha già @radix-ui/react-select;
possibile duplicazione di Button, Input, Modal;
token shadcn tipo background, foreground, muted, border, ring potrebbero non coincidere con i token attuali;
richiede allineamento tra tailwind.config.js, index.css e componenti.
Come la userei

Solo se decidi di fare una vera riscrittura ordinata dei componenti.

Importerei al massimo:

button
card
badge
alert
dialog
dropdown-menu
tabs
separator
sheet
textarea
input
label

Ma con regola chiara:

shadcn non deve convivere casualmente con i vecchi componenti. O diventa la base del nuovo src/components/ui, oppure resta fuori.

5. Scelta migliore per il tuo caso

Dato che vuoi “riscrivere le card e component vari decidendo tutto in un plan”, io ti consiglio questo:

Percorso consigliato
Fase 1 — Design system custom
Fase 2 — Riscrittura componenti base
Fase 3 — Sostituzione progressiva delle card
Fase 4 — Eventuale shadcn solo come reference/component source
Fase 5 — Flowbite/daisyUI solo se manca qualcosa

Quindi la risposta netta è:

Non partirei da daisyUI.
Non partirei da Flowbite.
Partirei da componenti custom ispirati a shadcn.

Perché la tua app è già abbastanza strutturata e ha già test, workflow, lint, typecheck e convenzioni PR.

6. Plan tecnico consigliato per Cursor
Step 1 — UI Audit

Far cercare agli agenti:

Button
Card
Modal
Input
Textarea
Select
Badge
Alert
className=
style={{
<style>
warm-
al-ritrovo-
bg-muted
ring-offset-background

Obiettivo: capire dove sono usati token vecchi o non mappati.

Step 2 — Definizione token

Creare una base coerente:

--color-primary
--color-primary-hover
--color-bg
--color-surface
--color-surface-muted
--color-border
--color-text
--color-text-muted
--color-success
--color-warning
--color-danger
--color-info
--radius-card
--shadow-card
--shadow-floating
Step 3 — Riscrittura componenti base

Priorità:

1. Button
2. Card
3. Badge
4. Alert
5. Input / Textarea
6. Modal
7. SectionHeader
8. EmptyState
Step 4 — Riscrittura Card

Creare un componente unico:

<Card>
  <CardHeader>
  <CardTitle>
  <CardDescription>
  <CardContent>
  <CardFooter>
</Card>

Poi usarlo per:

card prenotazioni pendenti;
card archivio;
card impostazioni;
card menu;
card riepilogo dashboard;
card form pubblico.
Step 5 — Migrazione progressiva

Non fare tutto insieme.

Ordine consigliato:

1. componenti non critici
2. impostazioni admin
3. menu admin
4. archivio
5. richieste pendenti
6. pagina pubblica prenotazione
7. modali/select/date/time input

La pagina pubblica va toccata dopo, perché è una zona più delicata e molto custom.

7. Librerie: classifica finale
Posizione	Opzione	Consiglio
1	Tailwind custom + componenti tuoi	Migliore prima scelta
2	shadcn/ui come ispirazione o base progressiva	Migliore scelta professionale
3	daisyUI	Buona solo per velocizzare
4	Flowbite React	Utile per componenti admin specifici
5	Material UI / Ant Design / Bootstrap	Sconsigliate
8. Rischi principali da dire agli agenti Cursor

Gli agenti devono stare attenti a:

non modificare migrazioni o parti Supabase;
non toccare TenantContext;
non rompere Modal, Select, DateInput, TimeInput;
non importare CSS esterni in tanti file;
non mischiare tre design system;
non sostituire tutti i componenti in una sola run;
eseguire sempre:
npm run validate
npm run build

Il progetto ha già regole precise: npm run validate include lint, typecheck e test.

9. Conclusione

La scelta più intelligente è:

riscrivere prima il tuo mini design system interno, usando Tailwind e componenti custom.

Poi, solo se serve, usare:

shadcn/ui per alzare qualità e struttura;
daisyUI se vuoi rapidità;
Flowbite per componenti admin già pronti.

Per la tua idea di “decidere tutto in un plan”, la strada migliore è:

Custom UI System first.
shadcn-inspired structure.
No massive library migration.
Progressive component replacement.

Questa è la soluzione più pulita, più controllabile e meno rischiosa per Cursor.