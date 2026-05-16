---
name: ui-edit
description: >-
  Skill per qualsiasi modifica UI in CalendarBackup-v2: stile, layout, componenti,
  token, animazioni, temi. Leggere i file di contesto prima di toccare qualsiasi
  className, file CSS o TSX. Copre dashboard admin e pagina pubblica prenotazione.
---

# UI Edit — Guida agente

> Stack: React 18 + Vite + TypeScript + **Tailwind CSS v4** + Supabase.

---

## 0. Prima cosa: leggi il task → carica il context

**Passo 1 — sempre obbligatorio:**
Leggi `docs/per-ui-design-skill/STYLING_AGENT_CONTEXT.md`.

**Passo 2 — leggi il task ricevuto e applica questa tabella:**

| Il task menziona… | Leggi anche |
|-------------------|-------------|
| Componenti (`Button`, `Card`, `Badge`, `Modal`, `Alert`, `Spinner`, `EmptyState`…) | `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` |
| Aggiunta / modifica file in `src/components/ui/` | `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` |
| Layout, struttura HTML, pattern di composizione | `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` |
| Tema, palette, colori, token, `primary-*`, rollout | `docs/per-ui-design-skill/UI_THEME_CONTEXT.md` |
| Modifica `src/index.css` o `tailwind.config.js` | `docs/per-ui-design-skill/UI_THEME_CONTEXT.md` |
| **Responsive: breakpoint, mobile, grid che collassa, padding/gap adattivi, max-width container, contenuto pagina vs sidebar** | `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` |
| Non è chiaro se serve il contesto componenti o tema | Leggi **entrambi** |

Carica i file indicati **prima** di aprire qualsiasi file da modificare.

---

## 1. Workflow

1. Carica context (step 0)
2. **Grep** la zona interessata in `src/` — capire token e classi già in uso
3. **Leggi** i file da modificare — mai editare alla cieca
4. **Applica** seguendo il context — nessuna invenzione di token o classi
5. **Valida**: `npm run typecheck && npm run lint`

---

## 2. Invarianti — non negoziabili

```
LOCK  CollapsibleCard.tsx          — 57 test, non toccare mai
LOCK  Modal.tsx  z-[10050]         — stack calibrato con Toast (100000)
LOCK  DateInput.tsx / TimeInput.tsx — <style> globali con !important
LOCK  TenantContext.tsx            — core multi-tenancy
LOCK  src/lib/supabase.ts          — client autenticato
LOCK  supabase/migrations/         — DB remoto già applicato

RULE  Button: cambia variant nel FILE CHIAMANTE, mai Button.tsx
RULE  cn() da @/lib/utils — mai clsx() o twMerge() direttamente
RULE  Classi letterali — mai costruire dinamicamente `bg-${x}-600`
RULE  !important Tailwind v4: suffisso → border-red-500! (non !border-red-500)
RULE  Nessun CSS in index.css per bottoni/colori già coperti da token
RULE  style={{}} solo per valori senza equivalente Tailwind (es. clamp())
```

---

## 3. Commit convention

```
feat(ui): ...   fix(ui): ...   update(ui): ...
```

---

## 4. Verifica post-modifica

```bash
npm run typecheck   # zero errori
npm run lint        # zero warning
npm run validate    # per PR: lint + typecheck + test
```
