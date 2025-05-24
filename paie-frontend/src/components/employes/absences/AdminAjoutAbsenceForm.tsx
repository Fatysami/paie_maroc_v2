import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon, Upload, Search, Clock } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TypeAbsence } from "@/types/absences";
import { Employe } from "@/pages/GestionEmployes";

const ajoutAbsenceSchema = z.object({
  employeId: z.string({
    required_error: "L'employé est requis",
  }),
  dateDebut: z.date({
    required_error: "La date de début est requise",
  }),
  dateFin: z.date({
    required_error: "La date de fin est requise",
  }),
  heureDebut: z.string().optional(),
  heureFin: z.string().optional(),
  typeAbsence: z.string({
    required_error: "Le type d'absence est requis",
  }),
  motif: z.string().min(3, "Le motif doit contenir au moins 3 caractères"),
  avecJustificatif: z.boolean().default(false),
  remunere: z.boolean().default(false),
  impactCNSS: z.boolean().default(false),
  impactAMO: z.boolean().default(false),
  commentaireRH: z.string().optional(),
});

type AjoutAbsenceFormValues = z.infer<typeof ajoutAbsenceSchema>;

interface AdminAjoutAbsenceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  open: boolean;
}

const mockEmployes: Employe[] = [
  {
    id: "1",
    nom: "El Alaoui",
    prenom: "Mohamed",
    matricule: "EMP-2023-0001",
    poste: "Développeur Frontend",
    departement: "Informatique",
    email: "m.elalaoui@example.com",
    salaire: 15000,
    salaireBase: 15000,
    cin: "BE123456",
    telephone: "0612345678",
    adresse: {
      rue: "123 Rue Hassan II",
      ville: "Casablanca",
      pays: "Maroc",
      codePostal: "20000"
    },
    dateEmbauche: "2023-01-15",
    typeContrat: "CDI",
    status: "Actif"
  },
  {
    id: "2",
    nom: "Benjelloun",
    prenom: "Salma",
    matricule: "EMP-2023-0002",
    poste: "Responsable Marketing",
    departement: "Marketing",
    email: "s.benjelloun@example.com",
    salaire: 18000,
    salaireBase: 18000,
    cin: "BE654321",
    telephone: "0623456789",
    adresse: {
      rue: "456 Avenue Mohammed V",
      ville: "Rabat",
      pays: "Maroc",
      codePostal: "10000"
    },
    dateEmbauche: "2023-02-20",
    typeContrat: "CDI",
    status: "Actif"
  },
  {
    id: "3",
    nom: "Lahmidi",
    prenom: "Karim",
    matricule: "EMP-2023-0003",
    poste: "Comptable",
    departement: "Finance",
    email: "k.lahmidi@example.com",
    salaire: 14000,
    salaireBase: 14000,
    cin: "BE789456",
    telephone: "0634567890",
    adresse: {
      rue: "789 Boulevard Zerktouni",
      ville: "Marrakech",
      pays: "Maroc",
      codePostal: "40000"
    },
    dateEmbauche: "2023-03-10",
    typeContrat: "CDI",
    status: "Actif"
  }
];

const AdminAjoutAbsenceForm: React.FC<AdminAjoutAbsenceFormProps> = ({ 
  onSuccess,
  onCancel,
  open
}) => {
  const [employeSearch, setEmployeSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);
  const [justificatifFile, setJustificatifFile] = useState<File | null>(null);

  const form = useForm<AjoutAbsenceFormValues>({
    resolver: zodResolver(ajoutAbsenceSchema),
    defaultValues: {
      dateDebut: new Date(),
      dateFin: new Date(),
      typeAbsence: "maladie",
      motif: "",
      avecJustificatif: false,
      remunere: false,
      impactCNSS: false,
      impactAMO: false,
    },
  });

  const typeAbsence = form.watch("typeAbsence") as TypeAbsence;
  const dateDebut = form.watch("dateDebut");
  const dateFin = form.watch("dateFin");
  const avecJustificatif = form.watch("avecJustificatif");
  
  const filteredEmployes = mockEmployes.filter(employe => 
    `${employe.prenom} ${employe.nom} ${employe.matricule}`.toLowerCase().includes(employeSearch.toLowerCase())
  );
  
  const selectEmploye = (employe: Employe) => {
    setSelectedEmploye(employe);
    form.setValue("employeId", employe.id);
    setPopoverOpen(false);
  };
  
  const calculateDays = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setJustificatifFile(files[0]);
    }
  };

  const onSubmit = async (data: AjoutAbsenceFormValues) => {
    try {
      console.log("Ajout d'absence:", {
        ...data,
        employeNom: selectedEmploye ? `${selectedEmploye.prenom} ${selectedEmploye.nom}` : "",
        nombreJours: calculateDays(data.dateDebut, data.dateFin),
        statut: "validee",
        dateDeclaration: new Date().toISOString(),
        declarePar: "rh",
        validationRHId: "admin123",
        validationRHDate: new Date().toISOString(),
        impact: {
          remunere: data.remunere,
          cnss: data.impactCNSS,
          amo: data.impactAMO,
        },
        justificatifFile: justificatifFile ? {
          name: justificatifFile.name,
          size: justificatifFile.size,
          type: justificatifFile.type
        } : undefined
      });
      
      toast.success("Absence ajoutée avec succès");
      form.reset();
      setJustificatifFile(null);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'absence", error);
      toast.error("Erreur lors de l'ajout d'absence");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ajouter une absence manuellement</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="employeId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Employé</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value && selectedEmploye
                              ? `${selectedEmploye.prenom} ${selectedEmploye.nom} (${selectedEmploye.matricule})`
                              : "Sélectionner un employé"}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput 
                            placeholder="Rechercher un employé..." 
                            className="h-9"
                            value={employeSearch}
                            onValueChange={setEmployeSearch}
                          />
                          <CommandEmpty>Aucun employé trouvé</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {filteredEmployes.map((employe) => (
                              <CommandItem
                                key={employe.id}
                                value={`${employe.prenom} ${employe.nom}`}
                                onSelect={() => selectEmploye(employe)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{employe.prenom} {employe.nom}</span>
                                  <span className="text-xs text-gray-500">
                                    {employe.matricule} - {employe.departement}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Sélectionnez l'employé concerné par l'absence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {typeAbsence === "retard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              )}

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
                        placeholder="Décrivez la raison de l'absence..." 
                        {...field} 
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormDescription>
                      Détaillez les raisons de cette absence
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="avecJustificatif"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Justificatif fourni
                          </FormLabel>
                          <FormDescription>
                            Cochez si un justificatif a été fourni
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {avecJustificatif && (
                    <FormItem>
                      <FormLabel>Télécharger le justificatif</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </FormControl>
                      <FormDescription>
                        PDF, JPG, PNG (Max. 10 Mo)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="remunere"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Absence rémunérée
                          </FormLabel>
                          <FormDescription>
                            Maintien du salaire pendant l'absence
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impactCNSS"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Prise en charge CNSS
                          </FormLabel>
                          <FormDescription>
                            À déclarer à la CNSS
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="impactAMO"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Prise en charge AMO
                          </FormLabel>
                          <FormDescription>
                            À déclarer à l'AMO
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="commentaireRH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire RH</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Commentaire interne (visible uniquement par RH)" 
                        {...field} 
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormDescription>
                      Commentaire qui sera visible uniquement par les RH
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Ajouter l'absence
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAjoutAbsenceForm;
