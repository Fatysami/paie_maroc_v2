
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import SimpleInformationsTab from "./tabs/SimpleInformationsTab";
import PaieTab from "./tabs/PaieTab";
import DocumentsTab from "./tabs/DocumentsTab";
import FormNavigation from "./FormNavigation";
import { ContractType, EmployeStatus, ModePaiement, Employe } from "@/pages/GestionEmployes";
import { Adresse } from "./EmployeAdresseForm";

const employeFormSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  cin: z.string().min(2, { message: "Le numéro CIN est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  telephone: z.string().min(8, { message: "Numéro de téléphone invalide" }),
  adresseRue: z.string().min(5, { message: "La rue est requise" }),
  adresseVille: z.string().min(2, { message: "La ville est requise" }),
  adressePays: z.string().min(2, { message: "Le pays est requis" }).default("Maroc"),
  adresseCodePostal: z.string().min(4, { message: "Le code postal est requis" }),
  dateEmbauche: z.string(),
  poste: z.string().min(2, { message: "Le poste est requis" }),
  departement: z.string().min(2, { message: "Le département est requis" }),
  typeContrat: z.enum(["CDI", "CDD", "Intérim", "Freelance"]),
  status: z.enum(["Actif", "Inactif", "Période d'essai", "Démissionné"]),
  salaireBase: z.number().min(1, { message: "Le salaire doit être supérieur à 0" }),
  matricule: z.string().min(2, { message: "Le matricule est requis" }),
  
  numeroCnss: z.string().optional(),
  affiliationCnssAmo: z.boolean().optional(),
  affiliationCimr: z.boolean().optional(),
  tauxCimr: z.number().optional(),
  modePaiement: z.enum(["Virement bancaire", "Espèces", "Chèque"]).optional(),
  rib: z.string().optional(),
  banque: z.string().optional(),
  
  gererPrimesUlterieurement: z.boolean().optional(),
  gererDocumentsUlterieurement: z.boolean().optional(),
});

type EmployeFormValues = z.infer<typeof employeFormSchema>;

interface SimpleAddEmployeFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onCancel: () => void;
}

const SimpleAddEmployeForm = ({ onSubmit, initialData, onCancel }: SimpleAddEmployeFormProps) => {
  const [activeTab, setActiveTab] = useState("informations");
  const navigate = useNavigate();
  
  const defaultValues: Partial<EmployeFormValues> = {
    nom: initialData?.nom || "",
    prenom: initialData?.prenom || "",
    cin: initialData?.cin || "",
    email: initialData?.email || "",
    telephone: initialData?.telephone || "",
    adresseRue: initialData?.adresse?.rue || "",
    adresseVille: initialData?.adresse?.ville || "",
    adressePays: initialData?.adresse?.pays || "Maroc",
    adresseCodePostal: initialData?.adresse?.codePostal || "",
    dateEmbauche: initialData?.dateEmbauche || new Date().toISOString().substring(0, 10),
    poste: initialData?.poste || "",
    departement: initialData?.departement || "",
    typeContrat: initialData?.typeContrat || "CDI",
    status: initialData?.status || "Actif",
    salaireBase: initialData?.salaire || 0,
    matricule: initialData?.matricule || "",
    numeroCnss: initialData?.numeroCnss || "",
    affiliationCnssAmo: initialData?.affiliationCnssAmo || false,
    affiliationCimr: initialData?.affiliationCimr || false,
    tauxCimr: initialData?.tauxCimr || 0,
    modePaiement: initialData?.modePaiement || "Virement bancaire",
    rib: initialData?.rib || "",
    banque: initialData?.banque || "",
    gererPrimesUlterieurement: true,
    gererDocumentsUlterieurement: true,
  };

  const form = useForm<EmployeFormValues>({
    resolver: zodResolver(employeFormSchema),
    defaultValues,
  });

  const handleFormSubmit = async (data: EmployeFormValues) => {
    try {
      const adresse: Adresse = {
        rue: data.adresseRue,
        ville: data.adresseVille,
        pays: data.adressePays,
        codePostal: data.adresseCodePostal
      };

      const employeData: Omit<Employe, "id"> = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        cin: data.cin,
        matricule: data.matricule,
        adresse: adresse,
        dateEmbauche: data.dateEmbauche,
        poste: data.poste,
        departement: data.departement,
        typeContrat: data.typeContrat as ContractType,
        status: data.status as EmployeStatus,
        salaire: data.salaireBase,
        salaireBase: data.salaireBase,
        modePaiement: data.modePaiement as ModePaiement,
        rib: data.rib,
        banque: data.banque,
        numeroCnss: data.numeroCnss,
        affiliationCnssAmo: data.affiliationCnssAmo,
        affiliationCimr: data.affiliationCimr,
        tauxCimr: data.tauxCimr,
        primes: [],
        avantages: [],
        documents: {
          contratSigne: false,
          cin: false,
          rib: false,
        },
        evaluationScore: 0,
        risqueTurnover: "moyen",
      };

      onSubmit(employeData);
      
      const newEmployeId = (initialData?.id || getNewId());
      
      setTimeout(() => {
        if (data.gererPrimesUlterieurement || data.gererDocumentsUlterieurement) {
          navigate(`/employe/${newEmployeId}`, { 
            state: { 
              openTab: data.gererPrimesUlterieurement ? "compensation" : "documents",
              nouveauEmploye: true
            }
          });
          
          toast("Redirection vers la page de gestion avancée", {
            description: "Vous pouvez maintenant gérer les primes et documents de l'employé.",
          });
        }
      }, 500);
      
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast("Erreur", {
        description: "Une erreur est survenue, veuillez réessayer.",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNextTab = () => {
    if (activeTab === "informations") setActiveTab("paie");
    else if (activeTab === "paie") setActiveTab("documents");
  };

  const handlePreviousTab = () => {
    if (activeTab === "documents") setActiveTab("paie");
    else if (activeTab === "paie") setActiveTab("informations");
  };

  const validateCurrentTab = async () => {
    let isValid = false;
    
    if (activeTab === "informations") {
      isValid = await form.trigger([
        "nom", "prenom", "cin", "email", "telephone", 
        "adresseRue", "adresseVille", "adressePays", "adresseCodePostal",
        "dateEmbauche", "poste", "departement", 
        "typeContrat", "status", "matricule"
      ]);
    } else if (activeTab === "paie") {
      isValid = await form.trigger(["salaireBase", "modePaiement"]);
    } else {
      isValid = true;
    }
    
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentTab();
    if (isValid) handleNextTab();
  };

  const getNewId = () => {
    return (Math.floor(Math.random() * 1000) + 10).toString();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="informations">Informations</TabsTrigger>
            <TabsTrigger value="paie">Paie & Banque</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="informations" className="space-y-4">
            <SimpleInformationsTab control={form.control} />
          </TabsContent>

          <TabsContent value="paie" className="space-y-4">
            <PaieTab control={form.control} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab control={form.control} />
          </TabsContent>
        </Tabs>

        <FormNavigation 
          activeTab={activeTab} 
          onPrevious={handlePreviousTab} 
          onNext={handleNext} 
          onCancel={onCancel} 
          isLastStep={activeTab === "documents"}
          isFirstStep={activeTab === "informations"}
        />
      </form>
    </Form>
  );
};

export default SimpleAddEmployeForm;
