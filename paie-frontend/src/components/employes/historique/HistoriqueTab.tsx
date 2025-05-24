
import React, { useState, useEffect } from "react";
import { EntreeHistorique, FiltreHistorique, ModificationType } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileDown, RefreshCw, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for testing
const mockHistorique: EntreeHistorique[] = [
  {
    id: "1",
    dateHeure: "2023-10-15T14:30:00",
    utilisateur: "admin@rh.com",
    employeId: "1",
    employeNom: "Mohammed Alami",
    employeMatricule: "EMP001",
    typeModification: "salaire",
    champModifie: "Salaire de base",
    ancienneValeur: "10000",
    nouvelleValeur: "12000",
    commentaire: "Augmentation suite à évaluation annuelle"
  },
  {
    id: "2",
    dateHeure: "2023-10-12T10:15:00",
    utilisateur: "admin@rh.com",
    employeId: "1",
    employeNom: "Mohammed Alami",
    employeMatricule: "EMP001",
    typeModification: "personnel",
    champModifie: "Téléphone",
    ancienneValeur: "0612345678",
    nouvelleValeur: "0612345679",
    commentaire: "Mise à jour demandée par l'employé"
  },
  {
    id: "3",
    dateHeure: "2023-09-05T09:45:00",
    utilisateur: "rh.manager@example.com",
    employeId: "2",
    employeNom: "Salma Benani",
    employeMatricule: "EMP002",
    typeModification: "prime",
    champModifie: "Prime de responsabilité",
    ancienneValeur: "1500",
    nouvelleValeur: "2000",
    commentaire: "Prise de nouvelles responsabilités"
  }
];

export interface HistoriqueTabProps {
  isGlobal: boolean;
  employe?: {
    id: string;
    nom?: string;
    prenom?: string;
    matricule?: string;
  };
}

const HistoriqueTab: React.FC<HistoriqueTabProps> = ({ isGlobal, employe }) => {
  const [entries, setEntries] = useState<EntreeHistorique[]>([]);
  const [filtres, setFiltres] = useState<FiltreHistorique>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      let filteredEntries = [...mockHistorique];
      
      // Filtrer par employé si ce n'est pas la vue globale
      if (!isGlobal && employe?.id) {
        filteredEntries = filteredEntries.filter(entry => entry.employeId === employe.id);
      }
      
      setEntries(filteredEntries);
      setLoading(false);
    }, 1000);
  }, [isGlobal, employe]);

  const handleExportCSV = () => {
    // Implémentation de l'export CSV
    const headers = ["Date", "Utilisateur", "Employé", "Type", "Champ", "Ancienne valeur", "Nouvelle valeur", "Commentaire"];
    
    const csvContent = entries.map(entry => [
      new Date(entry.dateHeure).toLocaleString(),
      entry.utilisateur,
      entry.employeNom || "",
      entry.typeModification,
      entry.champModifie,
      entry.ancienneValeur,
      entry.nouvelleValeur,
      entry.commentaire || ""
    ].join(",")).join("\n");
    
    const csv = [headers.join(","), csvContent].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_${isGlobal ? 'global' : 'employe'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyFilters = () => {
    // Logique de filtrage
    let filteredEntries = [...mockHistorique];
    
    if (!isGlobal && employe?.id) {
      filteredEntries = filteredEntries.filter(entry => entry.employeId === employe.id);
    }
    
    if (filtres.dateDebut) {
      filteredEntries = filteredEntries.filter(
        entry => new Date(entry.dateHeure) >= new Date(filtres.dateDebut || "")
      );
    }
    
    if (filtres.dateFin) {
      filteredEntries = filteredEntries.filter(
        entry => new Date(entry.dateHeure) <= new Date(filtres.dateFin || "")
      );
    }
    
    if (filtres.typeModification) {
      filteredEntries = filteredEntries.filter(
        entry => entry.typeModification === filtres.typeModification
      );
    }
    
    if (filtres.utilisateur) {
      filteredEntries = filteredEntries.filter(
        entry => entry.utilisateur.includes(filtres.utilisateur || "")
      );
    }
    
    if (searchTerm) {
      filteredEntries = filteredEntries.filter(
        entry => 
          entry.champModifie.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.ancienneValeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.nouvelleValeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.commentaire && entry.commentaire.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry.employeNom && entry.employeNom.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setEntries(filteredEntries);
  };

  const resetFilters = () => {
    setFiltres({});
    setSearchTerm("");
    
    let resetEntries = [...mockHistorique];
    if (!isGlobal && employe?.id) {
      resetEntries = resetEntries.filter(entry => entry.employeId === employe.id);
    }
    
    setEntries(resetEntries);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModificationTypeBadge = (type: ModificationType) => {
    switch (type) {
      case 'salaire':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Salaire</Badge>;
      case 'personnel':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Personnel</Badge>;
      case 'professionnel':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Professionnel</Badge>;
      case 'prime':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Prime</Badge>;
      case 'avantage':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Avantage</Badge>;
      case 'contrat':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Contrat</Badge>;
      case 'document':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Document</Badge>;
      case 'affiliation':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Affiliation</Badge>;
      case 'banque':
        return <Badge variant="outline" className="bg-cyan-100 text-cyan-800">Banque</Badge>;
      default:
        return <Badge variant="outline">Autre</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetFilters}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Filtres avancés</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFilters(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date début</label>
                <Input 
                  type="date" 
                  value={filtres.dateDebut || ''} 
                  onChange={(e) => setFiltres({...filtres, dateDebut: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Date fin</label>
                <Input 
                  type="date" 
                  value={filtres.dateFin || ''} 
                  onChange={(e) => setFiltres({...filtres, dateFin: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Type de modification</label>
                <Select 
                  value={filtres.typeModification} 
                  onValueChange={(value) => setFiltres({...filtres, typeModification: value as ModificationType})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personnel">Personnel</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="salaire">Salaire</SelectItem>
                    <SelectItem value="prime">Prime</SelectItem>
                    <SelectItem value="avantage">Avantage</SelectItem>
                    <SelectItem value="contrat">Contrat</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="affiliation">Affiliation</SelectItem>
                    <SelectItem value="banque">Banque</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isGlobal && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Utilisateur</label>
                  <Input 
                    placeholder="Email utilisateur" 
                    value={filtres.utilisateur || ''} 
                    onChange={(e) => setFiltres({...filtres, utilisateur: e.target.value})}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
              <Button onClick={applyFilters}>Appliquer</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun historique trouvé</p>
          <Button variant="outline" onClick={resetFilters}>Réinitialiser les filtres</Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Utilisateur</TableHead>
                {isGlobal && <TableHead>Employé</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Champ</TableHead>
                <TableHead>Ancienne valeur</TableHead>
                <TableHead>Nouvelle valeur</TableHead>
                <TableHead>Commentaire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{formatDate(entry.dateHeure)}</TableCell>
                  <TableCell>{entry.utilisateur}</TableCell>
                  {isGlobal && <TableCell>{entry.employeNom}</TableCell>}
                  <TableCell>{getModificationTypeBadge(entry.typeModification)}</TableCell>
                  <TableCell>{entry.champModifie}</TableCell>
                  <TableCell className="text-red-500">{entry.ancienneValeur}</TableCell>
                  <TableCell className="text-green-500">{entry.nouvelleValeur}</TableCell>
                  <TableCell>{entry.commentaire || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default HistoriqueTab;
