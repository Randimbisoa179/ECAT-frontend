'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram, Youtube, Building, Calendar } from 'lucide-react'
import { ContactInfoForm } from '@/components/forms/contact-info-form'

interface ContactInfo {
  id: number
  email: string
  phone: string
  address: string
  map_url?: string
  social_media?: string | object
  created_at: string
  updated_at: string
}

type ViewMode = 'list' | 'create' | 'edit'

export default function ContactInfoPage() {
  const [contactInfos, setContactInfos] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedContactInfo, setSelectedContactInfo] = useState<ContactInfo | null>(null)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/contact-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setContactInfos(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ces informations de contact ?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/contact-info/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setContactInfos(contactInfos.filter(info => info.id !== id))
      }
    } catch (error) {
      console.error('Error deleting contact info:', error)
    }
  }

  const handleCreate = () => {
    setSelectedContactInfo(null)
    setViewMode('create')
  }

  const handleEdit = (contactInfo: ContactInfo) => {
    setSelectedContactInfo(contactInfo)
    setViewMode('edit')
  }

  const handleSuccess = () => {
    setViewMode('list')
    setSelectedContactInfo(null)
    fetchContactInfo()
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedContactInfo(null)
  }

  const parseSocialMedia = (socialMediaData?: string | object): any => {
    if (!socialMediaData) return null
    
    try {
      if (typeof socialMediaData === 'object' && socialMediaData !== null) {
        return socialMediaData
      }
      
      if (typeof socialMediaData === 'string') {
        if (socialMediaData.trim().startsWith('{') && socialMediaData.trim().endsWith('}')) {
          return JSON.parse(socialMediaData)
        }
        return socialMediaData
      }
      
      return null
    } catch (error) {
      console.warn('Erreur parsing social_media:', error)
      return null
    }
  }

  const SocialMediaIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    instagram: Instagram,
    youtube: Youtube
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Chargement des informations...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white">
            {viewMode === 'create' ? 'Ajouter des informations' : 'Modifier les informations'}
          </h1>
          <p className="text-gray-400 mt-2">
            {viewMode === 'create' ? 'Configurez les coordonnées de contact de l\'établissement' : 'Modifiez les informations de contact existantes'}
          </p>
        </div>
        <ContactInfoForm
          initialData={selectedContactInfo || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Informations de Contact</h1>
            <p className="text-gray-400 mt-2">
              Gérez les coordonnées de contact de l'établissement
            </p>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-300">{contactInfos.length}</p>
                <p className="text-green-200/80 text-sm">Fiches contact</p>
              </div>
              <Building className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-300">
                  {contactInfos.filter(c => c.map_url).length}
                </p>
                <p className="text-blue-200/80 text-sm">Avec carte</p>
              </div>
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-300">
                  {contactInfos.filter(c => c.social_media).length}
                </p>
                <p className="text-purple-200/80 text-sm">Réseaux sociaux</p>
              </div>
              <Facebook className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-300">
                  {contactInfos.filter(c => c.updated_at !== c.created_at).length}
                </p>
                <p className="text-orange-200/80 text-sm">Modifiées</p>
              </div>
              <Edit className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des informations de contact */}
      <div className="grid gap-6">
        {contactInfos.map((info) => {
          const socialMedia = parseSocialMedia(info.social_media)
          
          return (
            <Card key={info.id} className="bg-gray-800/60 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-green-400" />
                    Coordonnées de l'établissement
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                      {info.updated_at !== info.created_at ? 'Modifié' : 'Créé'}
                    </Badge>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(info)}
                      className="border-blue-600 text-blue-300 hover:bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(info.id)}
                      className="border-red-600 text-red-300 hover:bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations principales */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-semibold text-gray-300">Email</p>
                        <a 
                          href={`mailto:${info.email}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {info.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-semibold text-gray-300">Téléphone</p>
                        <a 
                          href={`tel:${info.phone}`}
                          className="text-green-400 hover:text-green-300 hover:underline"
                        >
                          {info.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-300">Adresse</p>
                        <p className="text-gray-400 whitespace-pre-wrap">{info.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="space-y-4">
                    {info.map_url && (
                      <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                        <Globe className="w-5 h-5 text-orange-400" />
                        <div>
                          <p className="font-semibold text-gray-300">Localisation</p>
                          <a 
                            href={info.map_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 hover:underline text-sm"
                          >
                            Voir sur la carte ↗
                          </a>
                        </div>
                      </div>
                    )}

                    {socialMedia && (
                      <div className="p-3 bg-gray-900/50 rounded-lg">
                        <p className="font-semibold text-gray-300 mb-3">Réseaux sociaux</p>
                        <div className="flex gap-3">
                          {Object.entries(SocialMediaIcons).map(([platform, IconComponent]) => {
                            let url: string | undefined
                            
                            if (typeof socialMedia === 'object' && socialMedia !== null) {
                              url = socialMedia[platform as keyof typeof socialMedia]
                            }
                            
                            if (!url) return null
                            
                            return (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                                title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                              >
                                <IconComponent className="w-5 h-5" />
                              </a>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700 text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Créé le {new Date(info.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {info.updated_at !== info.created_at && (
                      <div className="flex items-center gap-1">
                        <Edit className="w-4 h-4" />
                        Modifié le {new Date(info.updated_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {contactInfos.length === 0 && (
          <Card className="bg-gray-800/60 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucune information de contact</h3>
              <p className="text-gray-400 text-center mb-6 max-w-md">
                Configurez les coordonnées de votre établissement pour que les visiteurs puissent vous contacter
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter les premières informations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
