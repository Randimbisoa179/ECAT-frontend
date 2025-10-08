'use client';

import { useState, useEffect } from 'react';
import { formationService, actualiteService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Newspaper, TrendingUp, Eye, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    formations: 0,
    actualites: 0,
    recentFormations: 0,
    recentActualites: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [formations, actualites] = await Promise.all([
        formationService.getAll(),
        actualiteService.getAll()
      ]);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setStats({
        formations: formations.length,
        actualites: actualites.length,
        recentFormations: formations.filter(f => 
          new Date(f.date_inscription) > oneWeekAgo
        ).length,
        recentActualites: actualites.filter(a => 
          new Date(a.date_publication) > oneWeekAgo
        ).length
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête sombre */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-lg">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tableau de Bord Administratif
          </h1>
          <p className="text-gray-300 text-lg">
            Bienvenue sur la plateforme de gestion ECAT TARATRA
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Formations"
          value={stats.formations}
          description="Total des formations"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={stats.recentFormations}
          trendLabel="nouvelles cette semaine"
          actionHref="/admin/formations"
        />
        <StatCard
          title="Actualités"
          value={stats.actualites}
          description="Total des publications"
          icon={<Newspaper className="w-6 h-6" />}
          color="purple"
          trend={stats.recentActualites}
          trendLabel="nouvelles cette semaine"
          actionHref="/admin/actualites"
        />
        <StatCard
          title="Engagement"
          value="+24%"
          description="Croissance mensuelle"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={8}
          trendLabel="visites aujourd'hui"
        />
        <StatCard
          title="Performance"
          value="99.8%"
          description="Taux de disponibilité"
          icon={<Eye className="w-6 h-6" />}
          color="orange"
          trend={0.2}
          trendLabel="amélioration"
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-400">
              <Users className="w-5 h-5" />
              <span>Gestion des Formations</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gérez votre catalogue de formations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              Créez, modifiez et organisez vos formations professionnelles
            </p>
            <div className="flex space-x-3">
              <Link href="/admin/formations">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                  Voir toutes les formations
                </Button>
              </Link>
              <Link href="/admin/formations">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle formation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-400">
              <Newspaper className="w-5 h-5" />
              <span>Actualités & Communications</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Publiez vos annonces et actualités
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              Informez votre audience des dernières nouveautés
            </p>
            <div className="flex space-x-3">
              <Link href="/admin/actualites">
                <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25">
                  Voir les actualités
                </Button>
              </Link>
              <Link href="/admin/actualites">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle actualité
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Composant Carte de Statistique sombre
function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  color, 
  trend, 
  trendLabel,
  actionHref 
}: { 
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
  trend?: number;
  trendLabel?: string;
  actionHref?: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const bgColorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  const content = (
    <Card className="hover:shadow-2xl transition-all duration-300 border-gray-700 bg-gray-800/60 backdrop-blur-sm group hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl border ${bgColorClasses[color]}`}>
            {icon}
          </div>
          {trend !== undefined && (
            <Badge variant="secondary" className={`${bgColorClasses[color]} text-xs`}>
              +{trend}
            </Badge>
          )}
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent group-hover:scale-105 transition-transform">
          {value}
        </CardTitle>
        <CardDescription className="text-base font-medium text-gray-300">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        {trendLabel && (
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{trendLabel}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (actionHref) {
    return (
      <Link href={actionHref} className="block hover:scale-105 transition-transform duration-300">
        {content}
      </Link>
    );
  }

  return content;
}

// Icône Plus
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}