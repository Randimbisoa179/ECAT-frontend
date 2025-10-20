'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Upload, User, Mail, Crown, Calendar, MessageCircle } from 'lucide-react'

interface Director {
  id?: number
  name: string
  title: string
  bio?: string
  email?: string
  photo_url?: string
  message?: string
  start_date?: string
}

interface DirectorFormProps {
  initialData?: Director
  onSuccess: () => void
  onCancel: () => void
}

export function DirectorForm({ initialData, onSuccess, onCancel }: DirectorFormProps) {
  const [formData, setFormData] = useState<Director>(
    initialData || {
      name: '',
      title: '',
      bio: '',
      email: '',
      photo_url: '',
      message: '',
      start_date: ''
    }
  )
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire'
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Format d\'email invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const token = localStorage.getItem('token')
      const url = initialData 
        ? `http://localhost:5000/api/directors/${initialData.id}`
        : 'http://localhost:5000/api/directors'
      
      const method = initialData ? 'PUT' : 'POST'

      const apiData: any = {
        name: formData.name.trim(),
        title: formData.title.trim(),
      }

      if (formData.bio?.trim()) apiData.bio = formData.bio.trim()
      if (formData.email?.trim()) apiData.email = formData.email.trim()
      if (formData.photo_url?.trim()) apiData.photo_url = formData.photo_url.trim()
      if (formData.message?.trim()) apiData.message = formData.message.trim()
      if (formData.start_date?.trim()) apiData.start_date = formData.start_date.trim()

      console.log('🎯 Données Director envoyées:', apiData)

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()
      console.log('📨 Réponse Director:', result)

      if (response.ok) {
        onSuccess()
      } else {
        alert(`Erreur: ${JSON.stringify(result.detail || result)}`)
      }
    } catch (error) {
      console.error('Error saving director:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:5000/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, photo_url: data.url }))
      } else {
        const error = await response.json()
        alert(`Erreur lors de l'upload: ${error.detail || 'Erreur inconnue'}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erreur de connexion lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (field: keyof Director, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="bg-gray-800/60 border-gray-700 shadow-2xl">
      <CardHeader className="border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Crown className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white text-2xl">
                {initialData ? 'Modifier le directeur' : 'Nouveau directeur'}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {initialData ? 'Modifiez les informations du directeur' : 'Ajoutez un nouveau membre de la direction'}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancel}
            className="border-gray-600 text-gray-400 hover:bg-gray-700/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations personnelles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Informations personnelles</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                  <span>Nom complet *</span>
                  {errors.name && <span className="text-red-400 text-sm">({errors.name})</span>}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nom et prénom du directeur"
                  className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="title" className="text-gray-300 flex items-center gap-2">
                  <span>Titre *</span>
                  {errors.title && <span className="text-red-400 text-sm">({errors.title})</span>}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Ex: Directeur Général, Président..."
                  className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500 ${
                    errors.title ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>Adresse email</span>
                {errors.email && <span className="text-red-400 text-sm">({errors.email})</span>}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@ecat-taratra.mg"
                className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="start_date" className="text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-400" />
                <span>Date de début</span>
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white focus:border-green-500"
              />
            </div>
          </div>

          {/* Section Photo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Photo</h3>
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300">Photo de profil</Label>
              {formData.photo_url ? (
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                  <img 
                    src={formData.photo_url} 
                    alt="Aperçu" 
                    className="w-20 h-20 object-cover rounded-full border-2 border-orange-400"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 break-all mb-2">
                      {formData.photo_url}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                      className="border-red-600 text-red-400 hover:bg-red-600/20"
                    >
                      Supprimer la photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImageUpload(file)
                      }
                    }}
                    disabled={uploading}
                    className="bg-gray-900/50 border-gray-600 text-white file:bg-orange-600 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Formats: JPG, PNG, WebP. Taille max: 5MB
                    </span>
                    {uploading && (
                      <div className="flex items-center gap-2 text-orange-400">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-400"></div>
                        Upload en cours...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Contenu */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Contenu</h3>
            </div>

            <div className="grid gap-4">
              <div className="space-y-3">
                <Label htmlFor="bio" className="text-gray-300">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Biographie et parcours du directeur..."
                  rows={4}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formData.bio?.length || 0} caractères</span>
                  <span className="text-gray-500">Optionnel</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="message" className="text-gray-300">Message personnel</Label>
                <Textarea
                  id="message"
                  value={formData.message || ''}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Message du directeur aux visiteurs..."
                  rows={3}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-green-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formData.message?.length || 0} caractères</span>
                  <span className="text-gray-500">Optionnel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <Button 
              type="submit" 
              disabled={loading || uploading}
              className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 flex-1 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  {initialData ? 'Modifier le directeur' : 'Créer le directeur'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
              className="border-gray-600 text-gray-400 hover:bg-gray-700/50 py-3"
            >
              <X className="w-5 h-5 mr-2" />
              Annuler
            </Button>
          </div>

          {/* Indicateurs de statut */}
          <div className="bg-gray-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.name && formData.title ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-400">
                  {formData.name && formData.title ? 'Prêt à être sauvegardé' : 'Champs requis manquants'}
                </span>
              </div>
              <div className="text-gray-500">
                {Object.values(formData).filter(val => val && val.toString().trim()).length}/7 champs remplis
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
