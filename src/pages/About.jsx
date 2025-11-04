export function About({ setCurrentPage }) {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-gray-100/80 dark:bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            À propos de TAXIA
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            La révolution du transport urbain en RDC
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Une solution de transport intelligente, conçue spécifiquement pour répondre aux défis uniques des villes congolaises
          </p>
        </div>

        {/* Image Hero */}
        <div className="mb-12 sm:mb-16 rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-2xl max-h-[400px] sm:max-h-[500px]">
          <img 
            src="/images/mokup_taxia.webp" 
            alt="TAXIA Transport" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* Notre Mission */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl group">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Notre Mission</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              TAXIA a pour mission de révolutionner le transport urbain en République Démocratique du Congo en offrant une solution simple, fiable et adaptée aux réalités locales. Notre technologie d'intelligence artificielle optimise chaque trajet en tenant compte de la circulation, des sens uniques et des zones praticables spécifiques à chaque ville.
            </p>
          </div>

          {/* Comment ça fonctionne */}
          <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 lg:p-10 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Comment ça fonctionne ?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold mb-1">Commandez votre course</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Indiquez votre point de départ et d'arrivée. Notre IA calcule instantanément le meilleur itinéraire et le prix.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold mb-1">Chauffeur assigné</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Un chauffeur vérifié est automatiquement assigné par notre système. Suivez son arrivée en temps réel.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold mb-1">Paiement cash</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Arrivez à destination et payez directement votre chauffeur en espèces. Simple et sans complications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vision avec image */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Notre Vision</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  <span className="font-semibold text-[#0a0a0a] dark:text-[#fafafa]">"Connecter chaque Congolais à sa destination"</span> - C'est notre promesse. Nous croyons que chaque citoyen mérite un accès simple, rapide et fiable au transport urbain.
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  TAXIA n'est pas qu'une application, c'est un mouvement vers une mobilité urbaine plus intelligente, plus sûre et plus accessible pour tous les Congolais.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-2xl">
              <img 
                src="/images/taxia.webp" 
                alt="Vision TAXIA" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Technologie IA avec image */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-2xl">
              <img 
                src="/images/image_header.webp" 
                alt="Technologie IA" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Intelligence Artificielle</h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                <span className="font-semibold text-[#0a0a0a] dark:text-[#fafafa]">Une IA qui comprend votre ville.</span> Notre technologie analyse en temps réel les conditions uniques de chaque ville congolaise pour vous offrir le meilleur trajet possible.
              </p>
              <ul className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0a0a0a] dark:text-[#fafafa] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Circulation en temps réel</strong> - Évitez les embouteillages avant même de partir</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0a0a0a] dark:text-[#fafafa] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Routes optimisées</strong> - Sens uniques et restrictions automatiquement pris en compte</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0a0a0a] dark:text-[#fafafa] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Zones praticables</strong> - Adaptation aux conditions locales et météo</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#0a0a0a] dark:text-[#fafafa] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Attribution intelligente</strong> - Le chauffeur le plus proche et le mieux noté</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sécurité avec image */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-2xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold">Sécurité & Confiance</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  <span className="font-semibold text-[#0a0a0a] dark:text-[#fafafa]">"Votre sécurité est notre priorité absolue."</span> Chaque chauffeur TAXIA passe par un processus de vérification rigoureux avant d'être activé sur la plateforme.
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Documents d'identité vérifiés, permis de conduire validé, véhicule inspecté - nous ne laissons rien au hasard. Le suivi GPS en temps réel garantit la transparence totale de chaque trajet.
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Avec TAXIA, vous ne montez pas dans n'importe quel véhicule. Vous voyagez en toute confiance avec des professionnels certifiés.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-2xl">
              <img 
                src="/images/image_header.webp" 
                alt="Sécurité TAXIA" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Impact Social */}
          <div className="bg-gradient-to-br from-[#0a0a0a] to-gray-900 dark:from-[#fafafa] dark:to-gray-100 text-[#fafafa] dark:text-[#0a0a0a] p-8 sm:p-12 rounded-3xl border border-gray-800 dark:border-gray-200 shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-[#fafafa] dark:bg-[#0a0a0a] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#0a0a0a] dark:text-[#fafafa]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Notre Impact Social</h2>
              <p className="text-base sm:text-lg text-gray-300 dark:text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold">"Plus qu'une application, un moteur économique."</span>
              </p>
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-600 leading-relaxed">
                TAXIA crée des opportunités d'emploi pour des centaines de chauffeurs congolais, facilite la mobilité urbaine pour des milliers de citoyens, et contribue au développement économique de nos villes. Ensemble, nous construisons l'avenir du transport en RDC.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-8">
            <button
              onClick={() => setCurrentPage('signup')}
              className="px-8 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
