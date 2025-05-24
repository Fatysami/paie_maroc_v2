import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  FileDown, 
  CalendarCheck, 
  CalendarMinus,
  Bell,
  Upload,
  Info
} from "lucide-react";
import { fr } from "date-fns/locale";
import { format, addDays, isSameDay, isFuture } from "date-fns";
import CongesCalendrierShared, { CongeEmploye } from "@/components/shared/conges/CongesCalendrierShared";
import { toast } from "sonner";
import NouvelleDemandeForm from "@/components/conges/NouvelleDemandeForm";
import DeclarationAbsenceForm from "@/components/conges/DeclarationAbsenceForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CongesTabProps {
  employeId: string;
  employeNom?: string;
}

const CongesTab: React.FC<CongesTabProps> = ({ employeId, employeNom }) => {
  const [nouveauCongeOpen, setNouveauCongeOpen] = useState(false);
  const [declarationAbsenceOpen, setDeclarationAbsenceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("mon-solde");
  
  const congesData: CongeEmploye[] = [
    {
      id: "1",
      type: "Congés payés",
      dateDebut: new Date(2024, 5, 1),
      dateFin: new Date(2024, 5, 15),
      statut: "validé",
      nombreJours: 10,
      commentaire: "Congés d'été"
    },
    {
      id: "2",
      type: "Maladie",
      dateDebut: new Date(2024, 2, 10),
      dateFin: new Date(2024, 2, 12),
      statut: "validé",
      nombreJours: 3,
      commentaire: "Certificat médical fourni"
    },
    {
      id: "3",
      type: "Congés exceptionnels",
      dateDebut: new Date(2024, 7, 5),
      dateFin: new Date(2024, 7, 7),
      statut: "en attente",
      nombreJours: 3
    },
    {
      id: "4",
      type: "Congés sans solde",
      dateDebut: new Date(2024, 4, 20),
      dateFin: new Date(2024, 4, 22),
      statut: "refusé",
      nombreJours: 3,
      commentaire: "Refusé pour raisons de service"
    },
    {
      id: "5",
      type: "RTT",
      dateDebut: new Date(2024, 8, 12),
      dateFin: new Date(2024, 8, 12),
      statut: "validé",
      nombreJours: 1
    },
    {
      id: "6",
      type: "Formation",
      dateDebut: new Date(2024, 3, 15),
      dateFin: new Date(2024, 3, 19),
      statut: "validé",
      nombreJours: 5,
      commentaire: "Formation développement personnel"
    },
    {
      id: "7",
      type: "Congés payés",
      dateDebut: addDays(new Date(), 5),
      dateFin: addDays(new Date(), 10),
      statut: "validé",
      nombreJours: 6,
      commentaire: "Congés planifiés"
    },
    {
      id: "8",
      type: "Repos compensateur",
      dateDebut: addDays(new Date(), 15),
      dateFin: addDays(new Date(), 16),
      statut: "en attente",
      nombreJours: 2,
      commentaire: "En attente de validation"
    },
    {
      id: "9", 
      type: "Maladie",
      dateDebut: new Date(),
      dateFin: addDays(new Date(), 1),
      statut: "validé",
      nombreJours: 2,
      commentaire: "Maladie en cours"
    }
  ];
  
  const congesPris = congesData
    .filter(conge => conge.statut === "validé")
    .reduce((total, conge) => total + conge.nombreJours, 0);
    
  const congesEnAttente = congesData
    .filter(conge => conge.statut === "en attente")
    .reduce((total, conge) => total + conge.nombreJours, 0);
  
  const soldeCongesTotalAnnuel = 26;
  const soldeCongesRestant = soldeCongesTotalAnnuel - congesPris;

  const exportConges = () => {
    toast.info("Export des congés en cours...");
  };

  const ajouterConge = () => {
    setNouveauCongeOpen(true);
  };
  
  const declarerAbsence = () => {
    setDeclarationAbsenceOpen(true);
  };

  const renderStatutBadge = (statut: string) => {
    switch (statut) {
      case 'validé':
        return <Badge variant="outline" className="bg-green-100 text-green-800 font-medium">Validé</Badge>;
      case 'en attente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 font-medium">En attente</Badge>;
      case 'refusé':
        return <Badge variant="outline" className="bg-red-100 text-red-800 font-medium">Refusé</Badge>;
      case 'annulé':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Congés et Absences</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportConges}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="mon-solde" className="flex items-center gap-2 text-sm">
            <CalendarCheck className="h-4 w-4" />
            Mon solde
          </TabsTrigger>
          <TabsTrigger value="mes-demandes" className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Mes demandes
          </TabsTrigger>
          <TabsTrigger value="declarer" className="flex items-center gap-2 text-sm">
            <Upload className="h-4 w-4" />
            Déclarer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mon-solde">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <CalendarCheck className="h-5 w-5" />
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
                  <CalendarMinus className="h-5 w-5" />
                  <span className="font-medium">Demandes en attente</span>
                </div>
                <div className="text-3xl font-bold text-amber-600">{congesEnAttente} jours</div>
                <p className="text-sm text-gray-600">
                  sur {congesData.filter(c => c.statut === "en attente").length} demande(s)
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Calendrier des congés</h3>
              <CongesCalendrierShared 
                congesData={congesData} 
                employeNom={employeNom} 
              />
            </CardContent>
          </Card>
          
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Les absences non justifiées ou les congés sans solde peuvent avoir un impact sur votre paie. Consultez le service RH pour plus d'informations.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="mes-demandes">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Historique de mes demandes</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Jours</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Commentaire</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {congesData.map((conge) => (
                    <TableRow key={conge.id}>
                      <TableCell className="font-medium">{conge.type}</TableCell>
                      <TableCell>
                        {format(conge.dateDebut, "dd/MM/yyyy")} - {format(conge.dateFin, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{conge.nombreJours}</TableCell>
                      <TableCell>{renderStatutBadge(conge.statut)}</TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        {conge.commentaire || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declarer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-all cursor-pointer" onClick={ajouterConge}>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Demander un congé</h3>
                <p className="text-gray-600 max-w-sm">
                  Planifiez vos congés payés, RTT ou autres absences à l'avance
                </p>
                <Button className="mt-4">Faire une demande</Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all cursor-pointer" onClick={declarerAbsence}>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-60">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Déclarer une absence</h3>
                <p className="text-gray-600 max-w-sm">
                  Signalez une absence imprévue (maladie, événement familial...)
                </p>
                <Button variant="outline" className="mt-4">Déclarer</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <NouvelleDemandeForm 
        open={nouveauCongeOpen} 
        onOpenChange={setNouveauCongeOpen}
        employeId={employeId}
        employeNom={employeNom}
      />
      
      <DeclarationAbsenceForm
        open={declarationAbsenceOpen}
        onOpenChange={setDeclarationAbsenceOpen}
        employeId={employeId}
        employeNom={employeNom}
      />
    </div>
  );
};

export default CongesTab;
