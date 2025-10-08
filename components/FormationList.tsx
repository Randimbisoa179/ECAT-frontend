'use client';

import { useState, useEffect } from 'react';
import { Formation } from '@/types/api';
import { formationService } from '@/services/api';

export default function FormationList() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

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

  if (loading) return <div className="text-center py-8">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formations.map((formation) => (
        <div key={formation.id_formation} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">{formation.titre}</h3>
          <p className="text-gray-600 mb-4">
            {formation.description || 'Aucune description disponible'}
          </p>
          {formation.image && (
            <img
              src={formation.image}
              alt={formation.titre}
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          <div className="text-sm text-gray-500">
            Créé le: {new Date(formation.date_inscription).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}