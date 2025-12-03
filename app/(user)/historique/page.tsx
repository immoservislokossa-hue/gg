'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { 
  LogOut, 
  UserCircle, 
  Mail, 
  Briefcase, 
  Phone, 
  Calendar,
  Wallet,
  TrendingUp,
  Banknote,
  ChevronRight
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PensionPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [paiements, setPaiements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // Récupérer infos de auth.users
      const nomComplet = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur'
      const [nom, prenom] = nomComplet.split(' ')

      // Récupérer infos de retraites
      const { data: profilRetraite } = await supabase
        .from('retraites')
        .select('travail, numero_telephone, created_at')
        .eq('user_id', user.id)
        .single()

      setUserInfo({
        nom,
        prenom,
        email: user.email,
        ...profilRetraite
      })

      // Charger paiements
      const { data: paiementsData } = await supabase
        .from('historique')
        .select('*')
        .eq('user_id', user.id)
        .gte('montant', 0)
        .order('date_action', { ascending: false })

      setPaiements(paiementsData || [])

    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSalutation = () => {
    const heure = new Date().getHours()
    if (heure < 12) return 'Bonjour'
    if (heure < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }

  const getTotalPensions = () => {
    return paiements.reduce((total, p) => total + (p.montant || 0), 0)
  }

  const deconnexion = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header élégant */}
      <div className="relative bg-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <Wallet className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold">Portail Pension</h1>
              </div>
              <p className="text-blue-100">
                {getSalutation()}, <span className="font-semibold">{userInfo?.prenom || userInfo?.nom}</span> 👋
              </p>
            </div>
            <button
              onClick={deconnexion}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 -mt-6">
        {/* Carte profil */}
        {userInfo && (
          <div className="bg-white rounded-2xl shadow-lg border mb-8 transform transition-all hover:shadow-xl">
            <div className="p-6">
              

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 truncate">{userInfo.email}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Téléphone</span>
                  </div>
                  <p className="text-gray-900">{userInfo.numero_telephone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Carte total pensions */}
        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-xl mb-8 transform hover:scale-[1.02] transition-transform">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-100 mb-2">VOTRE CAPITAL RETRAITE</p>
              <p className="text-4xl font-bold mb-1">{getTotalPensions().toFixed(2)} F CFA</p>
              <div className="flex items-center gap-2 text-green-100 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{paiements.length} versement{paiements.length > 1 ? 's' : ''} reçu{paiements.length > 1 ? 's' : ''}</span>
              </div>
            </div>
             
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="px-6 py-5 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Historique des versements</h3>
                <p className="text-gray-600 text-sm">Pensions reçues de l'État</p>
              </div>
              
            </div>
          </div>

          {paiements.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Aucun versement</h4>
              <p className="text-gray-600">Les pensions apparaîtront ici</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {paiements.map((paiement, index) => (
                <div 
                  key={paiement.id} 
                  className="px-6 py-5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        index === 0 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600'
                      }`}>
                      
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{paiement.action}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(paiement.date_action).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          {index === 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              Dernier
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-green-600">
                        +{paiement.montant?.toFixed(2)} €
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="text-center">
            <p className="text-gray-700">
              <span className="font-semibold">Service sécurisé</span> • 
              Paiements garantis par l'État • 
              Contact: 0800 123 456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}