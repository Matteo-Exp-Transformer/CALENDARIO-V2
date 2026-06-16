# Pattern — Validazione form con attenzione visiva (scroll + pulse + pannelli)

> **Riferimento implementato:** Pagina Prenota (`BookingRequestForm`, 29-05-26).  
> **Debito aperto:** ~~[FU-010](../FOLLOW_UP.md)~~ — hook condiviso estratto (`useFormValidationAttention`); collegato a `AdminBookingForm`. Estensione modali admin opzionale.  
> **Report sessione:** [Report validazione UX](../Sessioni%20di%20lavoro/29-05-26/Report-validazione-ux-prenota-29-05-26.md) · [Report revisione](../Sessioni%20di%20lavoro/29-05-26/Report-revisione-validazione-ux-prenota-29-05-26.md)

Usa questo file quando devi replicare su **un altro form o modale** il comportamento:

1. Submit fallito → toast + logica React `validate()`
2. Chiusura pannelli espansi che coprono il campo (es. card ingredienti)
3. Scroll al primo errore (centrato se possibile, margine sticky)
4. Lampeggio arancione sul campo fino a **click/tap reale** dell’utente

---

## 0. Prerequisito obbligatorio — `noValidate`

Se i campi hanno `required` (o `type="email"` ecc.) **senza** `noValidate` sul `<form>`:

- Il browser blocca il submit **prima** di `onSubmit`
- `validate()` React, toast, scroll, pulse e collapse **non partono mai**
- Sintomo QA: «non succede nulla» tranne tooltip nativo del browser

**Fix:** `<form noValidate onSubmit={...}>` e validazione **solo** in React.

Altri form nel repo che già usano il pattern: `WalkInModal`, `TableFormModal`, `RoomConfigModal`, `ServiceSlotsManager`.

---

## 1. Utility condivisa (oggi in `src`)

| Export | File | Ruolo |
|--------|------|--------|
| `useFormValidationAttention` | `hooks/useFormValidationAttention.ts` | Hook: nonce collapse + `attentionFieldKey` + `focusFirstValidationIssue` |
| `runAfterTripleAnimationFrame` | `utils/formValidationAttention.ts` | Attende tre rAF prima dello scroll |
| `scrollToFormValidationError` | `utils/formValidationAttention.ts` | Scroll generico con mappa `errorFieldIds` |
| `getFormFieldAttentionProps` | `utils/formValidationAttention.ts` | Pulse + dismiss `isTrusted` su wrapper campo |
| `ADMIN_BOOKING_ERROR_FIELD_IDS` | `utils/formValidationAttention.ts` | Mappa errori form prenotazione admin |
| `BOOKING_MENU_COMPOSE_COLLAPSE_EVENT` | `bookingPublicFormAttention.ts` | Nome evento per chiudere card ingredienti |
| `dispatchBookingMenuComposeCollapse()` | idem | Chiamata sincrona: submit con errori, accordion apertura altra categoria, frecce carosello `ComposeScrollRow` |
| `shouldDismissBookingPublicAttention(event)` | idem | `true` solo se `event.isTrusted` (ignora focus programmatico) |
| `BOOKING_PUBLIC_ERROR_FIELD_IDS` | idem | Mappa `errorKey` → `id` DOM (Pagina Prenota) |
| `scrollToBookingPublicError(errorKey)` | idem | `scrollIntoView({ block: 'center' })` con fallback sottotab |
| `BOOKING_PUBLIC_FIELD_ATTENTION_CLASS` | idem | Classe CSS pulse (`booking-public-field-attention`) |
| `BOOKING_PUBLIC_FIELD_SCROLL_MARGIN` | idem | `scroll-mt-*` / `scroll-mb-*` per sticky bar |

**CSS:** `src/index.css` — blocco `.booking-public-field-attention` (arancione `--color-warm-orange`, `prefers-reduced-motion`).

---

## 2. Sequenza orchestrazione (form parent)

Punto di ingresso in `BookingRequestForm.tsx` → `focusFirstValidationIssue(firstErrorKey)`:

```
validate() fallisce
  → setErrors(...)
  → toast
  → focusFirstValidationIssue(firstErrorKey):
       1. setComposeCollapseNonce(n+1)          // prop verso figli
       2. setAttentionFieldKey(firstErrorKey)   // pulse su un solo campo
       3. dispatchBookingMenuComposeCollapse()  // evento sync sulle card
       4. triple requestAnimationFrame(() =>    // attende paint post-collapse
            scrollToBookingPublicError(key))
```

