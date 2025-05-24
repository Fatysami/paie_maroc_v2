
import { Subscription } from '@/types/subscription';

// Données statiques des abonnements pour les tests
export const staticSubscriptions: Subscription[] = [
  {
    id: '1',
    companyId: '1',
    plan: 'pro',
    status: 'active',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 10)).toISOString(),
    paymentProviderId: 'stripe_12345',
    createdAt: new Date().toISOString(),
    billingCycle: 'monthly'
  },
  {
    id: '2',
    companyId: '2',
    plan: 'basic',
    status: 'active',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)).toISOString(),
    paymentProviderId: 'stripe_67890',
    createdAt: new Date().toISOString(),
    billingCycle: 'annual'
  }
];
