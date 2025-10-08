import type { Metadata } from 'next';
import '../globals.css';
import Link from 'next/link';
import { LogOut, Bell, Settings, User, Home, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Admin - ECAT TARATRA',
  description: 'Interface administrateur ECAT TARATRA',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
        {/* Navigation moderne sombre */}
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50 shadow-lg shadow-black/20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo et titre */}
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
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ECAT TARATRA
                  </h1>
                  <p className="text-xs text-gray-400">Administration</p>
                </div>
              </div>

              {/* Navigation centrale */}
              <div className="hidden md:flex items-center space-x-1">
                <NavLink href="/admin" icon={<Home className="w-4 h-4" />}>
                  Dashboard
                </NavLink>
                <NavLink href="/admin/formations" icon={<FileTextIcon className="w-4 h-4" />}>
                  Formations
                </NavLink>
                <NavLink href="/admin/actualites" icon={<NewspaperIcon className="w-4 h-4" />}>
                  Actualités
                </NavLink>
              </div>

              {/* Actions utilisateur */}
              <div className="flex items-center space-x-2">
               {/* Menu utilisateur */}
              
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="flex items-center space-x-2 px-3 text-gray-300 hover:text-white hover:bg-gray-800">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
        <User className="w-4 h-4 text-white" />
      </div>
      <span className="hidden sm:block text-sm font-medium">Admin</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700 text-white">
    <DropdownMenuLabel className="text-gray-300">Mon Compte</DropdownMenuLabel>
    <DropdownMenuSeparator className="bg-gray-700" />
    <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
      <Link href="/admin/compte" className="flex items-center w-full">
        <User className="w-4 h-4 mr-2" />
        Mon Compte
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 focus:bg-gray-700 focus:text-white">
      <Settings className="w-4 h-4 mr-2" />
      Paramètres
    </DropdownMenuItem>
    <DropdownMenuSeparator className="bg-gray-700" />
    <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400">
      <LogOut className="w-4 h-4 mr-2" />
      <Link href="/" className="flex items-center w-full">
        Déconnexion
      </Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
              </div>
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>

        {/* Footer sombre */}
        <footer className="bg-gray-900/60 backdrop-blur-sm border-t border-gray-800 mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                   <div className="w-12 h-12 relative">
            <Image
              src="/assets/logo.png"
              alt="ECAT TARATRA Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
                <span className="font-semibold text-gray-300">ECAT TARATRA</span>
              </div>
              <div className="text-sm text-gray-400">
                © 2025 Plateforme Administrative. Tous droits réservés.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

// Composant de lien de navigation sombre
function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-700"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}

// Icônes
function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
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
