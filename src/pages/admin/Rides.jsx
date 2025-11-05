import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export function AdminRides({ setCurrentPage }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, active, completed
  const [drivers, setDrivers] = useState([]);
  const [priceInputs, setPriceInputs] = useState({});
  const [driverSelections, setDriverSelections] = useState({});
  const [etaInputs, setEtaInputs] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadRides();
    loadDrivers();
  }, []);

  const loadRides = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getRides();
      setRides(response.data.rides || []);
    } catch (error) {
      console.error('Erreur chargement courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await adminAPI.getDrivers();
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error('Erreur chargement chauffeurs:', error);
    }
  };

  const handleSetPrice = async (rideId) => {
    const price = priceInputs[rideId];
    if (!price || price <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }

    setActionLoading({ ...actionLoading, [`price_${rideId}`]: true });
    try {
      await adminAPI.setPrice(rideId, price);
      alert(`Prix de ${price} FC défini avec succès`);
      await loadRides();
      setPriceInputs({ ...priceInputs, [rideId]: '' });
    } catch (error) {
      console.error('Erreur définition prix:', error);
      alert('Erreur lors de la définition du prix');
    } finally {
      setActionLoading({ ...actionLoading, [`price_${rideId}`]: false });
    }
  };

  const handleAssignDriver = async (rideId) => {
    const driverId = driverSelections[rideId];
    const eta = etaInputs[rideId];

    if (!driverId) {
      alert('Veuillez sélectionner un chauffeur');
      return;
    }
    if (!eta || eta <= 0) {
      alert('Veuillez entrer un temps d\'arrivée estimé');
      return;
    }

    setActionLoading({ ...actionLoading, [`assign_${rideId}`]: true });
    try {
      await adminAPI.assignDriver(rideId, driverId, eta);
      alert('Chauffeur assigné avec succès');
      await loadRides();
      setDriverSelections({ ...driverSelections, [rideId]: '' });
      setEtaInputs({ ...etaInputs, [rideId]: '' });
    } catch (error) {
      console.error('Erreur assignation chauffeur:', error);
      alert('Erreur lors de l\'assignation du chauffeur');
    } finally {
      setActionLoading({ ...actionLoading, [`assign_${rideId}`]: false });
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'waiting_price': 'En attente du prix',
      'price_sent': 'Prix envoyé au client',
      'price_accepted': 'Prix accepté',
      'price_rejected': 'Prix refusé',
      'pending': 'En attente',
      'assigned': 'Assignée',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée',
      'driver_on_way': 'Chauffeur en route',
      'driver_arrived': 'Chauffeur arrivé'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    if (['completed'].includes(status)) return 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white';
    if (['assigned', 'in_progress', 'driver_on_way', 'driver_arrived'].includes(status)) return 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white';
    if (['waiting_price', 'price_sent'].includes(status)) return 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white';
    if (['price_accepted'].includes(status)) return 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white';
    if (['price_rejected', 'cancelled'].includes(status)) return 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400';
    return 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white';
  };

  const filteredRides = rides.filter(ride => {
    if (filter === 'all') return true;
    if (filter === 'pending') return ['pending', 'waiting_price', 'price_sent', 'price_accepted'].includes(ride.status);
    if (filter === 'active') return ['assigned', 'in_progress', 'driver_on_way', 'driver_arrived'].includes(ride.status);
    if (filter === 'completed') return ride.status === 'completed';
    return true;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gestion des courses</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivez et gérez toutes les courses</p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'all'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'pending'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'active'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            En cours
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'completed'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Terminées
          </button>
        </div>

        {/* Liste des courses */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-xs font-semibold rounded-full">
                        #{ride.id}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                        {getStatusLabel(ride.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{new Date(ride.created_at).toLocaleString('fr-FR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{ride.price ? `${ride.price} FC` : 'Prix non défini'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{ride.distance ? `${ride.distance} km` : 'Distance non calculée'}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Client</div>
                    <div className="font-semibold text-sm">{ride.client_name}</div>
                    <div className="text-xs text-gray-500">{ride.client_phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Chauffeur</div>
                    <div className="font-semibold text-sm">{ride.driver_name || 'Non assigné'}</div>
                    {ride.driver_phone && <div className="text-xs text-gray-500">{ride.driver_phone}</div>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Départ</div>
                      <div className="font-medium text-sm">{ride.pickup_address}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Arrivée</div>
                      <div className="font-medium text-sm">{ride.dropoff_address}</div>
                    </div>
                  </div>
                </div>

                {/* Actions selon le statut */}
                {ride.status === 'waiting_price' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-3 border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                        <span className="font-bold">Définir le prix</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Le client attend votre proposition de prix</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Prix en FC"
                        value={priceInputs[ride.id] || ''}
                        onChange={(e) => setPriceInputs({ ...priceInputs, [ride.id]: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none text-sm"
                      />
                      <button
                        onClick={() => handleSetPrice(ride.id)}
                        disabled={actionLoading[`price_${ride.id}`]}
                        className="px-6 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all text-sm disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                      >
                        {actionLoading[`price_${ride.id}`] ? (
                          <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                        Envoyer
                      </button>
                    </div>
                  </div>
                )}

                {ride.status === 'price_sent' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="font-bold">En attente de validation</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prix de <strong>{ride.price} FC</strong> envoyé au client. En attente de sa réponse.</p>
                    </div>
                  </div>
                )}

                {ride.status === 'price_accepted' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl mb-3 border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <span className="font-bold">Assigner un chauffeur</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Le client a accepté le prix de <strong>{ride.price} FC</strong>. Assignez maintenant un chauffeur.</p>
                    </div>
                    <div className="space-y-2">
                      <select
                        value={driverSelections[ride.id] || ''}
                        onChange={(e) => setDriverSelections({ ...driverSelections, [ride.id]: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none text-sm"
                      >
                        <option value="">Sélectionner un chauffeur</option>
                        {drivers.filter(d => d.availability === 'available').map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name} - {driver.vehicle_model} ({driver.vehicle_plate})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Temps d'arrivée (min)"
                          value={etaInputs[ride.id] || ''}
                          onChange={(e) => setEtaInputs({ ...etaInputs, [ride.id]: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none text-sm"
                        />
                        <button
                          onClick={() => handleAssignDriver(ride.id)}
                          disabled={actionLoading[`assign_${ride.id}`]}
                          className="px-6 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all text-sm disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                        >
                          {actionLoading[`assign_${ride.id}`] ? (
                            <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                          Assigner
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {ride.status === 'price_rejected' && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        <span className="font-bold">Prix refusé</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Le client a refusé le prix de <strong>{ride.price} FC</strong>.</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Aucune course</h3>
            <p className="text-gray-600 dark:text-gray-400">Les courses apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
