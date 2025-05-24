
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

const cimrSchema = z.object({
  cimrSalarieDefault: z.coerce.number().min(0).max(100),
  cimrEmployeurDefault: z.coerce.number().min(0).max(100),
  plafonnerCimr: z.boolean(),
  plafondCimr: z.coerce.number().min(0),
  activerCimrParDefaut: z.boolean(),
});

type ParametresCIMRProps = {
  onUpdate?: (values: z.infer<typeof cimrSchema>) => void;
};

const ParametresCIMR = ({ onUpdate }: ParametresCIMRProps) => {
  const form = useForm<z.infer<typeof cimrSchema>>({
    resolver: zodResolver(cimrSchema),
    defaultValues: {
      cimrSalarieDefault: 3,
      cimrEmployeurDefault: 4.5,
      plafonnerCimr: true,
      plafondCimr: 10000,
      activerCimrParDefaut: true,
    }
  });

  const handleSubmit = (values: z.infer<typeof cimrSchema>) => {
    console.log(values);
    if (onUpdate) {
      onUpdate(values);
    }
    toast.success("Paramètres CIMR mis à jour");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cimrSalarieDefault"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux CIMR salarié par défaut (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Taux appliqué par défaut aux nouveaux employés
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cimrEmployeurDefault"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taux CIMR employeur par défaut (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Taux de contribution de l'employeur
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="plafonnerCimr"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Plafonner cotisation CIMR</FormLabel>
                  <FormDescription>
                    Activer un plafond pour le calcul de la cotisation CIMR
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plafondCimr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plafond CIMR (MAD)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    disabled={!form.watch("plafonnerCimr")}
                  />
                </FormControl>
                <FormDescription>
                  Salaire maximum soumis à cotisation CIMR
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="activerCimrParDefaut"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Activer CIMR par défaut</FormLabel>
                <FormDescription>
                  Activer automatiquement l'affiliation CIMR pour les nouveaux employés
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Informations importantes
            </p>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
            La CIMR (Caisse Interprofessionnelle Marocaine de Retraite) est un régime de retraite complémentaire facultatif au Maroc. 
            Les taux définis ici seront appliqués par défaut, mais peuvent être personnalisés au niveau individuel pour chaque employé.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Enregistrer les paramètres</Button>
        </div>
      </form>
    </Form>
  );
};

export default ParametresCIMR;
