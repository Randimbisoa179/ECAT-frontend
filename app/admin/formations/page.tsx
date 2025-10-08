'use client';

import { useState, useEffect, useRef } from 'react';
import { Formation, FormationCreate } from '@/types/api';
import { formationService, uploadService } from '@/services/api';
import { notificationService } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit3, Trash2, Calendar, Clock, BookOpen, Eye, Upload, X } from 'lucide-react';

export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [formData, setFormData] = useState<FormationCreate>({
    titre: '',
    description: '',
    programme: '',
    image: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadFormations();
  }, []);

  const loadFormations = async () => {
    try {
      setLoading(true);
      const data = await formationService.getAll();
      setFormations(data);
    } catch (err) {
      notificationService.error('Erreur lors du chargement des formations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Upload manuel de l'image seulement quand on soumet le formulaire
  const uploadImageIfNeeded = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image; // Retourne l'image existante si pas de nouveau fichier
    }

    try {
      setUploading(true);
      const result = await uploadService.uploadImage(selectedFile);
      notificationService.uploadSuccess();
      return result.url;
    } catch (err) {
      notificationService.uploadError();
      throw new Error('Échec de l\'upload de l\'image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Créer une preview locale immédiatement
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload l'image seulement à la soumission
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImageIfNeeded();
      }

      const submissionData = {
        ...formData,
        image: imageUrl
      };

      if (editingFormation) {
        const updatedFormation = await formationService.update(editingFormation.id_formation, submissionData);
        setFormations(formations.map(f => 
          f.id_formation === editingFormation.id_formation ? updatedFormation : f
        ));
        setIsEditDialogOpen(false);
        notificationService.updated('Formation');
      } else {
        const newFormation = await formationService.create(submissionData);
        setFormations([newFormation, ...formations]);
        setIsDialogOpen(false);
        notificationService.created('Formation');
      }
      
      resetForm();
    } catch (err) {
      notificationService.error(
        editingFormation ? 
        'Erreur lors de la modification' : 
        'Erreur lors de l\'ajout'
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (formation: Formation) => {
    setEditingFormation(formation);
    setFormData({
      titre: formation.titre,
      description: formation.description || '',
      programme: formation.programme || '',
      image: formation.image || ''
    });
    setImagePreview(formation.image || null);
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ titre: '', description: '', programme: '', image: '' });
    setEditingFormation(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id: number, titre: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
      try {
        await formationService.delete(id);
        setFormations(formations.filter(f => f.id_formation !== id));
        notificationService.deleted('Formation');
      } catch (err) {
        notificationService.error('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const getExcerpt = (content: string, maxLength: number = 120) => {
    if (!content) return 'Aucune description disponible';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Chargement des formations...</p>
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
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Gestion des Formations
                </h1>
                <p className="text-gray-300 mt-1">
                  Créez et gérez le catalogue de formations ECAT TARATRA
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {formations.length}
                </Badge>
                <span>formations disponibles</span>
              </div>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 border-0">
                <Plus className="w-5 h-5" />
                Nouvelle Formation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2 text-white">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>Créer une nouvelle formation</span>
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Remplissez les informations de la nouvelle formation
                </DialogDescription>
              </DialogHeader>
              
              <FormDialogContent
                formData={formData}
                imagePreview={imagePreview}
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                onFileSelect={handleFileSelect}
                onRemoveImage={handleRemoveImage}
                submitting={submitting}
                uploading={uploading}
                isEdit={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Edit3 className="w-5 h-5 text-blue-400" />
              <span>Modifier la formation</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez les informations de la formation
            </DialogDescription>
          </DialogHeader>
          
          <FormDialogContent
            formData={formData}
            imagePreview={imagePreview}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
            submitting={submitting}
            uploading={uploading}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Grille de formations */}
      {formations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {formations.map((formation) => (
            <FormationCard
              key={formation.id_formation}
              formation={formation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              getExcerpt={getExcerpt}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-gray-700 bg-gray-800/40">
          <CardContent>
            <div className="space-y-4">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                <BookOpen className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Aucune formation</h3>
                <p className="text-gray-400 mt-1">Créez votre première formation pour élargir votre catalogue</p>
              </div>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 border-0"
              >
                <Plus className="w-4 h-4" />
                Créer une formation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant Carte de Formation
function FormationCard({ 
  formation, 
  onEdit, 
  onDelete,
  getExcerpt
}: { 
  formation: Formation; 
  onEdit: (formation: Formation) => void; 
  onDelete: (id: number, titre: string) => void;
  getExcerpt: (content: string, maxLength?: number) => string;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-700 bg-gray-800/60 backdrop-blur-sm group hover:scale-105 h-full flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 relative">
        {formation.image ? (
          <img
            src={formation.image}
            alt={formation.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-gray-600" />
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Badge variant="secondary" className="bg-black/80 backdrop-blur-sm text-white border-0">
            <Eye className="w-3 h-3 mr-1" />
            Détails
          </Badge>
        </div>
        
        {isRecent(formation.date_inscription) && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
              Nouveau
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3 flex-grow">
        <CardTitle className="line-clamp-2 text-lg leading-tight text-white group-hover:text-blue-400 transition-colors">
          {formation.titre}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs mt-2 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Créée le {new Date(formation.date_inscription).toLocaleDateString('fr-FR')}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0 flex-grow">
        <div className="prose max-w-none">
          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <p className="whitespace-pre-wrap leading-relaxed text-sm text-gray-300 line-clamp-3">
              {getExcerpt(formation.description || 'Aucune description disponible', 100)}
            </p>
          </div>
        </div>

        {formation.programme && (
          <details className="group/details">
            <summary className="cursor-pointer flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600 hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Programme détaillé</span>
              </div>
              <div className="transform group-open/details:rotate-180 transition-transform">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-300">
                {formation.programme}
              </p>
            </div>
          </details>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {getTimeAgo(formation.date_inscription)}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(formation)}
            className="gap-1 h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Edit3 className="w-3 h-3" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(formation.id_formation, formation.titre)}
            className="gap-1 h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Composant Formulaire corrigé
function FormDialogContent({
  formData,
  imagePreview,
  onSubmit,
  onInputChange,
  onFileSelect,
  onRemoveImage,
  submitting,
  uploading,
  isEdit
}: {
  formData: FormationCreate;
  imagePreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextareaElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  submitting: boolean;
  uploading: boolean;
  isEdit: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <Label htmlFor="titre" className="text-white">
          Titre de la formation *
        </Label>
        <Input
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={onInputChange}
          placeholder="Ex: Développement Web Fullstack, Marketing Digital..."
          required
          disabled={submitting}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Description *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Décrivez brièvement cette formation, ses objectifs et sa valeur ajoutée..."
          required
          rows={4}
          disabled={submitting}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400">
          {formData.description.length} caractères
        </p>
      </div>

      {/* Programme détaillé */}
      <div className="space-y-2">
        <Label htmlFor="programme" className="text-white">
          Programme détaillé
        </Label>
        <Textarea
          id="programme"
          name="programme"
          value={formData.programme}
          onChange={onInputChange}
          placeholder="Détaillez les modules, chapitres, durée, objectifs pédagogiques, prérequis..."
          rows={6}
          disabled={submitting}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400">
          {formData.programme.length} caractères
        </p>
      </div>

      {/* Upload d'image - NE BLOQUE PLUS LES AUTRES ACTIONS */}
      <div className="space-y-4">
        <Label className="text-white">Image de couverture</Label>
        
        <div 
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-blue-500 cursor-pointer"
          onClick={handleZoneClick}
        >
          {imagePreview || formData.image ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={imagePreview || formData.image}
                  alt="Preview"
                  className="max-h-48 rounded-lg mx-auto border border-gray-600"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage();
                  }}
                  disabled={submitting}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                {submitting ? 'Traitement en cours...' : 'Cliquez pour changer l\'image'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Cliquez pour sélectionner une image</p>
                <p className="text-gray-400 text-sm mt-1">
                  PNG, JPG, JPEG jusqu'à 5MB
                </p>
              </div>
            </div>
          )}
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
            disabled={submitting}
          />
        </div>

        {uploading && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Upload en cours...</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={submitting}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={submitting || uploading || !formData.titre || !formData.description}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEdit ? 'Modification...' : 'Création...'}
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4" />
              {isEdit ? 'Modifier la formation' : 'Créer la formation'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Fonctions utilitaires
function isRecent(date: string): boolean {
  const creationDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - creationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

function getTimeAgo(date: string): string {
  const creationDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - creationDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
}
