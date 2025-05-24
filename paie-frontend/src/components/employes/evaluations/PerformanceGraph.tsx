
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Evaluation } from "./types";

interface PerformanceGraphProps {
  evaluations: Evaluation[];
}

export const PerformanceGraph = ({ evaluations }: PerformanceGraphProps) => {
  const [periode, setPeriode] = useState<"tout" | "12" | "6">("12");
  
  // Filtrer les évaluations terminées seulement
  const completeEvaluations = evaluations.filter(e => 
    e.status === "terminée" && e.noteGlobale !== undefined
  );
  
  // Trier par date
  const sortedEvaluations = [...completeEvaluations].sort((a, b) => 
    new Date(a.dateRealisation || a.datePrevue).getTime() - 
    new Date(b.dateRealisation || b.datePrevue).getTime()
  );
  
  // Filtrer selon la période sélectionnée
  const filteredEvaluations = sortedEvaluations.filter(e => {
    if (periode === "tout") return true;
    
    const evalDate = new Date(e.dateRealisation || e.datePrevue);
    const monthsAgo = parseInt(periode);
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
    
    return evalDate >= cutoffDate;
  });
  
  // Préparer les données pour le graphique
  const chartData = filteredEvaluations.map(e => {
    const date = new Date(e.dateRealisation || e.datePrevue);
    return {
      date: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      note: e.noteGlobale ? parseFloat((e.noteGlobale * 20).toFixed(1)) : 0,
      type: e.type
    };
  });
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "annuelle": return "#3b82f6";
      case "semestrielle": return "#8b5cf6";
      case "trimestrielle": return "#10b981";
      case "période-essai": return "#f59e0b";
      default: return "#6b7280";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle>Évolution des performances</CardTitle>
          <Select value={periode} onValueChange={(value) => setPeriode(value as "tout" | "12" | "6")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tout">Toute la période</SelectItem>
              <SelectItem value="12">12 derniers mois</SelectItem>
              <SelectItem value="6">6 derniers mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickCount={6} />
                <Tooltip 
                  formatter={(value: number) => [`${value}/100`, 'Score']}
                  labelFormatter={(label) => `Évaluation: ${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="note" 
                  name="Score de performance" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
