import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { DollarSign, CheckCircle, Clock, TrendingUp, User, Car } from 'lucide-react';

export function AdminPayments({ setCurrentPage }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPayments();
      const paymentsData = response.data.payments || [];
      setPayments(paymentsData);
      
      // Calculer les stats
      const total = paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pending = paymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
      const confirmed = paymentsData.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + (p.amount || 0), 0);
      
      setStats({ total, pending, confirmed });
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (driverId, amount) => {
    if (!confirm(`Confirmer le versement de ${amount} FC ?`)) return;
    
    try {
      await adminAPI.confirmPayment(driverId, amount);
      loadPayments();
    } catch (error) {
      console.error('Erreur confirmation paiement:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'confirmed') return payment.status === 'confirmed';
    return true;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gestion des paiements</h1>
          <p className="text-gray-600 dark:text-gray-400">Suivez et validez les versements des chauffeurs</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total} FC</div>
            <div className="text-sm opacity-90">Total des versements</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8" />
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">En attente</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.pending} FC</div>
            <div className="text-sm opacity-90">À confirmer</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8" />
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Validé</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.confirmed} FC</div>
            <div className="text-sm opacity-90">Confirmés</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'all'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'pending'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all text-sm ${
              filter === 'confirmed'
                ? 'bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a]'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
          >
            Confirmés
          </button>
        </div>

        {/* Liste des paiements */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-white/20 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {payment.driver_name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {payment.driver_name}
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            payment.status === 'confirmed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {payment.status === 'confirmed' ? '✓ Confirmé' : '⏳ En attente'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.driver_phone}
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 dark:text-gray-400 mb-1">Montant</div>
                        <div className="font-bold text-lg text-green-600 dark:text-green-400">
                          {payment.amount} FC
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400 mb-1">Date</div>
                        <div className="font-semibold">
                          {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      {payment.confirmed_at && (
                        <div>
                          <div className="text-gray-600 dark:text-gray-400 mb-1">Confirmé le</div>
                          <div className="font-semibold">
                            {new Date(payment.confirmed_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {payment.status === 'pending' && (
                    <button
                      onClick={() => handleConfirmPayment(payment.driver_id, payment.amount)}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Confirmer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <DollarSign className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-bold mb-2">Aucun paiement</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'pending' ? 'Aucun paiement en attente' : 
               filter === 'confirmed' ? 'Aucun paiement confirmé' : 
               'Les paiements apparaîtront ici'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
