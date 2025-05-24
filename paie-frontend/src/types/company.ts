
/**
 * Interface représentant une entreprise cliente
 * Basée sur le modèle UML fourni
 */
export interface Company {
  id: string;               // Clé primaire
  name: string;             // Nom de l'entreprise
  siret?: string;           // N° d'immatriculation entreprise (optionnel)
  sector?: string;          // Secteur d'activité (optionnel)
  subscriptionId?: string;  // FK → Subscription : Abonnement actif
  address: string;          // Adresse de l'entreprise
  email: string;            // Email contact
  phone?: string;           // Téléphone (optionnel)
  createdAt: string;        // Date d'inscription (format ISO)
}
