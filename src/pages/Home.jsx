export function Home({ setCurrentPage }) {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:pt-32 sm:pb-20 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/80 dark:bg-white/10 rounded-full text-sm font-medium backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Transport intelligent en RDC
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Déplacez-vous plus vite et malin en RDC
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                TAXIA révolutionne le transport urbain avec une technologie IA qui calcule l'itinéraire optimal selon la circulation, les sens uniques et les zones praticables de votre ville.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-2xl font-semibold text-base sm:text-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Commander une course
                </button>
                <button 
                  onClick={() => setCurrentPage('about')}
                  className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-[#0a0a0a]/20 dark:border-white/20 rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all duration-200"
                >
                  En savoir plus
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/10 shadow-2xl">
                <img 
                  src="/images/image_header.jpg" 
                  alt="TAXIA Transport" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:py-20 sm:px-6 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Pourquoi choisir TAXIA ?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 px-4">Une expérience de transport repensée pour la RDC</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">IA Intelligente</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Notre IA calcule l'itinéraire le plus rapide en tenant compte de la circulation, des sens uniques et des zones praticables en temps réel.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Paiement Cash Simple</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Payez directement votre chauffeur en espèces à la fin de votre course. Pas de complications, juste de la simplicité.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Chauffeurs Vérifiés</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Tous nos chauffeurs sont soigneusement vérifiés et validés par notre administration pour votre sécurité.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Suivi en Temps Réel</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Suivez votre chauffeur en temps réel sur la carte et recevez des notifications à chaque étape de votre course.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Application Mobile</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Interface responsive optimisée pour tous les smartphones, même les appareils bas et moyens de gamme.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-7 h-7 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Système de Notation</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Évaluez votre expérience et aidez-nous à maintenir un service de qualité pour tous les utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 px-4 sm:py-20 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Comment ça marche ?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 px-4">Trois étapes simples pour vous déplacer</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Indiquez votre destination</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Entrez votre point de départ et d'arrivée. Notre IA calcule instantanément le meilleur itinéraire et le prix.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Confirmez votre course</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Un chauffeur vérifié est automatiquement assigné. Suivez son arrivée en temps réel sur la carte.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 shadow-xl">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Profitez du trajet</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Arrivez à destination en toute sécurité et payez en cash. Simple, rapide et efficace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 sm:py-20 sm:px-6 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Prêt à transformer vos déplacements ?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-gray-400 dark:text-gray-600 px-4">
            Rejoignez des milliers d'utilisateurs qui font confiance à TAXIA pour leurs déplacements quotidiens en RDC.
          </p>
          <div className="flex justify-center">
            <button className="px-8 py-4 sm:px-10 sm:py-5 bg-[#fafafa] dark:bg-[#0a0a0a] text-[#0a0a0a] dark:text-[#fafafa] rounded-2xl font-semibold text-lg sm:text-xl hover:scale-105 transition-all duration-200 shadow-xl">
              Commencer maintenant
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
