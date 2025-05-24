
import { Subscription } from '@/types/subscription';
import { staticSubscriptions } from '@/data/subscriptions';

export class StaticSubscriptionService {
  private subscriptions: Subscription[] = [...staticSubscriptions];

  /**
   * Récupère l'abonnement actif d'une entreprise
   */
  async getActiveSubscriptionByCompany(companyId: string): Promise<Subscription | null> {
    return this.subscriptions.find(sub => 
      sub.companyId === companyId && sub.status === 'active'
    ) || null;
  }

  /**
   * Récupère tous les abonnements d'une entreprise
   */
  async getAllSubscriptionsByCompany(companyId: string): Promise<Subscription[]> {
    return this.subscriptions.filter(sub => sub.companyId === companyId);
  }

  /**
   * Récupère tous les abonnements (pour l'admin)
   */
  async getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptions;
  }

  /**
   * Crée un nouvel abonnement
   */
  async createSubscription(subscriptionData: Omit<Subscription, "id" | "createdAt">): Promise<Subscription> {
    const newSubscription: Subscription = {
      id: `subscription-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...subscriptionData
    };
    this.subscriptions.push(newSubscription);
    return newSubscription;
  }

  /**
   * Met à jour un abonnement existant
   */
  async updateSubscription(subscriptionId: string, subscriptionData: Partial<Subscription>): Promise<Subscription | null> {
    const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) return null;
    
    this.subscriptions[index] = { ...this.subscriptions[index], ...subscriptionData };
    return this.subscriptions[index];
  }

  /**
   * Annule un abonnement
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index === -1) return false;
    
    this.subscriptions[index].status = 'cancelled';
    return true;
  }
}

// Export d'une instance unique du service
export const staticSubscriptionService = new StaticSubscriptionService();
