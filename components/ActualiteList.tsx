'use client';

import { useState, useEffect } from 'react';
import { Actualite } from '@/types/api';
import { actualiteService } from '@/services/api';

export default function ActualiteList() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActualites();
  }, []);

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

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-6">
      {actualites.map((actualite) => (
        <article key={actualite.id_actualite} className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-3">{actualite.titre}</h2>
          <div className="prose max-w-none mb-4">
            {actualite.contenu || 'Aucun contenu disponible'}
          </div>
          {actualite.image && (
            <img
              src={actualite.image}
              alt={actualite.titre}
              className="w-full max-w-2xl h-64 object-cover rounded mb-4"
            />
          )}
          <div className="text-sm text-gray-500">
            Publié le: {new Date(actualite.date_publication).toLocaleDateString()}
          </div>
        </article>
      ))}
    </div>
  );
}