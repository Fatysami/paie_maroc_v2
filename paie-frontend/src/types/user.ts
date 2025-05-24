
/**
 * Interface représentant un utilisateur du système
 * Basée sur le modèle UML fourni
 */
export interface User {
  id: string;             // Clé primaire
  email: string;          // Email (identifiant de connexion)
  passwordHash?: string;  // Hash du mot de passe (jamais exposé côté client)
  role: string;           // Rôle (admin, rh, manager, comptable, employee)
  companyId?: string;     // FK → Company : Entreprise de l'utilisateur (peut être null pour admin système)
  isActive: boolean;      // État du compte (actif/inactif)
  lastLogin: string;      // Dernière connexion (format ISO)
  createdAt: string;      // Date de création (format ISO)
  firstName?: string;     // Prénom de l'utilisateur
  lastName?: string;      // Nom de famille de l'utilisateur
}

/**
 * Convertit un utilisateur de la base de données en format application
 */
export function mapDbUserToAppUser(dbUser: any): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    passwordHash: dbUser.password_hash,
    role: dbUser.role,
    companyId: dbUser.company_id,
    isActive: dbUser.is_active,
    lastLogin: dbUser.last_login,
    createdAt: dbUser.created_at,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name
  };
}
