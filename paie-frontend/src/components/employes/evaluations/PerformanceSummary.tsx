
import {
  Award,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Minus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employe } from "@/pages/GestionEmployes";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Evaluation } from "./types";

interface PerformanceSummaryProps {
  employe: Employe;
}

export const PerformanceSummary = ({ employe }: PerformanceSummaryProps) => {
  const evaluations = employe.evaluations || [];
  
  const getLastEvaluation = (): Evaluation | null => {
    if (!evaluations || evaluations.length === 0) return null;
    
    const completedEvals = evaluations.filter(e => e.status === "terminée");
    if (completedEvals.length === 0) return null;
    
    return completedEvals.sort((a, b) => {
      const dateA = new Date(a.dateRealisation || a.datePrevue).getTime();
      const dateB = new Date(b.dateRealisation || b.datePrevue).getTime();
      return dateB - dateA;
    })[0];
  };
  
  const getPreviousEvaluation = (): Evaluation | null => {
    if (!evaluations || evaluations.length <= 1) return null;
    
    const completedEvals = evaluations.filter(e => e.status === "terminée");
    if (completedEvals.length <= 1) return null;
    
    const sortedEvals = completedEvals.sort((a, b) => {
      const dateA = new Date(a.dateRealisation || a.datePrevue).getTime();
      const dateB = new Date(b.dateRealisation || b.datePrevue).getTime();
      return dateB - dateA;
    });
    
    return sortedEvals[1];
  };
  
  const lastEval = getLastEvaluation();
  const previousEval = getPreviousEvaluation();
  
  const getPerformanceChange = (): { value: number, trend: 'up' | 'down' | 'stable' } => {
    if (!lastEval?.noteGlobale || !previousEval?.noteGlobale) return { value: 0, trend: 'stable' };
    
    const change = lastEval.noteGlobale - previousEval.noteGlobale;
    return {
      value: Math.abs(change) * 20, // Convertir sur 100
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };
  
  const performanceChange = getPerformanceChange();
  
  const getPerformanceIcon = (score?: number) => {
    if (!score) return <AlertTriangle className="h-8 w-8 text-gray-400" />;
    
    if (score >= 80) return <Award className="h-8 w-8 text-amber-500" />;
    if (score >= 60) return <TrendingUp className="h-8 w-8 text-green-500" />;
    if (score >= 40) return <Minus className="h-8 w-8 text-blue-500" />;
    return <TrendingDown className="h-8 w-8 text-red-500" />;
  };
  
  const getPerformanceStatus = (score?: number) => {
    if (!score) return "Non évalué";
    
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Très bien";
    if (score >= 40) return "Satisfaisant";
    if (score >= 20) return "À améliorer";
    return "Insuffisant";
  };
  
  const getChangeTrend = () => {
    if (performanceChange.trend === 'up') {
      return <span className="flex items-center text-green-600"><ChevronUp className="h-4 w-4" /> +{performanceChange.value.toFixed(1)}%</span>;
    }
    if (performanceChange.trend === 'down') {
      return <span className="flex items-center text-red-600"><ChevronDown className="h-4 w-4" /> -{performanceChange.value.toFixed(1)}%</span>;
    }
    return <span className="text-gray-500">Stable</span>;
  };
  
  const getRisqueTurnoverBadge = (risque?: string) => {
    if (!risque) return <Badge variant="outline">Non évalué</Badge>;
    
    switch (risque) {
      case "faible":
        return <Badge className="bg-green-100 text-green-800">Faible</Badge>;
      case "moyen":
        return <Badge className="bg-amber-100 text-amber-800">Moyen</Badge>;
      case "élevé":
        return <Badge className="bg-red-100 text-red-800">Élevé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Performance globale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{employe.evaluationScore || 0}/100</p>
              <p className="text-sm text-muted-foreground">{getPerformanceStatus(employe.evaluationScore)}</p>
            </div>
            {getPerformanceIcon(employe.evaluationScore)}
          </div>
          <Progress value={employe.evaluationScore || 0} className="h-2 mt-4" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{getChangeTrend()}</p>
              <p className="text-sm text-muted-foreground">
                {previousEval ? "Depuis la dernière évaluation" : "Aucune donnée comparative"}
              </p>
            </div>
            <div>
              {performanceChange.trend === 'up' ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : performanceChange.trend === 'down' ? (
                <TrendingDown className="h-8 w-8 text-red-500" />
              ) : (
                <Minus className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Risque de turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{getRisqueTurnoverBadge(employe.risqueTurnover)}</p>
              <p className="text-sm text-muted-foreground">
                {lastEval ? `Basé sur l'évaluation du ${new Date(lastEval.dateRealisation || lastEval.datePrevue).toLocaleDateString('fr-FR')}` : "Non évalué"}
              </p>
            </div>
            <div>
              {employe.risqueTurnover === "élevé" ? (
                <AlertTriangle className="h-8 w-8 text-red-500" />
              ) : employe.risqueTurnover === "moyen" ? (
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              ) : (
                <Award className="h-8 w-8 text-green-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
