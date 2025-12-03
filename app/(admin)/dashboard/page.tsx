'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [gouv, setGouv] = useState('')
  const [cip, setCip] = useState('')
  const [date, setDate] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [ids, setIds] = useState<any[]>([])
  const [adminInfo, setAdminInfo] = useState<any>(null)

  useEffect(() => {
    checkAdmin()
    loadIds()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }
    
    // Vérifier si l'utilisateur est admin
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error || !admin) {
      // Si pas admin, rediriger vers historique
      window.location.href = '/historique'
      return
    }
    
    setAdminInfo(admin)
  }

  const loadIds = async () => {
    const { data, error } = await supabase
      .from('ids_valides')
      .select(`
        *,
        admins (
          nom,
          prenom
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erreur chargement IDs:', error)
      return
    }
    
    setIds(data || [])
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    // Validation
    if (!gouv.trim() || !cip.trim() || !date) {
      setMsg('❌ Tous les champs sont requis')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('ids_valides')
        .insert({ 
          id_gouvernementale: gouv.trim().toUpperCase(), 
          id_cip: cip.trim().toUpperCase(), 
          date_naissance: date,
          verified: true,
          added_by: adminInfo?.id
        })
        .select()

      if (error) {
        // Vérifier le type d'erreur
        if (error.code === '23505') {
          if (error.message.includes('id_gouvernementale')) {
            setMsg('❌ Cet ID gouvernementale existe déjà')
          } else if (error.message.includes('id_cip')) {
            setMsg('❌ Cet ID CIP existe déjà')
          } else {
            setMsg(`❌ Erreur d'unicité: ${error.message}`)
          }
        } else {
          setMsg(`❌ Erreur: ${error.message}`)
        }
        setLoading(false)
        return
      }

      // Succès
      setMsg('✅ ID ajouté avec succès !')
      setGouv('')
      setCip('')
      setDate('')
      loadIds() // Recharger la liste

    } catch (error: any) {
      setMsg(`❌ Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const toggleVerification = async (id: string, currentVerified: boolean) => {
    const { error } = await supabase
      .from('ids_valides')
      .update({ verified: !currentVerified })
      .eq('id', id)

    if (!error) {
      loadIds()
    }
  }

  const deleteId = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet ID ?')) return
    
    const { error } = await supabase
      .from('ids_valides')
      .delete()
      .eq('id', id)

    if (!error) {
      loadIds()
    }
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Administration IDs</h1>
              <p className="text-gray-600 text-sm">
                Admin: {adminInfo?.prenom} {adminInfo?.nom}
              </p>
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {ids.length} ID{ids.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white p-4 rounded-lg border mb-6">
          <h2 className="font-semibold mb-4">Ajouter un nouvel ID</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  value={gouv}
                  onChange={e => setGouv(e.target.value)}
                  placeholder="ID Gouvernementale"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <input
                  value={cip}
                  onChange={e => setCip(e.target.value)}
                  placeholder="ID CIP"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white p-2 rounded font-medium disabled:opacity-50 hover:bg-blue-700"
            >
              {loading ? 'Ajout...' : 'Ajouter l\'ID'}
            </button>
            
            {msg && (
              <div className={`p-3 rounded ${msg.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {msg}
              </div>
            )}
          </form>
        </div>

        {/* Liste des IDs */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 border-b bg-blue-50">
            <h2 className="font-semibold">Liste des IDs</h2>
          </div>
          
          {ids.length === 0 ? (
            <div className="p-8 text-center text-blue-500">
              Aucun ID enregistré
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-3 text-left">Gouv.</th>
                    <th className="p-3 text-left">CIP</th>
                    <th className="p-3 text-left">Naissance</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Ajouté par</th>
                    <th className="p-3 text-left">Créé le</th>
                        </tr>
                </thead>
                <tbody>
                  {ids.map((item) => (
                    <tr key={item.id} className="border-t bg-blue-500 hover:bg-gray-50">
                      <td className="p-3">{item.id_gouvernementale}</td>
                      <td className="p-3">{item.id_cip}</td>
                      <td className="p-3">
                        {new Date(item.date_naissance).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleVerification(item.id, item.verified)}
                          className={`px-2 py-1 rounded text-xs ${item.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {item.verified ? '✓ Vérifié' : 'En attente'}
                        </button>
                      </td>
                      <td className="p-3 text-sm">
                        {item.admins ? `${item.admins.prenom || ''} ${item.admins.nom || ''}`.trim() : '-'}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bouton rafraîchir */}
        
      </div>
    </div>
  )
}