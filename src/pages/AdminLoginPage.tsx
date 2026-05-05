import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAdminAuth } from '@/features/booking/hooks/useAdminAuth'
import { Input, Button, Label } from '@/components/ui'
import { Building2, ArrowRight, Lock } from 'lucide-react'

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubscriptionBanner, setShowSubscriptionBanner] = useState(false)

  const { login } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const revokedReason = sessionStorage.getItem('auth_revoked_reason')
    if (revokedReason === 'subscription_inactive') {
      setShowSubscriptionBanner(true)
      sessionStorage.removeItem('auth_revoked_reason')
    }
  }, [])

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = 'Email obbligatoria'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email non valida'
    }
    if (!password.trim()) {
      newErrors.password = 'Password obbligatoria'
    } else if (password.length < 6) {
      newErrors.password = 'Password troppo corta (min. 6 caratteri)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Accesso effettuato!')
        navigate('/admin')
      } else {
        toast.error(result.error || 'Credenziali non valide')
      }
    } catch {
      toast.error('Errore imprevisto. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Header strip */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-xl mb-4">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Booking SaaS</h1>
            <p className="text-primary-200 text-sm mt-1">Accedi al pannello admin</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {showSubscriptionBanner && (
              <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Abbonamento non attivo. Contatta il supporto.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                  placeholder="admin@tuoristorante.it"
                  disabled={isSubmitting}
                  className={errors.email ? 'border-red-400 focus:ring-red-400' : ''}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className={errors.password ? 'border-red-400 focus:ring-red-400' : ''}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting}
                className="mt-2 group"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Accesso in corso...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Accedi
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Area riservata — accesso protetto</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Hai dimenticato la password? Contatta l'amministratore del sistema.
        </p>
      </div>
    </div>
  )
}
