
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { SubscriptionPlan } from '@/types/subscriptionPlan';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
  buttonText?: string;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  plan, 
  isCurrentPlan = false, 
  onSelect, 
  buttonText,
  className = "" 
}) => {
  return (
    <Card className={`relative h-full flex flex-col ${
      plan.isPopular 
        ? 'border-blue-primary shadow-lg ring-2 ring-blue-primary/20' 
        : 'shadow-md hover:shadow-lg'
      } ${className}`}>
      
      {plan.isPopular && (
        <div className="absolute top-0 right-0 -mt-2 -mr-2">
          <span className="bg-green-cta text-white text-xs font-semibold px-3 py-1 rounded-full uppercase shadow-sm">
            Populaire
          </span>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl text-blue-primary">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{plan.price} MAD</span>
          <span className="text-sm text-muted-foreground ml-1">
            /{plan.billingCycle === 'monthly' ? 'mois' : 'an'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-cta mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          variant={isCurrentPlan ? "outline" : (plan.isPopular ? "default" : "outline")}
          className={`w-full ${
            plan.isPopular && !isCurrentPlan 
              ? 'bg-green-cta hover:bg-green-cta/90 text-white' 
              : ''
          }`}
          onClick={() => onSelect && onSelect(plan)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan 
            ? "Plan actuel" 
            : buttonText || "Choisir ce plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
