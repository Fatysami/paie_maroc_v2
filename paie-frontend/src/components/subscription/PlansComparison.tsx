
import React, { useState, useEffect } from 'react';
import { subscriptionPlanService } from '@/utils/clientServices';
import { SubscriptionPlan } from '@/types/subscriptionPlan';
import PlanCard from './PlanCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PlansComparisonProps {
  currentPlanId?: string;
  onSelectPlan?: (plan: SubscriptionPlan) => void;
  buttonText?: string;
  className?: string;
}

const PlansComparison: React.FC<PlansComparisonProps> = ({ 
  currentPlanId,
  onSelectPlan,
  buttonText,
  className = ""
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = isAnnual 
          ? await subscriptionPlanService.getAnnualPlans()
          : await subscriptionPlanService.getAllPlans();
        setPlans(plansData);
      } catch (error) {
        console.error("Erreur lors du chargement des plans:", error);
      }
    };

    fetchPlans();
  }, [isAnnual]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    } else {
      // Par défaut, rediriger vers la page d'inscription avec l'ID du plan
      navigate(`/inscription?plan=${plan.id}`);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex justify-center items-center space-x-4 pb-4">
        <Label htmlFor="billing-cycle" className={isAnnual ? "text-muted-foreground" : ""}>
          Mensuel
        </Label>
        <Switch 
          id="billing-cycle" 
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
        />
        <div className="flex flex-col items-start">
          <Label htmlFor="billing-cycle" className={!isAnnual ? "text-muted-foreground" : ""}>
            Annuel
          </Label>
          {isAnnual && (
            <span className="text-xs text-green-cta font-medium">
              Économisez 10%
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            isCurrentPlan={currentPlanId === plan.id}
            onSelect={handleSelectPlan}
            buttonText={buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default PlansComparison;
