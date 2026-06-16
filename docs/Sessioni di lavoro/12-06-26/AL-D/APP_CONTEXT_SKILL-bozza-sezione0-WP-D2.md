# Bozza aggiornamento `APP_CONTEXT_SKILL.md` §0 e rimandi (WP-D2)

> **NON applicare** senza ok Matteo. Solo le righe che cambiano path o aggiungono instradamento.

---

## §0 — righe da sostituire

### PRIMA

```markdown
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Dashboard-laterale-skill/ADMIN_SHELL_SKILL.md` |
```

### DOPO

```markdown
| AdminShell / sidebar / nav / sezioni / routing admin | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` (+ `ADMIN_SKILL.md` se task ampio) |
| CRM / clienti / customer / useCustomers / CustomerProfile | `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` step 0 → `contesto/ADMIN_CRM_CONTEXT.md` |
```

### PRIMA (riga task combinati, se presente)

```markdown
| Task che tocca sia layout shell che stile Tailwind | **entrambi** ADMIN_SHELL + UI_EDIT |
| Task responsive che tocca il comportamento sidebar/overlay | **entrambi** UI_RESPONSIVE + ADMIN_SHELL |
```

### DOPO

```markdown
| Task che tocca sia layout shell che stile Tailwind | **entrambi** `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` + UI_EDIT |
| Task responsive che tocca il comportamento sidebar/overlay | **entrambi** UI_RESPONSIVE + `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` |
```

---

## §2 routing admin — riga dettaglio sezioni

### PRIMA

```markdown
File di dettaglio per ogni sezione: `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md`.
```

### DOPO

```markdown
File di dettaglio tecnico per ogni sezione shell: `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` (flussi prodotto → `ADMIN_SKILL.md` §7).
```

---

## §4 RULE Servizio

### PRIMA

```markdown
RULE  **Servizio** (...): **dettaglio completo → `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` § Servizio** (...)
```

### DOPO

```markdown
RULE  **Servizio** (...): **dettaglio completo → `docs/Admin-Skill/contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio** (sottosezioni Fasce orarie · Assegnazione tavoli · Accesso rapido da Calendario). Flussi utente → `contesto/ADMIN_SERVIZIO_CONTEXT.md`.
```

---

## §7.2 tabella allineamento skill

### PRIMA

```markdown
| `AdminShell.tsx` (routing, sezioni, edition) | `ADMIN_SHELL_CONTEXT.md` |
| Nuova pagina/sezione admin | `ADMIN_PAGES_CONTEXT.md` + `ADMIN_SHELL_CONTEXT.md` §7 |
| `AssignmentMapPanel` / ... | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli |
| `serviceSlotBookingFilter.ts` / ... | `ADMIN_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli + ... |
```

### DOPO

```markdown
| `AdminShell.tsx` (routing, sezioni, edition) | `contesto/ADMIN_SHELL_NAV_CONTEXT.md` + `contesto/ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` |
| Nuova pagina/sezione admin | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` + `ADMIN_SHELL_ARCHITECTURE_CONTEXT.md` §7 + `ADMIN_SKILL.md` §7 |
| `AssignmentMapPanel` / ... | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli |
| `serviceSlotBookingFilter.ts` / ... | `contesto/ADMIN_SHELL_PAGES_CONTEXT.md` § Servizio → Assegnazione tavoli + `TESTING_CONTEXT.md` se cambiano i test |
```

---

## Altri file fuori APP_CONTEXT (post-ok)

| File | Modifica |
|------|----------|
| `.cursor/skills/calendarbackup-app-context/SKILL.md` | Riga Admin shell → `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` |
| `docs/per-ui-design-skill/UI_RESPONSIVE_SKILL.md` § passo 3 | idem |
| `docs/per-ui-design-skill/UI_RESPONSIVE_CONTEXT.md` | idem |
| `docs/Comunicazione-Skill/VOCABOLARIO.md` | `ADMIN_SHELL_SKILL` → path `docs/Admin-Skill/ADMIN_SHELL_SKILL.md` |
| `docs/Admin-Skill/ADMIN_SKILL.md` §7 | Aggiungere riga: shell workflow agente → `ADMIN_SHELL_SKILL.md` |

**NON toccare:** `docs/MASTERPLAN_ALLINEAMENTO.md` (vincolo WP-D2), `docs/Sessioni di lavoro/**` (storico).
