import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CalendarDays, 
  CreditCard, 
  Users, 
  UserCheck, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  subscriptionService, 
  subscriptionPlanService, 
  userService, 
  employeeService 
} from '@/utils/clientServices';
import { Subscription } from '@/types/subscription';
import { SubscriptionPlan } from '@/types/subscriptionPlan';
import { Badge } from '@/components/ui/badge';

interface SubscriptionDetailsProps {
  companyId: string;
  onUpgrade?: () => void;
  className?: string;
}

const statusLabels: Record<string, { label: string, color: string }> = {
  active: { label: 'Actif', color: 'bg-green-500' },
  suspended: { label: 'Suspendu', color: 'bg-amber-500' },
  cancelled: { label: 'Annulé', color: 'bg-red-500' }
};

const SubscriptionDetails: React.FC<SubscriptionDetailsProps> = ({
  companyId,
  onUpgrade,
  className = ""
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer l'abonnement actif
        const sub = await subscriptionService.getActiveSubscriptionByCompany(companyId);
        setSubscription(sub);
        
        // Récupérer les détails du plan
        if (sub) {
          const planDetails = await subscriptionPlanService.getPlanById(`plan_${sub.plan}`);
          setPlan(planDetails);
        }
        
        // Compter les utilisateurs de l'entreprise
        const users = await userService.getUsersByCompany(companyId);
        setUserCount(users.length);
        
        // Compter les employés de l'entreprise
        const employees = await employeeService.getEmployeesByCompany(companyId);
        setEmployeeCount(employees.length);
        
      } catch (error) {
        console.error("Erreur lors du chargement de l'abonnement:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId]);
  
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="py-6">
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!subscription || !plan) {
    return (
      <Card className={className}>
        <CardContent className="py-6 text-center">
          <p>Aucun abonnement actif trouvé.</p>
          <Button 
            onClick={onUpgrade}
            className="mt-4"
          >
            Choisir un abonnement
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const statusInfo = statusLabels[subscription.status] || { label: 'Inconnu', color: 'bg-gray-500' };
  const endDate = new Date(subscription.endDate);
  const startDate = new Date(subscription.startDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.max(0, Math.min(100, 100 - (daysRemaining / totalDays * 100)));

  const userProgressPercentage = Math.round((userCount / plan.maxUsers) * 100);
  const employeeProgressPercentage = Math.round((employeeCount / plan.maxEmployees) * 100);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Votre abonnement</CardTitle>
            <CardDescription>Détails et limites de votre plan actuel</CardDescription>
          </div>
          <Badge className={`${statusInfo.color} text-white`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Plan {plan.name}</h3>
            <p className="text-sm text-muted-foreground">
              {plan.price} MAD/{subscription.billingCycle === 'annual' ? 'an' : 'mois'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-primary border-blue-primary hover:bg-blue-primary/10"
            onClick={onUpgrade}
          >
            Changer de plan
          </Button>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
              Période d'abonnement
            </span>
            <span className="font-medium">
              {format(startDate, 'd MMM yyyy', { locale: fr })} - {format(endDate, 'd MMM yyyy', { locale: fr })}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {daysRemaining} jours restants
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                Utilisateurs
              </span>
              <span className="text-sm font-medium">
                {userCount} / {plan.maxUsers === 999 ? '∞' : plan.maxUsers}
              </span>
            </div>
            <Progress 
              value={plan.maxUsers === 999 ? 50 : userProgressPercentage} 
              className={`h-2 ${userProgressPercentage > 80 ? 'text-amber-500' : ''}`} 
            />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-sm">
                <UserCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                Employés
              </span>
              <span className="text-sm font-medium">
                {employeeCount} / {plan.maxEmployees === 999 ? '∞' : plan.maxEmployees}
              </span>
            </div>
            <Progress 
              value={plan.maxEmployees === 999 ? 50 : employeeProgressPercentage} 
              className={`h-2 ${employeeProgressPercentage > 80 ? 'text-amber-500' : ''}`} 
            />
          </div>
        </div>
        
        {subscription.paymentProviderId && (
          <div className="flex items-center pt-2 text-sm">
            <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Mode de paiement:</span>
            <span className="font-medium ml-1">
              {subscription.paymentProviderId.startsWith('stripe') ? 'Carte bancaire' : 'PayPal'}
            </span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-col items-stretch">
        <Button variant="ghost" className="text-blue-primary justify-between">
          <span>Voir l'historique des paiements</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionDetails;
