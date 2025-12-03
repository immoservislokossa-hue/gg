import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Lock, 
  Smartphone, 
  Bell, 
  CreditCard, 
  BarChart3, 
  Users, 
  Building, 
  CheckCircle, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  Calendar,
  FileText,
  HelpCircle,
  Banknote,
  Clock,
  Shield,
  MessageCircle
} from "lucide-react";
import Header from "./components/layout/Header";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Service Officiel du Gouvernement Béninois</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Pension<span className="text-blue-200">Pay</span>
            <span className="block text-2xl md:text-3xl font-normal text-blue-100 mt-4">
              Votre pension, payée avec simplicité et sécurité
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            PensionPay est la plateforme gouvernementale qui garantit le versement rapide et sécurisé 
            de votre pension de retraite. Plus besoin de faire la queue : recevez vos paiements 
            directement sur votre compte, avec un suivi en temps réel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/signup"
              className="group px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              <Shield className="w-5 h-5" />
              <span>Accéder à mon espace retraité</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#help"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center gap-3"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Besoin d'aide ?</span>
            </a>
          </div>
          
          {/* Avantages pour retraités */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-white/20">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Clock className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <div className="text-lg font-bold text-white mb-1">Paiement ponctuel</div>
              <div className="text-sm text-blue-200">À date fixe chaque mois</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <ShieldCheck className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <div className="text-lg font-bold text-white mb-1">100% Sécurisé</div>
              <div className="text-sm text-blue-200">Protection gouvernementale</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Bell className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <div className="text-lg font-bold text-white mb-1">Notifications</div>
              <div className="text-sm text-blue-200">SMS à chaque versement</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <MessageCircle className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <div className="text-lg font-bold text-white mb-1">Support dédié</div>
              <div className="text-sm text-blue-200">Assistance téléphonique</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche pour vous */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comment <span className="text-blue-600">PensionPay</span> fonctionne pour vous ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une démarche simple et sécurisée pour recevoir votre pension sans souci
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: <FileText className="w-8 h-8" />,
                title: "Inscription simple",
                description: "Créez votre compte en ligne ou rendez-vous dans un centre agréé avec vos documents. Notre équipe vous accompagne dans la démarche."
              },
              {
                step: "2",
                icon: <Smartphone className="w-8 h-8" />,
                title: "Accès facile",
                description: "Connectez-vous avec votre identifiant sécurisé. Vous pouvez accéder à votre espace depuis votre téléphone ou ordinateur."
              },
              {
                step: "3",
                icon: <Banknote className="w-8 h-8" />,
                title: "Suivi et paiement",
                description: "Consultez votre solde, l'historique des versements et recevez des alertes à chaque paiement effectué."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="relative group p-8 bg-white rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-blue-50 text-blue-600 mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vos avantages */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" />
              <span>Conçu pour les retraités</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Les <span className="text-blue-600">avantages</span> de PensionPay
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Colonne gauche */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Gain de temps</h3>
                    <p className="text-gray-600">
                      Fini les longues attentes aux guichets. Votre pension est versée automatiquement chaque mois.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Sécurité maximale</h3>
                    <p className="text-gray-600">
                      Service gouvernemental garanti. Vos données et votre argent sont protégés par les plus hauts standards de sécurité.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Colonne droite */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Informé en temps réel</h3>
                    <p className="text-gray-600">
                      Recevez un SMS ou un email dès que votre pension est versée. Consultez votre historique à tout moment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Support dédié</h3>
                    <p className="text-gray-600">
                      Une équipe d'assistance est disponible pour vous aider par téléphone ou dans nos centres d'accueil.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Espace Personnel */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Votre <span className="text-blue-600">espace personnel</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre pension en un seul endroit
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Fonctionnalités principales</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Consultation du solde :</strong> Vérifiez le montant de votre pension disponible</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Historique complet :</strong> Tous vos versements depuis le début</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Documents officiels :</strong> Téléchargez vos attestations et reçus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Alertes personnalisées :</strong> Choisissez comment être informé</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Accès facile</h4>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span>Depuis votre téléphone mobile</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Sur le site internet PensionPay</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Building className="w-5 h-5 text-blue-600" />
                    <span>Dans nos centres d'accueil agréés</span>
                  </div>
                </div>
                
                <a
                  href="#connect"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Accéder à mon compte
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Contact */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h3>
              <div className="space-y-4">
                {[
                  {
                    q: "Comment créer mon compte PensionPay ?",
                    a: "Rendez-vous sur notre site ou dans un centre agréé avec votre carte d'identité et votre numéro de retraité."
                  },
                  {
                    q: "Quand vais-je recevoir ma pension ?",
                    a: "Les versements sont effectués systématiquement le dernier jour ouvrable du mois."
                  },
                  {
                    q: "Comment signaler un problème de paiement ?",
                    a: "Contactez notre service assistance au 8000 00 00 (gratuit) ou rendez-vous dans un centre d'accueil."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Besoin d'aide ? Contactez-nous</h3>
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Assistance téléphonique</div>
                      <div className="text-gray-600">8000 00 00 (appel gratuit)</div>
                      <div className="text-sm text-blue-500">Lundi au vendredi, 8h-18h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <div className="text-gray-600">assistance@pensionpay.bj</div>
                      <div className="text-sm text-blue-500">Réponse sous 24h ouvrées</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-semibold text-gray-900">Centres d'accueil</div>
                      <div className="text-gray-600">Dans toutes les préfectures du Bénin</div>
                      <div className="text-sm text-blue-500">Trouvez le centre le plus proche de chez vous</div>
                    </div>
                  </div>
                  
                  <a
                    href="/centers"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Trouver un centre près de chez moi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-blue-300" />
              <h3 className="text-2xl font-bold">PensionPay</h3>
            </div>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Service officiel du Gouvernement Béninois pour le paiement sécurisé des pensions de retraite.
              Votre sécurité, notre priorité.
            </p>
          </div>
          
          <div className="pt-8 border-t border-blue-700 text-center text-sm text-blue-300">
            <p>© 2025 PensionPay - République du Bénin</p>
            <p className="mt-2">Service gratuit pour tous les retraités béninois</p>
          </div>
        </div>
      </footer>
    </main>
  );
}