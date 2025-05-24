
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, FileDown } from "lucide-react";
import DeclarationAbsenceForm from "./DeclarationAbsenceForm";
import ListeAbsencesEmploye from "./ListeAbsencesEmploye";
import { Absence } from "@/types/absences";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Données d'exemple pour la démonstration
const generateMockAbsences = (employeId: string, employeNom: string): Absence[] => {
  const absences: Absence[] = [
    {
      id: uuidv4(),
      employeId,
      employeNom,
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
      employeId,
      employeNom,
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
      employeId,
      employeNom,
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
      employeId,
      employeNom,
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
      employeId,
      employeNom,
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
    }
  ];
  
  return absences;
};

interface AbsencesTabProps {
  employeId: string;
  employeNom: string;
  isAdmin?: boolean;
}

const AbsencesTab: React.FC<AbsencesTabProps> = ({ 
  employeId, 
  employeNom,
  isAdmin = false
}) => {
  const [activeTab, setActiveTab] = useState("liste");
  const [absences, setAbsences] = useState<Absence[]>(generateMockAbsences(employeId, employeNom));
  
  const handleAjouterAbsence = () => {
    setActiveTab("declarer");
  };

  const handleExportAbsences = () => {
    toast.info("Exportation des absences en cours...");
    // Dans l'implémentation réelle, déclenchez l'exportation ici
  };

  const handleAnnulerAbsence = (absenceId: string) => {
    // Dans l'implémentation réelle, envoyez une requête à l'API
    setAbsences(absences.filter(abs => abs.id !== absenceId));
  };

  const handleDeclarationSuccess = () => {
    toast.success("Absence déclarée avec succès");
    setActiveTab("liste");
    // Dans l'implémentation réelle, rechargez les absences depuis l'API
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Absences Non Planifiées</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportAbsences}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleAjouterAbsence} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Déclarer une absence
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="liste">Liste des absences</TabsTrigger>
          <TabsTrigger value="declarer">Déclarer une absence</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-6">
          <ListeAbsencesEmploye 
            employeId={employeId} 
            absences={absences} 
            onAnnuler={handleAnnulerAbsence}
            readOnly={isAdmin}
          />
        </TabsContent>

        <TabsContent value="declarer" className="mt-6">
          <DeclarationAbsenceForm 
            employeId={employeId} 
            employeNom={employeNom} 
            onSuccess={handleDeclarationSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AbsencesTab;
