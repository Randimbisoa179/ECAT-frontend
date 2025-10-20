// app/login/page.tsx
'use client';

import { useState, useCallback } from 'react';
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
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  XCircle,
  UserPlus,
  User,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { AuthService } from '@/lib/auth';
import { notificationService } from '@/lib/notifications';

// ==============================================================================
// 🟢 Composant Local : RegisterModal (Modale d'Inscription)
// ==============================================================================
interface RegisterModalProps {
  setShowRegisterModal: (show: boolean) => void;
}

function RegisterModal({ setShowRegisterModal }: RegisterModalProps) {
  const [registerData, setRegisterData] = useState({
    nom: '',
    email: '',
    password: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((p) => ({ ...p, [id]: value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
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
        notificationService.error(data.detail || "Erreur lors de l'inscription.");
      }
    } catch {
      notificationService.error('Erreur réseau.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 relative animate-fadeIn font-Poppins">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
            <User className="w-6 h-6 text-blue-600" /> Inscription
          </CardTitle>
          <CardDescription className="text-gray-600 font-Poppins">
            Créez votre compte étudiant pour rejoindre ECAT
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div>
              <Label htmlFor="nom" className="font-Poppins">
                Nom complet *
              </Label>
              <Input
                id="nom"
                type="text"
                placeholder="Votre nom complet"
                className="font-Poppins"
                value={registerData.nom}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-Poppins">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemple.com"
                className="font-Poppins"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-Poppins">
                Mot de passe *
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="font-Poppins"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-[rgb(13,110,253)] text-white font-semibold rounded-lg hover:bg-[rgb(11,94,215)] transition h-11 font-Poppins"
            >
              {registerLoading ? 'Création...' : 'Créer un compte'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRegisterModal(false)}
              className="w-full rounded-lg border-gray-300 bg-gray-100 hover:bg-gray-100 font-Poppins"
            >
              Annuler
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ==============================================================================
// 🟢 Composant Local : LoginForm (Formulaire de Connexion)
// ==============================================================================
interface LoginFormProps {
  setShowRegisterModal: (show: boolean) => void;
}

function LoginForm({ setShowRegisterModal }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationStatus, setValidationStatus] = useState<{
    email: 'success' | 'error' | null;
    password: 'success' | 'error' | null;
  }>({ email: null, password: null });
  const [error, setError] = useState<string | null>(null);

  const getInputClasses = useCallback(
    (field: 'email' | 'password') => {
      const base =
        'pl-10 pr-10 bg-white border transition-colors duration-300 rounded-lg h-11 font-Poppins';
      if (validationStatus[field] === 'error')
        return `${base} border-red-500 ring-red-500`;
      if (validationStatus[field] === 'success')
        return `${base} border-green-500 ring-green-500`;
      return `${base} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
    },
    [validationStatus]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
    setValidationStatus((p) => ({ ...p, [id]: null }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message);
      notificationService.error('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative w-full lg:w-1/2 flex items-center justify-center min-h-[500px]
        overflow-hidden
        lg:rounded-l-[350px]  bg-[#003F7D]  /* ✅ Arrondi gauche doux sur grand écran */
      "
      style={{
        backgroundImage:
          'url("/assets/img-2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-black/40 lg:rounded-l-3xl"></div>

      {/* Carte login */}
      <Card className="relative z-10 w-[90%] sm:w-[80%] md:w-[70%] bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl font-Poppins">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold text-[rgb(242,114,135)]">
            Connexion
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connectez-vous à votre espace numérique ECAT
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  className={getInputClasses('email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Mot de passe *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={getInputClasses('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-sm text-red-500">
                <XCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[rgb(13,110,253)] text-white font-semibold rounded-lg hover:bg-[rgb(11,94,215)] transition h-12"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="text-blue-600 hover:underline inline-flex items-center font-medium"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Créer un compte
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ==============================================================================
// 🎯 Composant Principal : LoginPage
// ==============================================================================
export default function LoginPage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-Poppins overflow-hidden bg-[#003F7D]">
      {/* Bloc gauche (texte de bienvenue) */}
     <a href="/"> <ArrowLeft className="h-9 w-9" /></a>
      <div className="absolute top-40 left-10 opacity-30">
        <img
          src="/assets/Group%201000004925.svg"
          alt="Décoration"
          className="w-32 h-32"
        />
      </div>

      <div className="absolute top-10 right-10 opacity-30 ">
        <img
          src="/assets/Group%201000004925.svg"
          alt="Décoration"
          className="w-32 h-32"
        />
      </div>
       
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-[#003F7D] text-white p-12 relative font-Poppins z-10">
        <div className="flex items-center space-x-3 mb-6">
          <Image
            src="/assets/logo.png"
            alt="ECAT"
            width={50}
            height={50}
            className="rounded-md"
          />
          <span className="text-base font-semibold font-Poppins uppercase tracking-wider text-[rgb(242,114,135)] text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide">
            Connexion
          </span>
        </div>
        <h1 className="text-[48px] md:text-[4rem] font-Poppins font-bold text-[rgb(45,127,251)] mb-4 leading-tight tracking-[O.500rem]">
          Bienvenue dans <br />
          <span>l'espace Utilisateur</span>
          <span className="block bg-gradient-to-r from-[rgb(242,114,135)] to-[rgb(196,106,177)] bg-clip-text text-transparent mt-4 font-Poppins">
            de l'université du futur.
          </span>
        </h1>
        <p className="text-[18px] font-Ingrid font-Darling leading-relaxed tracking-wide">
          Connectez-vous ou créez un compte pour continuer.
        </p>
      </div>


      {/* Bloc droit (formulaire) */}
      <LoginForm setShowRegisterModal={setShowRegisterModal} />

      {/* Modal inscription */}
      {showRegisterModal && (
        <RegisterModal setShowRegisterModal={setShowRegisterModal} />
      )}


    </div>

  );
}

