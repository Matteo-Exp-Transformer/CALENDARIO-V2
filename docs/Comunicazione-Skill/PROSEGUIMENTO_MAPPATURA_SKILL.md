# Proseguimento — Mappatura & blindatura dello skill system (lavoro lungo)

> **A cosa serve questo file.** È il **punto di ripresa** del lavoro lungo iniziato il 04-06-26:
> trasformare lo skill system in aree mappate, con senso chiuso e file ben tagliati. Ogni nuova
> sessione **senior** che continua questo lavoro **parte da qui** — non ri-decide le regole (sono già
> prese), applica il pattern alla prossima area. Aggiornare lo stato sotto a fine di ogni sessione.

---

## Come avviare una sessione che continua questo lavoro

Apri una chat e usa il grilletto **«evolvi skill system senior»** (o «meta senior»), poi indica
l'area. Esempio di primo prompt pronto:

> «**evolvi skill system senior** — continuiamo la mappatura dallo stato in
> `docs/Comunicazione-Skill/PROSEGUIMENTO_MAPPATURA_SKILL.md`. Oggi: [area, es. Menu QR] /
> [oppure: verifica col sub-agent l'area Prenota].»

L'agente senior, riconosciuto il grilletto, deve **leggere prima**: questo file + il Playbook in
`EVOLUZIONE_SKILLS.md` + la memory `project_senior_context_knowledge_milestone`. Poi applica il
pattern, senza ridiscutere le regole già decise.

---

## Le regole già DECISE (non ri-decidere — applica)

1. **Skill = senso/workflow/divieti + mappa** «tocchi X → apri Y». Il dettaglio scende in `contesto/`.
   Lo skill esistente si **snellisce**, non si duplica.
2. **Regola di taglio a soglia:** area piccola = 1 file con due sezioni (Senso/Flusso + Valori); area
   grande = 1 file per **sotto-funzione** (se un agente medio non lo legge intero in un colpo → spacca).
3. **Il senso sta nello skill**, si scorpora in file separato solo se gonfia (>~150-200 righe).
4. **Codice = verità** per i numeri; i `.md` li specchiano e spiegano il perché.
5. **Lettura integrale:** pochi file ma letti INTERI (tranne micro-fix).
6. **I report storici in `Sessioni di lavoro/` NON si toccano** (fotografie del passato).

## Il procedimento per ogni area (ricetta ripetibile)

1. **Censisci** i file esistenti dell'area (skill + context sparsi + costanti nel codice).
2. **Identifica il SENSO mancante** — quasi sempre i file vecchi dicono COME, non PERCHÉ.
3. **Intervista Matteo** sul senso che solo lui ha: a che serve · attori (chi può/non può cosa) ·
   limiti VOLUTI da non aggiustare · questioni aperte. Usa `AskUserQuestion`.
4. **Riorganizza** in `docs/<Area>-Skill/`: `<AREA>_SKILL.md` (entry: senso + mappa) +
   `contesto/` (i file di dettaglio, rinominati con `git mv` per preservare la storia).
5. **Scrivi il flusso** (user journey + data flow affiancati) nello skill.
6. **Aggiorna i rimandi** SOLO nei file vivi (skill, indici, context che si citano); lascia i report.
7. **Verifica col sub-agent** (criterio «blindata»): dagli un compito finto sull'area, guarda se apre
   i file giusti senza aver vissuto la chat. Passa → area BLINDATA.

**Criterio «area BLINDATA»:** (1) ogni elemento ha senso scritto, nessun pezzo misterioso; (2) limiti
voluti blindati; (3) questioni aperte tracciate; (4) **un sub-agent terzo si orienta** e apre i file
giusti. Il punto 4 è la prova vera.

---

## STATO DEL LAVORO (aggiornare a fine sessione)

> Legenda: ⬜ da fare · 🔶 mappata, manca verifica · ✅ blindata (verificata da sub-agent).

| Area | Stato | Note |
|------|-------|------|
| **Pagina Prenota** | ✅ | Blindata 04-06-26: mappata + flusso scritto (commit `e66c0ae`, `fad207f`), test mirati limiti testo verdi, verifica sub-agent reale **PASSA**. Lacune minori emerse dalla verifica rifinite in `PRENOTA_SKILL.md` e `PRENOTA_FORM_CONFIG_CONTEXT.md`. Cartella `docs/Prenota-Skill/`. |
| **Menu QR pubblico** | ⬜ | Candidato naturale prossimo (molto flusso utente cliente). File oggi: `per-ui-design-skill/PUBLIC_MENU_*`. |
| **Tab Menu admin (magazzino)** | ⬜ | `per-ui-design-skill/MENU_ADMIN_CONTEXT.md`. |
| **Admin shell + pagine** | ⬜ | `Dashboard-laterale-skill/`. Già ha context per-pagina, da riorganizzare col pattern. |
| **Database** | ⬜ | `Database-Skill/`. Valutare se il pattern senso/flusso calza (è infrastruttura, non UI). |
| **Card richiesta admin** | ⬜ | `per-ui-design-skill/BOOKING_REQUEST_CARD_CONTEXT.md` (area Prenotazioni admin). |

**Ordine consigliato:** ora passa a Menu QR (simile a Prenota, valida il pattern su una 2ª area) →
poi le aree admin. Una per sessione, senza fretta: file leggeri e verificati battono tanti file
fatti in fretta.

---

## Debiti aperti collegati

- **Propagazione template v.0 — HOOK ALLINEATI 04-06-26** (guard-prod + nudge v4 + senior + §11
  domande di chiusura + hooks.json, generici e testati). Resta sospesa la propagazione della
  **struttura context-knowledge** (cartella-area) finché la milestone non è matura (≥2-3 aree blindate).
- **[FOLLOW-UP SENIOR 04-06-26] Check segnaposto v.0** — verificare che OGNI `{{segnaposto}}` usato nei
  file del template `_skill-system-v0/` (es. `{{frase-richiesta-lezione}}`, `{{GLOSSARIO_VIVO}}`,
  `{{PROFILO_SCOLASTICO}}`, `{{es. scope creep…}}`) sia **documentato in `_skill-system-v0/MANUALE_AVVIO.md`**
  con cosa va messo al suo posto. Obiettivo: un nuovo progetto che adotta il v.0 sa compilare tutti i
  segnaposto senza indovinare. Check incrociato in una prossima sessione senior (non bloccante).
- **Sistema didattico di Matteo** — COSTRUITO 04-06-26 (qualità verificata). File in `_lavoro/Per matteo/`
  (privati): glossario, profilo, roadmap, materiale-didattico. Si alimenta a ogni chat senior.
