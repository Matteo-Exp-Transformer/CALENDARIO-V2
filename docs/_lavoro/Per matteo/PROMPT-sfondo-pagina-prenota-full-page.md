# Prompt — Sfondo Pagina Prenota (coppia desktop + mobile)

> **Uso:** incolla il blocco «Brief» in ChatGPT / generatore immagini.  
> **Composizione validata:** vista unica continua (prova 4).  
> **Import:** `immagini di prova/…` → agente → `full-01`…`full-04`.

---

## Brief (copia tutto)

```
Genera una COPPIA di sfondi fotografici per pagina web prenotazione ristorante.

Due file distinti per preset — NON stesso file ridimensionato:

A) LANDSCAPE — tablet e desktop (schermo ≥768px, orizzontale)
B) PORTRAIT — smartphone (<768px, verticale)

────────────────────────────────────────
A) LANDSCAPE — dimensioni SCHERMO (16:9)
────────────────────────────────────────
- Dimensioni: 2560 × 1440 px (rapporto 16:9, come monitor/tablet in orizzontale)
- DEVE essere più LARGA che ALTA — inquadratura panoramica orizzontale
- NON generare un file alto/stretto (es. 948×1659): quello è formato sbagliato per desktop
- NON pensare all’altezza del form o del container: l’app scala l’immagine alla LARGHEZZA dello schermo (100% auto)
- Composizione: vista ampia della sala (profondità, file di tavoli, pareti, luci) che riempie il frame 16:9
- Stesso locale e mood della portrait, ma inquadratura orizzontale da “schermo pieno”

────────────────────────────────────────
B) PORTRAIT — scroll mobile (1:6)
────────────────────────────────────────
- Dimensioni: 1440 × 8640 px (rapporto ≈ 1:6 — molto alta)
- Inquadratura verticale lunga: stessa sala, percorso visivo dall’alto al basso
- Obbligatoria per coprire lo scroll del form su smartphone (CSS: larghezza schermo 100% auto)

────────────────────────────────────────
REGOLA COMPOSIZIONE — VISTA UNICA (soprattutto portrait)
────────────────────────────────────────
L’immagine è UN SOLO ambiente, coerente guardando l’INTERA altezza (portrait) o larghezza (landscape).

NON fare:
- Hero denso in alto e poi 40–60% solo pavimento con tavoli isolati “per riempire”
- Cambio scena a metà (luce, locale, pavimento diversi)
- Collage di inquadrature diverse

FARE:
- Densità uniforme su tutta l’altezza (portrait) / tutta la profondità (landscape)
- Ogni terzo dell’immagine ha lo stesso “peso” ambientale
- Chiusura naturale (parete, vetrata, fine fila tavoli), non corridoio vuoto

NO testo, NO logo, NO persone in primo piano, NO watermark.
Zone centrali leggermente più calme (ci vanno card bianche del form).

Uso tecnico app (non modificare):
- Una immagine continua per file, NO tile, NO repeat
- Mobile portrait: background-size 100% auto → larghezza = schermo
- Desktop landscape: background-size 100% auto → larghezza = schermo (16:9 riempie la larghezza senza bande laterali)

Consegna: PNG, es. preset-01-landscape.png (2560×1440) + preset-01-portrait.png (1440×8640)
```

---

## Prompt visivo preset (cambia solo «Variante»)

**Sfondo 1**
```
Variante: sala ristorante elegante, legno caldo, tavoli apparecchiati, luce calda.

LANDSCAPE 2560×1440 (16:9): inquadratura PANORAMICA ORIZZONTALE — vista obliqua ampia della sala, profondità verso il fondo, elementi distribuiti su tutta la larghezza e profondità del frame. Formato schermo, non verticale.

PORTRAIT 1440×8640 (1:6): stessa sala, camera che avanza lungo la sala dall’alto al basso; tavoli, sedie, luci su tutta l’altezza; basso = chiusura credibile, MAI solo pavimento vuoto.

Genera la coppia come da brief.
```

**Sfondo 2 / 3 / 4** — stesso schema, cambia palette o dettagli.

---

## Checklist prima di accettare

| File | OK se… |
|------|--------|
| **Landscape** | 2560×1440 (o 16:9); **width > height**; panoramica orizzontale |
| **Landscape NO** | File alto/stretto (948×1659, 9:16, “metà portrait”) |
| **Portrait** | 1440×8640 circa (1:5–1:6); vista verticale lunga |
| **Coppia** | Stesso locale; landscape = schermo, portrait = scroll mobile |
| **Composizione** | Niente hero + pavimento vuoto sotto |

---

## Mapping import (agente)

| Coppia | Portrait (ratio ~1:6, più alto) | Landscape (16:9, più wide) | WebP |
|--------|----------------------------------|----------------------------|------|
| 1ª | dispari / file alto | pari / file 16:9 | `full-01-*` |
| 2ª | … | … | `full-02-*` |
| … | … | … | `full-03/04-*` |

---

## One-liner

*«Coppia sfondo ristorante: landscape 2560×1440 (16:9 schermo, panoramica) + portrait 1440×8640 (1:6 scroll mobile), stessa sala, vista unica, no tile.»*

---

*Aggiornato 31-05-26 — landscape 16:9 schermo (non altezza form); portrait 1:6 invariato.*
