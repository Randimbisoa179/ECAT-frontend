// page.tsx ou layout.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutContent from '@/components/AboutContent';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      {/* Le reste de votre contenu avec des couleurs claires */}
      <main className=" mx-auto ">
        
       <AboutContent />
      </main>
       <Footer />
    </div>
  );
}
