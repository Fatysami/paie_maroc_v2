import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeListTab from "@/components/employes/tabs/EmployeListTab";
import EmployePageHeader from "@/components/employes/EmployePageHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import AddEmployeForm from "@/components/employes/AddEmployeForm";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Adresse } from "@/components/employes/EmployeAdresseForm";
import AnalyticsTab from "@/components/employes/tabs/AnalyticsTab";
import AlertsTab from "@/components/employes/tabs/AlertsTab";
import { useEmployes } from "@/hooks/useEmployes";

export type ContractType = "CDI" | "CDD" | "Intérim" | "Freelance" | "Stage";
export type EmployeStatus = "Actif" | "Inactif" | "Période d'essai" | "Démissionné";
export type ModePaiement = "Virement bancaire" | "Chèque" | "Espèces";
export type PrimeType = "fixe" | "pourcentage" | "ponctuelle";
export type PrimeFrequence = "mensuelle" | "trimestrielle" | "annuelle" | "ponctuelle" | "unique";
export type AvantageType = "voiture" | "logement" | "telephone" | "ordinateur" | "repas" | "transport" | "autre";
export type BaseCalcul = "Salaire de base" | "Salaire brut" | "Salaire net";

export type PrimeVariableBase = BaseCalcul;

export interface Prime {
  id: string;
  nom: string;
  montant: number;
  type: PrimeType;
  frequence: PrimeFrequence;
  details?: string;
  description?: string;
}

export interface Retenue {
  id: string;
  nom: string;
  montant: number;
  type: "fixe" | "pourcentage";
  obligatoire: boolean;
  details?: string;
}

export interface Avantage {
  id: string;
  nom: string;
  type: AvantageType;
  valeur: number;
  description?: string;
}

export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  cin: string;
  email: string;
  telephone: string;
  adresse: Adresse;
  dateEmbauche: string;
  dateFinContrat?: string;
  poste: string;
  departement: string;
  typeContrat: ContractType;
  salaire: number;
  salaireBase: number;
  status: EmployeStatus;
  dureeContrat?: number;
  situationFamiliale?: string;
  competences?: string[];
  certifications?: string[];
  diplomes?: string[];
  evaluationScore?: number;
  risqueTurnover?: string;
  manager?: string;
  primes?: Prime[];
  avantages?: Avantage[];
  documents?: {
    contratSigne: boolean;
    cin: boolean;
    rib: boolean;
    [key: string]: boolean;
  };
  numeroCnss?: string;
  affiliationCnssAmo?: boolean;
  affiliationCimr?: boolean;
  tauxCimr?: number;
  modePaiement?: ModePaiement;
  rib?: string;
  banque?: string;
  evaluations?: any[];
  avatar?: string;
  retenues?: Retenue[];
  periodeEssaiDebut?: string;
  periodeEssaiFin?: string;
  heuresTravailHebdo?: number;
  primesFixes?: Prime[];
  primesVariables?: Prime[];
}

const mockEmployes: Employe[] = [
  {
    id: "1",
    nom: "El Alaoui",
    prenom: "Mohamed",
    matricule: "EMP001",
    cin: "AB123456",
    email: "mohamed.elalaoui@example.com",
    telephone: "0612345678",
    adresse: {
      rue: "123 Rue des Fleurs",
      ville: "Casablanca",
      pays: "Maroc",
      codePostal: "20000"
    },
    dateEmbauche: "2021-05-15",
    poste: "Développeur Frontend",
    departement: "Technologie",
    typeContrat: "CDI",
    salaire: 12000,
    salaireBase: 10000,
    status: "Actif",
    evaluationScore: 85
  },
  {
    id: "2",
    nom: "Benjelloun",
    prenom: "Amina",
    matricule: "EMP002",
    cin: "CD789012",
    email: "amina.benjelloun@example.com",
    telephone: "0623456789",
    adresse: {
      rue: "45 Avenue Hassan II",
      ville: "Rabat",
      pays: "Maroc",
      codePostal: "10000"
    },
    dateEmbauche: "2022-01-10",
    poste: "Responsable Marketing",
    departement: "Marketing",
    typeContrat: "CDI",
    salaire: 15000,
    salaireBase: 13000,
    status: "Actif",
    evaluationScore: 90
  },
  {
    id: "3",
    nom: "Bouazza",
    prenom: "Karim",
    matricule: "EMP003",
    cin: "EF345678",
    email: "karim.bouazza@example.com",
    telephone: "0634567890",
    adresse: {
      rue: "78 Rue Al Bahar",
      ville: "Tanger",
      pays: "Maroc",
      codePostal: "90000"
    },
    dateEmbauche: "2022-07-20",
    dateFinContrat: "2023-01-20",
    poste: "Comptable Junior",
    departement: "Finance",
    typeContrat: "CDD",
    salaire: 8000,
    salaireBase: 7000,
    status: "Démissionné",
    dureeContrat: 6,
    evaluationScore: 75
  },
  {
    id: "4",
    nom: "Chraibi",
    prenom: "Fatima",
    matricule: "EMP004",
    cin: "GH901234",
    email: "fatima.chraibi@example.com",
    telephone: "0645678901",
    adresse: {
      rue: "12 Boulevard Mohammed V",
      ville: "Marrakech",
      pays: "Maroc",
      codePostal: "40000"
    },
    dateEmbauche: "2021-11-05",
    poste: "Assistante RH",
    departement: "Ressources Humaines",
    typeContrat: "CDI",
    salaire: 9000,
    salaireBase: 8000,
    status: "Période d'essai",
    periodeEssaiDebut: "2021-11-05",
    periodeEssaiFin: "2022-02-05",
    evaluationScore: 82
  },
  {
    id: "5",
    nom: "Tazi",
    prenom: "Youssef",
    matricule: "EMP005",
    cin: "IJ567890",
    email: "youssef.tazi@example.com",
    telephone: "0656789012",
    adresse: {
      rue: "56 Rue des Orangers",
      ville: "Fès",
      pays: "Maroc",
      codePostal: "30000"
    },
    dateEmbauche: "2020-03-15",
    poste: "Ingénieur Logiciel",
    departement: "Technologie",
    typeContrat: "CDI",
    salaire: 14000,
    salaireBase: 12000,
    status: "Actif",
    evaluationScore: 88
  }
];

