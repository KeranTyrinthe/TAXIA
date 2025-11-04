import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { About } from './pages/About';

export function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#0a0a0a] dark:text-[#fafafa] transition-colors duration-300">
        <Header isDark={isDark} setIsDark={setIsDark} setCurrentPage={setCurrentPage} />
        
        {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <About setCurrentPage={setCurrentPage} />}
        
        {/* Footer - pas sur les pages login/signup */}
        {currentPage !== 'login' && currentPage !== 'signup' && (
          <Footer setCurrentPage={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
