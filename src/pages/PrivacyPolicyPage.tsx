import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export const PrivacyPolicyPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna alla home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Ai sensi del GDPR — Reg. UE 2016/679</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6 text-sm text-slate-600 leading-relaxed">

        <Section title="1. Titolare del trattamento">
          <p>
            Il titolare del trattamento è il ristorante che utilizza questo sistema di prenotazione.
            Per informazioni specifiche contattare direttamente il ristorante.
          </p>
        </Section>

        <Section title="2. Dati raccolti">
          <p>Raccogliamo i seguenti dati personali forniti volontariamente dall'utente in fase di prenotazione:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Nome e cognome</li>
            <li>Indirizzo email (facoltativo)</li>
            <li>Numero di telefono (facoltativo)</li>
            <li>Informazioni relative alla prenotazione (data, numero ospiti, preferenze alimentari)</li>
          </ul>
        </Section>

        <Section title="3. Finalità del trattamento">
          <p>I dati vengono trattati esclusivamente per:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Gestire e confermare la prenotazione</li>
            <li>Inviare comunicazioni relative alla prenotazione</li>
            <li>Adempiere ad obblighi di legge</li>
          </ul>
        </Section>

        <Section title="4. Base giuridica">
          <p>
            Il trattamento è basato sul consenso dell'interessato (art. 6 par. 1 lett. a GDPR)
            e sull'esecuzione di un contratto (art. 6 par. 1 lett. b GDPR).
          </p>
        </Section>

        <Section title="5. Conservazione dei dati">
          <p>
            I dati vengono conservati per il tempo strettamente necessario alle finalità
            descritte e, comunque, non oltre 24 mesi dalla data di prenotazione.
          </p>
        </Section>

        <Section title="6. Diritti dell'interessato">
          <p>
            Hai il diritto di accedere, rettificare, cancellare e portare i tuoi dati personali,
            nonché di opporti al trattamento. Puoi esercitare tali diritti contattando
            direttamente il ristorante.
          </p>
        </Section>

        <Section title="7. Cookie">
          <p>
            Utilizziamo esclusivamente cookie tecnici necessari al funzionamento del servizio.
            Non utilizziamo cookie di profilazione o di terze parti a fini pubblicitari.
          </p>
        </Section>

      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        Ultima modifica: Gennaio 2025
      </p>
    </div>
  </div>
)

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h2 className="text-base font-semibold text-slate-800 mb-2">{title}</h2>
    {children}
  </div>
)
