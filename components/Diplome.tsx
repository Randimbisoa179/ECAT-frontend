'use client'

import React from 'react';
import { HeroSection } from '@/components/ui/feature-carousel';
import WavyUnderline from '@/components/WavyUnderline';
import { ArrowRight, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText, Newspaper, Contact, Menu, X } from 'lucide-react';

export default function Diplome() {
     return (
          <section className="p-8 bg-gray-50 mx-auto items-center px-25"> {/* Conteneur principal avec padding et fond clair */}
               <div className="text-center mb-8 items-center"> {/* Petite phrase centrée  en haut */}
                    <h2 className="text-[16px] lg:text-[1rem] font-Poppins font-semibold leading-tight mt-10 text-[rgb(242,114,135)]">
                         DIPLOMES
                    </h2>
                    <h1 className="text-[48px] md:text-[4rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight tracking-[O.500rem]">Les Diplômes que nous vous offrons</h1>
                    <p className='text-[20px] font-Ingrid font-Darling leading-relaxed tracking-wide text-center'>Une simple connexion internet suffit pourr intégrer à distance une université de renom tel que ECAT Taratra Fianarantsoa. La formation à  distance  avec ECAT permet aux étudiants de tous âge d'avoir une très grande flexibilité en termes de budgets et de planning.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grille pour les cartes : 1 colonne sur mobile, 3 sur desktop */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-sky-100"> {/* Première carte */}
                         <CardHeader>
                              <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 mx-auto">
                                   <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" transform="translate(4,4)" />
                                   </svg>
                              </div>
                              <CardTitle className="text-gray-900 text-[1.5rem] font-Poppins font-semibold leading-tight mt-4 ">DFC</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p className='text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Diplôme équivalent du BACC reconnu par le Ministère de la Fonction Publique</p>
                              <br /> <p className='text-gray-500 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Categorie III (Arrêté n° 20 079/2021-CNEAT)</p>
                              <a
                                   href="#"
                                   className="text-[#2D7FFB] font-medium flex gap-1 hover:underline mt-4"
                              >
                                   Voir plus
                                   <ArrowRight /></a>
                         </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-sky-100"> {/* deuxieme carte */}
                         <CardHeader>
                              <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 mx-auto">
                                   <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" transform="translate(4,4)" />
                                   </svg>
                              </div>
                              <CardTitle className="text-gray-900 text-[1.5rem] font-Poppins font-semibold leading-tight mt-4 ">DTS</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p className='text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Diplôme de Technicien Superieur en Gestion d'Entreprise reconnu par le Ministère de la Fonction Publique</p>
                              <br /> <p className='text-gray-500 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Categorie IV (Arrêté n° 15 181/2013-CNEAT)</p>
                              <a
                                   href="#"
                                   className="text-[#2D7FFB] font-medium flex gap-1 hover:underline mt-4"
                              >
                                   Voir plus
                                   <ArrowRight /></a>
                         </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-sky-100"> {/* Troisieme carte */}
                         <CardHeader>
                              <div className="px-6 py-4 border-2 border-[rgb(189,218,254)] rounded-full bg-[rgb(189,218,254)] shadow-md hover:bg-[rgb(189,218,254)] transition duration-300 mx-auto">
                                   <svg className="w-10 h-10 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" transform="translate(4,4)" />
                                   </svg>
                              </div>
                              <CardTitle className="text-gray-900 text-[1.5rem] font-Poppins font-semibold leading-tight mt-4 ">LICENCE</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p className='text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Diplôme de Licence en Gestion d'Entreprise reconnu par le Ministère de la Fonction Publique</p>
                              <br /> <p className='text-gray-500 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide '>Categorie V (Arrêté n° 15 182/2013-CNEAT)</p>
                              <a
                                   href="#"
                                   className="text-[#2D7FFB] font-medium flex  gap-1 hover:underline mt-4"
                              >
                                   Voir plus <ArrowRight />
                              </a>
                         </CardContent>
                    </Card>
               </div>
          </section>
     );
}
