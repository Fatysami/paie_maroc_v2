
import { CalendarClock, Check, FileCheck, Award, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Evaluation, EvaluationStatus } from "./types";

interface EvaluationCardProps {
  evaluation: Evaluation;
  onView: (evaluation: Evaluation) => void;
}

export const EvaluationCard = ({ evaluation, onView }: EvaluationCardProps) => {
  const getStatusBadge = (status: EvaluationStatus) => {
    switch (status) {
      case 'planifiée':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planifiée</Badge>;
      case 'en-cours':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">En cours</Badge>;
      case 'terminée':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'annulée':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const getTypeIcon = () => {
    switch (evaluation.type) {
      case 'annuelle':
        return <FileCheck className="h-10 w-10 text-blue-500" />;
      case 'semestrielle':
        return <TrendingUp className="h-10 w-10 text-purple-500" />;  
      case 'trimestrielle':
        return <Award className="h-10 w-10 text-amber-500" />;
      case 'période-essai':
        return <AlertTriangle className="h-10 w-10 text-green-500" />;
      default:
        return <CalendarClock className="h-10 w-10 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getProgress = () => {
    if (evaluation.status === 'terminée') return 100;
    if (evaluation.status === 'annulée') return 0;
    if (evaluation.status === 'planifiée') return 10;
    
    // Pour les évaluations en cours, calculons la progression
    const critereTotal = evaluation.criteres.length;
    const critereEvalues = evaluation.criteres.filter(c => c.note !== undefined).length;
    
    return Math.round((critereEvalues / critereTotal) * 100);
  };

  const progressValue = getProgress();

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 flex flex-row items-center gap-4">
        {getTypeIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{evaluation.titre}</h3>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(evaluation.status)}
            <span className="text-sm text-muted-foreground">
              {evaluation.type.charAt(0).toUpperCase() + evaluation.type.slice(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Date prévue</p>
            <p className="font-medium">{formatDate(evaluation.datePrevue)}</p>
          </div>
          {evaluation.dateRealisation && (
            <div>
              <p className="text-muted-foreground">Date réalisation</p>
              <p className="font-medium">{formatDate(evaluation.dateRealisation)}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span className="font-medium">{progressValue}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>
        
        {evaluation.noteGlobale !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Note globale:</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg">
                {evaluation.noteGlobale.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/5</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => onView(evaluation)}>
          {evaluation.status === 'terminée' ? 'Voir détails' : 'Continuer'}
        </Button>
      </CardFooter>
    </Card>
  );
};
