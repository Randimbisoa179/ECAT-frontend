// page.tsx
'use client';

import React from 'react';
import { HeroSection } from '@/components/ui/feature-carousel';
import WavyUnderline from '@/components/WavyUnderline';
import { ArrowRight, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, Newspaper, Contact, Menu, X } from 'lucide-react';

import { Globe, Award, BookOpen } from "lucide-react"

export default function Accueil() {


     const images = [
          {
               src: '/assets/etudiant.jpg',
               alt: 'etudiant ecat',
          },
          {
               src: '/assets/diplome.jpg',
               alt: 'Scenic landscape with mountains and a lake',
          },
          {
               src: '/assets/g.jpg',
               alt: 'Artistic photo of a girl with flowers',
          },
          {
               src: '/assets/d.webp',
               alt: 'A dog wearing sunglasses',
          },
          {
               src: '/assets/2.webp',
               alt: 'Creative shot of a person from behind',
          },
     ];

     const title = (
          <>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"> </span>
          </>
     );

     return (
          <div className="min-h-screen bg-white text-gray-900">
               <main>

                    <section className="bg-[rgb(0,63,125)] text-white min-h-screen flex items-center justify-center py-8 relative overflow-hidden">

                         {/* SVG décoratifs en arrière-plan */}



                         <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full">
                              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

                                   {/* Carte côté gauche sur desktop, en haut sur mobile */}
                                   <div className="lg:w-1/3 w-full order-2 lg:order-1">
                                        <HeroSection title={title} subtitle={''} images={images} />
                                   </div>

                                   {/* Contenu principal */}
                                   <div className="lg:w-2/3 w-full order-1 lg:order-2 text-center lg:text-left">

                                        <div className="absolute top-40 left-10 opacity-30">
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
                                        {/* H1: 64px (4rem) sur desktop, ajusté pour mobile */}
                                        <h1 className="text-64px md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4 tracking-[O.500rem]">
                                             Apprenez où que vous soyez, avec
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

                                             {/* l'université du futur. utilise la même taille que H1 */}
                                             <span className="block bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent text-4xl md:text-5xl lg:text-[4rem] font-semibold font-Poppins leading-tight mb-4">
                                                  l'université du futur.
                                             </span>
                                        </h1>

                                        {/* Paragraphe principal: 16px (1rem), ajusté pour mobile avec une classe plus petite puis 1rem */}
                                        <p className="mt-8 text-[16px] text-base md:text-lg lg:text-[1rem] font-Ingrid  max-w-2xl leading-relaxed tracking-[O.500rem]">
                                             ECAT ou Ecole de Comptabilité et d'Administration Taratra sise à Fianarantsoa est une université privée, agréée et habilitée par le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique.
                                        </p>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-12">
                                             <button className="bg-[rgb(13,110,253)] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-[rgb(11,94,215)] transition duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                                  Trouver un bureau près de chez vous
                                                  <ArrowRight className="w-5 h-5" />
                                             </button>

                                             <button className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-[rgb(0,63,125)] transition duration-300 text-base sm:text-lg  flex items-center justify-center gap-2">
                                                  Choisir la formation qui vous convient
                                                  <ArrowRight className="w-5 h-5" />
                                             </button>
                                        </div>
                                        {/* Logo ECAT */}
                                        <div className="flex justify-center lg:justify-start mb-6">
                                             <img
                                                  src="/assets/Vector.svg"
                                                  alt="ECAT Logo"
                                                  className="w-12 h-12"
                                             />
                                        </div>
                                        <div className="absolute down-10 left-100 opacity-30">
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
                    {/* Section a propos */}
                    <section className="flex flex-col md:flex-row items-center p-8 bg-gray-50">
                         {/* Colonne de gauche avec titre et description */}
                         <div className="mb-4 md:mb-0 md:w-1/3">
                              <h2 className="text-[16px] lg:text-[1rem] font-Poppins font-semibold leading-tight mt-10 text-[rgb(242,114,135)]">
                                   AVANTAGES
                              </h2>
                              <h1 className="text-[48px] md:text-[4rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight tracking-[O.500rem]">
                                   Pourquoi <br />
                                   choisir{" "}
                                   <span className="bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent">
                                        ECAT
                                   </span>
                                   ?
                              </h1>
                              <p className='text-[16px] font-Ingrid font-Darling leading-relaxed tracking-wide text-left tracking-[O.300rem]'>
                                   Les diplômes sortis de l'ECAT sont reconnus par le Ministère de la fonction publique.
                              </p>
                         </div>

                         {/* Grille des avantages - inspirée du système de composants Figma */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full md:w-2/3 ml-auto">
                              {/* Carte 1: Enseignement En Ligne */}
                              <div className="shadow-md hover:shadow-lg transition-shadow bg-sky-100 rounded-lg p-4">
                                   <div className="flex flex-col items-center">
                                        {/* Icône avec style inspiré du Design System */}
                                        <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 flex items-center justify-center">
                                             <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                             </svg>
                                        </div>

                                        {/* Titre avec style inspiré des variables de texte */}
                                        <h3 className="text-gray-900 text-[1.25rem] font-Poppins font-semibold leading-tight mt-4 text-center">
                                             Enseignement En Ligne
                                        </h3>
                                   </div>

                                   <div className="mt-4">
                                        {/* Description */}
                                        <p className='text-[16px] font-Ingrid font-Darling leading-relaxed tracking-wide text-center'>
                                             Accédez à vos cours depuis n'importe où, à tout moment avec notre plateforme en ligne complète.
                                        </p>

                                        {/* Lien avec style inspiré du prototypage */}
                                        <a
                                             href="#"
                                             className="text-[#2D7FFB] font-medium flex items-center justify-center gap-1 hover:underline mt-4"
                                        >
                                             Voir plus
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                             </svg>
                                        </a>
                                   </div>
                              </div>

                              {/* Carte 2: Diplômes Et Certificat Reconnus */}
                              <div className="shadow-md hover:shadow-lg transition-shadow bg-sky-100 rounded-lg p-4">
                                   <div className="flex flex-col items-center">
                                        {/* Icône avec style de validation */}
                                        <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 flex items-center justify-center">
                                             <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                             </svg>
                                        </div>

                                        {/* Titre */}
                                        <h3 className="text-gray-900 text-[1.25rem] font-Poppins font-semibold leading-tight mt-4 text-center">
                                             Diplômes Et Certificats Reconnus
                                        </h3>
                                   </div>

                                   <div className="mt-4">
                                        {/* Description */}
                                        <p className='text-[16px] font-Ingrid font-Darling leading-relaxed tracking-wide text-center'>
                                             Nos diplômes sont officiellement reconnus par le Ministère de la Fonction Publique.
                                        </p>

                                        {/* Lien */}
                                        <a
                                             href="#"
                                             className="text-[#2D7FFB] font-medium flex items-center justify-center gap-1 hover:underline mt-4"
                                        >
                                             Voir plus
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                             </svg>
                                        </a>
                                   </div>
                              </div>

                              {/* Carte 3: Cours Au Format Numérique Et Papier */}
                              <div className="shadow-md hover:shadow-lg transition-shadow bg-sky-100 rounded-lg p-4">
                                   <div className="flex flex-col items-center">
                                        {/* Icône avec style de documents multiples */}
                                        <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 flex items-center justify-center">
                                             <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" transform="translate(4,4)" />
                                             </svg>
                                        </div>

                                        {/* Titre */}
                                        <h3 className="text-gray-900 text-[1.25rem] font-Poppins font-semibold leading-tight mt-4 text-center">
                                             Cours Au Format Numérique Et Papier
                                        </h3>
                                   </div>

                                   <div className="mt-4">
                                        {/* Description */}
                                        <p className='text-[16px] font-Ingrid font-Darling leading-relaxed tracking-wide text-center'>
                                             Bénéficiez de supports de cours à la fois numériques et imprimés pour un apprentissage complet.
                                        </p>

                                        {/* Lien */}
                                        <a
                                             href="#"
                                             className="text-[#2D7FFB] font-medium flex items-center justify-center gap-1 hover:underline mt-4"
                                        >
                                             Voir plus
                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                             </svg>
                                        </a>
                                   </div>
                              </div>
                         </div>
                    </section>
                    {/* Section statistiques */}
                    <section className="py-16 bg-[rgb(189,218,254)]">
                         <div className="container mx-auto px-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                   {/* Texte des statistiques: Utilisez 45px (H3) ou 32px (H4) selon la hiérarchie désirée. J'utilise 45px (2.812rem) pour le chiffre, et 16px (1rem) pour la description. */}
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+500</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Étudiants en cours</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+1500</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Diplômes délivrés</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">20/24</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Régions actives</div>
                                   </div>
                                   <div>
                                        <div className="text-[2.812rem] md:text-[2.812rem] font-Poppins font-bold text-[rgb(13,110,253)] mb-2">+30</div>
                                        <div className="text-[1rem] md:text-[1rem] font-Poppins font-regular text-[rgb(13,110,253)]">Enseignants</div>
                                   </div>
                              </div>
                         </div>
                    </section>

               </main>
          </div>
     );
}
