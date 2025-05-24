
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ReportFiltersProps {
  filters: {
    departement: string;
    statut: string;
    typeContrat: string;
    sexe: string;
  };
  period: {
    debut: Date;
    fin: Date;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onPeriodChange: (newPeriod: { debut: Date; fin: Date }) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  period,
  onFilterChange,
  onPeriodChange
}) => {
  // Liste des départements (à remplacer par des données réelles)
  const departements = [
    { id: "tous", label: "Tous les départements" },
    { id: "rh", label: "Ressources Humaines" },
    { id: "it", label: "IT & Développement" },
    { id: "finance", label: "Finance & Comptabilité" },
    { id: "commercial", label: "Commercial & Ventes" },
    { id: "marketing", label: "Marketing" },
    { id: "operations", label: "Opérations" }
  ];

  // Liste des statuts 
  const statuts = [
    { id: "tous", label: "Tous les statuts" },
    { id: "actif", label: "En activité" },
    { id: "conge", label: "En congé" },
    { id: "suspendu", label: "Contrat suspendu" }
  ];

  // Liste des types de contrat
  const typesContrat = [
    { id: "tous", label: "Tous les contrats" },
    { id: "cdi", label: "CDI" },
    { id: "cdd", label: "CDD" },
    { id: "stage", label: "Stage" },
    { id: "interim", label: "Intérim" }
  ];

  // Format des dates pour l'affichage
  const formatDateRange = () => {
    return `${format(period.debut, "dd MMM yyyy", { locale: fr })} - ${format(period.fin, "dd MMM yyyy", { locale: fr })}`;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Département</label>
            <Select
              value={filters.departement}
              onValueChange={(value) => onFilterChange("departement", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {departements.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Select
              value={filters.statut}
              onValueChange={(value) => onFilterChange("statut", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statuts.map((statut) => (
                  <SelectItem key={statut.id} value={statut.id}>
                    {statut.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de contrat</label>
            <Select
              value={filters.typeContrat}
              onValueChange={(value) => onFilterChange("typeContrat", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {typesContrat.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                  <h3 className="font-medium text-sm">Sélectionner la période</h3>
                </div>
                <div className="grid gap-4 p-4">
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <h4 className="text-xs font-medium">Date de début</h4>
                      <CalendarComponent
                        mode="single"
                        selected={period.debut}
                        onSelect={(date) => {
                          if (date) {
                            onPeriodChange({ ...period, debut: date });
                          }
                        }}
                        disabled={(date) => date > period.fin}
                        initialFocus
                      />
                    </div>
                    <div className="grid gap-1">
                      <h4 className="text-xs font-medium">Date de fin</h4>
                      <CalendarComponent
                        mode="single"
                        selected={period.fin}
                        onSelect={(date) => {
                          if (date) {
                            onPeriodChange({ ...period, fin: date });
                          }
                        }}
                        disabled={(date) => date < period.debut}
                        initialFocus
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
