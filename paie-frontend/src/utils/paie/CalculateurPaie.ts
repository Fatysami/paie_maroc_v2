
/**
 * Module de calcul de paie conforme à la législation marocaine
 */

// Types pour les données d'entrée
type DonneesEmploye = {
  salaireBase: number;
  anciennete: number; // en années
  primes: Prime[];
  avantages: Avantage[];
  heuresSupplementaires: HeureSupplementaire[];
  absences: Absence[];
  retenues: Retenue[];
  parametresCIMR?: ParametresCIMR;
};

type Prime = {
  nom: string;
  montant: number;
  type: "fixe" | "pourcentage";
  imposable: boolean;
};

type Avantage = {
  nom: string;
  valeur: number;
  imposable: boolean;
};

type HeureSupplementaire = {
  type: "jour" | "nuit" | "ferie";
  nombreHeures: number;
  tauxMajoration: number; // en pourcentage (ex: 25, 50, 100)
};

type Absence = {
  type: "justifiee" | "nonjustifiee" | "maladie" | "congeSansSolde";
  jours: number;
};

type Retenue = {
  nom: string;
  montant: number;
};

type ParametresCIMR = {
  actif: boolean;
  tauxSalarie: number; // en pourcentage
  tauxEmployeur: number; // en pourcentage
  plafond?: number;
};

type ParametresLegaux = {
  smig: number;
  plafondCNSS: number;
  tauxCNSSEmploye: number;
  tauxCNSSEmployeur: number;
  tauxAMOEmploye: number;
  tauxAMOEmployeur: number;
  tauxCIMREmploye: number;
  tauxCIMREmployeur: number;
  plafondCIMR: number;
  tranches: TrancheIR[];
};

type TrancheIR = {
  min: number;
  max: number | null;
  taux: number;
  sommeDeduire: number;
};

// Résultat du calcul
type ResultatPaie = {
  salaireBrut: number;
  salaireNetImposable: number;
  salaireNet: number;
  cotisations: {
    cnss: number;
    amo: number;
    ir: number;
    cimr?: number;
  };
  detailBrut: {
    salaireBase: number;
    primes: {nom: string; montant: number}[];
    avantages: {nom: string; valeur: number}[];
    heuresSupplementaires: number;
  };
  detailRetenues: {
    cotisationsSociales: number;
    cotisationsFiscales: number;
    autresRetenues: number;
    absences: number;
  };
  fraisEmployeur: {
    cnss: number;
    amo: number;
    cimr?: number;
    total: number;
  };
};

// Paramètres légaux par défaut (Maroc 2023)
const parametresParDefaut: ParametresLegaux = {
  smig: 3111.30, // SMIG mensuel en MAD
  plafondCNSS: 6000,
  tauxCNSSEmploye: 4.48,
  tauxCNSSEmployeur: 8.98,
  tauxAMOEmploye: 2.26,
  tauxAMOEmployeur: 4.11,
  tauxCIMREmploye: 3,
  tauxCIMREmployeur: 4.5,
  plafondCIMR: 10000,
  tranches: [
    { min: 0, max: 30000, taux: 0, sommeDeduire: 0 },
    { min: 30001, max: 50000, taux: 10, sommeDeduire: 3000 },
    { min: 50001, max: 60000, taux: 20, sommeDeduire: 8000 },
    { min: 60001, max: 80000, taux: 30, sommeDeduire: 14000 },
    { min: 80001, max: 180000, taux: 34, sommeDeduire: 17200 },
    { min: 180001, max: null, taux: 38, sommeDeduire: 24400 }
  ]
};

/**
 * Calculateur de paie principal
 */
