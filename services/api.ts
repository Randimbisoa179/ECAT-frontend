// services/api.ts - Version corrigée et standardisée

// NOTE: J'assume que apiClient est un wrapper fetch qui gère le token d'authentification.
// NOTE: Assurez-vous que @/lib/auth inclut 'apiClient', 'AuthService', et que '@/lib/notifications' inclut 'notificationService'.
import { apiClient, AuthService } from '@/lib/auth';
import { notificationService } from '@/lib/notifications';

const API_BASE_URL = 'http://localhost:5000/api';

// --- Service pour les Formations (CRUD) ---
// ------------------------------------------
export const formationService = {
  async getAll(): Promise<any[]> {
    try {
      // Utilisation de apiClient, supposé ajouter le token d'authentification
      const response = await apiClient.get(`${API_BASE_URL}/formations`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API formations:', response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Formations chargées:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Erreur complète formations:', error);
      notificationService.error('Erreur lors du chargement des formations');
      throw error;
    }
  },

  async create(data: any): Promise<any> {
    try {
      // NOTE: apiClient.post doit gérer le Content-Type: application/json
      const response = await apiClient.post(`${API_BASE_URL}/formations`, data);
      if (!response.ok) throw new Error('Erreur lors de la création');
      return response.json();
    } catch (error) {
      notificationService.error('Erreur lors de la création de la formation');
      throw error;
    }
  },

  async update(id: number, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/formations/${id}`, data);
      if (!response.ok) throw new Error('Erreur lors de la modification');
      return response.json();
    } catch (error) {
      notificationService.error('Erreur lors de la modification de la formation');
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/formations/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la suppression');
    } catch (error) {
      notificationService.error('Erreur lors de la suppression de la formation');
      throw error;
    }
  },
};

// --- Service pour les Actualités (CRUD) ---
// ------------------------------------------
export const actualiteService = {
  async getAll(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/actualites`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API actualités:', response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Actualités chargées:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Erreur complète actualités:', error);
      notificationService.error('Erreur lors du chargement des actualités');
      throw error;
    }
  },

  async create(data: any): Promise<any> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/actualites`, data);
      if (!response.ok) throw new Error('Erreur lors de la création');
      return response.json();
    } catch (error) {
      notificationService.error('Erreur lors de la création de l\'actualité');
      throw error;
    }
  },

  async update(id: number, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/actualites/${id}`, data);
      if (!response.ok) throw new Error('Erreur lors de la modification');
      return response.json();
    } catch (error) {
      notificationService.error('Erreur lors de la modification de l\'actualité');
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/actualites/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la suppression');
    } catch (error) {
      notificationService.error('Erreur lors de la suppression de l\'actualité');
      throw error;
    }
  },
};

// --- Service pour les Administrateurs ---
// ---------------------------------------
export const adminService = {
  async getCurrent(): Promise<any> {
    try {
      // Endpoint /api/admins/me
      const response = await apiClient.get(`${API_BASE_URL}/admins/me`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API admin:', response.status, errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Admin chargé:', data);
      return data;
      
    } catch (error) {
      console.error('💥 Erreur complète admin:', error);
      notificationService.error('Erreur lors du chargement des données admin');
      throw error;
    }
  },

  async update(id: number, data: any): Promise<any> {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/admins/${id}`, data);
      if (!response.ok) throw new Error('Erreur lors de la modification');
      return response.json();
    } catch (error) {
      notificationService.error('Erreur lors de la modification');
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/admins/${id}`);
      if (!response.ok) throw new Error('Erreur lors de la suppression');
    } catch (error) {
      notificationService.error('Erreur lors de la suppression');
      throw error;
    }
  },
};

// --- Service d'Authentification ---
// Utilise fetch standard (pas besoin de token pour se connecter)
// ----------------------------------
export const authService = {
  async login(credentials: { email: string; password: string }): Promise<any> {
    try {
      console.log('🔐 Début authService.login avec:', credentials.email);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📡 Réponse reçue, status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur réponse brute:', errorText);
        let errorDetail = `Erreur ${response.status} de connexion.`;
        
        try {
          // Tente de parser l'erreur JSON pour afficher le détail exact (ex: "Email ou mot de passe incorrect")
          const errorData = JSON.parse(errorText);
          errorDetail = errorData.detail || errorText;
        } catch {
          // Si ce n'est pas du JSON (ex: erreur CORS ou 500 HTML), on garde le message brut
          errorDetail = errorText || 'Erreur inconnue';
        }
        
        throw new Error(errorDetail);
      }

      const data = await response.json();
      console.log('✅ Données login réussies:', data);
      return data;
      
    } catch (error) {
      // Assurez-vous que l'erreur est de type Error avant d'accéder à .message
      const message = error instanceof Error ? error.message : 'Erreur réseau inconnue lors du login';
      notificationService.error(message);
      throw error;
    }
  },
};

// --- Service d'Upload ---
// ------------------------
export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Récupération manuelle du token car on utilise fetch standard pour FormData
      const token = AuthService.getToken();
      const headers: HeadersInit = {};
      if (token) {
        // NOTE: On n'ajoute PAS 'Content-Type': 'application/json' pour FormData
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        // Tente de récupérer l'erreur JSON du backend
        const error = await response.json().catch(() => ({ detail: 'Échec de l\'upload' }));
        throw new Error(error.detail || 'Erreur lors de l\'upload');
      }

      return response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image';
      notificationService.error(message);
      throw error;
    }
  },
};

