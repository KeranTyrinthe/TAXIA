import { useAuth } from '../context/AuthContext';

export function Header({ isDark, setIsDark, setCurrentPage }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      setCurrentPage('home');
    }
  };

  const goToDashboard = () => {
    if (user?.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (user?.role === 'driver') {
      setCurrentPage('driver-dashboard');
    } else {
      setCurrentPage('client-dashboard');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-sm dark:shadow-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <button onClick={() => setCurrentPage('home')} className="flex items-center -my-6 sm:-my-7">
          <img src="/images/logo.webp" alt="TAXIA" className="h-20 sm:h-24 w-auto cursor-pointer" />
        </button>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          
          {user ? (
            // Utilisateur connecté
            <>
              <button 
                onClick={goToDashboard}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center gap-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-lg"
              >
                Déconnexion
              </button>
            </>
          ) : (
            // Utilisateur non connecté
            <>
              <button 
                onClick={() => setCurrentPage('login')}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                Connexion
              </button>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl hover:scale-105 transition-all duration-200 shadow-lg"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
