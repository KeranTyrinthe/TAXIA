import { useState, useEffect } from 'react';
import { ridesAPI } from '../../services/api';
import { Map } from '../../components/Map';
import { Phone, X, Star, MessageCircle } from 'lucide-react';

export function ClientTracking({ setCurrentPage }) {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadActiveRide();
    const interval = setInterval(loadActiveRide, 5000); // Refresh toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const loadActiveRide = async () => {
    try {
      const response = await ridesAPI.getActiveRide();
      setRide(response.data.ride);
      
      // Si la course est terminée, afficher la notation
      if (response.data.ride?.status === 'completed' && !showRating) {
        setShowRating(true);
      }
    } catch (error) {
      console.error('Erreur chargement course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette course ?')) return;
    
    try {
      await ridesAPI.cancel(ride.id);
      setCurrentPage('client-dashboard');
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  const handleRating = async () => {
    try {
      await ridesAPI.rate(ride.id, { rating, comment });
      setShowRating(false);
      setCurrentPage('client-dashboard');
    } catch (error) {
      console.error('Erreur notation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Aucune course active</h2>
          <button
            onClick={() => setCurrentPage('client-dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (ride.status) {
      case 'pending':
        return {
          color: 'yellow',
          title: 'Recherche d\'un chauffeur...',
          description: 'Nous cherchons le meilleur chauffeur pour vous',
          icon: '🔍'
        };
      case 'assigned':
        return {
          color: 'blue',
          title: 'Chauffeur trouvé !',
          description: `${ride.driver_name} arrive dans quelques minutes`,
          icon: '✓'
        };
      case 'in_progress':
        return {
          color: 'green',
          title: 'Course en cours',
          description: 'Vous êtes en route vers votre destination',
          icon: '🚗'
        };
      case 'completed':
        return {
          color: 'green',
          title: 'Course terminée',
          description: 'Merci d\'avoir utilisé TAXIA !',
          icon: '🎉'
        };
      default:
        return {
          color: 'gray',
          title: 'En attente',
          description: '',
          icon: '⏳'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const markers = [];

  // Ajouter les markers de départ et arrivée
  if (ride.pickup_lat && ride.pickup_lng) {
    markers.push({
      lat: ride.pickup_lat,
      lng: ride.pickup_lng,
      type: 'pickup',
      popup: ride.pickup_address
    });
  }

  if (ride.dropoff_lat && ride.dropoff_lng) {
    markers.push({
      lat: ride.dropoff_lat,
      lng: ride.dropoff_lng,
      type: 'dropoff',
      popup: ride.dropoff_address
    });
  }

  // TODO: Ajouter marker chauffeur avec position GPS temps réel
  // if (ride.driver_lat && ride.driver_lng) {
  //   markers.push({
  //     lat: ride.driver_lat,
  //     lng: ride.driver_lng,
  //     type: 'driver'
  //   });
  // }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Status Header */}
        <div className="mb-6">
          <div className={`bg-${statusInfo.color}-50 dark:bg-${statusInfo.color}-900/20 border border-${statusInfo.color}-200 dark:border-${statusInfo.color}-800 rounded-2xl p-4 flex items-center gap-3`}>
            <div className="text-3xl">{statusInfo.icon}</div>
            <div>
              <div className={`font-semibold text-${statusInfo.color}-900 dark:text-${statusInfo.color}-100`}>
                {statusInfo.title}
              </div>
              <div className={`text-sm text-${statusInfo.color}-700 dark:text-${statusInfo.color}-300`}>
                {statusInfo.description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-200/50 dark:border-white/10 overflow-hidden shadow-xl">
              <Map
                center={ride.pickup_lng && ride.pickup_lat ? [ride.pickup_lng, ride.pickup_lat] : [-15.3, -4.3]}
                markers={markers}
                route={ride.route_geometry ? JSON.parse(ride.route_geometry) : null}
                height="500px"
              />
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-4">
            {/* Info course */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <h3 className="font-bold text-lg mb-4">Détails de la course</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Prix</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ride.price} FC</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Distance</div>
                  <div className="font-bold">{ride.distance} km</div>
                </div>
                {ride.duration && (
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Durée estimée</div>
                    <div className="font-bold">{ride.duration} min</div>
                  </div>
                )}
              </div>
            </div>

            {/* Info chauffeur */}
            {ride.driver_name && (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
                <h3 className="font-bold text-lg mb-4">Votre chauffeur</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {ride.driver_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-xl">{ride.driver_name}</div>
                    <div className="text-white/80 text-sm">{ride.driver_phone}</div>
                    {ride.vehicle_model && (
                      <div className="text-white/80 text-sm mt-1">
                        🚗 {ride.vehicle_model} - {ride.vehicle_plate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${ride.driver_phone}`}
                    className="flex-1 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                  <button className="flex-1 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            )}

            {/* Adresses */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Départ</div>
                    <div className="font-medium text-sm">{ride.pickup_address}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5"></div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Arrivée</div>
                    <div className="font-medium text-sm">{ride.dropoff_address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Annuler */}
            {['pending', 'assigned'].includes(ride.status) && (
              <button
                onClick={handleCancelRide}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Annuler la course
              </button>
            )}
          </div>
        </div>

        {/* Modal de notation */}
        {showRating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 max-w-md w-full border border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold mb-4">Noter votre course</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Comment s'est passée votre course avec {ride.driver_name} ?
              </p>
              
              {/* Étoiles */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Commentaire */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Commentaire (optionnel)"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-blue-500 outline-none transition-all mb-6 resize-none"
                rows={3}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleRating}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                >
                  Envoyer
                </button>
                <button
                  onClick={() => {
                    setShowRating(false);
                    setCurrentPage('client-dashboard');
                  }}
                  className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
                >
                  Passer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
