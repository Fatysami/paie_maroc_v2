
import { SubscriptionPlan, Module } from '@/types/subscriptionPlan';

// Static subscription plans data
export const staticSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basique',
    description: 'Idéal pour les auto-entrepreneurs et petites structures',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Jusqu\'à 10 employés',
      'Calcul de paie basique',
      'Bulletins de paie standards',
      'Support par email',
      '1 utilisateur'
    ],
    maxUsers: 1,
    maxEmployees: 10,
    modulesEnabled: ['paie_basique', 'bulletins'],
    isPopular: false
  },
  {
    id: 'plan_pro',
    name: 'Professionnel',
    description: 'Parfait pour les PME et entreprises en croissance',
    price: 499,
    billingCycle: 'monthly',
    features: [
      'Jusqu\'à 100 employés',
      'Calcul de paie avancé (IR, CNSS, AMO)',
      'Déclarations sociales et fiscales',
      'Exports PDF et Excel',
      'Support prioritaire',
      '5 utilisateurs'
    ],
    maxUsers: 5,
    maxEmployees: 100,
    modulesEnabled: ['paie_basique', 'paie_avance', 'bulletins', 'declarations', 'exports'],
    isPopular: true
  },
  {
    id: 'plan_enterprise',
    name: 'Entreprise',
    description: 'Pour les grandes entreprises avec des besoins complexes',
    price: 999,
    billingCycle: 'monthly',
    features: [
      'Employés illimités',
      'Toutes les fonctionnalités Pro',
      'Intégration avec les systèmes bancaires',
      'API pour connecter vos outils',
      'Support dédié 24/7',
      'Utilisateurs illimités'
    ],
    maxUsers: 999,
    maxEmployees: 999,
    modulesEnabled: ['paie_basique', 'paie_avance', 'bulletins', 'declarations', 'exports', 'api', 'integration_bancaire'],
    isPopular: false
  },
];

// Static modules data
export const staticModules: Module[] = [
  {
    id: 'paie_basique',
    name: 'Paie de Base',
    description: 'Calcul des salaires bruts et nets',
    requiredPlanLevel: 'basic'
  },
  {
    id: 'bulletins',
    name: 'Bulletins de Paie',
    description: 'Génération de bulletins de paie standards',
    requiredPlanLevel: 'basic'
  },
  {
    id: 'paie_avance',
    name: 'Paie Avancée',
    description: 'Calculs complexes (IR, CNSS, AMO, etc.)',
    requiredPlanLevel: 'pro'
  },
  {
    id: 'declarations',
    name: 'Déclarations',
    description: 'Génération des déclarations sociales et fiscales',
    requiredPlanLevel: 'pro'
  },
  {
    id: 'exports',
    name: 'Exports Avancés',
    description: 'Export en PDF, Excel et autres formats',
    requiredPlanLevel: 'pro'
  },
  {
    id: 'api',
    name: 'API',
    description: 'Accès à l\'API pour intégrer avec d\'autres systèmes',
    requiredPlanLevel: 'enterprise'
  },
  {
    id: 'integration_bancaire',
    name: 'Intégration Bancaire',
    description: 'Connexion directe avec les systèmes bancaires',
    requiredPlanLevel: 'enterprise'
  }
];
