
import { SubscriptionPlan, Module } from '@/types/subscriptionPlan';
import { staticSubscriptionPlans, staticModules } from '@/data/subscriptionPlans';

export class StaticSubscriptionPlanService {
  private plans: SubscriptionPlan[] = [...staticSubscriptionPlans];
  private modules: Module[] = [...staticModules];

  /**
   * Récupère tous les plans d'abonnement
   */
  async getAllPlans(): Promise<SubscriptionPlan[]> {
    return [...this.plans];
  }

  /**
   * Récupère un plan par son ID
   */
  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const plan = this.plans.find(p => p.id === planId);
    return plan ? {...plan} : null;
  }

  /**
   * Récupère tous les modules disponibles
   */
  async getAllModules(): Promise<Module[]> {
    return [...this.modules];
  }

  /**
   * Vérifie si un module est disponible pour un plan donné
   */
  isModuleEnabledForPlan(moduleId: string, planId: string): boolean {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) return false;
    return plan.modulesEnabled.includes(moduleId);
  }

  /**
   * Récupère les plans avec prix annuels (remise de 20%)
   */
  async getAnnualPlans(): Promise<SubscriptionPlan[]> {
    return this.plans.map(plan => ({
      ...plan,
      price: Math.round(plan.price * 10.8), // 10% remise + 12 mois
      billingCycle: 'annual' as 'annual'
    }));
  }
}

// Export d'une instance unique du service
export const staticSubscriptionPlanService = new StaticSubscriptionPlanService();
