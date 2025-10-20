'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Trash2, Mail, User, Calendar, EyeOff, Reply, MessageSquare, Inbox } from 'lucide-react'

interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/contact-messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/contact-messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setMessages(messages.filter(message => message.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const markAsRead = async (message: ContactMessage) => {
    if (message.is_read) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/contact-messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...message,
          is_read: true
        })
      })

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === message.id ? { ...msg, is_read: true } : msg
        ))
        setSelectedMessage({ ...message, is_read: true })
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const markAsUnread = async (message: ContactMessage) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/contact-messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...message,
          is_read: false
        })
      })

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === message.id ? { ...msg, is_read: false } : msg
        ))
        if (selectedMessage?.id === message.id) {
          setSelectedMessage({ ...message, is_read: false })
        }
      }
    } catch (error) {
      console.error('Error marking message as unread:', error)
    }
  }

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.is_read) {
      markAsRead(message)
    }
  }

  const handleMarkAsRead = async (message: ContactMessage) => {
    if (message.is_read) {
      await markAsUnread(message)
    } else {
      await markAsRead(message)
    }
  }

  const unreadCount = messages.filter(msg => !msg.is_read).length
  const totalCount = messages.length

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-lg">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Messages de Contact</h1>
            <p className="text-gray-400 mt-2">
              Gérez les messages reçus via le formulaire de contact
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-lg px-4 py-2">
              {totalCount} message{totalCount > 1 ? 's' : ''}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30 text-lg px-4 py-2">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-300">{totalCount}</p>
                <p className="text-blue-200/80 text-sm">Total messages</p>
              </div>
              <Inbox className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-300">{unreadCount}</p>
                <p className="text-red-200/80 text-sm">Non lus</p>
              </div>
              <EyeOff className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-300">{totalCount - unreadCount}</p>
                <p className="text-green-200/80 text-sm">Lus</p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-300">
                  {messages.filter(m => new Date(m.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-purple-200/80 text-sm">7 derniers jours</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Liste des messages */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-blue-400" />
              Boîte de réception
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
            </div>
          </div>
          
          {messages.map((message) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedMessage?.id === message.id ? 'border-blue-500 shadow-lg shadow-blue-500/25' : 'border-gray-700'
              } ${!message.is_read ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-800/60'}`}
              onClick={() => handleViewMessage(message)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-base text-white flex items-center gap-2 truncate">
                      {message.subject}
                      {!message.is_read && (
                        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
                          Nouveau
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                      <div className="flex items-center gap-1 min-w-0">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{message.name}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{message.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(message)
                      }}
                      title={message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                      className={message.is_read ? 'border-gray-600 text-gray-400' : 'border-blue-600 text-blue-400'}
                    >
                      {message.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(message.id)
                      }}
                      className="border-red-600 text-red-400 hover:bg-red-600/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-400 line-clamp-2">
                  {message.message}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(message.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {messages.length === 0 && (
            <Card className="bg-gray-800/60 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun message</h3>
                <p className="text-gray-400 text-center mb-6 max-w-md">
                  Les messages envoyés via le formulaire de contact apparaîtront ici
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Détail du message sélectionné */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Détail du message
          </h2>
          {selectedMessage ? (
            <Card className="bg-gray-800/60 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white break-words">{selectedMessage.subject}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleMarkAsRead(selectedMessage)}
                      title={selectedMessage.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
                      className={selectedMessage.is_read ? 'border-gray-600 text-gray-400' : 'border-blue-600 text-blue-400'}
                    >
                      {selectedMessage.is_read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-300">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-300">Message :</h4>
                  <div className="bg-gray-900/50 p-4 rounded-lg whitespace-pre-wrap break-words text-gray-400 leading-relaxed">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="flex gap-2 mt-6 flex-wrap">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <a 
                      href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}&body=${encodeURIComponent(`Bonjour ${selectedMessage.name},\n\nVotre message : "${selectedMessage.message}"\n\n`)}`}
                      target="_blank"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Répondre
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleMarkAsRead(selectedMessage)}
                    className={selectedMessage.is_read ? 'border-gray-600 text-gray-400' : 'border-blue-600 text-blue-400'}
                  >
                    {selectedMessage.is_read ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                    {selectedMessage.is_read ? 'Marquer non lu' : 'Marquer lu'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/60 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Eye className="w-16 h-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Sélectionnez un message</h3>
                <p className="text-gray-400 text-center">
                  Cliquez sur un message dans la liste pour en voir les détails
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
