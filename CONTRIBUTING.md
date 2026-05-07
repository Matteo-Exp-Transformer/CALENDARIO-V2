# Come contribuire

## Conventional Commits

Tutti i commit seguono la specifica [Conventional Commits](https://www.conventionalcommits.org/).

Formato: `tipo(scope): descrizione breve`

### Tipi in uso in questo repo

| Tipo | Quando usarlo |
|------|--------------|
| `feat` | Nuova funzionalità |
| `fix` | Correzione di un bug |
| `update` | Miglioramento/modifica di funzionalità esistente |
| `refactor` | Riorganizzazione codice senza cambiare comportamento |
| `docs` | Solo documentazione |
| `test` | Aggiunta o modifica di test |
| `chore` | Manutenzione (dipendenze, config) |

### Esempi dai commit recenti

```
feat(booking): add configurable placement areas in settings
fix(booking): remove unused booking background declarations
update(booking): clarify booking origin in details header
update(booking): harmonize admin modal form styles and actions
fix(booking): align admin personal inputs with booking request style
```

## Branching

- `main` — branch principale, sempre deployabile
- `feat/nome-feature` — per nuove funzionalità
- `fix/nome-bug` — per correzioni

Crea un branch dal `main` aggiornato prima di iniziare a lavorare.

## Workflow PR

1. Crea il branch: `git checkout -b feat/nome-feature`
2. Fai le modifiche e i commit seguendo Conventional Commits
3. Prima di aprire la PR esegui `npm run validate` (lint + typecheck + test)
4. Apri la PR verso `main` con descrizione delle modifiche

## Comandi pre-PR

```bash
npm run validate      # lint + typecheck + test (raccomandato)
npm run test:e2e      # opzionale, richiede staging Supabase + dev server
npm run build         # build di produzione
```

`npm run validate` è equivalente a `npm run lint && npm run typecheck && npm run test`. Il pre-commit hook (husky + lint-staged) esegue automaticamente `eslint --fix` sui file staged.

## Code review checklist

- [ ] `npm run validate` passa (lint + typecheck + 29 test)
- [ ] I nuovi hook/funzioni hanno test corrispondenti in `__tests__/`
- [ ] I `console.log` sono stati sostituiti con `logger.debug` (vedi `src/lib/logger.ts`)
- [ ] Le modifiche al DB hanno una migrazione corrispondente in `supabase/migrations/`
- [ ] Le nuove Edge Functions hanno documentazione in `docs/EDGE_FUNCTIONS.md`
- [ ] Il file `src/types/database.ts` è stato rigenerato se lo schema è cambiato

## Zone delicate

Prima di toccare questi file, leggi la sezione "Criticità note" in [ONBOARDING.md](ONBOARDING.md):

- `src/lib/supabase.ts` e `src/lib/supabasePublic.ts` — due client distinti per un motivo preciso
- `src/contexts/TenantContext.tsx` — cuore del multi-tenancy, cambiamenti qui si propagano ovunque
- `supabase/migrations/` — non modificare migrazioni già applicate al remoto, crea sempre una nuova
- `supabase/functions/` — le funzioni usano service role, validare l'input in ingresso è critico
