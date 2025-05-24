
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  User,
  Users,
  Clock,
  Mail,
  CalendarCheck,
  CalendarX,
  CalendarDays,
} from "lucide-react";

// Type pour les congés
interface CongeType {
  id: string;
  name: string;
  duration: string;
  isCustomizable: boolean;
  description: string;
  impact: string;
}

// Type pour les paramètres de soldes de congés
interface SoldeParams {
  initialSolde: number;
  allowCumulative: boolean;
  maxCumulative: number;
  resetPeriod: 'january' | 'hire_date';
}

// Type pour le circuit d'approbation
interface ApprovalStep {
  id: string;
  stepName: string;
  role: string;
  isRequired: boolean;
  order: number;
}

// Type pour les absences
interface AbsenceType {
  id: string;
  name: string;
  impactPaie: boolean;
  description: string;
}

// Type pour les jours fériés
interface JourFerie {
  id: string;
  name: string;
  date: string;
  isFixed: boolean;
}

// Schéma pour le formulaire d'ajout/édition de type de congé
const congeTypeSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  duration: z.string().min(1, "La durée est requise"),
  isCustomizable: z.boolean(),
  description: z.string().optional().default(""),
  impact: z.string().optional().default(""),
});

// Schéma pour le formulaire d'ajout/édition d'absences
const absenceTypeSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  impactPaie: z.boolean(),
  description: z.string().optional().default(""),
});

// Schéma pour le formulaire d'ajout/édition d'étape d'approbation
const approvalStepSchema = z.object({
  stepName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  role: z.string().min(2, "Le rôle est requis"),
  isRequired: z.boolean(),
  order: z.number().min(1, "L'ordre doit être au moins 1"),
});

// Type pour le formulaire avec des valeurs requises
type CongeTypeFormValues = z.infer<typeof congeTypeSchema>;
type AbsenceTypeFormValues = z.infer<typeof absenceTypeSchema>;
type ApprovalStepFormValues = z.infer<typeof approvalStepSchema>;

