# Manuale di blindatura — come testare una sezione in modo professionale

> **Cos'è.** La **source of truth** del metodo di test per blindare una sezione dell'app (Prenota,
> Menu QR, Admin). Dice a un agente, dopo la mappatura: **quali test fare, in che ordine, quando il
> controtest "rompi" è obbligatorio, e qual è il cancello per dichiarare blindato**.
> Lo referenzia il `MASTERPLAN_BLINDATURA.md` da ogni milestone.
>
> **Non duplica.** Per lo *stack* (Vitest vs Playwright, comandi) → `TESTING_SKILL.md`. Per i
> *viewport standard* → `TESTING_SKILL.md` §8.2. Per la *definizione di controtest "rompi"* →
> `EVOLUZIONE_SKILLS.md` §7. Qui c'è solo il **metodo**: quando applicare cosa.

---

## 0. Le 3 famiglie di test (cosa significano)

| Famiglia | Cosa verifica | Strumento | Quando |
|----------|---------------|-----------|--------|
| **Test di copertura** | «ciò che ho pensato di testare funziona» | Vitest (logica) / Playwright (flusso) | sempre, dopo ogni modifica |
| **Test "rompi" (controtest)** | «cosa può rompere la sezione, e cosa può fare l'utente per romperla» | sub-agent con mandato *trova bug* | quando dovuto (vedi §2) |
| **QA manuale responsive** | l'UI regge su 375/834/1280 con un umano/Playwright che la usa | DevTools / Playwright MCP | quando cambia la UI servita |

> **Il punto che separa un dilettante da un professionista:** il verde dei test di copertura **non**
> dimostra che la sezione è robusta — dimostra solo che le ipotesi che hai scritto passano. La
> robustezza si dimostra **provando attivamente a rompere** la sezione (test "rompi"). Un controtest
> che non ha *provato* a rompere nulla non chiude l'area. (Anti-pattern curato: *falso PASSA da
> copertura* — «verde = blindato».)

---

## 1. La sequenza dopo la mappatura (ciclo fisso A→D)

Ogni sezione, dopo intervista + mappatura, segue questo ciclo. È il riferimento operativo del
`PLAN_BLINDATURA_<AREA>.md`.

1. **Fase A — Test di copertura.** Scrivi i test che blindano i flussi mappati. Marcatore in testa:
   ```ts
   // @<area>-blindatura: <fronte>
   // Copre: <flusso utente/dati blindato>
   ```
   - **Vitest** per logica pura (hook, resolver, cap testi, trasformazioni, RLS simulata via mock).
   - **Playwright** per flussi utente reali (login, accetta prenotazione, sidebar Classic/Pro).
   - Regola: prima cerca un test esistente da estendere (`TESTING_SKILL.md` §1), non duplicare.
2. **Fase B — `npm run validate` verde.** Lint + typecheck + Vitest. Gate automatico: se rosso, ci si
   ferma qui.
3. **Fase C — Controtest "rompi" (se dovuto, §2).** Sub-agent con mandato esplicito *trova bug* sui 4
   fronti (§3). Riportano finding; l'orchestratore decide per ognuno: fix / follow-up / "voluto".
4. **Fase D — QA responsive + chiusura.** QA su 375/834/1280 (`TESTING_SKILL.md` §8.2), doc e test
   index aggiornati, report sessione con esiti.

---

## 2. QUANDO il controtest "rompi" è obbligatorio (la decisione)

Non tutte le milestone richiedono il "rompi". La regola, decisa dal senior, è **legata a cosa tocca il
diff**, non al fatto che la sezione sia "importante":

| Il merge/milestone… | Test "rompi" Fase C | Perché |
|---------------------|---------------------|--------|
| **Tocca codice `src/` con logica o stato** (mutation, form, calcoli, flusso dati) | ✅ **OBBLIGATORIO** | c'è comportamento applicativo che l'utente può sollecitare in modi imprevisti → va sollecitato apposta |
| **Tocca solo `src/` di presentazione pura** (label, stile statico, riordino visivo senza logica) | 🔶 **QA responsive sì, "rompi" no** | niente stato da corrompere; basta verificare che la UI regga |
| **NON tocca `src/`** (solo test E2E, config, doc) | ❌ **NON dovuto** | il comportamento servito è identico → non c'è nulla da rompere. Non è un debito, non si traccia come FU |

