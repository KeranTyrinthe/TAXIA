import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export function AdminDashboard({ setCurrentPage }) {
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalClients: 0,
    todayRevenue: 0,
    pendingPayments: 0
  });
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Charger les statistiques
      const statsResponse = await adminAPI.getStatistics();
      setStats(statsResponse.data.stats || stats);

      // Charger les courses récentes
      const ridesResponse = await adminAPI.getRides();
      const rides = ridesResponse.data.rides || [];
      setRecentRides(rides.filter(r => ['pending', 'assigned', 'in_progress'].includes(r.status)).slice(0, 5));
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Administration</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez votre plateforme TAXIA</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalRides}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Courses totales</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stats.activeRides} en cours</div>
          </div>

          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalDrivers}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Chauffeurs</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stats.activeDrivers} actifs</div>
          </div>

          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalClients}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Clients</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Utilisateurs</div>
          </div>

          <div className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{stats.todayRevenue} FC</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Revenus du jour</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stats.pendingPayments} FC en attente</div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => setCurrentPage('admin-rides')}
            className="p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div className="font-bold text-sm sm:text-base mb-1">Courses</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Gérer les courses</div>
          </button>

          <button
            onClick={() => setCurrentPage('admin-drivers')}
            className="p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div className="font-bold text-sm sm:text-base mb-1">Chauffeurs</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Gérer les chauffeurs</div>
          </button>

          <button
            onClick={() => setCurrentPage('admin-payments')}
            className="p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div className="font-bold text-sm sm:text-base mb-1">Paiements</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Suivi des versements</div>
          </button>

          <button
            onClick={() => setCurrentPage('admin-stats')}
            className="p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div className="font-bold text-sm sm:text-base mb-1">Statistiques</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rapports et analyses</div>
          </button>

          <button
            onClick={() => setCurrentPage('admin-users')}
            className="p-4 sm:p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div className="font-bold text-sm sm:text-base mb-1">Utilisateurs</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Gérer les comptes</div>
          </button>
        </div>

        {/* Courses en temps réel */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Courses en temps réel</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : recentRides.length > 0 ? (
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <div key={ride.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setCurrentPage('admin-rides')}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ride.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        ride.status === 'assigned' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {ride.status === 'pending' ? 'En attente' : ride.status === 'assigned' ? 'Assignée' : 'En cours'}
                      </div>
                      <span className="font-bold">#{ride.id}</span>
                    </div>
                    <span className="font-bold text-lg">{ride.price} FC</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-600 dark:text-green-400">●</span>
                      {ride.pickup_address}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span>
                      {ride.dropoff_address}
                    </div>
                  </div>
                  {ride.driver_name && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                      Chauffeur: {ride.driver_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Aucune course en cours</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
