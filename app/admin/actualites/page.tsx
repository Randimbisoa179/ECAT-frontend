'use client';

import { useState, useEffect, useRef } from 'react';
import { Actualite, ActualiteCreate } from '@/types/api';
import { actualiteService, uploadService } from '@/services/api';
import { notificationService } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Newspaper,
  Eye,
  Megaphone,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  Tag,
  Filter,
  Settings,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);
  const [editingActualite, setEditingActualite] = useState<Actualite | null>(null);
  const [formData, setFormData] = useState<ActualiteCreate>({
    titre: '',
    contenu: '',
    image: '',
    categorie: 'Général'
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<string[]>(['Général']);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategories, setEditingCategories] = useState<string[]>(['Général']);

  useEffect(() => {
    loadActualites();
    loadCategories();
  }, []);

  const loadActualites = async () => {
    try {
      setLoading(true);
      const data = await actualiteService.getAll();
      setActualites(data);
    } catch (err) {
      notificationService.error('Erreur lors du chargement des actualités');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories depuis le localStorage ou utiliser les valeurs par défaut
  const loadCategories = () => {
    try {
      const savedCategories = localStorage.getItem('actualites_categories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
        setEditingCategories(parsedCategories);

        // Mettre à jour la catégorie par défaut du formulaire si nécessaire
        if (!parsedCategories.includes(formData.categorie)) {
          setFormData(prev => ({ ...prev, categorie: parsedCategories[0] || 'Général' }));
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  // Sauvegarder les catégories dans le localStorage
  const saveCategories = (updatedCategories: string[]) => {
    try {
      localStorage.setItem('actualites_categories', JSON.stringify(updatedCategories));
      setCategories(updatedCategories);
      setEditingCategories(updatedCategories);
      notificationService.success('Catégories sauvegardées avec succès');
    } catch (err) {
      notificationService.error('Erreur lors de la sauvegarde des catégories');
      console.error(err);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !editingCategories.includes(newCategory.trim())) {
      const updatedCategories = [...editingCategories, newCategory.trim()];
      setEditingCategories(updatedCategories);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categoryToRemove === 'Général') {
      notificationService.error('Impossible de supprimer la catégorie "Général"');
      return;
    }

    // Vérifier si la catégorie est utilisée dans des actualités
    const isCategoryUsed = actualites.some(actualite => actualite.categorie === categoryToRemove);
    if (isCategoryUsed) {
      notificationService.error('Cette catégorie est utilisée dans des actualités existantes');
      return;
    }

    const updatedCategories = editingCategories.filter(cat => cat !== categoryToRemove);
    setEditingCategories(updatedCategories);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  // Filtrer les actualités par catégorie et recherche
  const filteredActualites = actualites.filter(actualite => {
    const matchesCategory = selectedCategory === 'all' || actualite.categorie === selectedCategory;
    const matchesSearch = searchTerm === '' ||
      actualite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actualite.contenu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      actualite.categorie?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Upload manuel de l'image seulement quand on soumet le formulaire
  const uploadImageIfNeeded = async (): Promise<string> => {
    if (!selectedFile) {
      return formData.image;
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
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadImageIfNeeded();
      }

      const submissionData = {
        ...formData,
        image: imageUrl
      };

      if (editingActualite) {
        const updatedActualite = await actualiteService.update(editingActualite.id_actualite, submissionData);
        setActualites(actualites.map(a =>
          a.id_actualite === editingActualite.id_actualite ? updatedActualite : a
        ));
        setIsEditDialogOpen(false);
        notificationService.updated('Actualité');
      } else {
        const newActualite = await actualiteService.create(submissionData);
        setActualites([newActualite, ...actualites]);
        setIsDialogOpen(false);
        notificationService.created('Actualité');
      }

      resetForm();
    } catch (err) {
      notificationService.error(
        editingActualite ?
          'Erreur lors de la modification' :
          'Erreur lors de l\'ajout'
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (actualite: Actualite) => {
    setEditingActualite(actualite);
    setFormData({
      titre: actualite.titre,
      contenu: actualite.contenu || '',
      image: actualite.image || '',
      categorie: actualite.categorie || 'Général'
    });
    setImagePreview(actualite.image || null);
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      contenu: '',
      image: '',
      categorie: categories[0] || 'Général'
    });
    setEditingActualite(null);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categorie: value }));
  };

  const handleDelete = async (id: number, titre: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${titre}" ?`)) {
      try {
        await actualiteService.delete(id);
        setActualites(actualites.filter(a => a.id_actualite !== id));
        notificationService.deleted('Actualité');
      } catch (err) {
        notificationService.error('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-purple-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête moderne sombre */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Megaphone className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Gestion des Actualités
                </h1>
                <p className="text-gray-300 mt-1">
                  Publiez et gérez les actualités de ECAT TARATRA
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {actualites.length}
                </Badge>
                <span>actualités publiées</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {categories.length}
                </Badge>
                <span>catégories</span>
              </div>
              {actualites.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Dernière publication: {new Date(actualites[0].date_publication).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            {/* Bouton de gestion des catégories */}
            <Button
              variant="outline"
              onClick={() => setIsCategoriesDialogOpen(true)}
              className="gap-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Catégories
            </Button>

            {/* Bouton nouvelle actualité */}
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 border-0">
                  <Plus className="w-5 h-5" />
                  Nouvelle Actualité
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2 text-white">
                    <Megaphone className="w-5 h-5 text-purple-400" />
                    <span>Publier une actualité</span>
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Rédigez et publiez une nouvelle actualité
                  </DialogDescription>
                </DialogHeader>

                <FormDialogContent
                  formData={formData}
                  categories={categories}
                  imagePreview={imagePreview}
                  onSubmit={handleSubmit}
                  onInputChange={handleInputChange}
                  onCategoryChange={handleCategoryChange}
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

        {/* Barre de filtres */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Recherche */}
          <div className="flex-1 w-full sm:max-w-md relative">
            <Input
              type="text"
              placeholder="Rechercher par titre, contenu ou catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Filtre par catégorie */}
          <div className="flex gap-2 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(selectedCategory !== 'all' || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filtres actifs */}
        {(selectedCategory !== 'all' || searchTerm) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                📁 {selectedCategory}
              </Badge>
            )}
            {searchTerm && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                🔍 "{searchTerm}"
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Dialog de gestion des catégories */}
      <Dialog open={isCategoriesDialogOpen} onOpenChange={setIsCategoriesDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>Gestion des Catégories</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ajoutez, modifiez ou supprimez les catégories d'actualités
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Ajout de nouvelle catégorie */}
            <div className="space-y-2">
              <Label htmlFor="newCategory" className="text-white">
                Nouvelle catégorie
              </Label>
              <div className="flex gap-2">
                <Input
                  id="newCategory"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nom de la nouvelle catégorie..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button
                  onClick={addCategory}
                  disabled={!newCategory.trim() || editingCategories.includes(newCategory.trim())}
                  className="bg-purple-600 hover:bg-purple-700 border-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Liste des catégories */}
            <div className="space-y-2">
              <Label className="text-white">
                Catégories existantes ({editingCategories.length})
              </Label>
              <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-gray-700/50">
                {editingCategories.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">Aucune catégorie</p>
                ) : (
                  <div className="space-y-2">
                    {editingCategories.map((category, index) => (
                      <div key={category} className="flex items-center justify-between p-2 bg-gray-600/30 rounded border border-gray-500">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{category}</span>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs bg-gray-500/30">
                              Défaut
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(category)}
                          disabled={category === 'Général'}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingCategories(categories);
                  setNewCategory('');
                  setIsCategoriesDialogOpen(false);
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-gray-700"
              >
                Annuler
              </Button>
              <Button
                onClick={() => saveCategories(editingCategories)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
              >
                <Save className="w-4 h-4" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-white">
              <Edit3 className="w-5 h-5 text-purple-400" />
              <span>Modifier l'actualité</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifiez le contenu de l'actualité
            </DialogDescription>
          </DialogHeader>

          <FormDialogContent
            formData={formData}
            categories={categories}
            imagePreview={imagePreview}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onCategoryChange={handleCategoryChange}
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
            submitting={submitting}
            uploading={uploading}
            isEdit={true}
          />
        </DialogContent>
      </Dialog>

      {/* Statistiques des résultats */}
      <div className="flex justify-between items-center">
        <p className="text-gray-400">
          {filteredActualites.length} actualité{filteredActualites.length > 1 ? 's' : ''} trouvée{filteredActualites.length > 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` dans "${selectedCategory}"`}
          {searchTerm && ` pour "${searchTerm}"`}
        </p>
      </div>

      {/* Grille d'actualités */}
      {filteredActualites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActualites.map((actualite) => (
            <ActualiteCard
              key={actualite.id_actualite}
              actualite={actualite}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-gray-700 bg-gray-800/40">
          <CardContent>
            <div className="space-y-4">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                <Newspaper className="w-10 h-10 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Aucune actualité trouvée</h3>
                <p className="text-gray-400 mt-1">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Aucune actualité ne correspond à vos critères de recherche.'
                    : 'Publiez votre première actualité pour informer votre audience'
                  }
                </p>
              </div>
              {(searchTerm || selectedCategory !== 'all') ? (
                <Button
                  onClick={clearFilters}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                >
                  <Filter className="w-4 h-4" />
                  Afficher toutes les actualités
                </Button>
              ) : (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                >
                  <Plus className="w-4 h-4" />
                  Publier une actualité
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant Carte d'Actualité (inchangé)
function ActualiteCard({
  actualite,
  onEdit,
  onDelete
}: {
  actualite: Actualite;
  onEdit: (actualite: Actualite) => void;
  onDelete: (id: number, titre: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current && actualite.contenu) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 4;
      const needsExpansion = contentRef.current.scrollHeight > maxHeight;
      setShowExpandButton(needsExpansion);
    }
  }, [actualite.contenu]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-gray-700 bg-gray-800/60 backdrop-blur-sm group h-full flex flex-col">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 relative">
        {actualite.image ? (
          <img
            src={actualite.image}
            alt={actualite.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Badge de catégorie */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-purple-500/80 hover:bg-purple-600 text-white border-0 backdrop-blur-sm">
            <Tag className="w-3 h-3 mr-1" />
            {actualite.categorie || 'Général'}
          </Badge>
        </div>

        {/* Badge de nouveauté pour les actualités récentes */}
        {isRecent(actualite.date_publication) && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
              Nouveau
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3 flex-grow-0">
        <CardTitle className="line-clamp-2 text-lg leading-tight text-white group-hover:text-purple-400 transition-colors">
          {actualite.titre}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs mt-2 text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>Publié le {new Date(actualite.date_publication).toLocaleDateString('fr-FR')}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{new Date(actualite.date_publication).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-0 flex-grow">
        <div className="prose max-w-none">
          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <div className="relative">
              <p
                ref={contentRef}
                className={`whitespace-pre-wrap leading-relaxed text-sm text-gray-300 transition-all duration-300 ${!isExpanded && showExpandButton ? 'line-clamp-4 max-h-20' : ''
                  }`}
              >
                {actualite.contenu || 'Aucun contenu disponible'}
              </p>

              {!isExpanded && showExpandButton && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-700/50 to-transparent pointer-events-none" />
              )}
            </div>

            {showExpandButton && (
              <div className="mt-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpand}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs font-medium"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Réduire
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Lire la suite
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {actualite.contenu && actualite.contenu.length > 100 && (
          <div className="text-xs text-gray-500 text-center">
            <Badge variant="outline" className="bg-gray-700/50 border-gray-600 text-gray-300">
              📖 {Math.ceil(actualite.contenu.length / 100)} min de lecture
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center mt-auto">
        <div className="text-xs text-gray-500">
          {getTimeAgo(actualite.date_publication)}
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(actualite)}
            className="gap-1 h-8 text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-black"
          >
            <Edit3 className="w-3 h-3" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(actualite.id_actualite, actualite.titre)}
            className="gap-1 h-8 text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-red"
          >
            <Trash2 className="w-3 h-3" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Composant Formulaire pour les actualités (modifié pour utiliser les catégories dynamiques)
function FormDialogContent({
  formData,
  categories,
  imagePreview,
  onSubmit,
  onInputChange,
  onCategoryChange,
  onFileSelect,
  onRemoveImage,
  submitting,
  uploading,
  isEdit
}: {
  formData: ActualiteCreate;
  categories: string[];
  imagePreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
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
          Titre de l'actualité *
        </Label>
        <Input
          id="titre"
          name="titre"
          value={formData.titre}
          onChange={onInputChange}
          placeholder="Entrez le titre de l'actualité..."
          required
          disabled={submitting}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label htmlFor="categorie" className="text-white">
          Catégorie *
        </Label>
        <Select value={formData.categorie} onValueChange={onCategoryChange} disabled={submitting}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-400">
          {categories.length === 1 ? 'Ajoutez d\'autres catégories via le bouton "Catégories"' : 'Choisissez la catégorie appropriée'}
        </p>
      </div>

      {/* Upload d'image */}
      <div className="space-y-4">
        <Label className="text-white">Image de l'actualité</Label>

        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-purple-500 cursor-pointer"
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
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                <Upload className="w-6 h-6 text-purple-400" />
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
          <div className="flex items-center space-x-2 text-purple-400">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Upload en cours...</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-2">
        <Label htmlFor="contenu" className="text-white">
          Contenu de l'actualité *
        </Label>
        <Textarea
          id="contenu"
          name="contenu"
          value={formData.contenu}
          onChange={onInputChange}
          placeholder="Rédigez le contenu de l'actualité..."
          required
          rows={8}
          disabled={submitting}
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 resize-none"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formData.contenu.length} caractères</span>
          <span>{Math.ceil(formData.contenu.length / 100)} min de lecture estimée</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={submitting}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-black"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={submitting || uploading || !formData.titre || !formData.contenu || !formData.categorie}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEdit ? 'Modification...' : 'Publication...'}
            </>
          ) : (
            <>
              <Megaphone className="w-4 h-4" />
              {isEdit ? 'Modifier l\'actualité' : 'Publier l\'actualité'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Fonctions utilitaires (inchangées)
function isRecent(date: string): boolean {
  const publicationDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publicationDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

function getTimeAgo(date: string): string {
  const publicationDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - publicationDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  } else if (diffMinutes > 0) {
    return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  } else {
    return 'À l\'instant';
  }
}
