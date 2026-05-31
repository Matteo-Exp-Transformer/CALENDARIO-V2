# Guida — Repo nuovo pulito per andare pubblico

> File privato (in `_lavoro/`, gitignored). Cancellalo quando hai finito.
> **Obiettivo:** repo GitHub pubblico con SOLO il codice + 4 file doc; skill system e
> archivio restano in locale per gli agenti, mai online. Vecchio repo cancellato.

## Principio (cosa va dove)

- **Locale (tuo disco):** skill system, `docs/` interno, archivio, sessioni → restano, gli agenti li usano.
- **Online (GitHub pubblico):** solo `src/`, config, `public/`, `supabase/`, `tests/`, `e2e/`,
  e i 4 doc root: `README.md`, `CONTRIBUTING.md`, `ONBOARDING.md`, `CHANGELOG.md`.
- Il `.gitignore` (già aggiornato) esclude `docs/`, `pw-*.mjs`, `Report idea workflow…`.

## Cosa NON cambia (rassicurazione)

- I tuoi `.env.local` / `.env.local.test` sono sul disco, già gitignored: l'app gira uguale in locale.
- Supabase (DB, edge function, dati) vive su Supabase, non su GitHub: invariato.
- Le chiavi stanno nei `.env` e nel pannello Vercel, non nel repo.

---

## SEQUENZA SICURA (ordine obbligatorio)

### 1. Backup completo del vecchio repo (rete di sicurezza, PRIMA di tutto)

Clone "mirror" = copia di TUTTO (ogni commit, ogni branch), non solo i file attuali.
Da terminale, in una cartella FUORI dal progetto (es. Desktop):

```bash
cd ~/Desktop
git clone --mirror https://github.com/Matteo-Exp-Transformer/CALENDARIO-V2.git CALENDARIO-V2-backup.git
```

Ora `CALENDARIO-V2-backup.git` è il backup completo. Conservalo (anche zippato) finché non sei sicuro.
> In alternativa lo ZIP da GitHub salva solo i file attuali, NON la storia. Per un backup vero prima
> di cancellare, usa il clone mirror sopra.

### 2. Crea il repo nuovo su GitHub

- Su GitHub: New repository → nome nuovo (es. `calendario-app`) → **Public** → NON inizializzare
  con README (lo porti tu). Copia l'URL del nuovo repo.

### 3. Pusha SOLO lo stato attuale pulito, con un commit unico

Dalla cartella del progetto locale. Questo crea una storia nuova da zero, senza i commit vecchi
e senza `docs/` (lo esclude il `.gitignore` già aggiornato).

```bash
cd "c:/Users/matte.MIO/Documents/GitHub/CalendarBackup-v2"

# togli dal tracking i file che ora sono gitignored (NON li cancella dal disco)
git rm -r --cached docs "Report idea workflow per sviluppatore"
git add -A
git commit -m "chore: repo pubblico pulito (solo codice + doc professionale)"
```

A questo punto verifica che `docs/` NON sia più nei file tracciati:

```bash
git ls-files | grep -c "^docs/"   # deve stampare 0
git ls-files | grep -iE "readme|contributing|onboarding|changelog"  # i 4 doc root ci sono
```

Poi punta il repo nuovo e pusha solo questo branch come storia iniziale:

```bash
git remote add nuovo <URL-del-repo-nuovo>
git push nuovo HEAD:main
```

> Se vuoi DAVVERO un solo commit senza alcuna traccia dei vecchi (massima pulizia), in alternativa
> al blocco sopra si può creare un branch orfano (`git checkout --orphan`). Chiedimelo in una
> sessione dedicata e te lo faccio passo-passo: è più delicato, meglio con un agente accanto.

### 4. Ricollega Vercel al repo nuovo

- Vercel → progetto → Settings → Git → scollega il vecchio repo e collega il nuovo.
  (oppure crea un nuovo progetto Vercel che importa il repo nuovo).
- **Re-incolla le variabili d'ambiente** nel pannello Vercel (Settings → Environment Variables):
  sono separate dai tuoi `.env` locali, vanno reinserite a mano una volta.
- Fai un deploy di prova e verifica che l'app online funzioni (login admin, una pagina pubblica).

### 5. SOLO dopo che il nuovo funziona: cancella il vecchio

- GitHub → vecchio repo `CALENDARIO-V2` → Settings → in fondo → Delete this repository.
- Irreversibile: fallo solo con il backup (passo 1) al sicuro e il nuovo deploy verificato.

---

## Chi fa cosa

- **Tu:** backup, crea repo nuovo, push, ricollega Vercel + env, verifica, cancella vecchio.
- **Automatico/invariato:** app locale, Supabase, i tuoi `.env`.
- **Già fatto (locale):** `.gitignore` aggiornato; pulizia file orfani.
