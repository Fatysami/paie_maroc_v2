
import { genererBulletinPDF, genererLotsZIP, DonneesBulletin } from "@/utils/paie/GenerateurPDF";

export interface BulletinExportOptions {
  format: "pdf" | "excel" | "csv";
  periode?: {
    debut: string;
    fin: string;
  };
  inclureDetails: boolean;
  inclureCumuls: boolean;
  inclureSignature: boolean;
  protection: boolean;
  motDePasse?: string;
}

// Type pour les données de bulletin simplifiées
export interface SimpleBulletin {
  id: string;
  mois: string;
  annee: string;
  employeId: string;
  montantBrut: number;
  montantNet: number;
  dateGeneration: string;
  datePaiement: string;
  statut: string;
  elements: Array<{
    type: "cotisation" | "salaire" | "prime" | "avantage" | "retenue";
    nom: string;
    montant: number;
    tauxOuQuantite?: number;
  }>;
}

/**
 * Convertit un bulletin simple en format DonneesBulletin pour la génération
 */
const convertToPDFFormat = (
  bulletin: SimpleBulletin,
  options: BulletinExportOptions
): DonneesBulletin => {
  // Données fictives pour la démo
  return {
    employe: {
      id: "emp-001",
      nom: "BENANI",
      prenom: "Mohammed",
      matricule: "MAT-2023-001",
      cin: "BE123456",
      poste: "Développeur Front-End",
      departement: "Développement",
      dateEmbauche: "15/01/2022",
      numeroCNSS: "12345678",
      numeroAMO: "87654321",
    },
    bulletin: {
      id: bulletin.id,
      periode: {
        mois: bulletin.mois,
        annee: bulletin.annee,
      },
      dateGeneration: bulletin.dateGeneration,
      datePaiement: bulletin.datePaiement,
    },
    paiement: {
      mode: "Virement bancaire",
      banque: "Bank Al-Maghrib",
      rib: "007123456789012345678901",
    },
    entreprise: {
      nom: "TechMaroc SARL",
      adresse: "123 Avenue Hassan II, Casablanca",
      rc: "RC123456",
      ice: "001234567000089",
      numeroCNSS: "CNSS98765432",
    },
    calculs: {
      salaireBrut: bulletin.montantBrut,
      salaireNetImposable: bulletin.montantBrut * 0.85,
      salaireNet: bulletin.montantNet,
      elements: bulletin.elements.map(el => ({
        type: el.type,
        nom: el.nom,
        montant: el.montant,
        base: el.type === "cotisation" ? bulletin.montantBrut : undefined,
        taux: el.tauxOuQuantite,
      })),
      cotisations: {
        cnss: Math.round(bulletin.montantBrut * 0.0448),
        amo: Math.round(bulletin.montantBrut * 0.0226),
        ir: Math.round(bulletin.montantBrut * 0.07),
        cimr: Math.round(bulletin.montantBrut * 0.03),
      },
      cumuls: options.inclureCumuls ? {
        brutAnnuel: bulletin.montantBrut * 12,
        cotisationsAnnuelles: bulletin.montantBrut * 0.15 * 12,
        netAnnuel: bulletin.montantNet * 12,
      } : undefined,
    },
    options: {
      avecCumuls: options.inclureCumuls,
      mentionsLegales: "Ce bulletin est généré conformément à la législation marocaine du travail.",
      piedPage: "TechMaroc SARL - ICE: 001234567000089",
      protectionParMotDePasse: options.protection,
      motDePasse: options.motDePasse,
    },
  };
};

/**
 * Exporte un bulletin au format PDF
 */
export const exporterBulletinPDF = async (
  bulletin: SimpleBulletin,
  options: BulletinExportOptions
): Promise<Blob> => {
  const donneesBulletin = convertToPDFFormat(bulletin, options);
  const pdfBlob = await genererBulletinPDF(donneesBulletin);
  return pdfBlob;
};

/**
 * Exporte plusieurs bulletins au format PDF et les combine dans un ZIP
 */
