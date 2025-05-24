
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ParametrageAbsences } from "@/types/absences";
import { toast } from "sonner";
import { Save, Undo2 } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schéma de validation pour le formulaire
const parametrageSchema = z.object({
  validationAutomatique: z.object({
    activee: z.boolean(),
    dureeMaxJours: z.number().min(0).max(30),
    motifsAutorises: z.string()
  }),
  alertes: z.object({
    absencesRepetees: z.object({
      seuil: z.number().min(1).max(10),
      periode: z.enum(["semaine", "mois", "trimestre"]),
      notifierRH: z.boolean(),
      notifierManager: z.boolean()
    }),
    retards: z.object({
      seuilMinutes: z.number().min(1).max(240),
      notifierRH: z.boolean(),
      notifierManager: z.boolean()
    }),
    patternsSuspects: z.object({
      activer: z.boolean(),
      detecterLundiVendredi: z.boolean(),
      detecterVeilleFeries: z.boolean()
    })
  }),
  justificatifs: z.object({
    delaiUploadJours: z.number().min(1).max(30),
    typesAcceptes: z.string(),
    tailleMaxMo: z.number().min(1).max(50),
    verificationOCR: z.boolean()
  }),
  integrationPaie: z.object({
    retenueTauxDefaut: z.number().min(0).max(100),
    prisPaieApresValidation: z.boolean(),
    retenueRetardParMinute: z.number().min(0).max(100).optional()
  }),
  reglesMaladie: z.object({
    joursCarenceEmployeur: z.number().min(0).max(30),
    tauxPriseChargeEmployeur: z.number().min(0).max(100),
    tauxPriseChargeCNSS: z.number().min(0).max(100)
  })
});

type ParametrageFormValues = z.infer<typeof parametrageSchema>;

// Configuration par défaut
const defaultParametrage: ParametrageFormValues = {
  validationAutomatique: {
    activee: true,
    dureeMaxJours: 1,
    motifsAutorises: "maladie,absence_exceptionnelle"
  },
  alertes: {
    absencesRepetees: {
      seuil: 3,
      periode: "mois",
      notifierRH: true,
      notifierManager: true
    },
    retards: {
      seuilMinutes: 60,
      notifierRH: true,
      notifierManager: true
    },
    patternsSuspects: {
      activer: true,
      detecterLundiVendredi: true,
      detecterVeilleFeries: true
    }
  },
  justificatifs: {
    delaiUploadJours: 3,
    typesAcceptes: ".pdf,.jpg,.jpeg,.png",
    tailleMaxMo: 10,
    verificationOCR: false
  },
  integrationPaie: {
    retenueTauxDefaut: 100,
    prisPaieApresValidation: true,
    retenueRetardParMinute: 0.5
  },
  reglesMaladie: {
    joursCarenceEmployeur: 3,
    tauxPriseChargeEmployeur: 100,
    tauxPriseChargeCNSS: 66.67
  }
};

