import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from './components/Footer';
import './App.css'; // Import the main stylesheet
import './styles/globals.css';
import './styles/layout.css';
import './styles/toast.css';

function App() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <nav>
          <div className="nav-logo">
            <Link to={user ? "/dashboard" : "/"}>Shipay</Link>
          </div>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard">{t('dashboard')}</Link>
                <Link to="/transfer">{t('transfer')}</Link>
                <Link to="/funds">{t('depositWithdraw')}</Link>
                <Link to="/transactions">{t('transactions')}</Link>
                <button 
                  onClick={handleLogout} 
                  className="logout-button"
                >
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login">{t('login')}</Link> 
                <Link to="/register">{t('register')}</Link>
              </>
            )}
            <button 
              onClick={toggleLanguage} 
              className="language-toggle"
              title={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
            >
              {language === 'en' ? 'AR' : 'EN'}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="main-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1],
            opacity: { duration: 0.5 },
            y: { duration: 0.6 }
          }}
          onAnimationComplete={() => {
            // Smooth scroll to top on route change
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <Outlet />
          </motion.div>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;