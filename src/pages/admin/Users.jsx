import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users as UsersIcon, Search, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export function AdminUsers({ setCurrentPage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, client, driver
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    clients: 0,
    drivers: 0,
    active: 0
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      const usersData = response.data.users || [];
      setUsers(usersData);

      // Calculer les statistiques
      const clientsCount = usersData.filter(u => u.role === 'client').length;
      const driversCount = usersData.filter(u => u.role === 'driver').length;
      const activeCount = usersData.filter(u => u.status === 'active').length;

      setStats({
        total: usersData.length,
        clients: clientsCount,
        drivers: driversCount,
        active: activeCount
      });
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm)) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getRoleBadge = (role) => {
    const badges = {
      client: { color: 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white', text: 'Client' },
      driver: { color: 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white', text: 'Chauffeur' },
      admin: { color: 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]', text: 'Admin' }
    };
    return badges[role] || badges.client;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white', text: 'Actif' },
      inactive: { color: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400', text: 'Inactif' },
      suspended: { color: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400', text: 'Suspendu' }
    };
    return badges[status] || badges.active;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Utilisateurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Gérez tous les utilisateurs de la plateforme</p>
        </div>

        {/* Statistiques */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</div>
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Utilisateurs</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Clients</div>
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.clients}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Inscrits</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Chauffeurs</div>
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.drivers}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Enregistrés</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actifs</div>
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.active}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">En ligne</div>
          </div>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-[#0a0a0a] dark:focus:border-white/30 outline-none text-sm"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                    : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter('client')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === 'client'
                    ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                    : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Clients
              </button>
              <button
                onClick={() => setFilter('driver')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === 'driver'
                    ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                    : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Chauffeurs
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0a0a0a] dark:border-[#fafafa] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        {!loading && filteredUsers.length > 0 ? (
          <div className="grid gap-4">
            {filteredUsers.map((user) => {
              const roleBadge = getRoleBadge(user.role);
              const statusBadge = getStatusBadge(user.status);
              
              return (
                <div
                  key={user.id}
                  className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all hover:shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Info utilisateur */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/5 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Détails */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <span className={`px-3 py-1 ${roleBadge.color} text-xs font-semibold rounded-full`}>
                            {roleBadge.text}
                          </span>
                          <span className={`px-3 py-1 ${statusBadge.color} text-xs font-semibold rounded-full`}>
                            {statusBadge.text}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          {user.email && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{user.email}</span>
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Phone className="w-4 h-4" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{user.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>Inscrit le {formatDate(user.created_at)}</span>
                          </div>
                        </div>

                        {/* Info chauffeur si applicable */}
                        {user.role === 'driver' && user.vehicle_model && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                                </svg>
                                <span className="font-medium">{user.vehicle_model}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Plaque:</span>
                                <span className="font-mono font-semibold">{user.vehicle_plate}</span>
                              </div>
                              {user.availability && (
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${user.availability === 'available' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                  <span className="text-xs">{user.availability === 'available' ? 'Disponible' : 'Occupé'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col sm:items-end">
                      <button className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-sm font-semibold transition-all">
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !loading && (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <UsersIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Essayez une autre recherche' : 'Aucun utilisateur inscrit pour le moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
