# Report — Blindatura Admin Area 2 (Prenotazioni operative): intervista, conferme coerenti, revisione senior

> Sessione senior / orchestratore Admin · modalità deep · branch `env/test` · 06–07-06-26.
> Cappello in 3 righe: (1) **per l'utente** le azioni pericolose sulle prenotazioni (Elimina, No-show,
> Reinserisci, Riporta in attesa, Rifiuta) ora chiedono conferma con la **stessa finestra coerente**,
> niente più popup grigio del browser; (2) **resta da fare** la Fase D — controtest che *cerca
> attivamente* di rompere la sezione — per chiudere Area 2; (3) **serve una tua azione**: lanciare il
> prompt orchestratore del controtest (pronto, in fondo) e poi rivedere i finding.

---

## 1. Cosa è stato fatto

### Fase A — Intervista di senso (chiusa 06-06-26)
Decisioni prese con Matteo, scritte in `ADMIN_PRENOTAZIONI_CONTEXT.md §5-bis`, riassunte in
`ADMIN_SKILL.md §6` e `PLAN_BLINDATURA_ADMIN.md §3-bis`:

1. **Capienza / fasce / orario passato = solo AVVISO, mai blocco.** Il ristoratore decide sempre.
2. **Stati `pending/accepted/rejected/deleted` + flag `no_show` tutti voluti**, non si toccano.
3. **Archivio = solo soft-delete** recuperabile per sempre; **nessun hard-delete lato app** (la pulizia
   dei record vecchi la farà Matteo da DB, criterio temporale futuro).
4. **Conferme azioni pericolose da rendere coerenti** (una sola "lingua" di conferma).

### Fase B/C — Verifica codice + lavoro prodotto (07-06-26)
- **Verifica «codice = verità»**: scoperto che i report storici davano `AcceptBookingModal` per
  "dead code" → **falso**, è usato da `AdminBookingForm`. Mappate le conferme reali (miste: `window.confirm`
  nativo in archivio, modale custom per Elimina, nessuna per No-show, box-motivo per Rifiuta). Doc corretta.
- **`BookingDangerActionModal`** (nuovo componente) unifica le conferme: Elimina, No-show, Reinserisci,
  Riporta in attesa, Rifiuta. Tolto `window.confirm()` nativo da `ArchiveTab`. No-show ora ha conferma.
- **`AdminAuthProvider`** (nuovo context): risolto il debito del doppio `useAdminAuth`
  (montato in `ProtectedRoute` + `AdminShell`). **Autorizzato da Matteo** in fase di intervista.
- Rimossa l'action `settings` latente dalla sidebar di `AdminShell` (percorso morto).
- Test nuovi marcati `@admin-blindatura: prenotazioni` (13 test, 2 file).

---

## 2. Revisione senior imparziale (07-06-26)

Pesato sul codice, non sui report dell'agente:

| Controllo | Esito |
|---|---|
| `npm run typecheck` | ✅ pulito |
| `npm run lint` | ✅ zero warning |
| Suite completa Vitest | ✅ **441 test / 54 file** verdi |
| File LOCK (`BookingDetailsModal`, `useBookingMutations`) | ✅ bottoni core + signature mutation **intatti** |
| `AdminAuthProvider` montato nel router | ✅ dentro `TenantProvider`, ordine corretto |
| Refactor auth | ✅ logica preservata (session/login/logout/abbonamento) |

**Verdetto: lavoro Area 2 solido e verde.** Riserva iniziale sul refactor auth (sembrava scope creep)
**ritirata**: Matteo aveva autorizzato e l'agente aveva annotato la decisione.

**Debito di qualità (basso):** i 2 file di test nuovi hanno `act()` warning (passano ma scritti senza
wrappare gli update React). Da sistemare quando un sub-agent tocca quei file in Fase D.

---

## 3. Cosa NON è stato fatto (e resta aperto)

- **Fase D Area 2 — controtest a mandato "ROMPI" + limit test:** NON ancora eseguita. È il passo che
  chiude Area 2 a ✅. Prompt orchestratore pronto (§5).
- **Debito #1 Area 1 — E2E reali shell-*:** i 3 spec hanno solo il marcatore, servono staging Supabase
  per girare davvero. Finché non girano, Area 1 resta 🔶, non ✅ PROD.
- **`act()` warning** nei test prenotazioni: da pulire in Fase D.

---