const ParametrageAbsencesForm: React.FC = () => {
  const form = useForm<ParametrageFormValues>({
    resolver: zodResolver(parametrageSchema),
    defaultValues: defaultParametrage
  });
  
  const onSubmit = async (data: ParametrageFormValues) => {
    try {
      // En production, envoi des données à l'API
      console.log("Paramètres d'absence enregistrés:", data);
      toast.success("Paramètres enregistrés avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des paramètres", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };
  
  const handleReset = () => {
    form.reset(defaultParametrage);
    toast.info("Formulaire réinitialisé aux valeurs par défaut");
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Paramétrage des absences</h2>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset} 
              className="flex items-center"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Réinitialiser
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 flex items-center">
              <Save className="h-4 w-4 mr-1" />
              Enregistrer
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="validation" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="alertes">Alertes</TabsTrigger>
            <TabsTrigger value="justificatifs">Justificatifs</TabsTrigger>
            <TabsTrigger value="paie">Impact paie</TabsTrigger>
            <TabsTrigger value="maladie">Règles maladie</TabsTrigger>
          </TabsList>
          
          {/* Onglet Validation */}
          <TabsContent value="validation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de validation</CardTitle>
                <CardDescription>
                  Configurez les règles de validation automatique des absences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="validationAutomatique.activee"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Validation automatique</FormLabel>
                        <FormDescription>
                          Activer la validation automatique pour certains types d'absences
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
                
                {form.watch("validationAutomatique.activee") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="validationAutomatique.dureeMaxJours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée maximale (jours)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              max={30}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Nombre maximum de jours pour validation automatique
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="validationAutomatique.motifsAutorises"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motifs autorisés</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="maladie,absence_exceptionnelle" />
                          </FormControl>
                          <FormDescription>
                            Types d'absences séparés par des virgules
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Alertes */}
          <TabsContent value="alertes" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des alertes</CardTitle>
                <CardDescription>
                  Définissez les seuils et les notifications pour les alertes automatiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Absences répétées</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="alertes.absencesRepetees.seuil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seuil d'alerte</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Nombre d'absences pour déclencher une alerte
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="alertes.absencesRepetees.periode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Période de suivi</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une période" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="semaine">Semaine</SelectItem>
                              <SelectItem value="mois">Mois</SelectItem>
                              <SelectItem value="trimestre">Trimestre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Intervalle de temps pour le calcul
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="alertes.absencesRepetees.notifierRH"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Notifier RH</FormLabel>
                            <FormDescription>
                              Envoyer une alerte au service RH
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="alertes.absencesRepetees.notifierManager"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Notifier manager</FormLabel>
                            <FormDescription>
                              Envoyer une alerte au manager direct
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Retards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="alertes.retards.seuilMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seuil en minutes</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={240}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Minutes cumulées sur la période pour déclencher une alerte
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="alertes.retards.notifierRH"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Notifier RH</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="alertes.retards.notifierManager"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel>Notifier manager</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Patterns suspects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="alertes.patternsSuspects.activer"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Activer la détection</FormLabel>
                            <FormDescription>
                              Surveiller les schémas d'absences suspects
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch("alertes.patternsSuspects.activer") && (
                      <>
                        <FormField
                          control={form.control}
                          name="alertes.patternsSuspects.detecterLundiVendredi"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Lundi/Vendredi</FormLabel>
                                <FormDescription>
                                  Détecter les absences fréquentes ces jours
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="alertes.patternsSuspects.detecterVeilleFeries"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div>
                                <FormLabel>Veille de jours fériés</FormLabel>
                                <FormDescription>
                                  Détecter les absences avant/après jours fériés
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Justificatifs */}
          <TabsContent value="justificatifs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des justificatifs</CardTitle>
                <CardDescription>
                  Paramètres pour le téléchargement et la vérification des justificatifs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="justificatifs.delaiUploadJours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Délai d'upload (jours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={30}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre de jours pour fournir un justificatif
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="justificatifs.tailleMaxMo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taille maximale (Mo)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Taille maximale des fichiers acceptés
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="justificatifs.typesAcceptes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Types de fichiers acceptés</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder=".pdf,.jpg,.jpeg,.png" />
                        </FormControl>
                        <FormDescription>
                          Extensions séparées par des virgules
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="justificatifs.verificationOCR"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Vérification OCR</FormLabel>
                          <FormDescription>
                            Activer la reconnaissance de texte sur les justificatifs
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Impact paie */}
          <TabsContent value="paie" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Impact sur la paie</CardTitle>
                <CardDescription>
                  Paramètres de calcul des retenues sur salaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="integrationPaie.retenueTauxDefaut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux de retenue par défaut (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Pourcentage de salaire retenu pour absence non justifiée
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="integrationPaie.retenueRetardParMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coût du retard par minute (DH)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            max={100}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Montant retenu par minute de retard
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="integrationPaie.prisPaieApresValidation"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 p-3 border rounded-lg shadow-sm">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel>Impact paie après validation uniquement</FormLabel>
                        <FormDescription>
                          Les absences impactent la paie seulement après validation par RH
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Onglet Règles maladie */}
          <TabsContent value="maladie" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Règles spécifiques maladie</CardTitle>
                <CardDescription>
                  Paramètres pour la gestion des absences maladie et prise en charge CNSS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="reglesMaladie.joursCarenceEmployeur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jours de carence employeur</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={30}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Nombre de jours pris en charge par l'employeur avant CNSS
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reglesMaladie.tauxPriseChargeEmployeur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux employeur (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Taux de rémunération pendant la période de carence
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reglesMaladie.tauxPriseChargeCNSS"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux CNSS (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Taux de prise en charge par la CNSS après carence
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t flex justify-between">
                <p className="text-sm text-slate-600">
                  Conforme à la législation marocaine du travail (article 53)
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default ParametrageAbsencesForm;
