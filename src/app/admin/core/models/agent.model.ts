export interface Agent {
  id: string; // On garde string pour le frontend, mais le backend utilise Long
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: 'AGENT' | 'SUPERVISOR';
  etat: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  dateCreation: Date;
  codeAgence?: string;
  lastLogin?: Date; // Non présent dans le backend
  branchName?: string; // Non présent dans le backend
}
