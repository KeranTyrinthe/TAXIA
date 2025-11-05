import { useState, useEffect } from 'react';
import { driversAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Mail, MapPin, Car, Star, TrendingUp, LogOut, Save, X } from 'lucide-react';

export function DriverProfile({ setCurrentPage }) {
  const { user, logout } = useAuth();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await driversAPI.getProfile();
      setDriver(response.data.driver);
      setFormData({
        name: response.data.driver.name,
        phone: response.data.driver.phone,
        email: response.data.driver.email || '',
        city: response.data.driver.city
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await usersAPI.updateProfile(formData);
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      setCurrentPage('home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mon Profil</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez vos informations personnelles</p>
        </div>

        {/* Avatar et Stats */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl text-white mb-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-6xl font-bold">
              {driver?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">{driver?.name}</h2>
              <p className="text-white/80 mb-4">{driver?.phone}</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                    <span className="font-bold">{driver?.rating || '4.0'}</span>
                  </div>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold">{driver?.total_rides || 0} courses</span>
                  </div>
                </div>
                <div className={`px-4 py-2 backdrop-blur rounded-xl ${
                  driver?.availability === 'available' ? 'bg-green-500/30' : 'bg-gray-500/30'
                }`}>
                  <span className="font-bold">
                    {driver?.availability === 'available' ? '🟢 Disponible' : '⚫ Hors ligne'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Véhicule */}
        {driver?.vehicle_model && (
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 mb-6">
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <Car className="w-6 h-6" />
              Mon Véhicule
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Modèle</div>
                <div className="font-bold">{driver.vehicle_model}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plaque</div>
                <div className="font-bold font-mono">{driver.vehicle_plate}</div>
              </div>
              {driver.license_number && (
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Permis</div>
                  <div className="font-bold">{driver.license_number}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Informations personnelles */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl">Informations personnelles</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: driver.name,
                      phone: driver.phone,
                      email: driver.email || '',
                      city: driver.city
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <User className="w-4 h-4" />
                Nom complet
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                <MapPin className="w-4 h-4" />
                Ville
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Gains */}
        {driver?.balance !== undefined && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white mb-6 shadow-xl">
            <h3 className="font-bold text-xl mb-2">Solde à reverser</h3>
            <div className="text-4xl font-bold">{driver.balance} FC</div>
            <p className="text-white/80 text-sm mt-2">Montant à reverser à l'administration</p>
          </div>
        )}

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
