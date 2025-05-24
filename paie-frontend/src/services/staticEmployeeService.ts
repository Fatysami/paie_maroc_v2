
import { Employee, staticEmployees } from '@/data/employees';

export class StaticEmployeeService {
  private employees: Employee[] = [...staticEmployees];

  /**
   * Récupère tous les employés
   */
  async getAllEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  /**
   * Récupère les employés par entreprise
   */
  async getEmployeesByCompany(companyId: string): Promise<Employee[]> {
    return this.employees.filter(emp => emp.companyId === companyId);
  }

  /**
   * Récupère un employé par son ID
   */
  async getEmployeeById(id: string): Promise<Employee | null> {
    const employee = this.employees.find(emp => emp.id === id);
    return employee || null;
  }

  /**
   * Ajoute un nouvel employé
   */
  async addEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const newEmployee: Employee = {
      id: `employee-${Date.now()}`,
      ...employee
    };
    this.employees.push(newEmployee);
    return newEmployee;
  }

  /**
   * Met à jour un employé existant
   */
  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | null> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return null;
    
    this.employees[index] = { ...this.employees[index], ...employee };
    return this.employees[index];
  }

  /**
   * Supprime un employé
   */
  async deleteEmployee(id: string): Promise<boolean> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) return false;
    
    this.employees.splice(index, 1);
    return true;
  }
}

// Export d'une instance unique du service
export const staticEmployeeService = new StaticEmployeeService();
