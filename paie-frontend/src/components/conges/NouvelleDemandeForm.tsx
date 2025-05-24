
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, User } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { DemandeConge } from "@/types/conges";

// Schéma de validation pour le formulaire
const formSchema = z.object({
  employeNom: z.string({
    required_error: "Veuillez saisir le nom de l'employé",
  }),
  typeCongeId: z.string({
    required_error: "Veuillez sélectionner un type de congé",
  }),
  dateDebut: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  dateFin: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }),
  commentaire: z.string().optional(),
}).refine((data) => {
  // Vérification que la date de fin est après la date de début
  return data.dateFin >= data.dateDebut;
}, {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["dateFin"], // Champ concerné par l'erreur
});

// Types de congés fictifs
const TYPES_CONGES = [
  { id: "1", nom: "Congés annuels" },
  { id: "2", nom: "Congé Maladie" },
  { id: "3", nom: "Congé Maternité" },
  { id: "4", nom: "Congé Paternité" },
  { id: "5", nom: "Congé Mariage" },
  { id: "6", nom: "Congé décès proche" },
];

export interface NouvelleDemandeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeId?: string;
  employeNom?: string;
  onCreated?: (nouveauConge: DemandeConge) => void;
}

const NouvelleDemandeForm: React.FC<NouvelleDemandeFormProps> = ({
  open,
  onOpenChange,
  employeId,
  employeNom,
  onCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeNom: employeNom || "",
      commentaire: "",
    },
  });

  // Update the form when employeNom prop changes
  useEffect(() => {
    if (employeNom) {
      form.setValue("employeNom", employeNom);
    }
  }, [employeNom, form, open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      console.log("Soumission de la demande de congé:", values);
      
      // Créer une nouvelle demande de congé
      const nouveauConge: DemandeConge = {
        id: Math.random().toString(36).substr(2, 9),
        employeId: employeId || "1",
        employeNom: values.employeNom,
        typeCongeId: values.typeCongeId,
        typeCongeNom: TYPES_CONGES.find(t => t.id === values.typeCongeId)?.nom || "",
        dateDebut: values.dateDebut.toISOString().split('T')[0],
        dateFin: values.dateFin.toISOString().split('T')[0],
        nombreJours: Math.ceil((values.dateFin.getTime() - values.dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        statut: "en_attente",
        dateCreation: new Date().toISOString(),
        commentaire: values.commentaire
      };
      
      toast.success("Votre demande de congé a été soumise avec succès");
      
      if (onCreated) {
        onCreated(nouveauConge);
      }
      
      setIsSubmitting(false);
      form.reset();
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle demande de congé</DialogTitle>
          <DialogDescription>
            Complétez ce formulaire pour soumettre une demande de congé ou d'absence
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
              name="typeCongeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de congé</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de congé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPES_CONGES.map((type) => (
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
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajoutez des détails sur votre demande..."
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
                {isSubmitting ? "Envoi en cours..." : "Soumettre ma demande"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NouvelleDemandeForm;
