
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Calculator, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Puzzle, 
  Bell, 
  HelpCircle, 
  Database,
  BadgePercent
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import ParametresEntreprise from "@/components/parametres/ParametresEntreprise";
import ParametresPaie from "@/components/parametres/ParametresPaie";
import ParametresSecurite from "@/components/parametres/ParametresSecurite";
import ParametresIntegration from "@/components/parametres/ParametresIntegration";
import ParametresNotifications from "@/components/parametres/ParametresNotifications";
import ParametresCongesAbsences from "@/components/parametres/ParametresCongesAbsences";
import ParametresExportsRapports from "@/components/parametres/ParametresExportsRapports";
import ParametresSauvegardeRestauration from "@/components/parametres/ParametresSauvegardeRestauration";
import ParametresAssistanceUtilisateur from "@/components/parametres/ParametresAssistanceUtilisateur";
import SimulateurPaie from "@/components/parametres/paie/SimulateurPaie";

const Parametres = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("entreprise");
  
  // Mock user data for the navbar
  const mockUser = {
    name: "Mohammed Alami",
    avatar: "/placeholder.svg",
    role: "Administrateur RH",
  };

  // Handle logout function
  const handleLogout = () => {
    // Here you would implement the actual logout logic
    navigate("/connexion");
  };

  // Menu items with consistent icons
  const menuItems = [
    { id: "entreprise", label: "Entreprise", icon: <Building2 size={20} className="text-primary" /> },
    { id: "paie", label: "Règles de paie", icon: <Calculator size={20} className="text-primary" /> },
    { id: "conges", label: "Congés & Absences", icon: <Calendar size={20} className="text-primary" /> },
    { id: "exports", label: "Exports & Rapports", icon: <FileText size={20} className="text-primary" /> },
    { id: "securite", label: "Sécurité", icon: <ShieldCheck size={20} className="text-primary" /> },
    { id: "integration", label: "Intégrations", icon: <Puzzle size={20} className="text-primary" /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} className="text-primary" /> },
    { id: "assistance", label: "Assistance Utilisateur", icon: <HelpCircle size={20} className="text-primary" /> },
    { id: "sauvegarde", label: "Sauvegarde & Restauration", icon: <Database size={20} className="text-primary" /> },
    { id: "simulateur", label: "Simulateur de Paie", icon: <BadgePercent size={20} className="text-primary" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={mockUser} onLogout={handleLogout} />
      
      <main className="container mx-auto py-8 px-4 max-w-7xl pt-24">
        <div className="flex flex-col space-y-6">
          <div className="mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground mt-2">
              Configurez les paramètres globaux de votre application
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Vertical Menu - Redesigned */}
            <div className="w-full md:w-72 shrink-0">
              <div className="rounded-xl overflow-hidden shadow-sm">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 p-4 text-left text-sm transition-colors
                      ${
                        activeTab === item.id
                          ? "bg-primary text-white font-medium"
                          : "bg-card hover:bg-secondary/50 text-foreground"
                      }
                      ${item.id !== menuItems[menuItems.length - 1].id ? "border-b border-border/50" : ""}
                    `}
                  >
                    <span className={activeTab === item.id ? "text-white" : ""}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 bg-card rounded-xl shadow-sm overflow-hidden">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="entreprise" className="m-0 p-6">
                  <ParametresEntreprise />
                </TabsContent>
                
                <TabsContent value="paie" className="m-0 p-6">
                  <ParametresPaie />
                </TabsContent>
                
                <TabsContent value="conges" className="m-0 p-6">
                  <ParametresCongesAbsences />
                </TabsContent>
                
                <TabsContent value="exports" className="m-0 p-6">
                  <ParametresExportsRapports />
                </TabsContent>
                
                <TabsContent value="securite" className="m-0 p-6">
                  <ParametresSecurite />
                </TabsContent>
                
                <TabsContent value="integration" className="m-0 p-6">
                  <ParametresIntegration />
                </TabsContent>
                
                <TabsContent value="notifications" className="m-0 p-6">
                  <ParametresNotifications />
                </TabsContent>
                
                <TabsContent value="assistance" className="m-0 p-6">
                  <ParametresAssistanceUtilisateur />
                </TabsContent>
                
                <TabsContent value="sauvegarde" className="m-0 p-6">
                  <ParametresSauvegardeRestauration />
                </TabsContent>
                
                <TabsContent value="simulateur" className="m-0 p-6">
                  <SimulateurPaie />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parametres;
