'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Newspaper, Contact, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', icon: <Home className="w-4 h-4" />, label: 'Accueil' },
    { href: '/about', icon: <Newspaper className="w-4 h-4" />, label: 'À propos' },
    { href: '/formations', icon: <FileText className="w-4 h-4" />, label: 'Formations' },
    { href: '/actualites', icon: <Newspaper className="w-4 h-4" />, label: 'Actualités' },
    { href: '/formation-en-ligne', icon: <FileText className="w-4 h-4" />, label: 'Formation en ligne' },
    { href: '/contacts', icon: <Contact className="w-4 h-4" />, label: 'Contacts' },
  ];

  // Composant NavLink personnalisé
  const NavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 relative group ${
          isActive
            ? 'text-gray-900'
            : 'text-gray-700 hover:text-gray-900'
        }`}
      >
        {icon}
        <span>{label}</span>

        {/* Soulignement indicateur - visible seulement pour l'élément actif */}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] rounded-full" />
        )}
      </Link>
    );
  };

  // Composant NavLink pour mobile
  const MobileNavLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
          isActive
            ? 'text-blue-600'
            : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        {icon}
        <span>{label}</span>
        
        {/* Indicateur visuel pour mobile */}
        {isActive && (
          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 w-[95%] md:w-[90%] rounded-2xl ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-lg border border-gray-200/50 shadow-lg'
            : 'bg-white/40 backdrop-blur-md border border-white/20'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/logo.png"
                  alt="ECAT TARATRA Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold transition-colors duration-300 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                    : 'text-gray-800'
                }`}>
                  ECAT TARATRA
                </h1>
                <p className={`text-xs transition-colors duration-300 ${isScrolled ? 'text-gray-600' : 'text-gray-700'
                  }`}>
                  Former vers le succès
                </p>
              </div>
            </div>

            {/* Navigation centrale - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>

            {/* Bouton de connexion et menu mobile */}
            <div className="flex items-center space-x-3">
              <Link href="/login" className="hidden sm:block">
                <button className={`h-16 px-8 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center ${
                  isScrolled
                    ? 'bg-[rgb(13,110,253)] text-white hover:bg-[rgb(11,94,215)]'
                    : 'bg-blue-600/90 text-white hover:bg-blue-700 backdrop-blur-sm'
                }`}>
                  Entrer à l'Espace utilisateur
                </button>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg md:hidden transition-colors ${isScrolled
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-700 hover:bg-white/60'
                  }`}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
                
                {/* Bouton de connexion mobile */}
                <Link href="/login" className="block">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-[rgb(13,110,253)] text-white px-4 py-3 rounded-lg font-medium hover:bg-[rgb(11,94,215)] transition duration-300 text-center h-12"
                  >
                    Entrer à l'Espace utilisateur
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay pour menu mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
