'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DOMPurify from 'dompurify'
import { supabase } from '@/lib/supabaseClient'
import { IdCard, Calendar, ArrowRight, ShieldCheck, Copy, Check, AlertCircle } from 'lucide-react'

// Données mockées
const MOCK_DATA = {
  id_gouvernementale: "55555",
  id_cip: "55555",
  date_naissance: "22/11/1975"
}

export default function VerifyIdPage() {
  const router = useRouter()
  const [idGouv, setIdGouv] = useState(MOCK_DATA.id_gouvernementale)
  const [idCip, setIdCip] = useState(MOCK_DATA.id_cip)
  const [dateNaissance, setDateNaissance] = useState(MOCK_DATA.date_naissance)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [validData, setValidData] = useState<any>(null)

  const s = (v: string) => DOMPurify.sanitize(v)

  // Fonctions utilitaires
  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const convertToYYYYMMDD = (dateStr: string) => {
    if (!dateStr) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return dateStr
  }

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }
    return dateStr
  }

  const fillMockData = () => {
    setIdGouv(MOCK_DATA.id_gouvernementale)
    setIdCip(MOCK_DATA.id_cip)
    setDateNaissance(MOCK_DATA.date_naissance)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setValidData(null)

    const dateConvertie = convertToYYYYMMDD(dateNaissance)
    console.log('🔍 Vérification des identifiants...')

    try {
      // 1️⃣ Vérifier dans ids_valides
      const { data: valid, error: checkError } = await supabase
        .from('ids_valides')
        .select('id, id_gouvernementale, id_cip, date_naissance')
        .eq('id_gouvernementale', s(idGouv))
        .eq('id_cip', s(idCip))
        .single()

      console.log('📊 Résultat:', { valid, checkError })

      if (checkError || !valid) {
        setMessageType('error')
        setMessage('❌ Vos identifiants gouvernementaux ne sont pas valides.')
        setIsLoading(false)
        return
      }

      // 2️⃣ Vérifier la date de naissance
      if (valid.date_naissance !== dateConvertie) {
        setMessageType('error')
        setMessage(`❌ La date de naissance ne correspond pas.\n\nDate attendue: ${formatDateForDisplay(valid.date_naissance)}\nDate fournie: ${dateNaissance}`)
        setIsLoading(false)
        return
      }

      // 3️⃣ Vérifier si compte existe déjà
      const { data: existingRetraite } = await supabase
        .from('retraites')
        .select('id, email')
        .eq('id_valide', valid.id)
        .maybeSingle()

      console.log('📊 Compte existant:', existingRetraite)

      // 4️⃣ Sauvegarder les données valides
      const verificationData = {
        ...valid,
        date_naissance_input: dateNaissance,
        compte_existant: !!existingRetraite,
        existing_email: existingRetraite?.email
      }

      setValidData(verificationData)
      
      // 5️⃣ Stocker en session pour la page suivante
      sessionStorage.setItem('verification_data', JSON.stringify(verificationData))
      
      setMessageType('success')
      setMessage(`✅ Identifiants vérifiés avec succès !\n\n${existingRetraite ? 'Un compte existe déjà avec cet email.' : 'Vous pouvez maintenant créer votre compte.'}`)

      // 6️⃣ Rediriger vers la page d'inscription après 2 secondes
      setTimeout(() => {
        router.push(`/login?id_valide=${valid.id}`)
      }, 2000)

    } catch (error) {
      console.error('💥 Erreur:', error)
      setMessageType('error')
      setMessage('❌ Erreur serveur. Veuillez réessayer.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8" />
            <h1 className="text-2xl font-bold">PensionPay - Vérification</h1>
          </div>
          <p className="text-center text-blue-100">
            Étape 1/2 : Vérifiez vos identifiants gouvernementaux
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Bannière test */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Données de test disponibles</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={fillMockData}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                  >
                    📋 Remplir tout
                  </button>
                  <button
                    onClick={() => copyToClipboard(MOCK_DATA.id_gouvernementale, 'id_gouv')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'id_gouv' ? <Check size={12} /> : <Copy size={12} />}
                    ID Gouvernementale
                  </button>
                  <button
                    onClick={() => copyToClipboard(MOCK_DATA.id_cip, 'id_cip')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors flex items-center gap-1"
                  >
                    {copiedField === 'id_cip' ? <Check size={12} /> : <Copy size={12} />}
                    ID CIP
                  </button>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg text-sm font-medium ${messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              <div className="whitespace-pre-line">{message}</div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-blue-600" /> 
                ID Gouvernementale *
              </label>
              <input 
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: GVT-XXXXX"
                value={idGouv} 
                onChange={e => setIdGouv(e.target.value)} 
                required 
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-blue-600" /> 
                ID CIP *
              </label>
              <input 
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: CIP-XXXXX"
                value={idCip} 
                onChange={e => setIdCip(e.target.value)} 
                required 
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> 
                Date de naissance *
                <span className="text-xs text-gray-500 font-normal">(JJ/MM/AAAA)</span>
              </label>
              <input 
                type="text"
                pattern="\d{2}/\d{2}/\d{4}"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="JJ/MM/AAAA (ex: 22/11/1975)"
                value={dateNaissance}
                onChange={e => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2);
                  if (value.length > 5) value = value.substring(0, 5) + '/' + value.substring(5, 9);
                  setDateNaissance(value);
                }}
                required 
              />
              <p className="text-xs text-gray-500">
                Doit correspondre exactement à vos identifiants gouvernementaux
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2 text-sm">Processus de vérification :</h3>
              <ol className="text-xs text-blue-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Vérification des identifiants dans la base gouvernementale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>Validation de la date de naissance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Vérification si compte existe déjà</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>Redirection vers la création de compte</span>
                </li>
              </ol>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <span>Vérifier mes identifiants</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-blue-100">
            <p className="text-xs text-gray-500">
              Service officiel du Gouvernement du Bénin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}