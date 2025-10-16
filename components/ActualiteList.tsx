'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Actualite } from '@/types/api';
import { actualiteService } from '@/services/api';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Filter, 
  X, 
  Eye,
  BookOpen,
  TrendingUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types pour les statistiques
interface ActualiteStats {
  total: number;
  parCategorie: { [key: string]: number };
  plusRecente: string;
}

// Déplacer formatDate en dehors du composant pour éviter les problèmes d'ordre
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function ActualiteList() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [filteredActualites, setFilteredActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [isClient, setIsClient] = useState(false);

  // Détecter si on est côté client
  useEffect(() => {
    setIsClient(true);
    loadActualites();
  }, []);

  // Calcul des statistiques mémoïsées
  const stats = useMemo((): ActualiteStats => {
    const parCategorie: { [key: string]: number } = {};
    let plusRecente = '';

    actualites.forEach(actualite => {
      // Compter par catégorie
      const categorie = actualite.categorie || 'Non catégorisé';
      parCategorie[categorie] = (parCategorie[categorie] || 0) + 1;

      // Trouver la plus récente
      if (!plusRecente || actualite.date_publication > plusRecente) {
        plusRecente = actualite.date_publication;
      }
    });

    return {
      total: actualites.length,
      parCategorie,
      plusRecente: plusRecente ? formatDate(plusRecente) : 'Aucune'
    };
  }, [actualites]);

  // Catégories uniques mémoïsées
  const categories = useMemo(() => {
    return Array.from(new Set(actualites.map(actualite => actualite.categorie).filter(Boolean))) as string[];
  }, [actualites]);

  // Chargement des actualités
  const loadActualites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Chargement des actualités...');
      const data = await actualiteService.getAll();
      console.log('Actualités chargées:', data);
      setActualites(data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Erreur lors du chargement des actualités');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrage et tri mémoïsés
  useEffect(() => {
    let filtered = [...actualites];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(actualite =>
        actualite.titre.toLowerCase().includes(term) ||
        actualite.contenu?.toLowerCase().includes(term) ||
        actualite.categorie?.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(actualite => actualite.categorie === selectedCategory);
    }

    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date_publication).getTime() - new Date(a.date_publication).getTime();
      } else {
        return a.titre.localeCompare(b.titre);
      }
    });

    setFilteredActualites(filtered);
  }, [actualites, searchTerm, selectedCategory, sortBy]);

  // Temps de lecture
  const getTimeToRead = useCallback((content: string) => {
    const words = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  }, []);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);

  // Afficher un état de chargement simple côté serveur
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-purple-300 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400">Chargement des actualités...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Erreur de chargement
            </CardTitle>
            <CardDescription>
              Impossible de charger les actualités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-500 text-sm">{error}</p>
            <Button onClick={loadActualites} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header amélioré */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 px-4 mb-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <BookOpen className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Actualités
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Restez informé des dernières nouvelles et événements importants
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        {/* Cartes de statistiques */}
        {!loading && actualites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-600">Actualités au total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                    <p className="text-sm text-gray-600">Catégories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{stats.plusRecente}</p>
                    <p className="text-sm text-gray-600">Plus récente</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Barre de contrôle */}
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200/50 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Recherche */}
              <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par titre, contenu ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>

              {/* Contrôles */}
              <div className="flex flex-wrap gap-3">
                {/* Filtre par catégorie */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {selectedCategory === 'all' ? 'Toutes catégories' : selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-60">
                      <DropdownMenuItem onClick={() => setSelectedCategory('all')}>
                        <div className="flex items-center gap-2 w-full">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <span>Toutes les catégories</span>
                          <Badge variant="secondary" className="ml-auto">
                            {stats.total}
                          </Badge>
                        </div>
                      </DropdownMenuItem>
                      {categories.map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: `hsl(${category.length * 30}, 70%, 50%)` 
                              }}
                            />
                            <span>{category}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {stats.parCategorie[category]}
                            </Badge>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tri */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Trier par {sortBy === 'date' ? 'date' : 'titre'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('date')}>
                      Date (récent)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('title')}>
                      Titre (A-Z)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mode de vue */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    Liste
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    Grille
                  </Button>
                </div>

                {/* Effacer les filtres */}
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Effacer
                  </Button>
                )}
              </div>
            </div>

            {/* Filtres actifs */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchTerm && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-3 py-1">
                    🔍 "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
                    📁 {selectedCategory}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">
              {loading ? (
                "Chargement..."
              ) : (
                <>
                  <span className="text-gray-900 font-semibold">{filteredActualites.length}</span>
                  {filteredActualites.length === 1 ? ' actualité trouvée' : ' actualités trouvées'}
                  {selectedCategory !== 'all' && (
                    <span className="text-gray-500"> dans "{selectedCategory}"</span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'space-y-6'}`}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white border-gray-200 overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredActualites.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' ? 'Aucun résultat' : 'Aucune actualité'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Aucune actualité ne correspond à vos critères de recherche.'
                  : 'Aucune actualité disponible pour le moment.'}
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button onClick={clearFilters}>
                  Afficher toutes les actualités
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          // Vue grille
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActualites.map((actualite) => (
              <ActualiteCard 
                key={actualite.id_actualite} 
                actualite={actualite} 
                getTimeToRead={getTimeToRead}
              />
            ))}
          </div>
        ) : (
          // Vue liste
          <div className="space-y-6">
            {filteredActualites.map((actualite) => (
              <ActualiteListItem 
                key={actualite.id_actualite} 
                actualite={actualite} 
                getTimeToRead={getTimeToRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Carte pour la vue grille
interface ActualiteCardProps {
  actualite: Actualite;
  getTimeToRead: (content: string) => number;
}

function ActualiteCard({ actualite, getTimeToRead }: ActualiteCardProps) {
  return (
    <Card className="group bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      {actualite.image && (
        <div className="relative overflow-hidden aspect-video">
          <img
            src={actualite.image}
            alt={actualite.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0">
              {actualite.categorie || 'Général'}
            </Badge>
          </div>
        </div>
      )}
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          {formatDate(actualite.date_publication)}
          {actualite.contenu && (
            <>
              <span>•</span>
              <Clock className="w-4 h-4" />
              {getTimeToRead(actualite.contenu)} min
            </>
          )}
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {actualite.titre}
        </h3>

        <div className="prose prose-sm max-w-none text-gray-600 mb-4 flex-1">
          {actualite.contenu ? (
            <p className="line-clamp-3 leading-relaxed">
              {actualite.contenu}
            </p>
          ) : (
            <p className="text-gray-400 italic">Aucun contenu disponible</p>
          )}
        </div>

        <Button variant="ghost" className="w-fit px-0 hover:bg-transparent group/btn mt-auto">
          Lire la suite
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Composant Item pour la vue liste
function ActualiteListItem({ actualite, getTimeToRead }: ActualiteCardProps) {
  return (
    <Card className="group bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {actualite.image && (
            <div className="lg:w-1/3 relative">
              <div className="relative overflow-hidden aspect-video lg:aspect-square lg:h-full">
                <img
                  src={actualite.image}
                  alt={actualite.titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0">
                    {actualite.categorie || 'Général'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className={`p-6 ${actualite.image ? 'lg:w-2/3' : 'w-full'}`}>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {actualite.categorie || 'Général'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(actualite.date_publication)}
              </div>
              {actualite.contenu && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {getTimeToRead(actualite.contenu)} min
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {actualite.titre}
            </h2>

            <div className="prose max-w-none mb-4 text-gray-600 leading-relaxed">
              {actualite.contenu ? (
                <p className="line-clamp-3">
                  {actualite.contenu}
                </p>
              ) : (
                <p className="text-gray-400 italic">Aucun contenu disponible</p>
              )}
            </div>

            <Button variant="ghost" className="group/btn px-0 hover:bg-transparent">
              Lire la suite
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
