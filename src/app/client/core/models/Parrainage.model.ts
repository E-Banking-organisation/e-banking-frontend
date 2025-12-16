export interface Filleul {
  id: string;
  nom: string;
  email: string;
  dateInscription: string;
  statut: 'En attente' | 'Activé' | 'Prime accordée';
  bonus: string;
}

export interface ReglementParrainage {
  maxFilleulsParMois: number;
  montantMaxRecompenses: string;
  conditions: string[];
}
