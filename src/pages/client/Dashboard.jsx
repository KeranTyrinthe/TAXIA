import { useEffect, useMemo, useState } from 'react';
import { Map } from '../../components/Map';
import { AddressInput } from '../../components/AddressInput';
import { ridesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_CENTER = [15.3, -4.3]; // Kinshasa

export function ClientDashboard({ setCurrentPage }) {
  const { user } = useAuth();
  const [pickup, setPickup] = useState({ address: '', lat: null, lng: null });
  const [dropoff, setDropoff] = useState({ address: '', lat: null, lng: null });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [detectedCity, setDetectedCity] = useState(user?.city || 'Kinshasa'); // Pour l'affichage
  const [cityForSearch, setCityForSearch] = useState(user?.city || 'Kinshasa'); // Pour le filtre
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useManualMode, setUseManualMode] = useState(false); // Mode manuel activé

  // Récupérer la position actuelle du client et détecter la ville
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log('📍 GPS Précision:', position.coords.accuracy, 'mètres');
        console.log('📍 Coordonnées:', coords.lat, coords.lng);
        setCurrentLocation(coords);
        setPickup((prev) => ({ ...prev, ...coords }));

        // Détecter la ville via reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'TAXIA-App' } }
          );
          const data = await response.json();
          const address = data.address || {};
          
          console.log('🔍 Adresse détectée:', address);
          console.log('🔍 Display name complet:', data.display_name);
          
          // Extraire le quartier et la ville avec fallback robuste
          // Essayer plusieurs champs pour le quartier
          let suburb = address.suburb || address.neighbourhood || address.quarter || address.residential || '';
          
          // Si le quartier semble bizarre, essayer d'extraire du display_name
          if (!suburb || suburb.length < 3) {
            const parts = data.display_name.split(',').map(p => p.trim());
            if (parts.length > 0) {
              suburb = parts[0]; // Premier élément = généralement le quartier
            }
          }
          
          // Chercher la ville dans plusieurs champs
          let city = address.city || address.town || address.municipality || '';
          
          // Si toujours pas de ville, extraire du display_name
          if (!city && data.display_name) {
            // Format typique: "Quartier, Ville, Province, Pays"
            const parts = data.display_name.split(',').map(p => p.trim());
            
            // Villes connues de RDC
            const knownCities = ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani', 'Goma', 'Bukavu', 'Likasi', 'Kolwezi', 'Matadi'];
            
            // Chercher une ville connue dans le display_name
            for (const knownCity of knownCities) {
              if (data.display_name.includes(knownCity)) {
                city = knownCity;
                break;
              }
            }
          }
          
          // Dernier fallback: profil utilisateur ou Kinshasa
          if (!city) {
            city = user?.city || 'Kinshasa';
          }
          
          // Format: "Quartier / Ville" ou juste "Ville" si pas de quartier
          const locationText = suburb ? `${suburb} / ${city}` : city;
          setDetectedCity(locationText);
          setCityForSearch(city); // Utiliser seulement la ville pour le filtre
          
          // Remplir automatiquement le champ "Point de départ" avec l'adresse détectée
          const pickupAddress = suburb ? `${suburb}, ${city}` : city;
          setPickup((prev) => ({ 
            ...prev, 
            address: prev.address || pickupAddress // Ne pas écraser si déjà rempli
          }));
          
          console.log('📍 Localisation:', locationText, '| Ville recherche:', city, '| Adresse complète:', data.display_name);
        } catch (err) {
          console.error('Erreur détection ville:', err);
          const fallbackCity = user?.city || 'Kinshasa';
          setDetectedCity(fallbackCity);
          setCityForSearch(fallbackCity);
        }
      },
      (geoError) => {
        console.warn('Géolocalisation indisponible', geoError.message);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [user]);

  const markers = useMemo(() => {
    const points = [];
    if (pickup.lat && pickup.lng) {
      points.push({
        lat: pickup.lat,
        lng: pickup.lng,
        type: 'pickup',
        popup: `<strong>Départ</strong><br/>${pickup.address || 'Ma position'}`
      });
    }
    if (dropoff.lat && dropoff.lng) {
      points.push({
        lat: dropoff.lat,
        lng: dropoff.lng,
        type: 'dropoff',
        popup: `<strong>Arrivée</strong><br/>${dropoff.address}`
      });
    }
    return points;
  }, [pickup, dropoff]);

  const createRide = async () => {
    console.log('🚀 createRide appelé');
    console.log('Mode:', useManualMode ? 'Manuel' : 'IA');
    console.log('Pickup:', pickup);
    console.log('Dropoff:', dropoff);
    
    // En mode manuel, on accepte juste les adresses texte
    if (useManualMode) {
      if (!pickup.address || !dropoff.address) {
        console.log('❌ Validation échouée: adresses manquantes');
        setError('Veuillez remplir les adresses de départ et d\'arrivée');
        return;
      }
      console.log('✅ Validation OK (mode manuel)');
    } else {
      // En mode IA, on a besoin des coordonnées
      if (!pickup.lat || !dropoff.lat) {
        console.log('❌ Validation échouée: coordonnées manquantes');
        setError('Veuillez sélectionner les adresses de départ et d\'arrivée');
        return;
      }
      console.log('✅ Validation OK (mode IA)');
    }

    setLoading(true);
    setError('');

    try {
      // Préparer les données selon le mode
      const rideData = {
        pickup_address: pickup.address || 'Ma position',
        dropoff_address: dropoff.address,
        manual_mode: useManualMode
      };

      // Ajouter les coordonnées seulement si elles existent (mode IA)
      if (pickup.lat && pickup.lng) {
        rideData.pickup_lat = pickup.lat;
        rideData.pickup_lng = pickup.lng;
      }
      if (dropoff.lat && dropoff.lng) {
        rideData.dropoff_lat = dropoff.lat;
        rideData.dropoff_lng = dropoff.lng;
      }

      console.log('📤 Envoi des données:', rideData);
      const response = await ridesAPI.create(rideData);
      console.log('✅ Réponse reçue:', response.data);

      setTripDetails(response.data.ride);
      
      // En mode manuel, réinitialiser le formulaire après 3 secondes
      if (useManualMode) {
        setTimeout(() => {
          setPickup({ address: '', lat: null, lng: null });
          setDropoff({ address: '', lat: null, lng: null });
          setTripDetails(null);
          setError('');
        }, 3000);
      }
    } catch (apiError) {
      const message = apiError.response?.data?.error || 'Impossible de créer la course';
      setError(message);
      setTripDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmRide = () => {
    setCurrentPage('client-tracking');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Bonjour {user?.name || 'TAXIA'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Commandez votre course en quelques secondes</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              {/* Toggle Mode IA / Manuel */}
              <div className="mb-5 flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    useManualMode ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {useManualMode ? (
                      <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{useManualMode ? 'Mode Manuel' : 'Mode IA'}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {useManualMode ? 'Saisie manuelle des adresses' : 'Suggestions automatiques'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setUseManualMode(!useManualMode)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    useManualMode ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    useManualMode ? 'translate-x-7' : 'translate-x-0'
                  }`}></div>
                </button>
              </div>

              {/* Indicateur de localisation (seulement en mode IA) */}
              {!useManualMode && (
                <div className="mb-5 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Localisation détectée</div>
                      <div className="text-sm font-bold text-blue-900 dark:text-blue-300">{detectedCity}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Point de départ
                  </label>
                  {useManualMode ? (
                    <input
                      type="text"
                      value={pickup.address}
                      onChange={(e) => setPickup({ address: e.target.value, lat: null, lng: null })}
                      placeholder="Ex: Avenue du 30 Juin, Lubumbashi"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                    />
                  ) : (
                    <AddressInput
                      value={pickup.address}
                      onChange={(address) => setPickup((prev) => ({ ...prev, address }))}
                      onSelect={(data) => setPickup(data)}
                      placeholder="Ma position actuelle"
                      city={cityForSearch}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Destination
                  </label>
                  {useManualMode ? (
                    <input
                      type="text"
                      value={dropoff.address}
                      onChange={(e) => setDropoff({ address: e.target.value, lat: null, lng: null })}
                      placeholder="Ex: Avenue Bel-Bien, Polytechnique"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                    />
                  ) : (
                    <AddressInput
                      value={dropoff.address}
                      onChange={(address) => setDropoff((prev) => ({ ...prev, address }))}
                      onSelect={(data) => setDropoff(data)}
                      placeholder="Où voulez-vous aller ?"
                      city={cityForSearch}
                    />
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <button
                  onClick={createRide}
                  disabled={loading || (useManualMode ? (!pickup.address || !dropoff.address) : !dropoff.lat)}
                  className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                      {useManualMode ? 'Envoi en cours...' : 'Calcul en cours...'}
                    </>
                  ) : (
                    <>
                      {useManualMode ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                          </svg>
                          Envoyer la demande
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                          </svg>
                          Calculer le trajet
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>

              {tripDetails && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 space-y-4">
                  {useManualMode ? (
                    // Mode Manuel : Statut en attente
                    <>
                      <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-lg">En attente du prix</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Course #{tripDetails.id}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                            <div className="text-sm">
                              <p className="font-semibold">Demande envoyée</p>
                              <p className="text-gray-600 dark:text-gray-400">De: {tripDetails.pickup_address}</p>
                              <p className="text-gray-600 dark:text-gray-400">Vers: {tripDetails.dropoff_address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-orange-600 mt-0.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div className="text-sm">
                              <p className="font-semibold text-orange-600 dark:text-orange-400">En attente du prix</p>
                              <p className="text-gray-600 dark:text-gray-400">L'administration définit le prix de votre course</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 opacity-50">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                            </svg>
                            <div className="text-sm">
                              <p className="font-semibold">Validation du prix</p>
                              <p className="text-gray-500 dark:text-gray-500">Vous recevrez une notification</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 opacity-50">
                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                            <div className="text-sm">
                              <p className="font-semibold">Attribution chauffeur</p>
                              <p className="text-gray-500 dark:text-gray-500">Après validation du prix</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 Vous serez notifié dès que le prix sera disponible. Vous pourrez alors l'accepter ou le refuser.
                          </p>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                          Retour au formulaire dans quelques secondes...
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setPickup({ address: '', lat: null, lng: null });
                          setDropoff({ address: '', lat: null, lng: null });
                          setTripDetails(null);
                        }}
                        className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                      >
                        Nouvelle demande
                      </button>
                    </>
                  ) : (
                    // Mode IA : Détails calculés
                    <>
                      <h3 className="font-bold text-lg">Détails du trajet</h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold">{tripDetails.distance} km</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Distance</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold">{tripDetails.duration} min</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Durée</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                          <div className="text-2xl font-bold">{tripDetails.price} FC</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Prix</div>
                        </div>
                      </div>

                      {tripDetails.driver_name ? (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-300">
                          Chauffeur assigné : <strong>{tripDetails.driver_name}</strong> - {tripDetails.vehicle_model}
                        </div>
                      ) : (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-700 dark:text-yellow-300">
                          Nous cherchons le meilleur chauffeur pour vous.
                        </div>
                      )}

                      <button
                        onClick={confirmRide}
                        className="w-full px-6 py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl"
                      >
                        Suivre la course
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentPage('client-history')}
                className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
              >
                <svg className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm font-semibold">Historique</div>
              </button>
              <button
                onClick={() => setCurrentPage('client-profile')}
                className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
              >
                <svg className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div className="text-sm font-semibold">Profil</div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl overflow-hidden h-[500px] lg:h-auto">
            <Map
              center={currentLocation ? [currentLocation.lng, currentLocation.lat] : DEFAULT_CENTER}
              markers={markers}
              route={tripDetails?.route_geometry || null}
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
