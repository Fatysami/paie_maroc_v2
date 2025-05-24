
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileDown, BarChart3, BellRing, Settings } from "lucide-react";
import AdminAbsencesList from "./AdminAbsencesList";
import AdminAjoutAbsenceForm from "./AdminAjoutAbsenceForm";
import StatistiquesAbsences from "./StatistiquesAbsences";
import AlertesAbsences from "./AlertesAbsences";
import ParametrageAbsencesForm from "./ParametrageAbsencesForm";
import { Absence } from "@/types/absences";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import ContratInfoCard from "../ContratInfoCard";

const generateMockAbsences = (): Absence[] => {
  const absences: Absence[] = [
    {
      id: uuidv4(),
      employeId: "1",
      employeNom: "Mohamed El Alaoui",
      dateDebut: "2024-03-10",
      dateFin: "2024-03-12",
      nombreJours: 3,
      typeAbsence: "maladie",
      statut: "validee",
      motif: "Grippe avec fièvre",
      justificatifRequis: true,
      justificatifUrl: "/path/to/certificat_medical.pdf",
      dateDeclaration: "2024-03-10T08:30:00",
      declarePar: "employe",
      validationManagerId: "manager123",
      validationManagerDate: "2024-03-10T14:22:00",
      validationRHId: "rh456",
      validationRHDate: "2024-03-10T16:45:00",
      impact: {
        remunere: true,
        tauxRemuneration: 100,
        cnss: true,
        amo: true
      },
      commentaireRH: "Justificatif médical valide reçu"
    },
    {
      id: uuidv4(),
      employeId: "2",
      employeNom: "Salma Benjelloun",
      dateDebut: "2024-02-05",
      dateFin: "2024-02-05",
      nombreJours: 1,
      typeAbsence: "absence_injustifiee",
      statut: "validee",
      motif: "Problème personnel",
      justificatifRequis: false,
      dateDeclaration: "2024-02-06T09:15:00",
      declarePar: "employe",
      validationManagerId: "manager123",
      validationManagerDate: "2024-02-06T10:30:00",
      impact: {
        remunere: false,
        cnss: false,
        amo: false,
        retenueSalaire: 500
      }
    },
    {
      id: uuidv4(),
      employeId: "3",
      employeNom: "Karim Lahmidi",
      dateDebut: "2024-04-18",
      dateFin: "2024-04-19",
      nombreJours: 2,
      typeAbsence: "absence_exceptionnelle",
      statut: "en_attente",
      motif: "Décès dans la famille",
      justificatifRequis: true,
      justificatifUrl: "/path/to/acte_deces.pdf",
      dateDeclaration: "2024-04-17T18:05:00",
      declarePar: "employe",
      impact: {
        remunere: true,
        cnss: false,
        amo: false
      }
    },
    {
      id: uuidv4(),
      employeId: "1",
      employeNom: "Mohamed El Alaoui",
      dateDebut: "2024-01-22",
      dateFin: "2024-01-22",
      nombreJours: 1,
      typeAbsence: "retard",
      heureDebut: "08:30",
      heureFin: "10:45",
      statut: "refusee",
      motif: "Embouteillages",
      justificatifRequis: false,
      dateDeclaration: "2024-01-22T11:00:00",
      declarePar: "employe",
      validationManagerId: "manager123",
      validationManagerDate: "2024-01-22T15:10:00",
      impact: {
        remunere: false,
        cnss: false,
        amo: false,
        retenueSalaire: 150
      },
      motifRefus: "Retard répétitif sans justification valable"
    },
    {
      id: uuidv4(),
      employeId: "2",
      employeNom: "Salma Benjelloun",
      dateDebut: "2024-05-10",
      dateFin: "2024-05-12",
      nombreJours: 3,
      typeAbsence: "absence_sans_solde",
      statut: "regularisee",
      motif: "Raisons personnelles",
      justificatifRequis: true,
      dateDeclaration: "2024-05-08T09:30:00",
      declarePar: "employe",
      validationManagerId: "manager123",
      validationManagerDate: "2024-05-08T14:00:00",
      validationRHId: "rh456",
      validationRHDate: "2024-05-09T11:20:00",
      impact: {
        remunere: false,
        cnss: false,
        amo: false,
        retenueSalaire: 1500
      },
      commentaireRH: "Converti en congé sans solde à la demande de l'employé"
    },
    {
      id: uuidv4(),
      employeId: "3",
      employeNom: "Karim Lahmidi",
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: new Date().toISOString().split('T')[0],
      nombreJours: 1,
      typeAbsence: "maladie",
      statut: "en_attente",
      motif: "Consultation médicale urgente",
      justificatifRequis: true,
      dateDeclaration: new Date().toISOString(),
      declarePar: "employe",
      impact: {
        remunere: true,
        cnss: true,
        amo: true
      }
    },
    {
      id: uuidv4(),
      employeId: "1",
      employeNom: "Mohamed El Alaoui",
      dateDebut: "2024-04-05",
      dateFin: "2024-04-05",
      nombreJours: 1,
      typeAbsence: "retard",
      heureDebut: "09:00",
      heureFin: "10:30",
      statut: "en_attente",
      motif: "Problème de transport",
      justificatifRequis: false,
      dateDeclaration: "2024-04-05T10:35:00",
      declarePar: "employe",
      impact: {
        remunere: false,
        cnss: false,
        amo: false,
        retenueSalaire: 100
      }
    }
  ];
  
  return absences;
};

