import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { TrendingUp, Users, DollarSign, Star, Calendar } from 'lucide-react';

export function AdminStatistics({ setCurrentPage }) {
  const [stats, setStats] = useState({
    today: { rides: 0, revenue: 0 },
    week: { rides: 0, revenue: 0 },
    month: { rides: 0, revenue: 0 },
    topDrivers: [],
    satisfactionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week'); // today, week, month

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPeriodData = () => {
    switch (period) {
      case 'today':
        return stats.today;
      case 'week':
        return stats.week;
      case 'month':
        return stats.month;
      default:
        return stats.week;
    }
  };

  const periodData = getCurrentPeriodData();

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Statistiques</h1>
              <p className="text-gray-600 dark:text-gray-400">Analysez les performances de votre plateforme</p>
            </div>
            
            {/* Sélecteur de période */}
            <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setPeriod('today')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  period === 'today'
                    ? 'bg-white dark:bg-white/10 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                onClick={() => setPeriod('week')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  period === 'week'
                    ? 'bg-white dark:bg-white/10 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                7 jours
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  period === 'month'
                    ? 'bg-white dark:bg-white/10 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                30 jours
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10" />
                  <Calendar className="w-6 h-6 opacity-75" />
                </div>
                <div className="text-4xl font-bold mb-2">{periodData.rides}</div>
                <div className="text-sm opacity-90">Courses</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-3xl text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10" />
                  <TrendingUp className="w-6 h-6 opacity-75" />
                </div>
                <div className="text-4xl font-bold mb-2">{periodData.revenue} FC</div>
                <div className="text-sm opacity-90">Revenus</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-3xl text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-10 h-10" />
                  <div className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Actifs</div>
                </div>
                <div className="text-4xl font-bold mb-2">{stats.topDrivers.length}</div>
                <div className="text-sm opacity-90">Chauffeurs</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-3xl text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-10 h-10 fill-white" />
                  <span className="text-2xl font-bold">{stats.satisfactionRate}%</span>
                </div>
                <div className="text-4xl font-bold mb-2">
                  {(stats.satisfactionRate / 20).toFixed(1)}/5
                </div>
                <div className="text-sm opacity-90">Satisfaction</div>
              </div>
            </div>

            {/* Graphique simple des revenus */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 mb-8">
              <h3 className="font-bold text-xl mb-6">Évolution des revenus</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Aujourd'hui</div>
                  <div className="h-40 bg-gradient-to-t from-blue-500 to-blue-300 rounded-xl flex items-end justify-center pb-2" style={{ height: `${Math.min((stats.today.revenue / Math.max(stats.month.revenue, 1)) * 160, 160)}px` }}>
                    <span className="text-white font-bold text-sm">{stats.today.revenue} FC</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">7 jours</div>
                  <div className="h-40 bg-gradient-to-t from-green-500 to-green-300 rounded-xl flex items-end justify-center pb-2" style={{ height: `${Math.min((stats.week.revenue / Math.max(stats.month.revenue, 1)) * 160, 160)}px` }}>
                    <span className="text-white font-bold text-sm">{stats.week.revenue} FC</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">30 jours</div>
                  <div className="h-40 bg-gradient-to-t from-purple-500 to-purple-300 rounded-xl flex items-end justify-center pb-2">
                    <span className="text-white font-bold text-sm">{stats.month.revenue} FC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top chauffeurs */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10">
              <h3 className="font-bold text-xl mb-6">Top Chauffeurs</h3>
              {stats.topDrivers.length > 0 ? (
                <div className="space-y-3">
                  {stats.topDrivers.map((driver, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-blue-400 to-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{driver.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {driver.total_rides} courses
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{driver.rating || '4.0'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Aucun chauffeur actif
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
