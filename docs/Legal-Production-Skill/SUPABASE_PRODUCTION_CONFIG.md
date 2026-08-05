# Supabase Production Config — context skill

## Settings di compliance da attivare manualmente

Riferimento sempre `docs/_lavoro/Per matteo/Cose-da-fare-per-produzione.md` per stato corrente.

### Attivati ✅
- Leaked password protection (Auth → Policies)
- MFA owner account
- Service role key rotation

### Da attivare 🟡
- PITR (Point-in-Time Recovery) — richiede piano Pro
- SSL Enforcement DB
- Confirm email Auth
- Network Restrictions (whitelist IP per dashboard)

---

## Verifiche periodiche

### Mensili
- Login dashboard Supabase → Security → controllare alert
- Verificare lista sub-processor Supabase non sia cambiata
- Controllare advisor security: `get_advisors type=security` (skill DB)

### Trimestrali
- Rotare service_role key
- Audit accessi: chi ha accesso al progetto Supabase?
- Review utenti MFA attivo

### Annuali
- Rifirma DPA se Supabase ha aggiornato versione
- Test runbook data breach
- Review Privacy Policy completa
- Backup PDF Privacy Policy corrente (per archivio "cosa diceva al X")

---

## Comandi CLI utili (sintassi corretta verificata)

```bash
# SSL Enforcement
supabase ssl-enforcement get --project-ref <ref> --experimental
supabase ssl-enforcement update --enable-db-ssl-enforcement --project-ref <ref> --experimental

# Backup
supabase db dump --project-ref <ref> --file backup-$(date +%F).sql

# Lista region (verifica region prod)
supabase projects list

# Network restrictions
supabase network-restrictions get --project-ref <ref> --experimental
```

⚠️ I comandi CLI Supabase cambiano spesso. Verificare con `supabase --help` prima di eseguire.

---

## Region check (importante per Privacy Policy)

Region prod corrente: **DA VERIFICARE** in dashboard → Settings → General.

Se region USA → impatti su Privacy Policy:
- Sezione trasferimenti extra-UE obbligatoria
- Citare SCC + DPF (Data Privacy Framework — verificare status attuale online)
- Citare DPA Supabase

Se region EU → semplificato ma comunque dichiarare per trasparenza.

---

## Email provider — integrazione Brevo attiva

L'Edge `send-email` usa Brevo per email transazionali sulle prenotazioni e per campagne marketing.
Le campagne richiedono consenso marketing e la funzione blocca l'invio se non riesce a generare il
link di disiscrizione.

Decisioni/verifiche ancora aperte con l'avvocato:
- DPA Brevo: acquisire, verificare e conservare la versione applicabile all'account
- Localizzazione dei dati, sub-responsabili e garanzie per eventuali trasferimenti extra-UE/SEE
- Allineare e approvare i documenti indicati sotto:
  - `docs/legal/sub-processors.md`
  - Privacy Policy §6
  - DPA verso clienti §6
  - `DATA_INVENTORY_CONTEXT.md`
