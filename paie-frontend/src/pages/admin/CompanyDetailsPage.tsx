
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Calendar, Users, Building2, CreditCard, ArrowLeft, PencilIcon, Trash2
} from 'lucide-react';
import { Company } from '@/types/company';
import { Subscription } from '@/types/subscription';
import { User } from '@/types/user';
import { companyService, subscriptionService, userService } from '@/utils/clientServices';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CompanyFormDialog from '@/components/admin/CompanyFormDialog';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CompanyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch company details
        const companyData = await companyService.getCompanyById(id);
        setCompany(companyData);

        // Fetch company's subscription
        const subscriptionData = await subscriptionService.getActiveSubscriptionByCompany(id);
        setSubscription(subscriptionData);

        // Fetch users associated with this company
        const usersData = await userService.getUsersByCompany(id);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleRefreshData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      // Fetch company details
      const companyData = await companyService.getCompanyById(id);
      setCompany(companyData);

      // Fetch company's subscription
      const subscriptionData = await subscriptionService.getActiveSubscriptionByCompany(id);
      setSubscription(subscriptionData);

      // Fetch users associated with this company
      const usersData = await userService.getUsersByCompany(id);
      setUsers(usersData);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!id || !company) return;
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${company.name}" ? Cette action est irréversible.`)) {
      try {
        await companyService.deleteCompany(id);
        toast.success("Entreprise supprimée avec succès");
        navigate("/admin/companies");
      } catch (err: any) {
        toast.error(`Erreur lors de la suppression : ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <Alert>
            <AlertDescription>Entreprise non trouvée</AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Link to="/admin/companies" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Toutes les entreprises
              </Link>
            </div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground">
              {company.sector || 'Secteur non spécifié'} • Créée le {format(new Date(company.createdAt), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleDeleteCompany}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>
          
          {/* Tab Content */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nom de l'entreprise</dt>
                      <dd className="mt-1 text-base">{company.name}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                      <dd className="mt-1 text-base">{company.email}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">N° SIRET</dt>
                      <dd className="mt-1 text-base">{company.siret || 'Non renseigné'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Téléphone</dt>
                      <dd className="mt-1 text-base">{company.phone || 'Non renseigné'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Secteur d'activité</dt>
                      <dd className="mt-1 text-base">{company.sector || 'Non précisé'}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Date d'inscription</dt>
                      <dd className="mt-1 text-base">{format(new Date(company.createdAt), 'dd/MM/yyyy')}</dd>
                    </div>
                    
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-muted-foreground">Adresse</dt>
                      <dd className="mt-1 text-base">{company.address}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Subscription Info */}
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <p className="font-medium">Plan {subscription.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {subscription.status === 'active' ? 'Actif' : 
                              subscription.status === 'suspended' ? 'Suspendu' : 'Annulé'}
                          </p>
                        </div>
                        <Badge
                          className={
                            subscription.status === 'active' ? 'bg-green-500' :
                            subscription.status === 'suspended' ? 'bg-amber-500' : 'bg-red-500'
                          }
                        >
                          {subscription.status === 'active' ? 'Actif' :
                           subscription.status === 'suspended' ? 'Suspendu' : 'Annulé'}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date de début</p>
                          <p>{format(new Date(subscription.startDate), 'dd/MM/yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date de fin</p>
                          <p>{format(new Date(subscription.endDate), 'dd/MM/yyyy')}</p>
                        </div>
                      </div>

                      <Button 
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => navigate(`/admin/companies/${id}/subscription`)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Gérer l'abonnement
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-muted-foreground mb-4">Aucun abonnement actif</p>
                      <Button 
                        variant="default"
                        className="w-full"
                        onClick={() => navigate(`/admin/companies/${id}/subscription`)}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Ajouter un abonnement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Utilisateurs de l'entreprise
                </CardTitle>
                <CardDescription>
                  Liste des utilisateurs associés à l'entreprise {company.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">Utilisateur</th>
                          <th className="py-3 px-4 text-left font-medium">Email</th>
                          <th className="py-3 px-4 text-left font-medium">Rôle</th>
                          <th className="py-3 px-4 text-left font-medium">Statut</th>
                          <th className="py-3 px-4 text-left font-medium">Dernière connexion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">
                              {user.firstName} {user.lastName}
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4 capitalize">{user.role}</td>
                            <td className="py-3 px-4">
                              <Badge variant={user.isActive ? 'default' : 'secondary'}>
                                {user.isActive ? 'Actif' : 'Inactif'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Aucun utilisateur associé à cette entreprise</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <CompanyFormDialog
        open={showEditDialog}
        onOpenChange={(refresh) => {
          setShowEditDialog(false);
          if (refresh) handleRefreshData();
        }}
        company={company}
      />
    </DashboardLayout>
  );
};

export default CompanyDetailsPage;
