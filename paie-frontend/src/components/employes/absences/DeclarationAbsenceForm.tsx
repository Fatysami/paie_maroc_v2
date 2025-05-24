
import React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Upload, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TypeAbsence } from "@/types/absences";

const declarationAbsenceSchema = z.object({
  dateDebut: z.date({
    required_error: "La date de début est requise",
  }),
  dateFin: z.date({
    required_error: "La date de fin est requise",
  }).refine(data => !isNaN(data.getTime()), {
    message: "Date invalide",
  }),
  heureDebut: z.string().optional(),
  heureFin: z.string().optional(),
  typeAbsence: z.string({
    required_error: "Le type d'absence est requis",
  }),
  motif: z.string().min(3, "Le motif doit contenir au moins 3 caractères"),
  justificatif: z.instanceof(FileList).optional(),
});

type DeclarationAbsenceFormValues = z.infer<typeof declarationAbsenceSchema>;

interface DeclarationAbsenceFormProps {
  employeId: string;
  employeNom: string;
  onSuccess?: () => void;
}

const DeclarationAbsenceForm: React.FC<DeclarationAbsenceFormProps> = ({ 
  employeId, 
  employeNom,
  onSuccess
}) => {
  const form = useForm<DeclarationAbsenceFormValues>({
    resolver: zodResolver(declarationAbsenceSchema),
    defaultValues: {
      dateDebut: new Date(),
      dateFin: new Date(),
      heureDebut: undefined,
      heureFin: undefined,
      typeAbsence: "maladie",
      motif: "",
    },
  });

  const typeAbsence = form.watch("typeAbsence") as TypeAbsence;
  const dateDebut = form.watch("dateDebut");
  const dateFin = form.watch("dateFin");
  
  const estJustificatifRequis = (type: TypeAbsence): boolean => {
    switch(type) {
      case "maladie":
      case "absence_exceptionnelle":
      case "absence_sans_solde":
        return true;
      case "absence_injustifiee":
        return false;
      case "retard":
      case "autre":
        return false;
      default:
        return false;
    }
  };
  
  const remunere = (type: TypeAbsence): boolean => {
    switch(type) {
      case "maladie":
        return true; // Partiellement, mais géré par le backend
      case "absence_exceptionnelle":
        return true;
      case "absence_injustifiee":
      case "absence_sans_solde":
      case "retard":
        return false;
      case "autre":
        return false; // À déterminer par RH
      default:
        return false;
    }
  };

  const impactCNSS = (type: TypeAbsence): boolean => {
    return type === "maladie";
  };

  const impactAMO = (type: TypeAbsence): boolean => {
    return type === "maladie";
  };

  // Calcul du nombre de jours entre deux dates (inclus)
  const calculateDays = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de fin
  };

  const onSubmit = async (data: DeclarationAbsenceFormValues) => {
    try {
      // En production, ceci serait un appel API
      console.log("Déclaration d'absence:", {
        ...data,
        employeId,
        employeNom,
        nombreJours: calculateDays(data.dateDebut, data.dateFin),
        justificatifRequis: estJustificatifRequis(data.typeAbsence as TypeAbsence),
        impact: {
          remunere: remunere(data.typeAbsence as TypeAbsence),
          cnss: impactCNSS(data.typeAbsence as TypeAbsence),
          amo: impactAMO(data.typeAbsence as TypeAbsence),
        },
        statut: "en_attente",
        dateDeclaration: new Date().toISOString(),
        declarePar: "employe",
      });
      
      toast.success("Absence déclarée avec succès");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur lors de la déclaration d'absence", error);
      toast.error("Erreur lors de la déclaration d'absence");
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Déclarer une absence</CardTitle>
        <CardDescription>
          Utilisez ce formulaire pour déclarer une absence non planifiée
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 30))}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Premier jour d'absence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d MMMM yyyy", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < dateDebut}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Dernier jour d'absence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {typeAbsence === "retard" && (
                <>
                  <FormField
                    control={form.control}
                    name="heureDebut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de début</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Heure de début du retard
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heureFin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heure de fin</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <Input type="time" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Heure d'arrivée effective
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="typeAbsence"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'absence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type d'absence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="maladie">Maladie (avec certificat médical)</SelectItem>
                      <SelectItem value="absence_injustifiee">Absence injustifiée</SelectItem>
                      <SelectItem value="retard">Retard</SelectItem>
                      <SelectItem value="absence_exceptionnelle">Absence exceptionnelle (décès, mariage, etc.)</SelectItem>
                      <SelectItem value="absence_sans_solde">Absence autorisée sans solde</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Le type d'absence détermine si un justificatif est requis et l'impact sur la paie
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez la raison de votre absence..." 
                      {...field} 
                      className="min-h-24"
                    />
                  </FormControl>
                  <FormDescription>
                    Détaillez les raisons de cette absence
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {estJustificatifRequis(typeAbsence) && (
              <FormField
                control={form.control}
                name="justificatif"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Justificatif</FormLabel>
                    <FormControl>
                      <div className="grid w-full items-center gap-1.5">
                        <label 
                          htmlFor="justificatif" 
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max. 10 Mo)</p>
                          </div>
                          <Input
                            id="justificatif"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files);
                            }}
                            {...rest}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {typeAbsence === "maladie" 
                        ? "Certificat médical obligatoire pour la maladie" 
                        : "Document justifiant votre absence"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Afficher un résumé de l'impact attendu sur la paie */}
            <Alert className={cn(
              "bg-gray-50",
              remunere(typeAbsence) ? "text-green-800" : "text-red-800"
            )}>
              <AlertDescription className="flex flex-col gap-1">
                <p className="font-medium">Impact attendu sur votre paie :</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>{remunere(typeAbsence) 
                    ? "Cette absence sera rémunérée" 
                    : "Cette absence ne sera pas rémunérée"}</li>
                  {typeAbsence === "maladie" && (
                    <li>Les 3 premiers jours sont à la charge de l'employeur, puis prise en charge CNSS</li>
                  )}
                  {impactCNSS(typeAbsence) && (
                    <li>Déclaré à la CNSS</li>
                  )}
                  {!remunere(typeAbsence) && (
                    <li>Une retenue sur salaire sera appliquée</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">Soumettre la déclaration</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t text-sm text-slate-600 flex justify-between">
        <p>Les déclarations sont soumises à validation</p>
        <p>Délai de dépôt: 48h</p>
      </CardFooter>
    </Card>
  );
};

export default DeclarationAbsenceForm;
