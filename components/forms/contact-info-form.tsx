'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react'

interface ContactInfo {
  id?: number
  email: string
  phone: string  
  address: string
  map_url?: string
  social_media?: string // Stocké comme string JSON
}

interface SocialMediaLinks {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
}

interface ContactInfoFormProps {
  initialData?: ContactInfo
  onSuccess: () => void
  onCancel: () => void
}

export function ContactInfoForm({ initialData, onSuccess, onCancel }: ContactInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(
    initialData || {
      email: '',
      phone: '',
      address: '',
      map_url: '',
      social_media: ''
    }
  )
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Convertir social_media string en objet au chargement
  useState(() => {
    if (initialData?.social_media) {
      try {
        const parsedSocial = JSON.parse(initialData.social_media)
        setSocialMedia(parsedSocial)
      } catch (error) {
        console.warn('Erreur parsing social_media:', error)
      }
    }
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire'
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire'
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
        ? `http://localhost:5000/api/contact-info/${initialData.id}`
        : 'http://localhost:5000/api/contact-info'
      
      const method = initialData ? 'PUT' : 'POST'

      // Préparer social_media comme objet JSON
      const socialMediaData: SocialMediaLinks = {}
      if (socialMedia.facebook?.trim()) socialMediaData.facebook = socialMedia.facebook.trim()
      if (socialMedia.twitter?.trim()) socialMediaData.twitter = socialMedia.twitter.trim()
      if (socialMedia.linkedin?.trim()) socialMediaData.linkedin = socialMedia.linkedin.trim()
      if (socialMedia.instagram?.trim()) socialMediaData.instagram = socialMedia.instagram.trim()
      if (socialMedia.youtube?.trim()) socialMediaData.youtube = socialMedia.youtube.trim()

      // Préparer les données pour l'API
      const apiData: any = {
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      }

      // Ajouter map_url seulement s'il a une valeur
      if (formData.map_url?.trim()) {
        apiData.map_url = formData.map_url.trim()
      }

      // ✅ CORRECTION : Convertir l'objet en string JSON pour social_media
      if (Object.keys(socialMediaData).length > 0) {
        apiData.social_media = JSON.stringify(socialMediaData) // Convertir en string JSON
      } else {
        apiData.social_media = null
      }

      console.log('🎯 Données ContactInfo envoyées:', apiData)
      console.log('📋 social_media stringifié:', apiData.social_media)

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()
      console.log('📨 Réponse ContactInfo:', result)

      if (response.ok) {
        onSuccess()
      } else {
        alert(`Erreur: ${JSON.stringify(result.detail || result)}`)
      }
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialMediaChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  const handleChange = (field: keyof ContactInfo, value: string) => {
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
            <div className="p-2 rounded-lg bg-green-500/20">
              <Phone className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-white text-2xl">
                {initialData ? 'Modifier les contacts' : 'Nouveaux contacts'}
              </CardTitle>
              <p className="text-gray-400 text-sm">
                {initialData ? 'Modifiez les informations de contact' : 'Ajoutez les informations de contact de l\'établissement'}
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
          {/* Section Informations de contact */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Informations de contact</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Email *</span>
                  {errors.email && <span className="text-red-400 text-sm">({errors.email})</span>}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="contact@ecat-taratra.mg"
                  className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>Téléphone *</span>
                  {errors.phone && <span className="text-red-400 text-sm">({errors.phone})</span>}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+261 34 12 345 67"
                  className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-green-500 ${
                    errors.phone ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="address" className="text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Adresse *</span>
                {errors.address && <span className="text-red-400 text-sm">({errors.address})</span>}
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Adresse complète de l'établissement..."
                rows={3}
                className={`bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-red-500 resize-none ${
                  errors.address ? 'border-red-500' : ''
                }`}
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="map_url" className="text-gray-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>URL de la carte (Google Maps)</span>
              </Label>
              <Input
                id="map_url"
                type="url"
                value={formData.map_url || ''}
                onChange={(e) => handleChange('map_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-purple-500"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">{formData.map_url?.length || 0} caractères</span>
                <span className="text-gray-500">Optionnel</span>
              </div>
            </div>
          </div>

          {/* Section Réseaux sociaux */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Réseaux sociaux</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="facebook" className="text-gray-300 text-sm">Facebook</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={socialMedia.facebook || ''}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="twitter" className="text-gray-300 text-sm">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={socialMedia.twitter || ''}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-400"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-gray-300 text-sm">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={socialMedia.linkedin || ''}
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-blue-600"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="instagram" className="text-gray-300 text-sm">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={socialMedia.instagram || ''}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-pink-500"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="youtube" className="text-gray-300 text-sm">YouTube</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={socialMedia.youtube || ''}
                  onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:border-red-500"
                />
              </div>
            </div>
            
            <div className="bg-gray-900/30 rounded-lg p-3">
              <p className="text-sm text-gray-400 text-center">
                Tous les réseaux sociaux sont optionnels. Seuls les liens renseignés seront sauvegardés.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25 flex-1 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5 mr-2" />
                  {initialData ? 'Modifier les contacts' : 'Créer les contacts'}
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
                <div className={`w-2 h-2 rounded-full ${formData.email && formData.phone && formData.address ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-gray-400">
                  {formData.email && formData.phone && formData.address ? 'Prêt à être sauvegardé' : 'Champs requis manquants'}
                </span>
              </div>
              <div className="text-gray-500">
                {[
                  formData.email, 
                  formData.phone, 
                  formData.address, 
                  formData.map_url,
                  ...Object.values(socialMedia).filter(val => val && val.trim())
                ].filter(Boolean).length}/8 champs remplis
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
