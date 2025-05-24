
/**
 * Interface représentant un plan d'abonnement
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  maxUsers: number;
  maxEmployees: number;
  modulesEnabled: string[];
  isPopular?: boolean;
}

/**
 * Interface représentant les modules disponibles
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  requiredPlanLevel: 'basic' | 'pro' | 'enterprise';
  icon?: string;
}
