# Report — Modal fasce: info toggle e menu durata «Sempre»

**Data**: 17-05-2026  
**Branch**: Sviluppo-Dashboard-laterale  
**Area**: Admin → **Servizio** → Fasce orarie → modale nuova/modifica fascia

## Obiettivo

Rendere il modale CRUD fasce meno affollato: spiegazioni su richiesta (non box sempre visibili), menu durata più compatto e copy che invita a usare salvataggi temporanei quando si è su «Sempre».

## Cosa è stato fatto (in ordine)

1. **Spiegazioni a comparsa** — accanto a «fascia» (coperti massimi) e «salvataggio» (tipo salvataggio, solo in modifica con scope `forever`) compare il controllo `FormInfoToggle`: icona tematica + «?», sfondo `primary-100`, hover `primary-200`. Clic apre/chiude il box sotto il campo.
2. **Coperti massimi** — testo aiuto: rifiuto automatico prenotazioni oltre il limite (box blu, solo se aperto).
3. **Tipo salvataggio (Sempre)** — testo aiuto: «Se vuoi, puoi impostare una scadenza precisa delle modifiche, selezionando un tipo di salvataggio.» (sostituisce il vecchio messaggio sulle impostazioni base permanenti).
4. **Menu durata** — pulsante mostra solo l’etichetta scelta (es. **Sempre**, Solo oggi…), senza prefisso «Quando?»; bordo outline ridotto a 1px (`border` invece di `border-2` del variant).
5. **Etichetta scope** — in menu e sul pulsante: **Sempre** al posto di «Per sempre» (valore tecnico `forever` invariato).
6. **Cursore globale** (stesso branch, stesso push) — regola in `index.css` + `UI_COMPONENTS_CONTEXT.md`: manina su elementi interattivi senza ripetere `cursor-pointer` ovunque.

## File toccati e perché

| File | Per il ristoratore / perché |
|------|-----------------------------|
| `src/features/booking/components/servizio/ServiceSlotsManager.tsx` | Modale fasce più pulito; aiuto solo se serve |
| `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` | Documentazione menu durata e `FormInfoToggle` |
| `docs/APP_CONTEXT_SKILL.md` §4 | RULE modal fasce + menu «Sempre» |
| `src/index.css` | Cursore pointer globale su controlli cliccabili |
| `docs/per-ui-design-skill/UI_COMPONENTS_CONTEXT.md` | Norma cursori per agenti UI |

**Storage (invariato):** `service_slots` (fasce base), `service_slot_overrides` (modifiche a tempo). Nessuna migrazione.

## Domande postate all’utente

Iterazioni UX su richiesta: posizione icone, stile pill «Spiegazione» → solo «?», tonalità sfondo, allineamento tra i due toggle, testo help con «Sempre» selezionato, rimozione «Quando?» dal pulsante, rinomina «Per sempre» → «Sempre».

## Test eseguiti

- `npm run typecheck` → **verde** (in sessione)
- `npm run validate` → da rieseguire pre-push in CI locale

## Cosa resta

- Verifica manuale modale su mobile (~390px): riga «Tipo di salvataggio» + pulsante «Sempre» con wrap; box help non tagliati dallo scroll del modale.

## Allineamento skill

- `docs/Dashboard-laterale-skill/ADMIN_PAGES_CONTEXT.md` — sezione Fasce orarie
- `docs/APP_CONTEXT_SKILL.md` §4 — RULE `FormInfoToggle` / menu durata
