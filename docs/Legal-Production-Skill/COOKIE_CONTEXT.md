# Cookie & banner — context skill

## Stato attuale (2026-05-23)

**Banner cookie OBBLIGATORIO?** ❌ NO.

Motivo: oggi CalendarBackup-v2 usa SOLO:
- `localStorage` Supabase Auth (cookie tecnico necessario al login)
- Nessun analytics
- Nessun pixel pubblicitario
- Nessun cookie di profilazione

Per la disciplina italiana (Linee guida Garante 2024) il banner è obbligatorio
solo se ci sono cookie/storage NON STRETTAMENTE TECNICI.

---

## Quando diventa obbligatorio

Appena viene aggiunto UNO di questi:
- Google Analytics / GA4 / Tag Manager
- Hotjar / Clarity / FullStory
- Facebook Pixel / TikTok Pixel / LinkedIn Insight
- A/B testing tools (Optimizely, ecc.)
- Chat widget di terze parti che traccia (Intercom, Drift)
- Mappe Google con cookie (Maps API embed)

---

## Check da fare ad ogni sessione

```bash
# Cookies di terze parti aggiunti?
grep -rn "gtag\|googletagmanager\|google-analytics\|hotjar\|posthog\|mixpanel\|segment\|pixel\|facebook.net" index.html src/

# localStorage / sessionStorage nuovi?
grep -rn "localStorage\|sessionStorage" src/
```

Se uno di questi grep restituisce match nuovi rispetto a `DATA_INVENTORY_CONTEXT.md` → banner OBBLIGATORIO.

---

## Quando serve, soluzioni

### Opzione A — Banner custom (per usi semplici)
File: `src/components/CookieBanner.tsx`
Logica: 3 stati (accetta tutti / rifiuta tutti / personalizza)
Costo: 0€

### Opzione B — Cookiebot / Iubenda Cookie Solution
Quando: hai 5+ cookie diversi, multilingua, audit log consensi richiesto.
Costo: 30-100€/anno.

Default: Opzione A finché possibile.

---

## Cookie policy separata

Se attivi banner → serve anche una **Cookie Policy** dedicata (non solo sezione 12 della Privacy Policy). File: `docs/legal/cookie-policy.md` + pagina `/cookie-policy`.
