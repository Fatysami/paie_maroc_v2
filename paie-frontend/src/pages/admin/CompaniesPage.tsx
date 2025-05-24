
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ArrowUpDown, Building2, Users } from 'lucide-react';
import { Company } from '@/types/company';
import { companyService, subscriptionService } from '@/utils/supabaseClient';
import { Subscription } from '@/types/subscription';
import CompanyFormDialog from '@/components/admin/CompanyFormDialog';
import { format } from 'date-fns';

const CompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, Subscription>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Company>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await companyService.getAllCompanies();
        setCompanies(data);
        
        // Fetch subscriptions for each company
        const subscriptionsMap: Record<string, Subscription> = {};
        
        for (const company of data) {
          const subscription = await subscriptionService.getActiveSubscriptionByCompany(company.id);
          if (subscription) {
            subscriptionsMap[company.id] = subscription;
          }
        }
        
        setSubscriptions(subscriptionsMap);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleSort = (field: keyof Company) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredCompanies = companies.filter(
    company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.siret && company.siret.includes(searchTerm))
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSubscriptionBadgeColor = (status?: string) => {
    if (!status) return 'bg-muted text-muted-foreground';
    switch(status) {
      case 'active': return 'bg-green-500 text-white';
      case 'suspended': return 'bg-amber-500 text-white';
      case 'cancelled': return 'bg-rose-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Entreprises</h1>
            <p className="text-muted-foreground">
              Gérer les entreprises clientes et leurs abonnements
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une entreprise
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou SIRET..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('name')}
                    >
                      <span>Entreprise</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Contacts</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">SIRET</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => handleSort('createdAt')}
                    >
                      <span>Date d'inscription</span>
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Abonnement</th>
                  <th className="py-3 px-4 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      Chargement des entreprises...
                    </td>
                  </tr>
                ) : sortedCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center">
                      {searchTerm ? 'Aucune entreprise ne correspond à votre recherche' : 'Aucune entreprise enregistrée'}
                    </td>
                  </tr>
                ) : (
                  sortedCompanies.map((company) => (
                    <tr 
                      key={company.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/admin/companies/${company.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-primary/20 text-blue-primary flex items-center justify-center mr-3">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="text-sm text-muted-foreground">{company.sector || 'Secteur non précisé'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div>{company.email}</div>
                        <div className="text-sm text-muted-foreground">{company.phone || 'Pas de téléphone'}</div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {company.siret || 'Non renseigné'}
                      </td>
                      <td className="py-3 px-4">
                        {format(new Date(company.createdAt), 'dd/MM/yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        {subscriptions[company.id] ? (
                          <div>
                            <Badge className={getSubscriptionBadgeColor(subscriptions[company.id].status)}>
                              {subscriptions[company.id].plan.toUpperCase()}
                            </Badge>
                            <div className="text-xs mt-1 text-muted-foreground">
                              {subscriptions[company.id].status === 'active' ? 'Actif' :
                               subscriptions[company.id].status === 'suspended' ? 'Suspendu' : 'Annulé'}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline">Aucun</Badge>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/companies/${company.id}/subscription`);
                          }}
                        >
                          Gérer
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CompanyFormDialog
        open={showAddDialog}
        onOpenChange={(refresh) => {
          setShowAddDialog(false);
          if (refresh) {
            // Refresh companies list
            companyService.getAllCompanies().then(setCompanies);
          }
        }}
        company={null}
      />
    </DashboardLayout>
  );
};

export default CompaniesPage;
