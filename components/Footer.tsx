'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-[#003F7D] text-white">
      <div className="container mx-auto px-4 py-12">
        {/* --- Grille principale --- */}
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
              Ministère de l’Enseignement Supérieur et de la Recherche Scientifique.
            </p>
          </div>

          {/* --- Colonne 2 : Navigation --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigations</h4>
            <ul className="space-y-2 text-blue-200">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li><Link href="/formations" className="hover:text-white">Formations</Link></li>
              <li><Link href="/about" className="hover:text-white">À propos</Link></li>
              <li><Link href="/actualites" className="hover:text-white">Actualités</Link></li>
            </ul>
          </div>

          {/* --- Colonne 3 : Contacts --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacts</h4>
            <div className="space-y-3">
              <div className="flex items-center bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <Mail className="w-4 h-4 text-black" />
                <span className="text-sm text-black">ecat.universite@gmail.com</span>
              </div>
              <div className="flex items-center bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <Phone className="w-4 h-4 text-black" />
                <span className="text-sm text-black">+261 34 21 987 75</span>
              </div>
              <div className="flex items-center bg-[rgb(189,218,254)] rounded-lg px-3 py-2 space-x-2">
                <Phone className="w-4 h-4 text-black" />
                <span className="text-sm text-black">+261 34 29 932 77</span>
              </div>
            </div>
          </div>

          {/* --- Colonne 4 : S’abonner --- */}
          <div>
            <h4 className="font-semibold text-lg mb-4">S’abonner</h4>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Entrez votre email..."
                className="bg-white/90 text-gray-800 placeholder:text-gray-500 rounded-lg"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg">
                Envoyer
              </Button>
            </div>
            <div className="flex space-x-3 mt-4">
              <Facebook className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-blue-300 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Barre inférieure --- */}
      <div className="bg-[#003F7D] py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-blue-200 text-sm px-4">
          <p>© Copyright 2025 ECAT</p>
          <div className="flex space-x-4 mt-2 md:mt-0  items-center">
            <Link href="#" className="hover:text-white ">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms & Conditions</Link>
            <Link href="https://itdcmada.mg" className="flex items-center hover:text-white">
              ITDC MADA <span className="ml-1">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

