import IdentificationForm from './IdentificationForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Formulaire officiel d'enregistrement des données d'identification
            </h1>
            <p className="text-gray-600">
            
            </p>
          </div>
          <IdentificationForm />
        </div>
      </div>
    </main>
  )
}