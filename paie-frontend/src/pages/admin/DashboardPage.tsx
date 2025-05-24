
import React from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Calendar, BarChart, TrendingUp } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';

// Create a client
const queryClient = new QueryClient();

// Define the type for dashboard stats
interface DashboardStats {
  totalCompanies: number;
  activeUsers: number;
  pendingSignups: number;
  monthlyRevenue: string;
  growthRate: string;
}

// Mock data for dashboard stats
const mockStats: DashboardStats = {
  totalCompanies: 32,
  activeUsers: 214,
  pendingSignups: 8,
  monthlyRevenue: '42,819 MAD',
  growthRate: '+18%',
};

// Mock API function to fetch dashboard stats
const fetchDashboardStats = async (): Promise<DashboardStats> => {
  console.log('Fetching dashboard stats...');
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStats), 500);
  });
};

const AdminDashboardContent: React.FC = () => {
  // Fetch dashboard stats with correct typing
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['adminDashboardStats'],
    queryFn: fetchDashboardStats,
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord administration</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Entreprises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">
                  +2 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Utilisateurs actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +24 depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Inscriptions en attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingSignups}</div>
                <p className="text-xs text-muted-foreground">
                  Requiert une approbation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  Revenu mensuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.monthlyRevenue}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats?.growthRate}</span> depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Add more dashboard content here */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Liste des événements récents apparaîtrait ici
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Accès rapide aux actions communes d'administration
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Wrap the component with QueryClientProvider
const AdminDashboardPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboardContent />
    </QueryClientProvider>
  );
};

export default AdminDashboardPage;
