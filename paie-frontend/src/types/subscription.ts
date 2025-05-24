
/**
 * Interface représentant un abonnement d'une entreprise
 * Basée sur le modèle UML fourni
 */
export interface Subscription {
  id: string;                                    // Clé primaire
  companyId: string;                             // FK → Company : Entreprise abonnée
  plan: 'basic' | 'pro' | 'enterprise';          // Type d'abonnement
  status: 'active' | 'suspended' | 'cancelled';  // Statut de l'abonnement
  startDate: string;                             // Début abonnement (format ISO)
  endDate: string;                               // Fin abonnement (format ISO)
  paymentProviderId?: string;                    // ID Stripe / Paypal (pour les webhooks)
  createdAt: string;                             // Date de création (format ISO)
  billingCycle: 'monthly' | 'annual';            // Cycle de facturation
}
