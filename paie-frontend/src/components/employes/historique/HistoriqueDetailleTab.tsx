
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, History } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Make sure we don't have empty string values for SelectItem components
interface HistoriqueDetailleTabProps {
  isGlobal?: boolean;
  employe?: {
    id: string;
    nom: string;
    prenom: string;
    matricule: string;
  };
}

const HistoriqueDetailleTab: React.FC<HistoriqueDetailleTabProps> = ({
  isGlobal = false,
  employe,
}) => {
  const [typeFiltre, setTypeFiltre] = useState("all");
  const [periodeFiltre, setPeriodeFiltre] = useState("all");

  // Données fictives pour l'historique
  const historiqueData = [
    {
      id: '1',
      date: '2023-06-15T14:30:00',
      type: 'system',
      action: 'Connexion réussie',
      details: 'Connexion depuis 192.168.1.45'
    },
    {
      id: '2',
      date: '2023-06-14T09:15:00',
      type: 'paie',
      action: 'Bulletin généré',
      details: 'Bulletin de paie de mai 2023'
    },
    {
      id: '3',
      date: '2023-06-10T11:20:00',
      type: 'conges',
      action: 'Demande créée',
      details: 'Congés payés du 15/07/2023 au 30/07/2023'
    },
    {
      id: '4',
      date: '2023-06-08T16:45:00',
      type: 'admin',
      action: 'Profil modifié',
      details: 'Mise à jour du numéro de téléphone'
    },
    {
      id: '5',
      date: '2023-05-28T10:30:00',
      type: 'conges',
      action: 'Demande validée',
      details: 'Congés sans solde du 02/06/2023 au 03/06/2023'
    }
  ];

  // Filtrer les données selon le type sélectionné
  const filteredData = historiqueData.filter(item => {
    if (typeFiltre === 'all') return true;
    return item.type === typeFiltre;
  });

  // Rendu des badges selon le type d'événement
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'system':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Système</Badge>;
      case 'paie':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Paie</Badge>;
      case 'conges':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Congés</Badge>;
      case 'admin':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Admin</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-muted-foreground" />
            {isGlobal ? "Historique global" : `Historique de ${employe?.prenom} ${employe?.nom}`}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              defaultValue={typeFiltre}
              onValueChange={setTypeFiltre}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les événements</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="paie">Paie</SelectItem>
                <SelectItem value="conges">Congés</SelectItem>
                <SelectItem value="admin">Administration</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={periodeFiltre}
              onValueChange={setPeriodeFiltre}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              Exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Détails</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
                  <TableCell>{renderTypeBadge(item.type)}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell className="text-muted-foreground">{item.details}</TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Aucun événement trouvé pour ces critères.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoriqueDetailleTab;
