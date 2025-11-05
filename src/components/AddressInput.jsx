import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export function AddressInput({ 
  value, 
  onChange, 
  placeholder = "Entrez une adresse",
  onSelect,
  city = "Kinshasa" // Ville par défaut
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Debounce la recherche
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Utiliser Nominatim (OpenStreetMap) pour la géolocalisation
        // Nettoyer la ville (enlever le quartier si présent)
        const cleanCity = city.includes('/') ? city.split('/').pop().trim() : city;
        const searchQuery = `${query}, ${cleanCity}, RDC`;
        
        console.log('🔍 Recherche déclenchée:', query, '| Ville:', cleanCity, '| Query complète:', searchQuery);
        
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: searchQuery,
            format: 'json',
            addressdetails: 1,
            limit: 20, // Augmenté de 10 à 20
            countrycodes: 'cd', // Limiter à la RDC
          },
          headers: {
            'User-Agent': 'TAXIA-App'
          }
        });

        // Afficher tous les résultats sans filtre strict
        // Le filtre est déjà appliqué dans la recherche via searchQuery
        console.log('📍 Résultats trouvés:', response.data.length);
        
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erreur recherche adresse:', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, city]);

  const handleSelect = (suggestion) => {
    const address = suggestion.display_name;
    setQuery(address);
    setShowSuggestions(false);
    
    if (onChange) {
      onChange(address);
    }
    
    if (onSelect) {
      onSelect({
        address,
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon)
      });
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (onChange) onChange(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
      />

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-[#0a0a0a] dark:border-t-[#fafafa] rounded-full animate-spin"></div>
        </div>
      )}

      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-b-0"
              >
                <div className="font-medium text-sm">{suggestion.display_name}</div>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              Aucune adresse trouvée. Essayez un autre terme.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
