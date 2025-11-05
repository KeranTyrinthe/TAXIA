import db from '../database/init.js';
import axios from 'axios';

// Calculer l'itinéraire et le prix avec routing réel
export async function calculateRoute(pickup, dropoff) {
  // Valider les coordonnées
  if (!pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng) {
    console.error('❌ Coordonnées invalides:', { pickup, dropoff });
    throw new Error('Coordonnées invalides');
  }

  console.log('🗺️ Calcul route:', 
    `De [${pickup.lat}, ${pickup.lng}]`,
    `À [${dropoff.lat}, ${dropoff.lng}]`
  );

  try {
    // Utiliser OSRM avec plus d'options pour un routing précis
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson&steps=true&alternatives=false&continue_straight=false`;
    
    console.log('🌐 OSRM URL:', osrmUrl);
    
    const response = await axios.get(osrmUrl, {
      timeout: 15000, // 15 secondes timeout (augmenté)
      headers: {
        'User-Agent': 'TAXIA-App/1.0'
      }
    });
    
    console.log('✅ OSRM Response code:', response.data.code);
    
    if (response.data.code === 'Ok' && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const distance = route.distance / 1000; // Convertir en km
      const duration = Math.round(route.duration / 60); // Convertir en minutes
      
      console.log('✅ OSRM Geometry points:', route.geometry.coordinates.length);
      
      // Récupérer les paramètres de tarification
      const basePrice = parseFloat(db.prepare('SELECT value FROM settings WHERE key = ?').get('base_price')?.value || 1000);
      const pricePerKm = parseFloat(db.prepare('SELECT value FROM settings WHERE key = ?').get('price_per_km')?.value || 500);

      // Calculer le prix
      const price = Math.round(basePrice + (distance * pricePerKm));

      console.log(`✅ Route OSRM calculée: ${distance.toFixed(1)}km, ${duration}min, ${price}FC, ${route.geometry.coordinates.length} points`);

      return {
        distance: Math.round(distance * 10) / 10,
        duration,
        price,
        geometry: route.geometry.coordinates // GeoJSON LineString
      };
    } else {
      console.error('❌ OSRM: Aucune route trouvée, code:', response.data.code);
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('❌ Erreur OSRM:', error.response?.data || error.message);
    console.log('⚠️ Utilisation du calcul de secours (Haversine)');
  }

  // Fallback: Calcul simple avec Haversine
  const R = 6371;
  const dLat = toRad(dropoff.lat - pickup.lat);
  const dLng = toRad(dropoff.lng - pickup.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pickup.lat)) * Math.cos(toRad(dropoff.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const basePrice = parseFloat(db.prepare('SELECT value FROM settings WHERE key = ?').get('base_price')?.value || 1000);
  const pricePerKm = parseFloat(db.prepare('SELECT value FROM settings WHERE key = ?').get('price_per_km')?.value || 500);
  const price = Math.round(basePrice + (distance * pricePerKm));
  const duration = Math.round((distance / 30) * 60);

  console.log(`⚠️ Route Haversine (ligne droite): ${distance.toFixed(1)}km, ${duration}min, ${price}FC, 2 points`);

  return {
    distance: Math.round(distance * 10) / 10,
    duration,
    price,
    geometry: [
      [pickup.lng, pickup.lat],
      [dropoff.lng, dropoff.lat]
    ]
  };
}

// Trouver le meilleur chauffeur disponible
export async function findBestDriver(pickupLat, pickupLng) {
  // Récupérer tous les chauffeurs disponibles avec leur position
  const availableDrivers = db.prepare(`
    SELECT u.id, u.name, u.phone, d.rating, d.total_rides, 
           d.current_lat, d.current_lng, d.vehicle_model, d.vehicle_plate
    FROM users u
    JOIN drivers d ON u.id = d.user_id
    WHERE d.availability = 'available' AND u.status = 'active'
  `).all();

  if (availableDrivers.length === 0) {
    console.log('❌ Aucun chauffeur disponible');
    return null;
  }

  // Calculer la distance pour chaque chauffeur et scorer
  const driversWithScore = availableDrivers.map(driver => {
    // Si le chauffeur n'a pas de position, on met une distance très grande
    if (!driver.current_lat || !driver.current_lng) {
      return {
        ...driver,
        distance: 9999,
        score: 0
      };
    }

    // Calculer la distance avec Haversine
    const distance = calculateDistance(
      pickupLat, pickupLng,
      driver.current_lat, driver.current_lng
    );

    // Score basé sur:
    // - Distance (70% du poids) - plus proche = mieux
    // - Note (30% du poids) - meilleure note = mieux
    const distanceScore = Math.max(0, 100 - (distance * 10)); // 10km = 0 points
    const ratingScore = (driver.rating || 4) * 20; // Note sur 5 -> score sur 100
    const score = (distanceScore * 0.7) + (ratingScore * 0.3);

    return {
      ...driver,
      distance: Math.round(distance * 10) / 10,
      score: Math.round(score)
    };
  });

  // Trier par score décroissant
  driversWithScore.sort((a, b) => b.score - a.score);

  const bestDriver = driversWithScore[0];
  
  console.log(`✅ Meilleur chauffeur: ${bestDriver.name} (${bestDriver.distance}km, note: ${bestDriver.rating}, score: ${bestDriver.score})`);

  return bestDriver;
}

// Calculer la distance entre deux points (Haversine)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
