# Prompt — CRM: chiudere card campagna dopo Salva / Annulla (19-06-26)

> **Origine:** Matteo — tab CRM → Personalizza email → sezione **Email personalizzate** → apre una campagna → Salva / Annulla: la card editor resta aperta invece di tornare alla lista.

---

## Mappatura (cosa vuoi)

| Cosa vede il ristoratore | Dove | Storage |
|--------------------------|------|---------|
| Admin Pro → sidebar **CRM** → tab **Personalizza email** → blocco **Email personalizzate** → clic su una campagna (o «+ Nuova campagna») → card bianca con form e pulsanti **Salva** / **Annulla** | `EmailTemplatesTab.tsx` → `CampaignsManager.tsx` → **`CampaignEditor.tsx`** | Campagne in tabella Supabase `email_campaigns` |

**Flusso atteso:** dopo **Salva** (successo) o **Annulla**, la card editor **scompare** e si rivede la **lista** delle campagne (stesso comportamento già documentato per le CollapsibleCard «Email automatiche» che si chiudono dopo Salva).

**Causa probabile già in codice (da verificare):**
- **Nuova campagna** (`create`): in `CampaignEditor.handleSave` → `onSuccess` chiama già `onClose()` ✅
- **Campagna esistente** (`update`): in `onSuccess` manca `onClose()` — toast ok ma `CampaignsManager` resta con `selected !== null` ❌
- **Annulla:** oggi fa `onClick={onClose}` diretto; allineare al guard dirty se ci sono modifiche non salvate (stesso tab CRM, pattern `EmailTemplatesTab.makeToggle` + `confirmNavigation`).

**Doc area:** `docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md` §1 (Email personalizzate), §7 (guard dirty).

---

## Prompt esecutore

```
Profilo: Esecuzione
Modalità: standard
Skill da leggere: docs/Admin-Skill/ADMIN_SKILL.md → docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md (§1 Email personalizzate, §7 guard dirty)
Non caricare: skill Prenota, Menu QR, DB (nessuna migrazione)

Output attesi (ESATTAMENTE questi, niente extra senza chiedere Sì/No):
  1. Fix chiusura card editor campagna email personalizzata in CRM dopo Salva e Annulla.
  2. Test Vitest mirato (estendere suite esistente in src/features/booking/components/crm/__tests__/ se già presente per CampaignEditor).
  3. Allineamento docs/Admin-Skill/contesto/ADMIN_CRM_CONTEXT.md §1 o §7 se il comportamento documentato non menziona esplicitamente «editor campagna si chiude dopo Salva/Annulla» (§7.2 chiusura sessione).
  niente output in più senza chiedere Sì/No prima.

Obiettivo (bug UX):
In Admin → CRM → tab «Personalizza email» → sezione «Email personalizzate», quando Mario apre una campagna (card editor bianca con Salva / Annulla in fondo), dopo:
  • **Salva** con successo (campagna nuova O esistente) → tornare alla lista campagne (card chiusa).
  • **Annulla** → tornare alla lista; se il form è dirty, passare dal guard `UnsavedChangesContext` (modale Salva / Annulla / Esci) come per le CollapsibleCard «Email automatiche» nello stesso tab — poi chiudere solo se l’utente conferma (Annulla/Esci) o dopo Salva riuscito dal guard.

Come (indicazioni tecniche):
  • File principali: CampaignEditor.tsx, CampaignsManager.tsx (onClose = () => setSelected(null)).
  • Bug noto: ramo update di handleSave — aggiungere onClose() in onSuccess (oggi c’è solo su create).
  • Annulla: non chiudere in silenzio bypassando il guard se dirty; estrarre requestClose() con confirmNavigation().then(ok => ok && onClose()) quando dirty, altrimenti onClose() immediato. handleDiscard già registrato al guard — riusarlo.
  • Non rompere: registrazione guard (guardId campaign-editor-*), picker destinatari, elimina campagna (onClose già su delete success).
  • Pattern di riferimento nello stesso file tab: EmailTemplatesTab.tsx (makeToggle + onSaved su EmailTemplateEditor).

Vincoli:
  • Solo branch env/test; nessuna write PROD (rwuxgvld).
  • Nessuna migrazione DB.
  • npm run validate verde prima di chiudere.

Superfici da verificare manualmente (375 / 1280):
  • Apri campagna esistente → modifica oggetto → Salva → lista visibile, card chiusa.
  • Apri campagna → modifica → Annulla con dirty → modale guard → Annulla → lista, modifiche scartate.
  • Nuova campagna → compila → Crea campagna → lista (regressione: deve restare ok).

Chiusura (APP_CONTEXT §7): report standard + §7.2 ADMIN_CRM_CONTEXT se tocchi comportamento documentato.
```

---

## Revisione

| Tipo | Chi |
|------|-----|
| **Rapida** | prepara-prompt / Matteo — fix circoscritto 1–2 file, comportamento visibile subito |

Checklist controverifica per Matteo:
1. CRM → Personalizza email → Email personalizzate → apri una campagna già salvata.
2. Cambia l’oggetto → **Salva** → devi rivedere la lista, non il form aperto.
3. Riapri la campagna → cambia qualcosa → **Annulla** → se chiede conferma, scegli Annulla → lista.
4. **+ Nuova campagna** → compila → **Crea campagna** → lista (come prima).

---

*Collegato al batch UX 19-06-26; fix indipendente dal file Mappa-fix-ux-batch-19-06-26.md.*
