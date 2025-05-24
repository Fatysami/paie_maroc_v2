
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Upload, AlertCircle, FileText, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Employe, ContractType, EmployeStatus, ModePaiement, Prime, Retenue, PrimeType, PrimeFrequence } from "@/pages/GestionEmployes";
import { useToast } from "@/hooks/use-toast";
import { Adresse } from "@/components/employes/EmployeAdresseForm";

// Define type for base calculation in variable premiums
export type BaseCalculType = "Salaire de base" | "Salaire brut" | "Salaire net";

// Define interfaces for form state management
interface PrimeFixe {
  nom: string;
  montant: number;
}

interface PrimeVariable {
  nom: string;
  pourcentage: number;
  base: BaseCalculType;
}

interface RetenueSimple {
  nom: string;
  montant: number;
}

const formSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  matricule: z.string().min(3, "Le matricule doit contenir au moins 3 caractères"),
  cin: z.string().min(6, "Le CIN doit contenir au moins 6 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  telephone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  
  adresseRue: z.string().min(2, "La rue doit contenir au moins 2 caractères"),
  adresseVille: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  adressePays: z.string().min(2, "Le pays doit contenir au moins 2 caractères").default("Maroc"),
  adresseCodePostal: z.string().min(4, "Le code postal doit contenir au moins 4 caractères"),
  
  dateEmbauche: z.date({
    required_error: "Veuillez sélectionner une date d'embauche",
  }),
  poste: z.string().min(2, "Veuillez entrer un poste valide"),
  departement: z.string().min(2, "Veuillez sélectionner un département"),
  typeContrat: z.enum(["CDI", "CDD", "Intérim", "Freelance", "Stage"], {
    required_error: "Veuillez sélectionner un type de contrat",
  }),
  dureeContrat: z.coerce.number().optional(),
  dateFinContrat: z.date().optional(),
  heuresTravailHebdo: z.coerce.number().positive("Veuillez entrer un nombre d'heures valide").default(44),
  periodeEssaiDebut: z.date().optional(),
  periodeEssaiFin: z.date().optional(),
  status: z.enum(["Actif", "Inactif", "Période d'essai", "Démissionné"], {
    required_error: "Veuillez sélectionner un statut",
  }),
  
  salaireBase: z.coerce.number().min(1, "Veuillez entrer un salaire valide"),
  modePaiement: z.enum(["Virement bancaire", "Espèces", "Chèque"], {
    required_error: "Veuillez sélectionner un mode de paiement",
  }).default("Virement bancaire"),
  rib: z.string().regex(/^[0-9]{24}$/, "Le RIB doit contenir 24 chiffres"),
  banque: z.string().min(2, "Veuillez sélectionner une banque"),
  
  numeroCnss: z.string().min(8, "Le numéro CNSS doit contenir au moins 8 caractères"),
  affiliationCnssAmo: z.boolean().default(true),
  affiliationCimr: z.boolean().default(false),
  tauxCimr: z.coerce.number().min(0).max(100).default(0),
  
  primesFixes: z.array(
    z.object({
      nom: z.string().min(1),
      montant: z.coerce.number().min(0),
    })
  ).default([]),
  primesVariables: z.array(
    z.object({
      nom: z.string().min(1),
      pourcentage: z.coerce.number().min(0).max(100),
      base: z.enum(["Salaire de base", "Salaire brut", "Salaire net"]).default("Salaire de base"),
    })
  ).default([]),
  retenues: z.array(
    z.object({
      nom: z.string().min(1),
      montant: z.coerce.number().min(0),
    })
  ).default([]),
  
  contraSigneUploaded: z.boolean().default(false),
  cinUploaded: z.boolean().default(false),
  ribUploaded: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEmployeFormProps {
  onSubmit: (data: Omit<Employe, "id">) => void;
  onCancel: () => void;
  initialData?: Employe;
}

const departements = [
  "IT",
  "Finance",
  "Ressources Humaines",
  "Ventes",
  "Marketing",
  "Administration",
  "Production",
  "Logistique",
  "R&D",
  "Service Client",
];

const banques = [
  "Attijariwafa Bank",
  "Banque Populaire",
  "BMCE Bank",
  "Société Générale Maroc",
  "BMCI",
  "CIH Bank",
  "Crédit du Maroc",
  "Al Barid Bank",
  "CFG Bank",
  "Bank Al Yousr",
  "Umnia Bank",
  "Crédit Agricole du Maroc",
  "Bank of Africa",
  "Arab Bank",
  "Autre",
];

const AddEmployeForm = ({ onSubmit, onCancel, initialData }: AddEmployeFormProps) => {
  const isEditMode = !!initialData;
  const { toast } = useToast();

  const [primesFixes, setPrimesFixes] = useState<PrimeFixe[]>([]);
  const [primesVariables, setPrimesVariables] = useState<PrimeVariable[]>([]);
  const [retenues, setRetenues] = useState<RetenueSimple[]>([]);
  
  const [isCDD, setIsCDD] = useState(initialData?.typeContrat === "CDD");
  const [hasCIMR, setHasCIMR] = useState(initialData?.affiliationCimr || false);
  
  const [documents, setDocuments] = useState<Array<{ nom: string; uploaded: boolean }>>([]);
  
  const [fileUploads, setFileUploads] = useState({
    contrat: false,
    cin: false,
    rib: false
  });

  const simulateOCR = (fileType: string) => {
    toast({
      title: "Analyse OCR en cours",
      description: `L'IA est en train d'analyser le document ${fileType}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Analyse terminée",
        description: `Les données du document ${fileType} ont été extraites avec succès.`,
      });
      
      setFileUploads(prev => ({
        ...prev,
        [fileType]: true
      }));
      
      if (fileType === 'cin') {
        form.setValue("cin", "BE123456");
        form.setValue("nom", form.getValues("nom") || "Nom extrait");
        form.setValue("prenom", form.getValues("prenom") || "Prénom extrait");
      } else if (fileType === 'rib') {
        form.setValue("rib", "123456789012345678901234");
        form.setValue("banque", "Attijariwafa Bank");
      }
    }, 2000);
  };
  
  const simulateUpload = (index: number) => {
    toast({
      title: "Téléchargement en cours",
      description: `Le document est en cours de téléchargement...`,
    });
    
    setTimeout(() => {
      const updatedDocs = [...documents];
      updatedDocs[index] = { ...updatedDocs[index], uploaded: true };
      setDocuments(updatedDocs);
      
      toast({
        title: "Téléchargement terminé",
        description: `Le document a été téléchargé avec succès.`,
      });
    }, 1500);
  };

  const defaultValues: Partial<FormValues> = isEditMode
    ? {
        ...initialData,
        adresseRue: initialData.adresse?.rue || "",
        adresseVille: initialData.adresse?.ville || "",
        adressePays: initialData.adresse?.pays || "Maroc",
        adresseCodePostal: initialData.adresse?.codePostal || "",
        
        dateEmbauche: initialData.dateEmbauche ? new Date(initialData.dateEmbauche) : new Date(),
        dateFinContrat: initialData.dateFinContrat ? new Date(initialData.dateFinContrat) : undefined,
        periodeEssaiDebut: initialData.periodeEssaiDebut ? new Date(initialData.periodeEssaiDebut) : undefined,
        periodeEssaiFin: initialData.periodeEssaiFin ? new Date(initialData.periodeEssaiFin) : undefined,
        modePaiement: (initialData.modePaiement as ModePaiement) || "Virement bancaire",
        affiliationCnssAmo: initialData.affiliationCnssAmo || true,
        heuresTravailHebdo: initialData.heuresTravailHebdo || 44,
        salaireBase: initialData.salaireBase || initialData.salaire || 0,
        dureeContrat: initialData.dureeContrat || 0,
      }
    : {
        nom: "",
        prenom: "",
        matricule: "",
        cin: "",
        email: "",
        telephone: "",
        adresseRue: "",
        adresseVille: "",
        adressePays: "Maroc",
        adresseCodePostal: "",
        poste: "",
        departement: "",
        salaireBase: 0,
        rib: "",
        banque: "",
        numeroCnss: "",
        status: "Actif",
        typeContrat: "CDI",
        modePaiement: "Virement bancaire",
        affiliationCnssAmo: true,
        heuresTravailHebdo: 44,
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchTypeContrat = form.watch("typeContrat");
  
  useEffect(() => {
    setIsCDD(watchTypeContrat === "CDD");
  }, [watchTypeContrat]);
  
  const watchAffiliationCimr = form.watch("affiliationCimr");
  
  useEffect(() => {
    setHasCIMR(watchAffiliationCimr);
  }, [watchAffiliationCimr]);

  useEffect(() => {
    // Initialize primes fixes from initial data
    if (initialData?.primes) {
      const fixedPrimes = initialData.primes.filter(prime => prime.type === "fixe");
      if (fixedPrimes.length > 0) {
        setPrimesFixes(fixedPrimes.map(prime => ({
          nom: prime.nom,
          montant: prime.montant
        })));
      }
      
      // Initialize primes variables from initial data
      const variablePrimes = initialData.primes.filter(prime => prime.type === "pourcentage");
      if (variablePrimes.length > 0) {
        setPrimesVariables(variablePrimes.map(prime => {
          // Extract base from details if available, or use default
          const baseMatch = prime.details?.match(/Base: (.*)/);
          const base = baseMatch ? baseMatch[1] as BaseCalculType : "Salaire de base";
          
          return {
            nom: prime.nom,
            pourcentage: prime.montant,
            base: base
          };
        }));
      }
    }
    
    // Initialize retenues from initial data
    if (initialData?.retenues && initialData.retenues.length > 0) {
      setRetenues(initialData.retenues.map(retenue => ({
        nom: retenue.nom,
        montant: retenue.montant
      })));
    }
  }, [initialData]);

  const addPrimeFixe = () => {
    setPrimesFixes([...primesFixes, { nom: "", montant: 0 }]);
  };

  const addPrimeVariable = () => {
    setPrimesVariables([...primesVariables, { nom: "", pourcentage: 0, base: "Salaire de base" }]);
  };

  const addRetenue = () => {
    setRetenues([...retenues, { nom: "", montant: 0 }]);
  };
  
  const addDocument = () => {
    setDocuments([...documents, { nom: "", uploaded: false }]);
  };

  const removePrimeFixe = (index: number) => {
    setPrimesFixes(primesFixes.filter((_, i) => i !== index));
  };

  const removePrimeVariable = (index: number) => {
    setPrimesVariables(primesVariables.filter((_, i) => i !== index));
  };

  const removeRetenue = (index: number) => {
    setRetenues(retenues.filter((_, i) => i !== index));
  };
  
  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const updatePrimeFixe = (index: number, field: 'nom' | 'montant', value: string | number) => {
    const updated = [...primesFixes];
    updated[index] = { ...updated[index], [field]: value };
    setPrimesFixes(updated);
  };

  const updatePrimeVariable = (index: number, field: 'nom' | 'pourcentage' | 'base', value: string | number | BaseCalculType) => {
    const updated = [...primesVariables];
    updated[index] = { 
      ...updated[index], 
      [field]: field === 'base' ? value as BaseCalculType : value 
    };
    setPrimesVariables(updated);
  };

  const updateRetenue = (index: number, field: 'nom' | 'montant', value: string | number) => {
    const updated = [...retenues];
    updated[index] = { ...updated[index], [field]: value };
    setRetenues(updated);
  };
  
  const updateDocument = (index: number, nom: string) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], nom };
    setDocuments(updated);
  };

  const handleSubmit = (data: FormValues) => {
    const adresse: Adresse = {
      rue: data.adresseRue,
      ville: data.adresseVille,
      pays: data.adressePays,
      codePostal: data.adresseCodePostal
    };

    // Convert primesFixes to Prime objects
    const convertedPrimesFixes: Prime[] = primesFixes.map(prime => ({
      id: `prime-fixe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nom: prime.nom,
      montant: prime.montant,
      type: "fixe" as PrimeType,
      frequence: "mensuelle" as PrimeFrequence
    }));

    // Convert primesVariables to Prime objects
    const convertedPrimesVariables: Prime[] = primesVariables.map(prime => ({
      id: `prime-var-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nom: prime.nom,
      montant: prime.pourcentage,
      type: "pourcentage" as PrimeType,
      frequence: "mensuelle" as PrimeFrequence,
      details: `Base: ${prime.base}`
    }));

    // Convert retenues to Retenue objects
    const convertedRetenues: Retenue[] = retenues.map(retenue => ({
      id: `retenue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nom: retenue.nom,
      montant: retenue.montant,
      type: "fixe",
      obligatoire: true
    }));

    const employeeData: Omit<Employe, "id"> = {
      nom: data.nom,
      prenom: data.prenom,
      matricule: data.matricule,
      cin: data.cin,
      email: data.email,
      telephone: data.telephone,
      adresse: adresse,
      dateEmbauche: data.dateEmbauche.toISOString().split('T')[0],
      poste: data.poste,
      departement: data.departement,
      typeContrat: data.typeContrat,
      salaire: data.salaireBase,
      salaireBase: data.salaireBase,
      status: data.status,
      
      dateFinContrat: data.dateFinContrat ? data.dateFinContrat.toISOString().split('T')[0] : undefined,
      periodeEssaiDebut: data.periodeEssaiDebut ? data.periodeEssaiDebut.toISOString().split('T')[0] : undefined,
      periodeEssaiFin: data.periodeEssaiFin ? data.periodeEssaiFin.toISOString().split('T')[0] : undefined,
      
      modePaiement: data.modePaiement,
      rib: data.rib,
      banque: data.banque,
      numeroCnss: data.numeroCnss,
      affiliationCnssAmo: data.affiliationCnssAmo,
      affiliationCimr: data.affiliationCimr,
      tauxCimr: data.tauxCimr,
      dureeContrat: data.dureeContrat,
      heuresTravailHebdo: data.heuresTravailHebdo,
      
      primes: [...convertedPrimesFixes, ...convertedPrimesVariables],
      avantages: [],
      primesFixes: convertedPrimesFixes,
      primesVariables: convertedPrimesVariables,
      retenues: convertedRetenues,
      
      documents: {
        contratSigne: fileUploads.contrat,
        cin: fileUploads.cin,
        rib: fileUploads.rib,
        ...documents.reduce((acc, doc) => {
          if (doc.nom) {
            acc[doc.nom] = doc.uploaded;
          }
          return acc;
        }, {} as Record<string, boolean>)
      },
      
      situationFamiliale: "",
      competences: [],
      certifications: [],
      diplomes: [],
      evaluationScore: 0,
      risqueTurnover: "faible",
    };
    
    onSubmit(employeeData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="personnel" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6 rounded-lg bg-muted p-1 h-auto">
            <TabsTrigger 
              value="personnel" 
              className="rounded-md py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Informations personnelles
            </TabsTrigger>
            <TabsTrigger 
              value="professionnel" 
              className="rounded-md py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Informations professionnelles
            </TabsTrigger>
            <TabsTrigger 
              value="paie" 
              className="rounded-md py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Paie & Banque
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="rounded-md py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personnel" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIN</FormLabel>
                    <FormControl>
                      <Input placeholder="CIN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="matricule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule</FormLabel>
                    <FormControl>
                      <Input placeholder="Matricule" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Adresse</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="adresseRue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rue</FormLabel>
                      <FormControl>
                        <Input placeholder="Rue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adresseVille"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ville" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="adresseCodePostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Code postal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="adressePays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="Pays" defaultValue="Maroc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="professionnel" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste</FormLabel>
                    <FormControl>
                      <Input placeholder="Poste" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departements.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateEmbauche"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'embauche</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full pl-3 text-left font-normal"
                            }
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: fr })
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Inactif">Inactif</SelectItem>
                        <SelectItem value="Période d'essai">Période d'essai</SelectItem>
                        <SelectItem value="Démissionné">Démissionné</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="typeContrat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de contrat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type de contrat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CDI">CDI</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="Intérim">Intérim</SelectItem>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Stage">Stage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isCDD && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dureeContrat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée du contrat (mois)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Durée en mois"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateFinContrat"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin de contrat</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={
                                  "w-full pl-3 text-left font-normal"
                                }
                              >
                                {field.value ? (
                                  format(field.value, "P", { locale: fr })
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
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="heuresTravailHebdo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heures de travail hebdomadaires</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Heures de travail hebdomadaires"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Nombre d'heures de travail par semaine (par défaut: 44)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="periodeEssaiDebut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Début période d'essai</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
                            >
                              {field.value ? (
                                format(field.value, "P", { locale: fr })
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="periodeEssaiFin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fin période d'essai</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={
                                "w-full pl-3 text-left font-normal"
                              }
                            >
                              {field.value ? (
                                format(field.value, "P", { locale: fr })
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
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paie" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salaireBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire de base</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Salaire de base"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modePaiement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mode de paiement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
                        <SelectItem value="Chèque">Chèque</SelectItem>
                        <SelectItem value="Espèces">Espèces</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("modePaiement") === "Virement bancaire" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rib"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RIB</FormLabel>
                        <FormControl>
                          <Input placeholder="RIB" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="banque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banque</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une banque" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {banques.map((banque) => (
                              <SelectItem key={banque} value={banque}>
                                {banque}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Primes fixes</h3>
              {primesFixes.map((prime, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Nom de la prime"
                      value={prime.nom}
                      onChange={(e) => updatePrimeFixe(index, 'nom', e.target.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <Input 
                      type="number"
                      placeholder="Montant"
                      value={prime.montant}
                      onChange={(e) => updatePrimeFixe(index, 'montant', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePrimeFixe(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addPrimeFixe}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une prime fixe
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Primes variables</h3>
              {primesVariables.map((prime, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Input 
                      placeholder="Nom de la prime"
                      value={prime.nom}
                      onChange={(e) => updatePrimeVariable(index, 'nom', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Input 
                      type="number"
                      placeholder="Pourcentage"
                      value={prime.pourcentage}
                      onChange={(e) => updatePrimeVariable(index, 'pourcentage', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3">
                    <Select 
                      value={prime.base}
                      onValueChange={(value) => updatePrimeVariable(index, 'base', value as BaseCalculType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Base" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaire de base">Salaire de base</SelectItem>
                        <SelectItem value="Salaire brut">Salaire brut</SelectItem>
                        <SelectItem value="Salaire net">Salaire net</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePrimeVariable(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addPrimeVariable}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une prime variable
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Retenues</h3>
              {retenues.map((retenue, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Nom de la retenue"
                      value={retenue.nom}
                      onChange={(e) => updateRetenue(index, 'nom', e.target.value)}
                    />
                  </div>
                  <div className="col-span-5">
                    <Input 
                      type="number"
                      placeholder="Montant"
                      value={retenue.montant}
                      onChange={(e) => updateRetenue(index, 'montant', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeRetenue(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addRetenue}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter une retenue
              </Button>
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-medium">CNSS & CIMR</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroCnss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro CNSS</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro CNSS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="affiliationCnssAmo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Affiliation CNSS/AMO</FormLabel>
                        <FormDescription>
                          Affilier l'employé à la CNSS et l'AMO
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliationCimr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Affiliation CIMR</FormLabel>
                        <FormDescription>
                          Affilier l'employé à la CIMR
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

                {hasCIMR && (
                  <FormField
                    control={form.control}
                    name="tauxCimr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taux CIMR (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Taux CIMR"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Documents obligatoires</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>Contrat de travail signé</span>
                      </div>
                      <div className="flex items-center">
                        {fileUploads.contrat ? (
                          <div className="flex items-center text-green-500">
                            <span className="font-medium mr-2">Téléchargé</span>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => simulateOCR('contrat')}
                          >
                            <Upload className="h-4 w-4 mr-2" /> Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>Carte d'identité nationale (CIN)</span>
                      </div>
                      <div className="flex items-center">
                        {fileUploads.cin ? (
                          <div className="flex items-center text-green-500">
                            <span className="font-medium mr-2">Téléchargé</span>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => simulateOCR('cin')}
                          >
                            <Upload className="h-4 w-4 mr-2" /> Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-500" />
                        <span>Relevé d'identité bancaire (RIB)</span>
                      </div>
                      <div className="flex items-center">
                        {fileUploads.rib ? (
                          <div className="flex items-center text-green-500">
                            <span className="font-medium mr-2">Téléchargé</span>
                          </div>
                        ) : (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => simulateOCR('rib')}
                          >
                            <Upload className="h-4 w-4 mr-2" /> Télécharger
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Documents supplémentaires</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addDocument}
                >
                  <Plus className="h-4 w-4 mr-2" /> Ajouter
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Input 
                            placeholder="Nom du document"
                            value={doc.nom}
                            onChange={(e) => updateDocument(index, e.target.value)}
                          />
                        </div>
                        <div className="col-span-5 flex items-center">
                          {doc.uploaded ? (
                            <div className="flex items-center text-green-500">
                              <span className="font-medium">Téléchargé</span>
                            </div>
                          ) : (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => simulateUpload(index)}
                              disabled={!doc.nom}
                            >
                              <Upload className="h-4 w-4 mr-2" /> Télécharger
                            </Button>
                          )}
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeDocument(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {isEditMode ? "Mettre à jour" : "Ajouter l'employé"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddEmployeForm;
