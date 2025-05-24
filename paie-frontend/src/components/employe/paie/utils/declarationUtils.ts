
/**
 * Utilitaires pour les déclarations fiscales et sociales
 */

// Données de démonstration pour IR (Impôt sur le Revenu)
export const generateIRDeclarationData = () => {
  // Données de démonstration pour 5 employés
  return [
    {
      identifiantFiscal: "45621987",
      nomEmploye: "ALAMI Mohammed",
      netImposable: 15000,
      irRetenu: 1875.50
    },
    {
      identifiantFiscal: "32145698",
      nomEmploye: "BENANI Karim",
      netImposable: 8500,
      irRetenu: 680.25
    },
    {
      identifiantFiscal: "78965412",
      nomEmploye: "IDRISSI Sanae",
      netImposable: 22000,
      irRetenu: 3960.75
    },
    {
      identifiantFiscal: "14785236",
      nomEmploye: "OUAZZANI Najat",
      netImposable: 12000,
      irRetenu: 1350.00
    },
    {
      identifiantFiscal: "36925814",
      nomEmploye: "TAZI Ahmed",
      netImposable: 35000,
      irRetenu: 8750.25
    }
  ];
};

// Données de démonstration pour CNSS
export const generateCNSSDeclarationData = () => {
  // Données de démonstration pour 5 employés
  return [
    {
      matriculeCNSS: "1234567",
      nomEmploye: "ALAMI Mohammed",
      joursDeclaration: 26,
      salaireBrut: 17500,
      cotisationSalariale: 784.00,
      cotisationPatronale: 1571.50
    },
    {
      matriculeCNSS: "2345678",
      nomEmploye: "BENANI Karim",
      joursDeclaration: 26,
      salaireBrut: 10000,
      cotisationSalariale: 448.00,
      cotisationPatronale: 898.00
    },
    {
      matriculeCNSS: "3456789",
      nomEmploye: "IDRISSI Sanae",
      joursDeclaration: 26,
      salaireBrut: 25000,
      cotisationSalariale: 1120.00,  // Plafonné sur 6000 × 4.48%
      cotisationPatronale: 2245.00  // Plafonné pour certaines cotisations
    },
    {
      matriculeCNSS: "4567890",
      nomEmploye: "OUAZZANI Najat",
      joursDeclaration: 26,
      salaireBrut: 14000,
      cotisationSalariale: 627.20,
      cotisationPatronale: 1257.20
    },
    {
      matriculeCNSS: "5678901",
      nomEmploye: "TAZI Ahmed",
      joursDeclaration: 26,
      salaireBrut: 40000,
      cotisationSalariale: 1568.00,  // Plafonné sur 6000 × 4.48% + AMO sur totalité
      cotisationPatronale: 3592.00  // Plafonné pour certaines cotisations
    }
  ];
};

// Données de démonstration pour CIMR (régime complémentaire de retraite)
export const generateCIMRDeclarationData = () => {
  // Données de démonstration pour 5 employés
  return [
    {
      matricule: "EMP-001",
      nomEmploye: "ALAMI Mohammed",
      salaireBase: 17500,
      cotisationEmploye: 525.00,  // 3% du salaire
      cotisationEmployeur: 787.50  // 4.5% du salaire
    },
    {
      matricule: "EMP-002",
      nomEmploye: "BENANI Karim",
      salaireBase: 10000,
      cotisationEmploye: 300.00,  // 3% du salaire
      cotisationEmployeur: 450.00  // 4.5% du salaire
    },
    {
      matricule: "EMP-003",
      nomEmploye: "IDRISSI Sanae",
      salaireBase: 25000,
      cotisationEmploye: 750.00,  // 3% du salaire plafonné
      cotisationEmployeur: 1125.00  // 4.5% du salaire plafonné
    },
    {
      matricule: "EMP-004",
      nomEmploye: "OUAZZANI Najat",
      salaireBase: 14000,
      cotisationEmploye: 420.00,  // 3% du salaire
      cotisationEmployeur: 630.00  // 4.5% du salaire
    },
    {
      matricule: "EMP-005",
      nomEmploye: "TAZI Ahmed",
      salaireBase: 35000,
      cotisationEmploye: 1050.00,  // 3% du salaire
      cotisationEmployeur: 1575.00  // 4.5% du salaire
    }
  ];
};

// Fonction pour exporter les données au format CSV
export const exportToCSV = (data: any[], filename: string, type: string) => {
  if (!data || !data.length) {
    console.error("Pas de données à exporter");
    return;
  }
  
  // Déterminer les en-têtes en fonction du type de déclaration
  let headers: string[];
  let formatRow: (item: any) => string;
  
  if (type === "IR") {
    headers = ["Identifiant fiscal", "Nom employé", "Net imposable", "IR retenu"];
    formatRow = (item) => `"${item.identifiantFiscal}","${item.nomEmploye}","${item.netImposable}","${item.irRetenu}"`;
  } else if (type === "CNSS") {
    headers = ["Matricule CNSS", "Nom employé", "Jours", "Salaire brut", "Cotisation salariale", "Cotisation patronale"];
    formatRow = (item) => `"${item.matriculeCNSS}","${item.nomEmploye}","${item.joursDeclaration}","${item.salaireBrut}","${item.cotisationSalariale}","${item.cotisationPatronale}"`;
  } else {
    // Format CIMR
    headers = ["Matricule", "Nom employé", "Salaire base", "Cotisation employé", "Cotisation employeur"];
    formatRow = (item) => `"${item.matricule}","${item.nomEmploye}","${item.salaireBase}","${item.cotisationEmploye}","${item.cotisationEmployeur}"`;
  }
  
  // Créer le contenu CSV
  const headerRow = headers.join(",");
  const rows = data.map(formatRow);
  const csvContent = [headerRow, ...rows].join("\n");
  
  // Créer un blob et un lien de téléchargement
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Calculer l'IR selon le barème marocain (exemple simplifié)
export const calculateIR = (netImposable: number): number => {
  // Barème IR annuel (diviser par 12 pour mensuel)
  const annualAmount = netImposable * 12;
  let ir = 0;
  
  if (annualAmount <= 30000) {
    ir = 0;
  } else if (annualAmount <= 50000) {
    ir = (annualAmount - 30000) * 0.1;
  } else if (annualAmount <= 60000) {
    ir = 2000 + (annualAmount - 50000) * 0.2;
  } else if (annualAmount <= 80000) {
    ir = 4000 + (annualAmount - 60000) * 0.3;
  } else if (annualAmount <= 180000) {
    ir = 10000 + (annualAmount - 80000) * 0.34;
  } else {
    ir = 44000 + (annualAmount - 180000) * 0.38;
  }
  
  // Convertir en montant mensuel
  return Math.round((ir / 12) * 100) / 100;
};

// Calculer les cotisations CIMR selon les paramètres
export const calculateCIMR = (salaire: number, tauxSalarie: number, tauxEmployeur: number, plafond?: number): {
  cotisationSalarie: number;
  cotisationEmployeur: number;
} => {
  // Appliquer le plafond si défini
  const baseCalcul = plafond ? Math.min(salaire, plafond) : salaire;
  
  const cotisationSalarie = (baseCalcul * tauxSalarie) / 100;
  const cotisationEmployeur = (baseCalcul * tauxEmployeur) / 100;
  
  return {
    cotisationSalarie: Math.round(cotisationSalarie * 100) / 100,
    cotisationEmployeur: Math.round(cotisationEmployeur * 100) / 100
  };
};
