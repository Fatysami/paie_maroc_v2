
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  Settings,
  Check,
  Plus,
  FileX
} from "lucide-react";
import { toast } from "sonner";

import DashboardNavbar from "@/components/DashboardNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TypesCongesListe from "@/components/conges/TypesCongesListe";
import DemandesConges from "@/components/conges/DemandesConges";
import ParametrageConges from "@/components/conges/ParametrageConges";
import NouvelleDemandeForm from "@/components/conges/NouvelleDemandeForm";
import CongesFilters from "@/components/conges/CongesFilters";
import CalendrierConges from "@/components/conges/CalendrierConges";
import AdminAbsencesTab from "@/components/employes/absences/AdminAbsencesTab";
import { generateMockConges } from "@/utils/conges/mockData";

const GestionCongesAbsences = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("conges");
  const [activeTab, setActiveTab] = useState("calendrier");
  const [nouveauCongeOpen, setNouveauCongeOpen] = useState(false);
  const congesData = generateMockConges();
  
  // Mock user data for the navbar
  const mockUser = {
    name: "Mohammed Alami",
    avatar: "/placeholder.svg",
    role: "Administrateur RH",
  };

  // Handle logout function
  const handleLogout = () => {
    navigate("/connexion");
  };

  const handleNouvelleDemandeClick = () => {
    setNouveauCongeOpen(true);
  };

  const handleCongesAction = (action: string, congeId: string) => {
    if (action === "add") {
      setNouveauCongeOpen(true);
    } else if (action === "export") {
      toast.info("Export des congés en cours...");
    }
  };

  const congesPris = congesData
    .filter(conge => conge.statut === "validé")
    .reduce((total, conge) => total + conge.nombreJours, 0);
    
  const congesEnAttente = congesData
    .filter(conge => conge.statut === "en attente")
    .reduce((total, conge) => total + conge.nombreJours, 0);
  
  const soldeCongesTotalAnnuel = 26;
  const soldeCongesRestant = soldeCongesTotalAnnuel - congesPris;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={mockUser} onLogout={handleLogout} />
      
      <main className="container mx-auto py-8 px-4 pt-24">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Congés & Absences</h1>
              <p className="text-muted-foreground mt-2">
                Gérez les demandes de congés, consultez le calendrier et modifiez les paramètres
              </p>
            </div>
            
            <div className="flex gap-2">
              {activeSection === "conges" && (
                <>
                  <CongesFilters />
                  <Button onClick={handleNouvelleDemandeClick} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle demande
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Sélection entre congés et absences */}
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
            <button
              className={`px-6 py-2 rounded-md ${
                activeSection === "conges"
                  ? "bg-white shadow-sm text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setActiveSection("conges")}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Congés</span>
              </div>
            </button>
            <button
              className={`px-6 py-2 rounded-md ${
                activeSection === "absences"
                  ? "bg-white shadow-sm text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-200"
              }`}
              onClick={() => setActiveSection("absences")}
            >
              <div className="flex items-center gap-2">
                <FileX className="h-4 w-4" />
                <span>Absences</span>
              </div>
            </button>
          </div>

          {activeSection === "conges" && (
            <>
              {/* Cartes d'informations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <CalendarIcon className="h-5 w-5" />
                      <span className="font-medium">Solde de congés</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{soldeCongesRestant} jours</div>
                    <p className="text-sm text-gray-600">
                      sur {soldeCongesTotalAnnuel} jours annuels
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Congés pris</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">{congesPris} jours</div>
                    <p className="text-sm text-gray-600">
                      sur l'année en cours
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-amber-700 mb-1">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Demandes en attente</span>
                    </div>
                    <div className="text-3xl font-bold text-amber-600">{congesEnAttente} jours</div>
                    <p className="text-sm text-gray-600">
                      sur {congesData.filter(c => c.statut === "en attente").length} demande(s)
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
                  <TabsTrigger value="calendrier" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Calendrier</span>
                  </TabsTrigger>
                  <TabsTrigger value="demandes" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Demandes</span>
                  </TabsTrigger>
                  <TabsTrigger value="types" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Types de congés</span>
                  </TabsTrigger>
                  <TabsTrigger value="parametres" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="calendrier" className="space-y-4 mt-6">
                  <CalendrierConges />
                </TabsContent>

                <TabsContent value="demandes" className="space-y-4 mt-6">
                  <DemandesConges />
                </TabsContent>

                <TabsContent value="types" className="space-y-4 mt-6">
                  <TypesCongesListe />
                </TabsContent>

                <TabsContent value="parametres" className="space-y-4 mt-6">
                  <ParametrageConges />
                </TabsContent>
              </Tabs>
            </>
          )}
          
          {activeSection === "absences" && (
            <div className="mt-4">
              <AdminAbsencesTab isAdmin={true} />
            </div>
          )}
        </div>
      </main>

      {/* Formulaire de nouvelle demande de congé */}
      <NouvelleDemandeForm 
        open={nouveauCongeOpen} 
        onOpenChange={setNouveauCongeOpen} 
      />
    </div>
  );
};

export default GestionCongesAbsences;
