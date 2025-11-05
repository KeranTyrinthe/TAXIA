import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export function Signup({ setCurrentPage }) {
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
          const data = await response.json();
          const detectedCity = data?.address?.city || data?.address?.town || data?.address?.state || '';
          if (detectedCity) {
            setCity(detectedCity);
          }
        } catch (geoError) {
          console.error('Erreur détection ville:', geoError);
        }
      },
      (geoError) => {
        console.warn('Géolocalisation non autorisée:', geoError.message);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register({
        name,
        phone,
        password,
        city: city || 'Kinshasa'
      });

      if (result.success) {
        setCurrentPage('client-dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Erreur d'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await loginWithGoogle(credentialResponse.credential);
      
      if (result.success) {
        if (result.user.role === 'client') {
          setCurrentPage('client-dashboard');
        } else if (result.user.role === 'driver') {
          setCurrentPage('driver-dashboard');
        } else if (result.user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur de connexion Google. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Erreur lors de la connexion avec Google');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Inscription</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6 sm:mb-8">
            Créez votre compte pour commencer
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Keran Nexus"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+243 XXX XXX XXX"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kinshasa"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Détectée automatiquement via GPS (modifiable)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 sm:py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl text-sm sm:text-base disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                  Création...
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400">Ou</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Déjà un compte ?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="font-semibold text-[#0a0a0a] dark:text-[#fafafa] hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
