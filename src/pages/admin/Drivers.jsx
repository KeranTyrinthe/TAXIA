import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Plus, X, Save, Loader } from 'lucide-react';

export function AdminDrivers({ setCurrentPage }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    city: 'Kinshasa',
    vehicle_model: '',
    vehicle_plate: '',
    vehicle_color: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDrivers();
      setDrivers(response.data.drivers || []);
    } catch (err) {
      console.error('Erreur chargement chauffeurs:', err);
      setError('Impossible de charger les chauffeurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await adminAPI.createDriver(formData);
      setSuccess('Chauffeur ajouté avec succès !');
      setShowAddModal(false);
      setFormData({
        name: '',
        phone: '',
        password: '',
        email: '',
        city: 'Kinshasa',
        vehicle_model: '',
        vehicle_plate: '',
        vehicle_color: ''
      });
      loadDrivers();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout du chauffeur');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (driverId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await adminAPI.updateDriver(driverId, { status: newStatus });
      loadDrivers();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('admin-dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#0a0a0a] dark:hover:text-[#fafafa] mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gestion des chauffeurs</h1>
              <p className="text-gray-600 dark:text-gray-400">Ajouter et gérer tous les chauffeurs</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ajouter un chauffeur
            </button>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl flex items-center gap-2">
            <X className="w-5 h-5 text-red-700 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-xl flex items-center gap-2">
            <Save className="w-5 h-5 text-green-700 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-12 h-12 animate-spin text-[#0a0a0a] dark:text-[#fafafa]" />
          </div>
        )}

        {/* Liste des chauffeurs - Grid responsive */}
        {!loading && drivers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Header avec avatar et statut */}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {driver.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    {/* Indicateur de disponibilité */}
                    {driver.availability === 'available' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                      driver.status === 'active' 
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {driver.status === 'active' ? '✓ Actif' : '✕ Inactif'}
                    </span>
                    {driver.availability && (
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                        driver.availability === 'available'
                          ? 'bg-blue-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {driver.availability === 'available' ? '🟢 Libre' : '🔴 Occupé'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Informations chauffeur */}
                <div className="mb-4">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {driver.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {driver.phone}
                  </div>
                  {driver.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      {driver.email}
                    </div>
                  )}
                </div>

                {/* Véhicule */}
                {driver.vehicle_model && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-2xl mb-4 border border-blue-200/50 dark:border-blue-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white">{driver.vehicle_model}</div>
                        <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{driver.vehicle_plate}</div>
                        {driver.vehicle_color && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">{driver.vehicle_color}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-200/50 dark:border-white/10">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{driver.total_rides || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Courses</div>
                  </div>
                  <div className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-200/50 dark:border-white/10">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      {driver.rating || '4.0'}
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Note</div>
                  </div>
                </div>

                {/* Actions */}
                <button 
                  onClick={() => handleToggleStatus(driver.id, driver.status)}
                  className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                    driver.status === 'active'
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {driver.status === 'active' ? '🔒 Désactiver' : '✓ Activer'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && drivers.length === 0 && (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <Users className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-bold mb-2">Aucun chauffeur</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Commencez par ajouter votre premier chauffeur</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all duration-200"
            >
              Ajouter un chauffeur
            </button>
          </div>
        )}

        {/* Modal d'ajout */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl p-8 max-w-2xl w-full border border-gray-200 dark:border-white/10 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Ajouter un chauffeur</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informations personnelles */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+243 XXX XXX XXX"
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Ville *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Mot de passe *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                {/* Informations véhicule */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <h3 className="font-bold mb-4">Informations du véhicule</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Modèle *</label>
                      <input
                        type="text"
                        value={formData.vehicle_model}
                        onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                        placeholder="Toyota Corolla"
                        required
                        disabled={submitting}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Plaque *</label>
                      <input
                        type="text"
                        value={formData.vehicle_plate}
                        onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                        placeholder="CD 1234 KN"
                        required
                        disabled={submitting}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2">Couleur *</label>
                    <input
                      type="text"
                      value={formData.vehicle_color}
                      onChange={(e) => setFormData({ ...formData, vehicle_color: e.target.value })}
                      placeholder="Blanc"
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Ajouter le chauffeur
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={submitting}
                    className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
