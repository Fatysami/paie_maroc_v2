
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { companyService, subscriptionService, subscriptionPlanService } from '@/utils/clientServices';
import { Company } from '@/types/company';
import { Subscription } from '@/types/subscription';
import { SubscriptionPlan } from '@/types/subscriptionPlan';
import SubscriptionDetails from '@/components/subscription/SubscriptionDetails';
import UpgradeSubscriptionDialog from '@/components/subscription/UpgradeSubscriptionDialog';

const CompanySubscriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Récupérer les informations de l'entreprise
        const companyData = await companyService.getCompanyById(id);
        setCompany(companyData);

        // Récupérer l'abonnement actif
        const subscriptionData = await subscriptionService.getActiveSubscriptionByCompany(id);
        setSubscription(subscriptionData);

        // Récupérer les détails du plan si un abonnement est actif
        if (subscriptionData) {
          const planData = await subscriptionPlanService.getPlanById(`plan_${subscriptionData.plan}`);
          setPlan(planData);
        }
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRefresh = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      // Récupérer l'abonnement actif
      const subscriptionData = await subscriptionService.getActiveSubscriptionByCompany(id);
      setSubscription(subscriptionData);
      
      // Récupérer les détails du plan
      if (subscriptionData) {
        const planData = await subscriptionPlanService.getPlanById(`plan_${subscriptionData.plan}`);
        setPlan(planData);
      }
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Abonnement</h1>
            <p className="text-muted-foreground">
              Gérer l'abonnement de {company?.name || 'l\'entreprise'}
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            Modifier l'abonnement
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubscriptionDetails 
              companyId={id || ''}
              onUpgrade={() => setIsDialogOpen(true)}
            />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-primary" />
                Prochain renouvellement
              </h2>
              {subscription && (
                <div>
                  <p>Date de renouvellement: <span className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                  </span></p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subscription.status === 'active' 
                      ? "L'abonnement sera automatiquement renouvelé à cette date." 
                      : "L'abonnement ne sera pas renouvelé automatiquement."}
                  </p>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      {subscription.status === 'active' 
                        ? "Désactiver le renouvellement auto" 
                        : "Activer le renouvellement auto"}
                    </Button>
                  </div>
                </div>
              )}
              {!subscription && !loading && (
                <p className="text-muted-foreground">
                  Aucun abonnement actif. Souscrivez à un plan pour accéder à tous les services.
                </p>
              )}
            </div>
            
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-blue-primary" />
                Mode de paiement
              </h2>
              {subscription?.paymentProviderId ? (
                <div>
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-gray-100 rounded mr-3 flex items-center justify-center">
                      {subscription.paymentProviderId.startsWith('stripe') ? 'CB' : 'PP'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {subscription.paymentProviderId.startsWith('stripe') ? 'Carte bancaire' : 'PayPal'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {subscription.paymentProviderId.startsWith('stripe') ? '•••• 4242' : 'account@email.com'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Modifier le moyen de paiement
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Aucun moyen de paiement enregistré.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {id && (
        <UpgradeSubscriptionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          currentPlanId={plan?.id}
          companyId={id}
          onUpgraded={handleRefresh}
        />
      )}
    </DashboardLayout>
  );
};

export default CompanySubscriptionPage;
