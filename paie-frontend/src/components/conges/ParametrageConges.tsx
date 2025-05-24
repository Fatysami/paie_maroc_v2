
import React, { useState } from "react";
import { 
  Settings, 
  CalendarDays, 
  BellRing, 
  Clock, 
  UserCheck, 
  Save,
  Hourglass,
  UserPlus,
  History
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ParametrageConge } from "@/types/conges";

// Schéma de validation du formulaire
const formSchema = z.object({
  quotaAnnuelDefaut: z.number().min(0, "Le quota ne peut pas être négatif"),
  reportAutorise: z.boolean(),
  limiteReport: z.number().min(0, "La limite ne peut pas être négative").optional(),
  anticipationAutorisee: z.boolean(),
  limiteAnticipation: z.number().min(0, "La limite ne peut pas être négative").optional(),
  validationManagerRequise: z.boolean(),
  validationRHRequise: z.boolean(),
  delaiValidation: z.number().min(1, "Le délai doit être au moins 1 jour"),
  notificationsEmail: z.boolean(),
  notificationsPush: z.boolean(),
  reglesAnciennete: z.object({
    actif: z.boolean(),
    paliers: z.array(
      z.object({
        annees: z.number().min(1, "Minimum 1 an"),
        joursSupplementaires: z.number().min(1, "Minimum 1 jour")
      })
    )
  })
});

// Valeurs par défaut des paramètres
const defaultValues: ParametrageConge = {
  quotaAnnuelDefaut: 18,
  reportAutorise: true,
  limiteReport: 5,
  anticipationAutorisee: true,
  limiteAnticipation: 5,
  validationManagerRequise: true,
  validationRHRequise: true,
  delaiValidation: 3,
  notificationsEmail: true,
  notificationsPush: true,
  reglesAnciennete: {
    actif: true,
    paliers: [
      { annees: 5, joursSupplementaires: 1 },
      { annees: 10, joursSupplementaires: 2 },
      { annees: 15, joursSupplementaires: 3 },
      { annees: 20, joursSupplementaires: 5 }
    ]
  }
};

const ParametrageConges = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      console.log(values);
      toast.success("Paramètres de congés mis à jour avec succès");
      setIsSubmitting(false);
    }, 1000);
  };
  
  const reportAutorise = form.watch("reportAutorise");
  const anticipationAutorisee = form.watch("anticipationAutorisee");
  const reglesAncienneteActif = form.watch("reglesAnciennete.actif");
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Paramètres généraux des congés
            </CardTitle>
            <CardDescription>
              Configurez les règles générales pour tous les types de congés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="quotaAnnuelDefaut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quota annuel par défaut</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre de jours de congés payés par défaut pour tous les employés
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="reportAutorise"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Report de congés autorisé</FormLabel>
                        <FormDescription>
                          Les employés peuvent-ils reporter leurs congés non pris à l'année suivante
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
                
                {reportAutorise && (
                  <FormField
                    control={form.control}
                    name="limiteReport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite de report (jours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre maximum de jours pouvant être reportés
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="anticipationAutorisee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Anticipation de congés autorisée</FormLabel>
                        <FormDescription>
                          Les employés peuvent-ils prendre par anticipation leurs congés de l'année suivante
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
                
                {anticipationAutorisee && (
                  <FormField
                    control={form.control}
                    name="limiteAnticipation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limite d'anticipation (jours)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre maximum de jours pouvant être pris par anticipation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-4">
                <UserPlus className="h-5 w-5 text-primary" />
                Règles selon l'ancienneté
              </h3>
              
              <FormField
                control={form.control}
                name="reglesAnciennete.actif"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4 mb-4">
                    <div className="space-y-0.5">
                      <FormLabel>Activer les règles d'ancienneté</FormLabel>
                      <FormDescription>
                        Attribuer automatiquement des jours supplémentaires selon l'ancienneté
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
              
              {reglesAncienneteActif && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                  <div className="text-sm text-muted-foreground mb-2">
                    Nombre de jours supplémentaires accordés selon l'ancienneté:
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span>5 ans:</span>
                      <span className="font-medium">1 jour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span>10 ans:</span>
                      <span className="font-medium">2 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span>15 ans:</span>
                      <span className="font-medium">3 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      <span>20 ans:</span>
                      <span className="font-medium">5 jours</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Workflow d'approbation
            </CardTitle>
            <CardDescription>
              Définissez le processus d'approbation des demandes de congés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="validationManagerRequise"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Validation du manager requise</FormLabel>
                      <FormDescription>
                        Les demandes doivent être validées par le manager direct
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
                name="validationRHRequise"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Validation RH requise</FormLabel>
                      <FormDescription>
                        Les demandes doivent être validées par le service RH
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
            </div>
            
            <FormField
              control={form.control}
              name="delaiValidation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Délai de validation (jours)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Nombre de jours maximum pour valider une demande avant qu'elle ne soit automatiquement approuvée
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurez les paramètres de notification pour les congés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="notificationsEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Notifications par email</FormLabel>
                      <FormDescription>
                        Envoyer des notifications par email pour les demandes, validations et rappels
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
                name="notificationsPush"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Notifications push</FormLabel>
                      <FormDescription>
                        Envoyer des notifications push dans l'application et sur mobile
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Hourglass className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les paramètres
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ParametrageConges;
