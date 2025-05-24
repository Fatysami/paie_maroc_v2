
import React, { useState } from "react";
import { toast } from "sonner";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const overtimeSchema = z.object({
  overtimeDay: z.coerce.number().min(0),
  overtimeNight: z.coerce.number().min(0),
  overtimeHoliday: z.coerce.number().min(0),
});

type ParametresHeuresSupplementairesProps = {
  defaultValues?: {
    overtimeDay: number;
    overtimeNight: number;
    overtimeHoliday: number;
  };
  onUpdate?: (values: z.infer<typeof overtimeSchema>) => void;
};

const ParametresHeuresSupplementaires = ({ 
  defaultValues = { overtimeDay: 25, overtimeNight: 50, overtimeHoliday: 100 },
  onUpdate 
}: ParametresHeuresSupplementairesProps) => {
  const [holidays, setHolidays] = useState<string[]>([
    "1er Janvier - Jour de l'an",
    "11 Janvier - Manifeste de l'indépendance",
    "1er Mai - Fête du travail",
    "30 Juillet - Fête du Trône",
    "14 Août - Commémoration de l'Oued Eddahab",
    "20 Août - Révolution du Roi et du Peuple",
    "21 Août - Fête de la Jeunesse",
    "6 Novembre - Marche Verte",
    "18 Novembre - Fête de l'Indépendance",
    // Fêtes religieuses (variables selon le calendrier hégirien)
    "Aïd El Fitr",
    "Aïd El Adha",
    "1er Moharram - Nouvel an hégirien",
    "Aïd Al Mawlid"
  ]);

  const form = useForm<z.infer<typeof overtimeSchema>>({
    resolver: zodResolver(overtimeSchema),
    defaultValues
  });

  const handleSubmit = (values: z.infer<typeof overtimeSchema>) => {
    console.log(values);
    if (onUpdate) {
      onUpdate(values);
    }
    toast.success("Paramètres d'heures supplémentaires enregistrés");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Paramétrage des heures supplémentaires</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="overtimeDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Majoration heures sup. jour (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pour les heures au-delà de l'horaire normal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtimeNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Majoration heures sup. nuit (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pour les heures travaillées entre 21h et 6h
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtimeHoliday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Majoration jour férié (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Pour les jours fériés et de repos hebdomadaire
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit">Enregistrer les paramètres</Button>
            </div>
          </form>
        </Form>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Jours fériés légaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {holidays.map((holiday, index) => (
            <div key={index} className="flex items-center p-2 border rounded">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{holiday}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center p-3 mt-4 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          <Info className="h-5 w-5 mr-2" />
          <span className="text-sm">Les jours fériés légaux sont prédéfinis selon la législation marocaine. Les heures travaillées pendant ces jours seront majorées selon le taux défini. Les fêtes religieuses suivent le calendrier hégirien et varient chaque année.</span>
        </div>
      </div>
    </div>
  );
};

export default ParametresHeuresSupplementaires;
