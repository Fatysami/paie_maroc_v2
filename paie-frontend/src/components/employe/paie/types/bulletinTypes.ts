
/**
 * Types for the bulletin components
 */

export type BulletinElement = {
  type: "salaire" | "prime" | "avantage" | "retenue" | "cotisation";
  nom: string;
  montant: number;
  tauxOuQuantite?: number;
};

export type BulletinData = {
  id: string;
  mois: string;
  annee: string;
  employeId: string;
  dateGeneration: string;
  datePaiement: string;
  montantBrut: number;
  montantNet: number;
  statut: "payé" | "en attente" | "erreur";
  elements: BulletinElement[];
};

export type BulletinDetailProps = {
  bulletin?: BulletinData;
};
