import { useState, useEffect } from 'react';
import { driversAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function DriverDashboard({ setCurrentPage }) {
  const { user } = useAuth();
  const [status, setStatus] = useState('available');
  const [pendingRides, setPendingRides] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [stats, setStats] = useState({
    todayRides: 0,
    todayEarnings: 0,
    weekRides: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // Refresh toutes les 10 secondes
    const interval = setInterval(loadDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger les courses en attente
      const ridesResponse = await driversAPI.getPendingRides();
      setPendingRides(ridesResponse.data.rides || []);

      // Charger la course active
      const activeResponse = await driversAPI.getActiveRide();
      setActiveRide(activeResponse.data.ride || null);

      // Charger les stats (à implémenter côté backend)
      // const statsResponse = await driversAPI.getStats();
      // setStats(statsResponse.data.stats);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    const newStatus = status === 'available' ? 'offline' : 'available';
    try {
      await driversAPI.updateAvailability(newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const acceptRide = async (rideId) => {
    try {
      await driversAPI.acceptRide(rideId);
      setPendingRides(pendingRides.filter(r => r.id !== rideId));
      loadDashboardData();
    } catch (error) {
      console.error('Erreur acceptation course:', error);
    }
  };

  const rejectRide = async (rideId) => {
    try {
      await driversAPI.rejectRide(rideId);
      setPendingRides(pendingRides.filter(r => r.id !== rideId));
    } catch (error) {
      console.error('Erreur refus course:', error);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header avec statut */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tableau de bord</h1>
              <p className="text-gray-600 dark:text-gray-400">Gérez vos courses en temps réel</p>
            </div>
            <button
              onClick={toggleStatus}
              className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                status === 'available'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${status === 'available' ? 'bg-white' : 'bg-gray-300'} animate-pulse`}></div>
              <span className="whitespace-nowrap">{status === 'available' ? 'Disponible' : 'Hors ligne'}</span>
            </button>
          </div>

          {/* Statistiques du jour */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="text-3xl font-bold mb-1">{stats.todayRides}</div>
              <div className="text-sm opacity-90">Courses aujourd'hui</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="text-3xl font-bold mb-1">{stats.todayEarnings} FC</div>
              <div className="text-sm opacity-90">Gains du jour</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="text-3xl font-bold mb-1">{stats.weekRides}</div>
              <div className="text-sm opacity-90">Cette semaine</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-xl">
              <div className="text-3xl font-bold mb-1 flex items-center gap-1">
                {stats.rating || '4.0'}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div className="text-sm opacity-90">Note moyenne</div>
            </div>
          </div>
        </div>

        {/* Course active */}
        {activeRide && (
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl text-white mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Course en cours</h2>
              <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold">
                {activeRide.price} FC
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <div className="text-sm opacity-75">Départ</div>
                  <div className="font-bold">{activeRide.pickup_address}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div>
                  <div className="text-sm opacity-75">Arrivée</div>
                  <div className="font-bold">{activeRide.dropoff_address}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentPage('driver-tracking')}
                className="flex-1 py-3 bg-white text-blue-600 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Voir l'itinéraire
              </button>
              <button className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all">
                Contacter client
              </button>
            </div>
          </div>
        )}

        {/* Courses proposées */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Courses proposées</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : pendingRides.length > 0 ? (
            <div className="space-y-4">
              {pendingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-lg mb-1">#{ride.id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(ride.created_at).toLocaleTimeString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ride.price} FC</div>
                      <div className="text-xs text-gray-500">{ride.distance} km</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="text-sm">{ride.pickup_address}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="text-sm">{ride.dropoff_address}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => acceptRide(ride.id)}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
                    >
                      ✓ Accepter
                    </button>
                    <button
                      onClick={() => rejectRide(ride.id)}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                    >
                      ✕ Refuser
                    </button>
                  </div>
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {status === 'available' ? 'Aucune course disponible pour le moment' : 'Passez en mode disponible pour recevoir des courses'}
              </p>
            </div>
          )}
        </div>

        {/* Bouton profil */}
        <div className="mt-6">
          <button
            onClick={() => setCurrentPage('driver-profile')}
            className="w-full p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
                <div>
                  <div className="font-bold">{user?.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Voir mon profil</div>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
