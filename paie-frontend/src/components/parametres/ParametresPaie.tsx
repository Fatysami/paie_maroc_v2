
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Clock, 
  Calendar, 
  Percent, 
  DollarSign, 
  FileText, 
  Clock4
} from "lucide-react";

// Import des sous-composants
import ParametresLegaux from "./paie/ParametresLegaux";
import ParametresPrimesIndemnites from "./paie/ParametresPrimesIndemnites";
import ParametresHeuresSupplementaires from "./paie/ParametresHeuresSupplementaires";
import ParametresPaiement from "./paie/ParametresPaiement";
import BaremeIREditeur, { TrancheIR } from "./paie/BaremeIREditeur";
import ParametresCIMR from "./paie/ParametresCIMR";
import { Prime } from "./paie/ParametresPrimesIndemnites";

const ParametresPaie = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fonction pour mettre à jour la date de dernière modification
  const updateLastModified = () => {
    setLastUpdated(new Date());
  };

  const handleExport = () => {
    toast.info("Fonctionnalité à venir : exportation des paramètres en PDF ou Excel");
  };

  // Gestionnaires d'événements pour chaque sous-composant
  const handleUpdateLegalParameters = (values: any) => {
    console.log("Paramètres légaux mis à jour:", values);
    updateLastModified();
  };

  const handleUpdatePrimes = (primes: Prime[]) => {
    console.log("Primes mises à jour:", primes);
    updateLastModified();
  };

  const handleUpdateOvertime = (values: any) => {
    console.log("Paramètres d'heures supplémentaires mis à jour:", values);
    updateLastModified();
  };

  const handleUpdatePayment = (values: any) => {
    console.log("Paramètres de paiement mis à jour:", values);
    updateLastModified();
  };

  const handleUpdateBaremeIR = (tranches: TrancheIR[]) => {
    console.log("Barème IR mis à jour:", tranches);
    updateLastModified();
  };

  const handleUpdateCIMR = (values: any) => {
    console.log("Paramètres CIMR mis à jour:", values);
    updateLastModified();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Règles de paie</CardTitle>
        <CardDescription>
          Configurez les paramètres liés au calcul de la paie et des taxes selon la législation marocaine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="legal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Paramètres légaux</span>
            </TabsTrigger>
            <TabsTrigger value="primes" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden md:inline">Primes</span>
            </TabsTrigger>
            <TabsTrigger value="overtime" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden md:inline">Heures sup.</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Paiement</span>
            </TabsTrigger>
            <TabsTrigger value="bareme" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden md:inline">Barème IR</span>
            </TabsTrigger>
            <TabsTrigger value="cimr" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden md:inline">CIMR</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="legal">
            <ParametresLegaux onUpdate={handleUpdateLegalParameters} />
          </TabsContent>

          <TabsContent value="primes">
            <ParametresPrimesIndemnites onUpdate={handleUpdatePrimes} />
          </TabsContent>

          <TabsContent value="overtime">
            <ParametresHeuresSupplementaires onUpdate={handleUpdateOvertime} />
          </TabsContent>

          <TabsContent value="payment">
            <ParametresPaiement onUpdate={handleUpdatePayment} />
          </TabsContent>

          <TabsContent value="bareme">
            <BaremeIREditeur onUpdate={handleUpdateBaremeIR} />
          </TabsContent>

          <TabsContent value="cimr">
            <ParametresCIMR onUpdate={handleUpdateCIMR} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock4 className="h-4 w-4 mr-2" />
          <span>Dernière mise à jour: {lastUpdated.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <Button variant="outline" onClick={handleExport}>
          Exporter en PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParametresPaie;
