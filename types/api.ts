// Types pour les formations
export interface Formation {
  id_formation: number;
  titre: string;
  description?: string;
  programme?: string;
  image?: string;
  date_inscription: string;
}

export interface FormationCreate {
  titre: string;
  description?: string;
  programme?: string;
  image?: string;
}

// Types pour les actualités
export interface Actualite {
  id_actualite: number;
  titre: string;
  contenu?: string;
  image?: string;
  date_publication: string;
}

export interface ActualiteCreate {
  titre: string;
  contenu?: string;
  image?: string;
}

// Types pour l'admin
export interface Admin {
  id_admin: number;
  nom: string;
  email: string;
}

export interface AdminCreate {
  nom: string;
  email: string;
  password: string;
}

// Réponse API générique
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}