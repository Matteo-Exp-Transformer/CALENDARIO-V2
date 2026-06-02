# PROPOSTE — automazioni candidate (in attesa di decisione di Matteo)

> L'agente scrive qui quando un pattern in [OSSERVAZIONI.md](OSSERVAZIONI.md) è maturo
> (≥2-3 occorrenze). Ogni proposta va **chiesta a Matteo in chat**. Esito:
> - **Accettata** → la rule sale in [VOCABOLARIO.md](VOCABOLARIO.md); la riga si sposta in [ARCHIVIO_DECISIONI.md](ARCHIVIO_DECISIONI.md).
> - **Rifiutata** → in [ARCHIVIO_DECISIONI.md](ARCHIVIO_DECISIONI.md) con il motivo, **non riproporre**.
> - **In attesa** → resta qui finché Matteo non decide.
>
> **Questo file resta LEGGERO: solo pendenze vive.** Tutto il deciso (accettato/rifiutato/superato)
> sta in [ARCHIVIO_DECISIONI.md](ARCHIVIO_DECISIONI.md) per le verifiche.

Ogni proposta deve dire: cosa automatizzare **con certezza** vs cosa **lasciare manuale** e perché.
Formato: `### [stato] «trigger» → comportamento` + Pattern · Automatizzabile · Manuale · Livello · Esito.

---

> 🛑 **PAUSA-RACCOLTA attiva.** Si promuove solo ciò che **ripara un danno dimostrato**, **sblocca
> la misurazione** o ha **costo zero** (formalizza una prassi in atto). Tutto il resto resta
> **ATTESA-DATI**: non si promuove su intuizione, si aspettano ~5-10 sessioni di dati.

## Pendenze vive

### ATTESA-DATI «test fatti tutto ok» → solo aggiornare QA, non gonfiare report
- **Pattern:** dopo QA OK, agenti riscrivevano sezioni già corrette come se stimate (01-06-26). 1 occ.
- **Cosa:** su «test fatti tutto ok» / «QA ok» → aggiornare tabella QA + cappello + SESSION_LOG; **vietato** espandere retroattivamente «cosa fatto» o inventare difficoltà.
- **Stato:** parz. coperta dall'istruzione anti-gonfiaggio; serve 2ª occorrenza per regola fissa. Dove: `COMUNICAZIONE_UTENTE_SKILL.md`.

### ATTESA-DATI «blocco precauzioni mobile CSS nei prompt UI»
- **Pattern:** fix sfondo/scroll mobile (31-05-26) → Matteo vuole espliciti iOS/`background-attachment` + sezione report compatibilità. **1 occorrenza.**
- **Cosa:** su task sfondo full-page/scroll/footer pubblico mobile → mini-blocco «Implementazione sfondo» nel prompt. Template: `Prompt-B-menu-qr-footer-scroll-31-05-26.md`.
- **Stato:** serve 2ª occorrenza. Fino ad allora prepara-prompt riusa il template a mano.

### ATTESA-DATI «no toast se Salva già disattivato»
- **Pattern:** Menu QR modale: toast validazione + Salva grigio = ridondante (30-05-26). 1 occ., già accettato a voce (toast = backup).
- **Stato:** micro-UX, non un danno. Serve 2ª occorrenza o sessione UI dedicata.

### ATTESA-DATI «segnala conflitto scalabilità multi-tenant» → sezione report
- **Pattern:** Matteo vuole sapere se le sue decisioni (autosave, persistenza) confliggono con N ristoranti. 1 occ. (FU-006).
- **Stato:** aspettare 2ª occorrenza prima di renderla sezione obbligatoria (rischio sezione spesso vuota).

### ATTESA-DATI «sessione Verifica mappatura Impostazioni ↔ Prenota» → template
- **Pattern:** Matteo incolla coppie DOM `admin -- prenota`; Verifica traccia setting_key/hook/esito (29-05-26, ~30 coppie).
- **Cosa:** template report con colonne fisse + checklist gap. Termini candidati Liv.2: Anagrafica, Personalizza form, Card scorrevole, ecc.
- **Stato:** in attesa, da report mappatura 29-05-26.

### ATTESA-DATI «tutto fatto» come chiusura ciclo
- **Pattern:** «tutto fatto» a fine catena → raccolta comunicazione + commit + report.
- **Stato:** si **sovrappone** a «lavoro ok» + «fai report finale». Verificare sui dati se ha comportamento distinto prima di aggiungere un 3° trigger.

## Idee in pausa (non ancora proposte mature)

- **«file mappa richieste-utente → automazioni»** (idea Matteo 30-05-26): un punto unico per le richieste ricorrenti. Rischio duplicazione con OSSERVAZIONI/PROPOSTE/EVOLUZIONE. **Non creare file ora** (Matteo stesso ha frenato: testare prima).
- **«diagnosi disallineamento prod/test → consultare provider via MCP»** (30-05-26): quando Matteo segnala disallineamento ambienti, consultare attivamente Vercel/Supabase/git PRIMA di ipotizzare cause ovvie. Checklist 4 dimensioni già in APP_CONTEXT §1b.1.

## Materiale per M4 (enforcement hook — non regole markdown)

> Queste NON vanno promosse come regole `.md`: sono candidate a **hook** quando M4 avanza. Vedi `EVOLUZIONE_SKILLS.md` M4.

- **merge env/test→main a cura revisore**: tocca PROD → enforcement, non markdown. Merge resta manuale su richiesta esplicita.
- **QA viewport 375/834/1280 obbligatorio in revisione UI**: la regola esiste già (TESTING §7) ma è bypassata → problema di enforcement, non di regola mancante.
- **`beforeShellExecution` guard PROD**: blocca scritture su DB prod `rwuxgvld` senza conferma.

---

> 📦 **Tutto il deciso (accettato / rifiutato / superato) è in [ARCHIVIO_DECISIONI.md](ARCHIVIO_DECISIONI.md).**
> Qui restano solo le pendenze. Quando decidi una pendenza, la sua riga si sposta nell'archivio.