export function calculerPaie(
  donnees: DonneesEmploye, 
  parametres: ParametresLegaux = parametresParDefaut
): ResultatPaie {
  // 1. Calcul du salaire brut
  const salaireBrut = calculerSalaireBrut(donnees);
  
  // 2. Calcul des cotisations sociales
  const cotisations = calculerCotisationsSociales(salaireBrut, donnees, parametres);
  
  // 3. Calcul du salaire net imposable
  const salaireNetImposable = calculerSalaireNetImposable(salaireBrut, cotisations);
  
  // 4. Calcul de l'IR
  const irAnnuel = calculerIR(salaireNetImposable * 12, parametres.tranches);
  const irMensuel = Math.round(irAnnuel / 12);
  
  // 5. Calcul du salaire net
  const autresRetenues = donnees.retenues.reduce((total, retenue) => total + retenue.montant, 0);
  const salaireNet = salaireNetImposable - irMensuel - autresRetenues;
  
  // 6. Calcul des frais pour l'employeur
  const fraisEmployeur = calculerFraisEmployeur(salaireBrut, donnees, parametres);
  
  // 7. Préparation du résultat détaillé
  const detailBrut = {
    salaireBase: donnees.salaireBase,
    primes: donnees.primes.map(prime => ({
      nom: prime.nom,
      montant: prime.type === "fixe" ? prime.montant : (donnees.salaireBase * prime.montant / 100)
    })),
    avantages: donnees.avantages.map(avantage => ({
      nom: avantage.nom,
      valeur: avantage.valeur
    })),
    heuresSupplementaires: calculerMontantHeuresSupplementaires(donnees)
  };
  
  const montantAbsences = calculerMontantAbsences(donnees);
  
  const detailRetenues = {
    cotisationsSociales: cotisations.cnss + cotisations.amo + (cotisations.cimr || 0),
    cotisationsFiscales: irMensuel,
    autresRetenues: autresRetenues,
    absences: montantAbsences
  };
  
  return {
    salaireBrut,
    salaireNetImposable,
    salaireNet,
    cotisations: {
      cnss: cotisations.cnss,
      amo: cotisations.amo,
      ir: irMensuel,
      cimr: cotisations.cimr
    },
    detailBrut,
    detailRetenues,
    fraisEmployeur
  };
}

/**
 * Calcul du salaire brut (salaire de base + primes + avantages + heures sup - absences)
 */
function calculerSalaireBrut(donnees: DonneesEmploye): number {
  // 1. Salaire de base
  let salaireBrut = donnees.salaireBase;
  
  // 2. Primes fixes et pourcentages
  for (const prime of donnees.primes) {
    if (prime.type === "fixe") {
      salaireBrut += prime.montant;
    } else {
      // Prime en pourcentage du salaire de base
      salaireBrut += (donnees.salaireBase * prime.montant / 100);
    }
  }
  
  // 3. Avantages en nature valorisés
  for (const avantage of donnees.avantages) {
    salaireBrut += avantage.valeur;
  }
  
  // 4. Heures supplémentaires
  salaireBrut += calculerMontantHeuresSupplementaires(donnees);
  
  // 5. Déduction des absences
  salaireBrut -= calculerMontantAbsences(donnees);
  
  return Math.round(salaireBrut * 100) / 100;
}

/**
 * Calcul du montant des heures supplémentaires
 */
function calculerMontantHeuresSupplementaires(donnees: DonneesEmploye): number {
  const tauxHoraire = donnees.salaireBase / 191; // 191h = moyenne mensuelle (44h/semaine)
  let montantTotal = 0;
  
  for (const heureSup of donnees.heuresSupplementaires) {
    const majoration = 1 + (heureSup.tauxMajoration / 100);
    montantTotal += heureSup.nombreHeures * tauxHoraire * majoration;
  }
  
  return montantTotal;
}

/**
 * Calcul du montant des absences
 */
function calculerMontantAbsences(donnees: DonneesEmploye): number {
  const tauxJournalier = donnees.salaireBase / 26; // 26 jours ouvrables par mois
  let montantTotal = 0;
  
  for (const absence of donnees.absences) {
    // Les absences justifiées avec maintien de salaire ne sont pas déduites
    if (absence.type !== "justifiee") {
      montantTotal += absence.jours * tauxJournalier;
    }
  }
  
  return montantTotal;
}

/**
 * Calcul des cotisations sociales (CNSS, AMO, CIMR)
 */
