# Utenti di prova (QA — Supabase Auth)

**Ambiente:** progetto Supabase `rwuxgvldzrkabglkasym`, app locale `http://localhost:5173`.

**Attenzione:** password deboli solo per test. Prima del go-live rimuovere questi utenti o forzare reset password; non riutilizzare in produzione.

---

## Admin tenant A (`al-ritrovo`)

| Campo | Valore |
|--------|--------|
| Email | `admin.a.rls@example.com` |
| Password | `123456` |
| Ruolo | Riga in `admin_users` → tenant slug **al-ritrovo** |

## Admin tenant B (`tenant-b-qa`)

| Campo | Valore |
|--------|--------|
| Email | `admin.b.rls@example.com` |
| Password | `123456` |
| Ruolo | Riga in `admin_users` → tenant slug **tenant-b-qa** |

## Outsider (solo Auth — senza admin)

| Campo | Valore |
|--------|--------|
| Email | `outsider.rls@example.com` |
| Password | `123456` |
| Ruolo | **Nessuna** riga in `admin_users` — utile per test RLS / login rifiutato |

---

## Accesso rapido

- Login admin: `/login`
- Form pubblico tenant A: `/prenota/al-ritrovo`
