
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calendar, CreditCard, Wallet, BanknoteIcon } from "lucide-react";

const paymentSchema = z.object({
  payday: z.coerce.number().min(1).max(31),
  paymentMethod: z.enum(["bank", "cash", "check"]),
  paymentFrequency: z.enum(["monthly", "bimonthly", "weekly"]),
  paymentProcessingDay: z.coerce.number().min(1).max(5),
  advancePayment: z.boolean(),
  advancePaymentPercentage: z.coerce.number().min(1).max(50),
});

type ParametresPaiementProps = {
  onUpdate?: (values: z.infer<typeof paymentSchema>) => void;
};

const ParametresPaiement = ({ onUpdate }: ParametresPaiementProps) => {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payday: 30,
      paymentMethod: "bank",
      paymentFrequency: "monthly",
      paymentProcessingDay: 3,
      advancePayment: false,
      advancePaymentPercentage: 30,
    }
  });

  const handleSubmit = (values: z.infer<typeof paymentSchema>) => {
    console.log(values);
    if (onUpdate) {
      onUpdate(values);
    }
    toast.success("Paramètres de paiement mis à jour avec succès");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="payday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jour de paie par défaut</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={31} {...field} />
                </FormControl>
                <FormDescription>
                  Le jour du mois où les salaires sont versés
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fréquence de paiement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la fréquence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                    <SelectItem value="bimonthly">Bimensuelle</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Méthode de paiement par défaut</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-y-0 space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Virement bancaire
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cash" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-1">
                      <Wallet className="h-4 w-4" />
                      Espèces
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="check" />
                    </FormControl>
                    <FormLabel className="font-normal flex items-center gap-1">
                      <BanknoteIcon className="h-4 w-4" />
                      Chèque
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="paymentProcessingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jours de traitement avant la paie</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={5} {...field} />
                </FormControl>
                <FormDescription>
                  Nombre de jours nécessaires pour traiter la paie avant la date de versement
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Enregistrer les paramètres</Button>
        </div>
      </form>
    </Form>
  );
};

export default ParametresPaiement;
