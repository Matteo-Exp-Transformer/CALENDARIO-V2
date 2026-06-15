# Report — D-M2 Sfondi Prenota + consolidamento upstream

**Data:** 15-06-26  
**Branch:** `env/test`  
**Scope:** eliminazione gradienti/tile; resolver unico layout; gate persist admin

## Problema nell'insieme

Prima del fix, la logica sfondo era **frammentata**:

| Livello | Problema |
|---------|----------|
| **DB/registry** | `parseFromDb` doveva neutralizzare legacy, ma il pubblico aveva ancora ramo render gradiente/tile |
| **Pagina pubblica** | Catena manuale: `showPhotoStrip` → `fullPagePhotoId` → `isFullPagePhoto` → `resolvePublicBookingSurface` |
| **Admin** | `savedBg = data ?? DEFAULT` + **salvataggio anagrafica sempre con sfondo** → tenant legacy (null) poteva ricevere `full-01` al primo Salva senza toccare il picker |
| **Test** | Due file, due helper (`resolvePublicBookingFullPagePhotoId` + `resolvePublicBookingSurface`) |

## Soluzione a monte

### 1. Contratto unico pubblico — `resolvePublicBookingPageLayout`

File: `bookingPageBackground.ts`

Input: valori **già parsati** dal registry (`pageBackground`, `stripPhotoId`).

Output tipizzato:
- `mode`: `strip` | `full-page` | `neutral`
- `surface`: per palette FU-014
- `fullPagePhotoId`, `stripPhotoId`, `rootBackgroundColor` (crema `#faf7f1`)

`BookingRequestPage` chiama **solo questo** resolver.

### 2. Parse migrate-on-read

`parseBookingPageBackgroundFromDb`: solo `full-01`…`full-04`; gradiente/tile/unknown → `null` → mode `neutral` + crema.

Rimossi preset gradiente, tile, layer scrollabile marrone.

### 3. Admin — hydrate + dirty + persist condizionale

- `hydrateAdminBookingBackgroundEditor`: default `full-01` **solo anteprima editor**, non confuso con DB null
- `isAdminBookingBackgroundDirty`: confronto esplicito con `saved.pageBackground ?? DEFAULT`
- **Salva anagrafica**: chiavi sfondo incluse **solo se `bookingBgDirty`** → niente migrazione silenziosa legacy→full-01

### 4. Test

- `@admin-blindatura: settings-background` — 9 casi (parse, layout, admin dirty)
- `publicBookingSurface.test.ts` — regressione palette (6 casi)

## File toccati

| File | Modifica |
|------|----------|
| `bookingPageBackground.ts` | Resolver unico + helper admin; rimossi gradient/tile |
| `BookingRequestPage.tsx` | Un solo `resolvePublicBookingPageLayout` |
| `RestaurantSettingsTab.tsx` | Hydrate/dirty upstream; persist sfondo se dirty |
| `bookingPublicFieldStyles.ts` | Commenti D-M2 |
| Skill + test suite index | Allineati |

## Non toccato (come richiesto)

`booking_window_days`, create-booking edge, migrazioni DB, submit Prenota.

## Verifica

```bash
npx vitest run src/features/booking/lib/__tests__/settingsBackground.adminBlindatura.test.ts src/features/booking/constants/__tests__/publicBookingSurface.test.ts
npm run validate
```

## La lettura della sessione

D-M2 non è solo «togliere i gradienti»: il rischio vero era **due fonti di verità** (parse vs render vs admin default) e il **persist implicito** che avrebbe riscritto il DB al primo Salva anagrafica. Il resolver unico + gate dirty chiudono entrambi a monte.
