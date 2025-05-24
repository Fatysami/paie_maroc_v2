
import { User } from '@/types/user';
import { staticUsers } from '@/data/users';

export class StaticUserService {
  private users: User[] = [...staticUsers];

  /**
   * Récupère tous les utilisateurs d'une entreprise
   */
  async getUsersByCompany(companyId: string): Promise<User[]> {
    return this.users.filter(user => user.companyId === companyId);
  }

  /**
   * Récupère tous les utilisateurs sans filtrage
   */
  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const user = this.users.find(u => u.id === userId);
    return user || null;
  }

  /**
   * Récupère un utilisateur par son email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Met à jour un utilisateur existant
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  /**
   * Vérifie si un utilisateur existe déjà
   */
  async checkUserExists(userId: string): Promise<boolean> {
    return this.users.some(u => u.id === userId);
  }

  /**
   * Désactive un utilisateur
   */
  async deactivateUser(userId: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    this.users[index].isActive = false;
    return true;
  }

  /**
   * Met à jour la date de dernière connexion
   */
  async updateLastLogin(userId: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    this.users[index].lastLogin = new Date().toISOString();
    return true;
  }
}

// Export d'une instance unique du service
export const staticUserService = new StaticUserService();