## 4. Pratica nuova introdotta nella procedura (vale per TUTTE le aree)

Decisione Matteo 07-06-26: **la chiusura di un'area non è «i test sono verdi». È cercare ATTIVAMENTE
cosa la rompe.** I sub-agent di controtest hanno mandato esplicito di *trovare bug*, guidati dalla
domanda *«cosa può rompere la sezione e cosa può fare l'utente per romperla?»*. Quattro fronti:
**flusso dati** (sporcalo: dati nulli, doppio click, race, azione su record già in altro stato),
**flusso utente** (rompilo: click fuori sequenza, navigazione durante mutation, back/refresh),
**limit test** (confini: testi enormi, numeri 0/negativi, date limite, liste lunghe, capienza ±1),
**responsive 375/834/1280**. Un controtest che non ha *provato* a rompere nulla NON chiude l'area.

Scritto in: `PLAN_BLINDATURA_ADMIN.md` Fase D (riscritta) + `PROSEGUIMENTO_MAPPATURA_SKILL.md`
criterio «blindata di PRODOTTO» punto (d). Così gli altri agenti sanno che si lavora così.

---

## 5. Prossimo passo — prompt orchestratore controtest Area 2

Il prompt completo per lanciare i 4 sub-agent (flusso dati / flusso utente / limit test / responsive)
con mandato "ROMPI" è stato consegnato in chat. In sintesi: profilo Verifica, deep, su `env/test`,
sub-agent read-only che **riportano** finding, l'orchestratore consolida in tabella
(fronte · cosa rompe · gravità · fix/FU/voluto) e Matteo decide la lista fix. A fine: aggiornare
test index, registro stati PLAN §5, proseguimento, e verdetto Area 2 (✅ o cosa manca).

---

## 6. File toccati questa sessione (doc + report)

- `docs/Admin-Skill/ADMIN_SKILL.md` — decisioni Area 2 §6.
- `docs/Admin-Skill/PLAN_BLINDATURA_ADMIN.md` — §3-bis Area 2 + Fase D riscritta + registro stati.
- `docs/Admin-Skill/contesto/ADMIN_PRENOTAZIONI_CONTEXT.md` — §5-bis decisioni + §7 stato codice.
- `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md` — stato Admin + criterio "ROMPI".
- Codice + test (lavoro agente, già nel working tree): `BookingDangerActionModal.tsx`,
  `AdminAuthContext.tsx`, `ArchiveTab.tsx`, `BookingDetailsModal.tsx`, `RejectBookingModal.tsx`,
  `AdminShell.tsx`, `useAdminAuth.ts`, `router.tsx` + 2 file test `@admin-blindatura: prenotazioni`.

---

## 11. Domande di chiusura

❓ Q1 — Prompt verbatim rispettato?
✅ R1: Sì. Richiesta = "fai da revisore imparziale, dimmi come proseguire" → fatta revisione su codice
(validate, LOCK, refactor), dato verdetto + prossimo passo. Poi "report finale + aggiorna proseguimento
con le pratiche" → fatto entrambi.

❓ Q2 — I dati nel report combaciano col diff reale?
✅ R2: Sì. 441 test / 54 file, typecheck e lint verdi: eseguiti in sessione. File LOCK verificati via
diff (`BookingDetailsModal`, `useBookingMutations`). `AdminAuthProvider` letto integralmente. 19 file
modificati + 4 nuovi nel working tree.

❓ Q3 — File correlati allineati?
✅ R3: Sì. Skill §6, PLAN §3-bis + Fase D, context §5-bis/§7, proseguimento (stato + criterio)
aggiornati e coerenti tra loro.

❓ Q4 — Cosa NON è stato fatto?
✅ R4: Fase D controtest (prossimo passo), E2E reali Area 1 (debito #1), pulizia `act()` warning.
Tutto tracciato §3.

❓ Q5 — Attrito + miglioria?
✅ R5: Attrito = ho aperto una riserva su "scope creep" del refactor auth poi ritirata (Matteo l'aveva
autorizzato, l'annotazione era nei doc che non avevo riletto prima). Miglioria: da revisore, controllare
prima le decisioni annotate nei doc d'area prima di segnalare scope creep.

❓ Q6 — Contesto giusto + hook utile?
✅ R6: Contesto giusto (skill Admin + PLAN + LOCK + codice). La procedura ora codifica il controtest
"ROMPI": utile perché evita il falso "verde = blindato".
