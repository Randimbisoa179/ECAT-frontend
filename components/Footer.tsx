'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactLoading, setContactLoading] = useState(true);
  const [contactError, setContactError] = useState<string | null>(null);

  // Fonction pour parser les réseaux sociaux - MÊME QUE VOTRE PAGE CONTACT
  const parseSocialMedia = (socialMedia: string | { [key: string]: string } | undefined): SocialMediaLinks => {
    if (!socialMedia) return {};
    
    if (typeof socialMedia === 'object') {
      return socialMedia;
    }
    
    // Si c'est une string, essayer de la parser
    if (typeof socialMedia === 'string') {
      try {
        // Essayer de parser comme JSON
        const parsed = JSON.parse(socialMedia);
        if (typeof parsed === 'object') return parsed;
      } catch {
        // Si ce n'est pas du JSON, retourner un objet vide
        return {};
      }
    }
    
    return {};
  };

  // Récupérer les informations de contact depuis l'API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('🔄 Footer: Début de la récupération des informations de contact...');
        
        const response = await fetch('http://localhost:5000/api/contact-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Footer: Statut de la réponse:', response.status);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Footer: Données reçues:', data);
        console.log('📱 Footer: Réseaux sociaux bruts:', data.social_media);
        
        // MÊME LOGIQUE QUE VOTRE CODE
        if (Array.isArray(data) && data.length > 0) {
          setContactInfo(data[0]);
          console.log('📞 Footer: Données utilisées:', data[0]);
          console.log('🔗 Footer: Réseaux sociaux parsés:', parseSocialMedia(data[0].social_media));
        } else if (typeof data === 'object' && data !== null) {
          setContactInfo(data);
          console.log('🔗 Footer: Réseaux sociaux parsés:', parseSocialMedia(data.social_media));
        } else {
          throw new Error('Format de données non supporté');
        }
        
        setContactError(null);
      } catch (error) {
        console.error('❌ Footer: Erreur lors de la récupération:', error);
        setContactError('Impossible de charger les informations de contact');
        // Valeurs par défaut en cas d'erreur
        setContactInfo({
          email: 'ecat.universite@gmail.com',
          phone: '+261 34 21 987 75',
          address: 'Isaha, Fianarantsoa 301',
          social_media: {
            facebook: '#',
            twitter: '#',
            instagram: '#'
          }
        });
      } finally {
        setContactLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Parser les réseaux sociaux de contactInfo
  const socialMediaLinks = contactInfo ? parseSocialMedia(contactInfo.social_media) : {};
  const hasSocialMedia = Object.keys(socialMediaLinks).length > 0;

  return (
    <footer className="bg-[#003F7D] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 p-8 rounded-2xl">
          
          {/* --- Colonne 1 : Logo + description --- */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/logo.png"
                alt="ECAT TARATRA Logo"
                width={60}
                height={60}
                className="rounded-md"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  ECAT Taratra
                </h1>
              </div>
            </div>

            <p className="text-blue-100 text-sm leading-relaxed">
              Nous sommes une université privée, agréée et habilitée par le
              Ministère de l'Enseignement Supérieur et de la Recherche Scientifique.
            </p>

            {/* Debug info */}
            {contactError && (
              <div className="text-yellow-300 text-xs bg-yellow-900/30 p-2 rounded">
                ⚠️ {contactError}
              </div>
            )}
          </div>

          {/* --- Colonne 2 : Navigation --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigations</h4>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/formations" className="hover:text-white transition-colors">Formations</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/actualites" className="hover:text-white transition-colors">Actualités</Link></li>
            </ul>
          </div>

          {/* --- Colonne 3 : Contacts --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacts</h4>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <Mail className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-sm text-black">
                  {contactLoading ? (
                    <div className="animate-pulse w-32 h-4 bg-blue-100 rounded"></div>
                  ) : (
                    contactInfo?.email || 'ecat.universite@gmail.com'
                  )}
                </span>
              </div>

              {/* Téléphone */}
              <div className="flex items-center bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <Phone className="w-4 h-4 text-black flex-shrink-0" />
                <span className="text-sm text-black">
                  {contactLoading ? (
                    <div className="animate-pulse w-24 h-4 bg-blue-100 rounded"></div>
                  ) : (
                    contactInfo?.phone || '+261 34 21 987 75'
                  )}
                </span>
              </div>

              {/* Adresse */}
              <div className="flex items-start bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <MapPin className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span className="text-sm text-black flex-1">
                  {contactLoading ? (
                    <div className="animate-pulse w-40 h-4 bg-blue-100 rounded"></div>
                  ) : (
                    contactInfo?.address || 'Isaha, Fianarantsoa 301'
                  )}
                </span>
              </div>

              {/* Lien Google Maps si disponible */}
              {contactInfo?.map_url && !contactLoading && (
                <div className="flex justify-center pt-2">
                  <Link 
                    href={contactInfo.map_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white text-sm underline transition-colors"
                  >
                    Voir sur la carte
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* --- Colonne 4 : S'abonner --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">S'abonner</h4>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Entrez votre email..."
                className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg transition-all duration-300">
                Envoyer
              </Button>
            </div>

            {/* RÉSEAUX SOCIAUX AVEC LES VRAIS LIENS DE LA BASE */}
            <div className="flex space-x-3 mt-4">
              {contactLoading ? (
                // Squelette de chargement pour les icônes sociales
                <>
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-5 h-5 bg-blue-300/50 rounded animate-pulse"></div>
                  ))}
                </>
              ) : (
                // VRAIS LIENS DEPUIS LA BASE DE DONNÉES
                <>
                  {socialMediaLinks.facebook && (
                    <Link 
                      href={socialMediaLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white transition-colors hover:scale-110 transform duration-300"
                      title="Suivez-nous sur Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </Link>
                  )}
                  
                  {socialMediaLinks.twitter && (
                    <Link 
                      href={socialMediaLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white transition-colors hover:scale-110 transform duration-300"
                      title="Suivez-nous sur Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Link>
                  )}
                  
                  {socialMediaLinks.instagram && (
                    <Link 
                      href={socialMediaLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white transition-colors hover:scale-110 transform duration-300"
                      title="Suivez-nous sur Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </Link>
                  )}

                  {socialMediaLinks.youtube && (
                    <Link 
                      href={socialMediaLinks.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white transition-colors hover:scale-110 transform duration-300"
                      title="Suivez-nous sur YouTube"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </Link>
                  )}

                  {socialMediaLinks.linkedin && (
                    <Link 
                      href={socialMediaLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:text-white transition-colors hover:scale-110 transform duration-300"
                      title="Suivez-nous sur LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </Link>
                  )}

                  {/* Fallback si aucun réseau social dans la base */}
                  {!hasSocialMedia && (
                    <>
                      <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                        <Facebook className="w-5 h-5" />
                      </Link>
                      <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                      </Link>
                      <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

      
          </div>
        </div>
      </div>

      {/* --- Barre inférieure --- */}
      <div className="bg-[#003F7D] py-4 border-t border-blue-400/20">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-blue-200 text-sm px-4">
          <p>© Copyright 2025 ECAT Taratra. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-2 md:mt-0 items-center">
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link 
              href="https://itdcmada.mg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
            >
              ITDC MADA <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
