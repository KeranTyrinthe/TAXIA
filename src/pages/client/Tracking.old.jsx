import { useState } from 'react';

export function ClientTracking({ setCurrentPage }) {
  const [rideStatus, setRideStatus] = useState('searching'); // searching, assigned, in-progress, completed
  const [driver, setDriver] = useState(null); // TODO: Récupérer depuis le backend

  const completeRide = () => {
    setRideStatus('completed');
  };

  const cancelRide = () => {
    if (confirm('Voulez-vous vraiment annuler cette course ?')) {
      setCurrentPage('client-dashboard');
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Status Header */}
        <div className="mb-6">
          {rideStatus === 'searching' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="animate-spin">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </div>
              <div>
                <div className="font-semibold text-yellow-900 dark:text-yellow-100">Recherche d'un chauffeur...</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Nous cherchons le meilleur chauffeur pour vous</div>
              </div>
            </div>
          )}

          {rideStatus === 'assigned' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <div className="font-semibold text-blue-900 dark:text-blue-100">Chauffeur trouvé !</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Votre chauffeur arrive dans {driver.eta}</div>
              </div>
            </div>
          )}

          {rideStatus === 'in-progress' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              <div>
                <div className="font-semibold text-green-900 dark:text-green-100">Course en cours</div>
                <div className="text-sm text-green-700 dark:text-green-300">Arrivée estimée dans 20 min</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Carte */}
          <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl overflow-hidden h-[400px] lg:h-[600px]">
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">Suivi en temps réel</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Position du chauffeur et itinéraire</p>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            {/* Informations chauffeur */}
              {(rideStatus === 'assigned' || rideStatus === 'in-progress') && driver && (
              <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                <h3 className="font-bold text-lg mb-4">Votre chauffeur</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{driver?.name || 'Chargement...'}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{driver?.vehicle || ''}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-sm font-semibold">{driver?.rating || '0'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Plaque</span>
                    <span className="font-semibold">{driver?.plate || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                    <span className="font-semibold">{driver?.distance || '-'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Arrivée estimée</span>
                    <span className="font-semibold">{driver?.eta || '-'}</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  Appeler le chauffeur
                </button>
              </div>
            )}

            {/* Détails du trajet */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-4">Détails du trajet</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-300 dark:bg-white/20"></div>
                    <svg className="w-5 h-5 text-[#0a0a0a] dark:text-[#fafafa]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 space-y-12">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Départ</div>
                      <div className="font-semibold">Avenue Tombalbaye, Gombe</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Arrivée</div>
                      <div className="font-semibold">Boulevard du 30 Juin, Kinshasa</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Distance</div>
                    <div className="font-bold text-lg">12.5 km</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix</div>
                    <div className="font-bold text-lg">3500 FC</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {rideStatus === 'in-progress' && (
                <button
                  onClick={completeRide}
                  className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Terminer la course
                </button>
              )}
              
              {rideStatus !== 'in-progress' && (
                <button
                  onClick={cancelRide}
                  className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  Annuler la course
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal de fin de course */}
        {rideStatus === 'completed' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-white/10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Course terminée !</h2>
                <p className="text-gray-600 dark:text-gray-400">Merci d'avoir utilisé TAXIA</p>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant à payer</div>
                  <div className="text-4xl font-bold">3500 FC</div>
                  <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">Paiement cash au chauffeur</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold mb-3 text-center">Évaluez votre chauffeur</div>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="p-2 hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('client-dashboard')}
                className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
