
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Calculator, 
  Download, 
  RefreshCw, 
  Save, 
  FilePlus, 
  BarChart3, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  Trash2,
  Plus,
  FileText,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

// Schéma de validation pour le simulateur
const simulateurSchema = z.object({
  // Informations employé
  nom: z.string().optional(),
  situationFamiliale: z.enum(["celibataire", "marie", "divorce", "veuf"]),
  nombreEnfants: z.number().min(0, "Le nombre d'enfants ne peut pas être négatif"),
  statut: z.enum(["permanent", "temporaire", "stagiaire"]),
  dateEntree: z.string().optional(),
  
  // Salaire
  salaireBase: z.number().min(0, "Le salaire de base ne peut pas être négatif"),
  typeSalaire: z.enum(["brut", "net"]),
  typeContrat: z.enum(["cdi", "cdd", "freelance", "interim"]),
  primeFixe: z.number().min(0, "La prime fixe ne peut pas être négative").default(0),
  primeExceptionnelle: z.number().min(0, "La prime exceptionnelle ne peut pas être négative").default(0),
  avantagesNature: z.number().min(0, "Les avantages en nature ne peuvent pas être négatifs").default(0),
  
  // Ancienneté
  anciennete: z.number().min(0, "L'ancienneté ne peut pas être négative"),
  
  // Paramètres sociaux et fiscaux
  zoneTravail: z.enum(["zone1", "zone2", "zone3"]),
  secteurActivite: z.enum(["prive", "public", "semi_public"]),
  
  // Options CNSS et AMO (toujours activées par défaut)
  activerCNSS: z.boolean().default(true),
  activerAMO: z.boolean().default(true),
  
  // Options CIMR
  activerCIMR: z.boolean().default(false),
  tauxCIMREmploye: z.number().min(0).max(100).default(6),
  tauxCIMREmployeur: z.number().min(0).max(100).default(6),
  
  // Options IR
  exonerationIR: z.boolean().default(false),
  periodeExonerationIR: z.number().min(0).max(36).default(36),
});

// Valeurs par défaut pour le formulaire
const defaultValues = {
  nom: "",
  situationFamiliale: "celibataire" as const,
  nombreEnfants: 0,
  statut: "permanent" as const,
  dateEntree: new Date().toISOString().substring(0, 10),
  
  salaireBase: 5000,
  typeSalaire: "brut" as const,
  typeContrat: "cdi" as const,
  primeFixe: 0,
  primeExceptionnelle: 0,
  avantagesNature: 0,
  
  anciennete: 0,
  
  zoneTravail: "zone1" as const,
  secteurActivite: "prive" as const,
  
  activerCNSS: true,
  activerAMO: true,
  
  activerCIMR: false,
  tauxCIMREmploye: 6,
  tauxCIMREmployeur: 6,
  
  exonerationIR: false,
  periodeExonerationIR: 36,
};

// Taux CNSS, AMO, IR actuels (Maroc 2025)
const taux = {
  cnss: {
    employe: 4.48,
    employeur: 8.98,
    plafond: 6000
  },
  amo: {
    employe: 2.26,
    employeur: 4.11
  },
  ir: [
    { min: 0, max: 2500, taux: 0, sommeDeduire: 0 },
    { min: 2500, max: 4166.67, taux: 10, sommeDeduire: 250 },
    { min: 4166.67, max: 5000, taux: 20, sommeDeduire: 666.67 },
    { min: 5000, max: 6666.67, taux: 30, sommeDeduire: 1166.67 },
    { min: 6666.67, max: 15000, taux: 34, sommeDeduire: 1433.33 },
    { min: 15000, max: null, taux: 38, sommeDeduire: 2033.33 }
  ],
  abattementFamilial: {
    marie: 360, // par an
    enfant: 30, // par enfant par an, max 6 enfants
  }
};

// Type pour les résultats de la simulation
interface ResultatSimulation {
  salaireBrut: number;
  totalAvantages: number;
  brutImposable: number;
  salaireNetImposable: number;
  salaireNet: number;
  cotisationsEmploye: {
    cnss: number;
    amo: number;
    cimr: number;
    ir: number;
    total: number;
  };
  cotisationsEmployeur: {
    cnss: number;
    amo: number;
    cimr: number;
    taxeFormation: number;
    total: number;
  };
  coutTotal: number;
  alertes: string[];
}

// Type pour les simulations sauvegardées
interface SavedSimulation {
  id: string;
  date: string;
  nom: string;
  resultats: ResultatSimulation;
  parametres: z.infer<typeof simulateurSchema>;
  description?: string;
  selected?: boolean;
}

