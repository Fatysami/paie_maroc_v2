
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { subscriptionService } from '@/utils/supabaseClient';
import { toast } from 'sonner';
import { addMonths, format } from 'date-fns';

// Define form validation schema
const subscriptionFormSchema = z.object({
  plan: z.string().min(1, 'Choisissez un plan'),
  status: z.string().min(1, 'Choisissez un statut'),
  startDate: z.string().min(1, 'Date de début requise'),
  endDate: z.string().min(1, 'Date de fin requise'),
  paymentProviderId: z.string().optional(),
  billingCycle: z.string().min(1, 'Cycle de facturation requis')
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionFormDialogProps {
  open: boolean;
  onOpenChange: (refresh: boolean) => void;
  companyId: string;
}

const SubscriptionFormDialog: React.FC<SubscriptionFormDialogProps> = ({
  open,
  onOpenChange,
  companyId
}) => {
  // Get today and one month later as default dates
  const today = new Date();
  const oneMonthLater = addMonths(today, 1);
  
  const defaultStartDate = format(today, 'yyyy-MM-dd');
  const defaultEndDate = format(oneMonthLater, 'yyyy-MM-dd');
  
  // Initialize form with default values
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      plan: 'basic',
      status: 'active',
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      paymentProviderId: '',
      billingCycle: 'monthly'
    },
  });

  const onSubmit = async (values: SubscriptionFormValues) => {
    try {
      // Format dates to ISO format
      const startDate = new Date(values.startDate).toISOString();
      const endDate = new Date(values.endDate).toISOString();
      
      // Create new subscription
      await subscriptionService.createSubscription({
        companyId,
        plan: values.plan as 'basic' | 'pro' | 'enterprise',
        status: values.status as 'active' | 'suspended' | 'cancelled',
        startDate,
        endDate,
        paymentProviderId: values.paymentProviderId || undefined,
        billingCycle: values.billingCycle as 'monthly' | 'annual'
      });
      
      toast.success('Abonnement créé avec succès');
      onOpenChange(true); // Close dialog and refresh data
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un abonnement</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                      <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cycle de facturation *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un cycle de facturation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="annual">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="paymentProviderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Fournisseur de paiement</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ID Stripe, PayPal, etc." />
                  </FormControl>
                  <FormDescription>
                    Identifiant externe pour les webhooks de paiement (optionnel)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer l'abonnement
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionFormDialog;
