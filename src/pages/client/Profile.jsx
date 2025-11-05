import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../services/api';
import { Camera, MapPin, Phone, Mail, Save, X } from 'lucide-react';

export function ClientProfile({ setCurrentPage }) {
  const { user: authUser, logout, updateUser } = useAuth();
  const [user, setUser] = useState({
    name: '',
    phone: '',
    city: '',
    email: '',
    totalRides: 0,
    totalSpent: 0
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    email: ''
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [authUser]);

  const loadUserData = async () => {
    if (!authUser) return;

    try {
      // Utiliser les données du context auth
      setUser({
        name: authUser.name || '',
        phone: authUser.phone || '',
        city: authUser.city || '',
        email: authUser.email || '',
        totalRides: authUser.total_rides || 0,
        totalSpent: authUser.total_spent || 0
      });

      setFormData({
        name: authUser.name || '',
        phone: authUser.phone || '',
        city: authUser.city || '',
        email: authUser.email || ''
      });
    } catch (err) {
      console.error('Erreur chargement profil:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await usersAPI.updateProfile(formData);
      
      // Mettre à jour le context auth
      updateUser(response.data.user);
      
      setUser({
        ...user,
        ...formData
      });
      
      setSuccess('Profil mis à jour avec succès !');
      setEditing(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Mot de passe changé avec succès !');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setChangingPassword(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      setCurrentPage('home');
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      city: user.city,
      email: user.email
    });
    setEditing(false);
    setError('');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage('client-dashboard')}
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Photo et stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo et infos principales */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-1">{user.name || 'Nom d\'utilisateur'}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  {user.phone || 'Téléphone'}
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.city || 'Ville'}</span>
                </div>

                {user.email && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                Mes statistiques
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold mb-1">{user.totalRides || 0}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Courses effectuées</div>
                </div>
                <div className="p-4 bg-white dark:bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold mb-1">{user.totalSpent || 0} FC</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total dépensé</div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Formulaires */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Informations personnelles
                </h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all text-sm"
                  >
                    Modifier
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing || loading}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing || loading}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!editing || loading}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email (optionnel)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editing || loading}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                {editing && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#fafafa] dark:border-[#0a0a0a] border-t-transparent rounded-full animate-spin"></div>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Enregistrer
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      disabled={loading}
                      className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Changer le mot de passe */}
            {!authUser?.google_id && (
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Sécurité
                  </h3>
                  {!changingPassword && (
                    <button
                      onClick={() => setChangingPassword(true)}
                      className="px-4 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all text-sm"
                    >
                      Changer le mot de passe
                    </button>
                  )}
                </div>

                {changingPassword ? (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Mot de passe actuel</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        disabled={loading}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        disabled={loading}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none transition-all disabled:opacity-50"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {loading ? 'Changement...' : 'Changer le mot de passe'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChangingPassword(false);
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setError('');
                        }}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-white/20 transition-all disabled:opacity-50"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Votre mot de passe doit contenir au moins 6 caractères.
                  </p>
                )}
              </div>
            )}

            {/* Déconnexion */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-white/10 shadow-xl">
              <h3 className="font-bold text-lg mb-4">Zone de danger</h3>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
