import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'ECAT TARATRA - Plateforme Administrative',
  description: 'Plateforme de gestion des formations et actualités ECAT TARATRA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white">
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
