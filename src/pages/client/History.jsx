import { useState, useEffect } from 'react';
import { ridesAPI } from '../../services/api';
import { MapPin, Calendar, Star, DollarSign, Navigation } from 'lucide-react';

export function ClientHistory({ setCurrentPage }) {
  const [rides, setRides] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    distance: 0,
    spent: 0
  });

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await ridesAPI.getMyRides();
      const ridesData = response.data.rides || [];
      
      // Séparer les courses en attente et terminées
      const pending = ridesData.filter(r => ['waiting_price', 'price_sent', 'price_accepted'].includes(r.status));
      const completedRides = ridesData.filter(r => r.status === 'completed');
      
      setPendingRides(pending);
      setRides(completedRides);

      // Calculer les statistiques
      const totalDistance = completedRides.reduce((sum, r) => sum + (r.distance || 0), 0);
      const totalSpent = completedRides.reduce((sum, r) => sum + (r.price || 0), 0);
      
      setStats({
        total: completedRides.length,
        distance: totalDistance,
        spent: totalSpent
      });
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPrice = async (rideId) => {
    setActionLoading({ ...actionLoading, [`accept_${rideId}`]: true });
    try {
      await ridesAPI.acceptPrice(rideId);
      alert('Prix accepté ! Un chauffeur vous sera assigné prochainement.');
      await loadHistory();
    } catch (error) {
      console.error('Erreur acceptation prix:', error);
      alert('Erreur lors de l\'acceptation du prix');
    } finally {
      setActionLoading({ ...actionLoading, [`accept_${rideId}`]: false });
    }
  };

  const handleRejectPrice = async (rideId) => {
    if (!confirm('Êtes-vous sûr de vouloir refuser ce prix ?')) return;
    
    setActionLoading({ ...actionLoading, [`reject_${rideId}`]: true });
    try {
      await ridesAPI.rejectPrice(rideId);
      alert('Prix refusé.');
      await loadHistory();
    } catch (error) {
      console.error('Erreur refus prix:', error);
      alert('Erreur lors du refus du prix');
    } finally {
      setActionLoading({ ...actionLoading, [`reject_${rideId}`]: false });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', text: 'Terminée' },
      cancelled: { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', text: 'Annulée' },
      in_progress: { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400', text: 'En cours' },
      assigned: { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', text: 'Assignée' },
      pending: { color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400', text: 'En attente' }
    };
    return badges[status] || badges.pending;
  };

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
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Courses</div>
              <Navigation className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total effectuées</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Distance</div>
              <MapPin className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.distance.toFixed(1)} km</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Parcourue</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dépenses</div>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.spent.toLocaleString()} FC</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0a0a0a] dark:border-[#fafafa] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Demandes en attente */}
        {!loading && pendingRides.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Demandes en cours
            </h2>
            <div className="space-y-4">
              {pendingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border-2 border-[#0a0a0a] dark:border-white/20 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] text-xs font-bold rounded-full">
                          #{ride.id}
                        </span>
                        {ride.status === 'waiting_price' && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            En attente du prix
                          </span>
                        )}
                        {ride.status === 'price_sent' && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-xs font-semibold rounded-full animate-pulse">
                            Prix proposé
                          </span>
                        )}
                        {ride.status === 'price_accepted' && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            Prix accepté
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(ride.created_at)}
                      </div>
                    </div>
                    {ride.price && (
                      <div className="text-right">
                        <div className="text-3xl font-bold">{ride.price} FC</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center pt-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-white/20"></div>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 space-y-8">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Départ</div>
                          <div className="font-medium text-sm">{ride.pickup_address}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Arrivée</div>
                          <div className="font-medium text-sm">{ride.dropoff_address}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ride.status === 'waiting_price' && (
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-sm font-semibold">L'administration définit le prix de votre course...</p>
                      </div>
                    </div>
                  )}

                  {ride.status === 'price_sent' && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                        <p className="text-sm font-semibold mb-2">
                          💰 Prix proposé : <span className="text-2xl">{ride.price} FC</span>
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Acceptez-vous ce prix pour votre course ?
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptPrice(ride.id)}
                          disabled={actionLoading[`accept_${ride.id}`]}
                          className="flex-1 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          {actionLoading[`accept_${ride.id}`] ? (
                            <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                              </svg>
                              Accepter
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectPrice(ride.id)}
                          disabled={actionLoading[`reject_${ride.id}`]}
                          className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                          {actionLoading[`reject_${ride.id}`] ? (
                            <div className="w-5 h-5 border-2 border-[#0a0a0a] dark:border-[#fafafa] border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                              Refuser
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {ride.status === 'price_accepted' && (
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <p className="text-sm font-semibold">Prix accepté ! L'administration assigne un chauffeur...</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && rides.length === 0 && pendingRides.length === 0 && (
          <div className="bg-white dark:bg-white/5 p-12 rounded-2xl border border-gray-200/50 dark:border-white/10 text-center">
            <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">Aucune course</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vous n'avez pas encore effectué de course
            </p>
            <button
              onClick={() => setCurrentPage('client-dashboard')}
              className="px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Commander une course
            </button>
          </div>
        )}

        {/* Liste des courses terminées */}
        {!loading && rides.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Historique des courses
            </h2>
            <div className="space-y-4">
              {rides.map((ride) => {
            const badge = getStatusBadge(ride.status);
            return (
              <div
                key={ride.id}
                className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(ride.created_at)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 ${badge.color} text-xs font-semibold rounded-full`}>
                      {badge.text}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{ride.price?.toLocaleString()} FC</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
                      <MapPin className="w-3 h-3" />
                      {ride.distance?.toFixed(1)} km
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center pt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-8 bg-gray-300 dark:bg-white/20"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 space-y-8">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Départ</div>
                        <div className="font-medium text-sm">{ride.pickup_address}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Arrivée</div>
                        <div className="font-medium text-sm">{ride.dropoff_address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver info */}
                {ride.driver_name && (
                  <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {ride.driver_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{ride.driver_name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{ride.vehicle_model}</div>
                        </div>
                      </div>
                      {ride.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-sm">{ride.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Duration */}
                {ride.duration && (
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Durée : {ride.duration} min
                  </div>
                )}
              </div>
            );
          })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
