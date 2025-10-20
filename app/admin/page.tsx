'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Newspaper, TrendingUp, Eye, Calendar, Clock, Info, User, Mail, MessageSquare, Building, BookOpen, Contact, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    formations: 0,
    actualites: 0,
    recentFormations: 0,
    recentActualites: 0,
    aboutContent: 0,
    directors: 0,
    contactInfo: 0,
    contactMessages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const endpoints = [
        'http://localhost:5000/api/formations',
        'http://localhost:5000/api/actualites',
        'http://localhost:5000/api/about-content',
        'http://localhost:5000/api/directors',
        'http://localhost:5000/api/contact-info',
        'http://localhost:5000/api/contact-messages'
      ];

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [
        formationsRes,
        actualitesRes,
        aboutRes,
        directorsRes,
        contactInfoRes,
        messagesRes
      ] = await Promise.all(
        endpoints.map(endpoint => 
          fetch(endpoint, { headers }).then(res => res.json())
        )
      );

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const unreadMessages = messagesRes.filter((msg: any) => !msg.is_read);

      setStats({
        formations: formationsRes.length || 0,
        actualites: actualitesRes.length || 0,
        recentFormations: formationsRes.filter((f: any) => 
          new Date(f.date_inscription || f.created_at) > oneWeekAgo
        ).length,
        recentActualites: actualitesRes.filter((a: any) => 
          new Date(a.date_publication || a.created_at) > oneWeekAgo
        ).length,
        aboutContent: aboutRes.length || 0,
        directors: directorsRes.length || 0,
        contactInfo: contactInfoRes.length || 0,
        contactMessages: messagesRes.length || 0,
        unreadMessages: unreadMessages.length
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tableau de Bord Administratif
          </h1>
          <p className="text-gray-300 text-xl">
            Bienvenue sur la plateforme de gestion ECAT TARATRA
          </p>
          <div className="flex gap-4 pt-4">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {stats.formations} Formations
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {stats.actualites} Actualités
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              {stats.contactMessages} Messages
            </Badge>
          </div>
        </div>
      </div>

  {/* Alertes */}
      {stats.unreadMessages > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-yellow-500/20">
                <MessageSquare className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-300">
                  {stats.unreadMessages} message(s) non lu(s)
                </h3>
                <p className="text-yellow-200/80">
                  Vous avez des messages en attente de lecture dans votre boîte de réception
                </p>
              </div>
            </div>
            <Link href="/admin/messages">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-500/25">
                <Eye className="w-4 h-4 mr-2" />
                Voir les messages
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Formations"
          value={stats.formations}
          description="Total des formations"
          icon={<BookOpen className="w-6 h-6" />}
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
          title="Messages"
          value={stats.contactMessages}
          description="Messages reçus"
          icon={<MessageSquare className="w-6 h-6" />}
          color="green"
          trend={stats.unreadMessages}
          trendLabel="non lus"
          actionHref="/admin/messages"
          highlight={stats.unreadMessages > 0}
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

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="À Propos"
          value={stats.aboutContent}
          description="Sections de contenu"
          icon={<Info className="w-5 h-5" />}
          color="blue"
          actionHref="/admin/about"
          small
        />
        <StatCard
          title="Directeurs"
          value={stats.directors}
          description="Équipe de direction"
          icon={<User className="w-5 h-5" />}
          color="purple"
          actionHref="/admin/directors"
          small
        />
        <StatCard
          title="Coordonnées"
          value={stats.contactInfo}
          description="Infos de contact"
          icon={<Contact className="w-5 h-5" />}
          color="green"
          actionHref="/admin/contacts"
          small
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActionCard
          title="Gestion des Formations"
          description="Créez et gérez votre catalogue de formations"
          icon={<BookOpen className="w-8 h-8" />}
          color="blue"
          actions={[
            { label: 'Voir toutes', href: '/admin/formations', variant: 'default' as const },
            { label: 'Nouvelle formation', href: '/admin/formations', variant: 'outline' as const, icon: <Plus className="w-4 h-4" /> }
          ]}
          stats={[
            { label: 'Total', value: `${stats.formations} formations` },
            { label: 'Nouvelles', value: `+${stats.recentFormations} cette semaine` }
          ]}
        />

        <QuickActionCard
          title="Actualités & Communications"
          description="Publiez vos annonces et actualités"
          icon={<Newspaper className="w-8 h-8" />}
          color="purple"
          actions={[
            { label: 'Voir les actualités', href: '/admin/actualites', variant: 'default' as const },
            { label: 'Nouvelle actualité', href: '/admin/actualites', variant: 'outline' as const, icon: <Plus className="w-4 h-4" /> }
          ]}
          stats={[
            { label: 'Total', value: `${stats.actualites} publications` },
            { label: 'Nouvelles', value: `+${stats.recentActualites} cette semaine` }
          ]}
        />

        <QuickActionCard
          title="Contenu Institutionnel"
          description="Gérez les informations de l'établissement"
          icon={<Building className="w-8 h-8" />}
          color="gray"
          actions={[]}
          quickLinks={[
            { label: 'À Propos', href: '/admin/about', icon: <Info className="w-4 h-4" /> },
            { label: 'Directeurs', href: '/admin/directors', icon: <User className="w-4 h-4" /> },
            { label: 'Coordonnées', href: '/admin/contacts', icon: <Contact className="w-4 h-4" /> },
            { 
              label: 'Messages', 
              href: '/admin/messages', 
              icon: <MessageSquare className="w-4 h-4" />,
              badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined
            }
          ]}
        />
      </div>

    

      {/* Performance */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-200">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span>Performance du Système</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Statistiques de performance et disponibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="text-3xl font-bold text-green-400">99.8%</div>
              <div className="text-sm text-green-300 mt-2">Disponibilité</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400">1.2s</div>
              <div className="text-sm text-blue-300 mt-2">Temps de réponse</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">0</div>
              <div className="text-sm text-purple-300 mt-2">Erreurs système</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant Carte de Statistique
function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  color, 
  trend, 
  trendLabel,
  actionHref,
  highlight = false,
  small = false
}: { 
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'green' | 'orange';
  trend?: number;
  trendLabel?: string;
  actionHref?: string;
  highlight?: boolean;
  small?: boolean;
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

  const highlightClasses = highlight ? 'ring-2 ring-green-500/50 shadow-lg shadow-green-500/25' : '';

  const content = (
    <Card className={`group hover:scale-105 transition-all duration-300 border-gray-700 bg-gray-800/60 backdrop-blur-sm ${highlightClasses}`}>
      <CardHeader className={`pb-4 ${small ? 'pb-3' : ''}`}>
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-xl border ${bgColorClasses[color]} ${small ? 'p-2' : 'p-3'}`}>
            {icon}
          </div>
          {trend !== undefined && trend > 0 && (
            <Badge variant="secondary" className={`${bgColorClasses[color]} text-xs`}>
              +{trend}
            </Badge>
          )}
        </div>
        <CardTitle className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${small ? 'text-2xl' : 'text-3xl'}`}>
          {value}
        </CardTitle>
        <CardDescription className={`font-medium text-gray-300 ${small ? 'text-sm' : 'text-base'}`}>
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className={small ? 'pt-0' : ''}>
        <p className={`text-gray-400 mb-3 ${small ? 'text-xs' : 'text-sm'}`}>{description}</p>
        {trendLabel && trend !== undefined && trend > 0 && (
          <p className={`text-gray-500 flex items-center space-x-1 ${small ? 'text-xs' : 'text-sm'}`}>
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

// Composant Carte Action Rapide
function QuickActionCard({
  title,
  description,
  icon,
  color,
  actions,
  stats,
  quickLinks
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'gray';
  actions?: Array<{ label: string; href: string; variant: 'default' | 'outline'; icon?: React.ReactNode }>;
  stats?: Array<{ label: string; value: string }>;
  quickLinks?: Array<{ label: string; href: string; icon: React.ReactNode; badge?: number }>;
}) {
  const colorClasses = {
    blue: 'from-blue-900/50 to-blue-800/30 border-blue-700/50',
    purple: 'from-purple-900/50 to-purple-800/30 border-purple-700/50',
    gray: 'from-gray-800 to-gray-900/50 border-gray-700'
  };

  const textColors = {
    blue: 'text-blue-300',
    purple: 'text-purple-300',
    gray: 'text-gray-300'
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border shadow-xl hover:shadow-2xl transition-all duration-300`}>
      <CardHeader>
        <CardTitle className={`flex items-center space-x-3 ${textColors[color]}`}>
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats && (
          <div className="space-y-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-400">{stat.label}</span>
                <span className={`font-semibold ${textColors[color]}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {actions && actions.length > 0 && (
          <div className="flex space-x-3 pt-2">
            {actions.map((action, index) => (
              <Link key={index} href={action.href} className="flex-1">
                <Button 
                  variant={action.variant} 
                  className={`w-full ${
                    action.variant === 'default' 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-700/50 bg-gray-700/50 '
                  }`}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        )}

        {quickLinks && (
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 h-10 text-sm bg-gray-700/50 ">
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                  {link.badge && (
                    <Badge variant="secondary" className="ml-1 bg-red-500 text-white text-xs px-1 py-0 min-w-4 h-4">
                      {link.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
