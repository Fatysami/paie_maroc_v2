
/**
 * Utilitaires pour la génération des fichiers bancaires (CFV, CSV, etc.)
 */
import { BanqueMarocaine, FormatBancaire, PaiementEmploye } from "../types/paiementTypes";

// Configuration des formats bancaires par banque
export const configurationsBanques = [
  {
    nom: "Attijariwafa Bank",
    format: "CFV",
    formatRIB: "^\\d{24}$",
    codeInterne: "AWB",
    supporteVirementCollectif: true
  },
  {
    nom: "BMCE Bank",
    format: "CFV",
    formatRIB: "^\\d{24}$",
    codeInterne: "BMCE",
    supporteVirementCollectif: true
  },
  {
    nom: "Bank of Africa",
    format: "CSV",
    formatRIB: "^\\d{24}$",
    codeInterne: "BOA",
    supporteVirementCollectif: true
  },
  {
    nom: "CIH Bank",
    format: "CSV",
    formatRIB: "^\\d{24}$",
    codeInterne: "CIH",
    supporteVirementCollectif: true
  },
  {
    nom: "Crédit Agricole",
    format: "TXT",
    formatRIB: "^\\d{24}$",
    codeInterne: "CAM",
    supporteVirementCollectif: true
  },
  {
    nom: "Société Générale",
    format: "SEPA",
    formatRIB: "^\\d{24}$",
    codeInterne: "SG",
    supporteVirementCollectif: true
  }
];

/**
 * Formater un RIB pour l'affichage
 * @param rib Numéro de RIB à formater
 * @returns RIB formaté (ex: 123 456 7890123456789012)
 */
export const formaterRIB = (rib: string): string => {
  if (!rib) return "";
  
  // Nettoyer le RIB (retirer espaces et tirets)
  const ribClean = rib.replace(/[\s-]/g, "");
  
  // Formater par groupes de 4 chiffres (standard marocain)
  return ribClean.replace(/(\d{3})(\d{3})(\d{12})(\d{6})/, "$1 $2 $3 $4");
};

/**
 * Valider un RIB marocain
 * @param rib RIB à valider
 * @param banque Banque concernée
 * @returns Booléen indiquant si le RIB est valide
 */
export const validerRIB = (rib: string, banque: BanqueMarocaine): boolean => {
  if (!rib) return false;
  
  // Nettoyer le RIB (retirer espaces et tirets)
  const ribClean = rib.replace(/[\s-]/g, "");
  
  // Trouver la configuration de la banque
  const config = configurationsBanques.find(b => b.nom === banque);
  if (!config) return false;
  
  // Valider le format selon la regex de la banque
  const regex = new RegExp(config.formatRIB);
  return regex.test(ribClean);
};

/**
 * Générer un fichier de virement au format CFV (Attijariwafa Bank)
 * @param paiements Liste des paiements à inclure
 * @returns Contenu du fichier CFV
 */
export const genererFichierCFV = (paiements: PaiementEmploye[]): string => {
  // En-tête du fichier CFV
  let contenu = "RIB;NOM;MONTANT;MOTIF;REFERENCE\n";
  
  // Ajouter chaque paiement
  paiements.forEach(paiement => {
    const ribClean = paiement.rib.replace(/[\s-]/g, "");
    const ligne = `${ribClean};${paiement.nom};${paiement.montant.toFixed(2)};${paiement.motif};${paiement.reference}\n`;
    contenu += ligne;
  });
  
  return contenu;
};

/**
 * Générer un fichier de virement au format CSV (standard)
 * @param paiements Liste des paiements à inclure
 * @returns Contenu du fichier CSV
 */