**Non** chiamare `focus()` programmatico dopo lo scroll: spegne il pulse se `onFocus` chiama `clearAttention`.

---

## 3. Lampeggio su un campo

### Wrapper esterno

Applicare `BOOKING_PUBLIC_FIELD_ATTENTION_CLASS` sul **contenitore esterno** con `id` usato per lo scroll (non sul solo input interno), così il pulse resta visibile anche con `hasError` + bordo rosso.

Esempio: `BookingPublicInsetField.tsx` — `id` sul wrapper, `id="${id}-control"` sull’input.

### Wiring

```tsx
showAttention={attentionFieldKey === 'client_name'}
onAttentionInteract={clearAttentionField}
// negli handler:
onPointerDown={(e) => {
  if (showAttention && shouldDismissBookingPublicAttention(e)) onAttentionInteract?.()
}}
```

Ripetere su date/time picker (`BookingPublicDateTimePickers.tsx`), privacy (`DietaryRestrictionsSection`), sezioni intere (`menu-section`, `booking-sub-tabs-section`) con `onPointerDown` sul wrapper sezione.

---

## 4. Chiusura pannelli espansi (card ingredienti)

Tre meccanismi **in parallelo** (ridondanza intenzionale per timing portal):

| Meccanismo | Dove | Effetto |
|------------|------|---------|
| CustomEvent `booking-menu-compose-collapse` | `BookingMenuCategoryCard` listener | `setExpanded(false)` immediato |
| Stesso evento — accordion desktop | `handleExpand` layout `scroll` | chiude le altre categorie prima di aprire quella cliccata |
| Stesso evento — frecce carosello | `ComposeScrollRow.scrollBy` | chiude tutte le card prima di scorrere il carosello categorie |
| `resetKey` su prop card | `BookingMenuComposeGrid` ← `composeCollapseKey` | `useLayoutEffect` → collapse |
| `key={menu-compose-${nonce}}` su `MenuSelection` | `BookingRequestForm` | remount → stato UI interno reset |

**Per altri form:** se hai pannelli espansi simili, usa **evento globale** + **chiave remount** del sotto-albero; non serve copiare il portal menù se non c’è overlay.

---

## 5. Ancoraggio overlay `position: fixed` (solo card ingredienti)

Vedi `../Prenota-Skill/contesto/PRENOTA_LAYOUT_CONTEXT.md` §7 — sync rAF su ref DOM, non `setState` per frame.

---

## 6. Checklist replica su nuovo form/modale

- [ ] `<form noValidate>` se ci sono attributi HTML5 di validazione
- [ ] `validate()` ritorna `firstErrorKey` nell’ordine desiderato
- [ ] Mappa `errorKey` → `id` DOM (estendere `BOOKING_PUBLIC_ERROR_FIELD_IDS` o nuova mappa)
- [ ] `focusFirstValidationIssue` (hook `useFormValidationAttention` — FU-010) dopo `setErrors`
- [ ] Chiusura pannelli che coprono il target **prima** dello scroll
- [ ] Pulse su wrapper con `shouldDismissBookingPublicAttention`
- [ ] Nessun `focus()` automatico post-scroll
- [ ] Messaggi errore leggibili sullo sfondo del form (Prenota: bianco su scuro)
- [ ] QA: submit invalido, 375 / 834 / 1280 se UI pubblica

---

## 7. Prossimi target (FU-010)

| Form | File | Note |
|------|------|------|
| Admin prenotazione | `AdminBookingForm.tsx` | ✅ Hook `useFormValidationAttention` + `noValidate` + pulse/scroll (Ciclo 8) |
| Walk-in | `WalkInModal.tsx` | Già `noValidate`; aggiungere attenzione se richiesto |
| Tavolo / sala | `TableFormModal.tsx`, `RoomConfigModal.tsx` | Stesso pattern minimo |

**Estrazione suggerita:** `useFormValidationAttention({ errorFieldIds, onCollapsePanels })` che incapsula nonce + attentionFieldKey + dispatch evento + rAF + scroll.

---

## 8. Derivazione errori (da non ripetere)

| Sintomo | Causa | Fix |
|---------|-------|-----|
| Nulla al submit | HTML5 senza `noValidate` | `noValidate` |
| Pulse sparisce subito | `focus()` dopo scroll | Rimuovere focus auto; solo `isTrusted` |
| Card restano aperte | Solo `resetKey`, timing portal | Evento sync + remount figlio |
| Overlay “galleggia” | `setState` ogni frame su scroll | rAF + style su ref DOM |
