
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Employe, ContractType, EmployeStatus } from "@/pages/GestionEmployes";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EmployeFiltersProps {
  employes: Employe[];
  onFilterChange: (filtered: Employe[]) => void;
}

const EmployeFilters = ({ employes, onFilterChange }: EmployeFiltersProps) => {
  // État pour les filtres sélectionnés
  const [departements, setDepartements] = useState<string[]>([]);
  const [selectedDepartements, setSelectedDepartements] = useState<string[]>([]);
  
  const [typeContrats, setTypeContrats] = useState<string[]>([]);
  const [selectedTypeContrats, setSelectedTypeContrats] = useState<string[]>([]);
  
  const [statuts, setStatuts] = useState<string[]>([]);
  const [selectedStatuts, setSelectedStatuts] = useState<string[]>([]);

  // Récupérer les options de filtres disponibles
  useEffect(() => {
    const deps = [...new Set(employes.map(e => e.departement))];
    setDepartements(deps);
    
    const types = [...new Set(employes.map(e => e.typeContrat))];
    setTypeContrats(types);
    
    const stats = [...new Set(employes.map(e => e.status))];
    setStatuts(stats);
  }, [employes]);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...employes];
    
    if (selectedDepartements.length > 0) {
      filtered = filtered.filter(e => selectedDepartements.includes(e.departement));
    }
    
    if (selectedTypeContrats.length > 0) {
      filtered = filtered.filter(e => selectedTypeContrats.includes(e.typeContrat));
    }
    
    if (selectedStatuts.length > 0) {
      filtered = filtered.filter(e => selectedStatuts.includes(e.status));
    }
    
    onFilterChange(filtered);
  }, [selectedDepartements, selectedTypeContrats, selectedStatuts, employes, onFilterChange]);

  // Gérer la sélection de département
  const handleDepartementChange = (departement: string) => {
    setSelectedDepartements(prev => {
      if (prev.includes(departement)) {
        return prev.filter(d => d !== departement);
      } else {
        return [...prev, departement];
      }
    });
  };

  // Gérer la sélection de type de contrat
  const handleTypeContratChange = (type: string) => {
    setSelectedTypeContrats(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Gérer la sélection de statut
  const handleStatutChange = (statut: string) => {
    setSelectedStatuts(prev => {
      if (prev.includes(statut)) {
        return prev.filter(s => s !== statut);
      } else {
        return [...prev, statut];
      }
    });
  };

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setSelectedDepartements([]);
    setSelectedTypeContrats([]);
    setSelectedStatuts([]);
  };

  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filtres</h3>
        <Button 
          variant="ghost" 
          onClick={handleResetFilters}
          className="h-8 text-sm"
        >
          Réinitialiser
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filtres par département */}
        <div className="space-y-2">
          <h4 className="font-medium">Département</h4>
          <div className="space-y-2">
            {departements.map((departement) => (
              <div className="flex items-center space-x-2" key={departement}>
                <Checkbox 
                  id={`dep-${departement}`} 
                  checked={selectedDepartements.includes(departement)} 
                  onCheckedChange={() => handleDepartementChange(departement)}
                />
                <Label 
                  htmlFor={`dep-${departement}`}
                  className="text-sm cursor-pointer"
                >
                  {departement}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filtres par type de contrat */}
        <div className="space-y-2">
          <h4 className="font-medium">Type de contrat</h4>
          <div className="space-y-2">
            {typeContrats.map((type) => (
              <div className="flex items-center space-x-2" key={type}>
                <Checkbox 
                  id={`type-${type}`} 
                  checked={selectedTypeContrats.includes(type)} 
                  onCheckedChange={() => handleTypeContratChange(type)}
                />
                <Label 
                  htmlFor={`type-${type}`}
                  className="text-sm cursor-pointer"
                >
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filtres par statut */}
        <div className="space-y-2">
          <h4 className="font-medium">Statut</h4>
          <div className="space-y-2">
            {statuts.map((statut) => (
              <div className="flex items-center space-x-2" key={statut}>
                <Checkbox 
                  id={`statut-${statut}`} 
                  checked={selectedStatuts.includes(statut)} 
                  onCheckedChange={() => handleStatutChange(statut)}
                />
                <Label 
                  htmlFor={`statut-${statut}`}
                  className="text-sm cursor-pointer"
                >
                  {statut}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeFilters;
