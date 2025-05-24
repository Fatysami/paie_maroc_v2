
import { User } from '@/types/user';
import { v4 as uuidv4 } from 'uuid';

// Données statiques des utilisateurs pour les tests
export const staticUsers: User[] = [
  {
    id: uuidv4(),
    email: 'admin@example.com',
    passwordHash: 'password_hash',
    role: 'admin',
    companyId: '1',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: uuidv4(),
    email: 'manager@example.com',
    passwordHash: 'password_hash',
    role: 'manager',
    companyId: '1',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    firstName: 'Manager',
    lastName: 'User'
  },
  {
    id: uuidv4(),
    email: 'employee@example.com',
    passwordHash: 'password_hash',
    role: 'employee',
    companyId: '1',
    isActive: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    firstName: 'Employee',
    lastName: 'User'
  }
];

// Utilisateur actuellement connecté (simulation)
export const currentUser: User = staticUsers[0];
