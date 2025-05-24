
import React, { useState } from "react";
import { 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  FileCheck, 
  Search,
  ArrowUpDown,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DemandeConge } from "@/types/conges";
import { toast } from "sonner";

// Données de démonstration pour les demandes de congés
const mockDemandes: DemandeConge[] = [
  {
    id: "1",
    employeId: "1",
    employeNom: "Mohammed Alami",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2024-08-01",
    dateFin: "2024-08-15",
    nombreJours: 10,
    statut: "validee",
    dateCreation: "2024-06-15T10:30:00",
    commentaire: "Vacances d'été"
  },
  {
    id: "2",
    employeId: "2",
    employeNom: "Salma Benani",
    typeCongeId: "2",
    typeCongeNom: "Congé Maladie",
    dateDebut: "2024-06-10",
    dateFin: "2024-06-15",
    nombreJours: 5,
    statut: "validee",
    dateCreation: "2024-06-08T08:15:00",
    justificatifUrl: "/documents/certificat-123.pdf",
    validationManagerId: "3",
    validationManagerDate: "2024-06-08T14:20:00"
  },
  {
    id: "3",
    employeId: "3",
    employeNom: "Ahmed Radi",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2024-07-05",
    dateFin: "2024-07-12",
    nombreJours: 6,
    statut: "en_attente",
    dateCreation: "2024-06-20T11:45:00",
    commentaire: "Voyage familial"
  },
  {
    id: "4",
    employeId: "4",
    employeNom: "Fatima El Masri",
    typeCongeId: "5",
    typeCongeNom: "Congé Mariage",
    dateDebut: "2024-09-10",
    dateFin: "2024-09-14",
    nombreJours: 4,
    statut: "validee",
    dateCreation: "2024-06-05T09:20:00",
    validationManagerId: "3",
    validationManagerDate: "2024-06-06T10:15:00",
    validationRHId: "1",
    validationRHDate: "2024-06-06T15:30:00"
  },
  {
    id: "5",
    employeId: "5",
    employeNom: "Youssef Taleb",
    typeCongeId: "1",
    typeCongeNom: "Congés annuels",
    dateDebut: "2024-07-20",
    dateFin: "2024-08-03",
    nombreJours: 10,
    statut: "refusee",
    dateCreation: "2024-06-18T14:10:00",
    commentaire: "Période haute activité, demande refusée",
    validationManagerId: "3",
    validationManagerDate: "2024-06-19T11:25:00"
  }
];

const DemandesConges = () => {
  const [demandes, setDemandes] = useState<DemandeConge[]>(mockDemandes);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDemandes = demandes.filter(demande => 
    demande.employeNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.typeCongeNom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'validee':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Validée</Badge>;
      case 'refusee':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Refusée</Badge>;
      case 'annulee':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  const handleValidate = (id: string) => {
    setDemandes(demandes.map(demande => 
      demande.id === id 
        ? {...demande, statut: 'validee', validationRHDate: new Date().toISOString()} 
        : demande
    ));
    toast.success("Demande validée avec succès");
  };
  
  const handleReject = (id: string) => {
    setDemandes(demandes.map(demande => 
      demande.id === id 
        ? {...demande, statut: 'refusee', validationRHDate: new Date().toISOString()} 
        : demande
    ));
    toast.success("Demande refusée");
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
          <div>
            <CardTitle>Demandes de congés</CardTitle>
            <CardDescription>
              Gérez et suivez les demandes de congés et d'absences des employés
            </CardDescription>
          </div>
          <Button variant="outline" className="w-full md:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par employé ou type de congé..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              En attente
            </Button>
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Validées
            </Button>
            <Button variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Refusées
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Période
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Jours</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucune demande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredDemandes.map((demande) => (
                  <TableRow key={demande.id}>
                    <TableCell className="font-medium">{demande.employeNom}</TableCell>
                    <TableCell>{demande.typeCongeNom}</TableCell>
                    <TableCell>
                      {formatDate(demande.dateDebut)} - {formatDate(demande.dateFin)}
                    </TableCell>
                    <TableCell>{demande.nombreJours}</TableCell>
                    <TableCell>{getStatusBadge(demande.statut)}</TableCell>
                    <TableCell>
                      {demande.justificatifUrl ? (
                        <Button variant="ghost" size="sm">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {demande.statut === 'en_attente' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-green-500"
                              onClick={() => handleValidate(demande.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => handleReject(demande.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemandesConges;
