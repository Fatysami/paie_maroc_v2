
import { useState } from "react";
import { PlusCircle, CalendarRange, FilterX } from "lucide-react";
import { Evaluation, EvaluationType } from "./types";
import { EvaluationCard } from "./EvaluationCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EvaluationsListProps {
  evaluations: Evaluation[];
  onCreateEvaluation: () => void;
  onViewEvaluation: (evaluation: Evaluation) => void;
}

export const EvaluationsList = ({ evaluations, onCreateEvaluation, onViewEvaluation }: EvaluationsListProps) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EvaluationType | "toutes">("toutes");
  const [statusFilter, setStatusFilter] = useState<string>("toutes");
  
  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.titre.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "toutes" || evaluation.type === typeFilter;
    const matchesStatus = statusFilter === "toutes" || evaluation.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const resetFilters = () => {
    setSearch("");
    setTypeFilter("toutes");
    setStatusFilter("toutes");
  };
  
  const totalEvaluations = evaluations.length || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">Évaluations</h2>
          <p className="text-muted-foreground text-sm">
            {totalEvaluations} évaluation{totalEvaluations !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={onCreateEvaluation}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nouvelle évaluation
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="col-span-1">
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as EvaluationType | "toutes")}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'évaluation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Tous les types</SelectItem>
                  <SelectItem value="annuelle">Annuelle</SelectItem>
                  <SelectItem value="semestrielle">Semestrielle</SelectItem>
                  <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="période-essai">Période d'essai</SelectItem>
                  <SelectItem value="spéciale">Spéciale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Tous les statuts</SelectItem>
                  <SelectItem value="planifiée">Planifiée</SelectItem>
                  <SelectItem value="en-cours">En cours</SelectItem>
                  <SelectItem value="terminée">Terminée</SelectItem>
                  <SelectItem value="annulée">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(search || typeFilter !== "toutes" || statusFilter !== "toutes") && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {filteredEvaluations.length} résultat{filteredEvaluations.length !== 1 ? "s" : ""}
              </p>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8">
                <FilterX className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {filteredEvaluations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              evaluation={evaluation}
              onView={onViewEvaluation}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <CalendarRange className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune évaluation trouvée</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {evaluations.length > 0 
              ? "Aucune évaluation ne correspond à vos critères de recherche. Essayez d'autres filtres."
              : "Aucune évaluation n'a encore été créée pour cet employé. Créez une nouvelle évaluation pour commencer."}
          </p>
          
          {evaluations.length === 0 && (
            <Button onClick={onCreateEvaluation} className="mt-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Créer la première évaluation
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
