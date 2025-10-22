'use client';

import { useEffect, useState } from 'react';
import { Formation } from '@/types/api';
import { formationService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Star, Users, CalendarDays, ArrowRight } from 'lucide-react';

export default function FeaturedFormations() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      const data = await formationService.getAll();
      setFormations(data.slice(0, 3));
      setLoading(false);
    };
    fetchFormations();
  }, []);

  return (
    <section className=" bg-gradient-to-br from-blue-50 via-white to-blue-100  items-center p-8 px-25">
      <div className=" mx-auto px-6 p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100  ">
        {/* Titres style Diplome */}
        <div className="text-center mb-10">
          <h2 className="text-[16px] lg:text-[1rem] font-Poppins font-semibold tracking-wide text-[rgb(242,114,135)] mb-3">
           COURS
          </h2>
          <h1 className="text-[42px] md:text-[4rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight tracking-wide">
            L'Université ecat à votre portée!
          </h1>
         <p className='text-[20px] font-Ingrid font-Darling leading-relaxed tracking-wide text-center'>
            La formation à distance permet aux étudiants de s'affranchir des contraintes..
            Une simple connexion internet suffit pour intégrer à distance une université de renom telle que ECAT Taratra Fianarantsoa.
          </p>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {(loading ? [1, 2, 3] : formations).map((f, idx) =>
            <div
              key={loading ? idx : f.id_formation}
              className="bg-white rounded-3xl border border-[rgb(189,218,254)] shadow-md flex flex-col relative overflow-hidden"
            >
              {/* Image en haut */}
              <div className="h-40 w-full bg-gray-100 relative flex items-center justify-center">
                {loading
                  ? <div className="animate-pulse w-32 h-32 bg-blue-100 rounded-lg"/>
                  : <img
                      src={f.image || "/default.jpg"}
                      alt={f.titre}
                      className="object-cover h-full w-full"
                    />
                }
                {/* Badge durée */}
                {!loading &&
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 font-Poppins font-semibold rounded-full px-3 py-1 text-xs shadow border border-blue-300">
                    3 ans
                  </span>
                }
              </div>
              {/* Infos de la carte */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Ligne stats */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center mr-2">
                    {[...Array(5)].map((_, j) =>
                      <Star key={j} className="w-4 h-4 text-blue-400" fill="#2D7FFB" stroke="none"/>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 font-Poppins">(200)</span>
                  <span className="ml-auto flex gap-1">
                    <Users className="w-4 h-4 text-blue-400"/>
                    <span className="text-xs text-gray-500 font-Poppins">{f.nb_etudiants || 250}</span>
                  </span>
                  <CalendarDays className="w-4 h-4 text-blue-400 ml-4"/>
                  <span className="text-xs text-gray-500 font-Poppins">3 ans</span>
                </div>
                {/* Titre formation */}
                <h3 className="text-[1.5rem] font-Poppins font-bold text-gray-900 leading-tight mt-2 mb-3">
                  {loading ? <div className="animate-pulse w-32 h-5 bg-blue-100 rounded" /> : f.titre}
                </h3>
                {/* Description formation */}
                <p className="text-[18px] font-Ingrid leading-relaxed tracking-wide text-gray-700 mb-6 flex-1">
                  {loading ? <div className="animate-pulse w-full h-4 bg-blue-50 rounded mb-2"/> : f.description}
                </p>
                <Button
                  asChild
                  className="w-full border border-blue-500 bg-white text-blue-700 font-Poppins font-medium rounded-lg py-2 hover:bg-blue-50 transition"
                >
                  <a href={loading ? "#" : `/formation/${f.id_formation}`}>Voir Détails</a>
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* Bouton large bas style Diplome */}
             <div className="text-center  items-center flex justify-center mt-16">
            <button className="border-2 border-blue-700 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-[rgb(0,63,125)] transition duration-300 text-base sm:text-lg  flex items-center justify-center gap-2">
                                                  Choisir la formation qui vous convient
                                                  <ArrowRight className="w-5 h-5" />
                                             </button>
        </div>
      </div>
    </section>
  );
}

