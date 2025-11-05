import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function Map({ 
  center = [15.3, -4.3], // Kinshasa par défaut [lng, lat]
  zoom = 12,
  markers = [],
  route = null,
  onMapClick = null,
  height = '400px',
  interactive = true
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialiser une seule fois

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
            maxzoom: 19
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: center,
      zoom: zoom,
      minZoom: 2,
      maxZoom: 20,
      interactive: interactive,
      attributionControl: false
    });

    // Ajouter les contrôles de navigation
    if (interactive) {
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }), 'top-right');
    }

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Gérer les clics sur la carte
    if (onMapClick) {
      map.current.on('click', (e) => {
        onMapClick(e.lngLat);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour les markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Supprimer les anciens markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter les nouveaux markers
    markers.forEach(markerData => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cursor = 'default'; // Curseur normal, pas pointer
      el.style.transition = 'transform 0.2s';
      el.style.pointerEvents = 'none'; // Désactiver tous les événements de pointeur
      
      if (markerData.type === 'pickup') {
        el.innerHTML = `
          <div style="position: relative; width: 48px; height: 48px;">
            <svg width="48" height="48" viewBox="0 0 48 48" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
              <circle cx="24" cy="24" r="20" fill="#10b981"/>
              <circle cx="24" cy="24" r="16" fill="white" opacity="0.3"/>
              <circle cx="24" cy="24" r="8" fill="white"/>
              <text x="24" y="28" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">A</text>
            </svg>
          </div>`;
      } else if (markerData.type === 'dropoff') {
        el.innerHTML = `
          <div style="position: relative; width: 48px; height: 60px;">
            <svg width="48" height="60" viewBox="0 0 48 60" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
              <path d="M24 0C13.5 0 5 8.5 5 19c0 14 19 41 19 41s19-27 19-41c0-10.5-8.5-19-19-19z" fill="#ef4444"/>
              <circle cx="24" cy="19" r="10" fill="white"/>
              <text x="24" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#ef4444">B</text>
            </svg>
          </div>`;
      } else if (markerData.type === 'driver') {
        el.innerHTML = `
          <div style="position: relative; width: 56px; height: 56px;">
            <svg width="56" height="56" viewBox="0 0 56 56" style="filter: drop-shadow(0 4px 12px rgba(59,130,246,0.5));">
              <circle cx="28" cy="28" r="24" fill="#3b82f6"/>
              <circle cx="28" cy="28" r="20" fill="white" opacity="0.2"/>
              <g transform="translate(20, 20)">
                <path d="M13 1c-.66 0-1.21.42-1.42 1.01L10 6H2c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h1v1c0 .55.45 1 1 1s1-.45 1-1v-1h8v1c0 .55.45 1 1 1s1-.45 1-1v-1h1c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1h-2l-1.58-3.99C13.21 1.42 12.66 1 12 1h-1zm-9 8c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm8 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="white"/>
              </g>
              <circle cx="28" cy="28" r="26" fill="none" stroke="#3b82f6" stroke-width="2" opacity="0.3">
                <animate attributeName="r" from="26" to="32" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>`;
      }

      const marker = new maplibregl.Marker({ 
        element: el, 
        anchor: markerData.type === 'dropoff' ? 'bottom' : 'center',
        draggable: false // Empêcher le déplacement des markers
      })
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current);

      if (markerData.popup) {
        marker.setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(markerData.popup)
        );
      }

      markersRef.current.push(marker);
    });

    // Ajuster la vue pour afficher tous les markers
    if (markers.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      markers.forEach(marker => {
        bounds.extend([marker.lng, marker.lat]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    } else if (markers.length === 1) {
      map.current.flyTo({
        center: [markers[0].lng, markers[0].lat],
        zoom: 14
      });
    }
  }, [markers, mapLoaded]);

  // Dessiner l'itinéraire
  useEffect(() => {
    if (!map.current || !mapLoaded || !route) return;

    // Supprimer l'ancien itinéraire
    if (map.current.getLayer('route-glow')) {
      map.current.removeLayer('route-glow');
    }
    if (map.current.getLayer('route')) {
      map.current.removeLayer('route');
    }
    if (map.current.getLayer('route-border')) {
      map.current.removeLayer('route-border');
    }
    if (map.current.getSource('route')) {
      map.current.removeSource('route');
    }

    // Ajouter le nouvel itinéraire
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }
    });

    // Ajouter une bordure sombre pour la route
    map.current.addLayer({
      id: 'route-border',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1e40af',
        'line-width': 8,
        'line-opacity': 0.4
      }
    });

    // Ajouter la route principale
    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 6,
        'line-opacity': 1
      }
    });

    // Ajouter une ligne animée par-dessus
    map.current.addLayer({
      id: 'route-glow',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#60a5fa',
        'line-width': 3,
        'line-opacity': 0.6,
        'line-dasharray': [0, 4, 3]
      }
    });

    // Ajuster la vue pour afficher l'itinéraire
    const bounds = new maplibregl.LngLatBounds();
    route.forEach(coord => {
      bounds.extend(coord);
    });
    map.current.fitBounds(bounds, { padding: 50 });
  }, [route, mapLoaded]);

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height }}
      className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10"
    />
  );
}
