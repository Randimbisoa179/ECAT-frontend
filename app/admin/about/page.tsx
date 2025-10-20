'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Calendar, FileText } from 'lucide-react'
import { AboutForm } from '@/components/forms/about-form'

interface AboutContent {
  id: number
  title: string
  description: string
  mission?: string
  vision?: string
  history?: string
  created_at: string
  updated_at: string
}

type ViewMode = 'list' | 'create' | 'edit'

export default function AboutPage() {
  const [contents, setContents] = useState<AboutContent[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedContent, setSelectedContent] = useState<AboutContent | null>(null)

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/about-content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Error fetching about content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/about-content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setContents(contents.filter(content => content.id !== id))
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  const handleCreate = () => {
    setSelectedContent(null)
    setViewMode('create')
  }

  const handleEdit = (content: AboutContent) => {
    setSelectedContent(content)
    setViewMode('edit')
  }

  const handleSuccess = () => {
    setViewMode('list')
    setSelectedContent(null)
    fetchAboutContent()
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedContent(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Chargement du contenu...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white">
            {viewMode === 'create' ? 'Ajouter un contenu' : 'Modifier le contenu'}
          </h1>
          <p className="text-gray-400 mt-2">
            {viewMode === 'create' ? 'Créez une nouvelle section pour la page À Propos' : 'Modifiez le contenu existant'}
          </p>
        </div>
        <AboutForm
          initialData={selectedContent || undefined}
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
            <h1 className="text-3xl font-bold text-white">Contenu À Propos</h1>
            <p className="text-gray-400 mt-2">
              Gérez les sections de la page À Propos de l'établissement
            </p>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Section
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-300">{contents.length}</p>
                <p className="text-blue-200/80 text-sm">Sections créées</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-300">
                  {contents.filter(c => c.mission).length}
                </p>
                <p className="text-purple-200/80 text-sm">Avec mission</p>
              </div>
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-300">
                  {contents.filter(c => c.vision).length}
                </p>
                <p className="text-green-200/80 text-sm">Avec vision</p>
              </div>
              <FileText className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des contenus */}
      <div className="grid gap-6">
        {contents.map((content) => (
          <Card key={content.id} className="bg-gray-800/60 border-gray-700 hover:border-gray-600 transition-all duration-300">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    {content.title}
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {content.updated_at !== content.created_at ? 'Modifié' : 'Créé'}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Créé le {new Date(content.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {content.updated_at !== content.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Modifié le {new Date(content.updated_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(content)}
                    className="border-blue-600 text-blue-300 hover:bg-blue-600/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(content.id)}
                    className="border-red-600 text-red-300 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Description :</h4>
                <p className="text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">
                  {content.description}
                </p>
              </div>

              {content.mission && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Mission :</h4>
                  <p className="text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">
                    {content.mission}
                  </p>
                </div>
              )}

              {content.vision && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Vision :</h4>
                  <p className="text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">
                    {content.vision}
                  </p>
                </div>
              )}

              {content.history && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Historique :</h4>
                  <p className="text-gray-400 whitespace-pre-wrap bg-gray-900/50 p-4 rounded-lg">
                    {content.history}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {contents.length === 0 && (
          <Card className="bg-gray-800/60 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun contenu</h3>
              <p className="text-gray-400 text-center mb-6 max-w-md">
                Commencez par ajouter du contenu à la page À Propos pour présenter votre établissement
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer le premier contenu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
