'use client';

import { useState, useEffect } from 'react';
import { Actualite } from '@/types/api';
import { actualiteService } from '@/services/api';
import { Calendar, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActualiteList() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [filteredActualites, setFilteredActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadActualites();
  }, []);

  useEffect(() => {
    filterActualites();
  }, [actualites, searchTerm, selectedCategory]);

  const loadActualites = async () => {
    try {
      setLoading(true);
      const data = await actualiteService.getAll();
      setActualites(data);
    } catch (err) {
      setError('Erreur lors du chargement des actualités');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterActualites = () => {
    let filtered = actualites;

    if (searchTerm) {
      filtered = filtered.filter(actualite =>
        actualite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actualite.contenu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(actualite => actualite.categorie === selectedCategory);
    }

    setFilteredActualites(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTimeToRead = (content: string) => {
    const words = content?.split(' ').length || 0;
    return Math.ceil(words / 200);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-semibold mb-2">Erreur</div>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadActualites} variant="outline">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec recherche et filtres */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Actualités</h1>
          <p className="text-gray-600">Restez informé des dernières nouvelles</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher une actualité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-blue">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActualites.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune actualité trouvée</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Aucune actualité ne correspond à vos critères de recherche.'
                  : 'Aucune actualité disponible pour le moment.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredActualites.map((actualite) => (
              <article
                key={actualite.id_actualite}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {actualite.image && (
                    <div className="lg:w-1/3">
                      <div className="relative overflow-hidden rounded-xl aspect-video lg:aspect-square">
                        <img
                          src={actualite.image}
                          alt={actualite.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className={`flex-1 ${actualite.image ? 'lg:w-2/3' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
