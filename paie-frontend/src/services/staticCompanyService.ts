
import { Company } from '@/types/company';
import { staticCompanies } from '@/data/companies';

export class StaticCompanyService {
  private companies: Company[] = [...staticCompanies];

  async getAllCompanies(): Promise<Company[]> {
    return [...this.companies];
  }

  async getCompanyById(id: string): Promise<Company> {
    const company = this.companies.find(c => c.id === id);
    if (!company) {
      throw new Error(`Entreprise non trouvée avec l'ID: ${id}`);
    }
    return company;
  }

  async createCompany(company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> {
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...company
    };
    this.companies.push(newCompany);
    return newCompany;
  }

  async updateCompany(id: string, company: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<Company> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Entreprise non trouvée avec l'ID: ${id}`);
    }
    
    this.companies[index] = { ...this.companies[index], ...company };
    return this.companies[index];
  }

  async deleteCompany(id: string): Promise<void> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Entreprise non trouvée avec l'ID: ${id}`);
    }
    
    this.companies.splice(index, 1);
  }
}

// Export d'une instance unique du service
export const staticCompanyService = new StaticCompanyService();
