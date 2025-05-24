
import { apiService } from "./apiService";
import { Employe } from "@/pages/GestionEmployes"; 

/**
 * Service pour gérer les opérations liées aux employés
 */
class EmployeService {
  private readonly baseEndpoint = "/employes";

  /**
   * Récupère tous les employés
   */
  async getAllEmployes(): Promise<Employe[]> {
    return apiService.get<Employe[]>(this.baseEndpoint);
  }

  /**
   * Récupère un employé par son ID
   */
  async getEmployeById(id: string): Promise<Employe> {
    return apiService.get<Employe>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Ajoute un nouvel employé
   */
  async addEmploye(employe: Omit<Employe, "id">): Promise<Employe> {
    return apiService.post<Employe>(this.baseEndpoint, employe);
  }

  /**
   * Met à jour un employé existant
   */
  async updateEmploye(id: string, employe: Partial<Employe>): Promise<Employe> {
    return apiService.put<Employe>(`${this.baseEndpoint}/${id}`, employe);
  }

  /**
   * Supprime un employé
   */
  async deleteEmploye(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseEndpoint}/${id}`);
  }
}

export const employeService = new EmployeService();
