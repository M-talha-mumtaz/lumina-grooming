import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('services'), path: '/services' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    return (
      <div className="bg-neutral-950 min-h-screen text-zinc-200 flex flex-col">
        {/* Admin Navbar */}
        <header className="bg-neutral-900 border-b border-gold/10 py-4 px-6 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard" className="text-xl font-serif text-gold tracking-widest uppercase">
                Apex <span className="text-[10px] bg-gold/10 px-2 py-0.5 ml-2 border border-gold/20 font-sans tracking-normal">Admin</span>
              </Link>
              <div className="h-6 w-px bg-zinc-800 hidden md:block"></div>
              <Link to="/" className="hidden md:flex items-center space-x-2 text-zinc-400 hover:text-gold transition-colors text-xs uppercase tracking-widest">
                <ExternalLink size={14} />
                <span>Visit Site</span>
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3 text-right">
                <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Connected as</div>
                <div className="text-xs font-medium text-zinc-300">{user?.email || 'Administrator'}</div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-zinc-400 hover:text-red-400 transition-colors group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-xs uppercase tracking-widest font-bold">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Admin Footer */}
        <footer className="bg-neutral-950 border-t border-zinc-900 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShieldCheck size={14} className="text-gold/50" />
              <span>Apex Management System &copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex space-x-8">
              <Link to="/" className="hover:text-gold transition-colors">Client Website</Link>
              <Link to="/admin/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-red-400 transition-colors">Security Exit</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Admin Login Page (Simple layout)
  if (isLoginPage) {
    return <div className="bg-neutral-950 min-h-screen text-zinc-200">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md py-4 border-b border-gold/20' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="text-2xl tracking-widest text-gold uppercase font-serif">
            Apex
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider transition-colors hover:text-gold ${location.pathname === link.path ? 'text-gold' : 'text-zinc-300'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/book" className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-zinc-950 transition-all uppercase tracking-wider text-sm">
              {t('booking')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gold">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>
<AnimatePresence>
      {/* Premium Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-40 bg-zinc-950 flex flex-col justify-center items-center md:hidden touch-none"
        >
          {/* Stylized Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif text-gold leading-none select-none">
               APEX
             </div>
          </div>

          <div className="flex flex-col items-center space-y-8 z-10">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-4xl uppercase tracking-[0.2em] font-serif transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-zinc-300 hover:text-gold'}`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (navLinks.length * 0.1), duration: 0.5 }}
            >
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-10 py-4 border border-gold text-gold text-2xl uppercase tracking-[0.2em] hover:bg-gold hover:text-zinc-950 transition-all font-serif"
              >
                {t('booking')}
              </Link>
            </motion.div>
          </div>
          
          {/* Bottom detail */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 text-zinc-600 text-[10px] uppercase tracking-[0.4em]"
          >
            Experience Refinement
          </motion.div>
        </motion.div>
      )}
</AnimatePresence>

      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-gold/20 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-zinc-400">
          <h2 className="text-2xl text-gold font-serif mb-6 tracking-widest uppercase">Apex</h2>
          <p className="mb-4">Premium Grooming Experience</p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/services" className="hover:text-gold transition-colors">{t('services')}</Link>
            <Link to="/about" className="hover:text-gold transition-colors">{t('about')}</Link>
            <Link to="/contact" className="hover:text-gold transition-colors">{t('contact')}</Link>
            <Link to="/admin/login" className="hover:text-gold transition-colors opacity-40">Staff Login</Link>
          </div>
          <p className="mt-8 text-xs opacity-50">&copy; {new Date().getFullYear()} Apex Salon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