const ParametresCongesAbsences = () => {
  // États pour les onglets internes
  const [activeTab, setActiveTab] = useState("types");
  
  // États pour les types de congés
  const [congeTypes, setCongeTypes] = useState<CongeType[]>([
    {
      id: "1",
      name: "Congé annuel",
      duration: "1.5 jour/mois (18 jours/an)",
      isCustomizable: true,
      description: "Congé payé annuel standard",
      impact: "Aucun impact négatif sur la paie",
    },
    {
      id: "2",
      name: "Congé maladie",
      duration: "Sur présentation de certificat",
      isCustomizable: true,
      description: "Congé en cas de maladie avec justificatif médical",
      impact: "Aucun impact pendant la période légale",
    },
    {
      id: "3",
      name: "Congé maternité",
      duration: "14 semaines",
      isCustomizable: false,
      description: "Congé obligatoire pour les femmes avant et après l'accouchement",
      impact: "Pris en charge partiellement par la CNSS",
    },
    {
      id: "4",
      name: "Congé paternité",
      duration: "15 jours",
      isCustomizable: false,
      description: "Congé pour les nouveaux pères",
      impact: "Aucun impact sur la paie",
    },
    {
      id: "5",
      name: "Congé mariage",
      duration: "4 jours",
      isCustomizable: true,
      description: "Congé exceptionnel pour mariage de l'employé",
      impact: "Congé exceptionnel payé",
    },
    {
      id: "6",
      name: "Congé décès proche",
      duration: "3 jours",
      isCustomizable: true,
      description: "Congé pour décès d'un proche parent",
      impact: "Congé exceptionnel payé",
    },
  ]);
  
  // État pour les paramètres de solde
  const [soldeParams, setSoldeParams] = useState<SoldeParams>({
    initialSolde: 18,
    allowCumulative: true,
    maxCumulative: 30,
    resetPeriod: 'january',
  });
  
  // État pour les types d'absences
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([
    { id: "1", name: "Absence justifiée", impactPaie: false, description: "Absence avec justificatif valide" },
    { id: "2", name: "Absence injustifiée", impactPaie: true, description: "Absence sans justificatif valide" },
    { id: "3", name: "Retards répétitifs", impactPaie: true, description: "Retards cumulés dépassant un certain seuil" },
  ]);
  
  // État pour le circuit d'approbation
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([
    { id: "1", stepName: "Demande employé", role: "Employé", isRequired: true, order: 1 },
    { id: "2", stepName: "Validation manager", role: "Manager", isRequired: true, order: 2 },
    { id: "3", stepName: "Validation RH", role: "Admin RH", isRequired: true, order: 3 },
  ]);

  // État pour les jours fériés légaux
  const [joursFeries, setJoursFeries] = useState<JourFerie[]>([
    { id: "1", name: "Jour de l'an", date: "2024-01-01", isFixed: true },
    { id: "2", name: "Fête du Travail", date: "2024-05-01", isFixed: true },
    { id: "3", name: "Fête du Trône", date: "2024-07-30", isFixed: true },
    { id: "4", name: "Fête de l'Indépendance", date: "2024-11-18", isFixed: true },
    { id: "5", name: "Aïd al-Fitr", date: "2024-04-10", isFixed: false },
    { id: "6", name: "Aïd al-Adha", date: "2024-06-17", isFixed: false },
  ]);
  
  // États pour les dialogues
  const [isAddingCongeType, setIsAddingCongeType] = useState(false);
  const [editingCongeType, setEditingCongeType] = useState<CongeType | null>(null);
  
  // États pour le dialogue d'absence
  const [isAddingAbsenceType, setIsAddingAbsenceType] = useState(false);
  const [editingAbsenceType, setEditingAbsenceType] = useState<AbsenceType | null>(null);

  // États pour le dialogue d'étape d'approbation
  const [isAddingApprovalStep, setIsAddingApprovalStep] = useState(false);
  const [editingApprovalStep, setEditingApprovalStep] = useState<ApprovalStep | null>(null);

  // États pour les jours fériés
  const [isAddingJourFerie, setIsAddingJourFerie] = useState(false);
  const [editingJourFerie, setEditingJourFerie] = useState<JourFerie | null>(null);
  
  // Formulaire pour ajouter/éditer un type de congé
  const congeForm = useForm<CongeTypeFormValues>({
    resolver: zodResolver(congeTypeSchema),
    defaultValues: {
      name: "",
      duration: "",
      isCustomizable: true,
      description: "",
      impact: "",
    },
  });

  // Formulaire pour ajouter/éditer un type d'absence
  const absenceForm = useForm<AbsenceTypeFormValues>({
    resolver: zodResolver(absenceTypeSchema),
    defaultValues: {
      name: "",
      impactPaie: false,
      description: "",
    },
  });

  // Formulaire pour ajouter/éditer une étape d'approbation
  const approvalStepForm = useForm<ApprovalStepFormValues>({
    resolver: zodResolver(approvalStepSchema),
    defaultValues: {
      stepName: "",
      role: "",
      isRequired: true,
      order: approvalSteps.length + 1,
    },
  });
  
  // Préremplir le formulaire en cas d'édition
  React.useEffect(() => {
    if (editingCongeType) {
      congeForm.reset({
        name: editingCongeType.name,
        duration: editingCongeType.duration,
        isCustomizable: editingCongeType.isCustomizable,
        description: editingCongeType.description,
        impact: editingCongeType.impact,
      });
    } else {
      congeForm.reset({
        name: "",
        duration: "",
        isCustomizable: true,
        description: "",
        impact: "",
      });
    }
  }, [editingCongeType, congeForm]);

  // Préremplir le formulaire d'absence en cas d'édition
  React.useEffect(() => {
    if (editingAbsenceType) {
      absenceForm.reset({
        name: editingAbsenceType.name,
        impactPaie: editingAbsenceType.impactPaie,
        description: editingAbsenceType.description,
      });
    } else {
      absenceForm.reset({
        name: "",
        impactPaie: false,
        description: "",
      });
    }
  }, [editingAbsenceType, absenceForm]);

  // Préremplir le formulaire d'étape d'approbation en cas d'édition
  React.useEffect(() => {
    if (editingApprovalStep) {
      approvalStepForm.reset({
        stepName: editingApprovalStep.stepName,
        role: editingApprovalStep.role,
        isRequired: editingApprovalStep.isRequired,
        order: editingApprovalStep.order,
      });
    } else {
      approvalStepForm.reset({
        stepName: "",
        role: "",
        isRequired: true,
        order: approvalSteps.length + 1,
      });
    }
  }, [editingApprovalStep, approvalStepForm, approvalSteps.length]);
  
  // Fonction pour sauvegarder un type de congé
  const saveCongeType = (data: CongeTypeFormValues) => {
    if (editingCongeType) {
      // Mise à jour d'un type existant
      setCongeTypes(
        congeTypes.map((type) =>
          type.id === editingCongeType.id
            ? { ...type, ...data }
            : type
        )
      );
      toast.success("Type de congé mis à jour avec succès");
    } else {
      // Ajout d'un nouveau type
      // Ensure all properties are non-optional to match CongeType interface
      const newCongeType: CongeType = {
        id: Date.now().toString(),
        name: data.name,
        duration: data.duration,
        isCustomizable: data.isCustomizable,
        description: data.description || "",  // Use empty string if undefined
        impact: data.impact || "",  // Use empty string if undefined
      };
      setCongeTypes([...congeTypes, newCongeType]);
      toast.success("Nouveau type de congé ajouté avec succès");
    }
    
    closeCongeDialog();
  };

  // Fonction pour sauvegarder un type d'absence
  const saveAbsenceType = (data: AbsenceTypeFormValues) => {
    if (editingAbsenceType) {
      // Mise à jour d'un type existant
      setAbsenceTypes(
        absenceTypes.map((type) =>
          type.id === editingAbsenceType.id
            ? { ...type, ...data }
            : type
        )
      );
      toast.success("Type d'absence mis à jour avec succès");
    } else {
      // Ajout d'un nouveau type
      const newAbsenceType: AbsenceType = {
        id: Date.now().toString(),
        name: data.name,
        impactPaie: data.impactPaie,
        description: data.description || "",
      };
      setAbsenceTypes([...absenceTypes, newAbsenceType]);
      toast.success("Nouveau type d'absence ajouté avec succès");
    }
    
    closeAbsenceDialog();
  };

  // Fonction pour sauvegarder une étape d'approbation
  const saveApprovalStep = (data: ApprovalStepFormValues) => {
    if (editingApprovalStep) {
      // Mise à jour d'une étape existante
      setApprovalSteps(
        approvalSteps.map((step) =>
          step.id === editingApprovalStep.id
            ? { ...step, ...data }
            : step
        )
      );
      toast.success("Étape d'approbation mise à jour avec succès");
    } else {
      // Ajout d'une nouvelle étape
      const newApprovalStep: ApprovalStep = {
        id: Date.now().toString(),
        stepName: data.stepName,
        role: data.role,
        isRequired: data.isRequired,
        order: data.order,
      };
      setApprovalSteps([...approvalSteps, newApprovalStep]);
      toast.success("Nouvelle étape d'approbation ajoutée avec succès");
    }
    
    closeApprovalStepDialog();
  };
  
  // Fermer le dialogue d'ajout/édition
  const closeCongeDialog = () => {
    setIsAddingCongeType(false);
    setEditingCongeType(null);
    congeForm.reset();
  };

  // Fermer le dialogue d'ajout/édition d'absence
  const closeAbsenceDialog = () => {
    setIsAddingAbsenceType(false);
    setEditingAbsenceType(null);
    absenceForm.reset();
  };

  // Fermer le dialogue d'ajout/édition d'étape d'approbation
  const closeApprovalStepDialog = () => {
    setIsAddingApprovalStep(false);
    setEditingApprovalStep(null);
    approvalStepForm.reset();
  };
  
  // Supprimer un type de congé
  const deleteCongeType = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type de congé ?")) {
      setCongeTypes(congeTypes.filter((type) => type.id !== id));
      toast.success("Type de congé supprimé avec succès");
    }
  };

  // Supprimer un type d'absence
  const deleteAbsenceType = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type d'absence ?")) {
      setAbsenceTypes(absenceTypes.filter((type) => type.id !== id));
      toast.success("Type d'absence supprimé avec succès");
    }
  };

  // Supprimer une étape d'approbation
  const deleteApprovalStep = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette étape d'approbation ?")) {
      setApprovalSteps(approvalSteps.filter((step) => step.id !== id));
      toast.success("Étape d'approbation supprimée avec succès");
    }
  };
  
  // Mettre à jour les paramètres de solde
  const updateSoldeParams = (key: keyof SoldeParams, value: any) => {
    setSoldeParams((prev) => ({ ...prev, [key]: value }));
    toast.success("Paramètres de solde mis à jour");
  };
  
  // Sauvegarder tous les paramètres
  const saveAllSettings = () => {
    toast.success("Tous les paramètres de congés et absences ont été enregistrés");
  };

  // Ajouter un nouvel onglet pour les jours fériés
  const menuItems = [
    { id: "types", label: "Types de congés", icon: <CalendarCheck className="h-4 w-4" /> },
    { id: "soldes", label: "Soldes de congés", icon: <Clock className="h-4 w-4" /> },
    { id: "absences", label: "Absences", icon: <CalendarX className="h-4 w-4" /> },
    { id: "workflow", label: "Circuit d'approbation", icon: <Users className="h-4 w-4" /> },
    { id: "joursferies", label: "Jours fériés", icon: <CalendarDays className="h-4 w-4" /> },
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Congés et Absences</CardTitle>
          <CardDescription>
            Configurez les paramètres liés aux congés, absences et leur gestion selon la législation marocaine
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-8">
              {menuItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                  {item.icon} {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Types de congés */}
            <TabsContent value="types" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Types de congés disponibles</h3>
                <Button 
                  onClick={() => {
                    setIsAddingCongeType(true);
                    setEditingCongeType(null);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Ajouter un type
                </Button>
              </div>
              
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Personnalisable</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Impact sur la paie</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {congeTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.duration}</TableCell>
                        <TableCell>
                          {type.isCustomizable ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Non
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {type.description}
                        </TableCell>
                        <TableCell>{type.impact}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingCongeType(type)}
                              disabled={!type.isCustomizable}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteCongeType(type.id)}
                              disabled={!type.isCustomizable}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Note importante</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les congés maternité et paternité sont obligatoires selon la législation
                      marocaine et ne peuvent pas être modifiés. Les autres types de congés peuvent
                      être ajustés selon votre convention collective.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Paramètres des soldes de congés */}
            <TabsContent value="soldes" className="space-y-6">
              <h3 className="text-lg font-medium">Configuration des soldes de congés</h3>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="initial-solde">Solde initial annuel (jours)</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          id="initial-solde"
                          type="number"
                          value={soldeParams.initialSolde}
                          onChange={(e) => updateSoldeParams("initialSolde", parseInt(e.target.value) || 0)}
                          className="max-w-[200px]"
                        />
                        <span className="text-sm text-muted-foreground">
                          jours par an
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Nombre de jours alloués automatiquement à chaque employé chaque année.
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="allow-cumulative" className="flex-1">
                        Autoriser le cumul et report des congés
                      </Label>
                      <Switch
                        id="allow-cumulative"
                        checked={soldeParams.allowCumulative}
                        onCheckedChange={(checked) => updateSoldeParams("allowCumulative", checked)}
                      />
                    </div>
                    
                    {soldeParams.allowCumulative && (
                      <div className="ml-6 border-l-2 pl-4 border-l-muted-foreground/20 space-y-4">
                        <div>
                          <Label htmlFor="max-cumulative">Nombre maximum de jours reportables</Label>
                          <Input
                            id="max-cumulative"
                            type="number"
                            value={soldeParams.maxCumulative}
                            onChange={(e) => updateSoldeParams("maxCumulative", parseInt(e.target.value) || 0)}
                            className="max-w-[200px] mt-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Période de réinitialisation des soldes</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="reset-january"
                          name="reset-period"
                          className="h-4 w-4 text-primary border-primary"
                          checked={soldeParams.resetPeriod === 'january'}
                          onChange={() => updateSoldeParams("resetPeriod", 'january')}
                        />
                        <Label htmlFor="reset-january" className="font-normal">
                          Janvier de chaque année (pour tous les employés)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="reset-hire-date"
                          name="reset-period"
                          className="h-4 w-4 text-primary border-primary"
                          checked={soldeParams.resetPeriod === 'hire_date'}
                          onChange={() => updateSoldeParams("resetPeriod", 'hire_date')}
                        />
                        <Label htmlFor="reset-hire-date" className="font-normal">
                          Date d'embauche de chaque employé
                        </Label>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-md mt-6">
                      <h4 className="font-medium">Rappel légal</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Selon le code du travail marocain, le solde minimum de congés payés est de 1,5 jour par mois de travail (18 jours par an).
                        Cette période peut être augmentée selon votre convention collective.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Gestion des absences */}
            <TabsContent value="absences" className="space-y-6">
              <h3 className="text-lg font-medium">Paramétrage des absences</h3>
              
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type d'absence</TableHead>
                      <TableHead>Impact sur la paie</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absenceTypes.map((type) => (
                      <TableRow key={type.id}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>
                          {type.impactPaie ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Retenue sur salaire
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Sans retenue
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{type.description}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingAbsenceType(type)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => deleteAbsenceType(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    setIsAddingAbsenceType(true);
                    setEditingAbsenceType(null);
                  }}
                >
                  <Plus className="h-4 w-4" /> Ajouter un type d'absence
                </Button>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md mt-6">
                <h4 className="font-medium">Configuration de la retenue sur salaire</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Paramétrez comment les absences impactent le calcul du salaire:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-deduction" className="flex-1">
                      Appliquer automatiquement les retenues pour absences injustifiées
                    </Label>
                    <Switch
                      id="auto-deduction"
                      checked={true}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="calculation-method">Méthode de calcul pour les retenues</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="calculation-method" className="mt-2 max-w-[300px]">
                        <SelectValue placeholder="Sélectionner une méthode de calcul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Salaire journalier (salaire mensuel / 26)</SelectItem>
                        <SelectItem value="hourly">Taux horaire</SelectItem>
                        <SelectItem value="custom">Formule personnalisée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Circuit d'approbation */}
            <TabsContent value="workflow" className="space-y-6">
              <h3 className="text-lg font-medium">Configuration du circuit d'approbation</h3>
              
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étape</TableHead>
                      <TableHead>Rôle responsable</TableHead>
                      <TableHead>Obligatoire</TableHead>
                      <TableHead>Ordre</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvalSteps.map((step) => (
                      <TableRow key={step.id}>
                        <TableCell className="font-medium">{step.stepName}</TableCell>
                        <TableCell>{step.role}</TableCell>
                        <TableCell>
                          {step.isRequired ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Optionnel
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{step.order}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={step.id === "1"}
                              onClick={() => step.id !== "1" && setEditingApprovalStep(step)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              disabled={step.id === "1"}
                              onClick={() => step.id !== "1" && deleteApprovalStep(step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => {
                    setIsAddingApprovalStep(true);
                    setEditingApprovalStep(null);
                  }}
                >
                  <Plus className="h-4 w-4" /> Ajouter une étape d'approbation
                </Button>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Notifications automatiques</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-manager" className="flex-1">
                      Notification au manager lors d'une demande de congé
                    </Label>
                    <Switch
                      id="notify-manager"
                      checked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-hr" className="flex-1">
                      Notification au RH pour validation finale
                    </Label>
                    <Switch
                      id="notify-hr"
                      checked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-employee" className="flex-1">
                      Notification à l'employé sur l'état de sa demande
                    </Label>
                    <Switch
                      id="notify-employee"
                      checked={true}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-reminder" className="flex-1">
                      Rappel de reprise du travail (1 jour avant la fin du congé)
                    </Label>
                    <Switch
                      id="notify-reminder"
                      checked={true}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Jours fériés légaux */}
            <TabsContent value="joursferies" className="space-y-6">
              <h3 className="text-lg font-medium">Jours fériés légaux</h3>
              
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du jour férié</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {joursFeries.map((jour) => (
                      <TableRow key={jour.id}>
                        <TableCell className="font-medium">{jour.name}</TableCell>
                        <TableCell>{jour.date}</TableCell>
                        <TableCell>
                          {jour.isFixed ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Date fixe
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              Date variable
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingJourFerie(jour)}
                              disabled={jour.isFixed}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Note importante sur les jours fériés</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Les jours fériés à date fixe ne peuvent pas être modifiés car ils sont définis par la loi marocaine.
                      Les jours fériés à date variable (fêtes religieuses) peuvent être ajustés chaque année selon le calendrier lunaire.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8 space-x-4">
            <Button variant="outline">Annuler les modifications</Button>
            <Button onClick={saveAllSettings}>Enregistrer tous les paramètres</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogue pour ajouter/éditer un type de congé */}
      <Dialog open={isAddingCongeType || editingCongeType !== null} onOpenChange={(open) => {
        if (!open) closeCongeDialog();
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingCongeType ? "Modifier le type de congé" : "Ajouter un type de congé"}
            </DialogTitle>
            <DialogDescription>
              {editingCongeType 
                ? "Modifiez les détails du type de congé sélectionné." 
                : "Ajoutez un nouveau type de congé à la liste des congés disponibles."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...congeForm}>
            <form onSubmit={congeForm.handleSubmit(saveCongeType)} className="space-y-5">
              <FormField
                control={congeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du congé</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Congé pour événement familial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={congeForm.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée standard</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 3 jours" {...field} />
                    </FormControl>
                    <FormDescription>
                      Indiquez la durée standard selon la législation ou votre convention collective.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={congeForm.control}
                name="isCustomizable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Personnalisable</FormLabel>
                      <FormDescription>
                        Ce type de congé peut-il être modifié ou supprimé ultérieurement?
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
                control={congeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée du type de congé"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={congeForm.control}
                name="impact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impact sur la paie</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Aucun impact sur la paie" {...field} />
                    </FormControl>
                    <FormDescription>
                      Décrivez comment ce type de congé affecte la rémunération de l'employé.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeCongeDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingCongeType ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour ajouter/éditer un type d'absence */}
      <Dialog open={isAddingAbsenceType || editingAbsenceType !== null} onOpenChange={(open) => {
        if (!open) closeAbsenceDialog();
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingAbsenceType ? "Modifier le type d'absence" : "Ajouter un type d'absence"}
            </DialogTitle>
            <DialogDescription>
              {editingAbsenceType 
                ? "Modifiez les détails du type d'absence sélectionné." 
                : "Ajoutez un nouveau type d'absence à la liste des absences disponibles."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...absenceForm}>
            <form onSubmit={absenceForm.handleSubmit(saveAbsenceType)} className="space-y-5">
              <FormField
                control={absenceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du type d'absence</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Absence pour rendez-vous médical" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={absenceForm.control}
                name="impactPaie"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Impact sur la paie</FormLabel>
                      <FormDescription>
                        Ce type d'absence entraîne-t-il une retenue sur salaire?
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
                control={absenceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée du type d'absence"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeAbsenceDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingAbsenceType ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour ajouter/éditer une étape d'approbation */}
      <Dialog open={isAddingApprovalStep || editingApprovalStep !== null} onOpenChange={(open) => {
        if (!open) closeApprovalStepDialog();
      }}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingApprovalStep ? "Modifier l'étape d'approbation" : "Ajouter une étape d'approbation"}
            </DialogTitle>
            <DialogDescription>
              {editingApprovalStep 
                ? "Modifiez les détails de l'étape d'approbation sélectionnée." 
                : "Ajoutez une nouvelle étape au circuit d'approbation des demandes de congés."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...approvalStepForm}>
            <form onSubmit={approvalStepForm.handleSubmit(saveApprovalStep)} className="space-y-5">
              <FormField
                control={approvalStepForm.control}
                name="stepName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'étape</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Validation responsable département" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={approvalStepForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle responsable</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Employé">Employé</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Directeur">Directeur</SelectItem>
                        <SelectItem value="Admin RH">Admin RH</SelectItem>
                        <SelectItem value="Direction Générale">Direction Générale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Rôle qui sera responsable de cette étape d'approbation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={approvalStepForm.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre dans le circuit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>
                      Position de cette étape dans l'ordre du circuit d'approbation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={approvalStepForm.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Étape obligatoire</FormLabel>
                      <FormDescription>
                        Cette étape d'approbation est-elle obligatoire dans le circuit?
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
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeApprovalStepDialog}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingApprovalStep ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresCongesAbsences;