> **Come si classifica un diff:** `git diff --name-only main..env/test -- src/`. Se vuoto → famiglia 3
> (niente "rompi"). Se tocca hook/mutation/resolver → famiglia 1 (rompi obbligatorio). Vedi anche
> `EVOLUZIONE_SKILLS.md` §8 (cosa va in pubblico) — stessa classificazione del diff.

**Esempi reali:**
- **M0 Prenota** (cap testi menù, logica clamp) → famiglia 1 → "rompi" + QA browser **dovuti**.
- **M1 Shell** (solo E2E + `playwright.config.ts` + doc, zero `src/`) → famiglia 3 → "rompi" **non
  dovuto**: il bundle servito non cambia, coperto da E2E reali + smoke. Chiuso senza Fase C, e
  **correttamente** non tracciato come debito.

---

## 3. I 4 fronti del controtest "rompi" (come si rompe, in pratica)

Quando la Fase C è dovuta, il sub-agent riceve il mandato «**prova a rompere la sezione**» e lavora su
questi 4 fronti. Per la definizione di principio: `EVOLUZIONE_SKILLS.md` §7.

1. **Flusso dati — sporcalo.** Per ogni azione: lo stato DB finale è quello giusto? Cosa succede con
   dati mancanti/nulli (orario assente, email vuota, capienza non configurata, tenant senza
   anagrafica)? Doppio click / azione ripetuta / race tra invalidazioni? Azione su un record già in un
   altro stato (accettare una già accettata)?
2. **Flusso utente — rompilo da utente.** Click fuori sequenza, modale chiusa a metà, conferma
   annullata e riaperta, navigazione via mentre una mutation gira, back/refresh durante un'azione.
   Cosa vede l'utente se va storto: errore chiaro o schermata rotta?
3. **Limit test — spingi i confini.** Testi lunghissimi, ospiti enorme/0/negativo, date limite
   (mezzanotte, passato, anni avanti), liste lunghe (archivio con tante righe), capienza al limite
   esatto e +1.
4. **Responsive 375 / 834 / 1280.** Ogni modale/azione nuova: layout che non si rompe, bottoni
   raggiungibili, niente overflow/sovrapposizioni, console senza errori bloccanti.

---

## 4. Cancello di chiusura — quando una sezione è «blindata»

Una sezione è **blindata** (e quindi candidabile al merge) solo se tutte le caselle sono vere:

- [ ] **Intervistata + mappata** (il ciclo è partito dall'intervista di senso, non dal codice).
- [ ] **Test di copertura** sui flussi mappati, con marcatore `@<area>-blindatura`, **verdi**.
- [ ] **`npm run validate` verde** (rieseguito, non riportato a memoria).
- [ ] **Controtest "rompi"** eseguito **se dovuto** (§2), finding decisi (fix/follow-up/"voluto").
- [ ] **QA responsive** 375/834/1280 se la UI servita cambia, console senza errori bloccanti.
- [ ] **Doc allineata** alla stessa sessione: skill area, `*_TEST_SUITE_INDEX.md`, masterplan.
- [ ] **Report sessione** con tabella esiti + decisioni.

> Il cancello di **merge production** è separato e in più: vedi `MASTERPLAN_BLINDATURA.md` § «Procedura
> merge» (classifica diff → pubblica solo se tocca codice servito).

---

## 5. Rapporto con gli altri file (niente duplicati)

| File | Cosa tiene (source of truth) |
|------|------------------------------|
| **Questo (`MANUALE_BLINDATURA.md`)** | *metodo*: sequenza A→D, quando il "rompi" è dovuto, cancello blindato |
| `TESTING_SKILL.md` | *stack*: Vitest vs Playwright, comandi, §8 QA manuale + viewport |
| `EVOLUZIONE_SKILLS.md` §7 | *principio* del controtest "rompi" (perché verde ≠ robusto) |
| `EVOLUZIONE_SKILLS.md` §8 | *regola merge* pubblico/privato (classifica diff) |
| `CONTROVERIFICA.md` | *sub-agente imparziale* di fine sessione (giudizio d'insieme) |
| `PLAN_BLINDATURA_<AREA>.md` | *applicazione per area*: fasi, file, marcatori specifici |
| `<AREA>_TEST_SUITE_INDEX.md` | *inventario* test per area + buchi |
