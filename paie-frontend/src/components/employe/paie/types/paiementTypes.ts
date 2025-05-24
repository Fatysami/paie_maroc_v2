
/**
 * Types pour le module de paiement et génération de fichiers bancaires
 */

export type StatutPaiement = "en_attente" | "payé" | "rejeté";

export type FormatBancaire = "CFV" | "CSV" | "TXT" | "XML" | "SEPA";

export type BanqueMarocaine = 
  | "Attijariwafa Bank" 
  | "BMCE Bank" 
  | "Bank of Africa" 
  | "CIH Bank" 
  | "Crédit Agricole" 
  | "Société Générale"
  | "Crédit du Maroc"
  | "Al Barid Bank"
  | "CFG Bank"
  | "BMCI"
  | "Autre";

export type ConfigurationBanque = {
  nom: BanqueMarocaine;
  format: FormatBancaire;
  formatRIB: string; // Format regex pour validation
  codeInterne: string;
  supporteVirementCollectif: boolean;
};

export type PaiementEmploye = {
  id: string;
  employeId: string;
  nom: string;
  matricule: string;
  banque: string;
  rib: string;
  montant: number;
  motif: string;
  reference: string;
  statut: StatutPaiement;
  datePaiement?: string;
  bulletinId?: string;
  mois: string;
  annee: string;
  dateGeneration: string;
};

export type FichierVirement = {
  id: string;
  nom: string;
  format: FormatBancaire;
  banque: BanqueMarocaine;
  dateGeneration: string;
  montantTotal: number;
  nombreEmployes: number;
  statut: "généré" | "importé" | "validé" | "rejeté";
  paiements: PaiementEmploye[];
  genereParUserId: string;
  genereParUserNom: string;
};

export type GenerationCFVParams = {
  mois: string;
  annee: string;
  banque?: BanqueMarocaine;
  departement?: string;
  employeIds?: string[];
};
