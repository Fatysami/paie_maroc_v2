
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const legalParametersSchema = z.object({
  smig: z.coerce.number().min(3000, { message: "Le SMIG ne peut pas être inférieur à 3000 MAD" }),
  weeklyHours: z.coerce.number().min(40).max(48),
  overtimeDay: z.coerce.number().min(0),
  overtimeNight: z.coerce.number().min(0),
  overtimeHoliday: z.coerce.number().min(0),
  cnssEmployee: z.coerce.number().min(0).max(100),
  cnssEmployer: z.coerce.number().min(0).max(100),
  cnssFamilyEmployer: z.coerce.number().min(0).max(100),
  cnssTrainingEmployer: z.coerce.number().min(0).max(100),
  amoEmployee: z.coerce.number().min(0).max(100),
  amoEmployer: z.coerce.number().min(0).max(100),
  cnssCeiling: z.coerce.number().min(0),
  paymentFrequency: z.enum(["monthly", "bimonthly", "weekly"]),
  paymentMethod: z.enum(["bank", "cash", "check"]),
  paymentDay: z.coerce.number().min(1).max(31)
});

export const defaultLegalParameters = {
  smig: 3111.30,
  weeklyHours: 44,
  overtimeDay: 25,
  overtimeNight: 50,
  overtimeHoliday: 100,
  cnssEmployee: 4.48,
  cnssEmployer: 8.98,
  cnssFamilyEmployer: 6.4,
  cnssTrainingEmployer: 1.6,
  amoEmployee: 2.26,
  amoEmployer: 4.11,
  cnssCeiling: 6000,
  paymentFrequency: "monthly" as const,
  paymentMethod: "bank" as const,
  paymentDay: 30
};

type ParametresLegauxProps = {
  onUpdate?: (values: z.infer<typeof legalParametersSchema>) => void;
};

const ParametresLegaux = ({ onUpdate }: ParametresLegauxProps) => {
  const legalParametersForm = useForm<z.infer<typeof legalParametersSchema>>({
    resolver: zodResolver(legalParametersSchema),
    defaultValues: defaultLegalParameters
  });

  const onSubmitLegalParameters = (values: z.infer<typeof legalParametersSchema>) => {
    console.log(values);
    if (onUpdate) {
      onUpdate(values);
    }
    toast.success("Paramètres légaux enregistrés avec succès");
  };

  const resetToDefaults = () => {
    legalParametersForm.reset(defaultLegalParameters);
    toast.info("Valeurs par défaut restaurées");
  };

  return (
    <Form {...legalParametersForm}>
      <form onSubmit={legalParametersForm.handleSubmit(onSubmitLegalParameters)} className="space-y-6">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={legalParametersForm.control}
              name="smig"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMIG (MAD / mois)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Salaire minimum interprofessionnel garanti
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={legalParametersForm.control}
              name="weeklyHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures de travail par semaine</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nombre d'heures légales hebdomadaires
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />
          <h3 className="text-lg font-medium">Taux des cotisations sociales</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-3">
              <h4 className="font-medium text-base mb-2">CNSS - Assurance sociale</h4>
            </div>
            <FormField
              control={legalParametersForm.control}
              name="cnssEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part employé (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={legalParametersForm.control}
              name="cnssEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part employeur (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={legalParametersForm.control}
              name="cnssCeiling"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plafond (MAD)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-3">
              <h4 className="font-medium text-base mb-2">CNSS - Autres cotisations (employeur)</h4>
            </div>

            <FormField
              control={legalParametersForm.control}
              name="cnssFamilyEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocations familiales (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={legalParametersForm.control}
              name="cnssTrainingEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation professionnelle (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-3">
              <h4 className="font-medium text-base mb-2">AMO (Assurance Maladie Obligatoire)</h4>
            </div>

            <FormField
              control={legalParametersForm.control}
              name="amoEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part employé (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={legalParametersForm.control}
              name="amoEmployer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part employeur (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetToDefaults}
            >
              Restaurer les valeurs par défaut
            </Button>
            <Button type="submit">Enregistrer les paramètres</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ParametresLegaux;