const SimulateurPaie = () => {
  const [resultats, setResultats] = useState<ResultatSimulation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("simulateur");
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [selectedSimulations, setSelectedSimulations] = useState<SavedSimulation[]>([]);
  const [showDifferences, setShowDifferences] = useState(false);
  
  const form = useForm<z.infer<typeof simulateurSchema>>({
    resolver: zodResolver(simulateurSchema),
    defaultValues,
  });
  
  // Fonction pour calculer l'ancienneté en années
  const calculerAnciennete = (dateEntree: string): number => {
    if (!dateEntree) return 0;
    
    const dateDebut = new Date(dateEntree);
    const dateActuelle = new Date();
    const diffAnnees = dateActuelle.getFullYear() - dateDebut.getFullYear();
    
    // Ajuster si l'anniversaire de l'entrée n'est pas encore passé cette année
    const moisActuel = dateActuelle.getMonth();
    const moisEntree = dateDebut.getMonth();
    
    if (moisEntree > moisActuel || 
        (moisEntree === moisActuel && dateDebut.getDate() > dateActuelle.getDate())) {
      return diffAnnees - 1;
    }
    
    return diffAnnees;
  };
  
  // Function to handle form submission and calculate results
  const onSubmit = (data: z.infer<typeof simulateurSchema>) => {
    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Calculer les résultats
        const resultats = calculerSimulation(data);
        setResultats(resultats);
      } catch (error) {
        console.error("Erreur de calcul:", error);
        toast.error("Une erreur est survenue lors du calcul.");
      } finally {
        setIsCalculating(false);
      }
    }, 1000);
  };

  // Inverser le mode de calcul
  const inverserMode = () => {
    const currentMode = form.getValues("typeSalaire");
    form.setValue("typeSalaire", currentMode === "brut" ? "net" : "brut");
  };
  
  // Sauvegarder la simulation
  const sauvegarderSimulation = () => {
    if (!resultats) return;
    
    const parametres = form.getValues();
    const nom = parametres.nom || `Simulation ${savedSimulations.length + 1}`;
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const id = `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const nouvelle: SavedSimulation = {
      id,
      date,
      nom,
      resultats,
      parametres
    };
    
    setSavedSimulations([...savedSimulations, nouvelle]);
    toast.success("Simulation sauvegardée avec succès");
  };
  
  // Exporter en PDF
  const exporterPDF = () => {
    toast.info("Fonctionnalité d'export PDF sera bientôt disponible");
  };
  
  // Supprimer une simulation
  const supprimerSimulation = (id: string) => {
    setSavedSimulations(savedSimulations.filter(sim => sim.id !== id));
    setSelectedSimulations(selectedSimulations.filter(sim => sim.id !== id));
    toast.success("Simulation supprimée");
  };
  
  // Sélectionner une simulation pour comparaison
  const toggleSelectSimulation = (id: string) => {
    const simulation = savedSimulations.find(sim => sim.id === id);
    if (!simulation) return;
    
    const isAlreadySelected = selectedSimulations.some(sim => sim.id === id);
    
    if (isAlreadySelected) {
      setSelectedSimulations(selectedSimulations.filter(sim => sim.id !== id));
    } else {
      // Limite de 3 simulations pour comparaison
      if (selectedSimulations.length >= 3) {
        toast.error("Vous ne pouvez comparer que 3 simulations maximum");
        return;
      }
      setSelectedSimulations([...selectedSimulations, simulation]);
    }
  };
  
  // Calculer le pourcentage de différence
  const calculateDifference = (value1: number, value2: number): string => {
    if (value1 === 0 && value2 === 0) return "+0%";
    if (value1 === 0) return "+∞%";
    
    const diff = ((value2 - value1) / Math.abs(value1)) * 100;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}%`;
  };
  
  // Charger une simulation dans le formulaire
  const chargerSimulation = (simulation: SavedSimulation) => {
    form.reset(simulation.parametres);
    setResultats(simulation.resultats);
    setActiveTab("simulateur");
    toast.success("Simulation chargée");
  };
  
  // Fonction principale de calcul de simulation
  const calculerSimulation = (data: z.infer<typeof simulateurSchema>): ResultatSimulation => {
    const alertes: string[] = [];
    
    // Déterminer le salaire brut ou calculer à partir du net
    let salaireBrut: number;
    
    if (data.typeSalaire === "brut") {
      salaireBrut = data.salaireBase;
    } else {
      // Calcul approximatif du brut à partir du net souhaité
      // Ceci est une approximation qui sera raffinée par itérations
      const tauxCotisationsApprox = 0.18; // ~18% de cotisations moyennes
      salaireBrut = data.salaireBase / (1 - tauxCotisationsApprox);
      
      // Itérations pour affiner le calcul brut => net
      for (let i = 0; i < 5; i++) { // 5 itérations maximum
        const resultatTest = calculerNetAPartirDuBrut(
          salaireBrut, 
          data.primeFixe,
          data.primeExceptionnelle,
          data.avantagesNature,
          data.anciennete,
          data.activerCNSS,
          data.activerAMO,
          data.activerCIMR,
          data.tauxCIMREmploye,
          data.situationFamiliale,
          data.nombreEnfants,
          data.exonerationIR
        );
        
        const ecart = resultatTest.salaireNet - data.salaireBase;
        
        // Si l'écart est inférieur à 1 MAD, on considère le calcul comme assez précis
        if (Math.abs(ecart) < 1) break;
        
        // Ajuster le brut en fonction de l'écart constaté
        salaireBrut = salaireBrut - ecart * 0.85; // Facteur d'ajustement
      }
    }
    
    // Ajouter prime d'ancienneté si applicable
    let primeAnciennete = 0;
    if (data.anciennete >= 2) {
      const tauxAnciennete = Math.min(data.anciennete * 0.5, 20); // Max 20%
      primeAnciennete = salaireBrut * tauxAnciennete / 100;
    }
    
    // Total des primes et avantages
    const totalPrimes = data.primeFixe + data.primeExceptionnelle;
    const totalAvantages = data.avantagesNature;
    
    // Calcul du brut imposable
    const brutImposable = salaireBrut + primeAnciennete + totalPrimes + totalAvantages;
    
    // Cotisations employé
    let cnssEmploye = 0;
    if (data.activerCNSS) {
      const baseCNSS = Math.min(brutImposable, taux.cnss.plafond);
      cnssEmploye = baseCNSS * taux.cnss.employe / 100;
    }
    
    let amoEmploye = 0;
    if (data.activerAMO) {
      amoEmploye = brutImposable * taux.amo.employe / 100;
    }
    
    let cimrEmploye = 0;
    if (data.activerCIMR) {
      cimrEmploye = brutImposable * data.tauxCIMREmploye / 100;
    }
    
    // Calcul du revenu net imposable
    const revenuNetImposable = brutImposable - cnssEmploye - amoEmploye - cimrEmploye;
    
    // Calcul de l'IR (simplifié)
    let ir = 0;
    
    if (!data.exonerationIR) {
      // Abattement pour charges de famille
      const abattementFamilial = data.situationFamiliale === "marie" ? 
                                 taux.abattementFamilial.marie / 12 : 0;
      const abattementEnfants = Math.min(data.nombreEnfants, 6) * taux.abattementFamilial.enfant / 12;
      
      // Trouver la tranche d'IR applicable
      const trancheIR = taux.ir.find(tranche => 
        revenuNetImposable > tranche.min && 
        (tranche.max === null || revenuNetImposable <= tranche.max)
      );
      
      if (trancheIR) {
        ir = (revenuNetImposable * trancheIR.taux / 100) - trancheIR.sommeDeduire - abattementFamilial - abattementEnfants;
        ir = Math.max(0, ir); // L'IR ne peut pas être négatif
      }
    }
    
    // Salaire net
    const salaireNet = revenuNetImposable - ir;
    
    // Cotisations employeur
    let cnssEmployeur = 0;
    if (data.activerCNSS) {
      const baseCNSS = Math.min(brutImposable, taux.cnss.plafond);
      cnssEmployeur = baseCNSS * taux.cnss.employeur / 100;
    }
    
    let amoEmployeur = 0;
    if (data.activerAMO) {
      amoEmployeur = brutImposable * taux.amo.employeur / 100;
    }
    
    let cimrEmployeur = 0;
    if (data.activerCIMR) {
      cimrEmployeur = brutImposable * data.tauxCIMREmployeur / 100;
    }
    
    const taxeFormation = brutImposable * 1.88 / 100; // Taxe de formation professionnelle à 1.88%
    
    // Coût total employeur
    const coutTotal = brutImposable + cnssEmployeur + amoEmployeur + cimrEmployeur + taxeFormation;
    
    // Vérifier les seuils et générer des alertes
    if (data.primeExceptionnelle > 0) {
      // Vérifier si la prime fait changer de tranche IR
      const revenuSansPrime = brutImposable - data.primeExceptionnelle - cnssEmploye - amoEmploye - cimrEmploye;
      const trancheSansPrime = taux.ir.find(tranche => 
        revenuSansPrime > tranche.min && 
        (tranche.max === null || revenuSansPrime <= tranche.max)
      );
      
      const trancheAvecPrime = taux.ir.find(tranche => 
        revenuNetImposable > tranche.min && 
        (tranche.max === null || revenuNetImposable <= tranche.max)
      );
      
      if (trancheSansPrime && trancheAvecPrime && trancheSansPrime.taux < trancheAvecPrime.taux) {
        alertes.push(`La prime exceptionnelle de ${data.primeExceptionnelle.toLocaleString()} MAD fait passer l'employé à une tranche IR supérieure (${trancheSansPrime.taux}% → ${trancheAvecPrime.taux}%).`);
      }
    }
    
    // Alerte sur le coût employeur élevé
    const pourcentageCout = ((coutTotal - brutImposable) / brutImposable) * 100;
    if (pourcentageCout > 22) {
      alertes.push(`Le coût employeur représente +${Math.round(pourcentageCout)}% du salaire brut. Envisagez des avantages non imposables pour optimiser ce coût.`);
    }
    
    // Résultats finaux (arrondis à 2 décimales)
    return {
      salaireBrut: Math.round(salaireBrut * 100) / 100,
      totalAvantages: Math.round((totalPrimes + totalAvantages) * 100) / 100,
      brutImposable: Math.round(brutImposable * 100) / 100,
      salaireNetImposable: Math.round(revenuNetImposable * 100) / 100,
      salaireNet: Math.round(salaireNet * 100) / 100,
      cotisationsEmploye: {
        cnss: Math.round(cnssEmploye * 100) / 100,
        amo: Math.round(amoEmploye * 100) / 100,
        cimr: Math.round(cimrEmploye * 100) / 100,
        ir: Math.round(ir * 100) / 100,
        total: Math.round((cnssEmploye + amoEmploye + cimrEmploye + ir) * 100) / 100,
      },
      cotisationsEmployeur: {
        cnss: Math.round(cnssEmployeur * 100) / 100,
        amo: Math.round(amoEmployeur * 100) / 100,
        cimr: Math.round(cimrEmployeur * 100) / 100,
        taxeFormation: Math.round(taxeFormation * 100) / 100,
        total: Math.round((cnssEmployeur + amoEmployeur + cimrEmployeur + taxeFormation) * 100) / 100,
      },
      coutTotal: Math.round(coutTotal * 100) / 100,
      alertes
    };
  };
  
  // Fonction utilitaire pour calculer le net à partir du brut (pour itération du calcul inverse)
  const calculerNetAPartirDuBrut = (
    salaireBrut: number,
    primeFixe: number,
    primeExceptionnelle: number,
    avantagesNature: number,
    anciennete: number,
    activerCNSS: boolean,
    activerAMO: boolean,
    activerCIMR: boolean,
    tauxCIMREmploye: number,
    situationFamiliale: string,
    nombreEnfants: number,
    exonerationIR: boolean
  ): { salaireNet: number } => {
    // Ajouter prime d'ancienneté si applicable
    let primeAnciennete = 0;
    if (anciennete >= 2) {
      const tauxAnciennete = Math.min(anciennete * 0.5, 20); // Max 20%
      primeAnciennete = salaireBrut * tauxAnciennete / 100;
    }
    
    // Brut imposable
    const brutImposable = salaireBrut + primeAnciennete + primeFixe + primeExceptionnelle + avantagesNature;
    
    // Cotisations employé
    let cnssEmploye = 0;
    if (activerCNSS) {
      const baseCNSS = Math.min(brutImposable, taux.cnss.plafond);
      cnssEmploye = baseCNSS * taux.cnss.employe / 100;
    }
    
    let amoEmploye = 0;
    if (activerAMO) {
      amoEmploye = brutImposable * taux.amo.employe / 100;
    }
    
    let cimrEmploye = 0;
    if (activerCIMR) {
      cimrEmploye = brutImposable * tauxCIMREmploye / 100;
    }
    
    // Revenu net imposable
    const revenuNetImposable = brutImposable - cnssEmploye - amoEmploye - cimrEmploye;
    
    // Calcul de l'IR
    let ir = 0;
    
    if (!exonerationIR) {
      // Abattement pour charges de famille
      const abattementFamilial = situationFamiliale === "marie" ? 
                                 taux.abattementFamilial.marie / 12 : 0;
      const abattementEnfants = Math.min(nombreEnfants, 6) * taux.abattementFamilial.enfant / 12;
      
      // Trouver la tranche d'IR applicable
      const trancheIR = taux.ir.find(tranche => 
        revenuNetImposable > tranche.min && 
        (tranche.max === null || revenuNetImposable <= tranche.max)
      );
      
      if (trancheIR) {
        ir = (revenuNetImposable * trancheIR.taux / 100) - trancheIR.sommeDeduire - abattementFamilial - abattementEnfants;
        ir = Math.max(0, ir); // L'IR ne peut pas être négatif
      }
    }
    
    // Salaire net
    const salaireNet = revenuNetImposable - ir;
    
    return { salaireNet };
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="simulateur" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Simulateur
          </TabsTrigger>
          <TabsTrigger value="simulations" className="flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            Simulations sauvegardées
          </TabsTrigger>
          <TabsTrigger value="comparaison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Comparaison
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="simulateur">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Simulateur de paie
              </CardTitle>
              <CardDescription>
                Simulez le coût total et le salaire net en fonction des paramètres légaux marocains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Mode de calcul: {form.watch("typeSalaire") === "brut" ? "Brut → Net" : "Net → Brut"}</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={inverserMode}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Inverser le mode
                    </Button>
                  </div>
                  
                  {/* Informations employé */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Informations employé</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="nom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom (optionnel)</FormLabel>
                            <FormControl>
                              <Input placeholder="Nom de l'employé" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="situationFamiliale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Situation familiale</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez la situation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="celibataire">Célibataire</SelectItem>
                                <SelectItem value="marie">Marié(e)</SelectItem>
                                <SelectItem value="divorce">Divorcé(e)</SelectItem>
                                <SelectItem value="veuf">Veuf(ve)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nombreEnfants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre d'enfants à charge</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="statut"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le statut" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="permanent">Permanent</SelectItem>
                                <SelectItem value="temporaire">Temporaire</SelectItem>
                                <SelectItem value="stagiaire">Stagiaire</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dateEntree"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date d'entrée</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormDescription>
                              Pour calculer l'ancienneté
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="anciennete"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ancienneté (années)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Prime applicable après 2 ans
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Salaire et primes */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Salaire et avantages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="salaireBase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch("typeSalaire") === "brut" 
                                ? "Salaire brut (MAD)" 
                                : "Salaire net souhaité (MAD)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
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
                        name="typeContrat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de contrat</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cdi">CDI</SelectItem>
                                <SelectItem value="cdd">CDD</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="interim">Intérim</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="primeFixe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prime fixe mensuelle (MAD)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <FormField
                        control={form.control}
                        name="primeExceptionnelle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prime exceptionnelle (MAD)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Prime ponctuelle ou variable
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="avantagesNature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Avantages en nature (MAD)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>
                              Voiture, logement, mutuelle, etc.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Paramètres sociaux et fiscaux */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Paramètres sociaux et fiscaux</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="zoneTravail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zone de travail</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez la zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="zone1">Zone A (grandes villes)</SelectItem>
                                <SelectItem value="zone2">Zone B (villes moyennes)</SelectItem>
                                <SelectItem value="zone3">Zone C (autres localités)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="secteurActivite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Secteur d'activité</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez le secteur" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="prive">Secteur privé</SelectItem>
                                <SelectItem value="public">Secteur public</SelectItem>
                                <SelectItem value="semi_public">Semi-public</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="activerCNSS"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Cotisations CNSS</FormLabel>
                                  <FormDescription>
                                    Taux salarial: {taux.cnss.employe}% / Patronal: {taux.cnss.employeur}%
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <FormField
                            control={form.control}
                            name="activerAMO"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Cotisations AMO</FormLabel>
                                  <FormDescription>
                                    Taux salarial: {taux.amo.employe}% / Patronal: {taux.amo.employeur}%
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <FormField
                          control={form.control}
                          name="activerCIMR"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mb-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Cotisations CIMR</FormLabel>
                                <FormDescription>
                                  Régime complémentaire de retraite
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("activerCIMR") && (
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <FormField
                              control={form.control}
                              name="tauxCIMREmploye"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Taux salarial CIMR (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
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
                              name="tauxCIMREmployeur"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Taux patronal CIMR (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="exonerationIR"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Exonération IR</FormLabel>
                              <FormDescription>
                                Exonération pour premier emploi (max 36 mois)
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("exonerationIR") && (
                        <div className="ml-7 mt-2">
                          <FormField
                            control={form.control}
                            name="periodeExonerationIR"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Période d'exonération (mois)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={36}
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isCalculating}
                  >
                    {isCalculating ? "Calcul en cours..." : "Calculer"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          {resultats && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Résultats de la simulation
                </CardTitle>
                <CardDescription>
                  Détail du coût employeur et du salaire net selon les paramètres 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Alertes IA */}
                {resultats.alertes.length > 0 && (
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-amber-700">
                      <AlertTriangle size={18} />
                      <h3 className="font-medium">Analyse IA</h3>
                    </div>
                    <ul className="space-y-2">
                      {resultats.alertes.map((alerte, index) => (
                        <li key={index} className="text-sm text-amber-700 flex items-start gap-2">
                          <span>•</span>
                          <span>{alerte}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              
                {/* Résumé */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Salaire brut</div>
                    <div className="text-2xl font-bold">{resultats.salaireBrut.toLocaleString()} MAD</div>
                    {resultats.totalAvantages > 0 && (
                      <div className="text-sm text-muted-foreground">
                        + {resultats.totalAvantages.toLocaleString()} MAD (primes/avantages)
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Salaire net</div>
                    <div className="text-2xl font-bold text-green-600">{resultats.salaireNet.toLocaleString()} MAD</div>
                    <div className="text-sm text-muted-foreground">
                      Net imposable: {resultats.salaireNetImposable.toLocaleString()} MAD
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Coût total employeur</div>
                    <div className="text-2xl font-bold text-blue-600">{resultats.coutTotal.toLocaleString()} MAD</div>
                    <div className="text-sm text-muted-foreground">
                      +{(((resultats.coutTotal - resultats.brutImposable) / resultats.brutImposable) * 100).toFixed(2)}% du brut
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Cotisations salariales</h3>
                    <div className="space-y-4">
                      {resultats.cotisationsEmploye.cnss > 0 && (
                        <div className="flex justify-between">
                          <span>CNSS ({taux.cnss.employe}%)</span>
                          <span>{resultats.cotisationsEmploye.cnss.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      {resultats.cotisationsEmploye.amo > 0 && (
                        <div className="flex justify-between">
                          <span>AMO ({taux.amo.employe}%)</span>
                          <span>{resultats.cotisationsEmploye.amo.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      {resultats.cotisationsEmploye.cimr > 0 && (
                        <div className="flex justify-between">
                          <span>CIMR ({form.getValues("tauxCIMREmploye")}%)</span>
                          <span>{resultats.cotisationsEmploye.cimr.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Impôt sur le Revenu (IR)</span>
                        <span>{resultats.cotisationsEmploye.ir.toLocaleString()} MAD</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold">
                        <span>Total des retenues</span>
                        <span>{resultats.cotisationsEmploye.total.toLocaleString()} MAD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Charges patronales</h3>
                    <div className="space-y-4">
                      {resultats.cotisationsEmployeur.cnss > 0 && (
                        <div className="flex justify-between">
                          <span>CNSS ({taux.cnss.employeur}%)</span>
                          <span>{resultats.cotisationsEmployeur.cnss.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      {resultats.cotisationsEmployeur.amo > 0 && (
                        <div className="flex justify-between">
                          <span>AMO ({taux.amo.employeur}%)</span>
                          <span>{resultats.cotisationsEmployeur.amo.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      {resultats.cotisationsEmployeur.cimr > 0 && (
                        <div className="flex justify-between">
                          <span>CIMR ({form.getValues("tauxCIMREmployeur")}%)</span>
                          <span>{resultats.cotisationsEmployeur.cimr.toLocaleString()} MAD</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Taxe de formation professionnelle (1.88%)</span>
                        <span>{resultats.cotisationsEmployeur.taxeFormation.toLocaleString()} MAD</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold">
                        <span>Total des charges patronales</span>
                        <span>{resultats.cotisationsEmployeur.total.toLocaleString()} MAD</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Barème IR appliqué (2025)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Tranche mensuelle (MAD)</th>
                          <th className="text-right p-2">Taux</th>
                          <th className="text-right p-2">Somme à déduire (MAD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {taux.ir.map((tranche, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">
                              {tranche.min.toLocaleString()} à {tranche.max ? tranche.max.toLocaleString() : '∞'}
                            </td>
                            <td className="text-right p-2">{tranche.taux}%</td>
                            <td className="text-right p-2">{tranche.sommeDeduire.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={sauvegarderSimulation}>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={exporterPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter en PDF
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground italic">
                  Simulateur conforme au barème 2025 - Résultats indicatifs à des fins de simulation
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="simulations">
          <Card>
            <CardHeader>
              <CardTitle>Simulations sauvegardées</CardTitle>
              <CardDescription>
                Consultez vos simulations précédentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedSimulations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucune simulation sauvegardée</p>
                  <p className="text-sm mt-2">
                    Utilisez le bouton "Sauvegarder" après une simulation pour l'enregistrer ici
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedSimulations.map((sim, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{sim.nom}</h3>
                        <span className="text-sm text-muted-foreground">{sim.date}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Brut</span>
                          <div>{sim.resultats.salaireBrut.toLocaleString()} MAD</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Net</span>
                          <div className="text-green-600">{sim.resultats.salaireNet.toLocaleString()} MAD</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Coût employeur</span>
                          <div className="text-blue-600">{sim.resultats.coutTotal.toLocaleString()} MAD</div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleSelectSimulation(sim.id)}
                          className={selectedSimulations.some(s => s.id === sim.id) ? "bg-primary-50 text-primary" : ""}
                        >
                          {selectedSimulations.some(s => s.id === sim.id) ? "Désélectionner" : "Sélectionner pour comparer"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => chargerSimulation(sim)}
                        >
                          Charger
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => supprimerSimulation(sim.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedSimulations.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      {selectedSimulations.length} simulation{selectedSimulations.length > 1 ? "s" : ""} sélectionnée{selectedSimulations.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab("comparaison")}
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Comparer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparaison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Comparaison de scénarios
              </CardTitle>
              <CardDescription>
                Comparez jusqu'à 3 simulations différentes côte à côte
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSimulations.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-muted rounded-full p-6">
                      <BarChart3 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium">Aucune simulation sélectionnée</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Pour comparer des scénarios, créez d'abord plusieurs simulations puis sélectionnez-les dans l'onglet "Simulations sauvegardées"
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setActiveTab("simulations")}
                  >
                    Aller aux simulations sauvegardées
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Comparaison de {selectedSimulations.length} scénario{selectedSimulations.length > 1 ? "s" : ""}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={showDifferences}
                          onCheckedChange={setShowDifferences}
                          id="differences"
                        />
                        <label htmlFor="differences" className="text-sm cursor-pointer">
                          Afficher les différences en %
                        </label>
                      </div>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={exporterPDF}
                      >
                        <FileText className="h-4 w-4" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tableau de comparaison */}
                  <div className="overflow-x-auto">
                    <table className="w-full rounded-md overflow-hidden">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-3 font-medium text-sm text-muted-foreground">Critère</th>
                          {selectedSimulations.map((sim, index) => (
                            <th key={index} className="text-center p-3 font-medium">
                              <div className="flex flex-col items-center">
                                <span className="text-sm">{sim.nom}</span>
                                {index > 0 && showDifferences && (
                                  <span className="text-xs text-muted-foreground">
                                    vs. Sim {index}
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Données employé */}
                        <tr className="border-b">
                          <td colSpan={selectedSimulations.length + 1} className="p-2 bg-muted/50">
                            <span className="font-medium">Données employé</span>
                          </td>
                        </tr>
                        {/* Situation familiale */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Situation familiale</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center text-sm">
                              {(() => {
                                switch (sim.parametres.situationFamiliale) {
                                  case 'celibataire': return 'Célibataire';
                                  case 'marie': return 'Marié(e)';
                                  case 'divorce': return 'Divorcé(e)';
                                  case 'veuf': return 'Veuf(ve)';
                                  default: return sim.parametres.situationFamiliale;
                                }
                              })()}
                            </td>
                          ))}
                        </tr>
                        {/* Ancienneté */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Ancienneté (années)</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center text-sm">
                              {sim.parametres.anciennete}
                            </td>
                          ))}
                        </tr>

                        {/* Salaire */}
                        <tr className="border-b">
                          <td colSpan={selectedSimulations.length + 1} className="p-2 bg-muted/50">
                            <span className="font-medium">Salaire et avantages</span>
                          </td>
                        </tr>
                        {/* Salaire base */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Salaire de base</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span className="font-medium">
                                {sim.parametres.salaireBase.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].parametres.salaireBase,
                                    sim.parametres.salaireBase
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Type de contrat */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Type de contrat</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center text-sm">
                              {sim.parametres.typeContrat.toUpperCase()}
                            </td>
                          ))}
                        </tr>
                        {/* Prime fixe */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Prime fixe</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span>{sim.parametres.primeFixe.toLocaleString()} MAD</span>
                              {index > 0 && showDifferences && sim.parametres.primeFixe > 0 && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].parametres.primeFixe || 1,
                                    sim.parametres.primeFixe
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        
                        {/* Résultats */}
                        <tr className="border-b">
                          <td colSpan={selectedSimulations.length + 1} className="p-2 bg-muted/50">
                            <span className="font-medium">Résultats</span>
                          </td>
                        </tr>
                        {/* Salaire brut */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Salaire brut total</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span className="font-medium">
                                {sim.resultats.brutImposable.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.brutImposable,
                                    sim.resultats.brutImposable
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Cotisations salariales */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Cotisations salariales</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span>
                                {(sim.resultats.cotisationsEmploye.total - sim.resultats.cotisationsEmploye.ir).toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.cotisationsEmploye.total - selectedSimulations[0].resultats.cotisationsEmploye.ir,
                                    sim.resultats.cotisationsEmploye.total - sim.resultats.cotisationsEmploye.ir
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* IR */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Impôt sur le revenu (IR)</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span>
                                {sim.resultats.cotisationsEmploye.ir.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && sim.resultats.cotisationsEmploye.ir > 0 && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.cotisationsEmploye.ir || 1,
                                    sim.resultats.cotisationsEmploye.ir
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Salaire net */}
                        <tr className="border-b bg-primary/5">
                          <td className="p-3 text-sm font-medium">Salaire net</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span className="font-medium text-green-600">
                                {sim.resultats.salaireNet.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.salaireNet,
                                    sim.resultats.salaireNet
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Charges patronales */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Charges patronales</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span>
                                {sim.resultats.cotisationsEmployeur.total.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.cotisationsEmployeur.total,
                                    sim.resultats.cotisationsEmployeur.total
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Coût total employeur */}
                        <tr className="border-b bg-primary/5">
                          <td className="p-3 text-sm font-medium">Coût total employeur</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span className="font-medium text-blue-600">
                                {sim.resultats.coutTotal.toLocaleString()} MAD
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.coutTotal,
                                    sim.resultats.coutTotal
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Ratio coût/net */}
                        <tr className="border-b">
                          <td className="p-3 text-sm">Ratio coût/net</td>
                          {selectedSimulations.map((sim, index) => (
                            <td key={index} className="p-3 text-center">
                              <span>
                                {(sim.resultats.coutTotal / sim.resultats.salaireNet).toFixed(2)}
                              </span>
                              {index > 0 && showDifferences && (
                                <div className="text-xs mt-1">
                                  {calculateDifference(
                                    selectedSimulations[0].resultats.coutTotal / selectedSimulations[0].resultats.salaireNet,
                                    sim.resultats.coutTotal / sim.resultats.salaireNet
                                  )}
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Analyse comparative */}
                  {selectedSimulations.length > 1 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Analyse comparative</h3>
                      
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Scénario le plus avantageux pour l'employé</p>
                            <p className="text-sm text-muted-foreground">
                              {(() => {
                                const bestForEmployee = [...selectedSimulations].sort((a, b) => 
                                  b.resultats.salaireNet - a.resultats.salaireNet
                                )[0];
                                return `${bestForEmployee.nom} avec un salaire net de ${bestForEmployee.resultats.salaireNet.toLocaleString()} MAD`;
                              })()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Scénario le plus économique pour l'employeur</p>
                            <p className="text-sm text-muted-foreground">
                              {(() => {
                                const cheapestForEmployer = [...selectedSimulations].sort((a, b) => 
                                  a.resultats.coutTotal - b.resultats.coutTotal
                                )[0];
                                return `${cheapestForEmployer.nom} avec un coût total de ${cheapestForEmployer.resultats.coutTotal.toLocaleString()} MAD`;
                              })()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                          <div>
                            <p className="font-medium">Meilleur ratio coût/net</p>
                            <p className="text-sm text-muted-foreground">
                              {(() => {
                                const bestRatio = [...selectedSimulations].sort((a, b) => 
                                  (a.resultats.coutTotal / a.resultats.salaireNet) - 
                                  (b.resultats.coutTotal / b.resultats.salaireNet)
                                )[0];
                                return `${bestRatio.nom} avec un ratio de ${(bestRatio.resultats.coutTotal / bestRatio.resultats.salaireNet).toFixed(2)}`;
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("simulations")}
                className="flex items-center gap-2"
              >
                Retour aux simulations
              </Button>
              <p className="text-xs text-muted-foreground italic">
                Comparaison basée sur les simulations sélectionnées
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimulateurPaie;
