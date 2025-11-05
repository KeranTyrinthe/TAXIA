export function ClientHistory({ setCurrentPage }) {
  // TODO: Récupérer l'historique depuis le backend
  const rides = [];

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('client-dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-[#fafafa] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Historique des courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Consultez toutes vos courses passées</p>
        </div>

        {/* Statistiques */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses totales</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0 km</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Distance parcourue</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0 FC</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total dépensé</div>
          </div>
        </div>

        {/* Liste des courses */}
        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-1">{ride.date}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                      Terminée
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{ride.price}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{ride.distance}</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-2.5 h-2.5 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-full"></div>
                    <div className="w-0.5 h-8 bg-gray-300 dark:bg-white/20"></div>
                    <svg className="w-4 h-4 text-[#0a0a0a] dark:text-[#fafafa]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Départ</div>
                      <div className="font-medium text-sm">{ride.from}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Arrivée</div>
                      <div className="font-medium text-sm">{ride.to}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{ride.driver}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < ride.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-[#fafafa] transition-colors">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state si pas de courses */}
        {rides.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 className="text-xl font-bold mb-2">Aucune course pour le moment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Commencez votre première course avec TAXIA</p>
            <button
              onClick={() => setCurrentPage('client-dashboard')}
              className="px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200"
            >
              Commander une course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
