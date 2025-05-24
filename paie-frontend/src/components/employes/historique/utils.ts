
import { EntreeHistorique, ModificationType } from "./types";
import { v4 as uuidv4 } from 'uuid';

// Fonction pour enregistrer une modification dans l'historique
export const enregistrerModification = (
  employeId: string,
  typeModification: ModificationType,
  champModifie: string,
  ancienneValeur: any,
  nouvelleValeur: any,
  utilisateur: string = "admin@rh.com",
  commentaire?: string,
  employeNom?: string,
  employeMatricule?: string
): EntreeHistorique => {
  // Formatage des valeurs pour un affichage cohérent
  const formatValue = (value: any): string => {
    if (value === undefined || value === null) return "Non défini";
    if (typeof value === 'boolean') return value ? "Oui" : "Non";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const nouvelleEntree: EntreeHistorique = {
    id: uuidv4(),
    dateHeure: new Date().toISOString(),
    utilisateur,
    employeId,
    employeNom,
    employeMatricule,
    typeModification,
    champModifie,
    ancienneValeur: formatValue(ancienneValeur),
    nouvelleValeur: formatValue(nouvelleValeur),
    commentaire
  };

  // Dans une application réelle, cette fonction ferait un appel API 
  // pour sauvegarder l'entrée dans la base de données
  // Pour notre démo, nous allons stocker en localStorage
  
  const historique: EntreeHistorique[] = JSON.parse(
    localStorage.getItem('historiqueModifications') || '[]'
  );
  
  historique.push(nouvelleEntree);
  localStorage.setItem('historiqueModifications', JSON.stringify(historique));
  
  return nouvelleEntree;
};

// Fonction pour récupérer l'historique complet ou filtré
export const getHistorique = (filtres?: Partial<EntreeHistorique>): EntreeHistorique[] => {
  const historique: EntreeHistorique[] = JSON.parse(
    localStorage.getItem('historiqueModifications') || '[]'
  );
  
  if (!filtres) return historique.sort((a, b) => 
    new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime()
  );
  
  return historique
    .filter(entree => {
      let match = true;
      
      if (filtres.employeId && entree.employeId !== filtres.employeId) match = false;
      if (filtres.typeModification && entree.typeModification !== filtres.typeModification) match = false;
      if (filtres.utilisateur && !entree.utilisateur.includes(filtres.utilisateur)) match = false;
      if (filtres.champModifie && !entree.champModifie.includes(filtres.champModifie)) match = false;
      
      // Pour la date, vérifier si la date de l'entrée est dans la plage spécifiée
      if (filtres.dateHeure) {
        const dateFiltre = new Date(filtres.dateHeure).setHours(0, 0, 0, 0);
        const dateEntree = new Date(entree.dateHeure).setHours(0, 0, 0, 0);
        if (dateFiltre !== dateEntree) match = false;
      }
      
      return match;
    })
    .sort((a, b) => new Date(b.dateHeure).getTime() - new Date(a.dateHeure).getTime());
};

// Fonction utilitaire pour comparer deux objets et générer des entrées d'historique pour les différences
export const comparerEtEnregistrer = (
  ancien: Record<string, any>,
  nouveau: Record<string, any>,
  employeId: string,
  utilisateur: string,
  mappingChamps: Record<string, { type: ModificationType, label: string }>,
  commentaire?: string
): EntreeHistorique[] => {
  const modifications: EntreeHistorique[] = [];
  
  // Pour chaque champ dans le mapping, vérifier s'il y a eu un changement
  Object.keys(mappingChamps).forEach(champ => {
    // Gérer les champs imbriqués comme 'adresse.rue'
    const champParts = champ.split('.');
    let ancienneValeur = ancien;
    let nouvelleValeur = nouveau;
    
    for (const part of champParts) {
      ancienneValeur = ancienneValeur?.[part];
      nouvelleValeur = nouvelleValeur?.[part];
    }
    
    // Si les valeurs sont différentes, enregistrer la modification
    if (JSON.stringify(ancienneValeur) !== JSON.stringify(nouvelleValeur)) {
      const entree = enregistrerModification(
        employeId,
        mappingChamps[champ].type,
        mappingChamps[champ].label,
        ancienneValeur,
        nouvelleValeur,
        utilisateur,
        commentaire,
        `${nouveau.prenom} ${nouveau.nom}`,
        nouveau.matricule
      );
      modifications.push(entree);
    }
  });
  
  return modifications;
};

// Définit comment les champs doivent être mappés pour l'historique
export const CHAMPS_MAPPING = {
  // Informations personnelles
  'nom': { type: 'personnel' as ModificationType, label: 'Nom' },
  'prenom': { type: 'personnel' as ModificationType, label: 'Prénom' },
  'cin': { type: 'personnel' as ModificationType, label: 'CIN' },
  'email': { type: 'personnel' as ModificationType, label: 'Email' },
  'telephone': { type: 'personnel' as ModificationType, label: 'Téléphone' },
  'adresse.rue': { type: 'personnel' as ModificationType, label: 'Adresse (rue)' },
  'adresse.ville': { type: 'personnel' as ModificationType, label: 'Adresse (ville)' },
  'adresse.codePostal': { type: 'personnel' as ModificationType, label: 'Adresse (code postal)' },
  'adresse.pays': { type: 'personnel' as ModificationType, label: 'Adresse (pays)' },
  'situationFamiliale': { type: 'personnel' as ModificationType, label: 'Situation familiale' },
  
  // Informations professionnelles
  'matricule': { type: 'professionnel' as ModificationType, label: 'Matricule' },
  'poste': { type: 'professionnel' as ModificationType, label: 'Poste' },
  'departement': { type: 'professionnel' as ModificationType, label: 'Département' },
  'dateEmbauche': { type: 'professionnel' as ModificationType, label: 'Date d\'embauche' },
  'typeContrat': { type: 'contrat' as ModificationType, label: 'Type de contrat' },
  'status': { type: 'professionnel' as ModificationType, label: 'Statut' },
  'manager': { type: 'professionnel' as ModificationType, label: 'Manager' },
  
  // Informations financières
  'salaire': { type: 'salaire' as ModificationType, label: 'Salaire' },
  'salaireBase': { type: 'salaire' as ModificationType, label: 'Salaire de base' },
  'banque': { type: 'banque' as ModificationType, label: 'Banque' },
  'rib': { type: 'banque' as ModificationType, label: 'RIB' },
  'modePaiement': { type: 'banque' as ModificationType, label: 'Mode de paiement' },
  
  // Affiliations
  'numeroCnss': { type: 'affiliation' as ModificationType, label: 'Numéro CNSS' },
  'affiliationCnssAmo': { type: 'affiliation' as ModificationType, label: 'Affiliation CNSS/AMO' },
  'affiliationCimr': { type: 'affiliation' as ModificationType, label: 'Affiliation CIMR' },
  'tauxCimr': { type: 'affiliation' as ModificationType, label: 'Taux CIMR' },
  
  // Congés
  'conges': { type: 'conge' as ModificationType, label: 'Congés' },
  'soldeConges': { type: 'conge' as ModificationType, label: 'Solde de congés' },
  'demandeConge': { type: 'conge' as ModificationType, label: 'Demande de congé' },
};
