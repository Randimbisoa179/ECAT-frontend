// page.tsx ou layout.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      {/* Le reste de votre contenu avec des couleurs claires */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenue sur ECAT TARATRA</h1>
        
       
      </main>
       <Footer />
    </div>
  );
}
