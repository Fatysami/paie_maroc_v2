
export type EvaluationStatus = 'planifiée' | 'en-cours' | 'terminée' | 'annulée';
export type EvaluationType = 'annuelle' | 'semestrielle' | 'trimestrielle' | 'période-essai' | 'spéciale';

export interface Critere {
  id: string;
  nom: string;
  description: string;
  poids: number; // Pourcentage (0-100)
  note?: number; // Note de 1 à 5
  commentaire?: string;
}

export interface Evaluation {
  id: string;
  employeId: string;
  type: EvaluationType;
  titre: string;
  dateCreation: string;
  datePrevue: string;
  dateRealisation?: string;
  status: EvaluationStatus;
  criteres: Critere[];
  noteGlobale?: number;
  commentaireEmploye?: string;
  commentaireManager?: string;
  commentaireRH?: string;
  objectifsFixes?: string[];
  primeRecommandee?: number;
  augmentationRecommandee?: number;
  formationsRecommandees?: string[];
  risqueTurnover?: 'faible' | 'moyen' | 'élevé';
  potentiel?: 'standard' | 'prometteur' | 'élevé' | 'exceptionnel';
  creePar: string;
  validePar?: string;
  description?: string;
  signatureEmploye?: boolean | string;
  signatureManager?: boolean;
}

export interface CampagneEvaluation {
  id: string;
  titre: string;
  description: string;
  type: EvaluationType;
  dateDebut: string;
  dateFin: string;
  status: 'planifiée' | 'en-cours' | 'terminée';
  evaluations: Evaluation[];
}
