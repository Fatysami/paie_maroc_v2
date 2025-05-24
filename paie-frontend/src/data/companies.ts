
import { Company } from '@/types/company';

// Données statiques des entreprises pour les tests
export const staticCompanies: Company[] = [
  {
    id: '1',
    name: 'Entreprise Test 1',
    siret: '12345678901234',
    sector: 'Technology',
    subscriptionId: '1',
    address: '123 Rue de Test, Paris',
    email: 'contact@entreprise1.com',
    phone: '+33123456789',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Entreprise Test 2',
    siret: '98765432109876',
    sector: 'Finance',
    subscriptionId: '2',
    address: '456 Avenue de Demo, Lyon',
    email: 'contact@entreprise2.com',
    phone: '+33987654321',
    createdAt: new Date().toISOString()
  }
];
