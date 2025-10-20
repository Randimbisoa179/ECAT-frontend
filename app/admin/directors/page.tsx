'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Mail, Calendar, User, Crown } from 'lucide-react'
import { DirectorForm } from '@/components/forms/director-form'

interface Director {
  id: number
  name: string
  title: string
  bio?: string
  email?: string
  photo_url?: string
  message?: string
  start_date?: string
  created_at: string
}

type ViewMode = 'list' | 'create' | 'edit'

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null)

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/directors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDirectors(data)
      }
    } catch (error) {
      console.error('Error fetching directors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce directeur ?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/directors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setDirectors(directors.filter(director => director.id !== id))
      }
    } catch (error) {
      console.error('Error deleting director:', error)
    }
  }

  const handleCreate = () => {
    setSelectedDirector(null)
    setViewMode('create')
  }

  const handleEdit = (director: Director) => {
    setSelectedDirector(director)
    setViewMode('edit')
  }

  const handleSuccess = () => {
    setViewMode('list')
    setSelectedDirector(null)
    fetchDirectors()
  }

  const handleCancel = () => {
    setViewMode('list')
    setSelectedDirector(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Chargement des directeurs...</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-white">
            {viewMode === 'create' ? 'Ajouter un directeur' : 'Modifier le directeur'}
          </h1>
          <p className="text-gray-400 mt-2">
            {viewMode === 'create' ? 'Ajoutez un nouveau membre de la direction' : 'Modifiez les informations du directeur'}
          </p>
        </div>
        <DirectorForm
          initialData={selectedDirector || undefined}
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
            <h1 className="text-3xl font-bold text-white">Directeurs</h1>
            <p className="text-gray-400 mt-2">
              Gérez l'équipe de direction de l'établissement
            </p>
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Directeur
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-300">{directors.length}</p>
                <p className="text-purple-200/80 text-sm">Directeurs</p>
              </div>
              <User className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-300">
                  {directors.filter(d => d.email).length}
                </p>
                <p className="text-blue-200/80 text-sm">Avec email</p>
              </div>
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-300">
                  {directors.filter(d => d.photo_url).length}
                </p>
                <p className="text-green-200/80 text-sm">Avec photo</p>
              </div>
              <User className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-300">
                  {directors.filter(d => d.start_date).length}
                </p>
                <p className="text-orange-200/80 text-sm">Avec date début</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des directeurs */}
      <div className="grid gap-6 md:grid-cols-2">
        {directors.map((director) => (
          <Card key={director.id} className="bg-gray-800/60 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    {director.name}
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {director.title}
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Ajouté le {new Date(director.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {director.start_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Début: {new Date(director.start_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(director)}
                    className="border-blue-600 text-blue-300 hover:bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(director.id)}
                    className="border-red-600 text-red-300 hover:bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {director.photo_url && (
                <div className="flex justify-center">
                  <img 
                    src={director.photo_url} 
                    alt={director.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-gray-600"
                  />
                </div>
              )}

              {director.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`mailto:${director.email}`}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {director.email}
                  </a>
                </div>
              )}

              {director.bio && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Biographie :</h4>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {director.bio}
                  </p>
                </div>
              )}

              {director.message && (
                <div>
                  <h4 className="font-semibold text-gray-300 mb-2">Message :</h4>
                  <p className="text-gray-400 text-sm italic bg-gray-900/50 p-3 rounded-lg">
                    "{director.message}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {directors.length === 0 && (
          <Card className="bg-gray-800/60 border-gray-700 md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <User className="w-16 h-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun directeur</h3>
              <p className="text-gray-400 text-center mb-6 max-w-md">
                Ajoutez les membres de la direction pour présenter votre équipe
              </p>
              <Button 
                onClick={handleCreate}
                className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter le premier directeur
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
