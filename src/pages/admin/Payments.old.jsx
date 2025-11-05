import { useState } from 'react';

export function AdminPayments({ setCurrentPage }) {
  // TODO: Récupérer les paiements depuis le backend
  const [payments, setPayments] = useState([]);

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
          <p className="text-gray-600 dark:text-gray-400">Suivi des versements des chauffeurs</p>
        </div>

        {/* Statistiques */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0 FC</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total perçu</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0 FC</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total versé</div>
          </div>
          <div className="bg-white dark:bg-white/5 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="text-3xl font-bold mb-1">0 FC</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">En attente</div>
          </div>
        </div>

        {/* Liste des paiements */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white dark:bg-white/5 p-4 sm:p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold">{payment.driver}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{payment.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold">{payment.amount} FC</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{payment.rides} courses</div>
                    </div>
                    {payment.status === 'pending' ? (
                      <button className="px-4 py-2 bg-[#0a0a0a] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#0a0a0a] rounded-xl font-semibold hover:scale-105 transition-all text-sm whitespace-nowrap">
                        Confirmer
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-semibold text-sm">
                        Versé
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-200/50 dark:border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Aucun paiement en attente</h3>
            <p className="text-gray-600 dark:text-gray-400">Les versements apparaîtront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
