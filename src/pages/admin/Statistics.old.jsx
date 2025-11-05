export function AdminStatistics({ setCurrentPage }) {
  // TODO: Récupérer les statistiques depuis le backend
  const stats = {
    today: { rides: 0, revenue: 0 },
    week: { rides: 0, revenue: 0 },
    month: { rides: 0, revenue: 0 },
    topDrivers: [],
    satisfactionRate: 0
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('admin-dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-[#fafafa] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Statistiques & Rapports</h1>
          <p className="text-gray-600 dark:text-gray-400">Analysez les performances de la plateforme</p>
        </div>

        {/* Période */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Aujourd'hui</div>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold">{stats.today.rides}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.today.revenue} FC</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Revenus</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Cette semaine</div>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold">{stats.week.rides}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.week.revenue} FC</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Revenus</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ce mois</div>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold">{stats.month.rides}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Courses</div>
              </div>
              <div>
                <div className="text-xl font-bold">{stats.month.revenue} FC</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Revenus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top chauffeurs */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Top chauffeurs</h2>
          {stats.topDrivers.length > 0 ? (
            <div className="space-y-3">
              {stats.topDrivers.map((driver, index) => (
                <div key={driver.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{driver.rides} courses</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="font-semibold">{driver.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Aucune donnée disponible</p>
            </div>
          )}
        </div>

        {/* Taux de satisfaction */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Satisfaction client</h2>
          <div className="text-center py-8">
            <div className="text-5xl font-bold mb-2">{stats.satisfactionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Taux de satisfaction moyen</div>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
