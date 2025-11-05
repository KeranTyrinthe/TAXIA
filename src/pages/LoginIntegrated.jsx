import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Login({ setCurrentPage }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(phone, password);
      
      if (result.success) {
        // Rediriger selon le rôle
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
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-white/5 p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">Connexion</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center mb-6 sm:mb-8">
            Connectez-vous pour accéder à votre compte
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
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
              className="w-full px-6 py-3 sm:py-4 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="font-semibold text-[#0a0a0a] dark:text-[#fafafa] hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            disabled={loading}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm sm:text-base">Se connecter avec Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
