
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TypeConge } from "@/types/conges";

const formSchema = z.object({
  nom: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  dureeStandard: z.string().min(1, { message: "Veuillez spécifier une durée" }),
  modifiable: z.boolean(),
  impactSalaire: z.string().min(1, { message: "Veuillez spécifier l'impact sur le salaire" }),
  couleur: z.string().min(4, { message: "Veuillez choisir une couleur" }),
  description: z.string().optional(),
  limite: z.number().optional(),
  actif: z.boolean(),
});

interface TypeCongeFormProps {
  typeConge: TypeConge | null;
  onSave: (typeConge: TypeConge) => void;
  onCancel: () => void;
}

const TypeCongeForm = ({ typeConge, onSave, onCancel }: TypeCongeFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: typeConge?.nom || "",
      dureeStandard: typeConge?.dureeStandard || "",
      modifiable: typeConge?.modifiable ?? true,
      impactSalaire: typeConge?.impactSalaire || "Aucun (payés)",
      couleur: typeConge?.couleur || "#3b82f6",
      description: typeConge?.description || "",
      limite: typeConge?.limite || undefined,
      actif: typeConge?.actif ?? true,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      id: typeConge?.id || "",
      nom: values.nom,
      dureeStandard: values.dureeStandard,
      modifiable: values.modifiable,
      impactSalaire: values.impactSalaire,
      couleur: values.couleur,
      description: values.description,
      limite: values.limite,
      actif: values.actif,
      legal: typeConge?.legal || false,
    });
  };

  const isLegal = typeConge?.legal || false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du congé</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Congé sans solde" 
                    {...field} 
                    disabled={isLegal}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dureeStandard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée standard</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 5 jours/an" 
                    {...field}
                    disabled={isLegal && !form.getValues("modifiable")}
                  />
                </FormControl>
                <FormDescription>
                  Spécifiez la durée standard ou la méthode de calcul
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="impactSalaire"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact sur le salaire</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Aucun (payés), Retenue, etc." 
                    {...field}
                    disabled={isLegal}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="couleur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Couleur</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      type="color" 
                      {...field} 
                      className="w-12 h-10 p-1"
                    />
                  </FormControl>
                  <Input 
                    value={field.value} 
                    onChange={field.onChange}
                    className="flex-1"
                  />
                </div>
                <FormDescription>
                  Pour différencier ce type de congé dans le calendrier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description détaillée du type de congé" 
                  {...field}
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="modifiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Durée modifiable</FormLabel>
                  <FormDescription>
                    La durée standard peut-elle être modifiée lors de la demande
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLegal && !typeConge?.modifiable}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="actif"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Actif</FormLabel>
                  <FormDescription>
                    Ce type de congé est-il disponible pour les demandes
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLegal}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        {isLegal && (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
            Ce type de congé est défini par la législation marocaine et certains champs ne peuvent pas être modifiés.
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {typeConge ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TypeCongeForm;
