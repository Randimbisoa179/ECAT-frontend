'use client';

import type { Metadata } from 'next';
import '../globals.css';
import Link from 'next/link';
import { LogOut, Bell, Settings, User, Home, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fermer la sidebar quand on clique sur un lien en mobile
  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
        <div className="flex h-screen">
          {/* Overlay pour mobile */}
          {sidebarOpen && isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed md:relative z-50
            w-64 bg-gray-900/95 md:bg-gray-900/90 backdrop-blur-md border-r border-gray-700 
            flex flex-col shadow-xl shadow-black/20
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            h-screen
          `}>
            {/* En-tête Sidebar */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/assets/logo.png"
                    alt="ECAT TARATRA Logo"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ECAT TARATRA
                  </h1>
                  <p className="text-xs text-gray-400">Administration</p>
                </div>
              </div>

              {/* Bouton fermer pour mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation Sidebar */}
            <nav className="flex-1 p-4 space-y-2">
              <SidebarLink href="/admin" icon={<Home className="w-5 h-5" />} onClick={handleNavClick}>
                Dashboard
              </SidebarLink>
              <SidebarLink href="/admin/about" icon={<InfoIcon className="w-5 h-5" />} onClick={handleNavClick}>
                À Propos
              </SidebarLink>
              <SidebarLink href="/admin/directors" icon={<User className="w-5 h-5" />} onClick={handleNavClick}>
                Directeurs
              </SidebarLink>
              <SidebarLink href="/admin/formations" icon={<BookOpenIcon className="w-5 h-5" />} onClick={handleNavClick}>
                Formations
              </SidebarLink>
              <SidebarLink href="/admin/actualites" icon={<NewspaperIcon className="w-5 h-5" />} onClick={handleNavClick}>
                Actualités
              </SidebarLink>
              <SidebarLink href="/admin/contacts" icon={<ContactIcon className="w-5 h-5" />} onClick={handleNavClick}>
                Coordonnées
              </SidebarLink>
              <SidebarLink href="/admin/messages" icon={<MessageSquareIcon className="w-5 h-5" />} onClick={handleNavClick}>
                Messages
              </SidebarLink>
            </nav>

            {/* Pied de page Sidebar */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Administrateur</p>
                  <p className="text-xs text-gray-400 truncate">admin@ecat-taratra.mg</p>
                </div>
              </div>

              
              {/* Menu déroulant pour mobile */}
              <div className="mt-3 space-y-1 md:hidden">
               
                <MobileNavItem href="/admin/compte" icon={<Settings className="w-4 h-4" />} onClick={handleNavClick}>
                  Paramètres
                </MobileNavItem>
              </div>
              
            </div>
            {/* Bouton de déconnexion */}
              <Button
                variant="outline"
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/70 bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>

          </aside>

          {/* Contenu principal */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Header supérieur */}
            <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30">
              <div className="flex justify-between items-center h-16 px-4 sm:px-6">
                {/* Bouton menu mobile */}
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>

                  {/* Breadcrumb ou titre de page */}
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-200">
                      Tableau de Bord
                    </h2>
                    <p className="text-sm text-gray-400 hidden sm:block">
                      Interface d'administration
                    </p>
                  </div>
                </div>

                {/* Actions utilisateur - cachées sur mobile */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Menu utilisateur (desktop seulement) */}
                  <div className="hidden md:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium">Administrateur</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuLabel className="text-gray-300">
                          <div className="flex flex-col">
                            <span>Administrateur</span>
                            <span className="text-xs text-gray-400 font-normal">admin@ecat-taratra.mg</span>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 focus:text-white cursor-pointer">
                         
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 focus:text-white cursor-pointer">
                          <Link href="/admin/compte" className="flex items-center w-full">
                            <Settings className="w-4 h-4 mr-2" />
                            Paramètres
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem 
                          className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Déconnexion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>

            {/* Contenu */}
            <main className="flex-1 overflow-auto p-4 sm:p-6">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900/40 backdrop-blur-sm border-t border-gray-800 py-4">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-2 md:mb-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                      <Image
                        src="/assets/logo.png"
                        alt="ECAT TARATRA Logo"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-300">ECAT TARATRA</span>
                  </div>
                  <div className="text-xs text-gray-400 text-center md:text-right">
                    © 2025 Plateforme Administrative. Tous droits réservés.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

// Composant de lien sidebar
function SidebarLink({
  href,
  icon,
  children,
  onClick
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-700 group"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

// Composant pour les liens mobiles
function MobileNavItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 w-full"
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

// Icônes personnalisées
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function NewspaperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function ContactIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
