
export type ModificationType = 
  | 'personnel' 
  | 'professionnel' 
  | 'salaire' 
  | 'avantage' 
  | 'prime' 
  | 'contrat'
  | 'document'
  | 'affiliation'
  | 'banque'
  | 'conge'
  | 'absence'
  | 'autre';

export interface EntreeHistorique {
  id: string;
  dateHeure: string;
  utilisateur: string;
  employeId: string;
  employeNom?: string;
  employeMatricule?: string;
  typeModification: ModificationType;
  champModifie: string;
  ancienneValeur: string;
  nouvelleValeur: string;
  commentaire?: string;
}

export interface FiltreHistorique {
  employeId?: string;
  dateDebut?: string;
  dateFin?: string;
  typeModification?: ModificationType;
  utilisateur?: string;
  champModifie?: string;
}
