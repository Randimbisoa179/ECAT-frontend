// components/AboutContent.tsx
'use client';

import { useState, useEffect } from 'react';
import { AboutContentBase, DirectorUpdate } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  RefreshCw,
  Mail,
  Calendar,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function AboutContent() {
  const [aboutContent, setAboutContent] = useState<AboutContentBase | null>(null);
  const [directors, setDirectors] = useState<DirectorUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Tentative de chargement des données...');

      // === About content ===
      const aboutResponse = await fetch(`${API_BASE_URL}/about-content`, {
        headers: { Accept: 'application/json' },
      });

      console.log('📊 Statut de la réponse About:', aboutResponse.status);
      if (!aboutResponse.ok)
        throw new Error(`Erreur About (${aboutResponse.status})`);

      const aboutJson = await aboutResponse.json();
      // ✅ Gérer tableau ou objet
      const aboutData = Array.isArray(aboutJson) ? aboutJson[0] : aboutJson;
      console.log('✅ Données About reçues:', aboutData);

      // === Directors ===
      const directorsResponse = await fetch(`${API_BASE_URL}/directors`, {
        headers: { Accept: 'application/json' },
      });

      console.log('📊 Statut de la réponse Directors:', directorsResponse.status);
      if (!directorsResponse.ok)
        throw new Error(`Erreur Directors (${directorsResponse.status})`);

      const directorsData = await directorsResponse.json();
      console.log('✅ Données Directors reçues:', directorsData);

      setAboutContent(aboutData);
      setDirectors(directorsData);
      console.log('🎉 Données chargées avec succès!');
    } catch (err: any) {
      console.error('💥 Erreur détaillée:', err);
      setError(err.message || 'Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // === ÉTATS ===
  if (loading) return <AboutSkeleton />;

  if (error)
    return (
      <div className="min-h-screen bg-white">
        <div className=" mx-auto ">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Erreur de chargement</p>
              <p className="text-sm">{error}</p>
              <ul className="list-disc list-inside text-xs mt-3 space-y-1">
                <li>Vérifie que le serveur FastAPI tourne</li>
                <li>Regarde la console (F12) pour les logs</li>
                <li>Vérifie les routes `/api/about-content` et `/api/directors`</li>
              </ul>
            </AlertDescription>
          </Alert>
          <Button
            onClick={loadAboutData}
            className="bg-blue-600 hover:bg-blue-700 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
          </Button>
        </div>
      </div>
    );

  // === RENDU PRINCIPAL ===
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <section className="bg-[rgb(0,63,125)] text-white py-20 relative overflow-hidden mb-6">
        <div className=" mx-auto px-4 relative z-10 text-center ">
          <h1 className="text-5xl font-bold mb-6">
            À propos de <span className="text-blue-700">ECAT TARATRA</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Découvrez notre mission, notre vision et notre équipe de direction
          </p>
        </div>
      </section>

      {/* CONTENU */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {aboutContent && (
          <div className="space-y-16 mb-20">
            {/* TITRE */}
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-blue-900 mb-8">
                {aboutContent.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {aboutContent.description}
              </p>
            </div>

            {/* MISSION & VISION */}
            <div className="grid lg:grid-cols-2 gap-8">
              {aboutContent.mission && (
                <Card className="bg-blue-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-blue-900">
                      🎯 Notre Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg text-center">
                      {aboutContent.mission}
                    </p>
                  </CardContent>
                </Card>
              )}

              {aboutContent.vision && (
                <Card className="bg-purple-50 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-purple-900">
                      👁️ Notre Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-lg text-center">
                      {aboutContent.vision}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* HISTOIRE */}
            {aboutContent.history && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gray-900">
                    Notre Histoire
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-600">
                    Le parcours qui a façonné notre institution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg text-center">
                    {aboutContent.history}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ÉQUIPE DE DIRECTION */}
        {directors.length > 0 && (
          <div className="space-y-16">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Notre Équipe de Direction
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Les leaders qui guident notre institution vers l’excellence
              </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {directors.map((director, index) => (
                <DirectorCard key={director.email || index} director={director} />
              ))}
            </div>
          </div>
        )}

        {/* BOUTON ACTUALISER */}
        <div className="text-center mt-16">
          <Button
            onClick={loadAboutData}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Actualiser les données
          </Button>
        </div>
      </div>
    </div>
  );
}

// === DIRECTOR CARD ===
function DirectorCard({ director }: { director: DirectorUpdate }) {
  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          {director.photo_url ? (
            <img
              src={director.photo_url}
              alt={director.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 shadow-2xl">
              <span className="text-4xl text-blue-600">👤</span>
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">{director.name}</h3>
          {director.title && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-base font-medium">
              {director.title}
            </Badge>
          )}
        </div>

        <div className="space-y-4 text-left">
          {director.email && (
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-blue-500" />
              <a
                href={`mailto:${director.email}`}
                className="hover:text-blue-600 transition-colors"
              >
                {director.email}
              </a>
            </div>
          )}
          {director.start_date && (
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>En poste depuis {formatDate(director.start_date)}</span>
            </div>
          )}
        </div>

        {director.bio && (
          <p className="mt-6 text-gray-700 leading-relaxed text-left">
            {director.bio}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// === SKELETON ===
function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[rgb(0,63,125)] text-white py-20">
        <div className="text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-6 bg-blue-200" />
          <Skeleton className="h-6 w-1/2 mx-auto bg-blue-200" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-12">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

