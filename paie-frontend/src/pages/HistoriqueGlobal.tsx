
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History } from "lucide-react";
import Navbar from "@/components/DashboardNavbar";
import HistoriqueTab from "@/components/employes/historique/HistoriqueTab";
import { toast } from "sonner";

const HistoriqueGlobal = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    console.log("Déconnexion depuis HistoriqueGlobal");
    toast.success("Déconnexion réussie");
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        user={{ 
          name: "Mohammed Alami", 
          avatar: "/placeholder.svg", 
          role: "Administrateur RH" 
        }} 
        onLogout={handleLogout} 
      />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center mb-8">
          <History className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Historique global des modifications</h1>
        </div>
        
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <HistoriqueTab isGlobal={true} />
        </div>
      </main>
    </div>
  );
};

export default HistoriqueGlobal;
