
import { API_BASE_URL, API_TIMEOUT, DEFAULT_HEADERS } from "@/config/api";
import { toast } from "sonner";
import { staticEmployeeService } from "./staticEmployeeService";
import { Employee } from "@/data/employees";

/**
 * Service générique pour simuler des requêtes API avec des données statiques
 */
class ApiService {
  /**
   * Simule une requête GET
   */
  async get<T>(endpoint: string, customHeaders = {}): Promise<T> {
    return this.simulateRequest<T>(endpoint, "GET", null, customHeaders);
  }

  /**
   * Simule une requête POST
   */
  async post<T>(endpoint: string, data: any, customHeaders = {}): Promise<T> {
    return this.simulateRequest<T>(endpoint, "POST", data, customHeaders);
  }

  /**
   * Simule une requête PUT
   */
  async put<T>(endpoint: string, data: any, customHeaders = {}): Promise<T> {
    return this.simulateRequest<T>(endpoint, "PUT", data, customHeaders);
  }

  /**
   * Simule une requête DELETE
   */
  async delete<T>(endpoint: string, customHeaders = {}): Promise<T> {
    return this.simulateRequest<T>(endpoint, "DELETE", null, customHeaders);
  }

  /**
   * Méthode générique pour simuler des requêtes HTTP avec des données statiques
   */
  private async simulateRequest<T>(
    endpoint: string,
    method: string,
    data: any = null,
    customHeaders = {}
  ): Promise<T> {
    console.log(`Simulating ${method} request to ${endpoint}`, data);
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));

    try {
      // Gérer les différents endpoints
      if (endpoint.startsWith("/employes")) {
        return this.handleEmployeesEndpoint<T>(endpoint, method, data);
      }
      
      // Endpoint non géré
      throw new Error(`Endpoint non géré: ${endpoint}`);
    } catch (error: any) {
      console.error("Erreur API:", error);
      toast.error(`Erreur API: ${error.message || "Une erreur s'est produite"}`);
      throw error;
    }
  }

  /**
   * Gère les requêtes liées aux employés
   */
  private async handleEmployeesEndpoint<T>(endpoint: string, method: string, data: any): Promise<T> {
    // GET /employes - Liste des employés
    if (endpoint === "/employes" && method === "GET") {
      const employees = await staticEmployeeService.getAllEmployees();
      return employees as unknown as T;
    }
    
    // GET /employes/:id - Détails d'un employé
    if (endpoint.match(/\/employes\/[^\/]+$/) && method === "GET") {
      const id = endpoint.split("/").pop()!;
      const employee = await staticEmployeeService.getEmployeeById(id);
      if (!employee) throw new Error("Employé non trouvé");
      return employee as unknown as T;
    }
    
    // POST /employes - Ajouter un employé
    if (endpoint === "/employes" && method === "POST") {
      const newEmployee = await staticEmployeeService.addEmployee(data as Omit<Employee, "id">);
      return newEmployee as unknown as T;
    }
    
    // PUT /employes/:id - Mettre à jour un employé
    if (endpoint.match(/\/employes\/[^\/]+$/) && method === "PUT") {
      const id = endpoint.split("/").pop()!;
      const updatedEmployee = await staticEmployeeService.updateEmployee(id, data);
      if (!updatedEmployee) throw new Error("Employé non trouvé");
      return updatedEmployee as unknown as T;
    }
    
    // DELETE /employes/:id - Supprimer un employé
    if (endpoint.match(/\/employes\/[^\/]+$/) && method === "DELETE") {
      const id = endpoint.split("/").pop()!;
      const success = await staticEmployeeService.deleteEmployee(id);
      if (!success) throw new Error("Employé non trouvé");
      return success as unknown as T;
    }
    
    throw new Error(`Méthode ${method} non supportée pour l'endpoint ${endpoint}`);
  }
}

// Création d'une instance unique du service API
export const apiService = new ApiService();