const GestionEmployes: React.FC = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("liste");
  const [filteredEmployes, setFilteredEmployes] = useState<Employe[]>([]);
  
  // Utilisation du hook personnalisé pour les employés
  const { 
    employes, 
    isLoading, 
    addEmploye, 
    updateEmploye, 
    deleteEmploye 
  } = useEmployes();
  
  // Mise à jour de la liste filtrée lorsque la liste des employés change
  useEffect(() => {
    setFilteredEmployes(employes);
  }, [employes]);

  const departmentDistribution = [
    { name: "Technologie", count: 2 },
    { name: "Marketing", count: 1 },
    { name: "Finance", count: 1 },
    { name: "Ressources Humaines", count: 1 }
  ];

  const topTalents = mockEmployes
    .filter(emp => emp.evaluationScore && emp.evaluationScore >= 85)
    .sort((a, b) => (b.evaluationScore || 0) - (a.evaluationScore || 0))
    .slice(0, 3);

  const riskDistribution = {
    faible: 3,
    moyen: 1,
    eleve: 1
  };

  const alerts = [
    {
      employee: "Fatima Chraibi",
      type: "Fin de période d'essai",
      date: "Dans 5 jours (10/04/2025)",
      urgent: true
    },
    {
      employee: "Youssef Tazi",
      type: "Entretien annuel",
      date: "Prévu le 15/04/2025",
      urgent: false
    },
    {
      employee: "Karim Bouazza",
      type: "Contrat expiré",
      date: "Depuis le 20/01/2023",
      urgent: true
    },
    {
      employee: "Mohamed El Alaoui",
      type: "Formation requise",
      date: "À planifier avant le 30/04/2025",
      urgent: false
    }
  ];

  const handleFilterChange = (filtered: Employe[]) => {
    setFilteredEmployes(filtered);
  };

  const handleViewEmploye = (id: string) => {
    navigate(`/employe/${id}`);
  };

  const handleEditEmploye = (id: string) => {
    navigate(`/employe/${id}?edit=true`);
  };

  const handleDeleteEmploye = (id: string) => {
    deleteEmploye(id);
  };

  const handleAddEmploye = (newEmploye: Omit<Employe, "id">) => {
    addEmploye(newEmploye);
    setIsAddDialogOpen(false);
  };

  const handleUpdateEmploye = (id: string, updatedEmploye: Partial<Employe>) => {
    updateEmploye({ id, employe: updatedEmploye });
  };

  const handleRequestAIRecommendations = () => {
    toast.info("Génération de recommandations IA en cours...");
    setTimeout(() => {
      toast.success("Recommandations IA générées avec succès");
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EmployePageHeader 
        employeCount={employes.length} 
        onAddDialogOpenChange={setIsAddDialogOpen}
        isAddDialogOpen={isAddDialogOpen}
      />
      
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary"></div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="liste">Liste des employés</TabsTrigger>
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="liste">
              <EmployeListTab
                employes={employes}
                filteredEmployes={filteredEmployes}
                onFilterChange={handleFilterChange}
                onView={handleViewEmploye}
                onEdit={handleEditEmploye}
                onDelete={handleDeleteEmploye}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsTab
                employes={employes}
                topTalents={topTalents}
                departmentDistribution={departmentDistribution}
                riskDistribution={riskDistribution}
                onRequestAIRecommendations={handleRequestAIRecommendations}
              />
            </TabsContent>
            
            <TabsContent value="alerts">
              <AlertsTab alerts={alerts} />
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <AddEmployeForm onSubmit={handleAddEmploye} onCancel={() => setIsAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionEmployes;
