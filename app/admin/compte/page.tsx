'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { User, Mail, Calendar, Shield, Edit3, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { notificationService } from '@/lib/notifications';
import { AuthService } from '@/lib/auth';

interface AdminData {
  id_admin: number;
  nom: string;
  email: string;
  role?: string;
  date_creation?: string;
}

export default function ComptePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admins/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // S'assurer que les données ont la structure attendue avec des valeurs par défaut
        const adminData: AdminData = {
          id_admin: data.id_admin,
          nom: data.nom,
          email: data.email,
          role: data.role || 'admin',
          date_creation: data.date_creation || new Date().toISOString(),
        };
        
        setAdminData(adminData);
        setFormData({
          nom: data.nom,
          email: data.email,
          password: '',
          confirmPassword: ''
        });
      } else {
        throw new Error('Erreur lors du chargement des données');
      }
    } catch (err) {
      notificationService.error('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      notificationService.error('Les mots de passe ne correspondent pas');
      return;
    }

    setSubmitting(true);
    try {
      const token = AuthService.getToken();
      const updateData: any = {
        nom: formData.nom,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`http://localhost:5000/api/admins/${adminData?.id_admin}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedAdmin = await response.json();
        setAdminData(updatedAdmin);
        setEditing(false);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        notificationService.success('Compte mis à jour avec succès');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la modification');
      }
    } catch (err) {
      notificationService.error('Erreur lors de la modification');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = AuthService.getToken();
      const response = await fetch(`http://localhost:5000/api/admins/${adminData?.id_admin}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        notificationService.success('Compte supprimé avec succès');
        AuthService.logout();
        router.push('/');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la suppression');
      }
    } catch (err) {
      notificationService.error('Erreur lors de la suppression du compte');
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({
      nom: adminData?.nom || '',
      email: adminData?.email || '',
      password: '',
      confirmPassword: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-purple-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <User className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mon Compte
                </h1>
                <p className="text-gray-300 mt-1">
                  Gérez vos informations personnelles et paramètres
                </p>
              </div>
            </div>
          </div>

          {!editing && (
            <div className="flex space-x-3">
              <Button
                onClick={() => setEditing(true)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              >
                <Edit3 className="w-4 h-4" />
                Modifier le profil
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations du compte */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-700 bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <User className="w-5 h-5 text-purple-400" />
                <span>Informations personnelles</span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Vos informations de compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom" className="text-white">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Nouveau mot de passe (laisser vide pour ne pas changer)
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white">
                        Confirmer le mot de passe
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div>
                      <p className="text-sm text-gray-400">Nom complet</p>
                      <p className="text-white font-medium">{adminData?.nom}</p>
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div>
                      <p className="text-sm text-gray-400">Adresse email</p>
                      <p className="text-white font-medium">{adminData?.email}</p>
                    </div>
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div>
                      <p className="text-sm text-gray-400">Rôle</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium capitalize">{adminData?.role || 'admin'}</p>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          Administrateur
                        </Badge>
                      </div>
                    </div>
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div>
                      <p className="text-sm text-gray-400">Membre depuis</p>
                      <p className="text-white font-medium">
                        {adminData?.date_creation 
                          ? new Date(adminData.date_creation).toLocaleDateString('fr-FR') 
                          : 'Date non disponible'
                        }
                      </p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}
            </CardContent>
            {editing && (
              <CardFooter className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={submitting}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={submitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitting ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Actions et paramètres */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <Card className="border-gray-700 bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Gestion de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setEditing(true)}
                className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Modifier le profil
              </Button>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer le compte
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Supprimer le compte</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                      Êtes-vous sûr de vouloir supprimer votre compte ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer définitivement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Statut du compte */}
          <Card className="border-gray-700 bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Statut du compte</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Actif
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Dernière connexion</span>
                <span className="text-white text-sm">Aujourd'hui</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Compte vérifié</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  Oui
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
