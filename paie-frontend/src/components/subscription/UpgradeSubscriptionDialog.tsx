
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PlansComparison from './PlansComparison';
import { Button } from '@/components/ui/button';
import { SubscriptionPlan } from '@/types/subscriptionPlan';
import { toast } from 'sonner';

interface UpgradeSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanId?: string;
  companyId: string;
  onUpgraded?: () => void;
}

const UpgradeSubscriptionDialog: React.FC<UpgradeSubscriptionDialogProps> = ({
  open,
  onOpenChange,
  currentPlanId,
  companyId,
  onUpgraded
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsLoading(true);
      
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Abonnement mis à jour avec succès ! Vous êtes maintenant sur le plan ${selectedPlan.name}.`);
      if (onUpgraded) onUpgraded();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à niveau:", error);
      toast.error("Une erreur s'est produite lors de la mise à niveau de l'abonnement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Changer de plan d'abonnement</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <PlansComparison 
            currentPlanId={currentPlanId}
            onSelectPlan={handleSelectPlan}
            buttonText="Sélectionner"
          />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          
          <Button
            onClick={handleUpgrade}
            disabled={!selectedPlan || selectedPlan.id === currentPlanId || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner mr-2"></span>
                Traitement...
              </>
            ) : (
              "Passer à ce plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeSubscriptionDialog;
