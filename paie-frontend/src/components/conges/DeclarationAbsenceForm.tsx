
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, User, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  employeNom: z.string({
    required_error: "Veuillez saisir le nom de l'employé",
  }),
  typeAbsenceId: z.string({
    required_error: "Veuillez sélectionner un type d'absence",
  }),
  dateDebut: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  dateFin: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }),
  motif: z.string().min(5, "Veuillez saisir un motif d'au moins 5 caractères"),
  impactePaie: z.boolean().default(false),
  justificatifFourni: z.boolean().default(false),
  commentaire: z.string().optional(),
}).refine((data) => {
  // Vérification que la date de fin est après la date de début
  return data.dateFin >= data.dateDebut;
}, {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["dateFin"], // Champ concerné par l'erreur
});

// Types d'absences fictifs
const TYPES_ABSENCES = [
  { id: "1", nom: "Maladie", impactePaie: true, justificatifObligatoire: true },
  { id: "2", nom: "Événement familial", impactePaie: false, justificatifObligatoire: true },
  { id: "3", nom: "Absence injustifiée", impactePaie: true, justificatifObligatoire: false },
  { id: "4", nom: "Absence autorisée", impactePaie: false, justificatifObligatoire: false },
  { id: "5", nom: "Accident de travail", impactePaie: true, justificatifObligatoire: true },
];

export interface DeclarationAbsenceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeId?: string;
  employeNom?: string;
  onCreated?: (nouvelleAbsence: any) => void;
}

const DeclarationAbsenceForm: React.FC<DeclarationAbsenceFormProps> = ({
  open,
  onOpenChange,
  employeId,
  employeNom,
  onCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTypeAbsence, setSelectedTypeAbsence] = useState<any>(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeNom: employeNom || "",
      motif: "",
      commentaire: "",
      impactePaie: false,
      justificatifFourni: false,
    },
  });

  // Update the form when employeNom prop changes
  useEffect(() => {
    if (employeNom) {
      form.setValue("employeNom", employeNom);
    }
  }, [employeNom, form, open]);

  // Update impact on pay when type of absence changes
  const onTypeAbsenceChange = (value: string) => {
    const typeAbsence = TYPES_ABSENCES.find(type => type.id === value);
    setSelectedTypeAbsence(typeAbsence);
    if (typeAbsence) {
      form.setValue("impactePaie", typeAbsence.impactePaie);
    }
  };

  const handleFileUpload = () => {
    // Simulate file upload
    setTimeout(() => {
      setFileUploaded(true);
      form.setValue("justificatifFourni", true);
      toast.success("Justificatif téléchargé avec succès");
    }, 1000);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Vérifier si un justificatif est obligatoire mais non fourni
    if (selectedTypeAbsence && selectedTypeAbsence.justificatifObligatoire && !values.justificatifFourni) {
      toast.error("Un justificatif est requis pour ce type d'absence");
      setIsSubmitting(false);
      return;
    }
    
    // Simuler un appel API
    setTimeout(() => {
      console.log("Soumission de la déclaration d'absence:", values);
      
      // Créer une nouvelle déclaration d'absence
      const nouvelleAbsence = {
        id: Math.random().toString(36).substr(2, 9),
        employeId: employeId || "1",
        employeNom: values.employeNom,
        typeAbsenceId: values.typeAbsenceId,
        typeAbsenceNom: TYPES_ABSENCES.find(t => t.id === values.typeAbsenceId)?.nom || "",
        dateDebut: values.dateDebut.toISOString().split('T')[0],
        dateFin: values.dateFin.toISOString().split('T')[0],
        nombreJours: Math.ceil((values.dateFin.getTime() - values.dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        motif: values.motif,
        statut: "en_attente",
        dateDeclaration: new Date().toISOString(),
        impactePaie: values.impactePaie,
        justificatifFourni: values.justificatifFourni,
        commentaire: values.commentaire
      };
      
      if (values.impactePaie) {
        toast.info("Cette absence pourrait avoir un impact sur votre paie", {
          description: "Contactez le service RH pour plus d'informations."
        });
      }
      
      toast.success("Votre déclaration d'absence a été soumise avec succès");
      
      if (onCreated) {
        onCreated(nouvelleAbsence);
      }
      
      setIsSubmitting(false);
      setFileUploaded(false);
      form.reset();
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Déclarer une absence</DialogTitle>
          <DialogDescription>
            Utilisez ce formulaire pour déclarer une absence imprévue ou passée
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="employeNom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'employé</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Nom et prénom de l'employé" 
                        {...field} 
                        disabled={!!employeNom}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    {employeNom ? "Nom de l'employé renseigné automatiquement" : "Saisissez le nom complet de l'employé concerné"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeAbsenceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'absence</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onTypeAbsenceChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type d'absence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPES_ABSENCES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
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
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
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
                          initialFocus
                          className="pointer-events-auto"
                          disabled={(date) => {
                            const debut = form.getValues("dateDebut");
                            return debut ? date < debut : false;
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif de l'absence</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Veuillez indiquer le motif de votre absence..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Expliquez brièvement la raison de votre absence
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTypeAbsence && selectedTypeAbsence.justificatifObligatoire && (
              <div className="space-y-4">
                <FormLabel>Justificatif</FormLabel>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {fileUploaded ? (
                    <div className="text-green-600 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>Justificatif téléchargé</p>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setFileUploaded(false)}
                      >
                        Changer
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Glissez-déposez un fichier ici ou cliquez pour parcourir
                      </p>
                      <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        onClick={handleFileUpload}
                      >
                        Parcourir
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        Formats acceptés: PDF, JPG, PNG (5 Mo max)
                      </p>
                    </>
                  )}
                </div>
                {selectedTypeAbsence.justificatifObligatoire && !fileUploaded && (
                  <p className="text-sm text-red-500">*Un justificatif est obligatoire pour ce type d'absence</p>
                )}
              </div>
            )}

            {selectedTypeAbsence && selectedTypeAbsence.impactePaie && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  Attention: ce type d'absence peut avoir un impact sur votre paie.
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations complémentaires..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Informations complémentaires concernant votre absence
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Soumettre ma déclaration"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeclarationAbsenceForm;
