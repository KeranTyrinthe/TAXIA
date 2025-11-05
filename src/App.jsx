import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { About } from './pages/About';

// Pages Client
import { ClientDashboard } from './pages/client/Dashboard';
import { ClientTracking } from './pages/client/Tracking';
import { ClientHistory } from './pages/client/History';
import { ClientProfile } from './pages/client/Profile';

// Pages Chauffeur
import { DriverDashboard } from './pages/driver/Dashboard';
import { DriverProfile } from './pages/driver/Profile';

// Pages Admin
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminDrivers } from './pages/admin/Drivers';
import { AdminRides } from './pages/admin/Rides';
import { AdminPayments } from './pages/admin/Payments';
import { AdminStatistics } from './pages/admin/Statistics';
import { AdminUsers } from './pages/admin/Users';

export function App() {
  const { user, isAuthenticated } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Rediriger vers le dashboard approprié si connecté et sur une page publique
  useEffect(() => {
    if (isAuthenticated && user && (currentPage === 'home' || currentPage === 'login' || currentPage === 'signup')) {
      if (user.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else if (user.role === 'driver') {
        setCurrentPage('driver-dashboard');
      } else {
        setCurrentPage('client-dashboard');
      }
    }
  }, [isAuthenticated, user, currentPage]);

  // Rediriger vers home si déconnecté et sur une page protégée
  useEffect(() => {
    if (!isAuthenticated && !['home', 'login', 'signup', 'about'].includes(currentPage)) {
      setCurrentPage('home');
    }
  }, [isAuthenticated, currentPage]);

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#0a0a0a] dark:text-[#fafafa] transition-colors duration-300">
        <Header isDark={isDark} setIsDark={setIsDark} setCurrentPage={setCurrentPage} />
        
        {/* Pages publiques */}
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <About setCurrentPage={setCurrentPage} />}
        
        {/* Pages Client */}
        {currentPage === 'client-dashboard' && <ClientDashboard setCurrentPage={setCurrentPage} />}
        {currentPage === 'client-tracking' && <ClientTracking setCurrentPage={setCurrentPage} />}
        {currentPage === 'client-history' && <ClientHistory setCurrentPage={setCurrentPage} />}
        {currentPage === 'client-profile' && <ClientProfile setCurrentPage={setCurrentPage} />}
        
        {/* Pages Chauffeur */}
        {currentPage === 'driver-dashboard' && <DriverDashboard setCurrentPage={setCurrentPage} />}
        {currentPage === 'driver-profile' && <DriverProfile setCurrentPage={setCurrentPage} />}
        
        {/* Pages Admin */}
        {currentPage === 'admin-dashboard' && <AdminDashboard setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin-drivers' && <AdminDrivers setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin-rides' && <AdminRides setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin-payments' && <AdminPayments setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin-stats' && <AdminStatistics setCurrentPage={setCurrentPage} />}
        {currentPage === 'admin-users' && <AdminUsers setCurrentPage={setCurrentPage} />}
        
        {/* Footer - pas sur les pages login/signup et pages connectées */}
        {!currentPage.includes('login') && 
         !currentPage.includes('signup') && 
         !currentPage.includes('client-') && 
         !currentPage.includes('driver-') && 
         !currentPage.includes('admin-') && (
          <Footer setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
