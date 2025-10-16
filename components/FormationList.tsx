'use client';

import { useState, useEffect } from 'react';
import { Formation } from '@/types/api';
import { formationService } from '@/services/api';
import { Calendar, Star, Search, Grid, List, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      filtered = filtered.filter(formation =>
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDomain !== 'all') {
      filtered = filtered.filter(formation => formation.domaine === selectedDomain);
    }

    setFilteredFormations(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDomains = () => {
    const domains = [...new Set(formations.map(f => f.domaine).filter(Boolean))];
    return domains;
  };

  const toggleFormationDetails = (formationId: number) => {
    setExpandedFormation(expandedFormation === formationId ? null : formationId);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-semibold mb-2">Erreur</div>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadFormations} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec recherche et filtres */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nos Formations</h1>
          <p className="text-gray-600">Développez vos compétences avec nos programmes pour être candidat à l'obtention d'un diplôme universitaire avec l'université ECAT</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-6xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          
          <div className="flex gap-3">
            <Tabs value={viewMode} onValueChange={(v: 'grid' | 'list') => setViewMode(v)}>
              <TabsList className="bg-white border border-gray-200">
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Grille
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Liste
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Filtres par domaine */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          
          {getDomains().map(domain => (
            <Button
              key={domain}
              variant={selectedDomain === domain ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDomain(domain)}
              className={selectedDomain === domain 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            >
              {domain}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border border-gray-200">
                <Skeleton className="h-48 w-full bg-gray-200" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-5/6 mb-4 bg-gray-200" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-4 w-16 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFormations.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto border border-gray-200 shadow-sm">
              <div className="text-gray-300 text-6xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDomain !== 'all' 
                  ? 'Aucune formation ne correspond à vos critères de recherche.'
                  : 'Aucune formation disponible pour le moment.'}
              </p>
            </div>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredFormations.map((formation) => (
              <Card 
                key={formation.id_formation} 
                className={`overflow-hidden border border-gray-200 bg-white transition-all duration-300 ${
                  expandedFormation === formation.id_formation 
                    ? 'shadow-lg border-blue-300' 
                    : 'hover:shadow-lg hover:border-blue-300'
                }`}
              >
                {formation.image && (
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={formation.image}
                      alt={formation.titre}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/95 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-sm">
                        {formation.domaine || 'Formation'}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {formation.titre}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {formation.description || 'Aucune description disponible'}
                  </p>

                  {viewMode === 'list' && formation.image && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={formation.image}
                          alt={formation.titre}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-600 text-sm line-clamp-4">
                          {formation.description || 'Aucune description disponible'}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(formation.date_inscription)}
                    </div>
                   
                  </div>
                </CardContent>
                
                <CardFooter className="px-6 pb-6 pt-0 flex flex-col gap-4">
                  <Button 
                    onClick={() => toggleFormationDetails(formation.id_formation)}
                    className="w-full group/btn bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {expandedFormation === formation.id_formation ? (
                      <>
                        Masquer les détails
                        <ChevronUp className="w-4 h-4 ml-2 group-hover/btn:translate-y-[-1px] transition-transform" />
                      </>
                    ) : (
                      <>
                        Voir les détails
                        <ChevronDown className="w-4 h-4 ml-2 group-hover/btn:translate-y-[1px] transition-transform" />
                      </>
                    )}
                  </Button>

                  {/* Programme détaillé */}
                  {expandedFormation === formation.id_formation && (
                    <div className="w-full animate-in fade-in duration-300">
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Programme de la formation :</h4>
                        {formation.programme ? (
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="prose max-w-none text-gray-700 text-sm">
                              {formation.programme.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-2 last:mb-0 leading-relaxed">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                            <p className="text-yellow-700 text-sm">
                              Le programme détaillé n'est pas encore disponible.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
