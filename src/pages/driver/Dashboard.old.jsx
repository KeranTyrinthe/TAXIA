import { useState } from 'react';

export function DriverDashboard({ setCurrentPage }) {
  const [status, setStatus] = useState('available'); // available, busy, offline
  // TODO: Récupérer les courses proposées depuis le backend
  const [pendingRides, setPendingRides] = useState([]);

  const acceptRide = (rideId) => {
    setPendingRides(pendingRides.filter(r => r.id !== rideId));
    setCurrentPage('driver-tracking');
  };

  const rejectRide = (rideId) => {
    setPendingRides(pendingRides.filter(r => r.id !== rideId));
  };

  const toggleStatus = () => {
    if (status === 'available') setStatus('offline');
    else if (status === 'offline') setStatus('available');
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
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="text-3xl font-bold mb-1">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Courses aujourd'hui</div>
            </div>
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="text-3xl font-bold mb-1">0 km</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Distance parcourue</div>
            </div>
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="text-3xl font-bold mb-1">0 FC</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Revenus du jour</div>
            </div>
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="text-3xl font-bold mb-1">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</div>
            </div>
          </div>
        </div>

        {/* Courses proposées */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Courses proposées</h2>
          {pendingRides.length > 0 ? (
            <div className="space-y-4">
              {pendingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold">{ride.client}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Client</div>
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
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Durée estimée: <span className="font-semibold text-[#0a0a0a] dark:text-[#fafafa]">{ride.estimatedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => rejectRide(ride.id)}
                        className="px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-lg font-semibold transition-all"
                      >
                        Refuser
                      </button>
                      <button
                        onClick={() => acceptRide(ride.id)}
                        className="px-4 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-lg font-semibold hover:scale-105 transition-all"
                      >
                        Accepter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border border-gray-200/50 dark:border-white/10 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <h3 className="text-xl font-bold mb-2">Aucune course disponible</h3>
              <p className="text-gray-600 dark:text-gray-400">Les nouvelles courses apparaîtront ici</p>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentPage('driver-history')}
            className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
          >
            <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className="font-semibold">Historique</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Voir toutes mes courses</div>
          </button>
          <button
            onClick={() => setCurrentPage('driver-earnings')}
            className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
          >
            <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className="font-semibold">Revenus</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gérer mes paiements</div>
          </button>
          <button
            onClick={() => setCurrentPage('driver-profile')}
            className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
          >
            <svg className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div className="font-semibold">Profil</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mes informations</div>
          </button>
        </div>
      </div>
    </div>
  );
}
