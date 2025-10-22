
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, CheckCircle, AlertCircle, Phone, Mail, MapPin, ArrowRight, Clock, Share2, Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react'

interface ContactInfo {
  id?: number;
  email: string;
  phone: string;
  address: string;
  map_url?: string;
  social_media?: string | { [key: string]: string };
  updated_at?: string;
}

// Interface pour les réseaux sociaux
interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const [contactLoading, setContactLoading] = useState(true)
  const [contactError, setContactError] = useState<string | null>(null)

  // Fonction pour parser les réseaux sociaux en objet
  const parseSocialMedia = (socialMedia: string | { [key: string]: string } | undefined): SocialMediaLinks => {
    if (!socialMedia) return {}
    
    if (typeof socialMedia === 'object') {
      return socialMedia
    }
    
    // Si c'est une string, essayer de la parser
    if (typeof socialMedia === 'string') {
      try {
        // Essayer de parser comme JSON
        const parsed = JSON.parse(socialMedia)
        if (typeof parsed === 'object') return parsed
      } catch {
        // Si ce n'est pas du JSON, retourner un objet vide
        return {}
      }
    }
    
    return {}
  }

  // Composant pour les icônes de réseaux sociaux
  const SocialMediaIcon = ({ platform, url }: { platform: string; url: string }) => {
    const socialIcons: { [key: string]: React.ReactNode } = {
      facebook: <Facebook className="w-4 h-4" />,
      instagram: <Instagram className="w-4 h-4" />,
      twitter: <Twitter className="w-4 h-4" />,
      youtube: <Youtube className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
    }

    const socialColors: { [key: string]: string } = {
      facebook: 'bg-blue-600 hover:bg-blue-700',
      instagram: 'bg-pink-600 hover:bg-pink-700',
      twitter: 'bg-blue-400 hover:bg-blue-500',
      youtube: 'bg-red-600 hover:bg-red-700',
      linkedin: 'bg-blue-800 hover:bg-blue-900',
    }

    const defaultColor = 'bg-purple-600 hover:bg-purple-700'
    const defaultIcon = <Share2 className="w-4 h-4" />

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 ${
          socialColors[platform] || defaultColor
        }`}
        title={`Suivez-nous sur ${platform}`}
      >
        {socialIcons[platform] || defaultIcon}
      </a>
    )
  }

  // Récupérer les informations de contact depuis l'API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('🔄 Début de la récupération des informations de contact...')
        
        const response = await fetch('http://localhost:5000/api/contact-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        console.log('📡 Statut de la réponse:', response.status)
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        console.log('✅ Données reçues:', data)
        
        // CORRECTION : Prendre le premier élément du tableau
        if (Array.isArray(data) && data.length > 0) {
          setContactInfo(data[0])
          console.log('📞 Données utilisées:', data[0])
        } else if (typeof data === 'object' && data !== null) {
          setContactInfo(data)
        } else {
          throw new Error('Format de données non supporté')
        }
        
        setContactError(null)
      } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error)
        setContactError('Impossible de charger les informations de contact')
        // Valeurs par défaut en cas d'erreur
        setContactInfo({
          email: 'ecat.universite@gmail.com',
          phone: '+261 34 21 987 75',
          address: 'Isaha, Fianarantsoa 301'
        })
      } finally {
        setContactLoading(false)
      }
    }

    fetchContactInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('http://localhost:5000/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Parser les réseaux sociaux
  const socialMediaLinks = contactInfo ? parseSocialMedia(contactInfo.social_media) : {}
  const hasSocialMedia = Object.keys(socialMediaLinks).length > 0

  return (
    <div className="min-h-screen bg-[rgb(0,63,125)] text-gray-900 pt-24">
      <main>
        {/* Section Hero avec le style original de la page d'accueil */}
        <section className="bg-[rgb(0,63,125)] text-white min-h-[80vh] flex items-center justify-center py-8 relative overflow-hidden px-25">

          {/* SVG décoratifs en arrière-plan - Style Accueil */}
          <div className="absolute top-10 left-10 opacity-30">
            <img
              src="/assets/Group%201000004925.svg"
              alt="Décoration"
              className="w-32 h-32"
            />
          </div>
          <div className="absolute top-10 right-10 opacity-30">
            <img
              src="/assets/Group%201000004925.svg"
              alt="Décoration"
              className="w-32 h-32"
            />
          </div>
          

          <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full items-center">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center
            ">

              {/* Contenu principal - Centré comme la page d'accueil */}
              <div className="w-full text-center lg:text-left">

                

                {/* H1: Style identique à la page d'accueil */}
                <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4 tracking-[0.500rem]">
                  Contactez-nous à
                  <span className="inline-block relative ml-4">
                    {/* ECAT TARATRA utilise la même taille que H1 */}
                    <span className="text-white text-4xl md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4">ECAT TARATRA</span>
                    {/* Ligne décorative en bas */}
                    <img
                      src="/assets/Vector%201.svg"
                      alt="Ligne décorative"
                      className="w-full"
                    />
                  </span>,

                  {/* Votre partenaire éducatif utilise la même taille que H1 */}
                  <span className="block bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent text-4xl md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4">
                    votre partenaire éducatif.
                  </span>
                </h1>

                {/* Paragraphe principal: Style identique à la page d'accueil */}
                <p className="mt-8 text-[20px] text-base md:text-lg font-Ingrid max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-wide text-white/90">
                  Une question sur nos formations ? Besoin d'informations supplémentaires ? 
                  Notre équipe est là pour vous accompagner dans votre projet éducatif.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-12">
                  <button className="bg-[rgb(13,110,253)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[rgb(11,94,215)] transition duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                    Nous appeler maintenant
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-[rgb(0,63,125)] transition duration-300 text-base sm:text-lg flex items-center justify-center gap-2">
                    Visiter notre campus
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Logo ECAT - Position identique à la page d'accueil */}
                <div className="flex justify-center lg:justify-start mt-12">
                  <img
                    src="/assets/Vector.svg"
                    alt="ECAT Logo"
                    className="w-12 h-12"
                  />
                </div>

                <div className="absolute bottom-5 left-20 opacity-30">
                  <img
                    src="/assets/Group%201000004925.svg"
                    alt="Décoration"
                    className="w-32 h-32"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section Formulaire de Contact */}
        <section className="bg-gray-50 text-white min-h-screen  justify-center py-8 relative overflow-hidden">
                         <div className="relative z-10 mx-auto px-6 sm:px-6 lg:px-8 w-full px-25">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              
              {/* Informations de contact - Côté gauche */}
              <div className="lg:col-span-2 py-8 px-25 p-6">
                <div className="sticky top-32">
                  <div className="mb-8">
                    <h2 className="text-[16px] font-Poppins font-semibold leading-tight text-[rgb(242,114,135)] mb-2">
                      RESTONS CONNECTÉS
                    </h2>
                    <h1 className="text-[2.5rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight">
                      Prenons contact
                      <span className="bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent block">
                        dès maintenant
                      </span>
                    </h1>
                    <p className="text-[18px] font-Ingrid leading-relaxed tracking-wide text-gray-600">
                      Notre équipe pédagogique vous accompagne dans votre projet de formation.
                    </p>
                  </div>

                  {/* Message d'erreur */}
                  {contactError && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">{contactError}</p>
                    </div>
                  )}

                  {/* Cartes d'information de contact */}
                  <div className="space-y-6">
                    {contactLoading ? (
                      // Squelette de chargement amélioré
                      <>
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                            <div className="flex items-start space-x-4">
                              <div className="w-14 h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                              <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      // Données réelles - CORRIGÉ : utilisation directe de contactInfo
                      <>
                        {/* Carte Téléphone */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Appelez-nous</h3>
                              <p className="text-gray-700 font-medium text-base mb-1">
                                {contactInfo?.phone || '+261 34 21 987 75'}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Clock className="w-4 h-4" />
                                <span>Lun-Ven: 8h-17h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Carte Email */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-green-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Envoyez un email</h3>
                              <p className="text-gray-700 font-medium text-base mb-1 break-all">
                                {contactInfo?.email || 'ecat.universite@gmail.com'}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <Clock className="w-4 h-4" />
                                <span>Réponse sous 24h</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Carte Adresse */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-orange-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Rendez-nous visite</h3>
                              <p className="text-gray-700 font-medium text-base mb-3">
                                {contactInfo?.address || 'Isaha, Fianarantsoa 301'}
                              </p>
                              {contactInfo?.map_url ? (
                                <a 
                                  href={contactInfo.map_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition duration-300"
                                >
                                  <MapPin className="w-4 h-4" />
                                  Voir sur la carte
                                </a>
                              ) : (
                                <div className="text-sm text-orange-600">
                                  Bureau principal - Fianarantsoa
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Carte Réseaux sociaux - NOUVEAU : Boutons avec icônes */}
                        {hasSocialMedia && (
                          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-300">
                            <div className="flex items-start space-x-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Share2 className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Suivez-nous</h3>
                                <p className="text-gray-600 text-sm mb-4">
                                  Restez connecté avec nos actualités et événements
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {Object.entries(socialMediaLinks).map(([platform, url]) => (
                                    url && (
                                      <SocialMediaIcon
                                        key={platform}
                                        platform={platform.toLowerCase()}
                                        url={url}
                                      />
                                    )
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Indicateur de dernière mise à jour */}
                  {contactInfo?.updated_at && (
                    <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        Dernière mise à jour: {new Date(contactInfo.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Formulaire - Côté droit */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                  <div className="mb-8">
                    <h2 className="text-3xl font-Poppins font-bold text-gray-900 mb-3">
                      Envoyez-nous un message
                    </h2>
                    <p className="text-gray-600 font-Ingrid text-lg">
                      Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement.
                    </p>
                  </div>

                  {status === 'success' && (
                    <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-4">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-green-800 text-lg">Message envoyé avec succès !</p>
                        <p className="text-green-700 mt-1">
                          Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.
                        </p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-red-800 text-lg">Erreur lors de l'envoi</p>
                        <p className="text-red-700 mt-1">
                          Veuillez réessayer ou nous contacter directement par téléphone.
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-Poppins font-semibold text-gray-700">
                          Nom complet *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Votre nom et prénom"
                          required
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-Poppins font-semibold text-gray-700">
                          Adresse email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@email.com"
                          required
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-sm font-Poppins font-semibold text-gray-700">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Objet de votre message"
                        required
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-Poppins font-semibold text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Décrivez votre demande en détail..."
                        rows={6}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none rounded-xl"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 font-Poppins">
                          {formData.message.length} caractères
                        </p>
                        <p className="text-sm text-gray-500 font-Poppins">
                          Minimum 20 caractères recommandés
                        </p>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-[rgb(13,110,253)] to-[rgb(45,127,251)] hover:from-[rgb(11,94,215)] hover:to-[rgb(37,109,219)] transition-all duration-300 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          Envoyer le message
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center font-Poppins">
                      * Champs obligatoires. Vos données sont protégées et confidentielles.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA avec le style de la page d'accueil */}
        <section className="py-16 bg-[rgb(189,218,254)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-Poppins font-bold text-[rgb(13,110,253)] mb-4">
              Prêt à commencer votre aventure avec ECAT TARATRA ?
            </h2>
            <p className="text-xl font-Ingrid text-gray-700 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté d'étudiants et démarrez votre parcours de formation dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[rgb(13,110,253)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[rgb(11,94,215)] transition duration-300 text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Voir nos formations
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-[rgb(13,110,253)] text-[rgb(13,110,253)] px-8 py-4 rounded-lg font-semibold hover:bg-[rgb(13,110,253)] hover:text-white transition duration-300 text-lg flex items-center justify-center gap-2">
                Trouver un bureau près de chez vous
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