export const genererFichierCSV = (paiements: PaiementEmploye[]): string => {
  // En-tête du fichier CSV
  let contenu = "Nom,Matricule,Banque,RIB,Montant,Motif,Reference\n";
  
  // Ajouter chaque paiement
  paiements.forEach(paiement => {
    const ribClean = paiement.rib.replace(/[\s-]/g, "");
    const ligne = `"${paiement.nom}","${paiement.matricule}","${paiement.banque}","${ribClean}",${paiement.montant.toFixed(2)},"${paiement.motif}","${paiement.reference}"\n`;
    contenu += ligne;
  });
  
  return contenu;
};

/**
 * Générer un fichier de virement au format spécifique (TXT pour certaines banques)
 * @param paiements Liste des paiements à inclure
 * @returns Contenu du fichier TXT formaté
 */
export const genererFichierTXT = (paiements: PaiementEmploye[]): string => {
  let contenu = "";
  
  // Format spécifique pour TXT (exemple pour Crédit Agricole)
  paiements.forEach(paiement => {
    const ribClean = paiement.rib.replace(/[\s-]/g, "");
    const montantFormate = paiement.montant.toFixed(2).replace(".", "").padStart(12, "0");
    const nomTronque = paiement.nom.substring(0, 30).padEnd(30, " ");
    
    // Format: RIB + Montant (12 car) + Nom (30 car) + Référence (10 car)
    const ligne = `${ribClean}${montantFormate}${nomTronque}${paiement.reference.padEnd(10, " ")}\n`;
    contenu += ligne;
  });
  
  return contenu;
};

/**
 * Générer un fichier XML au format SEPA
 * @param paiements Liste des paiements à inclure
 * @returns Contenu du fichier XML au format SEPA
 */
