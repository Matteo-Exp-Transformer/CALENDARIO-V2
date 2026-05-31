# Upgrade futuro — UI Super-Admin per gestire edition tenant

> **Stato**: non urgente, da pianificare quando i clienti superano una manciata.
> **Priorità**: bassa finché gestisci 5-20 tenant. Diventa importante quando scali.

---

## Problema

Oggi, per cambiare la edition di un cliente (Classic / Pro / Enterprise), tu (Matteo) devi:

1. Aprire Supabase Studio nel browser
2. Andare nella tabella `organizations`
3. Trovare il tenant del cliente
4. Cliccare sulla cella `edition` e cambiare il valore a mano

Funziona se hai 10 clienti. Diventa scomodo a 50, ingestibile a 200.

---

## Flusso utente desiderato

> Matteo apre l'app come super-admin (account separato, accesso speciale). Vede una dashboard con:
>
> - Lista di tutti i ristoranti registrati (nome, slug, edition corrente, data signup, ultimo accesso)
> - Filtro/ricerca per nome
> - Per ogni riga, un menu a tendina `[Classic ▾ / Pro / Enterprise]`
> - Cambio edition con un click → conferma → salvato
>
> Matteo riceve una mail di pagamento da Mario (Pizzeria da Mario), apre il pannello super-admin, cerca "Pizzeria da Mario", cambia edition da `classic` a `pro`. Mario al successivo login vede la sidebar e il CRM.

---

## Componenti tecnici previsti

### Database
- Nuova tabella `super_admins (user_id UUID, created_at)` per identificare chi può accedere al pannello
- RLS policies sulla query "lista organizations" che permettono SELECT solo a super-admin
- RPC `update_tenant_edition(tenant_id, new_edition)` con check super-admin all'interno
- Audit log: tabella `edition_changes (tenant_id, old_edition, new_edition, changed_by, changed_at)`

### Frontend
- Route protetta `/super-admin` con check membership in tabella super_admins
- Pagina `SuperAdminPage.tsx`:
  - Tabella tenant con TanStack Query
  - Dropdown edition per riga
  - Mutation cambio edition con conferma modal
  - Storico cambi recente
- Hook `useIsSuperAdmin()` letto dopo login

### Sicurezza
- Mai esporre la lista tenant ad utenti normali (RLS rigorosa)
- Mai permettere a un tenant di cambiare la propria edition (solo super-admin via RPC)
- Audit log immutabile per tracciabilità contestazioni

---

## Stima sforzo

3-5 ore se fatto da solo, una sessione dedicata con agente.

---

## Quando affrontarlo

**Trigger consigliati per attivare questo upgrade**:
- Hai più di 30 tenant attivi → diventa scomodo gestire a mano
- Hai più di 1 cambio edition a settimana → automatizzare conviene
- Hai un collaboratore che deve poter gestire i tenant → serve permission system
- Vuoi mostrare ai clienti uno "storico fatturazione/upgrade" → serve audit log

Finché nessuno di questi è vero, **Supabase Studio diretto basta**.

---

## Dipendenze

- Sistema edition (Fase 2 del plan blindatura) → ✅ già fatto
- RLS Supabase edition-based (Fase 4a del plan blindatura) → necessario prima

---

## Riferimenti

- Plan principale: `docs/Sessioni di lavoro/14-05-26/Plan-blindatura-admin-e-edition-system.md`
- Skill edition: `docs/APP_CONTEXT_SKILL.md` § 2
