# Report — Menu QR: altezza card senza foto = con foto (mobile)

**Data:** 01-06-26  
**Modalità:** standard · **Profilo:** Esecuzione  
**Stato:** ✅ lavoro ok · validate OK · commit `30e3b91` su `env/test` e `main`

---

## 1. Obiettivo

Sulla **homepage Menu QR** (`/menu/:slug/qr/:shortCode`), con **mix** categorie (almeno una con foto nel QR), le card **senza foto** devono avere la stessa altezza delle card **con foto** su **mobile** (&lt;520px). Tablet/desktop (≥520) erano già allineati con `aspect-[5/2]`.

---

## 2. Effetto per il cliente

| Situazione | Prima (mobile) | Dopo |
|------------|----------------|------|
| Griglia con foto + senza foto | Card senza foto più basse (`min-h-[64px]`) | Stesso rapporto **7:2** delle card con foto |
| Solo senza foto | `min-h-[64px]` | Invariato |
| Tablet/desktop mix | `aspect-[5/2]` | Invariato |

---

## 3. Modifica tecnica

**File:** `src/pages/PublicMenuPage.tsx` — `CategoryCard`, prop `matchPhotoTileHeight`.

```diff
- min-h-[64px] … min-[520px]:aspect-[5/2]
+ aspect-[7/2] … min-[520px]:aspect-[5/2]
```

Allineato al ramo con foto: `aspect-[7/2]` sotto 520px, `aspect-[5/2]` da 520px.

**Skill:** `docs/per-ui-design-skill/PUBLIC_MENU_LAYOUT_CONTEXT.md` — § card senza foto aggiornato.

**Fuori scope:** DB, admin, `PublicMenuCategoryPage`, carosello, tab.

---

## 4. Verifica

| Controllo | Esito |
|-----------|--------|
| `npm run validate` | **OK** — 269 test |
| QA visivo 375 / 834 / 1280 (Matteo) | Non tracciato in sessione — consigliato su QR con mix foto |

---

## 5. Dati comunicazione

### Frasi / prompt Matteo

| # | Messaggio | Ruolo |
|---|-----------|--------|
| 1 | «prepara prompt» — allineare dimensione card senza foto a con foto su mobile home QR; tablet/desktop ok; copiare responsive | prepara-prompt |
| 2 | «lavoro ok. fai report finale push e merge con main» | chiusura |

### Prompt esecutore (da prepara-prompt)

- Obiettivo mobile `aspect-[7/2]` quando `matchPhotoTileHeight`
- Non regressare ≥520 / FU-025
- Smoke `/menu/:slug/qr/:shortCode`
- Report con Dati comunicazione + statistiche

### Statistiche ciclo

| Metrica | Valore |
|---------|--------|
| Messaggi Matteo (prepara + chiusura) | **2** |
| Correzioni dopo 1ª risposta prepara | **0** |
| Giri prepara-prompt | **1** |
| Passate esecutore | **1** |
| File codice toccati | **2** (`PublicMenuPage.tsx` + layout context) |
| Righe diff nette | ~**6** codice + doc |
| Follow-up nuovi (FU) | **0** |
| Modalità alzata | no |

### Analisi flusso ed efficienza

| Aspetto | Valutazione |
|---------|-------------|
| Chiarezza prompt prepara | **Alta** — bug root cause (mancava `aspect-[7/2]` mobile) esplicito nel codice |
| Costo ciclo | **Basso** — 1 prepara + 1 esecuzione + 1 chiusura |
| Rework | **0** |
| Rischio regressione | **Medio-basso** — solo classi Tailwind su ramo condizionale |

**Pattern utile:** task layout responsive con stato già corretto su breakpoint maggiore → prompt deve citare **classi esistenti** del ramo «buono» (qui `aspect-[7/2]` del ramo foto).

---

## 6. Commit e deploy

Vedi commit di chiusura su `env/test` e merge `main` (questo report).