interface AdminAbsencesTabProps {
  isAdmin?: boolean;
  employeData?: {
    poste: string;
    departement: string;
    salaireBase: number;
    dateEmbauche?: string;
    typeContrat: string;
    adresse?: string;
    situationFamiliale?: string;
    manager?: string;
  };
}

const AdminAbsencesTab: React.FC<AdminAbsencesTabProps> = ({ 
  isAdmin = true,
  employeData = {
    poste: "Développeur Front-End",
    departement: "Développement",
    salaireBase: 15000,
    dateEmbauche: "2022-01-15",
    typeContrat: "CDI",
    adresse: "123 Rue de Casablanca, Casablanca, Maroc, 20000",
    situationFamiliale: "Marié(e), 2 enfants",
    manager: "Karim Tazi"
  }
}) => {
  const [activeTab, setActiveTab] = useState("gestion");
  const [absences, setAbsences] = useState<Absence[]>(generateMockAbsences());
  const [ajoutAbsenceOuvert, setAjoutAbsenceOuvert] = useState(false);
  const [isEditContratDialogOpen, setIsEditContratDialogOpen] = useState(false);
  
  const handleAjouterAbsence = () => {
    setAjoutAbsenceOuvert(true);
  };

  const handleExportAbsences = () => {
    toast.info("Exportation des absences en cours...");
    // Dans l'implémentation réelle, déclenchez l'exportation ici
  };

  const handleValiderAbsence = (absence: Absence) => {
    // Dans l'implémentation réelle, envoyez une requête à l'API
    setAbsences(absences.map(abs => 
      abs.id === absence.id 
        ? { 
            ...abs, 
            statut: "validee", 
            validationRHId: "rh456", 
            validationRHDate: new Date().toISOString() 
          } 
        : abs
    ));
  };

  const handleRefuserAbsence = (absence: Absence, motif: string) => {
    // Dans l'implémentation réelle, envoyez une requête à l'API
    setAbsences(absences.map(abs => 
      abs.id === absence.id 
        ? { 
            ...abs, 
            statut: "refusee", 
            motifRefus: motif,
            validationRHId: "rh456", 
            validationRHDate: new Date().toISOString() 
          } 
        : abs
    ));
  };

  const handleRegulariserAbsence = (absence: Absence, type: string, commentaire: string) => {
    // Dans l'implémentation réelle, envoyez une requête à l'API
    setAbsences(absences.map(abs => 
      abs.id === absence.id 
        ? { 
            ...abs, 
            statut: "regularisee", 
            commentaireRH: commentaire,
            validationRHId: "rh456", 
            validationRHDate: new Date().toISOString() 
          } 
        : abs
    ));
  };

  const handleAjoutAbsenceSuccess = () => {
    setAjoutAbsenceOuvert(false);
    // Dans l'implémentation réelle, rechargez les absences depuis l'API
    toast.success("Absence ajoutée avec succès");
  };

  const handleEditContrat = () => {
    setIsEditContratDialogOpen(true);
    // In a real implementation, this would open a dialog to edit contract info
    toast.info("Cette fonctionnalité serait intégrée avec le formulaire de modification du contrat");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Gestion des Absences</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportAbsences}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleAjouterAbsence} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter manuellement
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="gestion" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Gestion</span>
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="alertes" className="flex items-center gap-1.5">
            <BellRing className="h-4 w-4" />
            <span>Alertes</span>
          </TabsTrigger>
          <TabsTrigger value="parametres" className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gestion" className="mt-4">
          {isAdmin && (
            <ContratInfoCard
              poste={employeData.poste}
              departement={employeData.departement}
              salaireBase={employeData.salaireBase}
              dateEmbauche={employeData.dateEmbauche}
              typeContrat={employeData.typeContrat}
              adresse={employeData.adresse}
              situationFamiliale={employeData.situationFamiliale}
              manager={employeData.manager}
              onEditClick={handleEditContrat}
            />
          )}
          <AdminAbsencesList 
            absences={absences}
            onValider={handleValiderAbsence}
            onRefuser={handleRefuserAbsence}
            onRegulariser={handleRegulariserAbsence}
            onAjouterAbsence={handleAjouterAbsence}
          />
        </TabsContent>

        <TabsContent value="statistiques" className="mt-4">
          <StatistiquesAbsences />
        </TabsContent>

        <TabsContent value="alertes" className="mt-4">
          <AlertesAbsences />
        </TabsContent>

        <TabsContent value="parametres" className="mt-4">
          <ParametrageAbsencesForm />
        </TabsContent>
      </Tabs>

      {ajoutAbsenceOuvert && (
        <AdminAjoutAbsenceForm 
          open={ajoutAbsenceOuvert}
          onSuccess={handleAjoutAbsenceSuccess}
          onCancel={() => setAjoutAbsenceOuvert(false)}
        />
      )}
    </div>
  );
};

export default AdminAbsencesTab;
