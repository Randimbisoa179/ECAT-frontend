// lib/auth.ts - Version améliorée avec gestion d'erreurs
export class AuthService {
  private static readonly TOKEN_KEY = 'admin_token';
  private static readonly ADMIN_KEY = 'admin_data';

  static login(token: string, adminData: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(adminData));
    }
  }

  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_KEY);
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static getAdminData(): any {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.ADMIN_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
}

// Service API avec gestion d'erreurs améliorée
export const apiClient = {
  async get(url: string) {
    try {
      const token = AuthService.getToken();
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📤 GET ${url}`);
      const response = await fetch(url, { headers });
      console.log(`📥 Réponse ${url}:`, response.status);
      
      if (response.status === 401) {
        AuthService.logout();
        window.location.href = '/login';
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      
      return response;
    } catch (error) {
      console.error(`💥 Erreur GET ${url}:`, error);
      throw error;
    }
  },

  async post(url: string, data: any) {
    try {
      const token = AuthService.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📤 POST ${url}`, data);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      console.log(`📥 Réponse POST ${url}:`, response.status);
      
      if (response.status === 401) {
        AuthService.logout();
        window.location.href = '/login';
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      
      return response;
    } catch (error) {
      console.error(`💥 Erreur POST ${url}:`, error);
      throw error;
    }
  },

  async put(url: string, data: any) {
    try {
      const token = AuthService.getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📤 PUT ${url}`, data);
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      console.log(`📥 Réponse PUT ${url}:`, response.status);
      
      if (response.status === 401) {
        AuthService.logout();
        window.location.href = '/login';
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      
      return response;
    } catch (error) {
      console.error(`💥 Erreur PUT ${url}:`, error);
      throw error;
    }
  },

  async delete(url: string) {
    try {
      const token = AuthService.getToken();
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log(`📤 DELETE ${url}`);
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      console.log(`📥 Réponse DELETE ${url}:`, response.status);
      
      if (response.status === 401) {
        AuthService.logout();
        window.location.href = '/login';
        throw new Error('Session expirée, veuillez vous reconnecter');
      }
      
      return response;
    } catch (error) {
      console.error(`💥 Erreur DELETE ${url}:`, error);
      throw error;
    }
  },
};
