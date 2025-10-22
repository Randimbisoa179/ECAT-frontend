'use client';

import { useState, useEffect } from 'react';
import { Formation } from '@/types/api';
import { formationService } from '@/services/api';
import { Calendar, Search, Grid, List, ChevronDown, ChevronUp, Star, Users, CalendarDays, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Faq from './Faq';

export default function FormationList() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedFormation, setExpandedFormation] = useState<number | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

  useEffect(() => {
    filterFormations();
  }, [formations, searchTerm, selectedDomain]);

  const loadFormations = async () => {
    try {
      setLoading(true);
      const data = await formationService.getAll();
      setFormations(data);
    } catch (err) {
      setError('Erreur lors du chargement des formations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterFormations = () => {
    let filtered = formations;

    if (searchTerm) {
      filtered = filtered.filter((formation) =>
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDomain !== 'all') {
      filtered = filtered.filter((formation) => formation.domaine === selectedDomain);
    }

    setFilteredFormations(filtered);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const getDomains = () =>
    [...new Set(formations.map((f) => f.domaine).filter(Boolean))];

  const toggleFormationDetails = (formationId: number) =>
    setExpandedFormation(expandedFormation === formationId ? null : formationId);

  if (error) {
    return (
      <div className="text-center py-24 p-8 px-25">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-10 shadow-sm max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={loadFormations} variant="outline" className="rounded-full">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="  space-y-12 bg-white items-center ">
             <div className="absolute top-40 left-10 opacity-30">
                                             <img
                                                  src="/assets/Group%201000004925.svg"
                                                  alt="Décoration"
                                                  className="w-32 h-32"
                                             />
                                        </div>
                                        <div className="absolute top-10 right-10 opacity-30">
                                             <img
                                                  src="/assets/Group%201000004925.svg"
                                                  alt="Décoration"
                                                  className="w-32 h-32"
                                             />
                                        </div>
      {/* En-tête dans le style Accueil */}
      <section className=" bg-[rgb(0,63,125)] sm:py-32 text-center p-8 px-25 items-center "
      style={{
    backgroundImage: 'linear-gradient(rgba(0,63,125,0.8), rgba(0,63,125,0.8)), url("/assets/img-2.png")'
  }}>
        <div className="mx-auto items-center text-left px-6">
            <h1 className="text-64px md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4 tracking-[O.500rem] text-white">
            Nos Formations Universitaires à Distance
          </h1>
           <p className="mt-8   leading-relaxed  text-white  text-[20px] font-Ingrid font-Darling  tracking-wide text-left tracking-[O.300rem]">
Apprenez où que vous soyez, à votre rythme. L’Université ECAT TARATRA vous offre des formations 100 % à distance, reconnues par l’État malagasy, adaptées à tous les profils et à toutes les ambitions. Nos programmes associent rigueur académique, flexibilité et accompagnement personnalisé, afin de permettre à chacun d’atteindre ses objectifs professionnels sans contrainte géographique.
</p>
        </div>
         <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-12">
                                             <button className="bg-[rgb(13,110,253)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[rgb(11,94,215)] transition duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                                  Trouver un bureau près de chez vous
                                                  <ArrowRight className="w-5 h-5" />
                                             </button>

                                             <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-[rgb(0,63,125)] transition duration-300 text-base sm:text-lg  flex items-center justify-center gap-2">
                                                  Choisir la formation qui vous convient
                                                  <ArrowRight className="w-5 h-5" />
                                             </button>
                                             
                                        </div>
                                         <div className="flex justify-center lg:justify-start mb-6">
                                             <img
                                                  src="/assets/Vector.svg"
                                                  alt="ECAT Logo"
                                                  className="w-12 h-12"
                                             />
                                        </div>
                                        <div className="absolute down-10 left-100 opacity-30">
                                             <img
                                                  src="/assets/Group%201000004925.svg"
                                                  alt="Décoration"
                                                  className="w-32 h-32"
                                             />
                                        </div>
                                  

     

        {/* Domaines */}
        <div className="mt-10 flex flex-wrap justify-center gap-3 px-6 bg-white">
          {getDomains().map((domain) => (
            <Button
              key={domain}
              size="sm"
              onClick={() => setSelectedDomain(domain)}
              className={`rounded-full text-sm font-medium transition-all duration-300 ${
                selectedDomain === domain
                  ? 'bg-white text-white shadow-lg'
                  : 'text-gray-600 bg-white border border-gray-200 hover:bg-blue-50'
              }`}
            >
              {domain}
            </Button>
          ))}
        </div>
      </section>

      {/* Liste de formations avec le style de FeaturedFormations */}
      <section className=" max-w-7xl mx-auto px-6 mb-5">
         {/* Barre de recherche / Filtres */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto px-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <Tabs value={viewMode} onValueChange={(v: 'grid' | 'list') => setViewMode(v)}>
            <TabsList className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <TabsTrigger value="grid" className="flex items-center gap-2">
                <Grid className="w-4 h-4" /> Grille
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" /> Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {loading ? (
          <div className={`gap-7 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-7'}`}>
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[rgb(189,218,254)] shadow-md flex flex-col relative overflow-hidden"
              >
                {/* Image en haut */}
                <div className="h-40 w-full bg-gray-100 relative flex items-center justify-center">
                  <div className="animate-pulse w-32 h-32 bg-blue-100 rounded-lg"/>
                </div>
                {/* Infos de la carte */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Ligne stats */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center mr-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-blue-400" fill="#2D7FFB" stroke="none"/>
                      ))}
                    </span>
                    <span className="text-xs text-gray-500 font-Poppins">(200)</span>
                    <span className="ml-auto flex gap-1">
                      <Users className="w-4 h-4 text-blue-400"/>
                      <span className="text-xs text-gray-500 font-Poppins">250</span>
                    </span>
                    <CalendarDays className="w-4 h-4 text-blue-400 ml-4"/>
                    <span className="text-xs text-gray-500 font-Poppins">3 ans</span>
                  </div>
                  {/* Titre formation */}
                  <h3 className="text-[1.5rem] font-Poppins font-bold text-gray-900 leading-tight mt-2 mb-3">
                    <div className="animate-pulse w-32 h-5 bg-blue-100 rounded" />
                  </h3>
                  {/* Description formation */}
                  <p className="text-[18px] font-Ingrid leading-relaxed tracking-wide text-gray-700 mb-6 flex-1">
                    <div className="animate-pulse w-full h-4 bg-blue-50 rounded mb-2"/>
                  </p>
                  <div className="animate-pulse w-full h-10 bg-blue-100 rounded-lg"/>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFormations.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white border border-gray-200 rounded-3xl p-10 max-w-md mx-auto shadow-sm">
              <div className="text-blue-600 text-6xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune formation disponible</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDomain !== 'all'
                  ? "Aucune formation ne correspond à vos critères."
                  : "Les formations seront bientôt disponibles."}
              </p>
            </div>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7' : 'space-y-7'}`}>
            {filteredFormations.map((formation) => (
              <div
                key={formation.id_formation}
                className="bg-white rounded-3xl border border-[rgb(189,218,254)] shadow-md flex flex-col relative overflow-hidden"
              >
                {/* Image en haut */}
                <div className="h-40 w-full bg-gray-100 relative flex items-center justify-center">
                  <img
                    src={formation.image || "/default.jpg"}
                    alt={formation.titre}
                    className="object-cover h-full w-full"
                  />
                  {/* Badge durée */}
                  <span className="absolute top-3 right-3 bg-blue-100 text-blue-700 font-Poppins font-semibold rounded-full px-3 py-1 text-xs shadow border border-blue-300">
                    3 ans
                  </span>
                </div>
                {/* Infos de la carte */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Ligne stats */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center mr-2">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-blue-400" fill="#2D7FFB" stroke="none"/>
                      ))}
                    </span>
                    <span className="text-xs text-gray-500 font-Poppins">(200)</span>
                    <span className="ml-auto flex gap-1">
                      <Users className="w-4 h-4 text-blue-400"/>
                      <span className="text-xs text-gray-500 font-Poppins">{formation.nb_etudiants || 250}</span>
                    </span>
                    <CalendarDays className="w-4 h-4 text-blue-400 ml-4"/>
                    <span className="text-xs text-gray-500 font-Poppins">3 ans</span>
                  </div>
                  {/* Titre formation */}
                  <h3 className="text-[1.5rem] font-Poppins font-bold text-gray-900 leading-tight mt-2 mb-3">
                    {formation.titre}
                  </h3>
                  {/* Description formation */}
                  <p className="text-[18px] font-Ingrid leading-relaxed tracking-wide text-gray-700 mb-6 flex-1">
                    {formation.description}
                  </p>
                  
                  {/* Bouton Voir Détails avec fonctionnalité d'expansion */}
                  <Button
                    onClick={() => toggleFormationDetails(formation.id_formation)}
                    className="w-full border border-blue-500 bg-white text-blue-700 font-Poppins font-medium rounded-lg py-2 hover:bg-blue-50 transition"
                  >
                    {expandedFormation === formation.id_formation ? (
                      <>Masquer les détails</>
                    ) : (
                      <>Voir Détails</>
                    )}
                  </Button>

                  {/* Détails supplémentaires */}
                  {expandedFormation === formation.id_formation && (
                    <div className="mt-4 border-t border-gray-200 pt-4 animate-in fade-in duration-300">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        Programme de la formation :
                      </h4>
                      {formation.programme ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-700 text-sm leading-relaxed">
                          {formation.programme.split('\n').map((p, i) => (
                            <p key={i} className="mb-1 last:mb-0">
                              {p}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                          <p className="text-yellow-700 text-sm">
                            Le programme détaillé n'est pas encore disponible.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
       {/* Section statistiques */}
                    <section className="py-16 bg-[rgb(189,218,254)]">
                         <div className="container mx-auto px-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center   tracking-wide ">
                                   {/* Texte des statistiques: Utilisez 45px (H3) ou 32px (H4) selon la hiérarchie désirée. J'utilise 45px (2.812rem) pour le chiffre, et 16px (1rem) pour la description. */}
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+500</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Étudiants en cours</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+1500</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Diplômes délivrés</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">20/24</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Régions actives</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+30</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Enseignants</div>
                                   </div>
                              </div>
                         </div>
                    </section>
                    
  <Faq />
    </div>
  );
}