export const exporterBulletinsZIP = async (
  bulletins: SimpleBulletin[],
  options: BulletinExportOptions
): Promise<Blob> => {
  const donneesBulletins = bulletins.map(bulletin => 
    convertToPDFFormat(bulletin, options)
  );
  const zipBlob = await genererLotsZIP(donneesBulletins);
  return zipBlob;
};

/**
 * Télécharge un blob sous forme de fichier
 */
export const telechargerFichier = (blob: Blob, nomFichier: string): void => {
  // Créer un URL pour le blob
  const url = URL.createObjectURL(blob);
  
  // Créer un élément d'ancrage pour déclencher le téléchargement
  const a = document.createElement('a');
  a.href = url;
  a.download = nomFichier;
  
  // Ajouter et cliquer sur l'élément
  document.body.appendChild(a);
  a.click();
  
  // Nettoyer
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Exporte un bulletin au format Excel (simulation)
 */
export const exporterBulletinExcel = async (
  bulletin: SimpleBulletin,
  options: BulletinExportOptions
): Promise<Blob> => {
  // Simulation d'export Excel
  console.log("Export Excel pour le bulletin", bulletin.id);
  
  // En environnement réel, utiliserait une bibliothèque comme ExcelJS
  return new Promise((resolve) => {
    setTimeout(() => {
      const excelBlob = new Blob(
        [`Simulation Excel pour ${bulletin.mois} ${bulletin.annee}`], 
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      );
      resolve(excelBlob);
    }, 500);
  });
};

/**
 * Exporte un bulletin au format CSV (simulation)
 */
export const exporterBulletinCSV = async (
  bulletin: SimpleBulletin,
  options: BulletinExportOptions
): Promise<Blob> => {
  // Simulation d'export CSV
  console.log("Export CSV pour le bulletin", bulletin.id);
  
  // En environnement réel, générerait un vrai CSV
  return new Promise((resolve) => {
    setTimeout(() => {
      // Header du CSV
      let csv = "Période,Montant Brut,Montant Net,Date Génération,Date Paiement\n";
      
      // Ligne pour ce bulletin
      csv += `${bulletin.mois} ${bulletin.annee},${bulletin.montantBrut},${bulletin.montantNet},${bulletin.dateGeneration},${bulletin.datePaiement}\n`;
      
      // Ajouter les éléments du bulletin
      csv += "\nType,Nom,Montant,Taux\n";
      bulletin.elements.forEach(element => {
        csv += `${element.type},${element.nom},${element.montant},${element.tauxOuQuantite || ""}\n`;
      });
      
      const csvBlob = new Blob([csv], { type: "text/csv" });
      resolve(csvBlob);
    }, 500);
  });
};

/**
 * Fonction principale d'export qui distribue selon le format
 */
export const exporterBulletin = async (
  bulletin: SimpleBulletin, 
  options: BulletinExportOptions
): Promise<Blob> => {
  switch (options.format) {
    case "pdf":
      return exporterBulletinPDF(bulletin, options);
    case "excel":
      return exporterBulletinExcel(bulletin, options);
    case "csv":
      return exporterBulletinCSV(bulletin, options);
    default:
      return exporterBulletinPDF(bulletin, options);
  }
};

/**
 * Exporte plusieurs bulletins selon le format spécifié
 */
export const exporterBulletinsMultiples = async (
  bulletins: SimpleBulletin[],
  options: BulletinExportOptions
): Promise<Blob> => {
  if (options.format === "pdf") {
    // Pour PDF, on utilise le générateur ZIP
    return exporterBulletinsZIP(bulletins, options);
  } else {
    // Pour les autres formats, on génère un seul fichier avec toutes les données
    // Ceci est une simulation simplifiée
    console.log(`Export groupé en ${options.format} pour ${bulletins.length} bulletins`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const blob = new Blob(
          [`Données groupées pour ${bulletins.length} bulletins en format ${options.format}`],
          { type: options.format === "excel" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv" }
        );
        resolve(blob);
      }, 800);
    });
  }
};
