# Stato — INT1 (Fase 1 dell'interrogazione)

**Data:** 07-08-26 · **Profilo:** Verifica | Meta · **Esito:** ✅ CHIUSA

## Perimetro e copertura

| Fonte | Perimetro | Aperto | Letto integralmente |
|-------|-----------|--------|---------------------|
| `S6_DOSSIER_PROFILO_MATTEO.md` | 978 righe | sì | 978 (100%) |
| `S6_BANCA_DOMANDE.md` | 1.006 righe | sì | 1.006 (100%) |
| `PIANO_INDAGINE.md` | 377 righe | sì | 377 (100%) |
| `S5_RITRATTO_METODOLOGICO.md` | 806 righe | sì | 225 (§3.7, §4, §5) — mirato |
| `docs/Archives/Crescita professionale/` (11 md) | 1.428 righe | sì | 1.428 (100%) |
| `docs/Archives/Crescita professionale/08` | 313 righe | sì | 120 — rastrello |
| `CV_Matteo_Cavallaro_EN.pdf` | — | **no** | — |

**File aperti: 16 / 16. Letti integralmente: 14 / 16.**
**Non riaperti (mandato):** 39 report di mining · S1–S4 · corpus grezzo transcript · `src/`.

## Prodotto

| Output | Dove | Su git |
|--------|------|--------|
| `INT_00_PROTOCOLLO.md` | `_lavoro/Per matteo/Valutazione Personale/Interrogazioni Valutative/Contesto/` | ❌ |
| `INT_01_PROFILO_UNIFICATO_v0.md` | idem | ❌ |
| `INT_02_INTERROGAZIONE.md` | idem | ❌ |
| `INT_03_PROFILO_RECRUITER_v0.md` | idem | ❌ |
| `INT_04_VALUTAZIONE_SESSIONI.md` | idem | ❌ |
| `Report-fase1-interrogazione-07-08-26.md` | `Indagine-Skill-Matteo/` | ✅ |
| `_stato/INT1.md` | questo | ✅ |

## Conteggi

- **Domande di interrogazione totali: ~77** — 40 dalla banca S6b (invariate) + **37 nuove**
  (`X-01…X-10` incrocio · `U-01…U-19` umano · `D-01…D-08` didattico).
- **6 blocchi**, ordine `1 → 4 → 2 → 3 → 5 → 6`, un blocco per sessione.
- **5 incroci** fra i due corpora, mai fatti prima.
- **10 zone bianche** verificate assenti in entrambe le fonti.
- **0 livelli mossi** — restano tutti PROVVISORI, come da piano §0b #4.
- **0 conflitti chiusi** — i 9 restano aperti, si chiudono a voce.

## Decisioni di Matteo (07-08-26)

1. **Due profili:** privato completo + recruiter da riempire nel tempo.
2. **Livelli:** declassa subito con qualunque risposta · alza solo con episodio verificabile ·
   **dichiarabile a livello professionale solo con artefatto o prova tangibile in app**
   (vincolo aggiunto da lui, non presente fra le opzioni).
3. **Blocco umano:** chiedi tutto, metti tutto per iscritto (nel privato).
4. **Formato:** dal vivo, a blocchi, una domanda alla volta.

## Lacune aperte

`L-INT-1` `08_Candidature` letto al 38% · `L-INT-2` CV PDF mai aperto ·
`L-INT-3` la scheda a 7 criteri va trasferita su `11_Valutazioni_Didattiche.md`
(`Documents\Io-Claude\Crescita professionale\`, fuori dal perimetro di lavoro).

## Errore commesso e corretto nella stessa sessione

`INT_01` §9 dichiarava «letti per intero i 13 file di Crescita professionale»: **falso**, erano 7 su
12. Trovato preparando il report, buco chiuso, sezione riscritta con i numeri veri. Nessuna delle 5
conclusioni cambia; due si rafforzano.

## Igiene verificata

- I 5 file `INT_*` sono **fuori da git** (`git check-ignore` conferma, `.gitignore:42`).
- `docs/Archives/` **non era ignorata** e contiene `Crescita professionale/` con dati anagrafici +
  un `.git` annidato → **aggiunta a `.gitignore` il 07-08-26.** Non era comunque mai stata tracciata
  (piano §2.3 punto 2).
- `docs/Archives/Crescita professionale/` è **byte-identica** all'originale in
  `Documents\Io-Claude\` (verificato con `diff -rq`): è una copia, e va trattata come tale.

## Prossimo passo

**Blocco 1 dell'interrogazione**, condotto da `S6_BANCA_DOMANDE.md` con le regole di
`INT_00_PROTOCOLLO.md`. **L'albero non si tocca prima del blocco 6.**
