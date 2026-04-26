import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

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

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('services'), path: '/services' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="bg-zinc-950 min-h-screen text-zinc-200">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md py-4 border-b border-gold/20' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950 pt-32 px-6 flex flex-col space-y-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl uppercase tracking-wider text-zinc-300 hover:text-gold"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/book"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl uppercase tracking-wider text-gold"
          >
            {t('booking')}
          </Link>
        </div>
      )}

      <main className="flex-grow pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-gold/20 py-12 mt-20">
        <div className="container mx-auto px-6 md:px-12 text-center text-zinc-400">
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
