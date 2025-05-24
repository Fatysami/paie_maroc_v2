
import { v4 as uuidv4 } from 'uuid';

// Type pour les employés
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'onLeave';
  managerId?: string;
  companyId: string;
}

// Données statiques des employés pour les tests
export const staticEmployees: Employee[] = [
  {
    id: uuidv4(),
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@entreprise1.com',
    position: 'Développeur Senior',
    department: 'IT',
    hireDate: new Date(2020, 1, 15).toISOString(),
    salary: 55000,
    status: 'active',
    companyId: '1'
  },
  {
    id: uuidv4(),
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'marie.martin@entreprise1.com',
    position: 'Chef de Projet',
    department: 'IT',
    hireDate: new Date(2019, 6, 10).toISOString(),
    salary: 65000,
    status: 'active',
    companyId: '1'
  },
  {
    id: uuidv4(),
    firstName: 'Pierre',
    lastName: 'Bernard',
    email: 'pierre.bernard@entreprise1.com',
    position: 'Comptable',
    department: 'Finance',
    hireDate: new Date(2021, 3, 5).toISOString(),
    salary: 48000,
    status: 'onLeave',
    companyId: '1'
  },
  {
    id: uuidv4(),
    firstName: 'Sophie',
    lastName: 'Petit',
    email: 'sophie.petit@entreprise2.com',
    position: 'Ressources Humaines',
    department: 'RH',
    hireDate: new Date(2018, 9, 20).toISOString(),
    salary: 52000,
    status: 'active',
    companyId: '2'
  },
  {
    id: uuidv4(),
    firstName: 'Thomas',
    lastName: 'Moreau',
    email: 'thomas.moreau@entreprise2.com',
    position: 'Directeur Marketing',
    department: 'Marketing',
    hireDate: new Date(2017, 11, 1).toISOString(),
    salary: 72000,
    status: 'active',
    companyId: '2'
  }
];
