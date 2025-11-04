export function Footer({ setCurrentPage }) {
  return (
    <footer className="py-8 px-4 sm:py-12 sm:px-6 border-t border-gray-200/50 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 sm:col-span-1 mb-4 sm:mb-0">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img src="/images/logo.png" alt="TAXIA Logo" className="h-16 sm:h-20 w-auto" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Transport intelligent en République Démocratique du Congo
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Entreprise</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('about')} 
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  À propos
                </button>
              </li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Produits</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Pour les clients</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Tarifs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Sécurité</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 TAXIA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
