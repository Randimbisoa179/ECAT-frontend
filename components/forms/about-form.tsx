'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, FileText, Info, Target, Eye, History } from 'lucide-react'

interface AboutContent {
  id?: number
  title: string
  description: string
  mission?: string
  vision?: string
  history?: string
}

interface AboutFormProps {
  initialData?: AboutContent
  onSuccess: () => void
  onCancel: () => void
}

export function AboutForm({ initialData, onSuccess, onCancel }: AboutFormProps) {
  const [formData, setFormData] = useState<AboutContent>(
    initialData || {
      title: '',
      description: '',
      mission: '',
      vision: '',
      history: ''
    }
  )
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères'
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
        ? `http://localhost:5000/api/about-content/${initialData.id}`
        : 'http://localhost:5000/api/about-content'
      
      const method = initialData ? 'PUT' : 'POST'

      const apiData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        mission: formData.mission?.trim() || null,
        vision: formData.vision?.trim() || null,
        history: formData.history?.trim() || null
      }

      console.log('🎯 Données About envoyées:', apiData)

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()
      console.log('📨 Réponse About:', result)

      if (response.ok) {
        onSuccess()
      } else {
        alert(`Erreur: ${JSON.stringify(result.detail || result)}`)
      }
    } catch (error) {
      console.error('Error saving about content:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof AboutContent, value: string) => {
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
            <div className="p-2 rounded-lg bg-blue-500/20">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white text-2xl">
                {initialData ? 'Modifier le contenu' : 'Nouveau contenu À Propos'}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {initialData ? 'Modifiez les informations existantes' : 'Créez une nouvelle section pour la page À Propos'}
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
          {/* Section Informations principales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Informations principales</h3>
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
                placeholder="Titre de la section (ex: Notre Histoire, Notre Mission...)"
                className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-500' : ''
                }`}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-gray-300 flex items-center gap-2">
                <span>Description *</span>
                {errors.description && <span className="text-red-400 text-sm">({errors.description})</span>}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description détaillée de la section..."
                rows={6}
                className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 resize-none ${
                  errors.description ? 'border-red-500' : ''
                }`}
                required
              />
              <div className="flex justify-between items-center text-sm">
                <span className={`${formData.description.length < 10 ? 'text-red-400' : 'text-green-400'}`}>
                  {formData.description.length} caractères
                  {formData.description.length < 10 && ' (minimum 10 requis)'}
                </span>
                <span className="text-gray-500">Requis</span>
              </div>
            </div>
          </div>

          {/* Section Informations complémentaires */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Informations complémentaires</h3>
            </div>

            <div className="grid gap-4">
              <div className="space-y-3">
                <Label htmlFor="mission" className="text-gray-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Mission de l'établissement</span>
                </Label>
                <Textarea
                  id="mission"
                  value={formData.mission || ''}
                  onChange={(e) => handleChange('mission', e.target.value)}
                  placeholder="Décrivez la mission et les objectifs de l'établissement..."
                  rows={3}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-green-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formData.mission?.length || 0} caractères</span>
                  <span className="text-gray-500">Optionnel</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="vision" className="text-gray-300 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Vision et perspectives</span>
                </Label>
                <Textarea
                  id="vision"
                  value={formData.vision || ''}
                  onChange={(e) => handleChange('vision', e.target.value)}
                  placeholder="Décrivez la vision et les perspectives futures..."
                  rows={3}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formData.vision?.length || 0} caractères</span>
                  <span className="text-gray-500">Optionnel</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="history" className="text-gray-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-orange-400" />
                  <span>Historique</span>
                </Label>
                <Textarea
                  id="history"
                  value={formData.history || ''}
                  onChange={(e) => handleChange('history', e.target.value)}
                  placeholder="Racontez l'histoire et l'évolution de l'établissement..."
                  rows={4}
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-orange-500 resize-none"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{formData.history?.length || 0} caractères</span>
                  <span className="text-gray-500">Optionnel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 flex-1 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  {initialData ? 'Modifier le contenu' : 'Créer le contenu'}
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
                <div className={`w-2 h-2 rounded-full ${formData.title && formData.description.length >= 10 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-400">
                  {formData.title && formData.description.length >= 10 ? 'Prêt à être sauvegardé' : 'Champs requis manquants'}
                </span>
              </div>
              <div className="text-gray-500">
                {Object.values(formData).filter(val => val && val.toString().trim()).length}/5 champs remplis
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
