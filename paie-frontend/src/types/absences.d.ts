
export interface Absence {
  id: string;
  employeId: string;
  employeNom: string;
  dateDebut: string;
  dateFin: string;
  heureDebut?: string;
  heureFin?: string;
  nombreJours: number;
  typeAbsence: TypeAbsence;
  statut: StatutAbsence;
  motif: string;
  motifRefus?: string;
  justificatifUrl?: string;
  justificatifRequis: boolean;
  justificatifValide?: boolean;
  dateValiditeJustificatif?: string;
  dateDeclaration: string;
  dateModification?: string;
  declarePar: "employe" | "rh";
  validationManagerId?: string;
  validationManagerDate?: string;
  validationRHId?: string;
  validationRHDate?: string;
  impact: ImpactAbsence;
  commentaireRH?: string;
  alertes?: AlerteAbsence[];
}

export type StatutAbsence = "en_attente" | "validee" | "refusee" | "regularisee";

export type TypeAbsence = 
  | "maladie" 
  | "absence_injustifiee" 
  | "retard" 
  | "absence_exceptionnelle" 
  | "absence_sans_solde"
  | "autre";

export interface ImpactAbsence {
  remunere: boolean;
  tauxRemuneration?: number; // Pour maladie: 100% pour les 3 premiers jours, puis % CNSS
  cnss: boolean; // Impact sur cotisations CNSS
  amo: boolean; // Impact sur AMO (Assurance Maladie Obligatoire)
  retenueSalaire?: number; // Montant de la retenue sur salaire le cas échéant
  impactConges?: boolean; // Impact sur le cumul de congés
  cumulJoursCarence?: number; // Cumul des jours de carence (pour maladie)
}

export interface AlerteAbsence {
  type: "absence_repetee" | "absence_injustifiee" | "retard_frequent" | "pattern_suspect" | "justificatif_manquant";
  date: string;
  message: string;
  niveau: "info" | "warning" | "danger";
  notifieManager: boolean;
  notifieRH: boolean;
  resolue: boolean;
  dateResolution?: string;
}

export interface AbsenceStats {
  total: number;
  maladie: number;
  injustifiees: number;
  retards: number;
  exceptionnelles: number;
  sansSolde: number;
  autres: number;
  enAttente: number;
  validees: number;
  refusees: number;
  regularisees: number;
  impactPaie: number;
  // Nouvelles statistiques
  totalJours: number;
  coutTotal: number;
  tauxAbsenteisme: number;
  evolutionMensuelle: Record<string, number>;
  repartitionService: Record<string, number>;
}

export interface FiltreAbsences {
  employeId?: string;
  departement?: string;
  dateDebut?: string;
  dateFin?: string;
  typeAbsence?: TypeAbsence;
  statut?: StatutAbsence;
  motif?: string;
  avecJustificatif?: boolean;
  declarePar?: "employe" | "rh";
  impactPaie?: boolean;
}

export interface ParametrageAbsences {
  validationAutomatique: {
    activee: boolean;
    dureeMaxJours: number;
    motifsAutorises: string[];
  };
  alertes: {
    absencesRepetees: {
      seuil: number;
      periode: "semaine" | "mois" | "trimestre";
      notifierRH: boolean;
      notifierManager: boolean;
    };
    retards: {
      seuilMinutes: number;
      notifierRH: boolean;
      notifierManager: boolean;
    };
    patternsSuspects: {
      activer: boolean;
      detecterLundiVendredi: boolean;
      detecterVeilleFeries: boolean;
    };
  };
  justificatifs: {
    delaiUploadJours: number;
    typesAcceptes: string[];
    tailleMaxMo: number;
    verificationOCR: boolean;
  };
  integrationPaie: {
    retenueTauxDefaut: number;
    prisPaieApresValidation: boolean;
    retenueRetardParMinute?: number;
  };
  reglesMaladie: {
    joursCarenceEmployeur: number; // Généralement 3 jours
    tauxPriseChargeEmployeur: number; // Généralement 100%
    tauxPriseChargeCNSS: number; // Pourcentage pris en charge par la CNSS après carence
  };
}

export interface JustificatifAbsence {
  id: string;
  absenceId: string;
  employeId: string;
  typeDocument: "certificat_medical" | "attestation_deces" | "convocation" | "autre";
  dateUpload: string;
  dateEmission?: string;
  dateExpiration?: string;
  filename: string;
  filesize: number;
  mimeType: string;
  url: string;
  validationOCR?: {
    valide: boolean;
    dateDetectee?: string; 
    nomDetecte?: string;
    diagnosticDetecte?: string;
  };
  commentaireValidation?: string;
  valideParRH: boolean;
  dateValidationRH?: string;
}

// Types pour les statistiques d'absence
export interface AnalyseAbsence {
  periode: string;
  tauxAbsenteisme: number;
  coutTotal: number;
  repartitionTypes: Record<TypeAbsence, number>;
  tendances: {
    direction: "hausse" | "baisse" | "stable";
    pourcentage: number;
  };
  topDepartements: Array<{
    nom: string;
    taux: number;
    cout: number;
  }>;
  topEmployes: Array<{
    id: string;
    nom: string;
    nombreAbsences: number;
    nombreJours: number;
  }>;
}
