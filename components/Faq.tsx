'use client'

import React from 'react';
import { useState } from "react";
import { Card } from './ui/card';
import { ArrowRight } from 'lucide-react';


export default function Faq() {
     const [isOpen, setIsOpen] = useState(false);
     const [isOpen1, setIsOpen1] = useState(false);
     const [isOpen2, setIsOpen2] = useState(false);
     const [isOpen3, setIsOpen3] = useState(false);
     const [isOpen4, setIsOpen4] = useState(false);

     return (
          <section className="p-8 bg-gray-50 mx-auto items-center px-25"> {/* Conteneur principal avec padding et fond clair */}
               <div className="text-center mb-8 items-center"> {/* Petite phrase centrée  en haut */}
                    <h2 className="text-[16px] lg:text-[1rem] font-Poppins font-semibold leading-tight mt-10 text-[rgb(242,114,135)]">
                         FAQ
                    </h2>
                    <h1 className="text-[48px] md:text-[4rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight tracking-[O.500rem]">Questions posé souvent</h1>

               </div>

               <Card className='mb-3 bg-gray-50 '>
                    <div >
                         <button
                              onClick={() => setIsOpen(!isOpen)}
                              className='px-6 flex items-center space-x-2 hover:text-blue-600 text-[50px] md:text-[5rem]  leading-relaxed tracking-wide font-Poppins font-bold
                              '>
                              <span className='text-lg text-blue-600'>{isOpen ? '-' : "+"}Who is eligible for this program?
                              </span>
                         </button>
                    </div>
                    <div>
                         {isOpen && (

                              <p className='text-gray-700 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide   px-12'>Any Degree/Btech/MTech final year, Passed outs, Individuals,Employees are eligible for this program.</p>

                         )}
                    </div></Card>
               <Card className='mb-3 bg-gray-50'>
                    <div >
                         <button
                              onClick={() => setIsOpen1(!isOpen1)}
                              className='px-6 flex items-center space-x-2  hover:text-blue-600 text-[50px] md:text-[5rem]  leading-relaxed tracking-wide font-Poppins font-bold'>
                              <span className='text-lg'>{isOpen1 ? '-' : "+"}What is the duration of the program?
                              </span>
                         </button>
                    </div>
                    <div>
                         {isOpen1 && (

                              <p className='text-gray-700 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide   px-12'>Any Degree/Btech/MTech final year, Passed outs, Individuals,Employees are eligible for this program.</p>

                         )}
                    </div>
               </Card>


               <Card className='mb-3 bg-gray-50'>
                    <div >
                         <button
                              onClick={() => setIsOpen2(!isOpen2)}
                              className='px-6 flex items-center space-x-2  hover:text-blue-600 text-[50px] md:text-[5rem]  leading-relaxed tracking-wide font-Poppins font-bold'>
                              <span className='text-lg'>{isOpen2 ? '-' : "+"}Do I get the assured placement?
                              </span>
                         </button>
                    </div>
                    <div>
                         {isOpen2 && (

                              <p className='text-gray-700 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide   px-12'>Any Degree/Btech/MTech final year, Passed outs, Individuals,Employees are eligible for this program.</p>

                         )}
                    </div>
               </Card>
               <Card className='mb-3 bg-gray-50'>
                    <div >
                         <button
                              onClick={() => setIsOpen3(!isOpen3)}
                              className='px-6 flex items-center space-x-2  hover:text-blue-600 text-[50px] md:text-[5rem]  leading-relaxed tracking-wide font-Poppins font-bold'>
                              <span className='text-lg'>{isOpen3 ? '-' : "+"}What is the basic academic percentage required to enroll for the course?
                              </span>
                         </button>
                    </div>
                    <div>
                         {isOpen3 && (

                              <p className='text-gray-700 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide   px-12'>Any Degree/Btech/MTech final year, Passed outs, Individuals,Employees are eligible for this program.</p>

                         )}
                    </div>
               </Card>
               <Card className='mb-3 bg-gray-50'>
                    <div >
                         <button
                              onClick={() => setIsOpen4(!isOpen4)}
                              className='px-6 flex items-center space-x-2  hover:text-blue-600 text-[50px] md:text-[5rem]  leading-relaxed tracking-wide font-Poppins font-bold'>
                              <span className='text-lg'>{isOpen4 ? '-' : "+"}What is the execution plan of the program?
                              </span>
                         </button>
                    </div>
                    <div>
                         {isOpen4 && (

                              <p className='text-gray-700 text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide   px-12'>Any Degree/Btech/MTech final year, Passed outs, Individuals,Employees are eligible for this program.</p>

                         )}
                    </div>
               </Card>
               <div className="text-center  items-center flex justify-center">
                    <button className="border-2 border-blue-700 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition duration-300 text-base sm:text-lg  flex items-center justify-center gap-2">
                         D'autre question?
                         <ArrowRight className="w-5 h-5" />
                    </button>
               </div>
          </section >
     );
}
