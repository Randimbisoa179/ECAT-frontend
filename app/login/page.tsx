'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, XCircle, UserPlus, User } from 'lucide-react';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { notificationService } from '@/lib/notifications';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationStatus, setValidationStatus] = useState({ email: null, password: null });
  const [error, setError] = useState(null);

  // --- Modal d'inscription ---
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerData, setRegisterData] = useState({ nom: '', email: '', password: '' });
  const [registerLoading, setRegisterLoading] = useState(false);

  // Gestion des inputs
  const getInputClasses = (field: string) => {
    const base = 'pl-10 pr-10 bg-gray-50 border transition-colors duration-300 rounded-lg h-11';
    if (validationStatus[field] === 'error') return `${base} border-red-500 ring-red-500`;
    if (validationStatus[field] === 'success') return `${base} border-green-500 ring-green-500`;
    return `${base} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
    setValidationStatus((p) => ({ ...p, [id]: null }));
    setError(null);
  };

  // --- Connexion ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationStatus({ email: null, password: null });

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        AuthService.login(data.access_token, data);
        notificationService.success('Connexion réussie !');

        if (data.role === 'admin') router.push('/admin');
        else router.push('/');

        setValidationStatus({ email: 'success', password: 'success' });
      } else {
        setError(data.detail || 'Erreur de connexion.');
        setValidationStatus({ email: 'error', password: 'error' });
        notificationService.error(data.detail || 'Erreur de connexion.');
      }
    } catch (err) {
      setError(err.message);
      notificationService.error('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  // --- Inscription ---
  const handleRegisterChange = (e) => {
    const { id, value } = e.target;
    setRegisterData((p) => ({ ...p, [id]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registerData, role: 'etudiant' }),
      });
      const data = await res.json();
      if (res.ok) {
        notificationService.success('Inscription réussie ! Vous pouvez vous connecter.');
        setShowRegisterModal(false);
        setRegisterData({ nom: '', email: '', password: '' });
      } else {
        notificationService.error(data.detail || 'Erreur lors de l’inscription.');
      }
    } catch {
      notificationService.error('Erreur réseau.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(0,63,125)] flex items-center justify-center relative overflow-hidden p-4">

      {/* Décorations */}
      <div className="absolute top-10 left-1/4 opacity-30">
        <img src="/assets/Group%201000004925.svg" alt="Décor" className="w-20 h-20 lg:w-32 lg:h-32" />
      </div>
      <div className="absolute bottom-20 right-1/4 opacity-30">
        <img src="/assets/Group%201000004925.svg" alt="Décor" className="w-20 h-20 lg:w-32 lg:h-32" />
      </div>

      <div className="flex w-full max-w-6xl z-10">
        {/* Bloc gauche */}
        <div className="hidden lg:block lg:w-1/2 p-12 text-white">
          <div className="flex items-center space-x-3 mb-6">
            <Image src="/assets/logo.png" alt="ECAT" width={50} height={50} className="rounded-md" />
            <span className="text-16px  lg:text-[1rem] font-semibold uppercase tracking-wider text-[rgb(242,114,135)]">Connexion</span>
          </div>
          <h1 className="text-[64px] lg:text-[4rem] font-Poppins font-semibold leading-tight mt-10">
            Bienvenue dans <br />
            <span className="text-6xl">l’espace Utilisateur</span>
            <span className="block bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent">
              de l’université du futur.
            </span>
          </h1>
          <p className="mt-6 text-16px  font-Poppins lg:text-[1rem] text-blue-200">Connectez-vous ou créez un compte pour continuer.</p>
        </div>

        {/* Bloc connexion */}
        <Card className="w-full lg:w-1/2 max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-800 ">
              <h4 className="text-[32px] lg:text-[2rem] font-Poppins font-semibold leading-tight mt-10 text-[rgb(242,114,135)]"> Connexion
              </h4></CardTitle>
            <CardDescription className="text-gray-600 text-16px  lg:text-[1rem]">
              Connectez-vous à votre espace numérique ECAT
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" placeholder="email@exemple.com"
                    className={getInputClasses('email')} value={formData.email}
                    onChange={handleInputChange} required />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <Label htmlFor="password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="password" type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" className={getInputClasses('password')}
                    value={formData.password} onChange={handleInputChange} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="flex items-center text-sm text-red-500">
                  <XCircle className="w-4 h-4 mr-1" />
                  {error}
                </div>
              )}

              {/* Bouton connexion */}
              <Button type="submit" disabled={loading}
                className="w-full bg-[rgb(13,110,253)] text-white font-semibold rounded-lg hover:bg-[rgb(11,94,215)] transition h-12">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>

              {/* Lien inscription */}
              <div className="text-center text-sm text-gray-500 mt-4">
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => setShowRegisterModal(true)}
                  className="text-blue-600 hover:underline inline-flex items-center">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Créer un compte
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">* Champs obligatoires</p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* 🟢 MODALE INSCRIPTION — même style */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 relative animate-fadeIn">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
                <User className="w-6 h-6 text-blue-600" /> Inscription
              </CardTitle>
              <CardDescription className="text-gray-600">
                Créez votre compte étudiant pour rejoindre ECAT
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="nom">Nom complet *</Label>
                  <Input id="nom" type="text" placeholder="Votre nom complet"
                    value={registerData.nom} onChange={handleRegisterChange} required />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="email@exemple.com"
                    value={registerData.email} onChange={handleRegisterChange} required />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input id="password" type="password" placeholder="••••••••"
                    value={registerData.password} onChange={handleRegisterChange} required />
                </div>

                <Button type="submit" disabled={registerLoading}
                  className="w-full bg-[rgb(13,110,253)] text-white font-semibold rounded-lg hover:bg-[rgb(11,94,215)] transition h-11">
                  {registerLoading ? 'Création...' : 'Créer un compte'}
                </Button>

                <Button type="button" variant="outline"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full rounded-lg border-gray-300 bg-gray-100 hover:bg-gray-100">
                  Annuler
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