function calculerCotisationsSociales(
  salaireBrut: number, 
  donnees: DonneesEmploye, 
  parametres: ParametresLegaux
): { cnss: number; amo: number; cimr?: number } {
  // CNSS plafonné
  const baseCNSS = Math.min(salaireBrut, parametres.plafondCNSS);
  const cotisationCNSS = Math.round(baseCNSS * parametres.tauxCNSSEmploye) / 100;
  
  // AMO (non plafonné)
  const cotisationAMO = Math.round(salaireBrut * parametres.tauxAMOEmploye) / 100;
  
  // CIMR (facultatif)
  let cotisationCIMR;
  if (donnees.parametresCIMR?.actif) {
    const tauxCIMR = donnees.parametresCIMR.tauxSalarie;
    const plafondCIMR = donnees.parametresCIMR.plafond || parametres.plafondCIMR;
    const baseCIMR = Math.min(salaireBrut, plafondCIMR);
    cotisationCIMR = Math.round(baseCIMR * tauxCIMR) / 100;
  }
  
  return {
    cnss: cotisationCNSS,
    amo: cotisationAMO,
    cimr: cotisationCIMR
  };
}

/**
 * Calcul du salaire net imposable
 */
function calculerSalaireNetImposable(salaireBrut: number, cotisations: { cnss: number; amo: number; cimr?: number }): number {
  const totalCotisations = cotisations.cnss + cotisations.amo + (cotisations.cimr || 0);
  return Math.round((salaireBrut - totalCotisations) * 100) / 100;
}

/**
 * Calcul de l'IR selon les tranches (barème annuel)
 */
function calculerIR(revenuAnnuel: number, tranches: TrancheIR[]): number {
  // Appliquer l'abattement forfaitaire de 20% plafonné à 30 000 MAD
  const abattement = Math.min(revenuAnnuel * 0.2, 30000);
  const revenuNetImposable = revenuAnnuel - abattement;
  
  // Trouver la tranche applicable
  const trancheApplicable = tranches.find(
    tranche => revenuNetImposable > tranche.min && (tranche.max === null || revenuNetImposable <= tranche.max)
  );
  
  if (!trancheApplicable) {
    return 0;
  }
  
  // Calcul de l'IR selon la formule: (revenu * taux%) - somme à déduire
  const irAnnuel = (revenuNetImposable * trancheApplicable.taux / 100) - trancheApplicable.sommeDeduire;
  
  return Math.max(0, Math.round(irAnnuel));
}

/**
 * Calcul des frais pour l'employeur
 */
function calculerFraisEmployeur(
  salaireBrut: number, 
  donnees: DonneesEmploye, 
  parametres: ParametresLegaux
): { cnss: number; amo: number; cimr?: number; total: number } {
  // Cotisations patronales CNSS (plafonné)
  const baseCNSS = Math.min(salaireBrut, parametres.plafondCNSS);
  const cotisationCNSS = Math.round(baseCNSS * parametres.tauxCNSSEmployeur) / 100;
  
  // Cotisation patronale AMO (non plafonné)
  const cotisationAMO = Math.round(salaireBrut * parametres.tauxAMOEmployeur) / 100;
  
  // Cotisation patronale CIMR (facultatif)
  let cotisationCIMR;
  if (donnees.parametresCIMR?.actif) {
    const tauxCIMR = donnees.parametresCIMR.tauxEmployeur;
    const plafondCIMR = donnees.parametresCIMR.plafond || parametres.plafondCIMR;
    const baseCIMR = Math.min(salaireBrut, plafondCIMR);
    cotisationCIMR = Math.round(baseCIMR * tauxCIMR) / 100;
  }
  
  const total = cotisationCNSS + cotisationAMO + (cotisationCIMR || 0);
  
  return {
    cnss: cotisationCNSS,
    amo: cotisationAMO,
    cimr: cotisationCIMR,
    total
  };
}

// Exemple d'utilisation
// const resultat = calculerPaie({
//   salaireBase: 10000,
//   anciennete: 3,
//   primes: [{nom: "Prime de transport", montant: 800, type: "fixe", imposable: true}],
//   avantages: [{nom: "Logement de fonction", valeur: 1500, imposable: true}],
//   heuresSupplementaires: [{type: "jour", nombreHeures: 10, tauxMajoration: 25}],
//   absences: [{type: "nonjustifiee", jours: 1}],
//   retenues: [{nom: "Avance", montant: 1000}],
//   parametresCIMR: {actif: true, tauxSalarie: 3, tauxEmployeur: 4.5}
// });
