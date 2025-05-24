
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, TrendingUp, UserCheck, Award, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Employe } from "@/pages/GestionEmployes";

interface DepartmentDistribution {
  name: string;
  count: number;
}

interface AnalyticsTabProps {
  employes: Employe[];
  topTalents: Employe[];
  departmentDistribution: DepartmentDistribution[];
  riskDistribution: {
    faible: number;
    moyen: number;
    eleve: number;
  };
  onRequestAIRecommendations: () => void;
}

const AnalyticsTab = ({
  employes,
  topTalents,
  departmentDistribution,
  riskDistribution,
  onRequestAIRecommendations
}: AnalyticsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl font-semibold">Analyses et prédictions IA</h2>
        <Button onClick={onRequestAIRecommendations} className="bg-indigo-600 hover:bg-indigo-700">
          <Brain size={16} className="mr-2" />
          Générer des recommandations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Répartition par département</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentDistribution.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <span>{dept.name}</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div
                        className="h-full bg-blue-primary rounded-full"
                        style={{
                          width: `${(dept.count / employes.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Talents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top talents identifiés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTalents.map((talent) => (
                <div key={talent.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{talent.prenom[0]}{talent.nom[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{talent.prenom} {talent.nom}</p>
                      <p className="text-sm text-muted-foreground">{talent.poste}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    <Award size={14} />
                    <span className="text-sm font-medium">{talent.evaluationScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Analyse des risques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-2xl font-bold text-green-700">{riskDistribution.faible}</p>
                  <p className="text-sm text-green-700">Risque faible</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <p className="text-2xl font-bold text-yellow-700">{riskDistribution.moyen}</p>
                  <p className="text-sm text-yellow-700">Risque moyen</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <p className="text-2xl font-bold text-red-700">{riskDistribution.eleve}</p>
                  <p className="text-sm text-red-700">Risque élevé</p>
                </div>
              </div>
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Recommandations IA</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <TrendingUp size={16} className="text-blue-500 mt-0.5" />
                    <span>Planifier des entretiens de rétention avec les 2 employés à risque élevé.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck size={16} className="text-blue-500 mt-0.5" />
                    <span>Développer les compétences en leadership pour les 3 talents identifiés.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances et prédictions</CardTitle>
          <CardDescription>
            Analyse IA des tendances RH et prédictions pour les prochains mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-500" />
                Insights sur la période
              </h3>
              <p className="text-sm text-muted-foreground">
                L'IA a analysé les données des 6 derniers mois et identifié les tendances suivantes:
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <TrendingUp size={16} className="text-blue-500 mt-0.5" />
                  <span>Les employés du département IT présentent le taux de satisfaction le plus élevé.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-500 mt-0.5" />
                  <span>Risque d'attrition dans le département Ventes à surveiller.</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
