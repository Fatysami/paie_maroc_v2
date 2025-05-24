
import React, { useState } from "react";
import EmployeLayout from "@/components/employe/EmployeLayout";
import CongesTab from "@/components/employes/conges/CongesTab";
import AbsencesTab from "@/components/employes/absences/AbsencesTab";
import { Employe } from "@/pages/GestionEmployes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DemandeConges = () => {
  const [activeTab, setActiveTab] = useState("conges");
  
  // Exemple d'employé avec des données simulées pour la démonstration
  const mockEmploye: Employe = {
    id: "1",
    nom: "El Alaoui",
    prenom: "Mohamed",
    matricule: "EMP-2023-0042",
    salaire: 15000,
    salaireBase: 15000,
    cin: "BE789456",
    email: "m.elalaoui@example.com",
    telephone: "0661234567",
    adresse: {
      rue: "123 Avenue Hassan II",
      ville: "Casablanca",
      pays: "Maroc",
      codePostal: "20000"
    },
    dateEmbauche: "2022-01-15",
    poste: "Développeur Frontend",
    departement: "Informatique",
    typeContrat: "CDI",
    status: "Actif",
    primes: [
      { id: "1", nom: "Prime d'ancienneté", montant: 500, type: "fixe", frequence: "mensuelle" }
    ],
    avantages: [
      { id: "1", nom: "Téléphone mobile", type: "telephone", valeur: 500, description: "iPhone SE" }
    ]
  };

  return (
    <EmployeLayout title="Absences et congés">
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="conges">Congés planifiés</TabsTrigger>
            <TabsTrigger value="absences">Absences non planifiées</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conges" className="mt-6">
            <CongesTab employeId={mockEmploye.id} employeNom={`${mockEmploye.prenom} ${mockEmploye.nom}`} />
          </TabsContent>
          
          <TabsContent value="absences" className="mt-6">
            <AbsencesTab employeId={mockEmploye.id} employeNom={`${mockEmploye.prenom} ${mockEmploye.nom}`} isAdmin={false} />
          </TabsContent>
        </Tabs>
      </div>
    </EmployeLayout>
  );
};

export default DemandeConges;
