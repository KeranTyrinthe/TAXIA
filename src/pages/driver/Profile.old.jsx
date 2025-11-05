import { useState } from 'react';

export function DriverProfile({ setCurrentPage, setUserType }) {
  // TODO: Récupérer les données depuis le backend
  const [driver, setDriver] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    vehicle: '',
    plate: '',
    rating: 0,
    totalRides: 0
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      setUserType(null);
      setCurrentPage('home');
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('driver-dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-[#fafafa] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mon Profil Chauffeur</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos informations professionnelles</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Photo et stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo et infos principales */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-12 h-12 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">{driver.name || 'Nom du chauffeur'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{driver.phone || 'Téléphone'}</p>
                
                {/* Note */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="text-2xl font-bold">{driver.rating || '0.0'}</span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="text-3xl font-bold mb-1">{driver.totalRides || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Courses effectuées</div>
                </div>
              </div>
            </div>

            {/* Véhicule */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#0a0a0a] dark:bg-[#fafafa] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#fafafa] dark:text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </div>
                <h3 className="font-bold">Mon véhicule</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Modèle</div>
                  <div className="font-semibold">{driver.vehicle || 'Non renseigné'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plaque</div>
                  <div className="font-semibold">{driver.plate || 'Non renseigné'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaires */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Informations personnelles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={driver.name}
                    onChange={(e) => setDriver({...driver, name: e.target.value})}
                    placeholder="Jean Mukendi"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={driver.phone}
                    onChange={(e) => setDriver({...driver, phone: e.target.value})}
                    placeholder="+243 XXX XXX XXX"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={driver.email}
                    onChange={(e) => setDriver({...driver, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Ville</label>
                  <select
                    value={driver.city}
                    onChange={(e) => setDriver({...driver, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Kinshasa">Kinshasa</option>
                    <option value="Lubumbashi">Lubumbashi</option>
                    <option value="Goma">Goma</option>
                    <option value="Bukavu">Bukavu</option>
                  </select>
                </div>
              </div>
              <button className="w-full mt-6 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200">
                Enregistrer les modifications
              </button>
            </div>

            {/* Informations véhicule */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
                Informations véhicule
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Modèle du véhicule</label>
                  <input
                    type="text"
                    value={driver.vehicle}
                    onChange={(e) => setDriver({...driver, vehicle: e.target.value})}
                    placeholder="Toyota Corolla"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Plaque d'immatriculation</label>
                  <input
                    type="text"
                    value={driver.plate}
                    onChange={(e) => setDriver({...driver, plate: e.target.value})}
                    placeholder="CD 1234 KN"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all"
                  />
                </div>
              </div>
              <button className="w-full mt-6 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200">
                Mettre à jour le véhicule
              </button>
            </div>

            {/* Paramètres */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Paramètres
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">Mode sombre</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${isDarkMode ? 'bg-[#0a0a0a] dark:bg-[#fafafa]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-[#0a0a0a] rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">Notifications</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${notifications ? 'bg-[#0a0a0a] dark:bg-[#fafafa]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white dark:bg-[#0a0a0a] rounded-full transition-transform ${notifications ? 'translate-x-6' : ''}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                    </svg>
                    <div>
                      <div className="font-semibold text-sm">Langue</div>
                    </div>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 outline-none font-semibold text-sm"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-xl text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span className="whitespace-nowrap">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
