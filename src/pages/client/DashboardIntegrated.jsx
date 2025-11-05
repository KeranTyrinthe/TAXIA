import { useState, useEffect } from 'react';
import { Map } from '../../components/Map';
import { AddressInput } from '../../components/AddressInput';
import { ridesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function ClientDashboard({ setCurrentPage }) {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
  const [dropoff, setDropoff] = useState({ address: '', lat: null, lng: null });
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [markers, setMarkers] = useState([]);

  // Récupérer la position actuelle
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(location);
          setPickup(prev => ({ ...prev, ...location }));
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          // Position par défaut (Kinshasa)
          setCurrentLocation({ lat: -4.3, lng: 15.3 });
        }
      );
    }
  }, []);

  // Mettre à jour les markers
  useEffect(() => {
    const newMarkers = [];
    
    if (pickup.lat && pickup.lng) {
      newMarkers.push({
        lat: pickup.lat,
        lng: pickup.lng,
        type: 'pickup',
        popup: `<strong>Départ</strong><br/>${pickup.address || 'Ma position'}`
      });
    }
    
    if (dropoff.lat && dropoff.lng) {
      newMarkers.push({
        lat: dropoff.lat,
        lng: dropoff.lng,
        type: 'dropoff',
        popup: `<strong>Arrivée</strong><br/>${dropoff.address}`
      });
    }
    
    setMarkers(newMarkers);
  }, [pickup, dropoff]);

  const handleCalculate = async () => {
    if (!pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) {
      setError('Veuillez sélectionner les adresses de départ et d\'arrivée');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ridesAPI.create({
        pickup_address: pickup.address || 'Ma position',
        pickup_lat: pickup.lat,
        pickup_lng: pickup.lng,
        dropoff_address: dropoff.address,
        dropoff_lat: dropoff.lat,
        dropoff_lng: dropoff.lng
      });

      setTripDetails(response.data.ride);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du calcul du trajet');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    // Rediriger vers la page de suivi
    setCurrentPage('client-tracking');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Bonjour {user?.name} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Où souhaitez-vous aller ?</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulaire */}
          <div className="space-y-6">
            {/* Carte */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <Map
                center={currentLocation ? [currentLocation.lng, currentLocation.lat] : [15.3, -4.3]}
                zoom={12}
                markers={markers}
                height="300px"
              />
            </div>

            {/* Formulaire de commande */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h2 className="font-bold text-lg mb-4">Détails de la course</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Point de départ</label>
                  <AddressInput
                    value={pickup.address}
                    onChange={(address) => setPickup(prev => ({ ...prev, address }))}
                    onSelect={(data) => setPickup(data)}
                    placeholder="Où êtes-vous ?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Point d'arrivée</label>
                  <AddressInput
                    value={dropoff.address}
                    onChange={(address) => setDropoff(prev => ({ ...prev, address }))}
                    onSelect={(data) => setDropoff(data)}
                    placeholder="Où voulez-vous aller ?"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  disabled={loading || !pickup.lat || !dropoff.lat}
                  className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                      Calcul en cours...
                    </>
                  ) : (
                    'Calculer le trajet'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div>
            {tripDetails ? (
              <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                <h2 className="font-bold text-lg mb-6">Détails du trajet</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
                    </div>
                    <span className="font-bold text-lg">{tripDetails.distance} km</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Durée estimée</span>
                    </div>
                    <span className="font-bold text-lg">{tripDetails.duration} min</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Prix</span>
                    </div>
                    <span className="font-bold text-2xl">{tripDetails.price} FC</span>
                  </div>
                </div>

                {tripDetails.driver_name && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                      ✓ Chauffeur assigné
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      {tripDetails.driver_name} - {tripDetails.vehicle_model}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                >
                  Voir le suivi de la course
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-white/5 p-12 rounded-3xl border border-gray-200/50 dark:border-white/10 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <h3 className="text-xl font-bold mb-2">Calculez votre trajet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Entrez vos adresses et cliquez sur "Calculer le trajet"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <button
            onClick={() => setCurrentPage('client-history')}
            className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <svg className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div className="font-semibold">Historique</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Voir mes courses</div>
          </button>

          <button
            onClick={() => setCurrentPage('client-profile')}
            className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left"
          >
            <svg className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <div className="font-semibold">Profil</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mes informations</div>
          </button>

          <button className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group text-left">
            <svg className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <div className="font-semibold">Notifications</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">0 nouvelles</div>
          </button>
        </div>
      </div>
    </div>
  );
}
