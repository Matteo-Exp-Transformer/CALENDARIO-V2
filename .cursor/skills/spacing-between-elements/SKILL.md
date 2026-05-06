---
name: spacing-between-elements
description: >-
  Guides layout changes to add vertical or horizontal space between two UI
  elements (React/TSX/Tailwind/CSS). Use when the user asks to put, add, or
  increase space between two elements, margin, gap, distanziare, or in Italian:
  mettere spazio, aggiungere spazio tra, più spazio tra due elementi,
  allontanare due elementi.
disable-model-invocation: false
---

# Spazio tra due elementi

## 1. Capire la relazione nel DOM

- **Stesso contenitore (fratelli)**: es. due `div` uno sotto l’altro → agire sul **padre** (`gap`, `space-y-*`) o sul **secondo blocco** (`margin-top` / `margin-left`).
- **Dentro lo stesso blocco** (es. label sopra input): usare `space-y-*` sul wrapper o `margin-bottom` sulla label, **`gap`** su un flex colonna che avvolge label+input.

## 2. Ordine di preferenza (Tailwind + React)

1. **Flex/Grid sul genitore**: `flex flex-col gap-*` o `grid gap-*` — prevedibile e coerente tra più figli.
2. **Stack verticale solo utility**: `space-y-*` sul genitore (attenzione a `space-y` solo sui figli diretti).
3. **`marginTop` / `marginInlineStart` inline su React** (`style={{ marginTop: '1.75rem' }}`) sul secondo (e successivi) blocchi quando:
   - servono classi **arbitrary** tipo `[&>div+div]:mt-*` ma **non risultano nel CSS** (purge/build);
   - bisogno che lo spazio sia **garantito** a colpo sicuro (inline batte incertezza build).

## 3. Cose da evitare

- Solo `gap` senza che i due elementi siano **effettivamente** figli dello stesso flex/grid.
- Affidarsi a **margin collapse** tra blocchi non-flex per spazi “sicuri” tra sezioni composite.
- Classi arbitrary complesse come unica leva se il progetto ha già fallito il purge in casi simili: **fallback immediato a `style`**.

## 4. Verifica

Dopo la modifica: in DevTools il secondo blocco deve mostrare **`margin-top`** effettivo **oppure** il padre **`gap`** nei computed styles.
