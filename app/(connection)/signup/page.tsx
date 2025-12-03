'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      // 1. Création du compte dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        }
      })

      if (authError) {
        setMessage(
          authError.message.includes('already registered')
            ? 'Un compte existe déjà avec cet email. Veuillez vous connecter.'
            : authError.message
        )
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setMessage('Erreur lors de la création du compte utilisateur.')
        setIsLoading(false)
        return
      }

      console.log('✅ Compte auth créé:', authData.user.id)

      // 2. Création du profil dans la table retraites
      const { error: profileError } = await supabase
        .from('retraites')
        .insert({
          user_id: authData.user.id,
          nom: fullName.split(' ')[0] || '',
          prenom: fullName.split(' ').slice(1).join(' ') || '',
          travail: 'Non spécifié',
          email: email,
          numero_telephone: '',
          id_valide: '00000000-0000-0000-0000-000000000000' // Valeur par défaut
        })

      if (profileError) {
        console.error('❌ Erreur création profil:', profileError)
        // Continue même si erreur profil
      } else {
        console.log('✅ Profil créé dans retraites')
      }

      // 3. Création d'un historique initial
      const { error: historiqueError } = await supabase
        .from('historique')
        .insert({
          user_id: authData.user.id,
          action: 'Compte créé',
          montant: 0,
          date_action: new Date().toISOString()
        })

      if (historiqueError) {
        console.error('❌ Erreur création historique:', historiqueError)
      }

      // 4. Connexion automatique
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        console.error('❌ Erreur connexion auto:', signInError)
        setMessage('Compte créé. Veuillez vous connecter manuellement.')
        router.push('/login')
        return
      }

      // 5. Redirection vers historique
      console.log('✅ Redirection vers /historique')
      router.push('/historique')

    } catch (error) {
      console.error('💥 Erreur générale:', error)
      setMessage('Une erreur est survenue lors de la création du compte.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Création de compte</h1>
          <p className="text-gray-600">Créez votre compte pour accéder à votre historique</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Nom complet
              </label>
              <input
                type="text"
                placeholder="Ex: Dupont Jean"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500">Votre nom et prénom séparés par un espace</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" /> Email
              </label>
              <input
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" /> Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Le mot de passe doit contenir au moins 6 caractères</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 rounded-lg text-sm bg-red-50 border border-red-200 text-red-700">
              {message}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Se connecter
              </a>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 text-center">
              Après création, vous serez redirigé automatiquement vers votre historique
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Service de retraite. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}