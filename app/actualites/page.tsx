import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ActualiteList from '@/components/ActualiteList';

export const metadata: Metadata = {
  title: 'Actualités - ECAT TARATRA',
  description: 'Restez informé des dernières actualités et événements de ECAT TARATRA.',
};

export default function ActualitesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className=" mx-auto ">
        <ActualiteList />
      </main>
      <Footer />
    </div>
  );
}
