# Context — Architettura della Console (`console/`)

> Come è fatta e come si lavora all'app Console. Decisioni dai doc `docs/Servizio-Config/` +
> intervista con Cristiano.

---

## 1. Dove vive il codice

Sottocartella **isolata** `console/` nella root del repo, **su questo branch**. È un **sotto-progetto
a sé**: proprio `package.json`, `vite.config.ts`, `tsconfig.json`, ESLint, dipendenze. **Non**
condivide la build con l'app di Matteo.

```
CALENDARIO-V2/
├── src/            ← app di Matteo (LOCK, sola lettura)
├── supabase/       ← DB/migrazioni di Matteo (LOCK)
├── docs/Console-Skill/   ← questo skill system
└── console/        ← app Console (qui lavoriamo)
   ├── package.json   (suo)
   ├── vite.config.ts (suo)
   ├── tsconfig.json  (suo)
   └── src/
```

**Isolamento dalla pipeline root** (una tantum, quando si crea `console/`): escludere `console/` dal
`tsconfig.json` root (`exclude`), da ESLint (`ignorePatterns`) e da Vitest root, così i due progetti
non si contaminano. → in pratica `npm run validate` di Matteo continua a non vedere la Console.

---

## 2. Regole architetturali (non negoziabili)

- **Stesso DB, non duplicare i dati.** La Console si collega allo **stesso Supabase TEST**
  (`docnnernvp`). È una seconda porta privata sullo stesso magazzino.
- **Stack consigliato:** Vite + React + TypeScript + Supabase (come l'app), per riusare i concetti.
- **NON importare da `../src`.** La Console **ricrea** i concetti che le servono (es. la logica di
  `buildFeatures`): client e chiavi Supabase sono diversi, mescolarli è un rischio di sicurezza.
- **Responsive / mobile-first.** Matteo deve poterla aprire dal telefono.
- **Solo per Matteo.** Login forte, indirizzo non pubblicizzato; mai esposta al ristoratore.

---

## 3. Sicurezza (🔒 critica)

La Console può scrivere i dati di *qualunque* ristorante, quindi:

- **Service role key MAI nel browser.** Le scritture potenti passano da un **pezzo lato server**
  (Edge Function / serverless), non dal codice che gira sul telefono.
- Il client browser usa solo chiavi pubbliche + RLS; le operazioni privilegiate chiamano l'Edge.
- **Sviluppo e prova solo su TEST.** Prima di ogni scrittura: `get_project_url` = `docnnernvp`.
- **Scritture dati solo sui sandbox** `console-classic`/`console-pro` (vedi data model §6).

> Meccanismo Edge per scritture: **da concordare con Matteo** (vedi domande aperte nel plan/README).

---

## 4. Deploy (futuro, non MVP)

Una sottocartella si deploya comunque come **sito a sé** (es. progetto Vercel con root = `console/`,
indirizzo tipo `console.<dominio>`). Indirizzo/dominio esatto: **domanda aperta per Matteo**.

---

## 5. Confini funzionali

- La Console fa **tutte le righe 🟦** dell'`INVENTARIO_FUNZIONALITA_ONBOARDING_VS_CONSOLE.md`:
  edition + feature, numeri tecnici (durate/intervalli/cut-off/buffer), card/menu, preset.
- **Non** apre un terzo pannello dentro l'app del ristoratore: è un'area super-admin separata.
- Primo mattone consigliato: schermata **elenco tenant + cambio edition** (riusa un meccanismo già
  esistente, è il pezzo più isolato).
