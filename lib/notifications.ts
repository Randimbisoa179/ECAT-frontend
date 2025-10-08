import { toast } from 'sonner';

export const notificationService = {
  success: (message: string) => {
    toast.success(message, {
      description: new Date().toLocaleTimeString('fr-FR'),
    });
  },

  error: (message: string) => {
    toast.error(message, {
      description: 'Une erreur est survenue',
    });
  },

  warning: (message: string) => {
    toast.warning(message, {
      description: 'Action requise',
    });
  },

  info: (message: string) => {
    toast.info(message, {
      description: 'Information',
    });
  },

  // Notifications spécifiques aux actions
  created: (item: string) => {
    toast.success(`${item} créé avec succès`, {
      description: 'L\'élément a été ajouté à la base de données',
    });
  },

  updated: (item: string) => {
    toast.success(`${item} modifié avec succès`, {
      description: 'Les modifications ont été enregistrées',
    });
  },

  deleted: (item: string) => {
    toast.info(`${item} supprimé avec succès`, {
      description: 'L\'élément a été supprimé définitivement',
    });
  },

  uploadSuccess: () => {
    toast.success('Image uploadée avec succès', {
      description: 'L\'image est maintenant disponible',
    });
  },

  uploadError: () => {
    toast.error('Erreur lors de l\'upload', {
      description: 'Vérifiez le format et la taille de l\'image',
    });
  }
};
