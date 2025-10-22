// ======================
// 🎓 FORMATIONS
// ======================
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

// ======================
// 📰 ACTUALITÉS
// ======================
export interface Actualite {
  id_actualite: number;
  titre: string;
  contenu?: string;
  image?: string;
  date_publication: string;
  categorie: string;
}

export interface ActualiteCreate {
  titre: string;
  contenu?: string;
  image?: string;
  categorie: string;
}

// ======================
// 👨‍💼 ADMIN
// ======================
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

// ======================
// 🏛️ ABOUT (Présentation établissement)
// ======================
export interface AboutContent {
  id_about: number;
  titre: string;
  description: string;
  mission?: string;
  vision?: string;
  valeurs?: string;
  image?: string;
  date_mise_a_jour?: string;
}

export interface AboutContentCreate {
  titre: string;
  description: string;
  mission?: string;
  vision?: string;
  valeurs?: string;
  image?: string;
}

// ======================
// 🎬 DIRECTEURS
// ======================
export interface Director {
  id_director: number;
  nom: string;
  titre: string;
  message: string;
  photo?: string;
  date_nomination?: string;
}

export interface DirectorCreate {
  nom: string;
  titre: string;
  message: string;
  photo?: string;
}

// ======================
// 📞 CONTACT (Footer)
// ======================
export interface ContactInfo {
  id_contact: number;
  adresse: string;
  telephone: string;
  email: string;
  reseaux_sociaux?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

// ======================
// 📦 RÉPONSE API GÉNÉRIQUE
// ======================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