export const genererFichierXML = (paiements: PaiementEmploye[]): string => {
  const date = new Date().toISOString().substring(0, 10).replace(/-/g, "");
  const reference = `PAIE${date}`;
  const total = paiements.reduce((sum, p) => sum + p.montant, 0).toFixed(2);
  
  let contenu = `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>${reference}</MsgId>
      <CreDtTm>${new Date().toISOString()}</CreDtTm>
      <NbOfTxs>${paiements.length}</NbOfTxs>
      <CtrlSum>${total}</CtrlSum>
      <InitgPty>
        <Nm>ENTREPRISE</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>${reference}</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>${new Date().toISOString().substring(0, 10)}</ReqdExctnDt>
      <Dbtr>
        <Nm>ENTREPRISE</Nm>
      </Dbtr>
`;

  // Ajouter chaque transaction
  paiements.forEach((paiement, index) => {
    const ribClean = paiement.rib.replace(/[\s-]/g, "");
    contenu += `
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>${paiement.reference}</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="MAD">${paiement.montant.toFixed(2)}</InstdAmt>
        </Amt>
        <Cdtr>
          <Nm>${paiement.nom}</Nm>
        </Cdtr>
        <CdtrAcct>
          <Id>
            <Othr>
              <Id>${ribClean}</Id>
            </Othr>
          </Id>
        </CdtrAcct>
        <RmtInf>
          <Ustrd>${paiement.motif}</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
`;
  });

  contenu += `
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;

  return contenu;
};

/**
 * Fonction principale pour générer un fichier de virement selon le format requis
 * @param paiements Liste des paiements à inclure
 * @param format Format de fichier à générer
 * @returns Contenu du fichier au format demandé
 */
export const genererFichierVirement = (paiements: PaiementEmploye[], format: FormatBancaire): string => {
  switch (format) {
    case "CFV":
      return genererFichierCFV(paiements);
    case "CSV":
      return genererFichierCSV(paiements);
    case "TXT":
      return genererFichierTXT(paiements);
    case "XML":
    case "SEPA":
      return genererFichierXML(paiements);
    default:
      return genererFichierCSV(paiements); // Format par défaut
  }
};

/**
 * Télécharger le fichier généré
 * @param contenu Contenu du fichier
 * @param format Format du fichier
 * @param prefix Préfixe pour le nom du fichier
 */
export const telechargerFichier = (contenu: string, format: FormatBancaire, prefix: string = "virement"): void => {
  // Déterminer l'extension du fichier
  let extension = format.toLowerCase();
  if (format === "SEPA") extension = "xml";
  
  // Créer un objet Blob
  const blob = new Blob([contenu], { type: "text/plain;charset=utf-8" });
  
  // Créer le nom du fichier
  const date = new Date().toISOString().slice(0, 10);
  const fileName = `${prefix}_${date}.${extension}`;
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  
  // Ajouter au DOM, déclencher le téléchargement, puis nettoyer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Générer une référence unique pour un paiement
 * @param mois Mois du paiement (format court, ex: JAN)
 * @param annee Année du paiement (format court, ex: 25)
 * @param matricule Matricule de l'employé
 * @returns Référence unique formatée
 */
export const genererReferencePaiement = (
  mois: string, 
  annee: string, 
  matricule: string
): string => {
  // Extraire les 3 premières lettres du mois
  const moisCourt = mois.substring(0, 3).toUpperCase();
  
  // Extraire les 2 derniers chiffres de l'année
  const anneeCourte = annee.substring(2, 4);
  
  // Extraire le numéro du matricule (si format EMP-001, prendre le 001)
  const numeroMatricule = matricule.split("-").pop() || matricule;
  
  // Format final: MOISAA-NUMMAT (ex: JAN25-001)
  return `${moisCourt}${anneeCourte}-${numeroMatricule}`;
};

/**
 * Générer une liste de paiements à partir des bulletins de paie
 * @param bulletins Liste des bulletins de paie
 * @returns Liste des paiements formatés pour génération de fichier
 */
export const genererPaiementsDesBulletins = (bulletins: any[]): PaiementEmploye[] => {
  return bulletins.map(bulletin => {
    // Récupérer les informations de l'employé
    const employe = bulletin.employe || {};
    
    return {
      id: `paie-${bulletin.id}`,
      employeId: employe.id || bulletin.employeId,
      nom: employe.nom || "N/A",
      matricule: employe.matricule || "N/A",
      banque: employe.banque || "N/A",
      rib: employe.rib || "",
      montant: bulletin.montantNet || 0,
      motif: `Salaire ${bulletin.mois} ${bulletin.annee}`,
      reference: genererReferencePaiement(bulletin.mois, bulletin.annee, employe.matricule || "EMP"),
      statut: "en_attente",
      bulletinId: bulletin.id,
      mois: bulletin.mois,
      annee: bulletin.annee,
      dateGeneration: new Date().toISOString()
    };
  });
};

/**
 * Vérifier si les RIB des employés sont valides
 * @param paiements Liste des paiements à vérifier
 * @returns Tableau contenant les paiements problématiques
 */
export const verifierRIBEmployes = (paiements: PaiementEmploye[]): PaiementEmploye[] => {
  return paiements.filter(paiement => {
    // Vérifier si le RIB est vide
    if (!paiement.rib || paiement.rib.trim() === "") {
      return true;
    }
    
    // Nettoyer le RIB
    const ribClean = paiement.rib.replace(/[\s-]/g, "");
    
    // Vérifier la longueur standard (24 caractères pour RIB marocain)
    if (ribClean.length !== 24) {
      return true;
    }
    
    // Vérifier que ce sont uniquement des chiffres
    if (!/^\d+$/.test(ribClean)) {
      return true;
    }
    
    return false;
  });
};

/**
 * Détecter les montants anormaux dans les paiements
 * @param paiements Liste des paiements à vérifier
 * @param seuilAlerte Seuil à partir duquel générer une alerte (défaut: 50000)
 * @returns Tableau contenant les paiements avec montants anormaux
 */
export const detecterMontantsAnormaux = (
  paiements: PaiementEmploye[], 
  seuilAlerte: number = 50000
): PaiementEmploye[] => {
  return paiements.filter(paiement => paiement.montant > seuilAlerte);
};
