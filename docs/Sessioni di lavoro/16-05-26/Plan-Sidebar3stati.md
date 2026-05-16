Ready for review
Select text to add comments on the plan
Plan — Sidebar a 3 stati con nascondi/richiama
Context
Oggi la sidebar admin (AdminShell.tsx) ha 2 stati: icone (w-16, sempre visibile, <main> ha pl-16 fisso) ed espansa (w-56 overlay + backdrop). L'utente vuole poter far sparire del tutto la sidebar e richiamarla da una piccola icona tonda flottante. Obiettivo: dare più spazio al contenuto quando la sidebar non serve, mantenendo un richiamo sempre accessibile.

Nuovo modello a 3 stati:

hidden — sidebar fuori schermo, <main> a tutta larghezza (no pl-16). In alto a sinistra: icona tonda semitrasparente con freccia destra che riporta allo stato icons.
icons — striscia icone w-16 come oggi, <main> con pl-16. In più una nuova freccia "nascondi" che porta a hidden.
expanded — w-56 overlay + backdrop come oggi (invariato).
Skill da caricare prima (obbligatorio)
Task di area shell + responsive. Caricare nell'ordine: docs/APP_CONTEXT_SKILL.md → docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md

UI_RESPONSIVE_CONTEXT.md → docs/per-ui-design-skill/STYLING_AGENT_CONTEXT.md → docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md + ADMIN_SHELL_CONTEXT.md. Checkpoint obbligatorio: AdminShell.tsx è file di area shell → spiegazione preventiva in 5 punti all'utente PRIMA di modificare, attendere conferma.
File da modificare
Solo src/components/layout/AdminShell.tsx.

Modifiche
Stato: sostituire const [expanded, setExpanded] = useState(false) con uno stato a 3 valori, es. const [sidebarMode, setSidebarMode] = useState<'hidden' | 'icons' | 'expanded'>('icons'). Stato iniziale 'icons' (la striscia parte visibile come oggi — la sidebar parte comunque non espansa). Derivare const isDrawerOpen = sidebarMode === 'expanded' (mantiene backdrop e click-outside/Escape attuali invariati: Escape e click-outside da expanded tornano a icons, non a hidden).

<aside>: aggiungere il caso hidden. Resta fixed (mai nel flusso).

hidden → fuori vista: -translate-x-full (oppure w-0), aria-hidden, non focusabile. Usare transition-transform/transition-[width] coerente con la transizione duration-200 già presente — niente nuova proprietà animata che crei scatti.
icons → w-16 (come oggi). expanded → w-56 shadow-xl (come oggi).
<main>: il pl-16 deve diventare condizionale: cn('flex min-h-0 flex-1 flex-col overflow-y-auto', sidebarMode !== 'hidden' && 'pl-16'). Stato hidden → nessun padding, contenuto full-width. La regola fondante resta rispettata (la sidebar non spinge mai: expanded è overlay; pl-16 è spazio statico per la striscia, non spinta dinamica).

Freccia "nascondi" (icons → hidden): nello stato icons, accanto/sotto alla freccia "Espandi" esistente (ChevronRight, ~righe 313-329), aggiungere un secondo bottone con freccia che punta a sinistra/fuori (riusare ChevronLeft da lucide, già importato; oppure ChevronsLeft se serve distinguerla visivamente — preferire icona già importata se sufficiente). onClick={() => setSidebarMode('hidden')}, aria-label="Nascondi menu", stile coerente col <Button variant="ghost" size="icon"> vicino.

Icona tonda flottante (visibile solo se sidebarMode === 'hidden'): nuovo <button> fixed in alto a sinistra (fixed left-3 top-3 z-8000), tondo (h-10 w-10 rounded-full), sfondo semitrasparente coerente coi token (bg-surface/70 backdrop-blur + border border-(--color-border) shadow-sm, hover bg-primary-50), icona ChevronRight (text-primary-900). onClick={() => setSidebarMode('icons')}, aria-label="Mostra menu". z-index: stesso layer dell'aside (z-8000), sotto Modal z-[10050] (LOCK, non toccare). Renderizzarlo dentro il return Pro, fuori dall'<aside>.

Vincoli (non negoziabili)
Classi Tailwind letterali statiche; cn() da @/lib/utils.
LOCK invariati: z-index Modal/Toast, CollapsibleCard, TenantContext, supabase.ts, migrations. Backdrop z-7999 / aside z-8000 invariati.
Edition Classic (!features.sidebar): return anticipato invariato — nessuna sidebar, nessuna icona flottante.
useIsNarrow resta solo per autochiusura on-click; non introdurre nuovi breakpoint custom nei componenti.
Sintassi Tailwind v4 (bg-surface/70, text-primary-900, (--color-...)).
Allineamento skill (stessa sessione, dopo l'implementazione)
AdminShell.tsx toccato → aggiornare:

docs/Dashboard-laterale-skill/ADMIN_SHELL_CONTEXT.md §4 (ora 3 stati: hidden/icons/expanded + icona flottante) e §5 (layer icona flottante).
docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md §0 (stato del codice: 3 stati, <main> pl-16 condizionale).
Memoria project_responsive_design.md ("How to apply").
Report di fine sessione in docs/Sessioni di lavoro/GG-MM-AA/.
Verifica
npm run typecheck && npm run lint → zero errori/warning.
npm run validate → 90/90 test (nessun test copre AdminShell, ma non deve regredire).
Prova manuale npm run dev (tenant Pro):
Da icons: click freccia nascondi → sidebar sparisce, pagina full-width, compare icona tonda in alto a sinistra.
Click icona tonda → torna striscia icone, pagina con pl-16.
Da icons: freccia espandi → w-56 + backdrop (invariato); Escape / click-outside → torna icons.
Transizioni fluide, nessuno scatto di larghezza del contenuto.
Tenant Classic: nessuna sidebar né icona flottante.