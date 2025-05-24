
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Search, 
  UserPlus, 
  Download, 
  Filter, 
  X 
} from "lucide-react";

import { Employe, ContractType, EmployeStatus } from "@/pages/GestionEmployes";

interface EmployeListTabProps {
  employes: Employe[];
  filteredEmployes: Employe[];
  onFilterChange: (filtered: Employe[]) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeListTab: React.FC<EmployeListTabProps> = ({
  employes,
  filteredEmployes,
  onFilterChange,
  onView,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<EmployeStatus | null>(null);
  const [contractFilter, setContractFilter] = useState<ContractType | null>(null);
  const [activeFilters, setActiveFilters] = useState(0);

  const departments = Array.from(new Set(employes.map(e => e.departement))).sort();

  useEffect(() => {
    let filtered = [...employes];
    
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.poste.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (departmentFilter) {
      filtered = filtered.filter(e => e.departement === departmentFilter);
    }
    
    if (statusFilter) {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    
    if (contractFilter) {
      filtered = filtered.filter(e => e.typeContrat === contractFilter);
    }
    
    let count = 0;
    if (searchTerm) count++;
    if (departmentFilter) count++;
    if (statusFilter) count++;
    if (contractFilter) count++;
    setActiveFilters(count);
    
    onFilterChange(filtered);
  }, [employes, searchTerm, departmentFilter, statusFilter, contractFilter, onFilterChange]);

  const resetFilters = () => {
    setSearchTerm("");
    setDepartmentFilter(null);
    setStatusFilter(null);
    setContractFilter(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Actif":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Actif</Badge>;
      case "Inactif":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Inactif</Badge>;
      case "Période d'essai":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Période d'essai</Badge>;
      case "Démissionné":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Démissionné</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getContractBadge = (type: string) => {
    switch (type) {
      case "CDI":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">CDI</Badge>;
      case "CDD":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">CDD</Badge>;
      case "Intérim":
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Intérim</Badge>;
      case "Freelance":
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Freelance</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle>Liste des employés</CardTitle>
            <CardDescription>
              {filteredEmployes.length} employé{filteredEmployes.length !== 1 ? 's' : ''} trouvé{filteredEmployes.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un employé..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={departmentFilter || ""} onValueChange={(value) => setDepartmentFilter(value || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_departments">Tous les départements</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value as EmployeStatus || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">Tous les statuts</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="Période d'essai">Période d'essai</SelectItem>
                  <SelectItem value="Démissionné">Démissionné</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={contractFilter || ""} onValueChange={(value) => setContractFilter(value as ContractType || null)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de contrat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_contracts">Tous les contrats</SelectItem>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Intérim">Intérim</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              
              {activeFilters > 0 && (
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1"
                  onClick={resetFilters}
                >
                  <X className="h-4 w-4" />
                  Réinitialiser ({activeFilters})
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Type de contrat</TableHead>
                <TableHead>Date d'embauche</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun employé trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployes.map((employe) => (
                  <TableRow key={employe.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {employe.avatar ? (
                            <AvatarImage src={employe.avatar} alt={`${employe.prenom} ${employe.nom}`} />
                          ) : (
                            <AvatarFallback>{employe.prenom[0]}{employe.nom[0]}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{employe.prenom} {employe.nom}</div>
                          <div className="text-sm text-muted-foreground">{employe.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employe.poste}</TableCell>
                    <TableCell>{employe.departement}</TableCell>
                    <TableCell>{getStatusBadge(employe.status)}</TableCell>
                    <TableCell>{getContractBadge(employe.typeContrat)}</TableCell>
                    <TableCell>{formatDate(employe.dateEmbauche)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onView(employe.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(employe.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDelete(employe.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
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

export default EmployeListTab;
