
export interface TypeConge {
  id: string;
  nom: string;
  dureeStandard: string;
  modifiable: boolean;
  impactSalaire: string;
  couleur: string;
  description?: string;
  limite?: number;
  actif: boolean;
  legal: boolean;
}

export interface DemandeConge {
  id: string;
  employeId: string;
  employeNom: string;
  typeCongeId: string;
  typeCongeNom: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  statut: "en_attente" | "validee" | "refusee" | "annulee";
  dateCreation: string;
  dateModification?: string;
  justificatifUrl?: string;
  commentaire?: string;
  validationManagerId?: string;
  validationManagerDate?: string;
  validationRHId?: string;
  validationRHDate?: string;
  impact?: {
    paie: boolean;
    impactMontant?: number;
    cnss?: boolean;
    amo?: boolean;
  };
}

export interface ParametrageConge {
  quotaAnnuelDefaut: number;
  reportAutorise: boolean;
  limiteReport?: number;
  anticipationAutorisee: boolean;
  limiteAnticipation?: number;
  validationManagerRequise: boolean;
  validationRHRequise: boolean;
  delaiValidation: number;
  notificationsEmail: boolean;
  notificationsPush: boolean;
  reglesAnciennete: {
    actif: boolean;
    paliers: Array<{
      annees: number;
      joursSupplementaires: number;
    }>;
  };
}

export type VueCalendrier = "jour" | "semaine" | "mois" | "annee";
