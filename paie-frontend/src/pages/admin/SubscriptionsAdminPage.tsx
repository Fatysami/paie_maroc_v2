
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus,
  Search,
  ArrowUpDown, 
  MoreHorizontal 
} from 'lucide-react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Subscription } from '@/types/subscription';
import { staticSubscriptionService } from '@/services/staticSubscriptionService';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import SubscriptionFormDialog from '@/components/admin/SubscriptionFormDialog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Status badge component
const StatusBadge = ({ status }: { status: Subscription['status'] }) => {
  const getStatusDetails = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Actif', className: 'bg-green-500 text-white hover:bg-green-600' };
      case 'suspended':
        return { label: 'Suspendu', className: 'bg-amber-500 text-white hover:bg-amber-600' };
      case 'cancelled':
        return { label: 'Annulé', className: 'bg-red-500 text-white hover:bg-red-600' };
      default:
        return { label: status, className: 'bg-gray-500 text-white hover:bg-gray-600' };
    }
  };

  const details = getStatusDetails(status);

  return <Badge className={details.className}>{details.label}</Badge>;
};

// Billing cycle badge
const BillingCycleBadge = ({ cycle }: { cycle: Subscription['billingCycle'] }) => {
  return (
    <Badge variant="outline" className="font-medium">
      {cycle === 'monthly' ? 'Mensuel' : 'Annuel'}
    </Badge>
  );
};

const SubscriptionsAdminPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Fetch all subscriptions
  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['adminAllSubscriptions'],
    queryFn: async () => {
      // We'll combine all subscriptions from different companies
      const allSubscriptions: Subscription[] = [];
      
      // In real application, this would be a direct API call to get all subscriptions
      // For now, we'll use our mock service
      const subs = await staticSubscriptionService.getAllSubscriptions();
      return subs;
    },
  });

  // Filter subscriptions based on search and filters
  const filteredSubscriptions = subscriptions?.filter((subscription) => {
    const matchesSearch = subscription.companyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    const matchesPlan = planFilter === 'all' || subscription.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleAddSubscription = (companyId?: string) => {
    setSelectedCompanyId(companyId || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (refresh: boolean) => {
    setIsDialogOpen(false);
    setSelectedCompanyId(null);
    if (refresh) {
      refetch();
      toast.success('Abonnement mis à jour avec succès');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Gestion des abonnements</h1>
            <p className="text-muted-foreground">
              Gérez les abonnements de toutes les entreprises
            </p>
          </div>
          <Button onClick={() => handleAddSubscription()}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel abonnement
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  placeholder="Rechercher par ID entreprise" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={planFilter} 
                onValueChange={setPlanFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les plans</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Liste des abonnements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary"></div>
              </div>
            ) : filteredSubscriptions && filteredSubscriptions.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Entreprise</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Date de début</TableHead>
                      <TableHead>Date de fin</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <Link 
                            to={`/admin/companies/${subscription.companyId}`} 
                            className="text-blue-primary hover:underline font-medium"
                          >
                            {subscription.companyId}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium capitalize">
                          {subscription.plan}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={subscription.status} />
                        </TableCell>
                        <TableCell>
                          <BillingCycleBadge cycle={subscription.billingCycle} />
                        </TableCell>
                        <TableCell>
                          {format(new Date(subscription.startDate), 'dd/MM/yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(subscription.endDate), 'dd/MM/yyyy', { locale: fr })}
                          <span className="block text-xs text-muted-foreground">
                            {isAfter(new Date(subscription.endDate), new Date()) ? (
                              'Actif'
                            ) : (
                              'Expiré'
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAddSubscription(subscription.companyId)}>
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/companies/${subscription.companyId}/subscription`}>
                                  Voir détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-500 focus:text-red-500"
                                onClick={() => {
                                  staticSubscriptionService.cancelSubscription(subscription.id)
                                    .then(() => {
                                      refetch();
                                      toast.success('Abonnement annulé avec succès');
                                    })
                                    .catch(err => {
                                      toast.error(`Erreur: ${err.message}`);
                                    });
                                }}
                              >
                                Annuler
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>Aucun abonnement trouvé</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPlanFilter('all');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog for adding/editing subscriptions */}
        <SubscriptionFormDialog
          open={isDialogOpen}
          onOpenChange={handleCloseDialog}
          companyId={selectedCompanyId || ''}
        />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionsAdminPage;
