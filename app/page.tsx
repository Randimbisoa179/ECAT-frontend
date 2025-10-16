// page.tsx ou layout.tsx
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Accueil from '@/components/Accueil';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(0,63,125)] text-gray-900">
      <Navbar />
      {/* Le reste de votre contenu avec des couleurs claires */}
      <main className="w-full h-full mx-auto ">
        <Accueil />
      </main >
      <Footer />
    </div >
  );
}
