
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, User, ArrowRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ChoixTypeCompte = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"entreprise" | "employe" | null>(null);

  const handleSelection = (type: "entreprise" | "employe") => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      navigate("/inscription", { state: { accountType: selectedType } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4 mt-16">
        <div className="w-full max-w-3xl">
          <Card className="border-blue-primary/20 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold text-blue-primary">Choisissez votre type de compte</CardTitle>
              <p className="text-muted-foreground">
                Sélectionnez le type de compte qui correspond à vos besoins.
              </p>
            </CardHeader>
            <CardContent className="grid gap-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`border rounded-xl p-6 transition-all cursor-pointer hover:border-blue-primary hover:bg-blue-primary/5 
                    ${selectedType === "entreprise" ? "border-blue-primary bg-blue-primary/5 ring-2 ring-blue-primary ring-offset-2" : "border-border"}`}
                  onClick={() => handleSelection("entreprise")}
                >
                  <div className="mb-5">
                    <div className="w-12 h-12 rounded-lg bg-blue-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Entreprise / RH</h3>
                  <p className="text-muted-foreground text-sm">
                    Vous êtes une entreprise ou un responsable RH et souhaitez gérer la paie de vos employés.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Gestion des employés
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Calcul automatique des salaires
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Déclarations fiscales et sociales
                    </li>
                  </ul>
                </div>
                
                <div
                  className={`border rounded-xl p-6 transition-all cursor-pointer hover:border-blue-primary hover:bg-blue-primary/5 
                    ${selectedType === "employe" ? "border-blue-primary bg-blue-primary/5 ring-2 ring-blue-primary ring-offset-2" : "border-border"}`}
                  onClick={() => handleSelection("employe")}
                >
                  <div className="mb-5">
                    <div className="w-12 h-12 rounded-lg bg-blue-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Employé</h3>
                  <p className="text-muted-foreground text-sm">
                    Vous êtes un employé et souhaitez accéder à vos bulletins de paie et informations personnelles.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Accès aux bulletins de paie
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Suivi des congés et absences
                    </li>
                    <li className="flex items-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-blue-primary mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Gestion des informations personnelles
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleContinue}
                className="w-full bg-blue-primary hover:bg-blue-primary/90"
                disabled={!selectedType}
              >
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChoixTypeCompte;
